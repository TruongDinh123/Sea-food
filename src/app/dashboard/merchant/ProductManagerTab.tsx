'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, X, ShieldAlert, Pencil, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Product } from '@/types/product.types';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const TipTapEditor = dynamic(() => import('@/components/ui/TipTapEditor'), { ssr: false });

interface ProductManagerTabProps {
  products: Product[];
  // --- Edit Modal ---
  showEditModal: boolean;
  setShowEditModal: (v: boolean) => void;
  editProductData: Partial<Product> | null;
  setEditProductData: (v: Partial<Product> | null) => void;
  editError: string;
  onEditProduct: (e: React.FormEvent) => void;
  // --- Delete Modal ---
  confirmDeleteId: number | null;
  setConfirmDeleteId: (v: number | null) => void;
  onDeleteProduct: () => void;
}

const CATEGORIES = [
  { value: 'cua-bien', label: 'Cua Biển Cà Mau' },
  { value: 'tom-su', label: 'Tôm Sú Quảng Canh' },
  { value: 'do-kho', label: 'Đồ Khô Cao Cấp' },
];

export default function ProductManagerTab({
  products,
  showEditModal, setShowEditModal,
  editProductData, setEditProductData,
  editError,
  onEditProduct,
  confirmDeleteId, setConfirmDeleteId,
  onDeleteProduct,
}: ProductManagerTabProps) {

  const router = useRouter();
  const [isUploadingEdit, setIsUploadingEdit] = useState(false);
  const [uploadEditError, setUploadEditError] = useState('');

  const editFileRef = useRef<HTMLInputElement>(null);



  const handleUpload = async (
    file: File,
    setUrl: (url: string) => void,
    setLoading: (v: boolean) => void,
    setError: (msg: string) => void,
  ) => {
    setLoading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/products/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Lỗi tải ảnh lên');
      } else {
        setUrl(data.url);
      }
    } catch {
      setError('Lỗi kết nối máy chủ khi tải ảnh');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* TAB: PRODUCTS */}
      <div className="bg-white rounded-cards border border-[#e5e7eb] shadow-sm overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-[#e5e7eb] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xs font-black text-[#0a0a0a] uppercase tracking-wider m-0">
              Danh Mục Sản Vật Của Vựa
            </h3>
            <p className="text-[11px] text-[#d97706] uppercase font-bold tracking-widest mt-0.5 mb-0">
              Kiểm soát chất lượng loại 1 &amp; Cập nhật thời giá đầm
            </p>
          </div>

          <button
            onClick={() => router.push('/dashboard/merchant/san-pham/tao-moi')}
            data-testid="add-product-btn"
            className="bg-[#031e25] border-0 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-opacity-90 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tạo dòng cua/tôm bán
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                <th className="py-4 px-6">Hải Sản Tuyển Chọn</th>
                <th className="py-4 px-2">Nhóm Sản Vật</th>
                <th className="py-4 px-2 text-right">Giá Công Bố (kg)</th>
                <th className="py-4 px-6 text-center">Tác Vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-4 px-6 font-medium text-[#0a0a0a]">
                    <span className="font-bold block">{p.name}</span>
                    <span className="text-[9px] text-gray-400 font-mono">{p.slug}</span>
                    {p.meta_description && (
                      <span className="text-[9px] text-emerald-600 font-mono block mt-0.5 truncate max-w-[240px]" title={p.meta_description}>
                        SEO: {p.meta_description}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-2 text-[#031e25] font-semibold uppercase">
                    {p.category || 'Chưa phân loại'}
                  </td>
                  <td className="py-4 px-2 text-right font-mono font-bold text-[#d97706]">
                    {p.price.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditProductData(p);
                          setShowEditModal(true);
                        }}
                        className="p-1.5 text-gray-500 hover:text-[#031e25] hover:bg-blue-50 border border-blue-100 rounded-md transition cursor-pointer bg-transparent"
                        title="Chỉnh sửa sản phẩm"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(p.id)}
                        data-testid="delete-product-btn"
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 border border-red-100 rounded-md transition cursor-pointer bg-transparent"
                        title="Ngừng bán"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    Vựa của bạn chưa đăng mặt hàng thủy sản nào đợt này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>



      {/* ===== Modal Chỉnh sửa sản phẩm ===== */}
      {showEditModal && editProductData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-cards p-6 max-w-lg w-full border border-[var(--color-canvas)] shadow-xl relative max-h-[90vh] overflow-y-auto font-sans"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-[#031e25] uppercase tracking-wider m-0">
                ✏️ Chỉnh sửa sản phẩm
              </h3>
              <button
                onClick={() => { setShowEditModal(false); setEditProductData(null); }}
                className="text-gray-400 hover:text-gray-600 p-1 border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-200 font-semibold">
                {editError}
              </div>
            )}

            <form onSubmit={onEditProduct} className="space-y-4 text-xs">
              {/* Tên */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={editProductData.name ?? ''}
                  onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Slug</label>
                <input
                  type="text"
                  value={editProductData.slug ?? ''}
                  onChange={(e) => setEditProductData({ ...editProductData, slug: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] font-mono text-[#0a0a0a]"
                />
              </div>

              {/* Giá */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Giá sỉ (đ/kg) *</label>
                  <input
                    type="number"
                    value={editProductData.price ?? ''}
                    onChange={(e) => setEditProductData({ ...editProductData, price: Number(e.target.value) })}
                    required
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] font-mono text-[#0a0a0a]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Giá lẻ (Gốc)</label>
                  <input
                    type="number"
                    value={editProductData.original_price ?? ''}
                    onChange={(e) => setEditProductData({ ...editProductData, original_price: e.target.value ? Number(e.target.value) : null })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] font-mono text-[#0a0a0a]"
                  />
                </div>
              </div>

              {/* Danh mục */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Nhóm ngành hàng</label>
                <select
                  value={editProductData.category ?? 'cua-bien'}
                  onChange={(e) => setEditProductData({ ...editProductData, category: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Mô tả */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Mô tả sản phẩm</label>
                <textarea
                  value={editProductData.description ?? ''}
                  onChange={(e) => setEditProductData({ ...editProductData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
                />
              </div>

              {/* Meta Description SEO */}
              <div className="space-y-1.5 bg-emerald-50/60 border border-emerald-200 rounded-lg p-3">
                <label className="block text-[10px] font-black uppercase text-emerald-700 font-mono">
                  🔍 Meta Description SEO (Tối đa 160 ký tự)
                </label>
                <textarea
                  value={editProductData.meta_description ?? ''}
                  onChange={(e) => setEditProductData({ ...editProductData, meta_description: e.target.value })}
                  placeholder="Mô tả ngắn gọn xuất hiện trên kết quả Google..."
                  rows={2}
                  maxLength={160}
                  className="w-full bg-white border border-emerald-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[#0a0a0a]"
                />
                <p className="text-[10px] text-emerald-600 font-mono m-0">
                  {(editProductData.meta_description ?? '').length}/160 ký tự
                </p>
              </div>

              {/* Focus Keyword */}
              <div className="space-y-1.5 bg-purple-50/40 border border-purple-200 rounded-lg p-3">
                <label className="block text-[10px] font-black uppercase text-purple-700 font-mono">
                  🎯 Từ Khóa SEO Chính (Focus Keyword)
                </label>
                <input
                  type="text"
                  value={editProductData.focus_keyword ?? ''}
                  onChange={(e) => setEditProductData({ ...editProductData, focus_keyword: e.target.value || null })}
                  placeholder="vd: cua biển Cà Mau"
                  className="w-full bg-white border border-purple-200 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400 text-[#0a0a0a]"
                />
                <p className="text-[10px] text-purple-500 font-mono m-0">
                  Từ khóa chính Google nên thấy nhiều nhất trên trang
                </p>
              </div>

              {/* Canonical URL */}
              <div className="space-y-1.5 bg-gray-50 border border-gray-200 rounded-lg p-3">
                <label className="block text-[10px] font-black uppercase text-gray-500 font-mono">
                  🔗 Canonical URL tùy chỉnh
                </label>
                <input
                  type="url"
                  value={editProductData.canonical_url ?? ''}
                  onChange={(e) => setEditProductData({ ...editProductData, canonical_url: e.target.value || null })}
                  placeholder="https://haisancc.vn/san-pham/ten-san-pham"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-600"
                />
                <p className="text-[10px] text-gray-400 font-mono m-0">
                  Để trống = tự canonical về chính trang này (khuyến nghị)
                </p>
              </div>

              {/* Mô tả chi tiết (TipTap) */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">
                  📝 Nội Dung Chi Tiết Sản Phẩm (có ảnh, tiêu đề SEO)
                </label>
                <TipTapEditor
                  value={editProductData.description_detail ?? ''}
                  onChange={(val) => setEditProductData({ ...editProductData, description_detail: val || null })}
                  placeholder="## Giới Thiệu Sản Phẩm&#10;&#10;Viết nội dung chi tiết về sản phẩm, có thể chèn ảnh, tạo tiêu đề H2/H3..."
                />
                <p className="text-[9px] text-gray-400 font-mono m-0">
                  Nội dung này xuất hiện bên dưới trang sản phẩm — hỗ trợ SEO đầy đủ
                </p>
              </div>

              {/* Upload ảnh */}
              <div className="space-y-2 bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                <label className="block text-[10px] font-black uppercase text-blue-700 font-mono">📸 Ảnh Sản Phẩm</label>
                {editProductData.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={editProductData.image_url} alt="Preview" className="h-24 w-full object-cover rounded-lg border border-blue-200 mb-2" />
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => editFileRef.current?.click()}
                    disabled={isUploadingEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold border border-blue-300 rounded-lg text-blue-700 bg-white hover:bg-blue-50 cursor-pointer disabled:opacity-50 transition"
                  >
                    {isUploadingEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
                    {isUploadingEdit ? 'Đang tải...' : 'Đổi ảnh'}
                  </button>
                  {editProductData.image_url && (
                    <button type="button" onClick={() => setEditProductData({ ...editProductData, image_url: null })} className="text-[10px] text-red-500 hover:underline bg-transparent border-0 cursor-pointer">
                      Xóa ảnh
                    </button>
                  )}
                </div>
                <input
                  ref={editFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await handleUpload(
                        file,
                        (url) => setEditProductData({ ...editProductData, image_url: url }),
                        setIsUploadingEdit,
                        setUploadEditError,
                      );
                    }
                    e.target.value = '';
                  }}
                />
                {uploadEditError && <p className="text-[10px] text-red-600 m-0">{uploadEditError}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditProductData(null); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer bg-transparent"
                >
                  HỦY
                </button>
                <button
                  type="submit"
                  disabled={isUploadingEdit}
                  className="bg-[#031e25] text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-opacity-95 shadow cursor-pointer border-0 disabled:opacity-60"
                >
                  LƯU THAY ĐỔI
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ===== Modal Xác nhận Xóa ===== */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-cards p-6 max-w-sm w-full border border-gray-200 shadow-2xl text-center font-sans">
            <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-2 animate-bounce" />
            <h3 className="text-sm font-black text-red-600 uppercase m-0">Xác nhận xóa sản vật?</h3>
            <p className="text-xs text-gray-500 mb-6 mt-1 leading-relaxed">
              Hành động này sẽ gỡ bỏ vĩnh viễn sản phẩm khỏi danh mục gian hàng sỉ lẻ. Bác có chắc chắn muốn ngưng cung cấp?
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer bg-transparent"
              >
                HỦY
              </button>
              <button
                type="button"
                data-testid="confirm-delete-btn"
                onClick={onDeleteProduct}
                className="bg-red-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-red-700 cursor-pointer border-0"
              >
                XÁC NHẬN XÓA
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
