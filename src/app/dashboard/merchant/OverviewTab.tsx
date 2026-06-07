'use client';

import React from 'react';
import {
  TrendingUp, Package, ArrowUpRight, CheckCircle, Clock,
} from 'lucide-react';
import { Order } from '@/types/order.types';
import { Product } from '@/types/product.types';

interface OverviewTabProps {
  products: Product[];
  orders: Order[];
  totalRevenue: number;
  pendingOrdersCount: number;
  onNavigateToOrders: () => void;
}

const statusLabels: Record<string, string> = {
  pending: 'Chờ chuẩn bị',
  processing: 'Đang chuẩn bị',
  shipping: 'Giao hàng lạnh',
  completed: 'Đã giao sống',
  cancelled: 'Đã hủy đơn',
};

export default function OverviewTab({
  products,
  orders,
  totalRevenue,
  pendingOrdersCount,
  onNavigateToOrders,
}: OverviewTabProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-cards border border-[#e5e7eb] shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div><span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Tổng hải sản đăng bán</span><h3 className="text-xl font-black text-[#0a0a0a] font-mono mt-1 mb-0">{products.length} dòng</h3></div>
            <div className="p-2 bg-[#031e25]/5 rounded-lg"><Package className="w-5 h-5 text-[#d97706]" /></div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#198754] font-bold mt-3 font-mono"><ArrowUpRight className="w-3.5 h-3.5" /> Quản lý thời giá đầm</div>
        </div>
        <div className="bg-white p-5 rounded-cards border border-[#e5e7eb] shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div><span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Doanh thu tạm tính</span><h3 className="text-xl font-black text-[#0a0a0a] font-mono mt-1 mb-0">{totalRevenue.toLocaleString('vi-VN')} đ</h3></div>
            <div className="p-2 bg-[#031e25]/5 rounded-lg"><TrendingUp className="w-5 h-5 text-[#198754]" /></div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#198754] font-bold mt-3 font-mono"><ArrowUpRight className="w-3.5 h-3.5" /> Khớp đơn hàng sỉ lẻ</div>
        </div>
        <div className="bg-white p-5 rounded-cards border border-[#e5e7eb] shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div><span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Đơn chuẩn bị (Oxy)</span><h3 className="text-xl font-black text-[#0a0a0a] font-mono mt-1 mb-0">{pendingOrdersCount} đơn</h3></div>
            <div className="p-2 bg-[#031e25]/5 rounded-lg"><Clock className="w-5 h-5 text-[#d97706]" /></div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold mt-3 uppercase tracking-widest">Cần đóng thùng gây tê</div>
        </div>
        <div className="bg-white p-5 rounded-cards border border-[#e5e7eb] shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div><span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Độ tươi sống cam kết</span><h3 className="text-xl font-black text-[#198754] mt-1 mb-0">100% Sống</h3></div>
            <div className="p-2 bg-[#031e25]/5 rounded-lg"><CheckCircle className="w-5 h-5 text-[#198754]" /></div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold mt-3 font-mono">Bảo hành 1 đổi 1 tận đầm</div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-cards border border-[#e5e7eb] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xs font-black text-[#0a0a0a] uppercase tracking-wider m-0">Phân tích biểu đồ doanh thu hải sản</h3>
            <p className="text-[10px] text-[#d97706] font-bold uppercase mt-0.5 mb-0">Thống kê chu kỳ thu hoạch và khớp lệnh sỉ lẻ (đồng/tuần)</p>
          </div>
          <span className="text-[11px] bg-[#031e25]/5 text-[#0a0a0a] py-1 px-2.5 rounded-lg font-mono font-bold">2026 - Năm Căn Sông Đốc</span>
        </div>
        <div className="w-full h-64 bg-gray-50/50 rounded-lg border border-gray-100 p-4 relative">
          <svg className="w-full h-full" viewBox="0 0 1000 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="50" y1="40" x2="950" y2="40" stroke="#e1e8ed" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="100" x2="950" y2="100" stroke="#e1e8ed" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="160" x2="950" y2="160" stroke="#e1e8ed" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="210" x2="950" y2="210" stroke="#cbd5e1" strokeWidth="1.5" />
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d="M 50 210 L 50 180 L 200 130 L 350 160 L 500 80 L 650 110 L 800 60 L 950 40 L 950 210 Z" fill="url(#chartGradient)" />
            <path d="M 50 180 Q 125 155 200 130 T 350 160 T 500 80 T 650 110 T 800 60 T 950 40" stroke="#031e25" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="180" r="5" fill="#d97706" stroke="#fff" strokeWidth="2" />
            <circle cx="200" cy="130" r="5" fill="#d97706" stroke="#fff" strokeWidth="2" />
            <circle cx="350" cy="160" r="5" fill="#d97706" stroke="#fff" strokeWidth="2" />
            <circle cx="500" cy="80" r="6" fill="#d97706" stroke="#fff" strokeWidth="2" />
            <circle cx="650" cy="110" r="5" fill="#d97706" stroke="#fff" strokeWidth="2" />
            <circle cx="800" cy="60" r="6" fill="#d97706" stroke="#031e25" strokeWidth="3" />
            <circle cx="950" cy="40" r="6" fill="#198754" stroke="#fff" strokeWidth="2" />
            <text x="50" y="225" fill="#64748b" className="text-[10px] font-mono font-bold" textAnchor="middle">Tuần 1</text>
            <text x="200" y="225" fill="#64748b" className="text-[10px] font-mono font-bold" textAnchor="middle">Tuần 2</text>
            <text x="350" y="225" fill="#64748b" className="text-[10px] font-mono font-bold" textAnchor="middle">Tuần 3</text>
            <text x="500" y="225" fill="#64748b" className="text-[10px] font-mono font-bold" textAnchor="middle">Tuần 4</text>
            <text x="650" y="225" fill="#64748b" className="text-[10px] font-mono font-bold" textAnchor="middle">Tuần 5</text>
            <text x="800" y="225" fill="#64748b" className="text-[10px] font-mono font-bold" textAnchor="middle">Tuần 6</text>
            <text x="950" y="225" fill="#64748b" className="text-[10px] font-mono font-bold" textAnchor="middle">Hôm Nay</text>
          </svg>
        </div>
      </div>

      {/* Recent Orders + OCOP Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-cards border border-[#e5e7eb] shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black text-[#0a0a0a] uppercase tracking-wider m-0">Các Đơn Hàng Vừa Nhận Cần Chuẩn Bị</h3>
            <button onClick={onNavigateToOrders} className="text-xs font-bold text-[#d97706] hover:underline cursor-pointer bg-transparent border-0">Xem tất cả đơn hàng &rarr;</button>
          </div>
          <div className="divide-y divide-gray-100">
            {orders.slice(0, 3).map(order => (
              <div key={order.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono text-[11px] text-gray-500 block">#{order.id}</span>
                  <span className="font-bold text-[#0a0a0a]">{order.buyer_name || 'Khách vãng lai'}</span>
                  <span className="text-gray-400"> • Đặt mua sỉ: </span>
                  <span className="font-medium text-[#031e25]">Hải sản tươi sống</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-[#0a0a0a] block">{order.order_value.toLocaleString('vi-VN')} đ</span>
                  <span className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mt-1 ${order.status === 'completed' ? 'bg-[#198754]/10 text-[#198754]' : order.status === 'shipping' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-[#d97706]'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (<div className="py-6 text-center text-gray-500">Chưa có đơn hàng nào được ghi nhận.</div>)}
          </div>
        </div>
        <div className="bg-white rounded-cards border border-[#e5e7eb] shadow-sm p-6 space-y-4">
          <h3 className="text-xs font-black text-[#0a0a0a] uppercase tracking-wider m-0">Mã Lệnh Tươi Sống OCOP</h3>
          <div className="p-4 bg-[#031e25]/5 border-l-4 border-[#d97706] rounded-r-lg space-y-1.5">
            <span className="text-[10px] font-bold text-[#d97706] uppercase tracking-wider block">Tiêu chuẩn Cua Cà Mau</span>
            <p className="text-[11px] text-[#0a0a0a] leading-relaxed m-0">Bao ăn gạch đỏ mịn màng, dây thừng dệt cỏ đay siêu nhỏ nhẹ xơ. Tuyệt đối cấm trói dây to tẩm bùn nặng lừa dối khách hàng sành ăn.</p>
          </div>
          <div className="p-4 bg-[#198754]/5 border-l-4 border-[#198754] rounded-r-lg space-y-1.5">
            <span className="text-[10px] font-bold text-[#198754] uppercase tracking-wider block">Giao Hàng Khẩn Cấp 24H</span>
            <p className="text-[11px] text-[#0a0a0a] leading-relaxed m-0">Xe cá tôm trung chuyển có sục oxy mặn liên tục chạy lạnh, đảm bảo cá tôm khi đến tay khách vẫn khua càng dũng mãnh.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
