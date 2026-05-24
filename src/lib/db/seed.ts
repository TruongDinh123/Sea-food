import sql from './client';

async function seedData() {
  console.log('🌱 Đang chèn dữ liệu mẫu vào database...');
  try {
    // 1. Chèn Merchants
    console.log('🔹 Chèn merchants...');
    const merchants = await sql`
      INSERT INTO merchants (name, phone, address, commission_type, commission_value, monthly_flat_rate)
      VALUES 
        ('Vựa Khô Năm Hùng', '0912345678', 'Thị trấn Sông Đốc, Trần Văn Thời, Cà Mau', 'percentage', 5.00, 0.00),
        ('Vựa Hải Sản Đất Mũi', '0987654321', 'Xã Đất Mũi, Ngọc Hiển, Cà Mau', 'fixed', 15000.00, 0.00),
        ('Đại Lý Tôm Khô Tư Đáp', '0909998887', 'Phường 5, TP. Cà Mau, Cà Mau', 'monthly_flat', 0.00, 500000.00)
      RETURNING id, name;
    `;
    console.log(`✅ Đã chèn ${merchants.length} merchants.`);

    const merchantNamHung = merchants[0].id;
    const merchantDatMui = merchants[1].id;
    const merchantTuDap = merchants[2].id;

    // 2. Chèn Products
    console.log('🔹 Chèn products...');
    const products = await sql`
      INSERT INTO products (merchant_id, name, slug, price, original_price, category, description, image_url, is_auto_listed)
      VALUES
        (${merchantNamHung}, 'Tôm khô Cà Mau Rạch Gốc loại 1', 'tom-kho-ca-mau-rach-goc-loai-1', 650000.00, 750000.00, 'Tôm Khô', 'Tôm khô Rạch Gốc tự nhiên, vị ngọt thanh, màu sắc tự nhiên không hóa chất phẩm màu.', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80', true),
        (${merchantNamHung}, 'Khô cá sặc rằn U Minh hạ 3 nắng', 'kho-ca-sac-ran-u-minh-ha-3-nang', 280000.00, 320000.00, 'Khô Cá', 'Khô cá sặc rằn béo ngậy đặc sản vùng U Minh Hạ, đóng gói hút chân không.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', true),
        (${merchantDatMui}, 'Cua Cà Mau loại 1 (dây nhỏ)', 'cua-ca-mau-loai-1-day-nho', 450000.00, 500000.00, 'Cua Tươi', 'Cua thịt Cà Mau chính gốc dây trói siêu nhỏ, chắc thịt thơm ngon ngọt.', 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80', false),
        (${merchantTuDap}, 'Bồn bồn muối chua ngọt Cái Nước', 'bon-bon-muoi-chua-ngot-cai-nuoc', 60000.00, 70000.00, 'Đặc Sản Khác', 'Bồn bồn tươi muối chua ngọt đặc sản Cái Nước Cà Mau ăn kèm cá kho cực ngon.', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80', true)
      RETURNING id, name;
    `;
    console.log(`✅ Đã chèn ${products.length} products.`);

    const productTomKho = products[0].id;
    const productSacRan = products[1].id;

    // 3. Chèn Referral Logs
    console.log('🔹 Chèn referral logs...');
    const logs = await sql`
      INSERT INTO referral_logs (product_id, merchant_id, buyer_phone, order_value, calculated_commission, status)
      VALUES
        (${productTomKho}, ${merchantNamHung}, '0911222333', 1300000.00, 65000.00, 'completed'),
        (${productSacRan}, ${merchantNamHung}, '0922333444', 280000.00, 14000.00, 'pending'),
        (${productTomKho}, ${merchantNamHung}, '0933444555', 650000.00, 0.00, 'cancelled')
      RETURNING id;
    `;
    console.log(`✅ Đã chèn ${logs.length} referral logs.`);

    console.log('\n🎉 Đã chèn dữ liệu mẫu hoàn tất!');
  } catch (error) {
    console.error('❌ Lỗi khi chèn dữ liệu mẫu:');
    console.error(error);
  } finally {
    await sql.end();
  }
}

seedData();
