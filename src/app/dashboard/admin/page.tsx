import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { merchantRepository, referralService, blogService } from '@/lib/services';
import AdminDashboardClient from './AdminDashboardClient';
import { Merchant } from '@/types/merchant.types';
import { ReferralLog } from '@/types/referral.types';
import { Blog } from '@/types/blog.types';

export const metadata: Metadata = {
  title: 'Hệ Thống Quản Trị - Hải Sản Cao Cấp',
  description: 'Duyệt thương lái, quản lý chính sách đối soát hoa hồng và bài viết blog.',
  alternates: {
    canonical: '/dashboard/admin',
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

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/auth/login');
  }

  let serializedMerchants: Merchant[] = [];
  let serializedReferralLogs: ReferralLog[] = [];
  let serializedBlogs: Blog[] = [];

  try {
    // Tuân thủ Service-Repository Pattern: gọi qua Service/Repository, không dùng raw SQL trong page
    const merchants = await merchantRepository.findAll();
    const referralLogs = await referralService.getAllReferralLogs();
    const blogs = await blogService.getAllBlogs(false);

    // Serialize dates an toàn cho Next.js Server → Client Component boundary
    serializedMerchants = JSON.parse(JSON.stringify(merchants));
    serializedReferralLogs = JSON.parse(JSON.stringify(referralLogs));
    serializedBlogs = JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error('Error loading admin dashboard data:', error);
    redirect('/auth/login');
  }

  return (
    <AdminDashboardClient
      merchants={serializedMerchants}
      referralLogs={serializedReferralLogs}
      blogs={serializedBlogs}
    />
  );
}
