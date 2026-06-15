import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { merchantService } from '@/lib/services';
import CreateProductClient from './CreateProductClient';
import { Merchant } from '@/types/merchant.types';

export const metadata: Metadata = {
  title: 'Đăng Ký Sản Vật Mới - Hải Sản Cao Cấp',
  description: 'Trang đăng ký sản vật thủy hải sản mới cho gian hàng của thương lái.',
  alternates: {
    canonical: '/dashboard/merchant/san-pham/tao-moi',
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

export default async function CreateProductPage() {
  const session = await getSession();

  if (!session || session.role !== 'merchant') {
    redirect('/auth/login');
  }

  let merchant: Merchant | null = null;

  try {
    merchant = await merchantService.getMerchantByUserId(session.userId);
    if (!merchant) {
      redirect('/auth/login');
    }
  } catch (error) {
    console.error('Error loading merchant data for product creation:', error);
    redirect('/auth/login');
  }

  return (
    <CreateProductClient merchant={merchant} />
  );
}
