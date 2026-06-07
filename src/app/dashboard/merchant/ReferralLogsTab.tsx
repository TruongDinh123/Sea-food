'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';
import { Merchant } from '@/types/merchant.types';

interface ReferralLogsTabProps {
  merchant: Merchant;
  totalRevenue: number;
}

export default function ReferralLogsTab({ merchant, totalRevenue }: ReferralLogsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in font-sans">
      <div className="md:col-span-2 bg-white rounded-cards border border-[#e5e7eb] shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-xs font-black text-[#0a0a0a] uppercase tracking-wider m-0">
            Chu Kỳ Đối Soát &amp; Tất Toán Tài Chính
          </h3>
          <p className="text-[11px] text-[#d97706] uppercase font-bold tracking-widest mt-0.5 mb-0">
            Tất toán trong 24 giờ sau khi khách kiểm nghiệm cua tôm sống khỏe
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-[#031e25] block uppercase text-[10px] tracking-widest">Đợt Thanh Toán Thứ 47</span>
              <span className="text-gray-400 font-mono">Thời hạn kết phiên: 30/05/2026</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-[#0a0a0a] font-mono block">{totalRevenue.toLocaleString('vi-VN')} đ</span>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase">Đang đối soát</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-[#031e25] block uppercase text-[10px] tracking-widest">Đợt Thanh Toán Thứ 46</span>
              <span className="text-gray-400 font-mono">Thời hạn kết phiên: 15/05/2026</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-[#0a0a0a] font-mono block">8,450,000 đ</span>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase">Đã tất toán xong</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#031e25] text-white p-6 rounded-cards shadow-sm flex flex-col justify-between border border-[#04333f]">
        <div className="space-y-4">
          <CreditCard className="w-8 h-8 text-[#d97706]" />
          <h4 className="text-sm font-black uppercase tracking-wider m-0">Tài khoản thụ hưởng</h4>
          <div className="space-y-2">
            <div>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest block">Ngân Hàng Liên Kết</span>
              <span className="text-xs font-bold text-white">Ngân hàng Nông nghiệp Cà Mau (Agribank)</span>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest block">Tên Tài Khoản Vựa</span>
              <span className="text-xs font-bold text-white uppercase">{merchant.name}</span>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest block">Số Điện Thoại Liên Kết</span>
              <span className="text-xs font-mono text-[#d97706] font-bold">{merchant.phone}</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-white/5 rounded border border-white/10 mt-6 text-[10px] text-gray-300 leading-relaxed">
          *Các đợt thanh toán được hệ thống đối soát tự động và chuyển trực tiếp qua tài khoản vựa sau khi khấu trừ hoa hồng theo hợp đồng.
        </div>
      </div>
    </div>
  );
}
