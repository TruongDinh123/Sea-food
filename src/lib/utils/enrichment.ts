import { Product } from "@/types/product.types";
import { Merchant } from "@/types/merchant.types";

export interface EnrichedProduct extends Product {
  images: string[];
  priceLabel: string;
  oldPriceLabel?: string;
  unit: string;
  sizes: string[];
  sizeLabel: string;
  prepGuide: string;
  recipe: string;
  rating: number;
  reviewsCount: number;
  harvestLocation: string;
  specifications: { key: string; value: string }[];
}

export interface EnrichedMerchant extends Merchant {
  avatar: string;
  coverImage: string;
  location: string;
  experience: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  isCertified: boolean;
  certifications: string[];
  contactPhone: string;
  contactEmail: string;
  slug: string;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9 -]/g, "") // Remove invalid chars
    .replace(/\s+/g, "-") // Collapse whitespace and replace by -
    .replace(/-+/g, "-") // Collapse dashes
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function enrichProduct(product: Product): EnrichedProduct {
  const isCua = product.category === "cua-bien" || product.name.toLowerCase().includes("cua");
  
  const defaultImages = isCua
    ? [
        product.image_url || "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=800&q=80"
      ]
    : [
        product.image_url || "https://images.unsplash.com/photo-1559742811-82410b01081a?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80"
      ];

  const priceFormatted = product.price.toLocaleString("vi-VN") + "đ";
  const oldPriceFormatted = product.original_price 
    ? product.original_price.toLocaleString("vi-VN") + "đ"
    : undefined;

  const unit = isCua ? "kg" : "kg";

  const sizes = isCua
    ? ["Size lớn: 2 con/kg", "Size vừa: 3 con/kg"]
    : ["Size Lớn (10-12 con/kg)", "Size Vừa (15-20 con/kg)"];

  const prepGuide = isCua
    ? "Bước 1: Rửa cua sạch bùn đất dính kẽ chân dưới vòi nước chảy xiết. Bước 2: Không tháo dây trói lạt vội, dùng mũi dao nhọn đam mạnh thẳng vào tim cua nằm dưới yến (phần tiếp giáp đầu khía) cho cua tê liệt mất cảm giác, sau đó tháo dây trói kỹ lưỡng gỡ bỏ các rêu bám."
    : "Rửa sạch tôm bằng nước muối nhạt, dùng tăm gẩy khẽ rút bỏ sợi chỉ đen thẫm dộc sống lưng tôm để tôm chín không bị đắng cát sạm.";

  const recipe = isCua
    ? "Món ngon khuyên dùng: Cua gạch xốt xào me chua cay đậm hương vị dã ngoại hoặc Cua gạch hấp bia sả giữ trọn vẹn từng thớ gạch son dẻo ngậy ngọt lịm nguyên bản."
    : "Món tuyệt hảo: Nướng muối ớt xiêm xanh trên bếp than củi thơm phức, vỏ tôm phồng đỏ cháy cạnh dòn rụm đãi bạn hữu.";

  const harvestLocation = isCua ? "Năm Căn, Cà Mau" : "Sông Đốc, Cà Mau";

  const specifications = isCua
    ? [
        { key: "Xuất xứ", value: "Năm Căn, Cà Mau (Chuẩn cua tự nhiên đầm đước)" },
        { key: "Quy cách giao hàng", value: "Giao sống tận nơi bơm oxy dạt chuẩn" },
        { key: "Trọng lượng trói", value: "Trói lạt đay mảnh thấm nước nhẹ dưới 10g" },
        { key: "Tỉ lệ thịt", value: "Bao ăn đồi trả hoàn tiền nếu dưới 90% thịt" },
        { key: "Độ béo gạch", value: "Gạch son phủ kín khoang bụng đỏ hồng hào mịn dẻo" }
      ]
    : [
        { key: "Môi trường sống", value: "Tự nhiên dưới tán đước 100%" },
        { key: "Màu sắc vỏ tôm", value: "Xanh đen, sọc vằn vàng bóng cực nét" },
        { key: "Dinh dưỡng", value: "Giàu đạm canxi hoang dã tự nhiên sạch" }
      ];

  const rating = isCua ? 4.9 : 4.8;
  const reviewsCount = isCua ? 420 : 380;

  return {
    ...product,
    images: defaultImages,
    priceLabel: isCua ? `${priceFormatted} - 720.000đ / kg` : `${priceFormatted} / kg`,
    oldPriceLabel: oldPriceFormatted ? `${oldPriceFormatted} / kg` : undefined,
    unit,
    sizes,
    sizeLabel: sizes[0],
    prepGuide,
    recipe,
    rating,
    reviewsCount,
    harvestLocation,
    specifications
  };
}

