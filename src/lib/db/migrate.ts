import fs from 'fs';
import path from 'path';
import sql from './client';

async function runMigrations() {
  console.log('🔄 Bắt đầu chạy di trú cơ sở dữ liệu (Database Migrations)...');
  
  const migrationsDir = path.join(process.cwd(), 'db/migrations');
  
  try {
    // Đọc tất cả các file migration
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Đảm bảo chạy đúng thứ tự: 001, 002, 003...
      
    for (const file of files) {
      console.log(`\n🔹 Đang chạy migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sqlContent = fs.readFileSync(filePath, 'utf-8');
      
      // Tách khối Up và Down. Phần Up nằm ở đầu cho đến trước dòng "-- Down"
      const upSql = sqlContent.split('-- Down')[0].replace('-- Up', '').trim();
      
      if (!upSql) {
        console.log(`⚠️ Không tìm thấy lệnh Up trong file ${file}`);
        continue;
      }
      
      console.log('⚡ Thực thi SQL di trú...');
      // Chạy câu lệnh SQL
      await sql.unsafe(upSql);
      console.log(`✅ Hoàn thành migration: ${file}`);
    }
    
    console.log('\n🎉 Tất cả các file di trú đã được thực thi thành công!');
  } catch (error) {
    console.error('❌ Lỗi trong quá trình chạy di trú:');
    console.error(error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigrations();
