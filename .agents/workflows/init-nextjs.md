# Workflow: init-nextjs
# description: Khởi tạo dự án Next.js với đầy đủ cấu hình chuẩn SEO, git hooks, husky và linter.
# ---

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

## Bước 5: Build và kiểm tra
1. Chạy `npm run build` để kiểm tra xem dự án có lỗi biên dịch (build error) hay linter error nào không.
2. Báo cáo kết quả lại cho người dùng.
