import { BlogRepository } from '../repositories/blog.repository';
import { Blog, CreateBlogInput, UpdateBlogInput } from '../../types/blog.types';

export class BlogService {
  constructor(private blogRepo: BlogRepository) {}

  async getBlogById(id: number): Promise<Blog> {
    const blog = await this.blogRepo.findById(id);
    if (!blog) {
      throw new Error(`Bài viết với ID ${id} không tồn tại`);
    }
    return blog;
  }

  async getBlogBySlug(slug: string): Promise<Blog> {
    const blog = await this.blogRepo.findBySlug(slug);
    if (!blog) {
      throw new Error(`Bài viết với slug ${slug} không tồn tại`);
    }
    return blog;
  }

  async getAllBlogs(publishedOnly: boolean = false): Promise<Blog[]> {
    return this.blogRepo.findAll(publishedOnly);
  }

  async createBlog(input: CreateBlogInput): Promise<Blog> {
    if (!input.title || input.title.trim() === '') {
      throw new Error('Tiêu đề bài viết không được để trống');
    }
    if (!input.content || input.content.trim() === '') {
      throw new Error('Nội dung bài viết không được để trống');
    }
    if (!input.slug || input.slug.trim() === '') {
      throw new Error('Slug bài viết không được để trống');
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(input.slug.trim())) {
      throw new Error('Slug không hợp lệ (chỉ chấp nhận chữ thường không dấu, số và dấu gạch ngang)');
    }

    // Check slug uniqueness
    const existing = await this.blogRepo.findBySlug(input.slug.trim());
    if (existing) {
      throw new Error(`Slug ${input.slug} đã được sử dụng bởi bài viết khác`);
    }

    return this.blogRepo.create({
      ...input,
      title: input.title.trim(),
      slug: input.slug.trim(),
    });
  }

  async updateBlog(id: number, input: UpdateBlogInput): Promise<Blog> {
    const blog = await this.blogRepo.findById(id);
    if (!blog) {
      throw new Error(`Bài viết với ID ${id} không tồn tại`);
    }

    if (input.title !== undefined && input.title.trim() === '') {
      throw new Error('Tiêu đề bài viết không được để trống');
    }
    if (input.content !== undefined && input.content.trim() === '') {
      throw new Error('Nội dung bài viết không được để trống');
    }

    if (input.slug !== undefined) {
      if (input.slug.trim() === '') {
        throw new Error('Slug bài viết không được để trống');
      }
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(input.slug.trim())) {
        throw new Error('Slug không hợp lệ (chỉ chấp nhận chữ thường không dấu, số và dấu gạch ngang)');
      }
      const existing = await this.blogRepo.findBySlug(input.slug.trim());
      if (existing && existing.id !== id) {
        throw new Error(`Slug ${input.slug} đã được sử dụng bởi bài viết khác`);
      }
    }

    const updated = await this.blogRepo.update(id, {
      ...input,
      title: input.title !== undefined ? input.title.trim() : undefined,
      slug: input.slug !== undefined ? input.slug.trim() : undefined,
    });

    if (!updated) {
      throw new Error(`Cập nhật bài viết ID ${id} thất bại`);
    }
    return updated;
  }

  async deleteBlog(id: number): Promise<boolean> {
    const blog = await this.blogRepo.findById(id);
    if (!blog) {
      throw new Error(`Bài viết với ID ${id} không tồn tại`);
    }
    return this.blogRepo.softDelete(id);
  }
}
