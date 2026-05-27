# 📖 Commit Hook Guide — Hướng Dẫn Tham Chiếu

> File này giải thích cách 2 hooks trong `.husky/` hoạt động và cách agent tích hợp vào Self-Verification.

---

## Hooks Hiện Có

| Hook | File | Kích Hoạt Khi | Làm Gì |
|---|---|---|---|
| `pre-commit` | `.husky/pre-commit` | Trước khi tạo commit | Chạy `tsc --noEmit` + `next lint` |
| `commit-msg` | `.husky/commit-msg` | Sau khi viết commit message | Kiểm tra format Conventional Commits |

---

## Conventional Commit Format (Bắt Buộc)

```
<type>(<scope>): <subject>

Ví dụ hợp lệ:
  feat(product): add product detail page with JSON-LD schema
  fix(api): handle null merchant_id in product response
  chore(db): add index on products.slug column
  test(merchant): add unit tests for merchant service
  docs(agents): update sprint contract format in dev-fe workflow

Ví dụ KHÔNG hợp lệ (sẽ bị reject bởi commit-msg hook):
  "Update files"
  "fix bug"
  "wip"
  "feat: "  ← thiếu subject
```

**Types hợp lệ cho dự án này:**
- `feat` — Tính năng mới
- `fix` — Sửa lỗi
- `docs` — Chỉ thay đổi tài liệu
- `style` — Format, thiếu dấu chấm phẩy... (không thay đổi logic)
- `refactor` — Refactor không fix bug và không thêm feature
- `perf` — Tối ưu hiệu suất
- `test` — Thêm/sửa tests
- `chore` — Thay đổi build process, dependencies, config

**Scopes hợp lệ:**
`product` | `merchant` | `seo` | `api` | `db` | `ui` | `auth` | `agents` | `test` | `config`

---

## Cách Agent Tích Hợp Vào Self-Verification

Trong bước **Self-Verification** của workflow, agent phải chạy:

```bash
# 1. Verify hooks đang active
cat .husky/pre-commit
cat .husky/commit-msg

# 2. Dry-run: Kiểm tra commit message trước khi commit thật
echo "feat(product): add product list page" | npx commitlint

# 3. Commit với message đúng format
git add .
git commit -m "feat(product): add product list page with SEO metadata"
# Hook sẽ tự chạy: tsc → eslint → commitlint
```

---

## Troubleshooting

| Lỗi | Nguyên nhân | Giải pháp |
|---|---|---|
| `npx: command not found` | PATH không có Node | Kiểm tra PATH trong hook file |
| Hook không chạy | Husky chưa install | Chạy `npm run prepare` |
| `commitlint: command not found` | Package chưa install | Chạy `npm install` |
| Hook bị bypass | Ai đó dùng `git commit --no-verify` | Không được phép, vi phạm quy trình |

---

## Kiểm Tra Hook Đang Hoạt Động

```bash
# Thử commit với message sai format — phải bị reject
git commit -m "bad commit message"
# Expected: "⧗   input: bad commit message ... ✖   subject may not be empty"

# Thử commit đúng format — phải pass
git commit -m "chore(config): test commit hook"
```
