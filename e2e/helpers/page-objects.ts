import { Page, expect } from '@playwright/test';

/**
 * Base Page class providing common utilities
 */
class BasePage {
  constructor(protected page: Page) {}

  async checkSEO(expectedTitle: string | RegExp, expectedDescription?: string, expectedCanonical?: string) {
    // Check page title
    await expect(this.page).toHaveTitle(expectedTitle);

    // Check meta description if provided
    if (expectedDescription) {
      const descriptionMeta = this.page.locator('meta[name="description"]');
      await expect(descriptionMeta).toHaveAttribute('content', expectedDescription);
    }

    // Check H1 tag (exactly 1 H1 is mandatory for SEO)
    const h1Count = await this.page.locator('h1').count();
    expect(h1Count).toBe(1);

    // Check canonical link if provided
    if (expectedCanonical) {
      const canonicalLink = this.page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveAttribute('href', expectedCanonical);
    }
  }

  async getJSONLD(schemaType: string) {
    const scripts = this.page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent();
      if (content) {
        try {
          const parsed = JSON.parse(content);
          // Schema can be direct or in an @graph array
          if (parsed['@type'] === schemaType) {
            return parsed;
          }
          if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
            const match = parsed['@graph'].find((item: { '@type'?: string }) => item['@type'] === schemaType);
            if (match) return match;
          }
        } catch {
          // Ignore invalid JSON in script tag
        }
      }
    }
    return null;
  }
}

export class LandingPage extends BasePage {
  readonly featuredProducts = this.page.locator('[data-testid="featured-products"]');
  readonly merchantList = this.page.locator('[data-testid="merchant-list"]');
  readonly latestBlogs = this.page.locator('[data-testid="latest-blogs"]');

  async goto() {
    await this.page.goto('/');
  }

  async clickProductLink(slug: string) {
    await this.page.locator(`a[href="/san-pham/${slug}"]`).click();
  }

  async clickMerchantLink(slug: string) {
    await this.page.locator(`a[href="/thuong-lai/${slug}"]`).click();
  }

  async clickBlogLink(slug: string) {
    await this.page.locator(`a[href="/blog/${slug}"]`).click();
  }
}

export class CatalogPage extends BasePage {
  readonly minPriceInput = this.page.locator('input[data-testid="min-price"]');
  readonly maxPriceInput = this.page.locator('input[data-testid="max-price"]');
  readonly categoryFilter = this.page.locator('select[data-testid="category-filter"]');
  readonly merchantFilter = this.page.locator('select[data-testid="merchant-filter"]');
  readonly applyFilterBtn = this.page.locator('button[data-testid="apply-filters"]');
  
  // Order COD form selectors
  readonly buyerNameInput = this.page.locator('input[name="buyer_name"]');
  readonly buyerPhoneInput = this.page.locator('input[name="buyer_phone"]');
  readonly buyerAddressInput = this.page.locator('textarea[name="buyer_address"]');
  readonly paymentMethodSelect = this.page.locator('select[name="payment_method"]');
  readonly submitOrderBtn = this.page.locator('button[data-testid="submit-order"]');
  readonly orderSuccessMsg = this.page.locator('[data-testid="order-success-message"]');

  async gotoList() {
    await this.page.goto('/san-pham');
  }

  async gotoDetail(slug: string) {
    await this.page.goto(`/san-pham/${slug}`);
  }

  async gotoCategory(slug: string) {
    await this.page.goto(`/danh-muc/${slug}`);
  }

  async filter(min?: number, max?: number, category?: string, merchant?: string) {
    if (min !== undefined) await this.minPriceInput.fill(min.toString());
    if (max !== undefined) await this.maxPriceInput.fill(max.toString());
    if (category) await this.categoryFilter.selectOption({ value: category });
    if (merchant) await this.merchantFilter.selectOption({ label: merchant });
    await this.applyFilterBtn.click();
  }

  async placeOrder(name: string, phone: string, address: string, paymentMethod = 'cod') {
    await this.buyerNameInput.fill(name);
    await this.buyerPhoneInput.fill(phone);
    await this.buyerAddressInput.fill(address);
    await this.paymentMethodSelect.selectOption(paymentMethod);
    await this.submitOrderBtn.click();
  }
}

export class MerchantPage extends BasePage {
  async gotoList() {
    await this.page.goto('/thuong-lai');
  }

  async gotoDetail(slug: string) {
    await this.page.goto(`/thuong-lai/${slug}`);
  }
}

export class BlogPage extends BasePage {
  async gotoList() {
    await this.page.goto('/blog');
  }

  async gotoDetail(slug: string) {
    await this.page.goto(`/blog/${slug}`);
  }
}

export class AuthPage extends BasePage {
  readonly emailInput = this.page.locator('input[name="email"]');
  readonly passwordInput = this.page.locator('input[name="password"]');
  readonly loginBtn = this.page.locator('button[data-testid="login-submit"]');
  
