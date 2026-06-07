'use client';

import React from 'react';
import { Plus, ShieldCheck } from 'lucide-react';
import { Merchant } from '@/types/merchant.types';
import { Product } from '@/types/product.types';

type TabId = 'overview' | 'products' | 'orders' | 'payouts' | 'profile';

interface DashboardLayoutProps {
  merchant: Merchant;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  products: Product[];
  pendingOrdersCount: number;
  onAddProduct: () => void;
  onLogout: () => void;
}

export default function DashboardLayout({
  merchant,
  activeTab,
  setActiveTab,
  products,
  pendingOrdersCount,
  onAddProduct,
  onLogout,
}: DashboardLayoutProps) {
  const tabs = [
    { id: 'overview' as TabId, label: 'Tóm Tắt Vận Hành', count: 0 },
    { id: 'products' as TabId, label: 'Quản Lý Thủy Sản', count: products.length },
    { id: 'orders' as TabId, label: 'Xử Lý Đơn Hàng', count: pendingOrdersCount },
    { id: 'payouts' as TabId, label: 'Chu Kỳ Đối Soát', count: 0 },
    { id: 'profile' as TabId, label: 'Cập Nhật Hồ Sơ', count: 0 },
  ];

  return (
    <>
      {/* Premium Merchant Header */}
      <div className="bg-[#031e25] text-white py-12 px-4 shadow-inner border-b border-[#04333f]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white shrink-0 flex items-center justify-center rounded-lg overflow-hidden border-2 border-[#d97706]/60">
              <div className="w-full h-full bg-amber-50 text-[#d97706] flex items-center justify-center font-black text-xl">
                {merchant.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight uppercase text-white m-0">
                  {merchant.name}
                </h1>
                <span className="bg-[#198754] text-white text-[9px] px-2 py-0.5 rounded uppercase font-black tracking-widest flex items-center gap-0.5 shadow-sm">
                  <ShieldCheck className="w-2.5 h-2.5" /> VietGAP
                </span>
              </div>
              <p className="text-xs text-gray-300 font-mono mt-0.5 mb-0">
                Kênh giao thương chính thức của vựa thương lái tại hệ thống đầm Cà Mau
              </p>
              <p className="text-[10px] text-[#d97706] mt-1 mb-0 font-bold uppercase tracking-widest">
                Chỉ số đối soát hoa hồng: {merchant.commission_value} {merchant.commission_type === 'percentage' ? '%' : 'đ'} ({merchant.commission_type})
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onAddProduct}
              className="bg-[#d97706] border-0 text-white text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-lg hover:bg-opacity-95 active:scale-95 transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Đăng thủy sản mới
            </button>
            <button
              onClick={onLogout}
              className="bg-transparent text-white border border-white/20 text-[10px] font-bold uppercase tracking-widest px-4 py-3 rounded-lg hover:bg-white/5 active:scale-95 transition cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[#e5e7eb] bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 text-xs font-bold uppercase tracking-wider relative cursor-pointer border-0 border-b-2 transition-all bg-transparent ${
                activeTab === tab.id
                  ? 'border-b-[#d97706] text-[#031e25]'
                  : 'border-transparent text-gray-500 hover:text-[#031e25]'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1.5 bg-[#d97706] text-white rounded-full text-[9px] px-1.5 py-0.5 font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
