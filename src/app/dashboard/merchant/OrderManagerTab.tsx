'use client';

import React from 'react';
import { Order } from '@/types/order.types';

interface OrderManagerTabProps {
  orders: Order[];
  orderStatuses: Record<number, string>;
  setOrderStatuses: (v: Record<number, string>) => void;
  updatingOrderId: number | null;
  onUpdateStatus: (orderId: number) => void;
}

const statusLabels: Record<string, string> = {
  pending: 'Chờ chuẩn bị',
  processing: 'Đang chuẩn bị',
  shipping: 'Giao hàng lạnh',
  completed: 'Đã giao sống',
  cancelled: 'Đã hủy đơn',
};

export default function OrderManagerTab({
  orders,
  orderStatuses,
  setOrderStatuses,
  updatingOrderId,
  onUpdateStatus,
}: OrderManagerTabProps) {
  return (
    <div className="bg-white rounded-cards border border-[#e5e7eb] shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-[#e5e7eb]">
        <h3 className="text-xs font-black text-[#0a0a0a] uppercase tracking-wider m-0">
          Theo Dõi Hành Trình Đơn Hàng Sỉ Lẻ
        </h3>
        <p className="text-[11px] text-[#d97706] uppercase font-bold tracking-widest mt-0.5 mb-0">
          Cập nhật quy chuẩn sục khí oxy và đóng thùng trung chuyển
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              <th className="py-4 px-6">Mã Đơn Đặt</th>
              <th className="py-4 px-2">Họ Tên Người Mua</th>
              <th className="py-4 px-2">Điện Thoại Nhận</th>
              <th className="py-4 px-2 text-right">Tổng Thanh Toán</th>
              <th className="py-4 px-2 text-center">Trạng Thái Hiện Tại</th>
              <th className="py-4 px-6 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-sans">
            {orders.map(o => (
              <tr key={o.id} data-order-id={o.id} className="hover:bg-gray-50/70 transition">
                <td className="py-4 px-6 font-mono text-[11px] text-[#031e25] font-black tracking-tight">
                  #{o.id}
                </td>
                <td className="py-4 px-2 font-bold text-[#0a0a0a]">
                  {o.buyer_name || 'Khách vãng lai'}
                </td>
                <td className="py-4 px-2 font-mono text-gray-500">
                  {o.buyer_phone || '-'}
                </td>
                <td className="py-4 px-2 text-right font-mono font-extrabold text-[#d97706]">
                  {o.order_value.toLocaleString('vi-VN')} đ
                </td>
                <td className="py-4 px-2 text-center">
                  <span className={`inline-block text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded ${
                    o.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : o.status === 'shipping'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-yellow-50 text-[#d97706] border border-yellow-200'
                  }`}>
                    {statusLabels[o.status] || o.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <select
                      name="order_status"
                      value={orderStatuses[o.id] || o.status}
                      onChange={(e) =>
                        setOrderStatuses({ ...orderStatuses, [o.id]: e.target.value })
                      }
                      disabled={o.status === 'completed' || o.status === 'cancelled'}
                      className="bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-deepwater)] disabled:opacity-50"
                    >
                      <option value="pending">Chờ chuẩn bị</option>
                      <option value="processing">Đang chuẩn bị</option>
                      <option value="shipping">Giao hàng lạnh</option>
                      <option value="completed">Đã giao sống</option>
                      <option value="cancelled">Đã hủy đơn</option>
                    </select>
                    <button
                      onClick={() => onUpdateStatus(o.id)}
                      data-testid="update-status-btn"
                      disabled={
                        o.status === 'completed' ||
                        o.status === 'cancelled' ||
                        updatingOrderId === o.id
                      }
                      className="bg-[#031e25] hover:bg-opacity-95 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-0"
                    >
                      {updatingOrderId === o.id ? '...' : 'Lưu'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  Vựa chưa nhận được đơn đặt hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
