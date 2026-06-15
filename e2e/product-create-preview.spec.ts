import { test, expect } from '@playwright/test';
import { AuthPage } from './helpers/page-objects';
import { resetDatabase } from './helpers/test-utils';

test.describe('E2E: Product Creation Dedicated Page & Live Preview', () => {
  test.beforeEach(async ({ request }) => {
    // Reset database to default seed
    await resetDatabase(request, 'seed');
  });

  test('Should navigate to dedicated page and display live updates in preview', async ({ page }) => {
    const auth = new AuthPage(page);

    // 1. Đăng nhập với tư cách thương lái
    await auth.gotoLogin();
    await auth.login('merchant@example.com', 'MerchantPassword123!');
    
    // 2. Đợi chuyển hướng tự động và nhấn nút tạo mặt hàng mới
    await expect(page).toHaveURL(/.*dashboard\/merchant/);
    await expect(page.locator('button[data-testid="add-product-btn"]')).toBeVisible();
    await page.locator('button[data-testid="add-product-btn"]').click();

    // 3. Đảm bảo đã chuyển hướng sang trang tạo riêng biệt
    await expect(page).toHaveURL(/\/dashboard\/merchant\/san-pham\/tao-moi/);
    await expect(page.locator('h1').first()).toContainText(/Đăng Ký Dòng Sản Vật Mới/i);

    // 4. Nhập thông tin và kiểm tra xem Live Preview có cập nhật trực tiếp hay không
    const uniqueId = Date.now();
    const name = `Cua gạch Năm Căn cực phẩm ${uniqueId}`;
    const slug = `cua-gach-nam-can-cuc-pham-${uniqueId}`;
    const price = '420000';
    const originalPrice = '520000';
    const shortDesc = 'Thịt cua Năm Căn ngọt lịm chắc nịch, gạch đỏ au tràn ngập.';
    const metaDesc = 'Cua gạch Năm Căn Cà Mau tuyển chọn tươi sống sống khỏe 100%. Đặt sỉ giao bồn oxy toàn quốc.';

    // Fill Form inputs
    await page.locator('input[name="product_name"]').fill(name);
    await page.locator('input[name="product_slug"]').fill(slug);
    await page.locator('input[name="product_price"]').fill(price);
    await page.locator('input[name="product_original_price"]').fill(originalPrice);
    await page.locator('textarea[name="product_description"]').fill(shortDesc);
    await page.locator('textarea[name="product_meta_description"]').fill(metaDesc);

    // 5. Kiểm tra Live Preview (Trang chi tiết) cập nhật
    const previewContainer = page.locator('#product-detail-view');
    await expect(previewContainer.locator('h1')).toContainText(name);
    await expect(previewContainer).toContainText('420.000 đ');
    await expect(previewContainer).toContainText('520.000 đ');
    await expect(previewContainer.locator('[data-testid="product-desc-preview"]')).toContainText(shortDesc);

    // 6. Kiểm tra Google SERP Snippet Preview cập nhật
    const googlePreview = page.locator(`h4:has-text("${name} | Giá Vựa Hôm Nay — Hải Sản Cao Cấp")`);
    await expect(googlePreview).toBeVisible();
    await expect(page.locator('p:has-text("Cua gạch Năm Căn Cà Mau tuyển chọn tươi sống")')).toBeVisible();

    // 7. Thực hiện click "Đăng bán sản vật" để submit
    await page.locator('button[data-testid="save-product"]').click();

    // 8. Đảm bảo chuyển hướng về Dashboard chính và tự động mở tab quản lý sản phẩm
    await expect(page).toHaveURL(/\/dashboard\/merchant\?tab=products/);
    
    // 9. Xác nhận sản vật mới xuất hiện trong bảng danh sách quản lý
    await expect(page.locator(`tr:has-text("${name}")`)).toBeVisible();
  });
});
