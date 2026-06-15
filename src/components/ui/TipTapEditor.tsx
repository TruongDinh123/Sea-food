'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Unlink,
  Image as ImageIcon,
  Undo,
  Redo,
  Loader2,
} from 'lucide-react';

interface TipTapEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({ value, onChange, placeholder }: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Tắt Heading mặc định của StarterKit nếu muốn tự cấu hình, hoặc giữ nguyên
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Markdown.configure({
        html: false, // Không serialize HTML thô để giữ markdown sạch
        tightLists: true, // List viết khít dòng
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#d97706] underline underline-offset-2 hover:text-[#031e25] transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'w-full max-w-2xl mx-auto rounded-xl my-5 shadow-sm border border-gray-100',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Bắt đầu viết nội dung tại đây...',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[450px] max-h-[600px] overflow-y-auto px-5 py-4 text-sm text-gray-700 leading-relaxed ProseMirror [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-[#031e25] [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:leading-snug [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-[#031e25] [&>h3]:mt-5 [&>h3]:mb-2 [&>h3]:leading-snug [&>p]:mb-3 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ul]:space-y-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>ol]:space-y-1 [&>blockquote]:border-l-4 [&>blockquote]:border-[#d97706] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-4 [&>blockquote]:py-1 [&>a]:text-[#d97706] [&>a]:underline [&>img]:block [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-xl [&>img]:my-5',
      },
    },
    onUpdate: ({ editor }) => {
      // Lấy chuỗi markdown đã convert từ plugin tiptap-markdown
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const markdown = (editor.storage as any).markdown.getMarkdown();
      onChange(markdown);
    },
  });

  // Đồng bộ giá trị ngoài vào editor (chỉ khi có sự khác biệt thực tế)
  useEffect(() => {
    if (!editor) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentMarkdown = (editor.storage as any).markdown.getMarkdown();
    if (value !== currentMarkdown) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[450px] border border-gray-200 rounded-xl bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-[#031e25]" />
      </div>
    );
  }

  // Thêm / hủy Link
  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Nhập URL liên kết:', previousUrl);

    if (url === null) return; // Nhấn Cancel

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Upload hình ảnh từ máy tính
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/blogs/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        const altText = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        editor.chain().focus().setImage({ src: data.url, alt: altText }).run();
      } else {
        alert(data.error || 'Tải ảnh lên thất bại');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Lỗi máy chủ khi tải ảnh lên');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-1 focus-within:ring-[#031e25] focus-within:border-[#031e25] transition-all">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-1.5 px-3.5 py-2.5 bg-gray-50 border-b border-gray-200 shrink-0 select-none">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer ${
            editor.isActive('bold') ? 'bg-[#031e25] text-white hover:bg-[#031e25]' : 'text-gray-600'
          }`}
          title="Bôi đậm (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer ${
            editor.isActive('italic') ? 'bg-[#031e25] text-white hover:bg-[#031e25]' : 'text-gray-600'
          }`}
          title="In nghiêng (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-gray-200 mx-1" />

        {/* Heading 2 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[#031e25] text-white hover:bg-[#031e25]'
              : 'text-gray-600'
          }`}
          title="Tiêu đề lớn (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        {/* Heading 3 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-[#031e25] text-white hover:bg-[#031e25]'
              : 'text-gray-600'
          }`}
          title="Tiêu đề nhỏ (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-gray-200 mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer ${
            editor.isActive('bulletList') ? 'bg-[#031e25] text-white hover:bg-[#031e25]' : 'text-gray-600'
          }`}
          title="Danh sách dấu chấm"
        >
          <List className="w-4 h-4" />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer ${
            editor.isActive('orderedList') ? 'bg-[#031e25] text-white hover:bg-[#031e25]' : 'text-gray-600'
          }`}
          title="Danh sách số"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer ${
            editor.isActive('blockquote') ? 'bg-[#031e25] text-white hover:bg-[#031e25]' : 'text-gray-600'
          }`}
          title="Trích dẫn"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-gray-200 mx-1" />

        {/* Hyperlink */}
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer ${
            editor.isActive('link') ? 'bg-[#031e25] text-white hover:bg-[#031e25]' : 'text-gray-600'
          }`}
          title="Chèn liên kết"
        >
          <Link2 className="w-4 h-4" />
        </button>

        {/* Unlink */}
        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer text-red-500"
            title="Xóa liên kết"
          >
            <Unlink className="w-4 h-4" />
          </button>
        )}

        {/* Image Upload */}
        <button
          type="button"
          onClick={handleImageUploadClick}
          disabled={isUploading}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          title="Chèn ảnh từ máy tính"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="flex-1" />

        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Hoàn tác (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Làm lại (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* ── Editor Workspace ── */}
      <div className="relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
