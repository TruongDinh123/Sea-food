import { ProductRepository } from '../repositories/product.repository';
import { MerchantRepository } from '../repositories/merchant.repository';
import { Product, CreateProductInput, UpdateProductInput } from '../../types/product.types';

export class ProductService {
  constructor(
    private productRepo: ProductRepository,
    private merchantRepo: MerchantRepository
  ) {}

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new Error(`Sản phẩm với ID ${id} không tồn tại`);
    }
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const product = await this.productRepo.findBySlug(slug);
    if (!product) {
      throw new Error(`Sản phẩm với slug ${slug} không tồn tại`);
    }
    return product;
  }

  async getProductsByMerchant(merchantId: number): Promise<Product[]> {
    const merchant = await this.merchantRepo.findById(merchantId);
    if (!merchant) {
      throw new Error(`Thương lái với ID ${merchantId} không tồn tại`);
    }
    return this.productRepo.findByMerchantId(merchantId);
  }

  async getAllProducts(filters?: { category?: string; merchantId?: number }): Promise<Product[]> {
    return this.productRepo.findAll(filters);
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    if (!input.name || input.name.trim() === '') {
      throw new Error('Tên sản phẩm không được để trống');
    }
    if (!input.slug || input.slug.trim() === '') {
      throw new Error('Slug sản phẩm không được để trống');
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(input.slug.trim())) {
      throw new Error('Slug không hợp lệ (chỉ chấp nhận chữ thường không dấu, số và dấu gạch ngang)');
    }

    if (input.price <= 0) {
      throw new Error('Giá sản phẩm phải lớn hơn 0');
    }

    if (input.specific_commission_rate !== undefined && input.specific_commission_rate !== null) {
      if (input.specific_commission_rate < 0) {
        throw new Error('Tỷ lệ hoa hồng đặc thù không được nhỏ hơn 0');
      }
    }

    // Kiểm tra thương lái tồn tại và hoạt động
    const merchant = await this.merchantRepo.findById(input.merchant_id);
    if (!merchant) {
      throw new Error(`Thương lái với ID ${input.merchant_id} không tồn tại`);
    }
    if (!merchant.is_active) {
      throw new Error(`Thương lái với ID ${input.merchant_id} hiện không hoạt động`);
    }

    // Kiểm tra slug duy nhất
    const existing = await this.productRepo.findBySlug(input.slug.trim());
    if (existing) {
      throw new Error(`Slug ${input.slug} đã được sử dụng bởi sản phẩm khác`);
    }

    return this.productRepo.create({
      ...input,
      name: input.name.trim(),
      slug: input.slug.trim(),
    });
  }

  async updateProduct(id: number, input: UpdateProductInput): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new Error(`Sản phẩm với ID ${id} không tồn tại`);
    }

    if (input.name !== undefined && input.name.trim() === '') {
      throw new Error('Tên sản phẩm không được để trống');
    }

    if (input.slug !== undefined) {
      if (input.slug.trim() === '') {
        throw new Error('Slug sản phẩm không được để trống');
      }
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(input.slug.trim())) {
        throw new Error('Slug không hợp lệ (chỉ chấp nhận chữ thường không dấu, số và dấu gạch ngang)');
      }
      const existing = await this.productRepo.findBySlug(input.slug.trim());
      if (existing && existing.id !== id) {
        throw new Error(`Slug ${input.slug} đã được sử dụng bởi sản phẩm khác`);
      }
    }

    if (input.price !== undefined && input.price <= 0) {
      throw new Error('Giá sản phẩm phải lớn hơn 0');
    }

    if (input.specific_commission_rate !== undefined && input.specific_commission_rate !== null) {
      if (input.specific_commission_rate < 0) {
        throw new Error('Tỷ lệ hoa hồng đặc thù không được nhỏ hơn 0');
      }
    }

    if (input.merchant_id !== undefined) {
      const merchant = await this.merchantRepo.findById(input.merchant_id);
      if (!merchant) {
        throw new Error(`Thương lái với ID ${input.merchant_id} không tồn tại`);
      }
      if (!merchant.is_active) {
        throw new Error(`Thương lái với ID ${input.merchant_id} hiện không hoạt động`);
      }
    }

    const updated = await this.productRepo.update(id, {
      ...input,
      name: input.name !== undefined ? input.name.trim() : undefined,
      slug: input.slug !== undefined ? input.slug.trim() : undefined,
    });

    if (!updated) {
      throw new Error(`Cập nhật sản phẩm ID ${id} thất bại`);
    }
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new Error(`Sản phẩm với ID ${id} không tồn tại`);
    }
    return this.productRepo.softDelete(id);
  }
}
