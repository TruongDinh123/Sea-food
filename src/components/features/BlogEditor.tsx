'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  ChevronLeft, Eye, EyeOff,
  Heading2, Heading3, Bold, Italic,
  List, ListOrdered, Quote, Link2, ImageIcon,
  Minus, Check,
} from 'lucide-react';
import type { Blog } from '@/types/blog.types';

// ─── Kiểu dữ liệu save ────────────────────────────────────────────────────────
export interface BlogSaveData {
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  cover_image_url: string | null;
  is_published: boolean;
  publish_date: Date | null;
  focus_keyword: string | null;
  canonical_url: string | null;
}

// ─── Markdown renderer đơn giản (không cần thư viện) ─────────────────────────
function renderMarkdown(md: string): string {
  if (!md) return '';

  // Escape HTML trước
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Block-level: Headers
  html = html
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-[#031e25] mt-6 mb-2 leading-snug">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-[#031e25] mt-8 mb-3 leading-snug">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-[#031e25] mt-8 mb-4 leading-snug">$1</h1>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="my-6 border-gray-200" />');

  // Blockquote
  html = html.replace(
    /^&gt; (.+)$/gm,
    '<blockquote class="border-l-4 border-[#d97706] pl-4 italic text-gray-600 my-4 py-1">$1</blockquote>'
  );

  // Inline: Bold trước Italic
  html = html
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-[#0a0a0a]">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-gray-800">$1</em>');

  // Images trước Links
  html = html
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="w-full rounded-xl my-5 shadow-sm" />'
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-[#d97706] underline underline-offset-2 hover:text-[#031e25] transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
    );

  // Lists
  html = html
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal text-sm leading-relaxed text-gray-700">$1</li>')
    .replace(/^\* (.+)$/gm, '<li class="ml-5 list-disc text-sm leading-relaxed text-gray-700">$1</li>');

  // Wrap consecutive <li> trong <ul>/<ol>
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, (match) => {
    return `<ul class="my-3 space-y-1">${match}</ul>`;
  });

  // Paragraphs: Dòng không phải tag HTML
  html = html.replace(
    /^(?!<[hbuiopal]|\s*$)(.+)$/gm,
    '<p class="text-sm leading-relaxed text-gray-700 mb-3">$1</p>'
  );

  return html;
}

// ─── Tính SEO Score ───────────────────────────────────────────────────────────
function calcSEOScore(params: {
  title: string;
  metaDesc: string;
  content: string;
  coverImage: string;
  focusKeyword: string;
  slug: string;
  author: string;
}) {
  const { title, metaDesc, content, coverImage, focusKeyword, slug, author } = params;
  const kw = focusKeyword.toLowerCase().trim();
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Tính mật độ từ khóa
  let density = 0;
  let kwCount = 0;
  if (kw && wordCount > 0) {
    try {
      const matches = content.toLowerCase().match(new RegExp(escapeRegExp(kw), 'g'));
      kwCount = matches ? matches.length : 0;
      density = (kwCount / wordCount) * 100;
    } catch (e) {
      console.error(e);
    }
  }

  // Kiểm tra alt text của các ảnh trong markdown
  const mdImages = [...content.matchAll(/!\[(.*?)\]\(.*?\)/g)];
  const allImagesHaveAlt = mdImages.length > 0 ? mdImages.every(m => m[1].trim().length > 0) : true;

  const checks = [
    {
      label: `Tiêu đề chứa từ khóa chính (${kw ? `"${focusKeyword}"` : 'chưa nhập từ khóa'})`,
      pass: !!kw && title.toLowerCase().includes(kw),
    },
    {
      label: `Độ dài tiêu đề tối ưu 50–60 ký tự (hiện tại: ${title.length} ký tự)`,
      pass: title.length >= 50 && title.length <= 60,
    },
    {
      label: `Meta Description chứa từ khóa chính`,
      pass: !!kw && metaDesc.toLowerCase().includes(kw),
    },
    {
      label: `Meta Description tối ưu 120–160 ký tự (hiện tại: ${metaDesc.length} ký tự)`,
      pass: metaDesc.length >= 120 && metaDesc.length <= 160,
    },
    {
      label: `Slug chuẩn SEO (viết thường, dùng "-", không dùng "_", chứa từ khóa)`,
      pass: slug.trim().length > 0 && 
            slug === slug.toLowerCase() && 
            !slug.includes('_') && 
            (!!kw ? slug.includes(toSlug(kw)) : true),
    },
    {
      label: `Nội dung trên 600 từ (hiện tại: ${wordCount} từ)`,
      pass: wordCount >= 600,
    },
    {
      label: `Mật độ từ khóa chính lý tưởng 0.5% - 2.5% (hiện tại: ${density.toFixed(1)}% - ${kwCount} lần)`,
      pass: !!kw && density >= 0.5 && density <= 2.5,
    },
    {
      label: `Cấu trúc headings phân cấp rõ ràng (bài viết có thẻ H2 và H3)`,
      pass: /^##\s/m.test(content) && /^###\s/m.test(content),
    },
    {
      label: `Ảnh bìa & Tối ưu hóa ảnh nội dung (Có ảnh bìa, toàn bộ ảnh bài viết có Alt text)`,
      pass: coverImage.trim().length > 0 && allImagesHaveAlt,
    },
    {
      label: `Độ tin cậy E-E-A-T (Bài viết đã điền thông tin tác giả)`,
      pass: author.trim().length > 0,
    },
  ];

  const score = Math.round((checks.filter((c) => c.pass).length / checks.length) * 100);

  return { score, checks };
}

// ─── Slugify util ─────────────────────────────────────────────────────────────
function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface BlogEditorProps {
  blog?: Blog | null;
  onSave: (data: BlogSaveData) => Promise<void>;
  onClose: () => void;
  isSaving?: boolean;
  error?: string;
  success?: string;
}

// ─── Component chính ──────────────────────────────────────────────────────────
export default function BlogEditor({
  blog,
  onSave,
  onClose,
  isSaving,
  error,
  success,
}: BlogEditorProps) {
  // Core fields
  const [title, setTitle] = useState(blog?.title ?? '');
  const [slug, setSlug] = useState(blog?.slug ?? '');
  const [metaDesc, setMetaDesc] = useState(blog?.meta_description ?? '');
  const [content, setContent] = useState(blog?.content ?? '');
  const [coverImage, setCoverImage] = useState(blog?.cover_image_url ?? '');
  const [isPublished, setIsPublished] = useState(blog?.is_published ?? true);
  const [publishDate, setPublishDate] = useState(
    blog?.publish_date
      ? new Date(blog.publish_date).toISOString().slice(0, 16)
      : ''
  );

  // Trường SEO — lưu vào DB
  const [focusKeyword, setFocusKeyword] = useState(blog?.focus_keyword ?? '');
  const [canonicalUrl, setCanonicalUrl] = useState(blog?.canonical_url ?? '');
  const [author, setAuthor] = useState('');

  // UI state
  const [showPreview, setShowPreview] = useState(true);
  const [mobileTab, setMobileTab] = useState<'write' | 'preview' | 'seo'>('write');
  const [coverError, setCoverError] = useState(false);
  const [coverMode, setCoverMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isUploadingContent, setIsUploadingContent] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  // ─── Computed ──────────────────────────────────────────────────────────────
  const wordCount = useMemo(
    () => content.trim().split(/\s+/).filter(Boolean).length,
    [content]
  );
  const readTime = useMemo(() => Math.max(1, Math.round(wordCount / 200)), [wordCount]);
  const previewHtml = useMemo(() => renderMarkdown(content), [content]);
  const seo = useMemo(
    () => calcSEOScore({ title, metaDesc, content, coverImage, focusKeyword, slug, author }),
    [title, metaDesc, content, coverImage, focusKeyword, slug, author]
  );

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!blog) setSlug(toSlug(val));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    setCoverError(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/blogs/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || 'Tải ảnh lên thất bại');
      } else {
        setCoverImage(data.url);
      }
    } catch (err) {
      console.error(err);
      setUploadError('Lỗi kết nối máy chủ khi tải ảnh');
    } finally {
      setIsUploading(false);
    }
  };

  // Chèn markdown vào vị trí con trỏ
  const insertWrap = useCallback(
    (before: string, after = '', placeholder = 'text') => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = content.slice(start, end) || placeholder;
      const next =
        content.slice(0, start) + before + selected + after + content.slice(end);
      setContent(next);
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(start + before.length, start + before.length + selected.length);
      }, 0);
    },
    [content]
  );

  // Chèn prefix đầu dòng
  const insertPrefix = useCallback(
    (prefix: string) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      const next = content.slice(0, lineStart) + prefix + content.slice(lineStart);
      setContent(next);
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(start + prefix.length, start + prefix.length);
      }, 0);
    },
    [content]
  );

  const handleSubmit = async () => {
    await onSave({
      title,
      slug,
      content,
      meta_description: metaDesc,
      cover_image_url: coverImage.trim() || null,
      is_published: isPublished,
      publish_date: publishDate ? new Date(publishDate) : null,
      focus_keyword: focusKeyword.trim() || null,
      canonical_url: canonicalUrl.trim() || null,
    });
  };

  // Upload ảnh vào nội dung markdown (chèn tại vị trí cursor)
  const handleContentImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingContent(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/blogs/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        // Chèn markdown tại vị trí cursor hiện tại
        const ta = textareaRef.current;
        const altText = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        const mdImg = `![${altText}](${data.url})`;
        if (ta) {
          const start = ta.selectionStart;
          const next = content.slice(0, start) + '\n' + mdImg + '\n' + content.slice(start);
          setContent(next);
          setTimeout(() => { ta.focus(); ta.setSelectionRange(start + mdImg.length + 2, start + mdImg.length + 2); }, 0);
        } else {
          setContent((c) => c + '\n' + mdImg + '\n');
        }
      }
    } catch (err) {
      console.error('Upload content image error:', err);
    } finally {
      setIsUploadingContent(false);
      // Reset input để có thể upload lại cùng file
      if (contentImageInputRef.current) contentImageInputRef.current.value = '';
    }
  }, [content]);

  // ─── Màu sắc cảnh báo ký tự ───────────────────────────────────────────────
  const titleCharColor =
    title.length > 60
      ? 'text-red-500'
      : title.length > 50
      ? 'text-amber-500'
      : 'text-gray-400';

  const metaCharColor =
    metaDesc.length > 160
      ? 'text-red-500'
      : metaDesc.length >= 120
      ? 'text-emerald-500'
      : 'text-gray-400';

  const seoBarColor =
    seo.score >= 80 ? 'bg-emerald-500' : seo.score >= 60 ? 'bg-amber-400' : 'bg-red-500';

  const seoLabelColor =
    seo.score >= 80
      ? 'text-emerald-600'
      : seo.score >= 60
      ? 'text-amber-500'
      : 'text-red-500';

  // ─── Toolbar buttons ───────────────────────────────────────────────────────


  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans overflow-hidden">

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white shrink-0 gap-3">
        {/* Quay lại */}
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#031e25] transition cursor-pointer border-0 bg-transparent shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Quay lại</span>
        </button>

        {/* Mobile tabs */}
        <div className="flex lg:hidden border border-gray-200 rounded-lg overflow-hidden shrink-0">
          {(['write', 'preview', 'seo'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wide cursor-pointer border-0 transition ${
                mobileTab === tab
                  ? 'bg-[#031e25] text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab === 'write' ? 'Viết' : tab === 'preview' ? 'Preview' : 'SEO'}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Desktop: toggle preview */}
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#031e25] border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer bg-white transition"
          >
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPreview ? 'Ẩn preview' : 'Bật preview'}
          </button>

          {/* Status selector */}
          <select
            value={isPublished ? 'published' : 'draft'}
            onChange={(e) => setIsPublished(e.target.value === 'published')}
            className="text-xs font-bold border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#031e25] cursor-pointer bg-white"
          >
            <option value="draft">📝 Draft</option>
            <option value="published">🚀 Published</option>
          </select>

          {/* Save */}
          <button
            onClick={handleSubmit}
            disabled={isSaving || !title.trim() || !content.trim()}
            className="bg-[#031e25] text-white px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer border-0 hover:bg-[#04333f] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Đang lưu...' : blog ? 'Lưu thay đổi' : 'Xuất bản'}
          </button>
        </div>
      </div>

      {/* ── BANNER LỖI / THÀNH CÔNG ── */}
      {error && (
        <div className="px-4 py-2 text-xs font-semibold bg-red-50 text-red-700 border-b border-red-200 shrink-0">
          ⚠ {error}
        </div>
      )}
      {success && (
        <div className="px-4 py-2 text-xs font-semibold bg-emerald-50 text-emerald-700 border-b border-emerald-200 shrink-0">
          ✓ {success}
        </div>
      )}

      {/* ── MAIN AREA ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ── SIDEBAR SEO ── */}
        <aside
          className={`w-72 shrink-0 border-r border-gray-200 overflow-y-auto bg-gray-50 ${
            mobileTab === 'seo' ? 'flex' : 'hidden'
          } lg:flex flex-col`}
        >
          <div className="p-4 space-y-5 pb-10">

            {/* Tiêu đề */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">
                  Tiêu đề bài viết *
                </label>
                <span className={`text-[10px] font-mono font-bold ${titleCharColor}`}>
                  {title.length}/60
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Cách hấp cua biển Cà Mau chắc gạch..."
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25]"
              />
              {/* SERP preview mini */}
              <div className="mt-2 p-2.5 bg-white border border-gray-100 rounded-lg">
                <p className="text-[9px] text-gray-400 font-mono mb-1 uppercase tracking-wider">Google SERP Preview</p>
                <p className="text-[11px] font-bold text-blue-700 leading-snug truncate">
                  {title || 'Tiêu đề bài viết...'}
                </p>
                <p className="text-[10px] text-green-700 font-mono truncate">
                  haisancc.vn/blog/{slug || 'duong-dan-bai-viet'}
                </p>
                {metaDesc && (
                  <p className="text-[10px] text-gray-500 leading-snug mt-0.5 line-clamp-2">
                    {metaDesc}
                  </p>
                )}
              </div>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono mb-1.5">
                Đường dẫn SEO (Slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-[#031e25] text-gray-600"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">
                  Meta Description *
                </label>
                <span className={`text-[10px] font-mono font-bold ${metaCharColor}`}>
                  {metaDesc.length}/160
                </span>
              </div>
              <textarea
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                rows={3}
                placeholder="Mô tả ngắn gọn 120–160 ký tự, hấp dẫn người đọc click từ Google..."
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] resize-none"
              />
              {/* Progress bar */}
              <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    metaDesc.length > 160
                      ? 'bg-red-500'
                      : metaDesc.length >= 120
                      ? 'bg-emerald-500'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.min(100, (metaDesc.length / 160) * 100)}%` }}
                />
              </div>
            </div>

            {/* Focus Keyword */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono mb-1.5">
                Từ khóa SEO chính (Focus Keyword)
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="vd: cua biển Cà Mau"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25]"
              />
              <p className="text-[9px] text-gray-400 mt-1 font-mono">
                Dùng để tính SEO Score và được lưu vào cơ sở dữ liệu
              </p>
            </div>

            {/* Canonical URL */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono mb-1.5">
                Canonical URL tùy chỉnh
              </label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://haisancc.vn/blog/slug-chinh-xac"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-[#031e25] text-gray-600"
              />
              <p className="text-[9px] text-gray-400 mt-1 font-mono">
                Để trống = tự canonical về chính trang này (khuyến nghị)
              </p>
            </div>

            {/* Cover Image */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">
                  Ảnh bìa bài viết
                </label>
                <div className="flex border border-gray-200 rounded overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => { setCoverMode('upload'); setUploadError(''); }}
                    className={`px-2 py-0.5 text-[9px] font-bold cursor-pointer border-0 transition-all ${
                      coverMode === 'upload' ? 'bg-[#031e25] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Tải file
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCoverMode('url'); setUploadError(''); }}
                    className={`px-2 py-0.5 text-[9px] font-bold cursor-pointer border-0 transition-all ${
                      coverMode === 'url' ? 'bg-[#031e25] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Nhập URL
                  </button>
                </div>
              </div>

              {coverMode === 'url' ? (
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => { setCoverImage(e.target.value); setCoverError(false); }}
                  placeholder="https://example.com/anh-bia.jpg"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25]"
                />
              ) : (
                <div className="space-y-1.5">
                  <div className="relative border border-dashed border-gray-300 rounded-lg p-3 bg-white text-center hover:border-[#031e25] transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="text-[11px] text-gray-500">
                      {isUploading ? (
                        <span className="text-[#d97706] font-bold animate-pulse">Đang tải ảnh lên...</span>
                      ) : (
                        <span>📁 Click hoặc kéo thả để tải ảnh</span>
                      )}
                    </div>
                  </div>
                  {uploadError && (
                    <p className="text-[9px] text-red-500 font-mono leading-tight">{uploadError}</p>
                  )}
                </div>
              )}

              {coverImage && !coverError && (
                <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={() => setCoverError(true)}
                  />
                  <button
                    type="button"
                    onClick={() => { setCoverImage(''); setCoverError(false); }}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 border-0 cursor-pointer text-[10px] w-5 h-5 flex items-center justify-center font-bold"
                    title="Xóa ảnh"
                  >
                    ✕
                  </button>
                </div>
              )}
              {coverError && (
                <p className="text-[10px] text-red-500 mt-1 font-mono">Không tải được ảnh bìa</p>
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono mb-1.5">
                Tên Tác Giả (E-E-A-T)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nguyễn Văn A — Chuyên gia hải sản"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25]"
              />
            </div>

            {/* Publish Date */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono mb-1.5">
                Lịch Xuất Bản
              </label>
              <input
                type="datetime-local"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25]"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 bg-white border border-gray-200 rounded-xl p-3">
              <div className="text-center">
                <p className="text-lg font-black text-[#031e25] font-mono leading-none">{wordCount}</p>
                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">Số từ</p>
              </div>
              <div className="text-center border-l border-gray-100">
                <p className="text-lg font-black text-[#d97706] font-mono leading-none">{readTime}{"'"}</p>
                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">Phút đọc</p>
              </div>
            </div>

            {/* SEO Score */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">
                  SEO Score
                </span>
                <span className={`text-base font-black font-mono ${seoLabelColor}`}>
                  {seo.score}<span className="text-xs text-gray-400">/100</span>
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${seoBarColor}`}
                  style={{ width: `${seo.score}%` }}
                />
              </div>
              <div className="space-y-2 pt-1">
                {seo.checks.map((check, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span
                      className={`shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                        check.pass
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {check.pass && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
                    </span>
                    <span
                      className={`text-[10px] leading-snug ${
                        check.pass ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* ── EDITOR PANEL ── */}
        <div
          className={`flex flex-col overflow-hidden ${showPreview ? 'lg:w-[45%]' : 'flex-1'} ${
            mobileTab === 'write' ? 'flex flex-1' : 'hidden lg:flex'
          }`}
          style={{ minWidth: 0 }}
        >
          {/* Markdown Toolbar */}
          <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-white shrink-0 flex-wrap">
            <button
              onClick={() => insertPrefix('## ')}
              title="Tiêu đề H2"
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#031e25] transition cursor-pointer border-0 bg-transparent shrink-0"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertPrefix('### ')}
              title="Tiêu đề H3"
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#031e25] transition cursor-pointer border-0 bg-transparent shrink-0"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>
            
            <div className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
            
            <button
              onClick={() => insertWrap('**', '**', 'in đậm')}
              title="In đậm"
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#031e25] transition cursor-pointer border-0 bg-transparent shrink-0"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertWrap('*', '*', 'in nghiêng')}
              title="In nghiêng"
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#031e25] transition cursor-pointer border-0 bg-transparent shrink-0"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            
            <div className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
            
            <button
              onClick={() => insertPrefix('* ')}
              title="Danh sách đầu dòng"
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#031e25] transition cursor-pointer border-0 bg-transparent shrink-0"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertPrefix('1. ')}
              title="Danh sách đánh số"
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#031e25] transition cursor-pointer border-0 bg-transparent shrink-0"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertPrefix('> ')}
              title="Trích dẫn"
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#031e25] transition cursor-pointer border-0 bg-transparent shrink-0"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setContent((c) => c + '\n\n---\n\n')}
              title="Đường kẻ ngang"
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#031e25] transition cursor-pointer border-0 bg-transparent shrink-0"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            
            <div className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
            
            <button
              onClick={() => insertWrap('[', '](https://)', 'tên liên kết')}
              title="Chèn liên kết"
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#031e25] transition cursor-pointer border-0 bg-transparent shrink-0"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertWrap('![', '](https://)', 'mô tả ảnh')}
              title="Chèn hình ảnh qua URL"
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#031e25] transition cursor-pointer border-0 bg-transparent shrink-0"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            {/* Nút upload ảnh vào nội dung */}
            <div className="relative shrink-0">
              <input
                ref={contentImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleContentImageUpload}
                disabled={isUploadingContent}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                title="Upload ảnh vào nội dung"
              />
              <div
                className={`p-1.5 rounded border-0 bg-transparent shrink-0 flex items-center gap-1 ${
                  isUploadingContent
                    ? 'text-[#d97706] animate-pulse'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-[#031e25] transition cursor-pointer'
                }`}
                title="Upload ảnh vào nội dung"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
            </div>

            <span className="ml-auto text-[9px] text-gray-400 font-mono uppercase tracking-wider shrink-0">
              Markdown
            </span>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`## Bắt đầu viết bài...\n\nSử dụng ## cho tiêu đề H2, ### cho H3\n**in đậm**, *in nghiêng*\n* danh sách\n> trích dẫn`}
            className="flex-1 p-5 text-sm font-mono text-[#0a0a0a] bg-white resize-none focus:outline-none leading-relaxed min-h-0"
          />

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center gap-3 shrink-0">
            <span className="text-[9px] text-gray-400 font-mono">
              ## H2 &nbsp;•&nbsp; **bold** &nbsp;•&nbsp; *italic* &nbsp;•&nbsp; * list &nbsp;•&nbsp; &gt; quote &nbsp;•&nbsp; [link](url)
            </span>
          </div>
        </div>

        {/* ── LIVE PREVIEW ── */}
        {showPreview && (
          <div
            className={`flex-1 overflow-y-auto bg-[#fafafa] border-l border-gray-200 ${
              mobileTab === 'preview' ? 'flex flex-1' : 'hidden lg:block'
            }`}
            style={{ minWidth: 0 }}
          >
            <div className="max-w-2xl mx-auto px-6 py-8 pb-20">
              {/* Cover image preview */}
              {coverImage && !coverError && (
                <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    onError={() => setCoverError(true)}
                  />
                </div>
              )}

              {/* Article heading */}
              <h1 className="text-2xl font-black text-[#031e25] mb-2 leading-tight">
                {title || <span className="text-gray-300">Tiêu đề bài viết...</span>}
              </h1>

              {/* Meta info */}
              {(author || readTime) && (
                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono mb-4">
                  {author && <span>✍️ {author}</span>}
                  <span>⏱ {readTime} phút đọc</span>
                  <span>📝 {wordCount} từ</span>
                </div>
              )}

              {/* Meta description as excerpt */}
              {metaDesc && (
                <p className="text-sm text-gray-500 italic border-l-4 border-[#d97706] pl-4 mb-6 leading-relaxed">
                  {metaDesc}
                </p>
              )}

              {/* Content */}
              {content ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-300 text-sm font-mono">
                    Preview sẽ hiển thị ở đây khi bạn bắt đầu viết...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
