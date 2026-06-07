'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'merchant' | 'admin'>('merchant');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

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

    if (hasError) return;

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGeneralError(data.error || 'Đăng nhập thất bại');
        setLoading(false);
        return;
      }

      // Redirect based on role returned from server
      if (data.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/merchant');
      }
    } catch (err) {
      console.error(err);
      setGeneralError('Đã xảy ra lỗi kết nối');
      setLoading(false);
    }
  };

  const handleQuickLogin = async (selectedRole: 'admin' | 'merchant') => {
    setLoading(true);
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    const targetEmail = selectedRole === 'admin' ? 'admin@example.com' : 'merchant@example.com';
    const targetPassword = selectedRole === 'admin' ? 'AdminPassword123!' : 'MerchantPassword123!';

    setEmail(targetEmail);
    setPassword(targetPassword);
    setRole(selectedRole);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: targetEmail, password: targetPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGeneralError(data.error || 'Đăng nhập demo thất bại');
        setLoading(false);
        return;
      }

      if (data.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/merchant');
      }
    } catch (err) {
      console.error(err);
      setGeneralError('Đã xảy ra lỗi kết nối demo');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#f9fafb] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-cards shadow-sm border border-[#e5e7eb]"
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-[#031e25] flex items-center justify-center rounded-lg mb-4">
            <div className="w-6 h-6 border border-[#d97706] rotate-45"></div>
          </div>
          <h2 className="text-2xl font-black text-[#0a0a0a] tracking-tight uppercase m-0">
            Hải Sản Cao Cấp
          </h2>
          <p className="mt-1 text-xs text-[#d97706] uppercase tracking-widest font-black m-0">
            Cổng Kết Nối Độc Bản
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-lg text-[11px] font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => {
              setRole('buyer');
              router.push('/');
            }}
            className={`py-2 text-center rounded-md transition-all cursor-pointer border-0 ${
              role === 'buyer'
                ? 'bg-[#031e25] text-white shadow-sm'
                : 'text-gray-500 hover:text-[#0a0a0a] bg-transparent'
            }`}
          >
            Mua Sỉ
          </button>
          <button
            type="button"
            onClick={() => setRole('merchant')}
            className={`py-2 text-center rounded-md transition-all cursor-pointer border-0 ${
              role === 'merchant'
                ? 'bg-[#031e25] text-white shadow-sm'
                : 'text-gray-500 hover:text-[#0a0a0a] bg-transparent'
            }`}
          >
            Thương Lái
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2 text-center rounded-md transition-all cursor-pointer border-0 ${
              role === 'admin'
                ? 'bg-[#031e25] text-white shadow-sm'
                : 'text-gray-500 hover:text-[#0a0a0a] bg-transparent'
            }`}
          >
            Quản Trị
          </button>
        </div>

        {generalError && (
          <div className="flex items-center gap-2 p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{generalError}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-bold text-[#0a0a0a] uppercase tracking-wider m-0">
                Địa chỉ Email <span className="text-red-500">*</span>
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
                  placeholder={
                    role === 'admin'
                      ? 'admin@example.com'
                      : role === 'merchant'
                      ? 'merchant@example.com'
                      : 'khachhang@example.com'
                  }
                  className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:bg-white focus:ring-1 focus:ring-[#031e25] focus:border-[#031e25] focus:outline-none placeholder-gray-400 text-[#0a0a0a]"
                />
              </div>
              {emailError && (
                <span data-testid="email-error" className="text-xs text-red-600 mt-1 block">
                  {emailError}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center m-0">
                <label className="block text-xs font-bold text-[#0a0a0a] uppercase tracking-wider m-0">
                  Mật khẩu bảo mật <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:bg-white focus:ring-1 focus:ring-[#031e25] focus:border-[#031e25] focus:outline-none placeholder-gray-400 text-[#0a0a0a]"
                />
              </div>
              {passwordError && (
                <span data-testid="password-error" className="text-xs text-red-600 mt-1 block">
                  {passwordError}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            data-testid="login-submit"
            disabled={loading}
            className="w-full mt-6 bg-[#031e25] text-white py-3 px-4 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-opacity-95 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-[#04333f] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Xác thực ký danh</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5e7eb]"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest bg-[#f9fafb]">
            <span className="px-3 text-gray-400">Dành cho Nhà Phát Triển / Demo</span>
          </div>
        </div>

        {/* Quick Logins for high utility */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleQuickLogin('merchant')}
            type="button"
            className="flex flex-col items-center justify-center p-3 border border-[#e5e7eb] rounded-lg bg-white hover:border-[#d97706] hover:bg-[#031e25]/5 transition duration-200 cursor-pointer text-left active:scale-95 group"
          >
            <UserCheck className="w-4 h-4 text-[#d97706] mb-1 group-hover:scale-110 transition" />
            <span className="text-[10px] font-bold text-[#0a0a0a]">Bản thử Thương Lái</span>
            <span className="text-[9px] text-gray-400 font-mono">Vựa Cà Mau</span>
          </button>
          <button
            onClick={() => handleQuickLogin('admin')}
            type="button"
            className="flex flex-col items-center justify-center p-3 border border-[#e5e7eb] rounded-lg bg-white hover:border-[#d97706] hover:bg-[#031e25]/5 transition duration-200 cursor-pointer text-left active:scale-95 group"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition" />
            <span className="text-[10px] font-bold text-[#0a0a0a]">Bản thử Quản Trị</span>
            <span className="text-[9px] text-gray-400 font-mono">Đinh Tiến Quyết</span>
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 m-0">
          Chưa có tài khoản trên hệ thống?{' '}
          <Link
            href="/auth/register-merchant"
            className="font-bold text-[#d97706] hover:underline cursor-pointer decoration-transparent"
          >
            Đăng ký làm đối tác thương lái
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
