# Thư Mục Dữ Liệu Tác Tự (`.agents/data/`)

Thư mục này chứa các dữ liệu động, log đo lường hiệu năng và thông tin trạng thái phục vụ cho quá trình vận hành của các AI Agent trong dự án.

## Mục Đích Các File

1.  **`session-metrics.json`** (Tự động tạo & Gitignored):
    *   Lưu trữ thông số kỹ thuật turn-by-turn của phiên làm việc (Input/Output Tokens, số lượng turns sử dụng, cảnh báo context overload).
    *   Được sử dụng bởi script `calculate-current-turn-tokens.js` và `track-session-metrics.js` để cập nhật số liệu thời gian thực.
2.  **`README-metrics.md`**:
    *   Tài liệu hướng dẫn cách vận hành, xem dashboard và các tham số dòng lệnh cho hệ thống đo lường token và chi phí.

## Quy Tắc Bảo Mật

*   **Không commit dữ liệu nhạy cảm**: Thư mục này được cấu hình loại trừ trong `.gitignore` đối với các file dữ liệu dạng `.json` hoặc `.log` cá nhân.
*   **Dọn dẹp định kỳ**: Dữ liệu metrics có thể được dọn dẹp hoặc xoay vòng sau mỗi sprint hoặc khi dung lượng vượt quá giới hạn.
