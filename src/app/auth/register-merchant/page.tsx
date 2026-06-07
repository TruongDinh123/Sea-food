'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Mail, Lock, User, FileText, ArrowRight, ShieldCheck, MapPin, Phone } from 'lucide-react';

export default function RegisterMerchantPage() {
  const router = useRouter();
  const [merchantName, setMerchantName] = useState('');
  const [email, setEmail] = useState('');
  const [merchantPhone, setMerchantPhone] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Năm Căn, Cà Mau');
  const [merchantAddress, setMerchantAddress] = useState('');
  const [experience, setExperience] = useState('5');
  const [agreed, setAgreed] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setPhoneError('');
    setGeneralError('');
    setSuccessMessage('');

    let hasError = false;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Email không hợp lệ');
      hasError = true;
    }

    // Validate password
    if (password.length < 6) {
      setPasswordError('Mật khẩu phải từ 6 ký tự trở lên');
      hasError = true;
    }

    // Validate phone number
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    if (!phoneRegex.test(merchantPhone.trim())) {
      setPhoneError('Số điện thoại không hợp lệ');
      hasError = true;
    }

    if (!agreed) {
      alert('Bạn cần chấp thuận cam kết bảo mật & tiêu chuẩn thủy sản OCOP.');
      return;
    }

    if (hasError) return;

    setLoading(true);

    try {
      // Kết nối địa chỉ với vùng khai thác đã chọn để tăng chất lượng dữ liệu địa lý
      const combinedAddress = merchantAddress.trim() + `, ${location}`;

      const res = await fetch('/api/auth/register-merchant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_name: merchantName,
          merchant_phone: merchantPhone,
          merchant_address: combinedAddress,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGeneralError(data.error || 'Đăng ký tài khoản thất bại');
        setLoading(false);
        return;
      }

      setSuccessMessage('Đăng ký tài khoản thương lái thành công!');
      setLoading(false);

      // Auto login redirect after success
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    } catch (err) {
      console.error(err);
      setGeneralError('Đã xảy ra lỗi kết nối');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#f9fafb] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl w-full space-y-8 bg-white p-8 rounded-cards shadow-sm border border-[#e5e7eb]"
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-[#031e25] flex items-center justify-center rounded-lg mb-4">
            <div className="w-6 h-6 border border-[#d97706] rotate-45"></div>
          </div>
          <h2 className="text-2xl font-black text-[#0a0a0a] tracking-tight uppercase m-0">
            Gia Nhập Chuỗi Cung Ứng
          </h2>
          <p className="mt-1 text-xs text-[#d97706] uppercase tracking-widest font-black m-0">
            Liên Kết Hệ Thống Vựa Thượng Hạng
          </p>
        </div>

        {generalError && (
          <div className="flex items-center gap-2 p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg">
            <ShieldCheck className="w-4 h-4 shrink-0 text-red-500" />
            <span className="font-medium">{generalError}</span>
          </div>
        )}

        {successMessage ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-3"
            data-testid="register-success-message"
          >
            <ShieldCheck className="w-12 h-12 text-[#198754] mx-auto animate-bounce" />
            <h3 className="text-base font-black text-emerald-800 uppercase m-0">Đăng Ký Thành Công!</h3>
            <p className="text-xs text-[#0a0a0a] m-0">
              Hệ thống đã phê duyệt hồ sơ thương lái của bạn. Bạn đang được tự động chuyển đến trang đăng nhập...
            </p>
          </motion.div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-bold text-[#0a0a0a] uppercase tracking-wider mb-0">
                  Tên Vựa / Đại diện <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    placeholder="Ví dụ: Vựa Hải Sản Chú Sáu Đầm"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-bold text-[#031e25] uppercase tracking-wider mb-0">
                  Hòm thư liên hệ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ngocdiep@example.com"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
                  />
                </div>
                {emailError && (
                  <span data-testid="email-error" className="text-xs text-red-600 mt-1 block">
                    {emailError}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-bold text-[#0a0a0a] uppercase tracking-wider mb-0">
                  Số điện thoại đối tác <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={merchantPhone}
                    onChange={(e) => setMerchantPhone(e.target.value)}
                    placeholder="0987654321"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
                  />
                </div>
                {phoneError && (
                  <span className="text-xs text-red-600 mt-1 block">
                    {phoneError}
                  </span>
                )}
              </div>

              {/* Location Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-bold text-[#0a0a0a] uppercase tracking-wider mb-0">
                  Vùng đầm khai thác <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
                  >
                    <option value="Năm Căn, Cà Mau">Năm Căn, Cà Mau (Vựa Cua Son)</option>
                    <option value="Sông Đốc, Cà Mau">Sông Đốc, Cà Mau (Vựa Sú Khơi)</option>
                    <option value="Phú Quốc, Kiên Giang">Phú Quốc, Kiên Giang (Khô Cao Cấp)</option>
                    <option value="Trần Văn Thời, Cà Mau">Trần Văn Thời (Đầm Thủy Sản)</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-bold text-[#031e25] uppercase tracking-wider mb-0">
                  Mật khẩu bảo mật <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu ít nhất 6 ký tự"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
                  />
                </div>
                {passwordError && (
                  <span data-testid="password-error" className="text-xs text-red-600 mt-1 block">
                    {passwordError}
                  </span>
                )}
              </div>

              {/* Experience */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-bold text-[#0a0a0a] uppercase tracking-wider mb-0">
                  Kinh nghiệm làm đầm (năm)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a] font-mono"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="block text-xs font-bold text-[#0a0a0a] uppercase tracking-wider mb-0">
                  Địa chỉ chi tiết vựa <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={merchantAddress}
                  onChange={(e) => setMerchantAddress(e.target.value)}
                  placeholder="Ví dụ: Số 123 Bến Tàu Năm Căn Tây..."
                  className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
                />
              </div>
            </div>

            {/* Terms check */}
            <div className="flex items-start mt-4">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-3.5 w-3.5 text-[#031e25] focus:ring-[#d97706] border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 block text-[11px] text-[#0a0a0a]/80 leading-relaxed select-none cursor-pointer">
                Tôi cam kết toàn bộ hải sản do vựa thu mua đều có nguồn gốc tự nhiên dạt chuẩn vệ sinh ATVSTP, cam kết lạt trói đay siêu mảnh dưới 10g, không bơm thạch cua, không ngâm hóa chất giữ tươi, tuân thủ tiêu chuẩn đầm thủy sản sạch **VietGAP / IUU** xuất khẩu.
              </label>
            </div>

            <button
              type="submit"
              data-testid="register-submit"
              disabled={loading}
              className="w-full mt-6 bg-[#031e25] text-white py-3 px-4 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-opacity-95 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-[#04333f] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Gửi biểu mẫu phê duyệt vựa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5e7eb]"></div>
          </div>
          <div className="relative flex justify-center text-xs bg-white">
            <span className="px-3 text-gray-400 font-medium">Bảo mật cấp bởi Deepwater SSL</span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 m-0">
          Đã đăng ký tài khoản từ trước?{' '}
          <Link
            href="/auth/login"
            className="font-bold text-[#d97706] hover:underline cursor-pointer bg-transparent border-none-p decoration-transparent"
          >
            Đăng nhập hệ thống quản lý
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
