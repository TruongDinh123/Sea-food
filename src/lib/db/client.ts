import postgres from 'postgres';

// Đảm bảo các biến môi trường được xác thực trước khi kết nối
import '../env';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('[Database Client Error] DATABASE_URL is missing. Please define it in your .env.local file.');
}

// Singleton Pattern để tránh rò rỉ kết nối (Connection Leak) trong môi trường Development khi Next.js hot-reload
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

export const sql =
  globalForDb.conn ??
  postgres(databaseUrl, {
    max: 10,          // Số lượng kết nối tối đa trong pool
    idle_timeout: 20, // Thời gian giải phóng kết nối nhàn rỗi (giây)
    connect_timeout: 10, // Thời gian chờ kết nối tối đa (giây)
    // Supabase sử dụng SSL mặc định cho các kết nối từ bên ngoài
    ssl: process.env.NODE_ENV === 'production' ? 'require' : { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.conn = sql;
}

export default sql;
