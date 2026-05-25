import { MerchantRepository } from '../repositories/merchant.repository';
import type { Merchant, CreateMerchantInput, UpdateMerchantInput } from '@/types/merchant.types';

// Simple phone number validation helper (Vietnam format)
const PHONE_REGEX = /^(0|84)(3|5|7|8|9)[0-9]{8}$/;

function validateMerchantData(data: Partial<CreateMerchantInput>) {
  if (data.name !== undefined && data.name.trim().length === 0) {
    throw new Error('Tên vựa hải sản không được để trống.');
  }

  if (data.phone !== undefined) {
    const cleanPhone = data.phone.trim();
    if (!PHONE_REGEX.test(cleanPhone)) {
      throw new Error('Số điện thoại không hợp lệ (yêu cầu định dạng số điện thoại Việt Nam).');
    }
  }

  if (data.commission_type !== undefined) {
    const validTypes = ['percentage', 'fixed', 'monthly_flat'];
    if (!validTypes.includes(data.commission_type)) {
      throw new Error('Loại hoa hồng không hợp lệ.');
    }
  }

  if (data.commission_value !== undefined && data.commission_value < 0) {
    throw new Error('Giá trị hoa hồng không được nhỏ hơn 0.');
  }

  if (data.monthly_flat_rate !== undefined && data.monthly_flat_rate < 0) {
    throw new Error('Mức phí cố định hàng tháng không được nhỏ hơn 0.');
  }
}

export const MerchantService = {
  getPublicMerchants: async (page: number = 1, limit: number = 10) => {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));
    const offset = (safePage - 1) * safeLimit;

    const [merchants, total] = await Promise.all([
      MerchantRepository.findAll({ isActive: true, limit: safeLimit, offset }),
      MerchantRepository.count({ isActive: true }),
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return {
      data: merchants,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
      },
    };
  },

  getMerchantDetails: async (id: number): Promise<Merchant | null> => {
    if (!id || id <= 0) {
      throw new Error('ID vựa hải sản không hợp lệ.');
    }
    return MerchantRepository.findById(id);
  },

  createMerchant: async (input: CreateMerchantInput): Promise<Merchant> => {
    validateMerchantData(input);
    
    // Chuẩn hóa dữ liệu đầu vào
    const data: CreateMerchantInput = {
      name: input.name.trim(),
      phone: input.phone.trim(),
      address: input.address?.trim() || null,
      is_active: input.is_active ?? true,
      commission_type: input.commission_type,
      commission_value: input.commission_value || 0,
      monthly_flat_rate: input.monthly_flat_rate || 0,
    };

    return MerchantRepository.create(data);
  },

  updateMerchant: async (id: number, input: UpdateMerchantInput): Promise<Merchant> => {
    if (!id || id <= 0) {
      throw new Error('ID vựa hải sản không hợp lệ.');
    }

    validateMerchantData(input);

    const updateData: UpdateMerchantInput = {};
    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.phone !== undefined) updateData.phone = input.phone.trim();
    if (input.address !== undefined) updateData.address = input.address?.trim() || null;
    if (input.is_active !== undefined) updateData.is_active = input.is_active;
    if (input.commission_type !== undefined) updateData.commission_type = input.commission_type;
    if (input.commission_value !== undefined) updateData.commission_value = input.commission_value;
    if (input.monthly_flat_rate !== undefined) updateData.monthly_flat_rate = input.monthly_flat_rate;

    const updated = await MerchantRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Không tìm thấy vựa hải sản để cập nhật hoặc vựa đã bị xóa.');
    }

    return updated;
  },

  deleteMerchant: async (id: number): Promise<void> => {
    if (!id || id <= 0) {
      throw new Error('ID vựa hải sản không hợp lệ.');
    }

    const success = await MerchantRepository.softDelete(id);
    if (!success) {
      throw new Error('Không tìm thấy vựa hải sản để xóa hoặc vựa đã bị xóa trước đó.');
    }
  }
};
