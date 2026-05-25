import { ProductRepository } from '../repositories/product.repository';
import { MerchantRepository } from '../repositories/merchant.repository';
import type { Product, CreateProductInput, UpdateProductInput } from '@/types/product.types';

// Slug verification helper (lowercase, alphanumeric and hyphens only)
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function validateProductData(data: Partial<CreateProductInput>) {
  if (data.merchant_id !== undefined) {
    if (!data.merchant_id || data.merchant_id <= 0) {
      throw new Error('ID vựa hải sản không hợp lệ.');
    }
    const merchant = await MerchantRepository.findById(data.merchant_id);
    if (!merchant) {
      throw new Error('Vựa hải sản không tồn tại hoặc đã bị xóa.');
    }
  }

  if (data.name !== undefined && data.name.trim().length === 0) {
    throw new Error('Tên sản phẩm không được để trống.');
  }

  if (data.slug !== undefined) {
    const cleanSlug = data.slug.trim();
    if (cleanSlug.length === 0) {
      throw new Error('Slug sản phẩm không được để trống.');
    }
    if (!SLUG_REGEX.test(cleanSlug)) {
      throw new Error('Slug không hợp lệ (chỉ được chứa chữ thường, số và dấu gạch ngang).');
    }
  }

  if (data.price !== undefined && (isNaN(data.price) || data.price <= 0)) {
    throw new Error('Giá sản phẩm phải lớn hơn 0.');
  }

  if (data.original_price !== undefined && data.original_price !== null) {
    if (isNaN(data.original_price) || data.original_price <= 0) {
      throw new Error('Giá gốc sản phẩm phải lớn hơn 0.');
    }
    if (data.price !== undefined && data.price > data.original_price) {
      throw new Error('Giá khuyến mãi không được lớn hơn giá gốc.');
    }
  }

  if (data.specific_commission_rate !== undefined && data.specific_commission_rate !== null) {
    if (data.specific_commission_rate < 0 || data.specific_commission_rate > 100) {
      throw new Error('Tỷ lệ hoa hồng cụ thể phải từ 0% đến 100%.');
    }
  }
}

export const ProductService = {
  getPublicProducts: async (options?: { 
    merchantId?: number; 
    category?: string; 
    page?: number; 
    limit?: number; 
  }) => {
    const page = options?.page ? Math.max(1, options.page) : 1;
    const limit = options?.limit ? Math.max(1, Math.min(100, options.limit)) : 10;
    const offset = (page - 1) * limit;

    const queryFilters = {
      merchantId: options?.merchantId,
      category: options?.category,
      isAutoListed: true, // Chỉ lấy các sản phẩm tự động hiển thị trên web
    };

    const [products, total] = await Promise.all([
      ProductRepository.findAllWithMerchant({
        ...queryFilters,
        limit,
        offset,
      }),
      ProductRepository.count(queryFilters),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    if (!slug || slug.trim().length === 0) {
      throw new Error('Slug không hợp lệ.');
    }
    return ProductRepository.findBySlug(slug.trim());
  },

  // Tìm các sản phẩm cùng nhóm (biến thể kích cỡ) dựa trên tiền tố của slug (ProductGroup)
  getProductVariants: async (baseSlug: string): Promise<Product[]> => {
    if (!baseSlug || baseSlug.trim().length === 0) {
      return [];
    }
    return ProductRepository.findBySlugPrefix(baseSlug.trim());
  },

  createProduct: async (input: CreateProductInput): Promise<Product> => {
    await validateProductData(input);

    const slug = input.slug.trim();
    // Kiểm tra xem slug đã tồn tại chưa
    const existing = await ProductRepository.findBySlug(slug);
    if (existing) {
      throw new Error('Slug sản phẩm này đã tồn tại, vui lòng chọn slug khác.');
    }

    const data: CreateProductInput = {
      merchant_id: input.merchant_id,
      name: input.name.trim(),
      slug,
      price: input.price,
      original_price: input.original_price ?? null,
      category: input.category?.trim() || null,
      description: input.description?.trim() || null,
      image_url: input.image_url?.trim() || null,
      is_auto_listed: input.is_auto_listed ?? true,
      specific_commission_rate: input.specific_commission_rate ?? null,
    };

    return ProductRepository.create(data);
  },

  updateProduct: async (id: number, input: UpdateProductInput): Promise<Product> => {
    if (!id || id <= 0) {
      throw new Error('ID sản phẩm không hợp lệ.');
    }

    await validateProductData(input);

    if (input.slug !== undefined) {
      const slug = input.slug.trim();
      const existing = await ProductRepository.findBySlug(slug);
      if (existing && existing.id !== id) {
        throw new Error('Slug sản phẩm này đã được sử dụng bởi một sản phẩm khác.');
      }
    }

    const updateData: UpdateProductInput = {};
    if (input.merchant_id !== undefined) updateData.merchant_id = input.merchant_id;
    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.slug !== undefined) updateData.slug = input.slug.trim();
    if (input.price !== undefined) updateData.price = input.price;
    if (input.original_price !== undefined) updateData.original_price = input.original_price;
    if (input.category !== undefined) updateData.category = input.category?.trim() || null;
    if (input.description !== undefined) updateData.description = input.description?.trim() || null;
    if (input.image_url !== undefined) updateData.image_url = input.image_url?.trim() || null;
    if (input.is_auto_listed !== undefined) updateData.is_auto_listed = input.is_auto_listed;
    if (input.specific_commission_rate !== undefined) updateData.specific_commission_rate = input.specific_commission_rate;

    const updated = await ProductRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Không tìm thấy sản phẩm để cập nhật hoặc sản phẩm đã bị xóa.');
    }

    return updated;
  },

  deleteProduct: async (id: number): Promise<void> => {
    if (!id || id <= 0) {
      throw new Error('ID sản phẩm không hợp lệ.');
    }

    const success = await ProductRepository.softDelete(id);
    if (!success) {
      throw new Error('Không tìm thấy sản phẩm để xóa hoặc sản phẩm đã bị xóa trước đó.');
    }
  }
};
