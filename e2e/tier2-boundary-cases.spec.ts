import { test, expect } from '@playwright/test';
import { CatalogPage, AuthPage, MerchantDashboardPage } from './helpers/page-objects';
import { resetDatabase } from './helpers/test-utils';

test.describe('Tier 2: Boundary & Corner Cases', () => {
  test.beforeEach(async ({ request }) => {
    // Reset database to edge-case seed (e.g. empty lists or minimal data)
    await resetDatabase(request, 'seed-edge-cases');
  });

  test('Handles empty list states gracefully', async ({ page }) => {
    const catalog = new CatalogPage(page);
    
    // Go to catalog with filter that yields no results
    await catalog.gotoList();
    await catalog.filter(9999999, 100000000); // Out of bounds price range
    
    // Expect empty state message
    await expect(page.locator('[data-testid="no-products-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="no-products-message"]')).toContainText(/Không tìm thấy sản phẩm nào/i);
  });

  test('Handles invalid product and blog slugs with graceful 404', async ({ page }) => {
    // Invalid product slug
    const productResponse = await page.goto('/san-pham/this-slug-does-not-exist-123456');
    expect(productResponse?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText(/404|Không tìm thấy trang/i);

    // Invalid blog slug
    const blogResponse = await page.goto('/blog/non-existent-blog-post-slug');
    expect(blogResponse?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText(/404|Không tìm thấy trang/i);
  });

  test('Validates authentication form inputs', async ({ page }) => {
    const auth = new AuthPage(page);
    
    // Bad login inputs
    await auth.gotoLogin();
    await auth.login('not-an-email', 'short');
    
    // Check validation error messages
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
    
    // Attempt login with empty fields
    await auth.gotoLogin();
    await auth.login('', '');
    await expect(auth.emailInput).toHaveAttribute('required', '');
    await expect(auth.passwordInput).toHaveAttribute('required', '');
  });

  test('Validates product creation form limits (negative/zero prices, empty fields)', async ({ page }) => {
    const auth = new AuthPage(page);
    const dashboard = new MerchantDashboardPage(page);

    // Login
    await auth.gotoLogin();
    await auth.login('merchant@example.com', 'MerchantPassword123!');
    await dashboard.goto();

    // Open add product dialog
    await page.locator('button[data-testid="add-product-btn"]').click();

    // Fill invalid zero price
    await dashboard.productNameInput.fill('Khô cá tra phồng');
    await dashboard.productSlugInput.fill('kho-ca-tra-phong');
    await dashboard.productPriceInput.fill('0'); // Zero price
    await dashboard.saveProductBtn.click();

    // Verify UI displays error
    await expect(page.locator('[data-testid="price-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="price-error"]')).toContainText(/Giá phải lớn hơn 0/i);

    // Fill negative price
    await dashboard.productPriceInput.fill('-50000');
    await dashboard.saveProductBtn.click();
    await expect(page.locator('[data-testid="price-error"]')).toContainText(/Giá phải lớn hơn 0/i);
  });

  test('Enforces missing metadata and required description lengths', async ({ page }) => {
    const auth = new AuthPage(page);
    const dashboard = new MerchantDashboardPage(page);

    await auth.gotoLogin();
    await auth.login('merchant@example.com', 'MerchantPassword123!');
    await dashboard.goto();

    await page.locator('button[data-testid="add-product-btn"]').click();
    await dashboard.productNameInput.fill('Khô cá tra phồng');
    await dashboard.productSlugInput.fill('kho-ca-tra-phong');
    await dashboard.productPriceInput.fill('150000');
    
    // Fill descriptive text that is too short
    await dashboard.productDescInput.fill('Cá ngon'); // Under 10 chars
    await dashboard.saveProductBtn.click();
    
    // Expect error for description length
    await expect(page.locator('[data-testid="desc-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="desc-error"]')).toContainText(/Mô tả sản phẩm phải từ 10 ký tự trở lên/i);
  });
});
