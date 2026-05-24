import sql from './client';

async function testConnection() {
  console.log('🔄 Đang kiểm tra kết nối cơ sở dữ liệu...');
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Kết nối thành công!');
    console.log('📅 Thời gian hệ thống database:', result[0].current_time);
  } catch (error) {
    console.error('❌ Lỗi kết nối cơ sở dữ liệu:');
    console.error(error);
  } finally {
    // Đóng pool kết nối để script kết thúc hoàn toàn
    await sql.end();
  }
}

testConnection();
