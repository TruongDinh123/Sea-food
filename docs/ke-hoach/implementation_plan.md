# Kế Hoạch Triển Khai: Tích Hợp Skills Vào Các Workflows

Tài liệu này mô tả kế hoạch cập nhật toàn bộ 7 tệp workflow của các agent (Tech Lead, BA, Dev BE, Dev FE, DevOps, PM, QA) để tích hợp các chỉ dẫn sử dụng kỹ năng (skills) phù hợp, đảm bảo các agent tự động kích hoạt đúng kỹ năng từ `docs/skills_guide.md` khi thực hiện nhiệm vụ.

---

## User Review Required

> [!IMPORTANT]
> - Các workflow sẽ được cập nhật để bổ sung phần "Kỹ Năng Khuyên Dùng (Recommended Skills)" ở đầu mỗi bước chính hoặc đầu file.
> - Các agent sẽ biết cách gọi và kích hoạt các skill này (thực tế chúng sẽ tự động được tải vào context nhờ cơ chế Progressive Disclosure khi có mô tả/chỉ dẫn phù hợp trong workflow).

---

## Proposed Changes

Chúng ta sẽ sửa đổi 7 tệp workflow chính trong thư mục `.agents/workflows/`:

### Workflows

#### [MODIFY] [tech-lead-an.md](file:///e:/Web-Seo/.agents/workflows/tech-lead-an.md)
Tích hợp các skill:
- `senior-architect` & `cto-advisor` (Quyết định kiến trúc & hệ thống)
- `code-reviewer` (Review code / PR)
- `tech-debt-tracker` (Audit codebase & quản lý nợ kỹ thuật)

#### [MODIFY] [ba-sprint.md](file:///e:/Web-Seo/.agents/workflows/ba-sprint.md)
Tích hợp các skill:
- `product-manager-toolkit` (Phân tích yêu cầu)
- `agile-product-owner` (Phân rã task & viết user story)
- `scrum-master` (Lập kế hoạch sprint)

#### [MODIFY] [dev-be-dat.md](file:///e:/Web-Seo/.agents/workflows/dev-be-dat.md)
Tích hợp các skill:
- `senior-backend` & `database-designer` (Tầng dữ liệu & DB migration)
- `api-patterns` (Thiết kế API Route)

#### [MODIFY] [dev-fe-dinh.md](file:///e:/Web-Seo/.agents/workflows/dev-fe-dinh.md)
Tích hợp các skill:
- `senior-frontend` & `ui-design-system` (Xây dựng UI component)
- `seo-audit` & `react-best-practices` (Tối ưu SEO page & Core Web Vitals)

#### [MODIFY] [dev-ops-duc.md](file:///e:/Web-Seo/.agents/workflows/dev-ops-duc.md)
Tích hợp các skill:
- `senior-devops` (CI/CD & Cấu hình môi trường)
- `skill-security-auditor` (Security audit & npm audit check)

#### [MODIFY] [pm-quan.md](file:///e:/Web-Seo/.agents/workflows/pm-quan.md)
Tích hợp các skill:
- `product-manager-toolkit` & `product-strategist` (Viết user story, RICE framework & roadmap)

#### [MODIFY] [qa-vi.md](file:///e:/Web-Seo/.agents/workflows/qa-vi.md)
Tích hợp các skill:
- `senior-qa` (Viết unit test & smoke test)
- `webapp-testing` (E2E Playwright test)

---

## Verification Plan

### Automated Tests
- Chạy `npm run lint` để kiểm tra xem có lỗi cú pháp hoặc ESLint nào sau khi thay đổi hay không.

### Manual Verification
- Kiểm tra lại các file workflow sau khi sửa để đảm bảo cấu trúc Markdown chuẩn và các liên kết/tên skill chính xác.
