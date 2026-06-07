import { MerchantRepository } from '../repositories/merchant.repository';
import { Merchant, CreateMerchantInput, UpdateMerchantInput } from '../../types/merchant.types';

export class MerchantService {
  constructor(private merchantRepo: MerchantRepository) {}

  async getMerchantById(id: number): Promise<Merchant> {
    const merchant = await this.merchantRepo.findById(id);
    if (!merchant) {
      throw new Error(`Thương lái với ID ${id} không tồn tại`);
    }
    if (!merchant.is_active) {
      throw new Error(`Thương lái với ID ${id} hiện không hoạt động`);
    }
    return merchant;
  }

  async getMerchantByUserId(userId: string): Promise<Merchant> {
    const merchant = await this.merchantRepo.findByUserId(userId);
    if (!merchant) {
      throw new Error(`Thương lái với User ID ${userId} không tồn tại`);
    }
    return merchant;
  }

  async getAllActiveMerchants(): Promise<Merchant[]> {
    const merchants = await this.merchantRepo.findAll();
    return merchants.filter(m => m.is_active);
  }

  async registerMerchant(input: CreateMerchantInput): Promise<Merchant> {
    if (!input.name || input.name.trim() === '') {
      throw new Error('Tên thương lái không được để trống');
    }
    if (!input.phone || input.phone.trim() === '') {
      throw new Error('Số điện thoại không được để trống');
    }

    const phoneRegex = /^\+?[0-9]{9,15}$/;
    if (!phoneRegex.test(input.phone.trim())) {
      throw new Error('Số điện thoại không hợp lệ');
    }

    return this.merchantRepo.create({
      ...input,
      name: input.name.trim(),
      phone: input.phone.trim(),
    });
  }

  async updateMerchant(id: number, input: UpdateMerchantInput): Promise<Merchant> {
    const merchant = await this.merchantRepo.findById(id);
    if (!merchant) {
      throw new Error(`Thương lái với ID ${id} không tồn tại`);
    }

    if (input.name !== undefined && input.name.trim() === '') {
      throw new Error('Tên thương lái không được để trống');
    }
    if (input.phone !== undefined) {
      if (input.phone.trim() === '') {
        throw new Error('Số điện thoại không được để trống');
      }
      const phoneRegex = /^\+?[0-9]{9,15}$/;
      if (!phoneRegex.test(input.phone.trim())) {
        throw new Error('Số điện thoại không hợp lệ');
      }
    }

    const updated = await this.merchantRepo.update(id, {
      ...input,
      name: input.name !== undefined ? input.name.trim() : undefined,
      phone: input.phone !== undefined ? input.phone.trim() : undefined,
    });

    if (!updated) {
      throw new Error(`Cập nhật thương lái ID ${id} thất bại`);
    }
    return updated;
  }

  async deleteMerchant(id: number): Promise<boolean> {
    const merchant = await this.merchantRepo.findById(id);
    if (!merchant) {
      throw new Error(`Thương lái với ID ${id} không tồn tại`);
    }
    return this.merchantRepo.softDelete(id);
  }
}
