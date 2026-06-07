import { test, expect } from '@playwright/test';
import { LandingPage, CatalogPage, MerchantPage, BlogPage, AuthPage, MerchantDashboardPage, AdminDashboardPage } from './helpers/page-objects';
import { resetDatabase } from './helpers/test-utils';

test.describe('Tier 1: Feature Coverage (Happy Paths)', () => {
  test.beforeEach(async ({ request }) => {
    // Attempt to seed the database with test data before each test
    await resetDatabase(request, 'seed');
  });

  test('Landing Page displays core components and links', async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.goto();
    
    // Check SEO metadata
    await landing.checkSEO(
      /Hải Sản Cao Cấp | Trang Chủ/i,
      'Trang chủ hệ thống hải sản cao cấp, kết nối thương lái toàn quốc.',
      '/'
    );

    // Verify sections are visible
    await expect(landing.featuredProducts).toBeVisible();
    await expect(landing.merchantList).toBeVisible();
    await expect(landing.latestBlogs).toBeVisible();
  });

  test('Catalog Page supports navigation, filtering, and ordering COD', async ({ page }) => {
    const catalog = new CatalogPage(page);
    
    // List Page
    await catalog.gotoList();
    await catalog.checkSEO(/Danh sách sản phẩm/i);
    
    // Filter products
    await catalog.filter(100000, 500000, 'tom-kho', 'Vựa Hải Sản Cà Mau');
    
    // Detail Page
    await catalog.gotoDetail('tom-dat-kho-loai-1');
    await catalog.checkSEO(/Tôm đất khô Loại 1/i);
    
    // Check JSON-LD Product Schema
    const productSchema = await catalog.getJSONLD('Product');
    expect(productSchema).not.toBeNull();
    expect(productSchema.name).toBe('Tôm đất khô Loại 1');
    
    // Place order (COD Happy Path)
    await catalog.placeOrder(
      'Nguyễn Văn A',
      '0912345678',
      '123 Đường Phan Ngọc Hiển, Phường 5, TP. Cà Mau',
      'cod'
    );
    await expect(catalog.orderSuccessMsg).toBeVisible();
    await expect(catalog.orderSuccessMsg).toContainText(/Đặt hàng thành công/i);
  });

  test('Merchant Page displays details and product catalog', async ({ page }) => {
    const merchant = new MerchantPage(page);
    
    // List Page
    await merchant.gotoList();
    await merchant.checkSEO(/Danh sách vựa thương lái/i);
    
    // Detail Page (Profile)
    await merchant.gotoDetail('vua-hai-san-ca-mau');
    await merchant.checkSEO(/Vựa Hải Sản Cà Mau/i);

    // Check JSON-LD Profile/LocalBusiness Schema
    const localBusinessSchema = await merchant.getJSONLD('LocalBusiness');
    expect(localBusinessSchema).not.toBeNull();
    expect(localBusinessSchema.name).toBe('Vựa Hải Sản Cà Mau');
  });

  test('SEO Blog Page displays published articles with Schema', async ({ page }) => {
    const blog = new BlogPage(page);
    
    // List Page
    await blog.gotoList();
    await blog.checkSEO(/Cẩm nang Hải sản/i);
    
    // Detail Page
    await blog.gotoDetail('cach-chon-tom-kho-ngon-ca-mau');
    await blog.checkSEO(/Cách chọn tôm khô ngon Cà Mau/i);

    // Check JSON-LD Article Schema
    const articleSchema = await blog.getJSONLD('Article');
    expect(articleSchema).not.toBeNull();
    expect(articleSchema.headline).toBe('Cách chọn tôm khô ngon Cà Mau');
  });

  test('SEO Technical Files: Sitemap & Robots.txt respond correctly', async ({ page }) => {
    // Fetch Sitemap
    const sitemapResponse = await page.goto('/sitemap.xml');
    expect(sitemapResponse?.status()).toBe(200);
    const contentType = sitemapResponse?.headers()['content-type'];
    expect(contentType).toContain('xml');
    
    // Fetch Robots.txt
    const robotsResponse = await page.goto('/robots.txt');
    expect(robotsResponse?.status()).toBe(200);
    const robotsText = await robotsResponse?.text();
    expect(robotsText).toContain('User-agent: *');
    expect(robotsText).toContain('Sitemap:');
  });

  test('Authentication Flow: Sign up and Login as Merchant', async ({ page }) => {
    const auth = new AuthPage(page);
    
    // Register
    await auth.gotoRegisterMerchant();
    await auth.registerMerchant(
      'Vựa Khô Ngọc Điệp',
      '0987654321',
      'Thị trấn Sông Đốc, Trần Văn Thời, Cà Mau',
      'ngocdiep@example.com',
      'MerchantPass123!'
    );
    await expect(auth.registerSuccessMsg).toBeVisible();
    await expect(auth.registerSuccessMsg).toContainText(/Đăng ký tài khoản thương lái thành công/i);

    // Login
    await auth.gotoLogin();
    await auth.login('ngocdiep@example.com', 'MerchantPass123!');
    await expect(page).toHaveURL(/.*dashboard\/merchant/);
  });

  test('Merchant Dashboard Flow: Manage Products & View Orders', async ({ page }) => {
    const auth = new AuthPage(page);
    const dashboard = new MerchantDashboardPage(page);
    
    // Authenticate first
    await auth.gotoLogin();
    await auth.login('merchant@example.com', 'MerchantPassword123!');
    
    // Add product
    await dashboard.createProduct(
      'Cua biển Năm Căn khô',
      'cua-bien-nam-can-kho',
      350000,
      400000,
      'ca-kho',
      'Cua Năm Căn hấp sấy khô đặc sản làm quà.'
    );
    
    // Verify product is listed in dashboard
    await expect(page.locator('tr:has-text("Cua biển Năm Căn khô")')).toBeVisible();

    // Delete product
    await dashboard.deleteProduct('Cua biển Năm Căn khô');
    await expect(page.locator('tr:has-text("Cua biển Năm Căn khô")')).not.toBeVisible();
  });

  test('Admin Dashboard Flow: Approve Merchants & Manage Blog', async ({ page }) => {
    const auth = new AuthPage(page);
    const admin = new AdminDashboardPage(page);

    // Authenticate as Admin
    await auth.gotoLogin();
    await auth.login('admin@example.com', 'AdminPassword123!');

    // Approve merchant
    await admin.approveMerchant('Vựa Khô Ngọc Điệp');
    await expect(page.locator('tr:has-text("Vựa Khô Ngọc Điệp") .status-badge')).toContainText(/Đã duyệt/i);

    // Write a blog post
    await admin.createBlog(
      'Mẹo bảo quản khô cá sặc bổi',
      'meo-bao-quan-kho-ca-sac-boi',
      'Khô cá sặc bổi ngon cần bảo quản trong tủ đông...',
      'Hướng dẫn chi tiết cách bảo quản cá sặc bổi khô để lâu không mốc.',
      true
    );
    await expect(page.locator('tr:has-text("Mẹo bảo quản khô cá sặc bổi")')).toBeVisible();
  });
});
