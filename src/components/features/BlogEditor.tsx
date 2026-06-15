'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import type { Blog } from '@/types/blog.types';
import ContentEditorPanel from './ContentEditorPanel';

const TipTapEditor = dynamic(() => import('../ui/TipTapEditor'), { ssr: false });

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

  // ─── Computed ──────────────────────────────────────────────────────────────
  const wordCount = useMemo(
    () => content.trim().split(/\s+/).filter(Boolean).length,
    [content]
  );
  const readTime = useMemo(() => Math.max(1, Math.round(wordCount / 200)), [wordCount]);
  const previewHtml = useMemo(() => renderMarkdown(content), [content]);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!blog) setSlug(toSlug(val));
  };

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
            {/* Tiêu đề + Slug — vẫn giữ ở BlogEditor vì cần handleTitleChange logic */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">
                  Tiêu đề bài viết *
                </label>
                <span className={`text-[10px] font-mono font-bold ${
                  title.length > 60 ? 'text-red-500' : title.length > 50 ? 'text-amber-500' : 'text-gray-400'
                }`}>{title.length}/60</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Cách hấp cua biển Cà Mau chắc gạch..."
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25]"
              />
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

            {/* ContentEditorPanel — SEO + Cover + Author + Publish + Score */}
            <ContentEditorPanel
              mode="blog"
              content={content}
              onContentChange={setContent}
              focusKeyword={focusKeyword}
              onFocusKeywordChange={setFocusKeyword}
              metaDescription={metaDesc}
              onMetaDescriptionChange={setMetaDesc}
              canonicalUrl={canonicalUrl}
              onCanonicalUrlChange={setCanonicalUrl}
              title={title}
              slug={slug}
              serpUrlPrefix="haisancc.vn/blog/"
              coverImageUrl={coverImage}
              onCoverImageChange={(url) => setCoverImage(url ?? '')}
              author={author}
              onAuthorChange={setAuthor}
              publishDate={publishDate}
              onPublishDateChange={setPublishDate}
              isPublished={isPublished}
              onIsPublishedChange={setIsPublished}
            />
          </div>
        </aside>

        {/* ── EDITOR PANEL ── */}
        <div
          className={`flex flex-col overflow-hidden ${showPreview ? 'lg:w-[45%]' : 'flex-1'} ${
            mobileTab === 'write' ? 'flex flex-1' : 'hidden lg:flex'
          }`}
          style={{ minWidth: 0 }}
        >
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col min-h-0">
            <ContentEditorPanel
              mode="blog"
              content={content}
              onContentChange={setContent}
              focusKeyword={focusKeyword}
              onFocusKeywordChange={setFocusKeyword}
              metaDescription={metaDesc}
              onMetaDescriptionChange={setMetaDesc}
              canonicalUrl={canonicalUrl}
              onCanonicalUrlChange={setCanonicalUrl}
              title={title}
              slug={slug}
              compact
            />
          </div>
        </div>

        {/* ── EDITOR PANEL ── */}
        <div
          className={`flex flex-col overflow-hidden ${showPreview ? 'lg:w-[45%]' : 'flex-1'} ${
            mobileTab === 'write' ? 'flex flex-1' : 'hidden lg:flex'
          }`}
          style={{ minWidth: 0 }}
        >
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col min-h-0">
            <TipTapEditor value={content} onChange={setContent} />
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
