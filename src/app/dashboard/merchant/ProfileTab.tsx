'use client';

import React from 'react';

interface ProfileTabProps {
  profileName: string;
  setProfileName: (v: string) => void;
  profilePhone: string;
  setProfilePhone: (v: string) => void;
  profileAddress: string;
  setProfileAddress: (v: string) => void;
  profileSuccessMsg: string;
  profileErrorMsg: string;
  profileLoading: boolean;
  onUpdateProfile: (e: React.FormEvent) => void;
}

export default function ProfileTab({
  profileName,
  setProfileName,
  profilePhone,
  setProfilePhone,
  profileAddress,
  setProfileAddress,
  profileSuccessMsg,
  profileErrorMsg,
  profileLoading,
  onUpdateProfile,
}: ProfileTabProps) {
  return (
    <div className="bg-white rounded-cards border border-[#e5e7eb] shadow-sm p-6 max-w-xl mx-auto animate-fade-in font-sans">
      <div>
        <h3 className="text-xs font-black text-[#031e25] uppercase tracking-wider m-0">
          Thiết Lập Hồ Sơ Vựa Thương Lái
        </h3>
        <p className="text-[11px] text-[#d97706] uppercase font-bold tracking-widest mt-0.5 mb-6">
          Cập nhật thông tin định danh và địa chỉ liên lạc của cơ sở
        </p>
      </div>

      {profileSuccessMsg && (
        <div data-testid="profile-update-success" className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-250 font-semibold">
          {profileSuccessMsg}
        </div>
      )}

      {profileErrorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
          {profileErrorMsg}
        </div>
      )}

      <form onSubmit={onUpdateProfile} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Tên vựa thương lái</label>
          <input
            type="text"
            name="profile_name"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Số điện thoại liên hệ</label>
          <input
            type="text"
            name="profile_phone"
            value={profilePhone}
            onChange={(e) => setProfilePhone(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-black uppercase text-gray-400 font-mono">Địa chỉ bến vựa</label>
          <textarea
            name="profile_address"
            value={profileAddress}
            onChange={(e) => setProfileAddress(e.target.value)}
            required
            rows={4}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#031e25] text-[#0a0a0a]"
          />
        </div>

        <button
          type="submit"
          data-testid="save-profile"
          disabled={profileLoading}
          className="bg-[#031e25] text-white px-5 py-3 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-opacity-95 shadow cursor-pointer border-0 disabled:opacity-50"
        >
          {profileLoading ? 'ĐANG LƯU HỒ SƠ...' : 'CẬP NHẬT HỒ SƠ VỰA'}
        </button>
      </form>
    </div>
  );
}
