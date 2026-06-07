import { NextResponse } from 'next/server';
import { merchantService } from '@/lib/services';
import { cookies } from 'next/headers';

// Helper to get session
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

export async function GET() {
  try {
    const merchants = await merchantService.getAllActiveMerchants();
    return NextResponse.json(merchants);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi hệ thống';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Không được phép truy cập' }, { status: 401 });
    }

    const body = await request.json();

    if (session.role === 'admin') {
      // Admin update of merchant (approve / configure commission)
      const { id, is_active, commission_type, commission_value } = body;
      if (!id) {
        return NextResponse.json({ error: 'Thiếu ID thương lái' }, { status: 400 });
      }

      const updateData: Record<string, string | number | boolean | null | undefined> = {};
      if (is_active !== undefined) updateData.is_active = is_active;
      if (commission_type !== undefined) updateData.commission_type = commission_type;
      if (commission_value !== undefined) updateData.commission_value = Number(commission_value);

      const updated = await merchantService.updateMerchant(id, updateData);
      return NextResponse.json({ success: true, merchant: updated });
    } else if (session.role === 'merchant') {
      // Merchant update of own profile
      if (!session.merchantId) {
        return NextResponse.json({ error: 'Không có thông tin thương lái' }, { status: 400 });
      }

      const { name, phone, address } = body;
      const updateData: Record<string, string | number | boolean | null | undefined> = {};
      if (name !== undefined) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;

      const updated = await merchantService.updateMerchant(session.merchantId, updateData);
      
      // Update session cookie if name changes, or just refresh values
      return NextResponse.json({ success: true, merchant: updated });
    }

    return NextResponse.json({ error: 'Quyền truy cập không hợp lệ' }, { status: 403 });
  } catch (error) {
    console.error('Update merchant error:', error);
    return NextResponse.json({ error: (error as Error).message|| 'Lỗi hệ thống' }, { status: 500  });
  }
}
export async function POST() {
  // Admin might want to list all merchants, active or inactive. Let's return all merchants for admin.
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Không được phép truy cập' }, { status: 403 });
    }
    // We can call merchantRepository directly or findAll on merchantService if exposed.
    // Since merchantService has getAllActiveMerchants, but we need all (including inactive ones),
    // let's query the database directly or use repository.
    // Looking at merchant.service.ts, it doesn't have a get all merchants including inactive ones, 
    // but merchantRepo has findAll() which fetches all where deleted_at IS NULL.
    // Let's use the merchantRepository to fetch all.
    const { merchantRepository } = await import('@/lib/services');
    const allMerchants = await merchantRepository.findAll();
    return NextResponse.json(allMerchants);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message|| 'Lỗi hệ thống' }, { status: 500  });
  }
}
