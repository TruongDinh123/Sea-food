'use client';

import { useState } from 'react';
import { Star, ShieldCheck, Award, MessageSquare, Phone, FileText, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { EnrichedProduct, EnrichedMerchant } from '@/lib/utils/enrichment';

interface ProductDetailClientProps {
  product: EnrichedProduct;
  merchant: EnrichedMerchant;
  similarProducts: EnrichedProduct[];
}

export default function ProductDetailClient({ product, merchant, similarProducts }: ProductDetailClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryWeight, setInquiryWeight] = useState(1);
  const [inquiryAddress, setInquiryAddress] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock static review list initialized with a consistent review for this product
  const [reviews, setReviews] = useState([
    {
      id: 'rev_1',
      author: 'Đinh Tiến Quyết',
      rating: 5,
      comment: 'Hải sản giao tận nơi mà còn cực kỳ sống động khỏe đanh. Gạch lấp đầy béo đậm đặc bùi ngon cực sướng nụm thịt ngọt lịm đúng chuẩn chất lượng Năm Căn.',
      date: '2026-05-15',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80',
      verified: true
    },
    {
      id: 'rev_2',
      author: 'Khánh Linh Sài Gòn',
      rating: 5,
      comment: 'Cua gạch đầy phơi phới 100% đúng lời vựa cam kết. Ăn ngậy béo bùi ngọt lịm cả nhà đều khen. Sẽ tiếp tục đặt hàng lâu dài.',
      date: '2026-05-20',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
      verified: true
    }
  ]);

  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone || !inquiryAddress) return;

    setLoading(true);
    setError(null);

    try {
      // Gọi API đặt hàng /api/orders thực tế của dự án chính
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_id: merchant.id,
          product_id: product.id,
          quantity: inquiryWeight,
          unit_price: product.price,
          buyer_name: inquiryName,
          buyer_phone: inquiryPhone,
          buyer_address: inquiryAddress,
          payment_method: 'cod',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Đặt hàng không thành công');
      }

      setInquirySubmitted(true);
      setTimeout(() => {
        setInquiryName('');
        setInquiryPhone('');
        setInquiryWeight(1);
        setInquiryAddress('');
        setInquiryMessage('');
      }, 2500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Lỗi kết nối hệ thống');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;

    const newRev = {
      id: `rev_custom_${Date.now()}`,
      author: reviewAuthor,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
      verified: true
    };

    setReviews([newRev, ...reviews]);
    setReviewAuthor('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  return (
    <div id="product-detail-view" className="font-sans text-[#0a0a0a] antialiased space-y-0 py-4">
      {/* Quay lại danh mục */}
      <Link 
        href="/san-pham"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#031e25]/75 hover:text-[#d97706] mb-6 transition cursor-pointer decoration-transparent"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Quay Lại Danh Mục Sản Phẩm
      </Link>

      {/* 1. LAYOUT 2 COT GOLDEN RATIO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-16">
        {/* COT TRAI: Image Gallery, specifications, & details */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-gray-200/60 relative shadow-inner">
              <Image
                src={product.images[activeImageIndex]}
                alt={`Hình thực tế chi tiết ${product.name}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4 bg-[#031e25] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                Ảnh thực tế tại vựa
              </div>
            </div>

            {/* Thumbnail row */}
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                    activeImageIndex === idx ? 'border-[#d97706] ring-2 ring-amber-500/20' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image src={img} alt={`Hình chi tiết ${product.name} số ${idx + 1}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Description & Tab content */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#031e25] border-l-3 border-[#d97706] pl-3 m-0">
                Đặc tả nguồn gốc hải sản
              </h2>
            </div>

            {/* Mô tả ngắn — plain text, hỗ trợ đa đoạn văn */}
            <div
              className="space-y-3 text-sm text-gray-700 leading-relaxed font-light text-justify"
              aria-label="Mô tả nguồn gốc sản phẩm"
            >
              {product.description
                ? product.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="m-0">{paragraph}</p>
                  ))
                : <p className="text-gray-400 italic m-0">Sản phẩm chưa có mô tả nguồn gốc.</p>
              }
            </div>

            {/* Specifications Box GRID */}
            <div className="bg-slate-50 border border-gray-105 border-gray-200/50 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#031e25] flex items-center gap-1.5 m-0">
                <FileText className="w-4 h-4 text-[#d97706]" /> bảng tiêu chuẩn kiểm định (E-E-A-T)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-gray-200/50">
                    <span className="text-gray-400 font-medium">{spec.key}:</span>
                    <span className="font-bold text-gray-900 text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prep and cooking methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="border border-amber-100/40 bg-amber-50/20 p-5 rounded-2xl space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wide text-amber-800 flex items-center gap-1.5 border-b border-amber-100 pb-1.5 m-0">
                  <CheckCircle className="w-4 h-4 text-[#d97706]" /> Mẹo sơ chế đúng điệu
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-light m-0">
                  {product.prepGuide}
                </p>
              </div>

              <div className="border border-indigo-100/40 bg-indigo-50/10 p-5 rounded-2xl space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wide text-indigo-900 flex items-center gap-1.5 border-b border-indigo-100 pb-1.5 m-0">
                  <Award className="w-4 h-4 text-indigo-500" /> Bí quyết nấu ăn chuẩn bếp
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-light m-0">
                  {product.recipe}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COT PHAI: Order parameters, Merchant widgets */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">
                <span>VÙNG KHAI THÁC: {product.harvestLocation.split(',')[0]}</span>
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> CÒN TƯƠI SỐNG
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black uppercase text-[#031e25] tracking-tight leading-tight m-0">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 text-amber-500">
                  <Star className="w-4 h-4 fill-[#d97706]" />
                  <Star className="w-4 h-4 fill-[#d97706]" />
                  <Star className="w-4 h-4 fill-[#d97706]" />
                  <Star className="w-4 h-4 fill-[#d97706]" />
                  <Star className="w-4 h-4 fill-[#d97706]" />
                </div>
                <span className="text-xs font-black text-gray-900">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewsCount} ý kiến khuyên dùng)</span>
              </div>
            </div>

            {/* Large Price Badge */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center">
              <div>
                <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider font-mono">Giá sỉ thu mua trực tiếp</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-[#d97706] tracking-tight">{product.price.toLocaleString('vi-VN')} đ</span>
                  {product.original_price && (
                    <span className="text-xs text-gray-400 line-through">{product.original_price.toLocaleString('vi-VN')} đ</span>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">/{product.unit}</span>
            </div>

            {/* Selection tags specification */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#0a0a0a] font-mono">Cỡ con (Size tuyển chọn)</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz, i) => (
                  <span key={i} className="px-3.5 py-2 border border-gray-200 bg-white hover:border-[#d97706] text-xs font-semibold rounded-lg text-gray-700 cursor-pointer text-center flex-1">
                    {sz}
                  </span>
                ))}
              </div>
              <span className="block text-[10px] text-gray-400 italic">Mặc định: lạt buộc mỏng sinh học siêu nhẹ bảo hiểm.</span>
            </div>

            {/* Merchant card detailed */}
            <div className="border border-slate-200/70 p-4 rounded-xl flex gap-3.5 items-start">
              <Image
                src={merchant.avatar}
                alt={merchant.name}
                width={48}
                height={48}
                className="rounded-full object-cover shrink-0 border border-slate-200"
              />
              <div className="space-y-1.5 flex-1">
                <span className="text-[9px] tracking-widest font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase font-mono">
                  Vụ Thu Mua Uy Tín Gắn Kết
                </span>
                <h4 className="text-xs font-bold text-gray-800 hover:text-[#d97706] transition cursor-pointer underline flex items-center gap-1 leading-none uppercase m-0">
                  <Link href={`/thuong-lai/${merchant.slug}`} className="text-inherit decoration-transparent">
                    {merchant.name.split(' - ')[0]}
                  </Link>
                </h4>
                <p className="text-[10px] text-gray-400 leading-tight m-0">
                  {merchant.location} &bull; {merchant.experience.split(' ')[0]} năm trong nghề
                </p>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setContactModalOpen(true)}
                className="w-full py-4 bg-[#031e25] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#031e25]/90 focus:outline-none transition active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 border-0"
              >
                <MessageSquare className="w-4 h-4 text-[#d97706]" />
                LIÊN HỆ VỰA THƯƠNG LÁI ĐẶT SỈ
              </button>
              <button
                onClick={() => {
                  alert(`Đang kết nối cuộc gọi khẩn cấp đến thương lái ${merchant.name.split(' - ')[0]} số ${merchant.contactPhone}! Vui lòng đợi trong giây lát.`);
                }}
                className="w-full py-3.5 border border-slate-300 hover:border-[#0a0a0a] text-[#0a0a0a] text-xs font-black uppercase tracking-widest rounded-xl focus:outline-none transition bg-white cursor-pointer hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                GỌI NÓNG: {merchant.contactPhone}
              </button>
            </div>
          </div>

          {/* Shipping commitment EEAT card */}
          <div className="bg-[#031e25] text-white p-6 rounded-2xl space-y-3.5 border border-[#04333f]">
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-[#d97706] flex items-center gap-1.5 m-0">
              <ShieldCheck className="w-4 h-4" /> chính sách bao sống khỏe đanh
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-light m-0">
              Mọi đơn tôm cua xuất bến Năm Căn được sục khí oxy liên tiếp 24/7. Toàn bộ cua được kiểm định chặt tay từng con trước khi vô rổ nạp hơi. Hệ thống chi trả hoàn toàn tiền nếu chết ngộp khi nhận.
            </p>
          </div>
        </div>
      </div>

      {/* 2. CUSTOMER REVIEWS FEED */}
      <section id="product-reviews-section" className="py-16 border-t border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Review List feed */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-1.5 pb-2 border-b border-gray-200">
              <h3 className="text-xs font-black tracking-widest uppercase text-amber-600 font-mono m-0">Bảo chứng niềm tin thực tế</h3>
              <p className="text-2xl font-extrabold uppercase tracking-tight text-[#0a0a0a] m-0">Đánh Giá Khách Săn Sỉ Thượng Hạng</p>
            </div>

            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-6 bg-white border border-gray-205 border-gray-200 rounded-2xl shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3.5 items-center">
                      <Image src={rev.avatar} alt={rev.author} width={40} height={40} className="rounded-full object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-gray-900 m-0">{rev.author}</h4>
                          {rev.verified && (
                            <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded font-bold font-mono uppercase">
                              Đã mua hàng
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex gap-0.5 text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 font-light leading-relaxed m-0">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form input to write new review */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 border border-gray-100 rounded-2xl p-6 lg:p-8 space-y-4">
              <div className="pb-2 border-b border-gray-200/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 m-0">Để lại phản hồi thực tế</h4>
                <p className="text-[10px] text-gray-500 leading-tight m-0">Ý kiến chân thực của quý đối tác giúp khẳng định uy tín thương lái.</p>
              </div>

              {reviewSuccess && (
                <div className="bg-emerald-50 text-emerald-800 p-3.5 text-xs rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Gửi đánh giá thành công! Dữ liệu đang được kiểm duyệt.
                </div>
              )}

              <form onSubmit={handleAddReview} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 font-mono">Tên Người Đánh Giá</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A..."
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#031e25]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 font-mono">Xếp hạng sao</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5/5 Tuyệt phẩm tươi chắc</option>
                    <option value="4">⭐⭐⭐⭐ 4/5 Chất lượng tốt</option>
                    <option value="3">⭐⭐⭐ 3/5 Bình thường</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 font-mono">Ý Kiến Thực Tế</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Cua gạch đầy ú chắc nịch, thịt ngọt thơm chuẩn Năm Cân..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#031e25]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-[#031e25] text-white text-[10px] font-extrabold uppercase tracking-widest rounded-lg hover:bg-opacity-95 shadow-sm cursor-pointer transition flex items-center justify-center gap-1.5 border-0"
                  >
                    <Send className="w-3.5 h-3.5 text-[#d97706]" /> Gửi Đánh Giá Vựa
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIMILAR PRODUCTS SECTION */}
      {similarProducts.length > 0 && (
        <section id="similar-products-section" className="py-12 border-t border-gray-200">
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#0a0a0a] border-l-3 border-[#d97706] pl-3 leading-none m-0">
              Sản Vật Liên Đới Cùng Vựa
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {similarProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/san-pham/${prod.slug}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md cursor-pointer transition decoration-transparent block text-inherit"
                >
                  <div className="h-40 relative overflow-hidden">
                    <Image src={prod.images[0]} alt={prod.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="text-xs font-bold text-gray-950 uppercase truncate m-0">{prod.name}</h4>
                    <p className="text-xs font-black text-amber-600 m-0">{prod.price.toLocaleString('vi-VN')} đ/{prod.unit}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT INQUIRY FLOATING OVERLAY MODAL */}
      {contactModalOpen && (
        <div id="contact-merchant-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 lg:p-8 space-y-6 relative shadow-2xl border border-gray-100 font-sans">
            <div className="space-y-1.5 pr-8">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#d97706] font-mono">Bến Thổ Thu Mua Năm Căn</span>
              <h3 className="text-base sm:text-lg font-black uppercase text-[#031e25] tracking-tight leading-tight m-0">Yêu Cầu Kết Nối Sỉ Trực Tiếp</h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed m-0">
                Đơn yêu cầu sẽ được chuyển đến thương lái <span className="font-bold underline">{merchant.name.split(' - ')[0]}</span>. Thương lái sẽ liên hệ với bạn trong vòng 5-10 phút để báo giá gốc sỉ xe bồn oxy mặn.
              </p>
            </div>

            {inquirySubmitted ? (
              <div className="space-y-4 py-8 text-center">
                <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase text-gray-900 m-0">Giao dịch sẵn sàng!</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed m-0">
                    Đã gửi thành công yêu cầu đặt mua. Thương lái {merchant.name.split(' - ')[0]} sẽ liên hệ bạn trực tiếp qua số điện thoại {merchant.contactPhone}.
                  </p>
                </div>
                <button
                  onClick={() => setContactModalOpen(false)}
                  className="px-6 py-2 bg-[#031e25] text-white text-xs font-bold uppercase tracking-wider rounded-lg border-0 cursor-pointer"
                >
                  Đồng ý
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded text-xs border border-red-200">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 font-mono">Họ tên đối tác</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A (Nhà hàng, Quán ăn...)"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#031e25]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400 font-mono">Điện thoại liên hệ</label>
                    <input
                      type="tel"
                      required
                      placeholder="09xx.xxx.xxx"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#031e25]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400 font-mono">Số lượng muốn đặt (kg)</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={inquiryWeight}
                      onChange={(e) => setInquiryWeight(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#031e25]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 font-mono">Địa chỉ giao hàng</label>
                  <input
                    type="text"
                    required
                    placeholder="Địa chỉ chi tiết nhận hàng..."
                    value={inquiryAddress}
                    onChange={(e) => setInquiryAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#031e25]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 font-mono">Ghi chú yêu cầu riêng</label>
                  <textarea
                    rows={2}
                    placeholder="Quy chuẩn đặt hàng riêng (ví dụ: cần cua nhiều gạch, giao gấp sáng mai...)"
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#031e25]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setContactModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer bg-transparent"
                  >
                    HỦY
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-[#031e25] text-white font-black uppercase tracking-wider rounded-lg hover:bg-opacity-95 shadow cursor-pointer border-0 disabled:opacity-50"
                  >
                    {loading ? 'Đang gửi...' : 'GỬI THƯƠNG LÁI'}
                  </button>
                </div>
              </form>
            )}

            {/* Absolute close btn */}
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold p-1 text-sm font-mono border-0 bg-transparent cursor-pointer"
            >
              Ⅹ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
