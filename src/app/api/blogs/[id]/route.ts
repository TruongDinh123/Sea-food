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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Không được phép truy cập' }, { status: 403 });
    }

    const { id } = await params;
    const blogId = Number(id);

    if (isNaN(blogId)) {
      return NextResponse.json({ error: 'ID bài viết không hợp lệ' }, { status: 400 });
    }

    const { title, slug, content, meta_description, is_published, cover_image_url, publish_date, focus_keyword, canonical_url } = await request.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Tiêu đề, slug và nội dung không được để trống' }, { status: 400 });
    }

    const blog = await blogService.updateBlog(blogId, {
      title: title.trim(),
      slug: slug.trim(),
      content: content.trim(),
      meta_description: meta_description ? meta_description.trim() : null,
      is_published: !!is_published,
      cover_image_url: cover_image_url ? cover_image_url.trim() : null,
      publish_date: publish_date ? new Date(publish_date) : null,
      focus_keyword: focus_keyword ? focus_keyword.trim() : null,
      canonical_url: canonical_url ? canonical_url.trim() : null,
    });

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Lỗi hệ thống' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Không được phép truy cập' }, { status: 403 });
    }

    const { id } = await params;
    const blogId = Number(id);

    if (isNaN(blogId)) {
      return NextResponse.json({ error: 'ID bài viết không hợp lệ' }, { status: 400 });
    }

    await blogService.deleteBlog(blogId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Lỗi hệ thống' }, { status: 500 });
  }
}
