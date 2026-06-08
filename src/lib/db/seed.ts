import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

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

const sql = postgres(databaseUrl, { max: 1 });

async function seed() {
  console.log('=== Bắt đầu nạp dữ liệu mẫu (Seeding Database) ===');

  try {
    // 1.1. Dọn dẹp tài khoản test và dữ liệu cũ
    const isLocal = databaseUrl!.includes('localhost') || databaseUrl!.includes('127.0.0.1');
    
    if (isLocal) {
      console.log('Đang làm sạch tài khoản test auth (local)...');
      await sql`DELETE FROM auth.users WHERE email IN ('merchant@example.com', 'admin@example.com');`;
    }
    
    console.log('Đang làm sạch dữ liệu cũ các bảng public...');
    await sql`TRUNCATE TABLE referral_logs, order_items, orders, products, merchants, blogs RESTART IDENTITY CASCADE;`;

    // 1.2. Thêm tài khoản test vào auth.users (chỉ làm ở local)
    let merchantUserId = null;
    if (isLocal) {
      console.log('Đang tạo tài khoản test auth (local)...');
      const testMerchantId = 'e2e00000-0000-0000-0000-000000000001';
      const testAdminId = 'e2e00000-0000-0000-0000-000000000002';
      
      await sql`
        INSERT INTO auth.users (id, email, encrypted_password)
        VALUES 
          (${testMerchantId}, 'merchant@example.com', 'MerchantPassword123!'),
          (${testAdminId}, 'admin@example.com', 'AdminPassword123!')
        ON CONFLICT (email) DO NOTHING;
      `;
      merchantUserId = testMerchantId;
    }

    // 2. Thêm Merchants
    console.log('Đang tạo merchants mẫu...');
    const merchants = await sql`
      INSERT INTO merchants (name, phone, address, commission_type, commission_value, monthly_flat_rate, user_id)
      VALUES 
        ('Vựa Tôm Khô Năm Căn', '0987654321', 'Khóm 1, Thị trấn Năm Căn, Cà Mau', 'percentage', 5.00, 0.00, ${merchantUserId}),
        ('Vựa Cua Biển Út Đạt', '0912345678', 'Thị trấn Sông Đốc, Trần Văn Thời, Cà Mau', 'fixed', 20000.00, 0.00, NULL),
        ('Hợp Tác Xã Khô Cá Khoai', '0944556677', 'Thị trấn Cái Đôi Vàm, Phú Tân, Cà Mau', 'monthly_flat', 0.00, 500000.00, NULL)
      RETURNING id, name;
    `;
    console.log(`Đã tạo ${merchants.length} merchants.`);

    const namCanId = merchants.find(m => m.name === 'Vựa Tôm Khô Năm Căn')?.id;
    const utDatId = merchants.find(m => m.name === 'Vựa Cua Biển Út Đạt')?.id;
    const phuTanId = merchants.find(m => m.name === 'Hợp Tác Xã Khô Cá Khoai')?.id;

    // 3. Thêm Products
    console.log('Đang tạo sản phẩm mẫu...');
    await sql`
      INSERT INTO products (merchant_id, name, slug, price, original_price, category, description, image_url)
      VALUES 
        (${namCanId}, 'Tôm Đất Khô Rạch Gốc Loại 1', 'tom-dat-kho-rach-goc-loai-1', 680000.00, 750000.00, 'Tôm khô', 'Tôm đất khô thiên nhiên được tuyển chọn từng con từ vùng Rạch Gốc, phơi nắng tự nhiên, không phẩm màu hóa chất.', '/images/products/tom-kho.jpg'),
        (${namCanId}, 'Tôm Khô Loại Đặc Biệt (Cỡ Lớn)', 'tom-kho-loai-dac-biet-co-lon', 850000.00, 900000.00, 'Tôm khô', 'Tôm khô đặc biệt size cực đại thích hợp làm quà biếu sang trọng. Vị ngọt đậm đà tự nhiên.', '/images/products/tom-kho-lon.jpg'),
        (${utDatId}, 'Cua Gạch Cà Mau Chính Hiệu (Size 3 con/kg)', 'cua-gach-ca-mau-chinh-hieu', 450000.00, 500000.00, 'Cua tươi sống', 'Cua gạch Cà Mau nổi tiếng chắc thịt, đầy gạch béo ngậy. Cam kết dây trói siêu nhẹ trói không trọng lượng.', '/images/products/cua-gach.jpg'),
        (${utDatId}, 'Cua Thịt Cà Mau Y3 chắc ngọt', 'cua-thit-ca-mau-y3', 350000.00, 390000.00, 'Cua tươi sống', 'Cua thịt Y3 chính gốc Đầm Dơi/Năm Căn Cà Mau. Thịt ngọt lịm, bao ăn 1 đổi 1 nếu bị ốp.', '/images/products/cua-thit.jpg'),
        (${phuTanId}, 'Khô Cá Khoai Cái Đôi Vàm', 'kho-ca-khoai-cai-doi-vam', 250000.00, 280000.00, 'Khô cá', 'Khô cá khoai đặc sản Cái Đôi Vàm thơm ngon. Thích hợp làm mồi nhậu nướng chấm mắm me.', '/images/products/ca-khoai.jpg')
    `;
    console.log('Đã tạo xong các sản phẩm.');

    // 4. Thêm Blogs
    console.log('Đang tạo bài viết blogs mẫu...');
    await sql`
      INSERT INTO blogs (title, slug, meta_description, content, cover_image_url, is_published, publish_date)
      VALUES 
        ('Bí quyết chọn tôm khô ngon không hóa chất chuẩn Cà Mau', 'cach-chon-tom-kho-ngon-ca-mau', 'Hướng dẫn phân biệt tôm khô đất tự nhiên Cà Mau với tôm khô công nghiệp tẩm phẩm màu hóa chất độc hại.', 'Tôm khô Cà Mau từ lâu đã nổi tiếng khắp cả nước nhờ hương vị ngọt tự nhiên, thơm ngon đặc trưng. Tuy nhiên, hiện nay trên thị trường có nhiều sản phẩm nhái, tẩm phẩm màu đỏ hóa chất độc hại. Để chọn được tôm khô chuẩn ngon: 1. Quan sát màu sắc: Tôm đất khô tự nhiên có màu đỏ cam hơi nhạt ở phần lưng và trắng hồng ở phần bụng. Tránh mua tôm đỏ đều toàn thân vì dễ tẩm phẩm màu. 2. Độ cứng: Tôm đất thiên nhiên phơi đủ nắng có thịt dai, săn chắc, không quá mềm cũng không quá cứng giòn. 3. Mùi vị: Khi ăn thử có vị ngọt đậm đặc trưng, không bị mặn chát hay có mùi khai của Urê.', '/images/blogs/bi-quyet-tom-kho.jpg', true, NOW()),
        ('Mẹo chọn cua biển Cà Mau chắc thịt bao ăn chính gốc', 'bi-quyet-chon-cua-bien-ca-mau', 'Chia sẻ kinh nghiệm thực tế cách chọn cua gạch, cua thịt Cà Mau chắc thịt, ngon béo không sợ bị mua nhầm cua ốp.', 'Để chọn được những con cua biển Cà Mau chắc thịt, nhiều gạch và tươi ngon: 1. Xem yếm cua: Cua thịt ngon có yếm cứng, khi lấy tay bóp mạnh vào phần yếm dưới bụng cua không bị lún (nếu lún là cua ốp). 2. Xem màu da hốc khuỷu trên càng cua: Nếu hốc khuỷu có màu hồng đỏ hoặc sậm màu là cua đã già, thịt chắc béo. Cua non sẽ có hốc khuỷu trắng nhạt. 3. Xem gai trên mai cua: Cua già chắc thịt sẽ có các gai trên mai cua mòn đi, sần sùi chứ không nhọn hoắt như cua non.', '/images/blogs/meo-chon-cua.jpg', true, NOW())
    `;
    console.log('Đã tạo xong các bài viết blogs.');

    console.log('=== Nạp dữ liệu mẫu thành công! ===');
  } catch (error) {
    console.error('❌ Lỗi trong quá trình seed database:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seed();
