'use client';

/**
 * ContentEditorPanel — Component soạn nội dung + SEO dùng chung cho Blog và Product.
 * - mode="blog"    : Hiện đầy đủ (Cover Image, Author, Publish Date, TOC, SEO Score cho blog)
 * - mode="product" : Chỉ hiện TipTap + Focus Keyword + Meta Description + Canonical
 */

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Check, Loader2 } from 'lucide-react';

const TipTapEditor = dynamic(() => import('../ui/TipTapEditor'), { ssr: false });

// ─── Slugify util ──────────────────────────────────────────────────────────────
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

// ─── SEO Score (chỉ dùng cho mode=blog, có author) ────────────────────────────
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
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  let density = 0;
  let kwCount = 0;
  if (kw && wordCount > 0) {
    try {
      const matches = content.toLowerCase().match(new RegExp(escapeRegExp(kw), 'g'));
      kwCount = matches ? matches.length : 0;
      density = (kwCount / wordCount) * 100;
    } catch { /* ignore */ }
  }

  const mdImages = [...content.matchAll(/!\[(.*?)\]\(.*?\)/g)];
  const allImagesHaveAlt = mdImages.length > 0 ? mdImages.every(m => m[1].trim().length > 0) : true;

  const checks = [
    { label: `Tiêu đề chứa từ khóa chính${kw ? ` ("${focusKeyword}")` : ''}`, pass: !!kw && title.toLowerCase().includes(kw) },
    { label: `Độ dài tiêu đề 50–60 ký tự (hiện tại: ${title.length})`, pass: title.length >= 50 && title.length <= 60 },
    { label: `Meta Description chứa từ khóa chính`, pass: !!kw && metaDesc.toLowerCase().includes(kw) },
    { label: `Meta Description 120–160 ký tự (hiện tại: ${metaDesc.length})`, pass: metaDesc.length >= 120 && metaDesc.length <= 160 },
    {
      label: `Slug chuẩn SEO (viết thường, dùng "-", chứa từ khóa)`,
      pass: slug.trim().length > 0 && slug === slug.toLowerCase() && !slug.includes('_') && (kw ? slug.includes(toSlug(kw)) : true),
    },
    { label: `Nội dung trên 600 từ (hiện tại: ${wordCount} từ)`, pass: wordCount >= 600 },
    { label: `Mật độ từ khóa 0.5–2.5% (hiện tại: ${density.toFixed(1)}% — ${kwCount} lần)`, pass: !!kw && density >= 0.5 && density <= 2.5 },
    { label: `Cấu trúc headings rõ ràng (có H2 và H3)`, pass: /^##\s/m.test(content) && /^###\s/m.test(content) },
    { label: `Ảnh bìa & Alt text ảnh nội dung đầy đủ`, pass: coverImage.trim().length > 0 && allImagesHaveAlt },
    { label: `E-E-A-T: Đã điền thông tin tác giả`, pass: author.trim().length > 0 },
  ];

  const score = Math.round((checks.filter(c => c.pass).length / checks.length) * 100);
  return { score, checks };
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface ContentEditorPanelProps {
  mode: 'blog' | 'product';

  /** Nội dung chính — TipTap (Markdown string) */
  content: string;
  onContentChange: (val: string) => void;

  /** SEO — chung cả 2 mode */
  focusKeyword: string;
  onFocusKeywordChange: (val: string) => void;
  metaDescription: string;
  onMetaDescriptionChange: (val: string) => void;
  canonicalUrl: string;
  onCanonicalUrlChange: (val: string) => void;

  /** Dùng để tính SEO Score và hiện SERP preview */
  title: string;
  slug: string;
  serpUrlPrefix?: string; // ví dụ "haisancc.vn/blog/" hoặc "haisancc.vn/san-pham/"

  /** [blog only] — optional */
  coverImageUrl?: string;
  onCoverImageChange?: (url: string | null) => void;
  author?: string;
  onAuthorChange?: (val: string) => void;
  publishDate?: string; // ISO datetime-local string
  onPublishDateChange?: (val: string) => void;
  isPublished?: boolean;
  onIsPublishedChange?: (v: boolean) => void;

  /** Hiển thị trong layout compact (không có sidebar — dùng trong modal) */
  compact?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ContentEditorPanel({
  mode,
  content,
  onContentChange,
  focusKeyword,
  onFocusKeywordChange,
  metaDescription,
  onMetaDescriptionChange,
  canonicalUrl,
  onCanonicalUrlChange,
  title,
  slug,
  serpUrlPrefix,
  coverImageUrl = '',
  onCoverImageChange,
  author = '',
  onAuthorChange,
  publishDate = '',
  onPublishDateChange,
  compact = false,
}: ContentEditorPanelProps) {
  const [coverError, setCoverError] = useState(false);
  const [coverMode, setCoverMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // SEO computed (chỉ có ý nghĩa đầy đủ ở mode=blog)
  const wordCount = useMemo(() => content.trim().split(/\s+/).filter(Boolean).length, [content]);
  const readTime = useMemo(() => Math.max(1, Math.round(wordCount / 200)), [wordCount]);

  const seo = useMemo(
    () => calcSEOScore({ title, metaDesc: metaDescription, content, coverImage: coverImageUrl, focusKeyword, slug, author }),
    [title, metaDescription, content, coverImageUrl, focusKeyword, slug, author]
  );

  // Màu sắc helper
  const metaCharColor =
    metaDescription.length > 160 ? 'text-red-500' : metaDescription.length >= 120 ? 'text-emerald-500' : 'text-gray-400';
  const seoBarColor = seo.score >= 80 ? 'bg-emerald-500' : seo.score >= 60 ? 'bg-amber-400' : 'bg-red-500';
  const seoLabelColor = seo.score >= 80 ? 'text-emerald-600' : seo.score >= 60 ? 'text-amber-500' : 'text-red-500';

  const urlPrefix = serpUrlPrefix ?? (mode === 'blog' ? 'haisancc.vn/blog/' : 'haisancc.vn/san-pham/');

  // Upload ảnh bìa (chỉ blog)
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onCoverImageChange) return;

    setIsUploading(true);
    setUploadError('');
    setCoverError(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/blogs/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || 'Tải ảnh lên thất bại');
      } else {
        onCoverImageChange(data.url);
      }
    } catch {
      setUploadError('Lỗi kết nối máy chủ khi tải ảnh');
    } finally {
      setIsUploading(false);
    }
  };

  // ─── Layout compact (dùng trong modal product) ────────────────────────────
  if (compact) {
    return (
      <div className="space-y-5">
        {/* TipTap */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black uppercase text-gray-500 font-mono">
            📝 Nội dung chi tiết {mode === 'blog' ? 'bài viết' : 'sản phẩm'}
          </label>
          <TipTapEditor
            value={content}
            onChange={onContentChange}
            placeholder={
              mode === 'blog'
                ? 'Bắt đầu viết nội dung bài viết...'
                : 'Viết mô tả chi tiết sản phẩm (có thể chèn ảnh, heading, danh sách...)'
            }
          />
        </div>

        {/* SEO fields — compact layout */}
        <div className="grid grid-cols-1 gap-4 border border-emerald-100 bg-emerald-50/30 rounded-xl p-4">
          <p className="text-[10px] font-black uppercase text-emerald-700 font-mono m-0">🔍 Cài Đặt SEO</p>

          {/* Focus Keyword */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black uppercase text-gray-500 font-mono">
              Từ Khóa SEO Chính (Focus Keyword)
            </label>
            <input
              type="text"
              value={focusKeyword}
              onChange={e => onFocusKeywordChange(e.target.value)}
              placeholder="vd: cua biển Cà Mau tươi sống"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25]"
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase text-gray-500 font-mono">
                Meta Description (tối đa 160 ký tự)
              </label>
              <span className={`text-[10px] font-mono font-bold ${metaCharColor}`}>
                {metaDescription.length}/160
              </span>
            </div>
            <textarea
              value={metaDescription}
              onChange={e => onMetaDescriptionChange(e.target.value)}
              rows={3}
              placeholder="Mô tả ngắn gọn 120–160 ký tự, plain text, không markdown..."
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] resize-none"
            />
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  metaDescription.length > 160 ? 'bg-red-500' : metaDescription.length >= 120 ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(100, (metaDescription.length / 160) * 100)}%` }}
              />
            </div>
          </div>

          {/* Canonical URL */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black uppercase text-gray-500 font-mono">
              🔗 Canonical URL tùy chỉnh
            </label>
            <input
              type="url"
              value={canonicalUrl}
              onChange={e => onCanonicalUrlChange(e.target.value)}
              placeholder={`https://haisancc.vn/${mode === 'blog' ? 'blog' : 'san-pham'}/${slug || 'ten-slug'}`}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-600"
            />
            <p className="text-[9px] text-gray-400 font-mono m-0">Để trống = tự canonical về chính trang này (khuyến nghị)</p>
          </div>

          {/* SEO Score compact */}
          <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-gray-500 font-mono">SEO Score</span>
              <span className={`text-sm font-black font-mono ${seoLabelColor}`}>
                {seo.score}<span className="text-xs text-gray-400">/100</span>
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${seoBarColor}`}
                style={{ width: `${seo.score}%` }}
              />
            </div>
            <div className="space-y-1.5">
              {seo.checks.map((check, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className={`shrink-0 mt-0.5 w-3 h-3 rounded-full flex items-center justify-center border ${
                    check.pass ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-300'
                  }`}>
                    {check.pass && <Check className="w-1.5 h-1.5 text-white" strokeWidth={3} />}
                  </span>
                  <span className={`text-[10px] leading-snug ${check.pass ? 'text-gray-700' : 'text-gray-400'}`}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Layout sidebar (dùng trong BlogEditor full-screen) ───────────────────
  return (
    <aside className="w-full flex flex-col space-y-5 pb-10">
      {/* SERP Preview */}
      <div className="p-2.5 bg-white border border-gray-100 rounded-lg">
        <p className="text-[9px] text-gray-400 font-mono mb-1 uppercase tracking-wider">Google SERP Preview</p>
        <p className="text-[11px] font-bold text-blue-700 leading-snug truncate">
          {title || 'Tiêu đề bài viết...'}
        </p>
        <p className="text-[10px] text-green-700 font-mono truncate">
          {urlPrefix}{slug || 'duong-dan'}
        </p>
        {metaDescription && (
          <p className="text-[10px] text-gray-500 leading-snug mt-0.5 line-clamp-2">{metaDescription}</p>
        )}
      </div>

      {/* Meta Description */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">
            Meta Description *
          </label>
          <span className={`text-[10px] font-mono font-bold ${metaCharColor}`}>
            {metaDescription.length}/160
          </span>
        </div>
        <textarea
          value={metaDescription}
          onChange={e => onMetaDescriptionChange(e.target.value)}
          rows={3}
          placeholder="Mô tả ngắn gọn 120–160 ký tự, hấp dẫn người đọc click từ Google..."
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] resize-none"
        />
        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              metaDescription.length > 160 ? 'bg-red-500' : metaDescription.length >= 120 ? 'bg-emerald-500' : 'bg-amber-400'
            }`}
            style={{ width: `${Math.min(100, (metaDescription.length / 160) * 100)}%` }}
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
          onChange={e => onFocusKeywordChange(e.target.value)}
          placeholder="vd: cua biển Cà Mau"
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25]"
        />
        <p className="text-[9px] text-gray-400 mt-1 font-mono">Dùng để tính SEO Score và lưu vào cơ sở dữ liệu</p>
      </div>

      {/* Canonical URL */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono mb-1.5">
          Canonical URL tùy chỉnh
        </label>
        <input
          type="url"
          value={canonicalUrl}
          onChange={e => onCanonicalUrlChange(e.target.value)}
          placeholder={`https://haisancc.vn/${mode === 'blog' ? 'blog' : 'san-pham'}/${slug || 'slug'}`}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-[#031e25] text-gray-600"
        />
        <p className="text-[9px] text-gray-400 mt-1 font-mono">Để trống = tự canonical về chính trang này (khuyến nghị)</p>
      </div>

      {/* ── [blog only] Cover Image ── */}
      {mode === 'blog' && onCoverImageChange && (
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">
              Ảnh bìa bài viết
            </label>
            <div className="flex border border-gray-200 rounded overflow-hidden bg-white">
              {(['upload', 'url'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setCoverMode(m); setUploadError(''); }}
                  className={`px-2 py-0.5 text-[9px] font-bold cursor-pointer border-0 transition-all ${
                    coverMode === m ? 'bg-[#031e25] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {m === 'upload' ? 'Tải file' : 'Nhập URL'}
                </button>
              ))}
            </div>
          </div>

          {coverMode === 'url' ? (
            <input
              type="url"
              value={coverImageUrl}
              onChange={e => { onCoverImageChange(e.target.value || null); setCoverError(false); }}
              placeholder="https://example.com/anh-bia.jpg"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25]"
            />
          ) : (
            <div className="space-y-1.5">
              <div className="relative border border-dashed border-gray-300 rounded-lg p-3 bg-white text-center hover:border-[#031e25] transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileUpload}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="text-[11px] text-gray-500">
                  {isUploading ? (
                    <span className="text-[#d97706] font-bold animate-pulse flex items-center justify-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tải ảnh lên...
                    </span>
                  ) : (
                    <span>📁 Click hoặc kéo thả để tải ảnh</span>
                  )}
                </div>
              </div>
              {uploadError && <p className="text-[9px] text-red-500 font-mono leading-tight">{uploadError}</p>}
            </div>
          )}

          {coverImageUrl && !coverError && (
            <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" onError={() => setCoverError(true)} />
              <button
                type="button"
                onClick={() => { onCoverImageChange(null); setCoverError(false); }}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 border-0 cursor-pointer text-[10px] w-5 h-5 flex items-center justify-center font-bold"
                title="Xóa ảnh"
              >
                ✕
              </button>
            </div>
          )}
          {coverError && <p className="text-[10px] text-red-500 mt-1 font-mono">Không tải được ảnh bìa</p>}
        </div>
      )}

      {/* ── [blog only] Author ── */}
      {mode === 'blog' && onAuthorChange !== undefined && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono mb-1.5">
            Tên Tác Giả (E-E-A-T)
          </label>
          <input
            type="text"
            value={author}
            onChange={e => onAuthorChange(e.target.value)}
            placeholder="Nguyễn Văn A — Chuyên gia hải sản"
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25]"
          />
        </div>
      )}

      {/* ── [blog only] Publish Date ── */}
      {mode === 'blog' && onPublishDateChange !== undefined && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono mb-1.5">
            Lịch Xuất Bản
          </label>
          <input
            type="datetime-local"
            value={publishDate}
            onChange={e => onPublishDateChange(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25]"
          />
        </div>
      )}

      {/* ── [blog only] Stats + SEO Score — ẩn ở product mode ── */}
      {mode === 'blog' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 bg-white border border-gray-200 rounded-xl p-3">
            <div className="text-center">
              <p className="text-lg font-black text-[#031e25] font-mono leading-none">{wordCount}</p>
              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">Số từ</p>
            </div>
            <div className="text-center border-l border-gray-100">
              <p className="text-lg font-black text-[#d97706] font-mono leading-none">{readTime}{`'`}</p>
              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">Phút đọc</p>
            </div>
          </div>

          {/* SEO Score full */}
          <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">SEO Score</span>
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
                  <span className={`shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                    check.pass ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-300'
                  }`}>
                    {check.pass && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
                  </span>
                  <span className={`text-[10px] leading-snug ${check.pass ? 'text-gray-700' : 'text-gray-400'}`}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Product mode: SEO Score đơn giản */}
      {mode === 'product' && (
        <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-gray-500 font-mono">SEO Score</span>
            <span className={`text-sm font-black font-mono ${seoLabelColor}`}>
              {seo.score}<span className="text-xs text-gray-400">/100</span>
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${seoBarColor}`} style={{ width: `${seo.score}%` }} />
          </div>
        </div>
      )}
    </aside>
  );
}
