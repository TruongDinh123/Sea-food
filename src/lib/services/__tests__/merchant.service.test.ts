import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MerchantService } from '../merchant.service';
import { MerchantRepository } from '../../repositories/merchant.repository';

vi.mock('../../db/index', () => {
  const mockSql = Object.assign(vi.fn(), {
    begin: vi.fn(async (cb) => await cb(mockSql)),
  });
  return { default: mockSql };
});

describe('MerchantService', () => {
  let mockMerchantRepo: {
    findById: ReturnType<typeof vi.fn>;
    findByUserId: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    softDelete: ReturnType<typeof vi.fn>;
  };
  let service: MerchantService;

  beforeEach(() => {
    mockMerchantRepo = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      softDelete: vi.fn(),
    };
    service = new MerchantService(mockMerchantRepo as unknown as MerchantRepository);
  });

  describe('getMerchantById', () => {
    it('should return merchant when active and exists', async () => {
      const mockMerchant = { id: 1, name: 'Vựa A', phone: '0912345678', is_active: true };
      mockMerchantRepo.findById.mockResolvedValue(mockMerchant);

      const result = await service.getMerchantById(1);
      expect(result).toEqual(mockMerchant);
      expect(mockMerchantRepo.findById).toHaveBeenCalledWith(1);
    });

    it('should throw error when merchant does not exist', async () => {
      mockMerchantRepo.findById.mockResolvedValue(null);

      await expect(service.getMerchantById(1)).rejects.toThrow('Thương lái với ID 1 không tồn tại');
    });

    it('should throw error when merchant is inactive', async () => {
      const mockMerchant = { id: 1, name: 'Vựa A', phone: '0912345678', is_active: false };
      mockMerchantRepo.findById.mockResolvedValue(mockMerchant);

      await expect(service.getMerchantById(1)).rejects.toThrow('Thương lái với ID 1 hiện không hoạt động');
    });
  });

  describe('getMerchantByUserId', () => {
    it('should return merchant when found by user_id', async () => {
      const mockMerchant = { id: 1, name: 'Vựa A', user_id: 'user-abc', is_active: true };
      mockMerchantRepo.findByUserId.mockResolvedValue(mockMerchant);

      const result = await service.getMerchantByUserId('user-abc');
      expect(result).toEqual(mockMerchant);
      expect(mockMerchantRepo.findByUserId).toHaveBeenCalledWith('user-abc');
    });

    it('should throw error when no merchant found for user_id', async () => {
      mockMerchantRepo.findByUserId.mockResolvedValue(null);

      await expect(service.getMerchantByUserId('user-xyz')).rejects.toThrow(
        'Thương lái với User ID user-xyz không tồn tại'
      );
    });
  });

  describe('getAllActiveMerchants', () => {
    it('should return only active merchants', async () => {
      const merchants = [
        { id: 1, name: 'Vựa A', is_active: true },
        { id: 2, name: 'Vựa B', is_active: false },
        { id: 3, name: 'Vựa C', is_active: true },
      ];
      mockMerchantRepo.findAll.mockResolvedValue(merchants);

      const result = await service.getAllActiveMerchants();
      expect(result).toHaveLength(2);
      expect(result.every(m => m.is_active)).toBe(true);
    });

    it('should return empty array when no active merchants', async () => {
      mockMerchantRepo.findAll.mockResolvedValue([
        { id: 1, name: 'Vựa A', is_active: false },
      ]);

      const result = await service.getAllActiveMerchants();
      expect(result).toHaveLength(0);
    });
  });

  describe('registerMerchant', () => {
    it('should register successfully with valid inputs', async () => {
      const input = { name: ' Vựa B ', phone: ' 0987654321 ' };
      const createdMerchant = { id: 2, name: 'Vựa B', phone: '0987654321', is_active: true };
      mockMerchantRepo.create.mockResolvedValue(createdMerchant);

      const result = await service.registerMerchant(input);
      expect(result).toEqual(createdMerchant);
      expect(mockMerchantRepo.create).toHaveBeenCalledWith({
        name: 'Vựa B',
        phone: '0987654321',
      });
    });

    it('should throw error when name is empty', async () => {
      const input = { name: '  ', phone: '0987654321' };
      await expect(service.registerMerchant(input)).rejects.toThrow('Tên thương lái không được để trống');
    });

    it('should throw error when phone is empty', async () => {
      const input = { name: 'Vựa B', phone: ' ' };
      await expect(service.registerMerchant(input)).rejects.toThrow('Số điện thoại không được để trống');
    });

    it('should throw error when phone format is invalid', async () => {
      const input = { name: 'Vựa B', phone: 'invalid-phone' };
      await expect(service.registerMerchant(input)).rejects.toThrow('Số điện thoại không hợp lệ');
    });
  });

  describe('updateMerchant', () => {
    it('should update successfully with valid inputs', async () => {
      const existing = { id: 1, name: 'Vựa A', phone: '0912345678', is_active: true };
      mockMerchantRepo.findById.mockResolvedValue(existing);
      mockMerchantRepo.update.mockResolvedValue({ ...existing, name: 'Vựa A Mới' });

      const result = await service.updateMerchant(1, { name: ' Vựa A Mới ' });
      expect(result.name).toBe('Vựa A Mới');
      expect(mockMerchantRepo.update).toHaveBeenCalledWith(1, { name: 'Vựa A Mới' });
    });

    it('should throw error when merchant to update does not exist', async () => {
      mockMerchantRepo.findById.mockResolvedValue(null);
      await expect(service.updateMerchant(1, { name: 'Vựa A' })).rejects.toThrow('Thương lái với ID 1 không tồn tại');
    });

    it('should throw error when updating to empty name', async () => {
      const existing = { id: 1, name: 'Vựa A', phone: '0912345678', is_active: true };
      mockMerchantRepo.findById.mockResolvedValue(existing);

      await expect(service.updateMerchant(1, { name: '' })).rejects.toThrow('Tên thương lái không được để trống');
    });

    it('should throw error when updating to empty phone', async () => {
      const existing = { id: 1, name: 'Vựa A', phone: '0912345678', is_active: true };
      mockMerchantRepo.findById.mockResolvedValue(existing);

      await expect(service.updateMerchant(1, { phone: ' ' })).rejects.toThrow('Số điện thoại không được để trống');
    });

    it('should throw error when updating to invalid phone format', async () => {
      const existing = { id: 1, name: 'Vựa A', phone: '0912345678', is_active: true };
      mockMerchantRepo.findById.mockResolvedValue(existing);

      await expect(service.updateMerchant(1, { phone: 'bad-phone' })).rejects.toThrow('Số điện thoại không hợp lệ');
    });

    it('should throw error when update returns null', async () => {
      const existing = { id: 1, name: 'Vựa A', phone: '0912345678', is_active: true };
      mockMerchantRepo.findById.mockResolvedValue(existing);
      mockMerchantRepo.update.mockResolvedValue(null);

      await expect(service.updateMerchant(1, { name: 'Vựa A Mới' })).rejects.toThrow('Cập nhật thương lái ID 1 thất bại');
    });
  });

  describe('deleteMerchant', () => {
    it('should soft delete when merchant exists', async () => {
      const existing = { id: 1, name: 'Vựa A', phone: '0912345678', is_active: true };
      mockMerchantRepo.findById.mockResolvedValue(existing);
      mockMerchantRepo.softDelete.mockResolvedValue(true);

      const result = await service.deleteMerchant(1);
      expect(result).toBe(true);
      expect(mockMerchantRepo.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw error when merchant to delete does not exist', async () => {
      mockMerchantRepo.findById.mockResolvedValue(null);
      await expect(service.deleteMerchant(1)).rejects.toThrow('Thương lái với ID 1 không tồn tại');
    });
  });
});
