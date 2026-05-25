---
title: init-nextjs
description: Khởi tạo dự án Next.js với đầy đủ cấu hình chuẩn SEO, git hooks, husky và linter.
maxIterations: 10
---

# 🚀 Workflow: Init Next.js — Khởi Tạo Dự Án

## Phạm Vi & Giới Hạn

**Giới hạn số vòng lặp (maxIterations):** Giới hạn tối đa **10 vòng lặp** (iterations) cho mỗi phiên làm việc để tránh loop vô hạn. Nếu vượt quá giới hạn này mà chưa hoàn thành, dừng lại và yêu cầu hướng dẫn của người dùng.

---

Hãy thực hiện các bước sau một cách tuần tự để khởi tạo dự án Next.js:

## Bước 1: Khởi tạo Next.js App
1. Chạy lệnh: `npx -y create-next-app@latest ./ --typescript --eslint --tailwind --src-dir --app --use-npm --import-alias "@/*"`
2. Chờ quá trình cài đặt dependencies hoàn tất.

## Bước 2: Setup Husky & Commitlint
1. Cài đặt các package cần thiết: `npm install --save-dev husky @commitlint/cli @commitlint/config-conventional`
2. Khởi tạo husky: `npx husky init`
3. Tạo file `commitlint.config.js` ở thư mục gốc với nội dung cấu hình conventional commits:
   ```javascript
   module.exports = {
     extends: ['@commitlint/config-conventional']
   };
   ```
4. Ghi đè file `.husky/commit-msg` để tự động kiểm tra cú pháp commit:
   ```bash
   npx --no -- commitlint --edit \$1
   ```

## Bước 3: Tạo File Môi Trường Template
1. Tạo file `.env.example` ở thư mục gốc dự án theo cấu trúc đã khai báo tại `.agents/rules/env.md`.
2. Tạo file `.env.local` rỗng để sẵn sàng điền các giá trị chạy local.

## Bước 4: Tạo tệp kiểm tra validate env khi khởi chạy
1. Tạo thư mục `src/lib` nếu chưa có.
2. Tạo file `src/lib/env.ts` để kiểm tra các biến môi trường bắt buộc như `DATABASE_URL` khi khởi động dự án.

## Bước 5: Build và Kiểm Tra (Self-Verification)

```bash
npm run build
```

- ✅ **Build thành công** → Dự án đã sẵn sàng. Báo cáo hoàn thành.
- ❌ **Build fail** → Đọc lỗi, sửa ngay, chạy lại. Không để lại broken build.

```bash
npm run lint
```

- ✅ Không có warning/error → Tiếp tục.
- ❌ Có lỗi → Sửa, chạy lại lint.

### Checklist Init Hoàn Thành

- [ ] `npm run build` → thành công
- [ ] `npm run lint` → không có error
- [ ] `.env.example` có đủ tất cả biến cần thiết
- [ ] `.env.local` đã có (có thể rỗng hoặc đã điền)
- [ ] Husky hook hoạt động — thử commit sai format để test
- [ ] `src/lib/env.ts` validate biến môi trường khi khởi động

### Bước Tiếp Theo Sau Init

```
Dự án khởi tạo xong → /dev-be-dat để tạo DB schema đầu tiên
                     → /dev-fe-dinh để tạo layout và trang chủ
```

**Sau khi xong:** Cập nhật `docs/ky-uc/NOTES.md` với trạng thái khởi tạo và tech stack đã cài.
