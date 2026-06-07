import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration cho dự án Hải Sản Cà Mau
 * Tài liệu: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Thư mục chứa E2E test files
  testDir: './e2e',

  // Chạy tests song song để nhanh hơn
  fullyParallel: true,

  // Tạo report HTML sau khi chạy
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  // Cấu hình chung cho tất cả tests
  use: {
    // URL base — dev server cần đang chạy trước
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    // Chụp screenshot khi test fail
    screenshot: 'only-on-failure',

    // Ghi video khi test fail (optional — tắt để tiết kiệm dung lượng)
    video: 'retain-on-failure',

    // Trace cho debugging
    trace: 'on-first-retry',
  },

  // Thử lại 1 lần nếu fail (giảm flaky test)
  retries: process.env.CI ? 2 : 1,

  // Timeout cho mỗi test (ms)
  timeout: 30_000,

  // Timeout cho assertion
  expect: { timeout: 5_000 },

  // Chạy trên Chromium (chính), Firefox, và WebKit
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    // Bật thêm khi cần cross-browser testing:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  /*
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true, // Không restart nếu đã chạy
    timeout: 120_000,
  },
  */
})
