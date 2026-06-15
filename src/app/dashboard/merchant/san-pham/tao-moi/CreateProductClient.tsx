'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Star,
  Phone,
  MessageSquare,
  FileText,
  Globe,
  Search
} from 'lucide-react';
import { Merchant } from '@/types/merchant.types';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const TipTapEditor = dynamic(() => import('@/components/ui/TipTapEditor'), { ssr: false });

interface CreateProductClientProps {
  merchant: Merchant;
}

const CATEGORIES = [
  { value: 'cua-bien', label: 'Cua Biển Cà Mau' },
  { value: 'tom-su', label: 'Tôm Sú Quảng Canh' },
  { value: 'do-kho', label: 'Đồ Khô Cao Cấp' },
];

export default function CreateProductClient({ merchant }: CreateProductClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---- Form States ----
  const [productName, setProductName] = useState('');
  const [productSlug, setProductSlug] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productOriginalPrice, setProductOriginalPrice] = useState('');
  const [productCategory, setProductCategory] = useState('cua-bien');
  const [productDescription, setProductDescription] = useState('');
  const [productMetaDescription, setProductMetaDescription] = useState('');
  const [productFocusKeyword, setProductFocusKeyword] = useState('');
  const [productDescriptionDetail, setProductDescriptionDetail] = useState('');
  const [productImageUrl, setProductImageUrl] = useState('');

  // ---- Status & Error States ----
  const [priceError, setPriceError] = useState('');
  const [descError, setDescError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tự động tạo slug từ tên sản phẩm
  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/products/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || 'Lỗi tải ảnh lên');
      } else {
        setProductImageUrl(data.url);
      }
    } catch {
      setUploadError('Lỗi kết nối máy chủ khi tải ảnh');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPriceError('');
    setDescError('');
    setSubmitError('');
    setIsSubmitting(true);

    let hasError = false;
    const numericPrice = Number(productPrice);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setPriceError('Giá phải lớn hơn 0');
      hasError = true;
    }
    if (productDescription.length < 10) {
      setDescError('Mô tả sản phẩm phải từ 10 ký tự trở lên');
      hasError = true;
    }
    if (hasError) {
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productName,
          slug: productSlug,
          price: numericPrice,
          original_price: productOriginalPrice ? Number(productOriginalPrice) : null,
          category: productCategory,
          description: productDescription,
          meta_description: productMetaDescription || null,
          focus_keyword: productFocusKeyword || null,
          description_detail: productDescriptionDetail || null,
          image_url: productImageUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.field === 'price') setPriceError(data.error);
        else if (data.field === 'desc') setDescError(data.error);
        else setSubmitError(data.error || 'Lỗi tạo sản phẩm');
        setIsSubmitting(false);
        return;
      }

      alert('Đăng bán sản vật mới thành công!');
      router.push('/dashboard/merchant?tab=products');
      router.refresh();
    } catch (err) {
      console.error(err);
      setSubmitError('Lỗi kết nối máy chủ');
      setIsSubmitting(false);
    }
  };

  // Helper chuyển đổi Markdown sang HTML đơn giản cho phần Live Preview
  const parseMarkdownToHtml = (markdown: string) => {
    if (!markdown) return '';
    if (markdown.startsWith('<')) return markdown;
    return markdown
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>[^<]*<\/li>)/g, '<ul>$1</ul>')
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/^([^<].+)$/gm, (m) => m.startsWith('<') ? m : `<p>${m}</p>`);
  };

  const selectedCategoryLabel = CATEGORIES.find(c => c.value === productCategory)?.label || 'Chưa phân loại';

  return (
    <div className="bg-[#f9fafb] min-h-screen pb-16 font-sans antialiased text-[#0a0a0a]">
      {/* Header tập trung */}
      <div className="bg-[#031e25] text-white py-8 px-4 border-b border-[#04333f] shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <Link
              href="/dashboard/merchant?tab=products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white transition decoration-transparent"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Quay Lại Dashboard
            </Link>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight uppercase text-white m-0">
              Đăng Ký Dòng Sản Vật Mới
            </h1>
            <p className="text-xs text-gray-400 font-mono m-0">
              Thương lái: {merchant.name} &bull; Vùng cung cấp chính: Cà Mau
            </p>
          </div>
        </div>
      </div>

      {/* Grid 2 cột */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CỘT TRÁI: BIỂU MẪU (7 cột) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Thông tin cơ bản */}
            <div className="bg-white rounded-cards border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#031e25] border-l-3 border-[#d97706] pl-3 m-0 mb-2">
                Thông tin sản vật sỉ lẻ
              </h3>

              {/* Tên sản phẩm */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Tên dòng sản vật *</label>
                <input
                  type="text"
                  required
                  name="product_name"
                  placeholder="Ví dụ: Tôm sú thiên nhiên đầm Năm Căn"
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value);
                    setProductSlug(generateSlug(e.target.value));
                  }}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Đường dẫn SEO (Slug) *</label>
                <input
                  type="text"
                  required
                  name="product_slug"
                  placeholder="tom-su-thien-nhien-dam-nam-can"
                  value={productSlug}
                  onChange={(e) => setProductSlug(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] font-mono text-[#0a0a0a]"
                />
              </div>

              {/* Giá */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Giá bán sỉ (đ/kg) *</label>
                  <input
                    type="number"
                    required
                    name="product_price"
                    placeholder="380000"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] font-mono text-[#0a0a0a]"
                  />
                  {priceError && (
                    <span className="text-red-600 text-xs mt-1 block">{priceError}</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Giá lẻ gốc (gợi ý tham chiếu)</label>
                  <input
                    type="number"
                    name="product_original_price"
                    placeholder="450000"
                    value={productOriginalPrice}
                    onChange={(e) => setProductOriginalPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] font-mono text-[#0a0a0a]"
                  />
                </div>
              </div>

              {/* Nhóm ngành hàng */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Nhóm ngành hàng tuyển chọn *</label>
                <select
                  name="product_category"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a] h-10"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Đặc tả nguồn gốc (Mô tả ngắn) */}
            <div className="bg-white rounded-cards border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#031e25] border-l-3 border-[#d97706] pl-3 m-0 mb-2">
                Đặc tả nguồn gốc hải sản (Mô tả ngắn)
              </h3>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Mô tả chất lượng vựa * (tối thiểu 10 ký tự)</label>
                <textarea
                  required
                  name="product_description"
                  placeholder="Mô tả tóm tắt đặc tính sản vật, độ chắc ngọt thớ thịt, chất lượng gạch béo và vùng đánh bắt tự nhiên..."
                  rows={4}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
                />
                {descError && (
                  <span className="text-red-600 text-xs mt-1 block">{descError}</span>
                )}
              </div>
            </div>

            {/* 3. Tải ảnh */}
            <div className="bg-white rounded-cards border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#031e25] border-l-3 border-[#d97706] pl-3 m-0 mb-2">
                Ảnh chụp thực tế tại vựa
              </h3>
              <div className="space-y-3 bg-blue-50/20 border border-blue-100/60 rounded-lg p-4">
                {productImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={productImageUrl} alt="Review" className="h-40 w-full object-cover rounded-lg border border-blue-200" />
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-blue-300 rounded-lg text-blue-700 bg-white hover:bg-blue-50 cursor-pointer disabled:opacity-50 transition"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )}
                    {isUploading ? 'Đang tải ảnh...' : 'Tải ảnh thực tế'}
                  </button>
                  {productImageUrl && (
                    <button
                      type="button"
                      onClick={() => setProductImageUrl('')}
                      className="text-xs text-red-500 hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      Gỡ ảnh
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await handleUpload(file);
                    }
                    e.target.value = '';
                  }}
                />
                {uploadError && <p className="text-xs text-red-600 m-0">{uploadError}</p>}
              </div>
            </div>

            {/* 4. Cấu hình SEO Chuyên Sâu */}
            <div className="bg-white rounded-cards border border-gray-200 p-6 shadow-sm space-y-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#031e25] border-l-3 border-[#d97706] pl-3 m-0 mb-2">
                Cấu hình SEO chuẩn Google (E-E-A-T)
              </h3>

              {/* Từ khóa SEO chính (Focus Keyword) - Teal themed (No Purple!) */}
              <div className="space-y-1.5 bg-teal-50/30 border border-teal-200/60 rounded-lg p-4">
                <label className="block text-[10px] font-black uppercase text-teal-800 font-mono">
                  🎯 Từ Khóa SEO Chính (Focus Keyword)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: cua gạch cà mau giá sỉ"
                  value={productFocusKeyword}
                  onChange={(e) => setProductFocusKeyword(e.target.value)}
                  className="w-full bg-white border border-teal-200 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 text-[#0a0a0a]"
                />
                <p className="text-[10px] text-teal-600 font-mono m-0">
                  Cung cấp từ khóa chính để tối ưu mật độ xuất hiện trên trang.
                </p>
              </div>

              {/* Meta Description SEO - Emerald themed */}
              <div className="space-y-1.5 bg-emerald-50/30 border border-emerald-200/60 rounded-lg p-4">
                <label className="block text-[10px] font-black uppercase text-emerald-800 font-mono">
                  🔍 Meta Description SEO (Tối đa 160 ký tự)
                </label>
                <textarea
                  name="product_meta_description"
                  placeholder="Mô tả ngắn hiển thị trên kết quả tìm kiếm Google..."
                  rows={2}
                  maxLength={160}
                  value={productMetaDescription}
                  onChange={(e) => setProductMetaDescription(e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[#0a0a0a]"
                />
                <div className="flex justify-between items-center text-[10px] text-emerald-600 font-mono">
                  <span>Khuyên dùng: 120-160 ký tự để tối ưu trên Google.</span>
                  <span>{productMetaDescription.length}/160</span>
                </div>
              </div>
            </div>

            {/* 5. Nội dung chi tiết (TipTap) */}
            <div className="bg-white rounded-cards border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#031e25] border-l-3 border-[#d97706] pl-3 m-0 mb-1">
                Bài viết giới thiệu chi tiết sản vật
              </h3>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0 mb-3 leading-relaxed">
                Tận dụng các tiêu đề H2, H3 và hình ảnh để truyền tải độ ngon chắc của hải sản
              </p>
              
              <div className="space-y-1.5">
                <TipTapEditor
                  value={productDescriptionDetail}
                  onChange={setProductDescriptionDetail}
                  placeholder="## Giới Thiệu Dòng Thủy Sản&#10;&#10;Mô tả chi tiết tại đây (Quy trình đánh bắt, chế độ sục khí oxy, đóng thùng xốp...)"
                />
              </div>
            </div>

            {/* Submit error */}
            {submitError && (
              <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 font-semibold shadow-inner">
                {submitError}
              </div>
            )}

            {/* Nút tác vụ */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/dashboard/merchant?tab=products"
                className="px-5 py-3 border border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer bg-white transition decoration-transparent"
              >
                HỦY ĐĂNG
              </Link>
              <button
                type="submit"
                data-testid="save-product"
                disabled={isSubmitting || isUploading}
                className="bg-[#031e25] text-white px-6 py-3.5 text-xs font-black uppercase tracking-widest rounded-lg hover:bg-opacity-95 shadow-md cursor-pointer border-0 disabled:opacity-60 transition active:scale-95 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    ĐANG XỬ LÝ...
                  </>
                ) : (
                  'ĐĂNG BÁN SẢN VẬT'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* CỘT PHẢI: BẢNG XEM TRƯỚC LIVE PREVIEW (5 cột) */}
        <div className="lg:col-span-5">
          <div className="sticky top-8 space-y-6">
            
            {/* Title chỉ dẫn */}
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest font-mono m-0">
                Kính Ngắm Trực Quan (Live Preview)
              </h3>
              <span className="bg-[#d97706] text-white text-[9px] px-2 py-0.5 rounded font-black tracking-widest">
                REALTIME
              </span>
            </div>

            {/* 1. Google SERP Snippet Preview */}
            <div className="bg-white rounded-cards border border-gray-200 p-5 shadow-sm space-y-3 font-sans">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                <Globe className="w-3.5 h-3.5 text-emerald-600" /> Xem trước kết quả Google Search
              </div>
              <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 space-y-1.5">
                {/* Brand icon and name */}
                <div className="flex items-center gap-2 text-xs text-[#202124]">
                  <div className="w-4 h-4 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[8px] font-black text-[#d97706]">
                    H
                  </div>
                  <span className="text-[11px] text-slate-600 truncate">https://haisancc.vn/san-pham/{productSlug || 'slug'}</span>
                </div>
                {/* Page Title */}
                <h4 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-tight m-0 truncate">
                  {productName || 'Tên dòng sản vật mới'} | Giá Vựa Hôm Nay — Hải Sản Cao Cấp
                </h4>
                {/* Meta Description snippet */}
                <p className="text-xs text-[#4d5156] leading-relaxed font-light m-0 line-clamp-2">
                  {productMetaDescription.trim() || 
                   (productDescription ? productDescription.slice(0, 150) + '...' : 'Mua ngay sản vật tươi sống chất lượng loại 1 trực tiếp tại vựa thương lái uy tín Cà Mau. Cam kết sống khỏe đanh, bao đổi trả.')
                  }
                </p>
              </div>
            </div>

            {/* 2. Mobile Page Detail Preview (Thao tác chi tiết giống trên Mobile) */}
            <div id="product-detail-view" className="bg-white rounded-cards border border-gray-200 overflow-hidden shadow-md flex flex-col max-h-[80vh] overflow-y-auto">
              
              {/* Giả lập thanh địa chỉ điện thoại */}
              <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2 shrink-0">
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <div className="bg-white rounded-md text-[10px] text-gray-400 font-mono py-1 px-3 flex-1 overflow-hidden truncate">
                  haisancc.vn/san-pham/{productSlug || 'slug'}
                </div>
              </div>

              {/* Nội dung trang chi tiết */}
              <div className="p-4 sm:p-5 space-y-6">
                
                {/* Thư viện hình ảnh */}
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border border-gray-200 relative shadow-inner">
                  {productImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={productImageUrl}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-slate-100 gap-2">
                      <ImageIcon className="w-10 h-10 stroke-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Hình ảnh thực tế từ vựa</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-[#031e25] text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
                    Ảnh thực tế tại vựa
                  </div>
                </div>

                {/* Phần thông tin tiêu đề và xếp hạng */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                    <span>VÙNG KHAI THÁC: CÀ MAU</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> CÒN TƯƠI SỐNG
                    </span>
                  </div>
                  <h1 className="text-base sm:text-lg font-black uppercase text-[#031e25] tracking-tight leading-tight m-0">
                    {productName || 'Tên dòng sản vật'}
                  </h1>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                      <Star className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                      <Star className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                      <Star className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                      <Star className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                    </div>
                    <span className="text-xs font-black text-gray-900">5.0</span>
                    <span className="text-[10px] text-gray-400">(Bản xem trước)</span>
                  </div>
                </div>

                {/* Huy hiệu giá lớn */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                      Giá sỉ thu mua trực tiếp
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-base sm:text-lg font-black text-[#d97706] tracking-tight">
                        {productPrice ? Number(productPrice).toLocaleString('vi-VN') : '0'} đ
                      </span>
                      {productOriginalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {Number(productOriginalPrice).toLocaleString('vi-VN')} đ
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono">/kg</span>
                </div>

                {/* Chọn Size mẫu */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#0a0a0a] font-mono">
                    Cỡ con (Size tuyển chọn tiêu chuẩn)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 border border-[#d97706] bg-amber-50/20 text-[10px] font-bold rounded-lg text-[#d97706] flex-1 text-center">
                      Size XL (Hàng Tuyển Chọn)
                    </span>
                    <span className="px-3 py-1.5 border border-gray-200 bg-white text-[10px] font-medium rounded-lg text-gray-400 flex-1 text-center">
                      Size L
                    </span>
                  </div>
                </div>

                {/* Thẻ Thương Lái */}
                <div className="border border-slate-200 p-3.5 rounded-xl flex gap-3 items-start bg-slate-50/50">
                  <div className="w-10 h-10 bg-[#031e25] text-white flex items-center justify-center rounded-full font-black text-sm shrink-0 border border-slate-200">
                    {merchant.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-[8px] tracking-widest font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase font-mono">
                      Vụ Thu Mua Uy Tín Gắn Kết
                    </span>
                    <h4 className="text-xs font-bold text-gray-800 uppercase leading-none m-0">
                      {merchant.name}
                    </h4>
                    <p className="text-[9px] text-gray-400 leading-tight m-0">
                      {merchant.address || 'Đầm Cà Mau'}
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2 pt-1.5">
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 bg-[#031e25]/60 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 border-0 cursor-not-allowed"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#d97706]" />
                    LIÊN HỆ VỰA THƯƠNG LÁI ĐẶT SỈ
                  </button>
                  <button
                    type="button"
                    disabled
                    className="w-full py-2.5 border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl bg-white flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <Phone className="w-3 h-3 text-emerald-600/50" />
                    GỌI NÓNG: {merchant.phone}
                  </button>
                </div>

                {/* Đặc tả nguồn gốc (Đoạn văn mô tả ngắn) */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#031e25] border-l-2 border-[#d97706] pl-2.5 m-0">
                    Đặc tả nguồn gốc hải sản
                  </h4>
                  <div data-testid="product-desc-preview" className="text-[11px] text-gray-600 leading-relaxed font-light text-justify">
                    {productDescription ? (
                      productDescription.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="m-0 mb-2">{paragraph}</p>
                      ))
                    ) : (
                      <p className="text-gray-400 italic m-0">Hãy gõ đặc tả nguồn gốc để xem trước tại đây...</p>
                    )}
                  </div>
                </div>

                {/* Bản xem trước Rich Text Content từ TipTap Editor */}
                {productDescriptionDetail && (
                  <div className="pt-6 border-t border-gray-100 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#031e25] border-l-2 border-[#d97706] pl-2.5 m-0">
                      Giới Thiệu &amp; Nội Dung Chi Tiết
                    </h4>
                    <div
                      className="prose prose-slate max-w-none text-xs
                        [&>h2]:text-sm [&>h2]:font-black [&>h2]:text-gray-900 [&>h2]:uppercase [&>h2]:tracking-tight [&>h2]:mt-4 [&>h2]:mb-2
                        [&>h3]:text-[11px] [&>h3]:font-bold [&>h3]:text-[#031e25] [&>h3]:uppercase [&>h3]:mt-3 [&>h3]:mb-1.5 [&>h3]:border-l-2 [&>h3]:border-[#d97706] [&>h3]:pl-1.5
                        [&>p]:text-slate-600 [&>p]:text-[11px] [&>p]:leading-relaxed [&>p]:font-light [&>p]:mb-2.5
                        [&>strong]:font-bold [&>strong]:text-gray-900
                        [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:space-y-1 [&>ul]:mb-2.5 [&>ul]:text-slate-600 [&>ul]:text-[11px] [&>ul]:font-light
                        [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:space-y-1 [&>ol]:mb-2.5 [&>ol]:text-slate-600 [&>ol]:text-[11px] [&>ol]:font-light
                        [&>blockquote]:border-l-3 [&>blockquote]:border-amber-400 [&>blockquote]:bg-amber-50/40 [&>blockquote]:pl-3 [&>blockquote]:py-1.5 [&>blockquote]:my-3 [&>blockquote]:italic [&>blockquote]:text-slate-500 [&>blockquote]:text-[10px]
                        [&>img]:w-full [&>img]:max-w-md [&>img]:mx-auto [&>img]:rounded-lg [&>img]:my-4 [&>img]:shadow-sm [&>img]:border [&>img]:border-gray-100
                        [&>a]:text-[#d97706] [&>a]:underline"
                      dangerouslySetInnerHTML={{
                        __html: parseMarkdownToHtml(productDescriptionDetail),
                      }}
                    />
                  </div>
                )}

                {/* Huy hiệu SEO Info nếu điền đầy đủ */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    <FileText className="w-3.5 h-3.5 text-[#d97706]" /> Chỉ số tối ưu SEO trên trang
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-[10px] space-y-1.5 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-medium">Nhóm hàng:</span>
                      <span className="font-bold text-gray-700">{selectedCategoryLabel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-medium">Từ khóa SEO chính:</span>
                      <span className="font-bold text-gray-700 font-mono">{productFocusKeyword || 'Chưa điền'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-medium">Đường dẫn chuẩn:</span>
                      <span className="font-bold text-emerald-600 font-mono truncate max-w-[200px]" title={`/san-pham/${productSlug}`}>
                        /san-pham/{productSlug || 'slug'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