export function enrichMerchant(merchant: Merchant): EnrichedMerchant {
  const isChuNam = merchant.name.toLowerCase().includes("chú năm");
  const isAnhBa = merchant.name.toLowerCase().includes("ba");
  
  let avatar = "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=150&h=150&q=80";
  let coverImage = "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80";
  let experience = "10 năm kinh nghiệm sông nước Cà Mau";
  let bio = "Tôi làm nghề thu mua thủy sản đầm lầy, cam kết lựa chọn tận tay những con cua gạch đỏ chất lượng đắt đỏ, những mẻ tôm sú hoang dã béo múp sạch sẽ an toàn.";
  let rating = 4.8;
  let reviewsCount = 120;
  let isCertified = true;
  let certifications = ["Chứng nhận ATVSTP Cà Mau", "Chuỗi cung ứng thủy sản an toàn VietGAP"];
  
  if (isChuNam) {
    avatar = "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=150&h=150&q=80";
    coverImage = "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80";
    experience = "25 năm kinh nghiệm đầm đìa sông nước Năm Căn";
    bio = "Tôi sinh ra và lớn lên ngay bờ kênh Năm Căn Tây Cà Mau, ba đời làm nghề thu mua thủy sản đầm lầy. Hơn 25 năm qua, tôi lặn lội khắp mọi ngóc ngách đầm rạch đước ngập mặn để lựa chọn tận tay những con cua gạch đỏ chất lượng đắt đỏ, những mẻ tôm sú hoang dã béo múp cho gia đình miền xuôi thưởng thức sạch sẽ an toàn.";
    rating = 4.9;
    reviewsCount = 1420;
    isCertified = true;
    certifications = ["Chuỗi cung ứng thủy sản an toàn VietGAP", "Chứng nhận ATVSTP Cà Mau", "Top 10 Vựa Thủy Sản Tiêu Biểu Bán Đảo Cà Mau"];
  } else if (isAnhBa) {
    avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80";
    coverImage = "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&w=1200&q=80";
    experience = "15 năm điều độ tàu cào khơi vạn dặm hải trình";
    bio = "Quản lý hợp tác xã đánh bắt hơn 12 tàu viễn dương lớn hoạt động tại ngư trường Tây Nam Bộ, Anh Ba Biên là đầu mối thu mua mực câu tươi xẻ trực tiếp trên boong tàu và tôm cọp biển khủng tươi rói bơm khí oxy vận chuyển ngay bằng xe tải đông lạnh chuyên dụng về thành phố trong đêm.";
    rating = 4.8;
    reviewsCount = 930;
    isCertified = true;
    certifications = ["Chứng nhận Nguồn gốc khai thác hợp pháp IUU", "Hệ thống quản lý chất lượng HACCP toàn phần", "Thương Hiệu Thủy Sản Uy Tín Cà Mau"];
  } else {
    avatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80";
    coverImage = "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80";
    experience = "12 năm bảo tồn làng nghề truyền thống đặc sản đảo ngọc";
    bio = "Nổi tiếng khắp bến tàu Hàm Ninh cũ với xưởng chế biến hải sản khô đóng mộc truyền thống, Chị Tư Phú Quốc phân phối dòng khô mực ống câu dẻo mật thơm mềm ngọt như mía lùi và tôm khô thượng hạng lọc muối biển nguyên chất không phẩm màu độc hại.";
    rating = 4.7;
    reviewsCount = 610;
    isCertified = false;
    certifications = ["Chứng nhận ATVSTP Kiên Giang", "Sản phẩm OCOP 4 Sao Đảo Ngọc"];
  }

  const slug = slugify(merchant.name);

  return {
    ...merchant,
    avatar,
    coverImage,
    location: merchant.address || "Cà Mau",
    experience,
    bio,
    rating,
    reviewsCount,
    isCertified,
    certifications,
    contactPhone: merchant.phone,
    contactEmail: `${slug}@haisancaocap.vn`,
    slug
  };
}
