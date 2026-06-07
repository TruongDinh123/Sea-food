'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Merchant } from '@/types/merchant.types';
import { Product } from '@/types/product.types';
import { Order } from '@/types/order.types';

import DashboardLayout from './DashboardLayout';
import OverviewTab from './OverviewTab';
import ProductManagerTab from './ProductManagerTab';
import OrderManagerTab from './OrderManagerTab';
import ReferralLogsTab from './ReferralLogsTab';
import ProfileTab from './ProfileTab';

interface MerchantDashboardClientProps {
  merchant: Merchant;
  products: Product[];
  orders: Order[];
}

type TabId = 'overview' | 'products' | 'orders' | 'payouts' | 'profile';

export default function MerchantDashboardClient({
  merchant: initialMerchant,
  products: initialProducts,
  orders: initialOrders,
}: MerchantDashboardClientProps) {
  const router = useRouter();
  const [merchant, setMerchant] = useState<Merchant>(initialMerchant);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Product modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productSlug, setProductSlug] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productOriginalPrice, setProductOriginalPrice] = useState('');
  const [productCategory, setProductCategory] = useState('cua-bien');
  const [productDescription, setProductDescription] = useState('');
  const [priceError, setPriceError] = useState('');
  const [descError, setDescError] = useState('');
  const [addError, setAddError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Profile edit state
  const [profileName, setProfileName] = useState(merchant.name);
  const [profilePhone, setProfilePhone] = useState(merchant.phone);
  const [profileAddress, setProfileAddress] = useState(merchant.address || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Orders status state
  const [orderStatuses, setOrderStatuses] = useState<Record<number, string>>(
    initialOrders.reduce((acc, order) => {
      acc[order.id] = order.status;
      return acc;
    }, {} as Record<number, string>)
  );
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const totalRevenue = initialOrders
    .filter(o => o.status === 'completed' || o.status === 'shipping')
    .reduce((sum, o) => sum + o.order_value, 0);

  const pendingOrders = initialOrders.filter(o => o.status === 'pending');

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setPriceError(''); setDescError(''); setAddError('');
    let hasError = false;
    const numericPrice = Number(productPrice);
    if (isNaN(numericPrice) || numericPrice <= 0) { setPriceError('Giá phải lớn hơn 0'); hasError = true; }
    if (productDescription.length < 10) { setDescError('Mô tả sản phẩm phải từ 10 ký tự trở lên'); hasError = true; }
    if (hasError) return;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: productName, slug: productSlug, price: numericPrice, original_price: productOriginalPrice ? Number(productOriginalPrice) : null, category: productCategory, description: productDescription }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.field === 'price') setPriceError(data.error);
        else if (data.field === 'desc') setDescError(data.error);
        else setAddError(data.error || 'Lỗi thêm sản phẩm');
        return;
      }
      setShowAddModal(false);
      setProductName(''); setProductSlug(''); setProductPrice(''); setProductOriginalPrice(''); setProductCategory('cua-bien'); setProductDescription('');
      alert('Thêm sản phẩm mới thành công!');
      router.refresh();
    } catch (err) { console.error(err); setAddError('Lỗi kết nối máy chủ'); }
  };

  const handleDeleteProduct = async () => {
    if (confirmDeleteId === null) return;
    try {
      const res = await fetch(`/api/products?id=${confirmDeleteId}`, { method: 'DELETE' });
      if (res.ok) { setConfirmDeleteId(null); alert('Đã gỡ bỏ dòng sản phẩm thành công!'); router.refresh(); }
      else { const data = await res.json(); alert(data.error || 'Không thể xóa sản phẩm'); }
    } catch (err) { console.error(err); alert('Lỗi kết nối máy chủ'); }
  };

  const handleUpdateOrderStatus = async (orderId: number) => {
    const status = orderStatuses[orderId];
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch('/api/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, status }) });
      if (res.ok) { alert('Cập nhật trạng thái đơn hàng thành công!'); router.refresh(); }
      else { const data = await res.json(); alert(data.error || 'Cập nhật trạng thái thất bại'); }
    } catch (err) { console.error(err); alert('Lỗi kết nối máy chủ'); }
    finally { setUpdatingOrderId(null); }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg(''); setProfileErrorMsg(''); setProfileLoading(true);
    try {
      const res = await fetch('/api/merchants', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: profileName, phone: profilePhone, address: profileAddress }) });
      const data = await res.json();
      if (!res.ok) setProfileErrorMsg(data.error || 'Cập nhật thất bại');
      else { setProfileSuccessMsg('Cập nhật thông tin thành công'); setMerchant(data.merchant); router.refresh(); }
    } catch (err) { console.error(err); setProfileErrorMsg('Lỗi kết nối máy chủ'); }
    finally { setProfileLoading(false); }
  };

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/auth/login'); }
    catch (err) { console.error(err); router.push('/auth/login'); }
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen pb-16 font-sans antialiased text-[#0a0a0a]">
      <DashboardLayout
        merchant={merchant}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        products={initialProducts}
        pendingOrdersCount={pendingOrders.length}
        onAddProduct={() => setShowAddModal(true)}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {activeTab === 'overview' && (
          <OverviewTab
            products={initialProducts}
            orders={initialOrders}
            totalRevenue={totalRevenue}
            pendingOrdersCount={pendingOrders.length}
            onNavigateToOrders={() => setActiveTab('orders')}
          />
        )}

        {activeTab === 'products' && (
          <ProductManagerTab
            products={initialProducts} showAddModal={showAddModal} setShowAddModal={setShowAddModal}
            productName={productName} setProductName={setProductName}
            productSlug={productSlug} setProductSlug={setProductSlug}
            productPrice={productPrice} setProductPrice={setProductPrice}
            productOriginalPrice={productOriginalPrice} setProductOriginalPrice={setProductOriginalPrice}
            productCategory={productCategory} setProductCategory={setProductCategory}
            productDescription={productDescription} setProductDescription={setProductDescription}
            priceError={priceError} descError={descError} addError={addError}
            confirmDeleteId={confirmDeleteId} setConfirmDeleteId={setConfirmDeleteId}
            onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'orders' && (
          <OrderManagerTab
            orders={initialOrders}
            orderStatuses={orderStatuses}
            setOrderStatuses={setOrderStatuses}
            updatingOrderId={updatingOrderId}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === 'payouts' && (
          <ReferralLogsTab merchant={merchant} totalRevenue={totalRevenue} />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            profileName={profileName} setProfileName={setProfileName}
            profilePhone={profilePhone} setProfilePhone={setProfilePhone}
            profileAddress={profileAddress} setProfileAddress={setProfileAddress}
            profileSuccessMsg={profileSuccessMsg} profileErrorMsg={profileErrorMsg}
            profileLoading={profileLoading} onUpdateProfile={handleUpdateProfile}
          />
        )}
      </div>
    </div>
  );
}
