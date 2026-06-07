'use client';

import { useState } from 'react';

interface CheckoutFormProps {
  productId: number;
  merchantId: number;
  price: number;
}

export default function CheckoutForm({ productId, merchantId, price }: CheckoutFormProps) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_id: merchantId,
          product_id: productId,
          quantity: quantity,
          unit_price: price,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          buyer_address: buyerAddress,
          payment_method: paymentMethod,
          notes: notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Đặt hàng không thành công');
      }

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Lỗi kết nối mạng');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div 
        id="order-success-message" 
        data-testid="order-success-message"
        className="bg-emerald-50 text-emerald-800 p-6 rounded-cards border border-emerald-200 text-center space-y-2"
      >
        <h3 className="text-lg font-bold">Đặt Hàng Thành Công!</h3>
        <p className="text-sm">Cảm ơn bạn đã mua hàng. Thương lái sẽ liên hệ xác nhận đơn hàng sớm nhất có thể.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--color-white)] p-card-padding rounded-cards border border-[var(--color-canvas)] shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-[var(--color-deepwater)] border-b border-[var(--color-canvas)] pb-2 mb-2">
        Đặt Hàng Nhanh (COD)
      </h3>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Số lượng */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="quantity" className="text-xs font-bold text-[var(--color-ink)]/80 uppercase">
          Số lượng
        </label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
          className="bg-[var(--color-canvas)]/30 border border-[var(--color-canvas)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-deepwater)] w-24"
          required
        />
      </div>

      {/* Họ tên */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="buyer_name" className="text-xs font-bold text-[var(--color-ink)]/80 uppercase">
          Họ và Tên
        </label>
        <input
          type="text"
          id="buyer_name"
          name="buyer_name"
          data-testid="buyer_name"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          placeholder="Nhập họ và tên người nhận"
          className="w-full bg-[var(--color-canvas)]/30 border border-[var(--color-canvas)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-deepwater)]"
          required
        />
      </div>

      {/* Số điện thoại */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="buyer_phone" className="text-xs font-bold text-[var(--color-ink)]/80 uppercase">
          Số Điện Thoại
        </label>
        <input
          type="tel"
          id="buyer_phone"
          name="buyer_phone"
          data-testid="buyer_phone"
          value={buyerPhone}
          onChange={(e) => setBuyerPhone(e.target.value)}
          placeholder="Nhập số điện thoại"
          className="w-full bg-[var(--color-canvas)]/30 border border-[var(--color-canvas)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-deepwater)]"
          required
        />
      </div>

      {/* Địa chỉ */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="buyer_address" className="text-xs font-bold text-[var(--color-ink)]/80 uppercase">
          Địa Chỉ Giao Hàng
        </label>
        <textarea
          id="buyer_address"
          name="buyer_address"
          data-testid="buyer_address"
          value={buyerAddress}
          onChange={(e) => setBuyerAddress(e.target.value)}
          placeholder="Nhập địa chỉ giao hàng chi tiết"
          rows={3}
          className="w-full bg-[var(--color-canvas)]/30 border border-[var(--color-canvas)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-deepwater)]"
          required
        />
      </div>

      {/* Ghi chú */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-xs font-bold text-[var(--color-ink)]/80 uppercase">
          Ghi Chú (tùy chọn)
        </label>
        <textarea
          id="notes"
          name="notes"
          data-testid="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Yêu cầu thêm, thời gian giao hàng..."
          rows={2}
          className="w-full bg-[var(--color-canvas)]/30 border border-[var(--color-canvas)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-deepwater)]"
        />
      </div>

      {/* Phương thức thanh toán */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="payment_method" className="text-xs font-bold text-[var(--color-ink)]/80 uppercase">
          Phương thức thanh toán
        </label>
        <select
          id="payment_method"
          name="payment_method"
          data-testid="payment_method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full bg-[var(--color-canvas)]/30 border border-[var(--color-canvas)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-deepwater)]"
          required
        >
          <option value="cod">Thanh toán khi nhận hàng (COD)</option>
        </select>
      </div>

      {/* Nút Đặt Hàng */}
      <button
        type="submit"
        data-testid="submit-order"
        disabled={loading}
        className="w-full bg-[var(--color-deepwater)] hover:opacity-90 disabled:opacity-50 text-[var(--color-white)] font-bold py-2 px-4 rounded-md text-sm transition-opacity cursor-pointer mt-2"
      >
        {loading ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}
      </button>
    </form>
  );
}
