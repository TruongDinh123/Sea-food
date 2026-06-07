import { test, expect } from '@playwright/test';
import { CatalogPage, AuthPage, MerchantDashboardPage, AdminDashboardPage, MerchantPage } from './helpers/page-objects';
import { resetDatabase } from './helpers/test-utils';

test.describe('Tier 3: Cross-Feature Combinations', () => {
  test.beforeEach(async ({ request }) => {
    // Seed database before each test
    await resetDatabase(request, 'seed');
  });

  test('Completing an order updates referral log status and admin commission log', async ({ page }) => {
    const catalog = new CatalogPage(page);
    const auth = new AuthPage(page);
    const merchantDash = new MerchantDashboardPage(page);
    const adminDash = new AdminDashboardPage(page);

    // 1. Buyer places an order
    await catalog.gotoDetail('tom-dat-kho-loai-1');
    await catalog.placeOrder(
      'Khách mua kiểm thử T3',
      '0933445566',
      'Số 99 Lý Thường Kiệt, TP. Cà Mau',
      'cod'
    );
    await expect(catalog.orderSuccessMsg).toBeVisible();

    // Parse order ID from screen or extract from list
    // In our design, let's assume we can get it or we look at the dashboard.
    
    // 2. Merchant logs in and marks order as 'completed'
    await auth.gotoLogin();
    await auth.login('merchant@example.com', 'MerchantPassword123!');
    await merchantDash.goto();
    
    // Locate the new order row
    const orderRow = page.locator('tr:has-text("Khách mua kiểm thử T3")');
    await expect(orderRow).toBeVisible();
    
    // Read order ID attribute
    const orderId = await orderRow.getAttribute('data-order-id');
    expect(orderId).not.toBeNull();

    // Mark as completed
    await merchantDash.updateOrderStatus(orderId!, 'completed');
    await expect(orderRow.locator('.status-badge')).toContainText(/Hoàn thành/i);

    // Logout
    await page.locator('button[data-testid="logout-btn"]').click();

    // 3. Admin logs in and verifies referral log state is completed and matches commission rates
    await auth.gotoLogin();
    await auth.login('admin@example.com', 'AdminPassword123!');
    await adminDash.goto();
    
    // Verify referral logs list has the order and status is completed
    const referralRow = page.locator(`tr[data-referral-order-id="${orderId}"]`);
    await expect(referralRow).toBeVisible();
    await expect(referralRow.locator('.referral-status')).toContainText(/completed/i);
    
    // Check calculations (e.g. 5% commission on order value of 250,000 is 12,500)
    await expect(referralRow.locator('.referral-commission')).toContainText('12,500');
  });

  test('Updating merchant profile propagates to public merchant details page', async ({ page }) => {
    const auth = new AuthPage(page);
    const merchantDash = new MerchantDashboardPage(page);
    const merchantPublic = new MerchantPage(page);

    // 1. Merchant logs in and updates profile
    await auth.gotoLogin();
    await auth.login('merchant@example.com', 'MerchantPassword123!');
    await merchantDash.goto();
    
    const updatedName = 'Vựa Khô Cà Mau Đặc Sản Hạng Nhất';
    const updatedPhone = '02903123456';
    const updatedAddress = 'Ấp Đất Mũi, Xã Đất Mũi, Ngọc Hiển, Cà Mau';
    await merchantDash.updateProfile(updatedName, updatedPhone, updatedAddress);
    await expect(page.locator('[data-testid="profile-update-success"]')).toBeVisible();

    // Logout
    await page.locator('button[data-testid="logout-btn"]').click();

    // 2. Visit public merchant profile page using slug
    await merchantPublic.gotoDetail('vua-hai-san-ca-mau');
    
    // Confirm updated fields are visible to visitor
    await expect(page.locator('h1')).toContainText(updatedName);
    await expect(page.locator('[data-testid="merchant-phone"]')).toContainText(updatedPhone);
    await expect(page.locator('[data-testid="merchant-address"]')).toContainText(updatedAddress);
  });

  test('Publishing a blog post dynamically updates sitemap.xml', async ({ page }) => {
    const auth = new AuthPage(page);
    const adminDash = new AdminDashboardPage(page);

    // 1. Fetch sitemap before publishing, verify blog post slug does not exist
    await page.goto('/sitemap.xml');
    const sitemapContentBefore = await page.content();
    expect(sitemapContentBefore).not.toContain('/blog/bi-quyet-lam-kho-muc-mot-nang');

    // 2. Admin logs in and creates + publishes a new blog post
    await auth.gotoLogin();
    await auth.login('admin@example.com', 'AdminPassword123!');
    await adminDash.goto();

    await adminDash.createBlog(
      'Bí quyết làm khô mực một nắng ngon',
      'bi-quyet-lam-kho-muc-mot-nang',
      'Cách chọn mực tươi và phơi khô mực đúng 1 nắng giòn ngọt...',
      'Bí quyết chế biến và phơi khô mực một nắng chuẩn đặc sản Cà Mau.',
      true // published
    );

    // Logout
    await page.locator('button[data-testid="logout-btn"]').click();

    // 3. Fetch sitemap again and verify the new post is dynamic and included
    await page.goto('/sitemap.xml');
    const sitemapContentAfter = await page.content();
    expect(sitemapContentAfter).toContain('/blog/bi-quyet-lam-kho-muc-mot-nang');
  });
});
