# Workflow: handoff
# description: Tự động tổng hợp trạng thái, lưu log kỹ thuật, tạo file SESSION_STATUS.md và thông báo bàn giao phiên.
# ---

Hãy thực hiện các bước sau để bàn giao phiên hiện tại:

## Bước 1: Chạy build kiểm tra dự án
1. Chạy lệnh: `npm run build` để đảm bảo dự án ở trạng thái chạy ổn định trước khi bàn giao.

## Bước 2: Tạo tài liệu SESSION_STATUS.md
1. Tạo thư mục session mới dưới dạng `docs/ky-uc/ky-uc-hien-tai/yyyy-mm-dd-session-XXX/` (tăng số thứ tự phiên lên 1).
2. Tạo file `SESSION_STATUS.md` ghi lại:
   - Các file đã tạo hoặc chỉnh sửa trong phiên này.
   - Trạng thái hiện tại (build kết quả ra sao).
   - Danh sách chi tiết các nhiệm vụ tiếp theo cần làm ở phiên mới.

## Bước 3: Thông báo bàn giao
1. In ra một thông điệp ngắn gọn cho người dùng:
   "Đã lưu lại trạng thái phiên tại SESSION_STATUS.md. Hãy tạo một cuộc hội thoại mới và gõ lệnh `/resume` để tiếp tục công việc của chúng ta."
