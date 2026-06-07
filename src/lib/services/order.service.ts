import sql from '../db/index';
import { OrderRepository } from '../repositories/order.repository';
import { MerchantRepository } from '../repositories/merchant.repository';
import { ProductRepository } from '../repositories/product.repository';
import { ReferralRepository } from '../repositories/referral.repository';
import { ReferralService } from './referral.service';
import { EmailService } from './email.service';
import { Order, CreateOrderInput } from '../../types/order.types';

export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private merchantRepo: MerchantRepository,
    private productRepo: ProductRepository,
    private referralRepo: ReferralRepository,
    private referralService: ReferralService,
    private emailService: EmailService
  ) {}

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      throw new Error(`Đơn hàng với ID ${id} không tồn tại`);
    }
    return order;
  }

  async getOrdersByMerchant(merchantId: number): Promise<Order[]> {
    const merchant = await this.merchantRepo.findById(merchantId);
    if (!merchant) {
      throw new Error(`Thương lái với ID ${merchantId} không tồn tại`);
    }
    return this.orderRepo.findByMerchantId(merchantId);
  }

  async createOrder(input: CreateOrderInput): Promise<Order> {
    if (!input.items || input.items.length === 0) {
      throw new Error('Đơn hàng phải chứa ít nhất một sản phẩm');
    }

    // Verify merchant exists and is active
    const merchant = await this.merchantRepo.findById(input.merchant_id);
    if (!merchant) {
      throw new Error(`Thương lái với ID ${input.merchant_id} không tồn tại`);
    }
    if (!merchant.is_active) {
      throw new Error(`Thương lái với ID ${input.merchant_id} hiện không hoạt động`);
    }

    // Validate and calculate total order value
    let totalValue = 0;
    const validatedItems: { product_id: number; quantity: number; unit_price: number }[] = [];

    for (const item of input.items) {
      if (item.quantity <= 0) {
        throw new Error('Số lượng sản phẩm phải lớn hơn 0');
      }
      if (item.unit_price < 0) {
        throw new Error('Đơn giá sản phẩm không được nhỏ hơn 0');
      }

      const product = await this.productRepo.findById(item.product_id);
      if (!product) {
        throw new Error(`Sản phẩm với ID ${item.product_id} không tồn tại`);
      }
      if (product.merchant_id !== input.merchant_id) {
        throw new Error(`Sản phẩm ID ${item.product_id} không thuộc về vựa này`);
      }

      totalValue += item.quantity * item.unit_price;
      validatedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      });
    }

    const orderStatus = input.status || 'pending';

    // Perform database operations in a transaction
    const order = await sql.begin(async (tx) => {
      // 1. Create order
      const newOrder = await this.orderRepo.create(
        input.merchant_id,
        totalValue,
        orderStatus,
        input.buyer_name,
        input.buyer_phone,
        input.buyer_address,
        input.payment_method,
        input.notes,
        tx
      );

      // 2. Create order items
      for (const item of validatedItems) {
        await this.orderRepo.createItem(newOrder.id, item.product_id, item.quantity, item.unit_price, tx);
      }

      return newOrder;
    });

    // Send notifications
    const recipient = `merchant_${merchant.id}@example.com`;
    const subject = `Đơn hàng mới #${order.id}`;
    const emailBody = `ĐƠN HÀNG MỚI #${order.id}
============================
Khách hàng: ${input.buyer_name}
SĐT: ${input.buyer_phone}
Địa chỉ: ${input.buyer_address}
Ghi chú: ${input.notes || 'Không có'}
Sản phẩm:
${validatedItems.map(item => `  - Sản phẩm ID ${item.product_id}: ${item.quantity} x ${item.unit_price.toLocaleString('vi-VN')} đ`).join('\n')}
Tổng giá trị: ${totalValue.toLocaleString('vi-VN')} VND
Phương thức: COD (Thanh toán khi nhận)
============================
Vui lòng xác nhận và xử lý đơn hàng.`;

    // Print order details and email content to stdout (mock log)
    console.log(`[Order Service] Đơn hàng được tạo thành công: ID: ${order.id}, Merchant ID: ${order.merchant_id}, Khách: ${input.buyer_name} (${input.buyer_phone}), Value: ${totalValue}`);
    console.log(`[Email Mock Log]\nTo: ${recipient}\nSubject: ${subject}\nBody:\n${emailBody}\n[End of Email Mock Log]`);

    // Send real email if SMTP configured
    await this.emailService.sendEmail(recipient, subject, emailBody);

    return order;
  }

  async updateOrderStatus(
    id: number,
    status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled'
  ): Promise<Order> {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      throw new Error(`Đơn hàng với ID ${id} không tồn tại`);
    }

    // Business rule: Cannot change status of completed or cancelled orders
    if (order.status === 'completed' || order.status === 'cancelled') {
      throw new Error(`Không thể thay đổi trạng thái của đơn hàng đã ${order.status === 'completed' ? 'hoàn thành' : 'hủy bỏ'}`);
    }

    // Run order status transition in transaction
    const updatedOrder = await sql.begin(async (tx) => {
      const updated = await this.orderRepo.updateStatus(id, status, tx);
      if (!updated) {
        throw new Error(`Cập nhật trạng thái đơn hàng ID ${id} thất bại`);
      }

      // On order completion (transition to completed): Calculate referral commission and create/update logs
      if (status === 'completed') {
        const merchant = await this.merchantRepo.findById(order.merchant_id, tx);
        if (!merchant) {
          throw new Error(`Thương lái của đơn hàng ID ${order.merchant_id} không tồn tại`);
        }

        const items = await this.orderRepo.findItemsByOrderId(id, tx);
        
        // Find existing referral logs for this order
        const existingLogs = await this.referralRepo.findByOrderId(id, tx);

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const product = await this.productRepo.findById(item.product_id, tx);
          if (!product) {
            throw new Error(`Sản phẩm ID ${item.product_id} không tồn tại`);
          }

          const isFirstItem = i === 0;
          const calculatedCommission = this.referralService.calculateCommission(
            merchant,
            product,
            item.quantity,
            item.unit_price,
            isFirstItem
          );

          const existingLog = existingLogs.find(log => log.product_id === item.product_id);

          if (existingLog) {
            // Update existing referral log
            await tx`
              UPDATE referral_logs
              SET status = 'completed',
                  calculated_commission = ${calculatedCommission},
                  order_value = ${item.quantity * item.unit_price},
                  updated_at = NOW()
              WHERE id = ${existingLog.id}
            `;
          } else {
            // Create a new completed referral log
            await this.referralRepo.create({
              product_id: item.product_id,
              merchant_id: order.merchant_id,
              order_id: id,
              buyer_phone: order.buyer_phone || null,
              order_value: item.quantity * item.unit_price,
              calculated_commission: calculatedCommission,
              status: 'completed',
            }, tx);
          }
        }
      } else if (status === 'cancelled') {
        // Transition associated referral logs to cancelled
        await this.referralRepo.updateStatusByOrderId(id, 'cancelled', tx);
      }

      return updated;
    });

    return updatedOrder;
  }
}
export default OrderService;
