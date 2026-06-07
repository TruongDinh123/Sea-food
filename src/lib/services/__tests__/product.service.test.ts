import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductService } from '../product.service';
import { ProductRepository } from '../../repositories/product.repository';
import { MerchantRepository } from '../../repositories/merchant.repository';

vi.mock('../../db/index', () => {
  const mockSql = Object.assign(vi.fn(), {
    begin: vi.fn(async (cb) => await cb(mockSql)),
  });
  return { default: mockSql };
});

describe('ProductService', () => {
  let mockProductRepo: {
    findById: ReturnType<typeof vi.fn>;
    findBySlug: ReturnType<typeof vi.fn>;
    findByMerchantId: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    softDelete: ReturnType<typeof vi.fn>;
  };
  let mockMerchantRepo: {
    findById: ReturnType<typeof vi.fn>;
  };
  let service: ProductService;

  beforeEach(() => {
    mockProductRepo = {
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findByMerchantId: vi.fn(),
      findAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      softDelete: vi.fn(),
    };
    mockMerchantRepo = {
      findById: vi.fn(),
    };
    service = new ProductService(
      mockProductRepo as unknown as ProductRepository,
      mockMerchantRepo as unknown as MerchantRepository
    );
  });

  describe('getProductById', () => {
    it('should return product when found', async () => {
      const product = { id: 10, name: 'Tôm', merchant_id: 1 };
      mockProductRepo.findById.mockResolvedValue(product);
      const result = await service.getProductById(10);
      expect(result).toEqual(product);
    });

    it('should throw error when product not found', async () => {
      mockProductRepo.findById.mockResolvedValue(null);
      await expect(service.getProductById(999)).rejects.toThrow('Sản phẩm với ID 999 không tồn tại');
    });
  });

  describe('getProductBySlug', () => {
    it('should return product when slug found', async () => {
      const product = { id: 10, name: 'Tôm', slug: 'tom-kho' };
      mockProductRepo.findBySlug.mockResolvedValue(product);
      const result = await service.getProductBySlug('tom-kho');
      expect(result).toEqual(product);
    });

    it('should throw error when slug not found', async () => {
      mockProductRepo.findBySlug.mockResolvedValue(null);
      await expect(service.getProductBySlug('nonexistent')).rejects.toThrow(
        'Sản phẩm với slug nonexistent không tồn tại'
      );
    });
  });

  describe('getProductsByMerchant', () => {
    it('should return products when merchant exists', async () => {
      const products = [{ id: 10, merchant_id: 1 }, { id: 11, merchant_id: 1 }];
      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: true });
      mockProductRepo.findByMerchantId.mockResolvedValue(products);

      const result = await service.getProductsByMerchant(1);
      expect(result).toEqual(products);
    });

    it('should throw error when merchant not found', async () => {
      mockMerchantRepo.findById.mockResolvedValue(null);
      await expect(service.getProductsByMerchant(99)).rejects.toThrow('Thương lái với ID 99 không tồn tại');
    });
  });

  describe('getAllProducts', () => {
    it('should return all products without filters', async () => {
      const products = [{ id: 1 }, { id: 2 }];
      mockProductRepo.findAll.mockResolvedValue(products);
      const result = await service.getAllProducts();
      expect(result).toEqual(products);
      expect(mockProductRepo.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return filtered products with category filter', async () => {
      const products = [{ id: 1 }];
      mockProductRepo.findAll.mockResolvedValue(products);
      const result = await service.getAllProducts({ category: 'tom' });
      expect(result).toEqual(products);
      expect(mockProductRepo.findAll).toHaveBeenCalledWith({ category: 'tom' });
    });
  });

  describe('createProduct', () => {
    it('should create successfully with valid inputs', async () => {
      const input = {
        merchant_id: 1,
        name: ' Tôm Khô Cà Mau ',
        slug: 'tom-kho-ca-mau',
        price: 500000,
        specific_commission_rate: 10,
      };

      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: true });
      mockProductRepo.findBySlug.mockResolvedValue(null);
      mockProductRepo.create.mockResolvedValue({ id: 10, ...input, name: 'Tôm Khô Cà Mau' });

      const result = await service.createProduct(input);
      expect(result.id).toBe(10);
      expect(result.name).toBe('Tôm Khô Cà Mau');
      expect(mockProductRepo.create).toHaveBeenCalledWith({
        merchant_id: 1,
        name: 'Tôm Khô Cà Mau',
        slug: 'tom-kho-ca-mau',
        price: 500000,
        specific_commission_rate: 10,
      });
    });

    it('should throw error when name is empty', async () => {
      await expect(service.createProduct({ merchant_id: 1, name: ' ', slug: 'tom', price: 100 }))
        .rejects.toThrow('Tên sản phẩm không được để trống');
    });

    it('should throw error when slug is empty', async () => {
      await expect(service.createProduct({ merchant_id: 1, name: 'Tôm', slug: ' ', price: 100 }))
        .rejects.toThrow('Slug sản phẩm không được để trống');
    });

    it('should throw error when slug format is invalid', async () => {
      await expect(service.createProduct({ merchant_id: 1, name: 'Tôm', slug: 'tom_kho_ca_mau', price: 100 }))
        .rejects.toThrow('Slug không hợp lệ');
    });

    it('should throw error when price <= 0', async () => {
      await expect(service.createProduct({ merchant_id: 1, name: 'Tôm', slug: 'tom-kho', price: 0 }))
        .rejects.toThrow('Giá sản phẩm phải lớn hơn 0');
    });

    it('should throw error when specific_commission_rate < 0', async () => {
      await expect(service.createProduct({ merchant_id: 1, name: 'Tôm', slug: 'tom-kho', price: 100, specific_commission_rate: -1 }))
        .rejects.toThrow('Tỷ lệ hoa hồng đặc thù không được nhỏ hơn 0');
    });

    it('should throw error when merchant does not exist', async () => {
      mockMerchantRepo.findById.mockResolvedValue(null);
      await expect(service.createProduct({ merchant_id: 1, name: 'Tôm', slug: 'tom-kho', price: 100 }))
        .rejects.toThrow('Thương lái với ID 1 không tồn tại');
    });

    it('should throw error when merchant is inactive', async () => {
      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: false });
      await expect(service.createProduct({ merchant_id: 1, name: 'Tôm', slug: 'tom-kho', price: 100 }))
        .rejects.toThrow('Thương lái với ID 1 hiện không hoạt động');
    });

    it('should throw error when slug already exists', async () => {
      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: true });
      mockProductRepo.findBySlug.mockResolvedValue({ id: 9, slug: 'tom-kho' });
      await expect(service.createProduct({ merchant_id: 1, name: 'Tôm', slug: 'tom-kho', price: 100 }))
        .rejects.toThrow('Slug tom-kho đã được sử dụng bởi sản phẩm khác');
    });

    it('should allow null specific_commission_rate', async () => {
      const input = { merchant_id: 1, name: 'Tôm', slug: 'tom-kho', price: 100, specific_commission_rate: null };
      mockMerchantRepo.findById.mockResolvedValue({ id: 1, is_active: true });
      mockProductRepo.findBySlug.mockResolvedValue(null);
      mockProductRepo.create.mockResolvedValue({ id: 5, ...input });
      const result = await service.createProduct(input as never);
      expect(result.id).toBe(5);
    });
  });

  describe('updateProduct', () => {
    it('should update successfully with valid inputs', async () => {
      const product = { id: 10, merchant_id: 1, name: 'Tôm Khô', slug: 'tom-kho', price: 500000 };
      mockProductRepo.findById.mockResolvedValue(product);
      mockProductRepo.findBySlug.mockResolvedValue(null);
      mockProductRepo.update.mockResolvedValue({ ...product, price: 600000 });

      const result = await service.updateProduct(10, { price: 600000 });
      expect(result.price).toBe(600000);
    });

    it('should throw error when updating non-existent product', async () => {
      mockProductRepo.findById.mockResolvedValue(null);
      await expect(service.updateProduct(10, { price: 600000 }))
        .rejects.toThrow('Sản phẩm với ID 10 không tồn tại');
    });

    it('should throw error when updating to empty name', async () => {
      mockProductRepo.findById.mockResolvedValue({ id: 10, name: 'Tôm', slug: 'tom', price: 100 });
      await expect(service.updateProduct(10, { name: '' }))
        .rejects.toThrow('Tên sản phẩm không được để trống');
    });

    it('should throw error when updating to empty slug', async () => {
      mockProductRepo.findById.mockResolvedValue({ id: 10, name: 'Tôm', slug: 'tom', price: 100 });
      await expect(service.updateProduct(10, { slug: ' ' }))
        .rejects.toThrow('Slug sản phẩm không được để trống');
    });

    it('should throw error when updating to invalid slug format', async () => {
      mockProductRepo.findById.mockResolvedValue({ id: 10, name: 'Tôm', slug: 'tom', price: 100 });
      await expect(service.updateProduct(10, { slug: 'invalid_slug' }))
        .rejects.toThrow('Slug không hợp lệ');
    });

    it('should throw error when updating to duplicate slug', async () => {
      mockProductRepo.findById.mockResolvedValue({ id: 10, name: 'Tôm', slug: 'tom', price: 100 });
      mockProductRepo.findBySlug.mockResolvedValue({ id: 99, slug: 'taken-slug' });
      await expect(service.updateProduct(10, { slug: 'taken-slug' }))
        .rejects.toThrow('Slug taken-slug đã được sử dụng bởi sản phẩm khác');
    });

    it('should allow updating to same slug as self', async () => {
      const product = { id: 10, name: 'Tôm', slug: 'tom-kho', price: 100 };
      mockProductRepo.findById.mockResolvedValue(product);
      mockProductRepo.findBySlug.mockResolvedValue({ id: 10, slug: 'tom-kho' }); // same id
      mockProductRepo.update.mockResolvedValue({ ...product, price: 200 });
      const result = await service.updateProduct(10, { slug: 'tom-kho', price: 200 });
      expect(result.price).toBe(200);
    });

    it('should throw error when price <= 0', async () => {
      mockProductRepo.findById.mockResolvedValue({ id: 10, name: 'Tôm', slug: 'tom', price: 100 });
      await expect(service.updateProduct(10, { price: 0 }))
        .rejects.toThrow('Giá sản phẩm phải lớn hơn 0');
    });

    it('should throw error when specific_commission_rate < 0', async () => {
      mockProductRepo.findById.mockResolvedValue({ id: 10, name: 'Tôm', slug: 'tom', price: 100 });
      await expect(service.updateProduct(10, { specific_commission_rate: -5 }))
        .rejects.toThrow('Tỷ lệ hoa hồng đặc thù không được nhỏ hơn 0');
    });

    it('should throw error when new merchant does not exist', async () => {
      mockProductRepo.findById.mockResolvedValue({ id: 10, name: 'Tôm', slug: 'tom', price: 100 });
      mockMerchantRepo.findById.mockResolvedValue(null);
      await expect(service.updateProduct(10, { merchant_id: 99 }))
        .rejects.toThrow('Thương lái với ID 99 không tồn tại');
    });

    it('should throw error when new merchant is inactive', async () => {
      mockProductRepo.findById.mockResolvedValue({ id: 10, name: 'Tôm', slug: 'tom', price: 100 });
      mockMerchantRepo.findById.mockResolvedValue({ id: 2, is_active: false });
      await expect(service.updateProduct(10, { merchant_id: 2 }))
        .rejects.toThrow('Thương lái với ID 2 hiện không hoạt động');
    });

    it('should throw error when update returns null', async () => {
      mockProductRepo.findById.mockResolvedValue({ id: 10, name: 'Tôm', slug: 'tom', price: 100 });
      mockProductRepo.update.mockResolvedValue(null);
      await expect(service.updateProduct(10, { price: 200 }))
        .rejects.toThrow('Cập nhật sản phẩm ID 10 thất bại');
    });
  });

  describe('deleteProduct', () => {
    it('should soft delete when product exists', async () => {
      mockProductRepo.findById.mockResolvedValue({ id: 10, name: 'Tôm' });
      mockProductRepo.softDelete.mockResolvedValue(true);
      const result = await service.deleteProduct(10);
      expect(result).toBe(true);
      expect(mockProductRepo.softDelete).toHaveBeenCalledWith(10);
    });

    it('should throw error when product to delete does not exist', async () => {
      mockProductRepo.findById.mockResolvedValue(null);
      await expect(service.deleteProduct(999)).rejects.toThrow('Sản phẩm với ID 999 không tồn tại');
    });
  });
});
