import { BlogRepository } from '../repositories/blog.repository';
import { MerchantRepository } from '../repositories/merchant.repository';
import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';
import { ReferralRepository } from '../repositories/referral.repository';

import { BlogService } from './blog.service';
import { MerchantService } from './merchant.service';
import { OrderService } from './order.service';
import { ProductService } from './product.service';
import { ReferralService } from './referral.service';
import { EmailService } from './email.service';

// Repositories
export const blogRepository = new BlogRepository();
export const merchantRepository = new MerchantRepository();
export const orderRepository = new OrderRepository();
export const productRepository = new ProductRepository();
export const referralRepository = new ReferralRepository();

// Services
export const blogService = new BlogService(blogRepository);
export const merchantService = new MerchantService(merchantRepository);
export const referralService = new ReferralService(referralRepository, merchantRepository, productRepository);
export const emailService = new EmailService();
export const productService = new ProductService(productRepository, merchantRepository);
export const orderService = new OrderService(
  orderRepository,
  merchantRepository,
  productRepository,
  referralRepository,
  referralService,
  emailService
);
