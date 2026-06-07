'use client';

import { useState, useMemo } from 'react';
import { User, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '@/types/blog.types';

interface BlogListClientProps {
  initialBlogs: Blog[];
}

export default function BlogListClient({ initialBlogs }: BlogListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Do database không có trường category cụ thể cho blog, ta sẽ gán giả lập chủ đề dựa trên tiêu đề
  const enrichedBlogs = useMemo(() => {
    return initialBlogs.map(blog => {
      let category: 'Cẩm Nang' | 'Bảng Giá' | 'Tin Nuôi Trồng' = 'Cẩm Nang';
      if (blog.title.toLowerCase().includes('giá') || blog.title.toLowerCase().includes('hôm nay')) {
        category = 'Bảng Giá';
      } else if (blog.title.toLowerCase().includes('nuôi') || blog.title.toLowerCase().includes('trồng')) {
        category = 'Tin Nuôi Trồng';
      }
      
      const wordCount = blog.content ? blog.content.split(/\s+/).filter(Boolean).length : 0;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      return {
        ...blog,
        category,
        authorName: 'Chú Năm Đất Mũi',
        date: blog.publish_date ? new Date(blog.publish_date).toLocaleDateString('vi-VN') : 'Mới cập nhật',
        readingTime,
      };
    });
  }, [initialBlogs]);

  const filteredBlogs = useMemo(() => {
    if (selectedCategory === 'all') return enrichedBlogs;
    return enrichedBlogs.filter(b => b.category === selectedCategory);
  }, [enrichedBlogs, selectedCategory]);

  return (
    <div id="blog-landing-view" className="space-y-10 font-sans py-4">
      <div className="text-center max-w-3xl mx-auto space-y-3 pb-4">
        <h1 className="text-xs font-black tracking-widest uppercase text-amber-600 font-mono m-0">Kho cẩm nang dã dại</h1>
        <p className="text-2xl sm:text-3xl font-black uppercase text-[#031e25] leading-tight m-0">
          Cẩm Nang Thủy Sản & Bảng Giá Hôm Nay
        </p>
        <p className="text-sm text-gray-500 font-light max-w-xl mx-auto leading-relaxed m-0">
          Những chia sẻ hữu dụng đúc rút từ nhiều thế hệ đầm đìa mặn mòi rạch nước Cà Mau, giúp thực khách sành ăn yên tâm đặt sỉ lẻ.
        </p>
      </div>

      {/* Floating categories switch menu */}
      <div className="flex flex-wrap gap-2.5 justify-center border-b border-gray-200 pb-6 max-w-xl mx-auto">
        {[
          { id: 'all', label: 'TẤT CẢ BÀI ĐĂNG' },
          { id: 'Cẩm Nang', label: 'MẸO CHẾ BIẾN & SĂN CUA' },
          { id: 'Bảng Giá', label: 'BẢNG GIÁ HẢI SẢN ONLINE' },
          { id: 'Tin Nuôi Trồng', label: 'AQACULTURE TIN NUÔI' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition cursor-pointer border-0 ${
              selectedCategory === cat.id
                ? 'bg-[#031e25] text-white'
                : 'text-gray-500 hover:text-[#031e25] hover:bg-gray-100 bg-transparent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Blogs list grids row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredBlogs.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="bg-white border border-gray-205 border-gray-200/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 cursor-pointer flex flex-col group h-full justify-between decoration-transparent text-inherit block"
          >
            <div>
              <div className="h-52 relative overflow-hidden shrink-0 bg-slate-50">
                {post.cover_image_url ? (
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Hình ảnh cẩm nang</div>
                )}
                <span className="absolute top-4 left-4 bg-white/95 text-[#031e25] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded shadow z-10">
                  {post.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold font-mono">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-amber-500" /> {post.authorName.split(' ')[0]}</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {post.readingTime} phút đọc
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-950 uppercase group-hover:text-[#d97706] transition leading-snug line-clamp-2 m-0">
                  {post.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed font-light line-clamp-3 m-0">
                  {post.meta_description}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#031e25] uppercase tracking-wider">
              <span>Khám phá sớ tin</span>
              <span className="text-[#d97706] group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