  // Registration elements
  readonly merchantNameInput = this.page.locator('input[name="merchant_name"]');
  readonly merchantPhoneInput = this.page.locator('input[name="merchant_phone"]');
  readonly merchantAddressInput = this.page.locator('textarea[name="merchant_address"]');
  readonly registerBtn = this.page.locator('button[data-testid="register-submit"]');
  readonly registerSuccessMsg = this.page.locator('[data-testid="register-success-message"]');

  async gotoLogin() {
    await this.page.goto('/auth/login');
  }

  async gotoRegisterMerchant() {
    await this.page.goto('/auth/register-merchant');
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.loginBtn.click();
  }

  async registerMerchant(name: string, phone: string, address: string, email: string, pass: string) {
    await this.merchantNameInput.fill(name);
    await this.merchantPhoneInput.fill(phone);
    await this.merchantAddressInput.fill(address);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.registerBtn.click();
  }
}

export class MerchantDashboardPage extends BasePage {
  readonly productNameInput = this.page.locator('input[name="product_name"]');
  readonly productSlugInput = this.page.locator('input[name="product_slug"]');
  readonly productPriceInput = this.page.locator('input[name="product_price"]');
  readonly productOrigPriceInput = this.page.locator('input[name="product_original_price"]');
  readonly productCategoryInput = this.page.locator('select[name="product_category"]');
  readonly productDescInput = this.page.locator('textarea[name="product_description"]');
  readonly saveProductBtn = this.page.locator('button[data-testid="save-product"]');

  readonly merchantProfileName = this.page.locator('input[name="profile_name"]');
  readonly merchantProfilePhone = this.page.locator('input[name="profile_phone"]');
  readonly merchantProfileAddress = this.page.locator('textarea[name="profile_address"]');
  readonly saveProfileBtn = this.page.locator('button[data-testid="save-profile"]');

  async goto() {
    await this.page.goto('/dashboard/merchant');
  }

  async createProduct(name: string, slug: string, price: number, origPrice: number, category: string, desc: string) {
    await this.page.locator('button[data-testid="add-product-btn"]').click();
    await this.productNameInput.fill(name);
    await this.productSlugInput.fill(slug);
    await this.productPriceInput.fill(price.toString());
    await this.productOrigPriceInput.fill(origPrice.toString());
    await this.productCategoryInput.selectOption(category);
    await this.productDescInput.fill(desc);
    await this.saveProductBtn.click();
  }

  async deleteProduct(name: string) {
    const row = this.page.locator(`tr:has-text("${name}")`);
    await row.locator('button[data-testid="delete-product-btn"]').click();
    // Confirm dialog if it appears or click confirm button
    await this.page.locator('button[data-testid="confirm-delete-btn"]').click();
  }

  async updateOrderStatus(orderId: string, status: string) {
    const row = this.page.locator(`tr[data-order-id="${orderId}"]`);
    await row.locator('select[name="order_status"]').selectOption(status);
    await row.locator('button[data-testid="update-status-btn"]').click();
  }

  async updateProfile(name: string, phone: string, address: string) {
    await this.page.locator('a[href="#profile"]').click();
    await this.merchantProfileName.fill(name);
    await this.merchantProfilePhone.fill(phone);
    await this.merchantProfileAddress.fill(address);
    await this.saveProfileBtn.click();
  }
}

export class AdminDashboardPage extends BasePage {
  readonly commissionRateInput = this.page.locator('input[name="commission_value"]');
  readonly commissionTypeSelect = this.page.locator('select[name="commission_type"]');
  readonly saveCommissionBtn = this.page.locator('button[data-testid="save-commission"]');

  readonly blogTitleInput = this.page.locator('input[name="blog_title"]');
  readonly blogSlugInput = this.page.locator('input[name="blog_slug"]');
  readonly blogContentInput = this.page.locator('textarea[name="blog_content"]');
  readonly blogMetaInput = this.page.locator('input[name="blog_meta"]');
  readonly blogPublishCheckbox = this.page.locator('input[name="blog_is_published"]');
  readonly saveBlogBtn = this.page.locator('button[data-testid="save-blog"]');

  async goto() {
    await this.page.goto('/dashboard/admin');
  }

  async approveMerchant(name: string) {
    const row = this.page.locator(`tr:has-text("${name}")`);
    await row.locator('button[data-testid="approve-merchant-btn"]').click();
  }

  async configureMerchantCommission(name: string, type: 'percentage' | 'fixed' | 'monthly_flat', value: number) {
    const row = this.page.locator(`tr:has-text("${name}")`);
    await row.locator('button[data-testid="configure-commission-btn"]').click();
    await this.commissionTypeSelect.selectOption(type);
    await this.commissionRateInput.fill(value.toString());
    await this.saveCommissionBtn.click();
  }

  async createBlog(title: string, slug: string, content: string, metaDescription: string, isPublished: boolean) {
    await this.page.locator('button[data-testid="add-blog-btn"]').click();
    await this.blogTitleInput.fill(title);
    await this.blogSlugInput.fill(slug);
    await this.blogContentInput.fill(content);
    await this.blogMetaInput.fill(metaDescription);
    if (isPublished) {
      await this.blogPublishCheckbox.check();
    } else {
      await this.blogPublishCheckbox.uncheck();
    }
    await this.saveBlogBtn.click();
  }
}
