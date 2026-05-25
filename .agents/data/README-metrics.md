# 📊 Session Metrics Tracking

Hệ thống theo dõi **input/output token**, **số lần hội thoại (turns)**, và **cảnh báo ngưỡng** tự động cho dự án Hải Sản Cà Mau.

---

## 🔧 Files Liên Quan

| File | Mục Đích |
|---|---|
| `.agents/scripts/track-session-metrics.js` | Hiển thị Dashboard metrics tổng của session |
| `.agents/scripts/calculate-current-turn-tokens.js` | Tự động tính toán In/Out tokens cho mỗi turn chat và cập nhật metrics |
| `.agents/data/session-metrics.json` | Dữ liệu metrics tích lũy (không commit lên git) |
| `.agents/hooks.json` | Hooks tự động gọi script |

---

## 🚀 Cách Dùng Tự Động

Mỗi khi kết thúc lượt phản hồi, Agent sẽ tự động chạy:
```bash
node .agents/scripts/calculate-current-turn-tokens.js --update
```
Lệnh này sẽ tự động:
1. Đọc `transcript.jsonl` từ lần `USER_INPUT` cuối.
2. Cộng dồn tất cả các bước (steps) bao gồm tool calls/outputs của turn hiện tại để có số lượng In/Out token thực tế.
3. Ghi nhận số liệu, tăng turn counter lên +1 và lưu vào `.agents/data/session-metrics.json`.
4. In ra dòng thông tin Markdown để in trực tiếp vào cuối đoạn chat.

---

## ⚠️ Ngưỡng Cảnh Báo

| Loại | ⚠️ Warning | 🔴 Danger | Hành Động |
|---|---|---|---|
| Input tokens | 100K | 180K | Xem xét context compaction |
| Output tokens | 50K | 100K | Viết phản hồi ngắn hơn |
| Turns / session | 20 | 35 | Chạy `/handoff` |
| Tổng tokens | 150K | 300K | Tối ưu chi phí |

---

## 💰 Bảng Chi Phí Ước Tính (per 1M tokens)

| Model | Input | Output |
|---|---|---|
| `gemini-flash` (Gemini 3.5 Flash) | $0.075 | $0.30 |
| `claude-sonnet` (Claude Sonnet 4.x) | $3.00 | $15.00 |
| `default` (fallback) | $1.00 | $4.00 |

---

## 🔄 Luồng Tự Động (Hooks)

```
PreInvocation:
  1. load-working-memory.js    → Hiển thị Working Memory từ NOTES.md
  2. track-session-metrics.js --show  → Hiển thị dashboard metrics tổng dồn

MODEL Response:
  (Chạy trong lúc tạo response)
  node calculate-current-turn-tokens.js --update  → Tính toán và cộng dồn metrics của turn hiện tại
```
