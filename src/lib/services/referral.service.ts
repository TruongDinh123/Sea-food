import { ReferralRepository } from '../repositories/referral.repository';
import { MerchantRepository } from '../repositories/merchant.repository';
import { ProductRepository } from '../repositories/product.repository';
import { ReferralLog, CreateReferralLogInput } from '../../types/referral.types';
import { Merchant } from '../../types/merchant.types';
import { Product } from '../../types/product.types';

export class ReferralService {
  constructor(
    private referralRepo: ReferralRepository,
    private merchantRepo: MerchantRepository,
    private productRepo: ProductRepository
  ) {}

  async getReferralLogById(id: number): Promise<ReferralLog> {
    const log = await this.referralRepo.findById(id);
    if (!log) {
      throw new Error(`Nhật ký đối soát với ID ${id} không tồn tại`);
    }
    return log;
  }

  async getReferralLogsByMerchant(merchantId: number): Promise<ReferralLog[]> {
    const merchant = await this.merchantRepo.findById(merchantId);
    if (!merchant) {
      throw new Error(`Thương lái với ID ${merchantId} không tồn tại`);
    }
    return this.referralRepo.findByMerchantId(merchantId);
  }

  async getAllReferralLogs(): Promise<ReferralLog[]> {
    return this.referralRepo.findAll();
  }

  async createReferralLog(input: CreateReferralLogInput): Promise<ReferralLog> {
    const merchant = await this.merchantRepo.findById(input.merchant_id);
    if (!merchant) {
      throw new Error(`Thương lái với ID ${input.merchant_id} không tồn tại`);
    }
    if (!merchant.is_active) {
      throw new Error(`Thương lái với ID ${input.merchant_id} hiện không hoạt động`);
    }

    const product = await this.productRepo.findById(input.product_id);
    if (!product) {
      throw new Error(`Sản phẩm với ID ${input.product_id} không tồn tại`);
    }

    if (input.calculated_commission < 0) {
      throw new Error('Số tiền hoa hồng không được nhỏ hơn 0');
    }

    return this.referralRepo.create(input);
  }

  async updateReferralLogStatus(id: number, status: 'pending' | 'completed' | 'cancelled'): Promise<ReferralLog> {
    const log = await this.referralRepo.findById(id);
    if (!log) {
      throw new Error(`Nhật ký đối soát với ID ${id} không tồn tại`);
    }
    const updated = await this.referralRepo.updateStatus(id, status);
    if (!updated) {
      throw new Error(`Cập nhật trạng thái nhật ký đối soát ID ${id} thất bại`);
    }
    return updated;
  }

  calculateCommission(
    merchant: Merchant,
    product: Product,
    quantity: number,
    unitPrice: number,
    isFirstItem: boolean = true
  ): number {
    const itemValue = quantity * unitPrice;

    if (merchant.commission_type === 'percentage') {
      const rate = product.specific_commission_rate !== null
        ? product.specific_commission_rate
        : merchant.commission_value;
      return Number((itemValue * (rate / 100)).toFixed(2));
    }

    if (merchant.commission_type === 'fixed') {
      // commission_value is a flat rate per completed order
      // Assign it to the first item, subsequent items get 0.00
      return isFirstItem ? Number(merchant.commission_value) : 0.00;
    }

    if (merchant.commission_type === 'monthly_flat') {
      return 0.00;
    }

    return 0.00;
  }
}
