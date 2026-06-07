import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { merchantService, productService, orderService } from '@/lib/services';
import MerchantDashboardClient from './MerchantDashboardClient';
import { Merchant } from '@/types/merchant.types';
import { Product } from '@/types/product.types';
import { Order } from '@/types/order.types';

export const metadata: Metadata = {
  title: 'Kênh Thương Lái - Hải Sản Cao Cấp',
  description: 'Quản lý vựa khô, theo dõi đơn hàng và cập nhật danh mục sản phẩm.',
  alternates: {
    canonical: '/dashboard/merchant',
  },
};

async function getSession() {
  const cookieStore = await cookies();
  const sessionStr = cookieStore.get('session')?.value;
  if (!sessionStr) return null;
  try {
    return JSON.parse(sessionStr);
  } catch {
    return null;
  }
}

export default async function MerchantDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== 'merchant') {
    redirect('/auth/login');
  }

  let merchant: Merchant | null = null;
  let products: Product[] = [];
  let orders: Order[] = [];

  try {
    // Fetch merchant by user_id
    merchant = await merchantService.getMerchantByUserId(session.userId);

    if (!merchant) {
      redirect('/auth/login');
    }

    // Fetch products
    products = await productService.getProductsByMerchant(merchant.id);

    // Fetch orders
    orders = await orderService.getOrdersByMerchant(merchant.id);
  } catch (error) {
    console.error('Error loading merchant dashboard data:', error);
    // If merchant record is not found or other database issue, clean session and redirect to login
    redirect('/auth/login');
  }

  return (
    <MerchantDashboardClient
      merchant={merchant}
      products={products}
      orders={orders}
    />
  );
}
