import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../order.service';
import { OrderRepository } from '../../repositories/order.repository';
import { MerchantRepository } from '../../repositories/merchant.repository';
import { ProductRepository } from '../../repositories/product.repository';
import { ReferralRepository } from '../../repositories/referral.repository';
import { ReferralService } from '../referral.service';
import { EmailService } from '../email.service';

vi.mock('../../db/index', () => {
  const mockSql = Object.assign(vi.fn(), {
    begin: vi.fn(async (cb) => await cb(mockSql)),
  });
  return { default: mockSql };
});

describe('OrderService', () => {
  let mockOrderRepo: {
    findById: ReturnType<typeof vi.fn>;
    findByMerchantId: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    createItem: ReturnType<typeof vi.fn>;
    findItemsByOrderId: ReturnType<typeof vi.fn>;
    updateStatus: ReturnType<typeof vi.fn>;
    softDelete: ReturnType<typeof vi.fn>;
  };
  let mockMerchantRepo: {
    findById: ReturnType<typeof vi.fn>;
  };
  let mockProductRepo: {
    findById: ReturnType<typeof vi.fn>;
  };
  let mockReferralRepo: {
    findById: ReturnType<typeof vi.fn>;
    findByOrderId: ReturnType<typeof vi.fn>;
    findByMerchantId: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    updateStatus: ReturnType<typeof vi.fn>;
    updateStatusByOrderId: ReturnType<typeof vi.fn>;
  };
  let mockReferralService: {
    calculateCommission: ReturnType<typeof vi.fn>;
  };
  let mockEmailService: {
    sendEmail: ReturnType<typeof vi.fn>;
  };
  let service: OrderService;

  beforeEach(() => {
    mockOrderRepo = {
      findById: vi.fn(),
      findByMerchantId: vi.fn(),
      create: vi.fn(),
      createItem: vi.fn(),
      findItemsByOrderId: vi.fn(),
      updateStatus: vi.fn(),
      softDelete: vi.fn(),
    };
    mockMerchantRepo = { findById: vi.fn() };
    mockProductRepo = { findById: vi.fn() };
    mockReferralRepo = {
      findById: vi.fn(),
      findByOrderId: vi.fn(),
      findByMerchantId: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn(),
      updateStatusByOrderId: vi.fn(),
    };
    mockReferralService = { calculateCommission: vi.fn() };
    mockEmailService = { sendEmail: vi.fn() };

    service = new OrderService(
      mockOrderRepo as unknown as OrderRepository,
      mockMerchantRepo as unknown as MerchantRepository,
      mockProductRepo as unknown as ProductRepository,
      mockReferralRepo as unknown as ReferralRepository,
      mockReferralService as unknown as ReferralService,
      mockEmailService as unknown as EmailService
    );
  });

  describe('getOrderById', () => {
    it('should return order when found', async () => {
      const order = { id: 1, merchant_id: 1, status: 'pending' };
      mockOrderRepo.findById.mockResolvedValue(order);
      const result = await service.getOrderById(1);
      expect(result).toEqual(order);
    });

    it('should throw error when order not found', async () => {
      mockOrderRepo.findById.mockResolvedValue(null);
      await expect(service.getOrderById(999)).rejects.toThrow('Đơn hàng với ID 999 không tồn tại');
    });
  });

  describe('getOrdersByMerchant', () => {
    it('should return orders when merchant exists', async () => {
      const orders = [{ id: 1 }, { id: 2 }];
      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: true });
      mockOrderRepo.findByMerchantId.mockResolvedValue(orders);
      const result = await service.getOrdersByMerchant(1);
      expect(result).toEqual(orders);
    });

    it('should throw error when merchant not found', async () => {
      mockMerchantRepo.findById.mockResolvedValue(null);
      await expect(service.getOrdersByMerchant(99)).rejects.toThrow('Thương lái với ID 99 không tồn tại');
    });
  });

  describe('createOrder', () => {
    it('should create order successfully and send email notification', async () => {
      const merchant = { id: 1, name: 'Vựa Cà Mau', is_active: true };
      const product1 = { id: 10, merchant_id: 1, name: 'Cua', price: 100 };
      const product2 = { id: 11, merchant_id: 1, name: 'Tôm', price: 50 };

      mockMerchantRepo.findById.mockResolvedValue(merchant);
      mockProductRepo.findById.mockImplementation(async (id: number) => {
        if (id === 10) return product1;
        if (id === 11) return product2;
        return null;
      });

      const orderInput = {
        merchant_id: 1,
        items: [
          { product_id: 10, quantity: 2, unit_price: 100 },
          { product_id: 11, quantity: 3, unit_price: 50 },
        ],
      };

      const mockOrder = { id: 99, merchant_id: 1, status: 'pending', order_value: 350 };
      mockOrderRepo.create.mockResolvedValue(mockOrder);
      mockEmailService.sendEmail.mockResolvedValue(true);

      const result = await service.createOrder(orderInput);

      expect(result).toEqual(mockOrder);
      expect(mockOrderRepo.create).toHaveBeenCalledWith(
        1,
        350,
        'pending',
        undefined,
        undefined,
        undefined,
        undefined,
        expect.any(Function)
      );
      expect(mockOrderRepo.createItem).toHaveBeenCalledTimes(2);
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'merchant_1@example.com',
        expect.stringContaining('Đơn hàng mới #99'),
        expect.stringContaining('350')
      );
    });

    it('should throw error when items array is empty', async () => {
      await expect(service.createOrder({ merchant_id: 1, items: [] }))
        .rejects.toThrow('Đơn hàng phải chứa ít nhất một sản phẩm');
    });

    it('should throw error when merchant does not exist', async () => {
      mockMerchantRepo.findById.mockResolvedValue(null);
      await expect(service.createOrder({
        merchant_id: 99,
        items: [{ product_id: 10, quantity: 1, unit_price: 100 }],
      })).rejects.toThrow('Thương lái với ID 99 không tồn tại');
    });

    it('should throw error when merchant is inactive', async () => {
      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: false });
      await expect(service.createOrder({
        merchant_id: 1,
        items: [{ product_id: 10, quantity: 1, unit_price: 100 }],
      })).rejects.toThrow('Thương lái với ID 1 hiện không hoạt động');
    });

    it('should throw error when quantity <= 0', async () => {
      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: true });
      await expect(service.createOrder({
        merchant_id: 1,
        items: [{ product_id: 10, quantity: 0, unit_price: 100 }],
      })).rejects.toThrow('Số lượng sản phẩm phải lớn hơn 0');
    });

    it('should throw error when unit_price < 0', async () => {
      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: true });
      await expect(service.createOrder({
        merchant_id: 1,
        items: [{ product_id: 10, quantity: 1, unit_price: -1 }],
      })).rejects.toThrow('Đơn giá sản phẩm không được nhỏ hơn 0');
    });

    it('should throw error when product does not exist', async () => {
      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: true });
      mockProductRepo.findById.mockResolvedValue(null);
      await expect(service.createOrder({
        merchant_id: 1,
        items: [{ product_id: 999, quantity: 1, unit_price: 100 }],
      })).rejects.toThrow('Sản phẩm với ID 999 không tồn tại');
    });

    it('should throw error when product does not belong to merchant', async () => {
      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: true });
      mockProductRepo.findById.mockResolvedValue({ id: 10, merchant_id: 2, name: 'Sản phẩm vựa khác' });

      await expect(
        service.createOrder({
          merchant_id: 1,
          items: [{ product_id: 10, quantity: 1, unit_price: 100 }],
        })
      ).rejects.toThrow('Sản phẩm ID 10 không thuộc về vựa này');
    });
  });

  describe('updateOrderStatus', () => {
    it('should throw error if order not found', async () => {
      mockOrderRepo.findById.mockResolvedValue(null);
      await expect(service.updateOrderStatus(999, 'processing')).rejects.toThrow(
        'Đơn hàng với ID 999 không tồn tại'
      );
    });

    it('should throw error if order status is already completed', async () => {
      mockOrderRepo.findById.mockResolvedValue({ id: 99, status: 'completed' });

      await expect(service.updateOrderStatus(99, 'processing'))
        .rejects.toThrow('Không thể thay đổi trạng thái của đơn hàng đã hoàn thành');
    });

    it('should throw error if order status is already cancelled', async () => {
      mockOrderRepo.findById.mockResolvedValue({ id: 99, status: 'cancelled' });

      await expect(service.updateOrderStatus(99, 'completed'))
        .rejects.toThrow('Không thể thay đổi trạng thái của đơn hàng đã hủy bỏ');
    });

    it('should transition referral logs to completed when order status transitions to completed (no existing logs)', async () => {
      const order = { id: 99, merchant_id: 1, status: 'pending', order_value: 200, buyer_phone: null };
      const merchant = { id: 1, name: 'Vựa Cà Mau', commission_type: 'percentage', commission_value: 5 };
      const items = [
        { product_id: 10, quantity: 2, unit_price: 100 },
      ];
      const product = { id: 10, merchant_id: 1, specific_commission_rate: null };

      mockOrderRepo.findById.mockResolvedValue(order);
      mockOrderRepo.updateStatus.mockResolvedValue({ ...order, status: 'completed' });
      mockMerchantRepo.findById.mockResolvedValue(merchant);
      mockOrderRepo.findItemsByOrderId.mockResolvedValue(items);
      mockProductRepo.findById.mockResolvedValue(product);
      mockReferralRepo.findByOrderId.mockResolvedValue([]);
      mockReferralService.calculateCommission.mockReturnValue(10); // 200 * 5% = 10

      const result = await service.updateOrderStatus(99, 'completed');

      expect(result.status).toBe('completed');
      expect(mockOrderRepo.updateStatus).toHaveBeenCalledWith(99, 'completed', expect.any(Function));
      expect(mockReferralRepo.create).toHaveBeenCalledWith({
        product_id: 10,
        merchant_id: 1,
        order_id: 99,
        buyer_phone: null,
        order_value: 200,
        calculated_commission: 10,
        status: 'completed',
      }, expect.any(Function));
    });

    it('should update existing referral log when one already exists for product', async () => {
      const order = { id: 99, merchant_id: 1, status: 'pending', order_value: 200, buyer_phone: null };
      const merchant = { id: 1, name: 'Vựa Cà Mau', commission_type: 'percentage', commission_value: 5 };
      const items = [{ product_id: 10, quantity: 2, unit_price: 100 }];
      const product = { id: 10, merchant_id: 1, specific_commission_rate: null };
      const existingLog = { id: 55, product_id: 10, merchant_id: 1, order_id: 99, status: 'pending' };

      mockOrderRepo.findById.mockResolvedValue(order);
      mockOrderRepo.updateStatus.mockResolvedValue({ ...order, status: 'completed' });
      mockMerchantRepo.findById.mockResolvedValue(merchant);
      mockOrderRepo.findItemsByOrderId.mockResolvedValue(items);
      mockProductRepo.findById.mockResolvedValue(product);
      mockReferralRepo.findByOrderId.mockResolvedValue([existingLog]);
      mockReferralService.calculateCommission.mockReturnValue(10);

      const result = await service.updateOrderStatus(99, 'completed');
      expect(result.status).toBe('completed');
      // Existing log scenario: referralRepo.create should NOT be called
      expect(mockReferralRepo.create).not.toHaveBeenCalled();
    });

    it('should transition referral logs to cancelled when order status transitions to cancelled', async () => {
      const order = { id: 99, merchant_id: 1, status: 'pending', order_value: 200 };
      mockOrderRepo.findById.mockResolvedValue(order);
      mockOrderRepo.updateStatus.mockResolvedValue({ ...order, status: 'cancelled' });

      const result = await service.updateOrderStatus(99, 'cancelled');

      expect(result.status).toBe('cancelled');
      expect(mockReferralRepo.updateStatusByOrderId).toHaveBeenCalledWith(99, 'cancelled', expect.any(Function));
    });

    it('should update to processing status successfully', async () => {
      const order = { id: 99, merchant_id: 1, status: 'pending', order_value: 200 };
      mockOrderRepo.findById.mockResolvedValue(order);
      mockOrderRepo.updateStatus.mockResolvedValue({ ...order, status: 'processing' });

      const result = await service.updateOrderStatus(99, 'processing');
      expect(result.status).toBe('processing');
    });
  });
});
