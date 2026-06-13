import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReferralService } from '../referral.service';
import { ReferralRepository } from '../../repositories/referral.repository';
import { MerchantRepository } from '../../repositories/merchant.repository';
import { ProductRepository } from '../../repositories/product.repository';

vi.mock('../../db/index', () => {
  const mockSql = Object.assign(vi.fn(), {
    begin: vi.fn(async (cb) => await cb(mockSql)),
  });
  return { default: mockSql };
});

describe('ReferralService', () => {
  let mockReferralRepo: {
    findById: ReturnType<typeof vi.fn>;
    findByOrderId: ReturnType<typeof vi.fn>;
    findByMerchantId: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    updateStatus: ReturnType<typeof vi.fn>;
    updateStatusByOrderId: ReturnType<typeof vi.fn>;
    softDelete: ReturnType<typeof vi.fn>;
  };
  let mockMerchantRepo: {
    findById: ReturnType<typeof vi.fn>;
  };
  let mockProductRepo: {
    findById: ReturnType<typeof vi.fn>;
  };
  let service: ReferralService;

  beforeEach(() => {
    mockReferralRepo = {
      findById: vi.fn(),
      findByOrderId: vi.fn(),
      findByMerchantId: vi.fn(),
      findAll: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn(),
      updateStatusByOrderId: vi.fn(),
      softDelete: vi.fn(),
    };
    mockMerchantRepo = { findById: vi.fn() };
    mockProductRepo = { findById: vi.fn() };
    service = new ReferralService(
      mockReferralRepo as unknown as ReferralRepository,
      mockMerchantRepo as unknown as MerchantRepository,
      mockProductRepo as unknown as ProductRepository
    );
  });

  describe('getReferralLogById', () => {
    it('should return referral log when found', async () => {
      const log = { id: 1, merchant_id: 1, product_id: 1 };
      mockReferralRepo.findById.mockResolvedValue(log);
      const result = await service.getReferralLogById(1);
      expect(result).toEqual(log);
    });

    it('should throw error when log not found', async () => {
      mockReferralRepo.findById.mockResolvedValue(null);
      await expect(service.getReferralLogById(99)).rejects.toThrow(
        'Nhật ký đối soát với ID 99 không tồn tại'
      );
    });
  });

  describe('getReferralLogsByMerchant', () => {
    it('should return referral logs when merchant exists', async () => {
      const logs = [{ id: 1, merchant_id: 1 }, { id: 2, merchant_id: 1 }];
      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: true });
      mockReferralRepo.findByMerchantId.mockResolvedValue(logs);

      const result = await service.getReferralLogsByMerchant(1);
      expect(result).toEqual(logs);
    });

    it('should throw error when merchant not found', async () => {
      mockMerchantRepo.findById.mockResolvedValue(null);
      await expect(service.getReferralLogsByMerchant(99)).rejects.toThrow(
        'Thương lái với ID 99 không tồn tại'
      );
    });
  });

  describe('getAllReferralLogs', () => {
    it('should return all referral logs', async () => {
      const logs = [{ id: 1 }, { id: 2 }];
      mockReferralRepo.findAll.mockResolvedValue(logs);
      const result = await service.getAllReferralLogs();
      expect(result).toEqual(logs);
      expect(mockReferralRepo.findAll).toHaveBeenCalled();
    });
  });

  describe('calculateCommission', () => {
    const defaultProduct = {
      id: 1,
      merchant_id: 1,
      name: 'Tôm',
      slug: 'tom',
      meta_description: null,
      price: 100000,
      original_price: null,
      category: null,
      description: null,
      image_url: null,
      is_auto_listed: true,
      specific_commission_rate: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    const defaultMerchant = {
      id: 1,
      name: 'Vựa A',
      phone: '0912345678',
      address: null,
      is_active: true,
      commission_type: 'percentage' as const,
      commission_value: 5.00,
      monthly_flat_rate: 0.00,
      user_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    it('should calculate percentage commission using merchant rate', () => {
      const merchant = { ...defaultMerchant, commission_type: 'percentage' as const, commission_value: 5 };
      const product = { ...defaultProduct, specific_commission_rate: null };

      const commission = service.calculateCommission(merchant, product, 2, 100000);
      // 2 * 100,000 * 5% = 10,000
      expect(commission).toBe(10000);
    });

    it('should calculate percentage commission using product specific rate when defined', () => {
      const merchant = { ...defaultMerchant, commission_type: 'percentage' as const, commission_value: 5 };
      const product = { ...defaultProduct, specific_commission_rate: 8 };

      const commission = service.calculateCommission(merchant, product, 2, 100000);
      // 2 * 100,000 * 8% = 16,000
      expect(commission).toBe(16000);
    });

    it('should calculate fixed commission correctly: flat fee for first item, zero for others', () => {
      const merchant = { ...defaultMerchant, commission_type: 'fixed' as const, commission_value: 50000 };
      const product = defaultProduct;

      // First item gets full fixed commission
      const firstItemComm = service.calculateCommission(merchant, product, 2, 100000, true);
      expect(firstItemComm).toBe(50000);

      // Subsequent items get 0.00
      const secondItemComm = service.calculateCommission(merchant, product, 1, 150000, false);
      expect(secondItemComm).toBe(0);
    });

    it('should calculate monthly flat commission as 0.00', () => {
      const merchant = { ...defaultMerchant, commission_type: 'monthly_flat' as const, commission_value: 0, monthly_flat_rate: 1000000 };
      const product = defaultProduct;

      const firstItemComm = service.calculateCommission(merchant, product, 2, 100000, true);
      expect(firstItemComm).toBe(0);

      const secondItemComm = service.calculateCommission(merchant, product, 1, 150000, false);
      expect(secondItemComm).toBe(0);
    });

    it('should return 0 for unknown commission type', () => {
      const merchant = { ...defaultMerchant, commission_type: 'unknown_type' as never, commission_value: 10 };
      const product = defaultProduct;
      const commission = service.calculateCommission(merchant, product, 1, 100000);
      expect(commission).toBe(0);
    });
  });

  describe('createReferralLog', () => {
    it('should create successfully with valid parameters', async () => {
      const input = {
        product_id: 1,
        merchant_id: 1,
        buyer_phone: '0912345678',
        order_value: 200000,
        calculated_commission: 10000,
      };

      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: true });
      mockProductRepo.findById.mockResolvedValue({ id: 1 });
      mockReferralRepo.create.mockResolvedValue({ id: 100, ...input });

      const result = await service.createReferralLog(input);
      expect(result.id).toBe(100);
      expect(mockReferralRepo.create).toHaveBeenCalledWith(input);
    });

    it('should throw error when merchant not found', async () => {
      mockMerchantRepo.findById.mockResolvedValue(null);
      await expect(service.createReferralLog({
        product_id: 1, merchant_id: 99, calculated_commission: 0,
      })).rejects.toThrow('Thương lái với ID 99 không tồn tại');
    });

    it('should throw error when merchant is inactive', async () => {
      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: false });
      await expect(service.createReferralLog({
        product_id: 1, merchant_id: 1, calculated_commission: 0,
      })).rejects.toThrow('Thương lái với ID 1 hiện không hoạt động');
    });

    it('should throw error when product not found', async () => {
      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: true });
      mockProductRepo.findById.mockResolvedValue(null);
      await expect(service.createReferralLog({
        product_id: 99, merchant_id: 1, calculated_commission: 0,
      })).rejects.toThrow('Sản phẩm với ID 99 không tồn tại');
    });

    it('should throw error when commission < 0', async () => {
      const input = {
        product_id: 1,
        merchant_id: 1,
        calculated_commission: -10,
      };

      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: true });
      mockProductRepo.findById.mockResolvedValue({ id: 1 });

      await expect(service.createReferralLog(input))
        .rejects.toThrow('Số tiền hoa hồng không được nhỏ hơn 0');
    });
  });

  describe('updateReferralLogStatus', () => {
    it('should update status successfully', async () => {
      const log = { id: 1, status: 'pending' };
      mockReferralRepo.findById.mockResolvedValue(log);
      mockReferralRepo.updateStatus.mockResolvedValue({ ...log, status: 'completed' });

      const result = await service.updateReferralLogStatus(1, 'completed');
      expect(result.status).toBe('completed');
      expect(mockReferralRepo.updateStatus).toHaveBeenCalledWith(1, 'completed');
    });

    it('should throw error when log not found', async () => {
      mockReferralRepo.findById.mockResolvedValue(null);
      await expect(service.updateReferralLogStatus(99, 'completed')).rejects.toThrow(
        'Nhật ký đối soát với ID 99 không tồn tại'
      );
    });

    it('should throw error when update returns null', async () => {
      mockReferralRepo.findById.mockResolvedValue({ id: 1, status: 'pending' });
      mockReferralRepo.updateStatus.mockResolvedValue(null);
      await expect(service.updateReferralLogStatus(1, 'completed')).rejects.toThrow(
        'Cập nhật trạng thái nhật ký đối soát ID 1 thất bại'
      );
    });
  });
});
