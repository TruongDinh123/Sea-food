'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Users, Award, FileText, Check, AlertTriangle,
  Calendar, Sparkles,
} from 'lucide-react';
import BlogEditor, { type BlogSaveData } from '@/components/features/BlogEditor';

import { Merchant } from '@/types/merchant.types';
import { ReferralLog } from '@/types/referral.types';
import { Blog } from '@/types/blog.types';

interface AdminDashboardClientProps {
  merchants: Merchant[];
  referralLogs: ReferralLog[];
  blogs: Blog[];
}

export default function AdminDashboardClient({
  merchants: initialMerchants,
  referralLogs: initialReferralLogs,
  blogs,
}: AdminDashboardClientProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'overview' | 'merchants' | 'products' | 'security' | 'blogs'>('overview');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Blog editor state
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [blogError, setBlogError] = useState('');
  const [blogSuccess, setBlogSuccess] = useState('');
  const [blogIsSaving, setBlogIsSaving] = useState(false);

  // Commission modal state
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [commissionType, setCommissionType] = useState<'percentage' | 'fixed' | 'monthly_flat'>('percentage');
  const [commissionValue, setCommissionValue] = useState('');
  const [commissionError, setCommissionError] = useState('');

  // Lọc thương lái chờ duyệt (is_active === false) và đã duyệt (is_active === true)
  const pendingMerchants = initialMerchants.filter(m => !m.is_active);
  const activeMerchants = initialMerchants.filter(m => m.is_active);

  const handleApproveMerchant = async (merchantId: number) => {
    try {
      const res = await fetch('/api/merchants', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: merchantId,
          is_active: true,
        }),
      });

      if (res.ok) {
        alert('Cấp ấn chỉ số VietGAP/OCOP chứng nhận vựa thành công!');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Duyệt thương lái thất bại');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối máy chủ');
    }
  };

  const handleConfigureCommissionClick = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setCommissionType(merchant.commission_type as 'percentage' | 'fixed' | 'monthly_flat');
    setCommissionValue(merchant.commission_value.toString());
    setCommissionError('');
    setShowCommissionModal(true);
  };

  const handleSaveCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMerchant) return;
    setCommissionError('');

    try {
      const res = await fetch('/api/merchants', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedMerchant.id,
          commission_type: commissionType,
          commission_value: Number(commissionValue),
        }),
      });

      if (res.ok) {
        setShowCommissionModal(false);
        setSelectedMerchant(null);
        router.refresh();
      } else {
        const data = await res.json();
        setCommissionError(data.error || 'Lưu cấu hình hoa hồng thất bại');
      }
    } catch (err) {
      console.error(err);
      setCommissionError('Lỗi kết nối máy chủ');
    }
  };

  const handleSaveBlog = async (data: BlogSaveData) => {
    setBlogError('');
    setBlogSuccess('');
    setBlogIsSaving(true);

    const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs';
    const method = editingBlog ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setBlogError(json.error || `${editingBlog ? 'Cập nhật' : 'Tạo'} bài viết thất bại`);
      } else {
        setBlogSuccess(`${editingBlog ? 'Cập nhật' : 'Xuất bản'} bài viết thành công!`);
        setTimeout(() => {
          setShowBlogEditor(false);
          setEditingBlog(null);
          setBlogSuccess('');
          setBlogError('');
        }, 1500);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setBlogError('Lỗi kết nối máy chủ');
    } finally {
      setBlogIsSaving(false);
    }
  };

  const handleEditBlogClick = (blog: Blog) => {
    setEditingBlog(blog);
    setBlogError('');
    setBlogSuccess('');
    setShowBlogEditor(true);
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        const json = await res.json();
        alert(json.error || 'Xóa bài viết thất bại');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối máy chủ');
    }
  };

  const handleCloseBlogEditor = () => {
    setShowBlogEditor(false);
    setEditingBlog(null);
    setBlogError('');
    setBlogSuccess('');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (err) {
      console.error(err);
      router.push('/auth/login');
    }
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen pb-16 font-sans text-[#0a0a0a] antialiased">
      {/* Upper Master Telemetry Control Header */}
      <div className="bg-[#031e25] text-white py-12 px-4 shadow-inner border-b border-[#04333f]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 bg-[#d97706] text-white text-[9px] uppercase font-black tracking-widest rounded-md shadow-sm">
                Trung Tâm Điều Hành
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Phiên bản v4.2 Pro</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase mt-1 mb-0">
              Phần mềm quản trị: Đinh Tiến Quyết (Admin)
            </h1>
            <p className="text-xs text-gray-300 font-mono mt-0.5 mb-0">
              Hệ thống truy xuất nguồn gốc và kiểm soát giá trị lạt trói vùng Đất Mũi hải sản
            </p>
          </div>

          <div className="flex gap-2.5 items-center">
            <span className="text-xs font-mono bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg flex items-center gap-2 text-[#d97706] font-bold">
              <Calendar className="w-4 h-4" /> 30/05/2026 (Phiên Sông)
            </span>
            <button
              onClick={handleLogout}
              data-testid="logout-btn"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs cursor-pointer border-0 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Configuration Tabs Menu */}
      <div className="border-b border-[#e5e7eb] bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-4">
          {[
            { id: 'overview', label: 'Ma Trận Tổng Thừa', count: 0 },
            { id: 'merchants', label: 'Xét Duyệt Vựa Đầm', count: pendingMerchants.length },
            { id: 'products', label: 'Tối Ưu Giá Cả & Lạt', count: 0 },
            { id: 'security', label: 'Nhật Ký Bảo An', count: 0 },
            { id: 'blogs', label: 'Quản Lý Cẩm Nang', count: blogs.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'merchants' | 'products' | 'security' | 'blogs')}
              className={`py-4 px-2 text-xs font-bold uppercase tracking-wider relative cursor-pointer border-0 border-b-2 transition-all bg-transparent ${
                activeTab === tab.id
                  ? 'border-[#d97706] text-[#031e25]'
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

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* TAB 1: OVERVIEW METRIC MATRIX */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Multi-grid Telemetry Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-cards border border-[#e5e7eb] shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Lưu lượng toàn bến</span>
                    <h3 className="text-xl font-black text-[#0a0a0a] font-mono mt-1 mb-0">42.5 tỉ đ</h3>
                  </div>
                  <div className="p-2 bg-[#d97706]/10 text-[#d97706] rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-[11px] text-[#198754] font-bold font-mono mt-3 flex items-center gap-1">
                  Đảm bảo 100% khớp lệnh trực tiếp
                </div>
              </div>

              <div className="bg-white p-5 rounded-cards border border-[#e5e7eb] shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Tổng vựa hoạt động</span>
                    <h3 className="text-xl font-black text-[#0a0a0a] font-mono mt-1 mb-0">{activeMerchants.length} vựa</h3>
                  </div>
                  <div className="p-2 bg-[#031e25]/5 text-[#d97706] rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-[11px] text-[#d97706] font-bold font-sans mt-3">
                  +{pendingMerchants.length} Đầm thủy sản đang xin cấp dấu số
                </div>
              </div>

              <div className="bg-white p-5 rounded-cards border border-[#e5e7eb] shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Lượt Đối Soát GD</span>
                    <h3 className="text-xl font-black text-[#0a0a0a] font-mono mt-1 mb-0">{initialReferralLogs.length} lần</h3>
                  </div>
                  <div className="p-2 bg-[#031e25]/5 text-emerald-600 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 font-bold font-mono mt-3">
                  Tỷ lệ đối soát khớp 100% DB
                </div>
              </div>

              <div className="bg-white p-5 rounded-cards border border-[#e5e7eb] shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Chỉ Số Giá Bảo Hộ</span>
                    <h3 className="text-xl font-black text-[#198754] font-mono mt-1 mb-0">Bình Ổn</h3>
                  </div>
                  <div className="p-2 bg-[#198754]/10 text-[#198754] rounded-lg">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 font-semibold mt-3">
                  Thường xuyên hậu kiểm lạt trói đay
                </div>
              </div>
            </div>

            {/* Custom SVG line Chart */}
            <div className="bg-white p-6 rounded-cards border border-[#e5e7eb] shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xs font-black text-[#0a0a0a] uppercase tracking-wider m-0">
                    Điểm Phân Kỳ Lưu Lượng Xuất Khẩu
                  </h3>
                  <p className="text-[11px] text-[#d97706] uppercase font-bold tracking-widest mt-0.5 mb-0">
                    Thống kê tỷ trọng tiêu dùng cua son Cà Mau &amp; tôm sú tự nhiên (triệu giao dịch)
                  </p>
                </div>
              </div>

              <div className="h-64 bg-gray-50/50 rounded-lg border border-gray-100 p-4">
                <svg className="w-full h-full" viewBox="0 0 1000 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="50" y1="40" x2="950" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="100" x2="950" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="160" x2="950" y2="160" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="210" x2="950" y2="210" stroke="#cbd5e1" strokeWidth="2" />

                  <path 
                    d="M 50 180 Q 200 120 350 160 T 650 80 T 950 50" 
                    stroke="#031e25" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M 50 195 Q 200 160 350 130 T 650 110 T 950 90" 
                    stroke="#d97706" 
                    strokeWidth="2.5" 
                    strokeDasharray="4 4"
                    fill="none" 
                    strokeLinecap="round"
                  />

                  <circle cx="650" cy="80" r="5" fill="#031e25" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="950" cy="50" r="6" fill="#198754" stroke="#fff" strokeWidth="2" />

                  <text x="50" y="225" fill="#64748b" className="text-[10px] font-mono font-bold" textAnchor="middle">Chợ Đầm</text>
                  <text x="350" y="225" fill="#64748b" className="text-[10px] font-mono font-bold" textAnchor="middle">Luồng Lạnh</text>
                  <text x="650" y="225" fill="#64748b" className="text-[10px] font-mono font-bold" textAnchor="middle">Kiểm Dịch</text>
                  <text x="950" y="225" fill="#64748b" className="text-[10px] font-mono font-bold" textAnchor="middle">Thông Quan</text>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PENDING MERCHANT APPROVALS */}
        {activeTab === 'merchants' && (
          <div className="space-y-6 animate-fade-in">
            {/* Pending Register Requests */}
            {pendingMerchants.length > 0 ? (
              <div className="bg-white rounded-cards border-2 border-dashed border-[#d97706]/40 p-6 space-y-4">
                <div>
                  <h3 className="text-xs font-black text-[#031e25] uppercase tracking-wider flex items-center gap-1.5 m-0">
                    <AlertTriangle className="w-4 h-4 text-[#d97706] animate-bounce" /> Đơn Đệ Trình Xin Cấp Dấu OCOP
                  </h3>
                  <p className="text-[11px] text-[#0a0a0a]/70 font-sans mt-0.5 mb-0">
                    Thương lái đăng ký tài khoản cần ban quản trị phê duyệt quyền bán hàng trên sàn
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingMerchants.map(merchant => (
                    <div key={merchant.id} className="bg-gray-50 p-4 border border-gray-200 rounded-lg flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-mono font-bold bg-[#031e25]/5 text-[#0a0a0a] px-2 py-0.5 rounded">
                            ID: {merchant.id}
                          </span>
                          <span className="text-xs text-gray-400 font-sans">Liên kết tài khoản mới</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#0a0a0a] uppercase m-0">{merchant.name}</h4>
                        <div className="text-[11px] text-gray-500 space-y-0.5 mt-1 font-mono">
                          <p className="m-0">SĐT: {merchant.phone}</p>
                          <p className="m-0">Địa chỉ vựa: {merchant.address || 'Chưa cung cấp'}</p>
                          <p className="m-0">Loại hoa hồng mặc định: {merchant.commission_type}</p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                        <button
                          onClick={() => handleApproveMerchant(merchant.id)}
                          className="bg-[#198754] border-0 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded hover:bg-opacity-90 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Chấp thuận cấp chỉ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-cards border border-gray-200 p-6 text-center text-xs text-gray-500">
                Không có đơn đăng ký vựa thương lái nào đang chờ duyệt.
              </div>
            )}

            {/* General Certified Merchants Grid */}
            <div className="bg-white rounded-cards border border-[#e5e7eb] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#e5e7eb] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xs font-black text-[#031e25] uppercase tracking-wider m-0">
                    Danh Sách Vựa Thương Lái Hoạt Động
                  </h3>
                  <p className="text-[11px] font-mono mt-0.5 font-bold text-[#d97706] uppercase m-0">
                    Bảo lãnh sỉ lẻ hải sản không chứa hóa chất độc hại
                  </p>
                </div>

                <div className="flex gap-2.5 items-center">
                  <select 
                    className="p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#031e25]"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="all">Mọi vùng khai thác</option>
                    <option value="Năm Căn">Vùng Năm Căn</option>
                    <option value="Sông Đốc">Sông Đốc hải lộ</option>
                    <option value="Phú Quốc">Đảo Ngọc Phú Quốc</option>
                  </select>

                  <button
                    onClick={() => { setEditingBlog(null); setShowBlogEditor(true); }}
                    data-testid="add-blog-btn"
                    className="bg-[var(--color-deepwater)] border-0 hover:opacity-90 text-[var(--color-white)] font-bold px-3 py-2 rounded-lg text-xs cursor-pointer transition-opacity"
                  >
                    + Viết Bài Blog
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {activeMerchants
                  .filter(m => selectedRegion === 'all' || (m.address && m.address.includes(selectedRegion)))
                  .map(m => (
                    <div key={m.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50/50 transition">
                      <div className="flex gap-3.5 items-center">
                        <div className="w-12 h-12 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center font-bold border border-amber-200">
                          {m.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-[#0a0a0a] uppercase tracking-tight m-0">{m.name}</h4>
                            <span className="bg-[#198754]/10 text-[#198754] text-[9px] px-1.5 py-0.5 rounded uppercase font-black leading-none">
                              Đã duyệt số
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5 mb-0">SĐT: {m.phone} | Hoa hồng: {m.commission_value} {m.commission_type === 'percentage' ? '%' : 'đ'} ({m.commission_type})</p>
                          <p className="text-xs text-[#0a0a0a]/80 truncate max-w-xl italic mt-1 font-sans mb-0">Vựa: {m.address || 'Cà Mau'}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfigureCommissionClick(m)}
                          data-testid="configure-commission-btn"
                          className="bg-[#031e25] border-0 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded hover:bg-opacity-95 active:scale-95 transition cursor-pointer"
                        >
                          Cài hoa hồng
                        </button>
                      </div>
                    </div>
                  ))}
                {activeMerchants.length === 0 && (
                  <div className="p-6 text-center text-xs text-gray-500">Chưa có thương lái nào hoạt động trên hệ thống.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS & LẠT TRÓI REGULATION */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-cards border border-[#e5e7eb] shadow-sm p-6 space-y-6 animate-fade-in font-sans">
            <div>
              <h3 className="text-xs font-black text-[#031e25] uppercase tracking-wider m-0">
                Kiểm Định Chất Lượng & Lạt Trói - Thước đo Uy Tín Thương Lái
              </h3>
              <p className="text-[11px] text-[#d97706] uppercase font-bold tracking-widest mt-0.5 mb-0">
                Rà soát và xử phạt nghiêm các vựa cố ý trói dây vải sũng nước, bùn nấp lừa dối khách hàng
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-gray-50 border border-gray-100 rounded-lg space-y-4">
                <span className="text-[10px] font-black text-white uppercase tracking-widest bg-yellow-600 px-2.5 py-1 rounded-full">
                  Quy định kiểm soát lạt trói
                </span>
                <p className="text-xs text-[#0a0a0a] leading-relaxed m-0">
                  Hệ thống cam kết bảo vệ lòng tin tuyệt đối của người tiêu dùng. Bất cứ thương lái nào cố tình quấn thừng đay tẩm phèn hoặc ngâm bùn sũng nước nhằm tăng trọng lượng cua sẽ bị đình bản kinh doanh tức thì.
                </p>
                <div className="font-mono text-[11px] text-gray-500 space-y-0.5">
                  <p className="m-0">● Quy định lạt trói cua: Dưới 15g / con (Bao đổi trả)</p>
                  <p className="m-0">● Dung sai gạch màng son: Chênh lệch &lt; 5% cam kết</p>
                  <p className="m-0">● Tiêu chuẩn nguồn gốc: Phải khai báo tọa độ đầm đước</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider m-0">
                  Danh sách vựa vi phạm kiểm lạt (Hệ thống ghi nhận)
                </h4>
                <div className="p-4 border border-red-100 bg-red-50/50 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-red-700 block text-[11px] uppercase">Vựa khô Bà Sáu Trần Văn Thời</span>
                    <span className="text-gray-400 font-mono">Lỗi: Lạt trói quấn to nước 120g</span>
                  </div>
                  <span className="text-[9px] bg-red-100 text-red-800 px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                    ĐÃ ĐÌNH BẢN
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT SECURITY TRAILS */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="bg-white rounded-cards border border-[#e5e7eb] shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-black text-[#031e25] uppercase tracking-wider m-0">
                    Hệ Thống Nhật Ký Bảo An Cryptographic
                  </h3>
                  <p className="text-[11px] text-[#d97706] uppercase font-bold tracking-widest mt-0.5 mb-0">
                    Nhật ký lưu trữ chống ghi đè các khối phê chuẩn thủy sản
                  </p>
                </div>
                <span className="p-1 px-2.5 bg-emerald-50 text-emerald-700 text-[9px] font-mono rounded font-bold border border-emerald-200">
                  SECURE SHA-256
                </span>
              </div>

              <div className="bg-[#0a0a0a] text-emerald-400 font-mono p-5 rounded-lg text-[10px] space-y-2 overflow-x-auto leading-relaxed">
                <p className="m-0">[2026-05-30 09:42:12] SYSTEM_BOOT: Khởi phát trung tâm điều hành Deepwater v4.2 Pro thành công.</p>
                <p className="m-0">[2026-05-30 09:44:05] ADM_AUTH: Quản trị viên Đinh Tiến Quyết ký danh xác thực phiên dịch số.</p>
                <p className="m-0">[2026-05-30 09:44:42] DATA_SYNC: Kết nối đồng bộ với cơ sở dữ liệu Postgres ... OK.</p>
                <p className="m-0">[2026-05-30 09:45:15] OCOP_VERIFY: Phê chuẩn kết quả giám định lạt dây dưới 10g đay mỏng ... OK.</p>
                <p className="m-0 text-yellow-400">[2026-05-30 09:45:50] WARN: Bản tin thị trường ghi nhận biến động giá Cua Son Năm Căn nhẹ.</p>
              </div>
            </div>

            {/* Referral Audit Logs */}
            <div className="bg-white rounded-cards border border-[#e5e7eb] shadow-sm p-6 space-y-4">
              <h3 className="text-xs font-black text-[#031e25] uppercase tracking-wider m-0">
                Nhật Ký Đối Soát Hoa Hồng Đơn Hàng Thực Tế
              </h3>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                  <thead className="bg-gray-50 font-bold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Mã Đơn Đặt</th>
                      <th className="px-6 py-3">Số Điện Thoại Khách</th>
                      <th className="px-6 py-3 text-right">Tổng Đơn Hàng</th>
                      <th className="px-6 py-3 text-right">Hoa Hồng (đ)</th>
                      <th className="px-6 py-3 text-center">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {initialReferralLogs.map((log) => (
                      <tr key={log.id} data-referral-order-id={log.order_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono font-bold text-gray-600">#{log.order_id}</td>
                        <td className="px-6 py-4 referral-buyer-phone">{log.buyer_phone || '-'}</td>
                        <td className="px-6 py-4 text-right font-semibold">
                          {log.order_value ? `${log.order_value.toLocaleString('vi-VN')} đ` : '-'}
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-[#d97706] referral-commission">
                          {log.calculated_commission.toLocaleString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="referral-status px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {initialReferralLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          Chưa có nhật ký đối soát hoa hồng nào được ghi nhận.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="bg-white rounded-cards border border-[#e5e7eb] shadow-sm overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-[#e5e7eb] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xs font-black text-[#031e25] uppercase tracking-wider m-0">
                  Quản Lý Cẩm Nang &amp; Tin Tức
                </h3>
                <p className="text-[11px] font-mono mt-0.5 font-bold text-[#d97706] uppercase m-0">
                  Danh sách cẩm nang hướng dẫn chế biến, chọn lựa và thị trường hải sản
                </p>
              </div>

              <button
                onClick={() => { setEditingBlog(null); setBlogError(''); setBlogSuccess(''); setShowBlogEditor(true); }}
                className="bg-[#031e25] border-0 hover:opacity-90 text-white font-bold px-4 py-2.5 rounded-lg text-xs cursor-pointer transition-opacity"
              >
                + Viết Bài Mới
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                <thead className="bg-gray-50 font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Tiêu đề bài viết</th>
                    <th className="px-6 py-3">Đường dẫn (Slug)</th>
                    <th className="px-6 py-3 text-center">Trạng thái</th>
                    <th className="px-6 py-3">Ngày đăng</th>
                    <th className="px-6 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#0a0a0a] block max-w-sm truncate">{blog.title}</span>
                        {blog.meta_description && (
                          <span className="text-[10px] text-gray-400 block max-w-sm truncate italic mt-0.5">
                            {blog.meta_description}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-500">{blog.slug}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider leading-none ${
                          blog.is_published 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {blog.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-500">
                        {blog.publish_date 
                          ? new Date(blog.publish_date).toLocaleDateString('vi-VN') 
                          : new Date(blog.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleEditBlogClick(blog)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase cursor-pointer border-0 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase cursor-pointer border-0 transition-colors"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                  {blogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        Chưa có cẩm nang hay tin tức nào được tạo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Cài đặt hoa hồng */}
      {showCommissionModal && selectedMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-cards p-6 max-w-sm w-full border border-[var(--color-canvas)] shadow-xl relative font-sans"
          >
            <h3 className="text-sm font-black text-[#031e25] uppercase tracking-wider mb-4 m-0">
              Cài đặt tỷ lệ: {selectedMerchant.name}
            </h3>
            {commissionError && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-200 font-semibold">
                {commissionError}
              </div>
            )}
            <form onSubmit={handleSaveCommission} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono mb-1.5">Loại đối soát hoa hồng</label>
                <select
                  name="commission_type"
                  value={commissionType}
                  onChange={(e) => setCommissionType(e.target.value as 'percentage' | 'fixed' | 'monthly_flat')}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25]"
                >
                  <option value="percentage">Phần trăm (%)</option>
                  <option value="fixed">Cố định theo đơn (đ)</option>
                  <option value="monthly_flat">Cố định hàng tháng (flat)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 font-mono mb-1.5">Mức hoa hồng đối soát</label>
                <input
                  type="number"
                  step="any"
                  name="commission_value"
                  value={commissionValue}
                  onChange={(e) => setCommissionValue(e.target.value)}
                  required
                  placeholder="Ví dụ: 5"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] font-mono text-[#0a0a0a]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCommissionModal(false);
                    setSelectedMerchant(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer bg-transparent"
                >
                  HỦY
                </button>
                <button
                  type="submit"
                  data-testid="save-commission"
                  className="bg-[#031e25] text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-opacity-95 shadow cursor-pointer border-0"
                >
                  LƯU CẤU HÌNH
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Blog Editor — Full Screen */}
      {showBlogEditor && (
        <BlogEditor
          blog={editingBlog}
          onSave={handleSaveBlog}
          onClose={handleCloseBlogEditor}
          isSaving={blogIsSaving}
          error={blogError}
          success={blogSuccess}
        />
      )}
    </div>
  );
}
