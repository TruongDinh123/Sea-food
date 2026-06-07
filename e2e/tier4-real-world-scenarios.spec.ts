import { test, expect } from '@playwright/test';
import { CatalogPage, AuthPage, MerchantDashboardPage, AdminDashboardPage } from './helpers/page-objects';
import { resetDatabase } from './helpers/test-utils';

test.describe('Tier 4: Real-World Application Scenarios', () => {
  test.beforeEach(async ({ request }) => {
    // Reset database to a clean seed state
    await resetDatabase(request, 'seed');
  });

  test('E2E Buyer Checkout -> Merchant Order Fulfilment -> Admin Commission Verification Flow', async ({ page }) => {
    const catalog = new CatalogPage(page);
    const auth = new AuthPage(page);
    const merchantDash = new MerchantDashboardPage(page);
    const adminDash = new AdminDashboardPage(page);

    // ==========================================
    // STEP 1: BUYER FLOW (Browse & Checkout)
    // ==========================================
    
    // Buyer visits catalog, views product details, and orders via COD
    await catalog.gotoList();
    await catalog.gotoDetail('tom-dat-kho-loai-1');
    
    const buyerName = 'Đinh Văn Buyer';
    const buyerPhone = '0981122334';
    const buyerAddress = 'Đất Mũi, Ngọc Hiển, Cà Mau, Việt Nam';
    
    await catalog.placeOrder(buyerName, buyerPhone, buyerAddress, 'cod');
    await expect(catalog.orderSuccessMsg).toBeVisible();
    await expect(catalog.orderSuccessMsg).toContainText(/Đặt hàng thành công/i);

    // ==========================================
    // STEP 2: MERCHANT FLOW (Fulfilment Lifecycle)
    // ==========================================
    
    // Merchant logs in to manage the incoming order
    await auth.gotoLogin();
    await auth.login('merchant@example.com', 'MerchantPassword123!');
    await merchantDash.goto();

    // Verify order is visible in dashboard
    const merchantOrderRow = page.locator(`tr:has-text("${buyerName}")`);
    await expect(merchantOrderRow).toBeVisible();
    
    // Get Order ID
    const orderId = await merchantOrderRow.getAttribute('data-order-id');
    expect(orderId).not.toBeNull();

    // Transition: pending -> processing
    await merchantDash.updateOrderStatus(orderId!, 'processing');
    await expect(merchantOrderRow.locator('.status-badge')).toContainText(/Đang xử lý|processing/i);

    // Transition: processing -> shipping
    await merchantDash.updateOrderStatus(orderId!, 'shipping');
    await expect(merchantOrderRow.locator('.status-badge')).toContainText(/Đang giao hàng|shipping/i);

    // Transition: shipping -> completed
    await merchantDash.updateOrderStatus(orderId!, 'completed');
    await expect(merchantOrderRow.locator('.status-badge')).toContainText(/Hoàn thành|completed/i);

    // Logout
    await page.locator('button[data-testid="logout-btn"]').click();

    // ==========================================
    // STEP 3: ADMIN FLOW (Audit & Commission Verification)
    // ==========================================
    
    // Admin logs in to verify the transaction commissions and logs
    await auth.gotoLogin();
    await auth.login('admin@example.com', 'AdminPassword123!');
    await adminDash.goto();

    // Verify the commission record created in referral_logs
    const adminReferralRow = page.locator(`tr[data-referral-order-id="${orderId}"]`);
    await expect(adminReferralRow).toBeVisible();
    
    // Verify status is completed
    await expect(adminReferralRow.locator('.referral-status')).toContainText(/completed/i);

    // Verify commission details match calculations
    // Example: Order total is 250,000 VND (e.g. 1kg of Tôm khô), merchant commission rate 5%.
    // Expected calculated commission: 12,500 VND.
    await expect(adminReferralRow.locator('.referral-commission')).toContainText('12,500');
    
    // Confirm billing details are captured accurately
    await expect(adminReferralRow.locator('.referral-buyer-phone')).toContainText(buyerPhone);
  });
});
