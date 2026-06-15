import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BlogService } from '../blog.service';
import { BlogRepository } from '../../repositories/blog.repository';

vi.mock('../../db/index', () => {
  const mockSql = Object.assign(vi.fn(), {
    begin: vi.fn(async (cb) => await cb(mockSql)),
  });
  return { default: mockSql };
});

describe('BlogService', () => {
  let mockBlogRepo: {
    findById: ReturnType<typeof vi.fn>;
    findBySlug: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    softDelete: ReturnType<typeof vi.fn>;
  };
  let service: BlogService;

  beforeEach(() => {
    mockBlogRepo = {
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      softDelete: vi.fn(),
    };
    service = new BlogService(mockBlogRepo as unknown as BlogRepository);
  });

  describe('getBlogById', () => {
    it('should return blog when found', async () => {
      const blog = { id: 1, title: 'Tiêu đề', slug: 'tieu-de' };
      mockBlogRepo.findById.mockResolvedValue(blog);
      const result = await service.getBlogById(1);
      expect(result).toEqual(blog);
    });

    it('should throw error when blog not found', async () => {
      mockBlogRepo.findById.mockResolvedValue(null);
      await expect(service.getBlogById(99)).rejects.toThrow('Bài viết với ID 99 không tồn tại');
    });
  });

  describe('getBlogBySlug', () => {
    it('should return blog when slug found', async () => {
      const blog = { id: 1, title: 'Tiêu đề', slug: 'tieu-de' };
      mockBlogRepo.findBySlug.mockResolvedValue(blog);
      const result = await service.getBlogBySlug('tieu-de');
      expect(result).toEqual(blog);
    });

    it('should throw error when slug not found', async () => {
      mockBlogRepo.findBySlug.mockResolvedValue(null);
      await expect(service.getBlogBySlug('nonexistent')).rejects.toThrow(
        'Bài viết với slug nonexistent không tồn tại'
      );
    });
  });

  describe('getAllBlogs', () => {
    it('should return all blogs when publishedOnly is false', async () => {
      const blogs = [{ id: 1 }, { id: 2 }];
      mockBlogRepo.findAll.mockResolvedValue(blogs);
      const result = await service.getAllBlogs();
      expect(result).toEqual(blogs);
      expect(mockBlogRepo.findAll).toHaveBeenCalledWith(false);
    });

    it('should return only published blogs when publishedOnly is true', async () => {
      const blogs = [{ id: 1 }];
      mockBlogRepo.findAll.mockResolvedValue(blogs);
      const result = await service.getAllBlogs(true);
      expect(result).toEqual(blogs);
      expect(mockBlogRepo.findAll).toHaveBeenCalledWith(true);
    });
  });

  describe('createBlog', () => {
    it('should create successfully with valid inputs', async () => {
      const input = {
        title: ' Cách Chọn Cua Gạch Cà Mau Ngon ',
        content: 'Nội dung hướng dẫn chọn cua ngon...',
        slug: 'cach-chon-cua-gach-ca-mau-ngon',
      };

      mockBlogRepo.findBySlug.mockResolvedValue(null);
      mockBlogRepo.create.mockResolvedValue({ id: 5, ...input, title: 'Cách Chọn Cua Gạch Cà Mau Ngon' });

      const result = await service.createBlog(input);
      expect(result.id).toBe(5);
      expect(result.title).toBe('Cách Chọn Cua Gạch Cà Mau Ngon');
      expect(mockBlogRepo.create).toHaveBeenCalledWith({
        title: 'Cách Chọn Cua Gạch Cà Mau Ngon',
        content: 'Nội dung hướng dẫn chọn cua ngon...',
        slug: 'cach-chon-cua-gach-ca-mau-ngon',
      });
    });

    it('should create successfully with SEO fields (focus_keyword, canonical_url)', async () => {
      const input = {
        title: 'Cách Chọn Cua Gạch Cà Mau Ngon',
        content: 'Nội dung...',
        slug: 'cach-chon-cua-gach-ca-mau-ngon',
        focus_keyword: 'cua gạch',
        canonical_url: 'https://seafood.vn/cua-gach',
      };

      mockBlogRepo.findBySlug.mockResolvedValue(null);
      mockBlogRepo.create.mockResolvedValue({ id: 5, ...input });

      const result = await service.createBlog(input);
      expect(result.id).toBe(5);
      expect(result.focus_keyword).toBe('cua gạch');
      expect(result.canonical_url).toBe('https://seafood.vn/cua-gach');
      expect(mockBlogRepo.create).toHaveBeenCalledWith(input);
    });

    it('should throw error when title is empty', async () => {
      await expect(service.createBlog({ title: ' ', content: 'Nội dung', slug: 'slug-blog' }))
        .rejects.toThrow('Tiêu đề bài viết không được để trống');
    });

    it('should throw error when content is empty', async () => {
      await expect(service.createBlog({ title: 'Tiêu đề', content: '  ', slug: 'slug-blog' }))
        .rejects.toThrow('Nội dung bài viết không được để trống');
    });

    it('should throw error when slug is empty', async () => {
      await expect(service.createBlog({ title: 'Tiêu đề', content: 'Nội dung', slug: ' ' }))
        .rejects.toThrow('Slug bài viết không được để trống');
    });

    it('should throw error when slug format is invalid', async () => {
      await expect(service.createBlog({ title: 'Tiêu đề', content: 'Nội dung', slug: 'slug_blog' }))
        .rejects.toThrow('Slug không hợp lệ');
    });

    it('should throw error when slug already exists', async () => {
      mockBlogRepo.findBySlug.mockResolvedValue({ id: 1, slug: 'bi-quyet' });
      await expect(service.createBlog({ title: 'Tiêu đề', content: 'Nội dung', slug: 'bi-quyet' }))
        .rejects.toThrow('Slug bi-quyet đã được sử dụng bởi bài viết khác');
    });
  });

  describe('updateBlog', () => {
    it('should update successfully with valid inputs', async () => {
      const existing = { id: 5, title: 'Tiêu đề cũ', content: 'Nội dung cũ', slug: 'slug-cu' };
      mockBlogRepo.findById.mockResolvedValue(existing);
      mockBlogRepo.findBySlug.mockResolvedValue(null);
      mockBlogRepo.update.mockResolvedValue({ ...existing, title: 'Tiêu đề mới' });

      const result = await service.updateBlog(5, { title: 'Tiêu đề mới' });
      expect(result.title).toBe('Tiêu đề mới');
      expect(mockBlogRepo.update).toHaveBeenCalledWith(5, { title: 'Tiêu đề mới' });
    });

    it('should update SEO fields successfully', async () => {
      const existing = { id: 5, title: 'Tiêu đề cũ', content: 'Nội dung cũ', slug: 'slug-cu' };
      mockBlogRepo.findById.mockResolvedValue(existing);
      mockBlogRepo.findBySlug.mockResolvedValue(null);
      mockBlogRepo.update.mockResolvedValue({ ...existing, focus_keyword: 'cua gạch', canonical_url: 'https://seafood.vn/cua-gach' });

      const result = await service.updateBlog(5, { focus_keyword: 'cua gạch', canonical_url: 'https://seafood.vn/cua-gach' });
      expect(result.focus_keyword).toBe('cua gạch');
      expect(result.canonical_url).toBe('https://seafood.vn/cua-gach');
      expect(mockBlogRepo.update).toHaveBeenCalledWith(5, { focus_keyword: 'cua gạch', canonical_url: 'https://seafood.vn/cua-gach' });
    });

    it('should throw error when updating non-existent blog', async () => {
      mockBlogRepo.findById.mockResolvedValue(null);
      await expect(service.updateBlog(5, { title: 'Tiêu đề mới' }))
        .rejects.toThrow('Bài viết với ID 5 không tồn tại');
    });

    it('should throw error when updating to empty title', async () => {
      mockBlogRepo.findById.mockResolvedValue({ id: 5, title: 'T', slug: 's', content: 'C' });
      await expect(service.updateBlog(5, { title: '' }))
        .rejects.toThrow('Tiêu đề bài viết không được để trống');
    });

    it('should throw error when updating to empty content', async () => {
      mockBlogRepo.findById.mockResolvedValue({ id: 5, title: 'T', slug: 's', content: 'C' });
      await expect(service.updateBlog(5, { content: '' }))
        .rejects.toThrow('Nội dung bài viết không được để trống');
    });

    it('should throw error when updating to empty slug', async () => {
      mockBlogRepo.findById.mockResolvedValue({ id: 5, title: 'T', slug: 's', content: 'C' });
      await expect(service.updateBlog(5, { slug: ' ' }))
        .rejects.toThrow('Slug bài viết không được để trống');
    });

    it('should throw error when updating to invalid slug format', async () => {
      mockBlogRepo.findById.mockResolvedValue({ id: 5, title: 'T', slug: 's', content: 'C' });
      await expect(service.updateBlog(5, { slug: 'invalid_slug' }))
        .rejects.toThrow('Slug không hợp lệ');
    });

    it('should throw error when updating to duplicate slug', async () => {
      mockBlogRepo.findById.mockResolvedValue({ id: 5, title: 'T', slug: 'old-slug', content: 'C' });
      mockBlogRepo.findBySlug.mockResolvedValue({ id: 99, slug: 'taken-slug' });
      await expect(service.updateBlog(5, { slug: 'taken-slug' }))
        .rejects.toThrow('Slug taken-slug đã được sử dụng bởi bài viết khác');
    });

    it('should allow updating to same slug as self', async () => {
      const existing = { id: 5, title: 'T', slug: 'same-slug', content: 'C' };
      mockBlogRepo.findById.mockResolvedValue(existing);
      mockBlogRepo.findBySlug.mockResolvedValue({ id: 5, slug: 'same-slug' }); // same id
      mockBlogRepo.update.mockResolvedValue({ ...existing, title: 'New Title' });

      const result = await service.updateBlog(5, { slug: 'same-slug', title: 'New Title' });
      expect(result.title).toBe('New Title');
    });

    it('should throw error when update fails (returns null)', async () => {
      mockBlogRepo.findById.mockResolvedValue({ id: 5, title: 'T', slug: 's', content: 'C' });
      mockBlogRepo.update.mockResolvedValue(null);
      await expect(service.updateBlog(5, { title: 'New Title' }))
        .rejects.toThrow('Cập nhật bài viết ID 5 thất bại');
    });
  });

  describe('deleteBlog', () => {
    it('should soft delete when blog exists', async () => {
      mockBlogRepo.findById.mockResolvedValue({ id: 5, title: 'T', slug: 's' });
      mockBlogRepo.softDelete.mockResolvedValue(true);
      const result = await service.deleteBlog(5);
      expect(result).toBe(true);
      expect(mockBlogRepo.softDelete).toHaveBeenCalledWith(5);
    });

    it('should throw error when blog to delete does not exist', async () => {
      mockBlogRepo.findById.mockResolvedValue(null);
      await expect(service.deleteBlog(99)).rejects.toThrow('Bài viết với ID 99 không tồn tại');
    });
  });
});
