import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

// Lấy DATABASE_URL tương tự như trong index.ts
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const match = envContent.match(/^DATABASE_URL=(.+)$/m);
      if (match) {
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

// Khởi tạo connection với max: 1 để tránh lỗi UNSAFE_TRANSACTION khi chạy các lệnh giao dịch thủ công (BEGIN; COMMIT;)
const sql = postgres(databaseUrl, { max: 1 });

async function migrate() {
  console.log('=== Bắt đầu chạy migrations ===');
  
  try {
    // 1. Tạo bảng theo dõi migration nếu chưa tồn tại
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // 1.5. Khởi tạo các role mặc định của Supabase (anon, authenticated) nếu chạy ở môi trường clean/local database
    await sql.unsafe(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN
              CREATE ROLE anon;
          END IF;
          IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
              CREATE ROLE authenticated;
          END IF;
      END $$;
    `);

    // 1.6. Khởi tạo schema auth và bảng users nếu chưa tồn tại (cần thiết cho local development)
    await sql.unsafe(`
      DO $$
      BEGIN
          -- Chỉ tạo schema auth giả lập nếu chưa tồn tại (chạy ở local)
          IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
              CREATE SCHEMA auth;
          END IF;

          -- Chỉ tạo bảng auth.users giả lập nếu chưa tồn tại (chạy ở local)
          IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'auth' AND tablename = 'users') THEN
              CREATE TABLE auth.users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                encrypted_password VARCHAR(255) NOT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
              );
          END IF;
      END $$;
    `);


    // 2. Lấy danh sách các file migration trong db/migrations/
    const migrationsDir = path.resolve(process.cwd(), 'db/migrations');
    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Thư mục migrations không tồn tại tại: ${migrationsDir}`);
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sắp xếp theo thứ tự bảng chữ cái/số

    console.log(`Tìm thấy ${files.length} file migration trong thư mục.`);

    // 3. Lấy các migration đã chạy từ cơ sở dữ liệu
    const executedMigrationsRows = await sql`
      SELECT name FROM schema_migrations ORDER BY id ASC;
    `;
    const executedMigrations = new Set(executedMigrationsRows.map((row) => (row as { name: string }).name));

    // 4. Chạy các migration chưa được thực thi
    let count = 0;
    for (const file of files) {
      if (executedMigrations.has(file)) {
        console.log(`[Đã bỏ qua] ${file} - Đã được chạy trước đó.`);
        continue;
      }

      console.log(`[Đang chạy] ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      // Phân tách phần Up từ file migration
      const downIndex = content.indexOf('-- Down');
      let upSql = '';
      if (downIndex !== -1) {
        upSql = content.substring(0, downIndex);
      } else {
        upSql = content;
      }

      // Xóa phần chú thích "-- Up" và khoảng trắng dư thừa
      upSql = upSql.replace(/^\s*--\s*Up\s*/i, '').trim();

      if (!upSql) {
        console.warn(`[Cảnh báo] File ${file} có phần Up rỗng, bỏ qua thực thi SQL.`);
      } else {
        // Thực thi SQL migration
        try {
          await sql.unsafe(upSql);
        } catch (err) {
          console.error(`❌ Lỗi khi thực thi migration ${file}:`, err);
          throw err;
        }
      }

      // Đánh dấu migration đã chạy thành công
      await sql`
        INSERT INTO schema_migrations (name) VALUES (${file});
      `;
      console.log(`[Hoàn thành] ${file} chạy thành công.`);
      count++;
    }

    console.log(`=== Chạy migrations hoàn tất. Đã thực thi ${count} migration mới. ===`);
  } catch (error) {
    console.error('❌ Lỗi hệ thống trong quá trình chạy migrations:', error);
    process.exit(1);
  } finally {
    // Đảm bảo đóng kết nối để process có thể thoát
    await sql.end();
  }
}

// Tự động thực thi khi chạy file qua command line
migrate();
