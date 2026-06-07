import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      // Tìm dòng DATABASE_URL=...
      const match = envContent.match(/^DATABASE_URL=(.+)$/m);
      if (match) {
        // Loại bỏ khoảng trắng và nháy đơn/kép nếu có
        databaseUrl = match[1].trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch (error) {
    console.error('Lỗi khi đọc file .env.local làm fallback:', error);
  }
}

if (!databaseUrl) {
  throw new Error('DATABASE_URL không được định nghĩa trong biến môi trường hoặc file .env.local');
}

// Khởi tạo connection pool sử dụng thư viện postgres
const sql = postgres(databaseUrl, {
  max: 10,                 // Số lượng kết nối tối đa trong pool
  idle_timeout: 20,        // Thời gian tối đa một kết nối được ở trạng thái rảnh (giây)
  connect_timeout: 10,     // Thời gian tối đa để thiết lập kết nối (giây)
});

export default sql;
