import { NextResponse } from 'next/server';
import { blogService } from '@/lib/services';
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

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Không được phép truy cập' }, { status: 403 });
    }

    const { title, slug, content, meta_description, is_published, cover_image_url, publish_date } = await request.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Tiêu đề, slug và nội dung không được để trống' }, { status: 400 });
    }

    const blog = await blogService.createBlog({
      title: title.trim(),
      slug: slug.trim(),
      content: content.trim(),
      meta_description: meta_description ? meta_description.trim() : null,
      is_published: !!is_published,
      cover_image_url: cover_image_url ? cover_image_url.trim() : null,
      publish_date: publish_date ? new Date(publish_date) : (is_published ? new Date() : null),
    });

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ error: (error as Error).message|| 'Lỗi hệ thống' }, { status: 500  });
  }
}
