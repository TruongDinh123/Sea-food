'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, X, ShieldAlert } from 'lucide-react';
import { Product } from '@/types/product.types';

interface ProductManagerTabProps {
  products: Product[];
  showAddModal: boolean;
  setShowAddModal: (v: boolean) => void;
  productName: string;
  setProductName: (v: string) => void;
  productSlug: string;
  setProductSlug: (v: string) => void;
  productPrice: string;
  setProductPrice: (v: string) => void;
  productOriginalPrice: string;
  setProductOriginalPrice: (v: string) => void;
  productCategory: string;
  setProductCategory: (v: string) => void;
  productDescription: string;
  setProductDescription: (v: string) => void;
  priceError: string;
  descError: string;
  addError: string;
  confirmDeleteId: number | null;
  setConfirmDeleteId: (v: number | null) => void;
  onAddProduct: (e: React.FormEvent) => void;
  onDeleteProduct: () => void;
}

export default function ProductManagerTab({
  products,
  showAddModal,
  setShowAddModal,
  productName,
  setProductName,
  productSlug,
  setProductSlug,
  productPrice,
  setProductPrice,
  productOriginalPrice,
  setProductOriginalPrice,
  productCategory,
  setProductCategory,
  productDescription,
  setProductDescription,
  priceError,
  descError,
  addError,
  confirmDeleteId,
  setConfirmDeleteId,
  onAddProduct,
  onDeleteProduct,
}: ProductManagerTabProps) {
  return (
    <>
      {/* TAB 2: PRODUCTS */}
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
            onClick={() => setShowAddModal(true)}
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
                  </td>
                  <td className="py-4 px-2 text-[#031e25] font-semibold uppercase">
                    {p.category || 'Chưa phân loại'}
                  </td>
                  <td className="py-4 px-2 text-right font-mono font-bold text-[#d97706]">
                    {p.price.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => setConfirmDeleteId(p.id)}
                      data-testid="delete-product-btn"
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 border border-red-100 rounded-md transition cursor-pointer bg-transparent"
                      title="Ngừng bán"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

      {/* Modal Thêm sản phẩm */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-cards p-6 max-w-md w-full border border-[var(--color-canvas)] shadow-xl relative max-h-[90vh] overflow-y-auto font-sans"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-[#031e25] uppercase tracking-wider m-0">
                Đăng ký mặt hàng mới
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-200 font-semibold">
                {addError}
              </div>
            )}

            <form onSubmit={onAddProduct} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Tên dòng sản vật</label>
                <input
                  type="text"
                  name="product_name"
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value);
                    // Tự động tạo slug thân thiện
                    setProductSlug(e.target.value
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/[đĐ]/g, "d")
                      .replace(/[^a-z0-9 -]/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/-+/g, "-")
                    );
                  }}
                  required
                  placeholder="Ví dụ: Tôm sú thiên nhiên size khủng"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Đường dẫn sản phẩm (Slug)</label>
                <input
                  type="text"
                  name="product_slug"
                  value={productSlug}
                  onChange={(e) => setProductSlug(e.target.value)}
                  required
                  placeholder="tom-su-thien-nhien-size-khung"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] font-mono text-[#0a0a0a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Giá bán sỉ (đ/kg)</label>
                  <input
                    type="number"
                    name="product_price"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    required
                    placeholder="350000"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] font-mono text-[#0a0a0a]"
                  />
                  {priceError && (
                    <span data-testid="price-error" className="text-red-600 text-xs mt-1 block">
                      {priceError}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Giá bán lẻ (Gốc)</label>
                  <input
                    type="number"
                    name="product_original_price"
                    value={productOriginalPrice}
                    onChange={(e) => setProductOriginalPrice(e.target.value)}
                    placeholder="400000"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] font-mono text-[#0a0a0a]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Nhóm ngành hàng đầm</label>
                <select
                  name="product_category"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
                >
                  <option value="cua-bien">Cua Biển Cà Mau</option>
                  <option value="tom-su">Tôm Sú Quảng Canh</option>
                  <option value="do-kho">Đồ Khô Cao Cấp</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Mô tả sản phẩm</label>
                <textarea
                  name="product_description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  required
                  placeholder="Mô tả chi tiết thớ thịt, quy cách cỡ con và chất lượng bảo hộ..."
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
                />
                {descError && (
                  <span data-testid="desc-error" className="text-red-600 text-xs mt-1 block">
                    {descError}
                  </span>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer bg-transparent"
                >
                  HỦY
                </button>
                <button
                  type="submit"
                  data-testid="save-product"
                  className="bg-[#031e25] text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-opacity-95 shadow cursor-pointer border-0"
                >
                  ĐĂNG BÁN SẢN VẬT
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal Xác nhận Xóa */}
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
