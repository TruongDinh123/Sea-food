import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';

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

// Slugify tên file để lưu trữ an toàn
function sanitizeFilename(filename: string): string {
  const ext = path.extname(filename);
  const nameWithoutExt = path.basename(filename, ext);
  
  const sanitized = nameWithoutExt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9-]/g, '-') // Chỉ cho phép chữ thường, số, dấu gạch ngang
    .replace(/-+/g, '-') // Loại bỏ nhiều gạch ngang liên tiếp
    .replace(/^-|-$/g, ''); // Loại bỏ gạch ngang ở đầu/cuối
    
  return `${sanitized || 'product'}-${Date.now()}${ext.toLowerCase()}`;
}

export async function POST(request: Request) {
  try {
    // 1. Kiểm tra quyền — merchant hoặc admin đều được upload ảnh sản phẩm
    const session = await getSession();
    if (!session || (session.role !== 'merchant' && session.role !== 'admin')) {
      return NextResponse.json({ error: 'Không được phép truy cập' }, { status: 403 });
    }

    // 2. Kiểm tra cấu hình Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        error: 'Chưa cấu hình biến môi trường Supabase URL hoặc Key trong file .env.local' 
      }, { status: 500 });
    }

    // 3. Phân tích FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file nào được tải lên' }, { status: 400 });
    }

    // 4. Validate định dạng tệp (chỉ cho phép ảnh)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Định dạng tệp không được hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP, GIF' }, { status: 400 });
    }

    // 5. Validate kích thước tệp (tối đa 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: 'Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB' }, { status: 400 });
    }

    // 6. Đọc tệp thành ArrayBuffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = sanitizeFilename(file.name);

    // 7. Gửi tệp lên Supabase Storage bucket 'products'
    const bucketName = 'products';
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${safeName}`;

    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': file.type,
        'x-upsert': 'true',
      },
      body: buffer,
    });

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      console.error('Supabase Storage upload error:', uploadData);
      
      // Nếu lỗi do chưa tạo bucket
      if (uploadData.error === 'Bucket not found' || (uploadData.message && uploadData.message.includes('not found'))) {
        return NextResponse.json({ 
          error: 'Chưa tạo bucket "products" chế độ Public trên Supabase Storage. Vui lòng tạo bucket trước.' 
        }, { status: 500 });
      }

      return NextResponse.json({ 
        error: uploadData.message || 'Lỗi khi tải ảnh lên Supabase Cloud Storage' 
      }, { status: uploadRes.status });
    }

    // 8. Trả về public URL chính thức của ảnh
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${safeName}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error('Upload product image error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi tải tệp lên' }, { status: 500 });
  }
}
