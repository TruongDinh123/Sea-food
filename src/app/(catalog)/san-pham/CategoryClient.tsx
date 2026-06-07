'use client';

import { useState, useMemo } from 'react';
import { Star, HelpCircle, ArrowUpDown, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { EnrichedProduct, EnrichedMerchant } from '@/lib/utils/enrichment';

interface CategoryClientProps {
  initialProducts: EnrichedProduct[];
  merchants: EnrichedMerchant[];
  activeCategorySlug?: string;
  initialSearchQuery?: string;
}

const CATEGORIES = [
  {
    id: 'cat_cua',
    slug: 'cua-bien',
    name: 'Cua Biển Cà Mau',
    longDescription: 'Vùng Đất Mũi Cà Mau với hệ sinh thái rừng ngập mặn trù phú feralit sình lầy quanh năm là chiếc nôi tuyệt vời nuôi dưỡng loài Cua Biển ngon nhất Việt Nam. Được nuôi thả hoàn toàn tự nhiên trọng vùng rừng đước Năm Căn, Đầm Dơi, cua biển Cà Mau sở hữu cấu trúc thịt săn chắc tuyệt đối, vị ngọt thanh tự nhiên xen lẫn độ mặn mòi nguyên bản của đại dương cùng lớp gạch đỏ au bùi ngậy. Hệ thống vựa liên kết trực tiếp với các thương lái giàu kinh nghiệm cam kết thu mua tại đầm bảo đảm chất lượng hàng đầu.',
    faqs: [
      {
        question: 'Làm thế nào để phân biệt Cua Biển Cà Mau thật với các loại cua khác?',
        answer: 'Cua Cà Mau thật thường có màu sẫm đặc trưng của bùn đất ngập mặn, mai cua cứng cáp, các khớp chân chắc chắn không bủng nhão. Khi bấm vào nốt thứ 3 ở yếm cua, cảm giác cứng ngắc không bị lún là cua chắc thịt đầy 100%. Phía dưới bụng cua có màu hơi đục hoặc vàng phèn tự nhiên, không trắng sáng bóng như cua nuôi công nghiệp sình lầy nông.'
      },
      {
        question: 'Giá cua biển Cà Mau tại vựa thương lái thường biến động như thế nào?',
        answer: 'Giá cua dao động dựa trên lượng con nước (ngày rằm âm lịch cua thường ốp, giá hạ; ngày tối trời nước lên cua chắc thịt, giá cao hơn) và các dịp lễ tết nhu cầu xuất khẩu tăng mạnh. Hải Sản Cao Cấp cập nhật bảng giá gốc trực tiếp từ các thương lái thu mua tại Năm Căn hàng ngày để đảm bảo tính minh bạch cho khách sỉ lẻ.'
      },
      {
        question: 'Chính sách bảo hành và đổi trả của vựa đối với cua bị ốp, hỏng là gì?',
        answer: 'Với cam kết chất lượng chuẩn E-E-A-T, tất cả cua mua trực tiếp từ thương lái trên hệ thống đều được bảo hành 1 đổi 1 nếu tỷ lệ thịt dưới 85% hoặc cua bị chết trong quá trình vận chuyển oxy đến tay khách hàng. Khách hàng chỉ cần quay video khui cua cắt đôi gửi trực tiếp lên hệ thống.'
      }
    ]
  },
  {
    id: 'cat_tom',
    slug: 'tom-su',
    name: 'Tôm Sú Quảng Canh',
    longDescription: 'Tôm Sú tự nhiên Đất Mũi được sinh trưởng dưới tán rừng ngập mặn Cà Mau, sống hoàn toàn dựa vào nguồn thức ăn tự nhiên của hệ sinh thái mà không sử dụng bất kỳ hóa chất hay thức ăn công nghiệp nào. Nhờ việc bơi lội trong dòng nước triều dâng rút liên tục, cơ thịt tôm sú rừng cực kỳ chắc, dai giòn sần sật và vỏ tôm dày sẫm màu ánh xanh. Đây là dòng hải sản được giới sành ăn săn đón nhiệt tình và đạt tiêu chuẩn xuất khẩu nghiêm ngặt sang các thị trường Nhật Bản, Châu Âu.',
    faqs: [
      {
        question: 'Tôm sú sinh thái rừng ngập mặn khác gì với tôm sú nuôi công nghiệp?',
        answer: 'Tôm sú sinh thái có vỏ dày bền bỉ, sọc đen vàng trên lưng hiển thị rất rõ ràng rực rỡ, thịt ngọt đậm và không bị ra nước nhiều khi luộc chín. Tôm công nghiệp nuôi ao bạt vỏ mỏng, thịt bở hơn và nhạt hơn do cho ăn cám công nghiệp.'
      },
      {
        question: 'Tôm sú biển khổng lồ (size khủng 5-8 con) có thường xuyên có hàng không?',
        answer: 'Tôm sú biển khổng lồ hay còn gọi là Tôm Cọp biển được đánh bắt trực tiếp bằng tàu cào khơi ngoài ranh mặn Sông Đốc. Sản lượng hoàn toàn tự nhiên nên số lượng khan hiếm, thường được ưu tiên giao cho các khách hàng đặt trước bằng cách đặt cọc hoặc liên hệ trực tiếp với thương lái giao tươi sống bơm oxy.'
      },
      {
        question: 'Làm sao để bảo quản tôm sú giữ được độ tươi sống ngon nhất?',
        answer: 'Tốt nhất hãy chế biến ngay khi tôm còn sống. Nếu cần trữ qua ngày, phương pháp tối ưu là ướp đá lạnh giữ ẩm sấp mặt trong thùng xốp cách nhiệt, hoặc cấp đông sâu nguyên con sau khi đã rửa sạch xếp vào hộp nhỏ phủ kín nước đá để ngăn cháy lạnh.'
      }
    ]
  },
  {
    id: 'cat_kho',
    slug: 'do-kho',
    name: 'Đồ Khô Cao Cấp',
    longDescription: 'Phân khúc Đồ Khô Cao Cấp hội tụ tinh hoa từ các làng nghề nổi tiếng dọc bờ biển Việt Nam. Toàn bộ sản phẩm như Tôm Khô Vinh Kim xỏ xâu phơi nắng tự nhiên, Khô Mực Câu Phú Quốc xẻ phơi ngay trên boong tàu giữa biển khơi bảo đảm độ mềm ngọt tự nhiên, không tẩm ướp phụ gia hóa chất độc hại hay phẩm màu hóa học. Đây không chỉ là món ngon đãi tiệc bổ dưỡng mà còn là món quà tri ân đẳng cấp gửi gắm hương vị mặn mòi xứ biển dâng tặng người trân quý.',
    faqs: [
      {
        question: 'Tại sao tôm khô Vinh Kim có giá thành cao vượt trội so với tôm khô thường?',
        answer: 'Tôm khô Vinh Kim (Trà Vinh) được làm từ 100% tôm đất tự nhiên đánh bắt thủ công bằng lú ở vùng nước lợ đặc trưng. Tôm đất nguyên liệu tươi rói luộc đúng lửa, lột vỏ thủ công khéo léo và phơi nắng tự nhiên hoàn toàn không phẩm màu màu muối diêm. Cần đến 9-10kg tôm tươi mới chế biến được 1kg tôm khô thành phẩm thượng hạng.'
      },
      {
        question: 'Mực khô cao cấp đạt chuẩn ngon đúng điệu cần những đặc điểm gì?',
        answer: 'Mực khô hảo hạng được làm từ mực ống câu tươi xanh xẻ ngay tại chỗ trên tàu biển, căng phơi võng treo dưới nắng gió đại dương. Lớp phấn trắng phủ đều mịn màng, thân mực dày dặn màu hồng nhạt tự nhiên, ngửi thơm phức mùi mực biển khô chứ không có mùi khai nồng hắc xước.'
      },
      {
        question: 'Bảo quản mực khô và tôm khô trong gia đình như thế nào để tránh ẩm mốc?',
        answer: 'Nên quấn chặt mực khô, tôm khô trong túi nilon kính khí hoặc đóng túi hút chân không, bảo quản trong tủ đông ở nhiệt độ dưới -18 độ C. Không nên để ở ngăn mát quá lâu vì hơi ẩm tủ lạnh dễ kích thích nấm mốc phát triển làm giảm vị ngọt tự nhiên của khô biển.'
      }
    ]
  }
];

export default function CategoryClient({ 
  initialProducts, 
  merchants, 
  activeCategorySlug, 
  initialSearchQuery = '' 
}: CategoryClientProps) {

  // Tìm danh mục hiện tại dựa trên slug nhận vào
  const activeCategory = useMemo(() => {
    if (!activeCategorySlug) return null;
    return CATEGORIES.find(c => c.slug === activeCategorySlug) || null;
  }, [activeCategorySlug]);

  const [selectedMerchant, setSelectedMerchant] = useState<string>('all');
  const [selectedHarvestLoc, setSelectedHarvestLoc] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(1500000); 
  const [sortBy, setSortBy] = useState<string>('default');
  const [searchVal, setSearchVal] = useState<string>(initialSearchQuery);
  const [prevSearchQuery, setPrevSearchQuery] = useState<string>(initialSearchQuery);

  if (initialSearchQuery !== prevSearchQuery) {
    setSearchVal(initialSearchQuery);
    setPrevSearchQuery(initialSearchQuery);
  }

  const availableHarvestLocations = useMemo(() => {
    const locs = new Set<string>();
    initialProducts.forEach(p => {
      if (p.harvestLocation) locs.add(p.harvestLocation);
    });
    return Array.from(locs);
  }, [initialProducts]);

  // Bộ lọc sản phẩm ở Client side
  const processedProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Lọc danh mục
    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory.slug);
    }

    // 2. Lọc tìm kiếm nhanh
    if (searchVal.trim()) {
      const q = searchVal.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.harvestLocation && p.harvestLocation.toLowerCase().includes(q))
      );
    }

    // 3. Lọc theo thương lái
    if (selectedMerchant !== 'all') {
      result = result.filter(p => p.merchant_id === parseInt(selectedMerchant, 10));
    }

    // 4. Lọc theo vùng khai thác
    if (selectedHarvestLoc !== 'all') {
      result = result.filter(p => p.harvestLocation === selectedHarvestLoc);
    }

    // 5. Lọc theo khoảng giá
    result = result.filter(p => p.price <= priceRange);

    // 6. Sắp xếp
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [initialProducts, activeCategory, selectedMerchant, selectedHarvestLoc, priceRange, sortBy, searchVal]);

  const handleResetFilters = () => {
    setSelectedMerchant('all');
    setSelectedHarvestLoc('all');
    setPriceRange(1500000);
    setSortBy('default');
    setSearchVal('');
  };

  return (
    <div id="category-page-container" className="mx-auto max-w-7xl font-sans text-[#0a0a0a] antialiased">
      {/* Category banner (Seo enrichment) */}
      <div id="category-seo-header" className="bg-[#031e25] p-8 lg:p-12 text-white mb-10 relative overflow-hidden border border-slate-800 rounded-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,119,6,0.12),transparent_40%)]" />
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="flex flex-wrap gap-2 text-[10px] font-bold tracking-widest uppercase text-amber-500">
            <Link href="/" className="hover:underline text-amber-500 decoration-transparent">Trang Chủ</Link>
            <span>/</span>
            <Link href="/san-pham" className="hover:underline text-amber-500 decoration-transparent">Hải Sản Tuyển Sỉ</Link>
            {activeCategory && (
              <>
                <span>/</span>
                <span className="text-white/80">{activeCategory.name}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight m-0">
            {activeCategory ? `${activeCategory.name} Tươi Sống Sỉ & Lẻ` : 'Toàn Bộ Hải Sản Cao Cấp Tuyển Sỉ'}
          </h1>

          <p className="text-xs text-gray-300 leading-relaxed font-light m-0">
            {activeCategory 
              ? activeCategory.longDescription 
              : 'Tổng phân phối chuỗi liên kết các vựa tôm sỉ lẻ rừng đước Năm Căn và cua gạch son đỏ au chính gốc đất địa Cà Mau. Trực tiếp thu bắt để đảm bảo mức an toàn vệ sinh và chất lượng đờn thớ dai sần sật đỉnh cao của Việt Nam.'
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR FILTER (1/4 columns on big screen) */}
        <div id="sidebar-filter-panel" className="space-y-6 lg:border-r lg:border-[#e5e7eb] lg:pr-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb]">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#0a0a0a] flex items-center gap-1.5 m-0">
              Bộ lọc hải sản
            </h2>
            <button 
              onClick={handleResetFilters}
              className="text-[10px] font-bold text-amber-600 hover:text-amber-800 uppercase tracking-widest cursor-pointer bg-transparent border-0"
            >
              Xóa lọc
            </button>
          </div>

          {/* Search bar inside filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-mono">Tên hải sản tìm nhanh</label>
            <input
              type="text"
              placeholder="Gõ cua, tôm sú, mực..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#031e25]"
            />
          </div>

          {/* Filter by Merchant (EEAT) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-mono">Thương Lái & Vựa Cung Cấp</label>
            <select
              value={selectedMerchant}
              onChange={(e) => setSelectedMerchant(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#031e25]"
            >
              <option value="all">Tất cả thương lái</option>
              {merchants.map(m => (
                <option key={m.id} value={m.id.toString()}>{m.name.split(' - ')[0]}</option>
              ))}
            </select>
          </div>

          {/* Filter by Harvest Location */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-mono">Vùng Đánh Bắt / Nuôi Thả</label>
            <select
              value={selectedHarvestLoc}
              onChange={(e) => setSelectedHarvestLoc(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#031e25]"
            >
              <option value="all">Tất cả khu vực</option>
              {availableHarvestLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Filter by Price Range */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-gray-400 font-mono">
              <span>Giá Tối Đa (kg)</span>
              <span className="text-[#d97706] font-bold font-mono">{priceRange.toLocaleString('vi-VN')} đ</span>
            </div>
            <input
              type="range"
              min="100000"
              max="2000000"
              step="50000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#d97706] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-400 font-mono">
              <span>100K</span>
              <span>1M</span>
              <span>2M</span>
            </div>
          </div>

          {/* Hot Category switch tabs */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-mono">Chuyển Nhóm Nhanh</label>
            <div className="flex flex-col gap-1">
              <Link
                href="/san-pham"
                className={`text-left px-3 py-2 rounded-lg text-xs font-bold transition decoration-transparent ${
                  !activeCategory ? 'bg-[#031e25] text-white' : 'hover:bg-gray-100 text-[#0a0a0a]'
                }`}
              >
                Tất cả sản vật ({initialProducts.length})
              </Link>
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.id}
                  href={`/danh-muc/${cat.slug}`}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-bold transition flex justify-between items-center decoration-transparent ${
                    activeCategory?.slug === cat.slug ? 'bg-[#031e25] text-white' : 'hover:bg-gray-100 text-[#0a0a0a]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    ({initialProducts.filter(p => p.category === cat.slug).length})
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID AREA */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <span className="text-xs text-gray-400 font-mono font-semibold">
              TÌM THẤY <span className="text-[#0a0a0a]">{processedProducts.length}</span> SẢN VẬT TƯƠI SỐNG
            </span>
            
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-bold bg-white border border-gray-300 rounded-lg focus:outline-none text-gray-700 font-sans cursor-pointer"
              >
                <option value="default">Sắp xếp mặc định</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="rating">Lượt đánh giá cao nhất</option>
              </select>
            </div>
          </div>

          {processedProducts.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-gray-200/50 space-y-3">
              <AlertCircle className="w-8 h-8 text-[#d97706] mx-auto animate-bounce" />
              <h3 className="text-sm font-bold uppercase text-[#0a0a0a] m-0">Không dò thấy sản vật</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto m-0">
                Không có hải sản nào phù hợp bộ lọc hiện tại của bạn. Vui lòng nới rộng mức giá hoặc xóa lọc.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#031e25] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-opacity-95 border-0 cursor-pointer"
              >
                Xóa cấu hình lọc
              </button>
            </div>
          )}

          {/* Grid display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {processedProducts.map((prod) => {
              const productMerchant = merchants.find(m => m.id === prod.merchant_id);
              return (
                <Link
                  key={prod.id}
                  href={`/san-pham/${prod.slug}`}
                  className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition duration-300 cursor-pointer flex flex-col group h-full decoration-transparent text-inherit block"
                >
                  <div className="relative h-48 bg-slate-50 shrink-0">
                    {prod.image_url ? (
                      <Image
                        src={prod.image_url}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs">Hình ảnh thực tế</div>
                    )}
                    
                    <div className="absolute bottom-3 left-3 bg-[#031e25]/85 backdrop-blur-md px-2.5 py-1 rounded text-white text-[10px] font-bold tracking-wide border border-[#04333f]/50">
                      {prod.sizeLabel ? prod.sizeLabel.split(' (')[0] : 'Đóng thùng'}
                    </div>

                    <div className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm shadow-blue-950/20 bg-emerald-50 text-emerald-700 border border-emerald-200">
                      CÒN TƯƠI SỐNG
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                        <span>ĐẦM: {prod.harvestLocation.split(',')[0]}</span>
                        <span className="flex items-center gap-0.5 text-amber-500">
                          <Star className="w-3 h-3 fill-[#d97706]" /> {prod.rating}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0a0a0a] group-hover:text-[#d97706] transition uppercase tracking-wide leading-tight line-clamp-2 m-0">
                        {prod.name}
                      </h3>
                      {productMerchant && (
                        <p className="text-[10px] text-gray-500 leading-none m-0">
                          Vựa: <span className="font-bold underline">{productMerchant.name.split(' - ')[0]}</span>
                        </p>
                      )}
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100 mt-3 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-mono">GIÁ NIÊM YẾT</span>
                        <span className="text-xs font-black text-[#d97706] tracking-tight">{prod.price.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#031e25] bg-[#d97706]/10 rounded border border-[#d97706]/20">
                        Đặt sỉ &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* SEO FAQs */}
      <section id="category-seo-faqs" className="mt-16 bg-slate-50 border border-gray-200/50 rounded-3xl p-8 lg:p-12">
        <div className="max-w-3xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-xs font-black tracking-widest uppercase text-[#d97706] font-mono m-0">Giải đáp cùng vựa thương lái</h2>
            <p className="text-2xl font-extrabold uppercase tracking-tight text-[#0a0a0a] font-sans m-0">
              Hỏi Đáp Về {activeCategory ? activeCategory.name : 'Thủy Sản Cà Mau'}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed font-sans m-0">
              Cung cấp các thông tin thiết thực cho khách buôn sỉ và các bếp ăn gia đình, được giải đáp trực tiếp từ các đầu mối thu mua hải trình giàu thâm niên.
            </p>
          </div>

          <div className="divide-y divide-gray-200 border-t border-gray-200 pt-2 font-sans">
            {activeCategory 
              ? activeCategory.faqs.map((faq, idx) => (
                  <div key={idx} className="py-5 space-y-2">
                    <h3 className="text-sm font-bold text-[#0a0a0a] flex items-start gap-2 leading-relaxed m-0">
                      <HelpCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      {faq.question}
                    </h3>
                    <p className="text-xs text-gray-600 pl-7 leading-relaxed font-light m-0">
                      {faq.answer}
                    </p>
                  </div>
                ))
              : [
                  {
                    question: 'Hệ thống vận tải chuyển hải sản tươi sống đi xa bằng cách nào?',
                    answer: 'Sản lượng cua cá lớn sống sống sọ được vận chuyển dọc quốc lộ bằng xe bể oxy mặn túc trực, hoặc đóng tôm gây tê bay vèo hàng không nội địa trong ngày. Đảm bảo tỷ lệ hao hụt cực nhỏ và được bảo hành 1 đổi 1 tận gốc.'
                  },
                  {
                    question: 'Hải sản phơi khô có sử dụng phẩm nhuộm hóa màu bảo quản không?',
                    answer: 'Cam kết 100% đồ khô phân phối tại thương thảo sỉ lẻ đều gieo khô mặn thủ công nguyên gốc, phơi tự nhiên dưới gió biển khơi dạt sạch, không tẩm ướp màu hay hóa chất chống mốc.'
                  },
                  {
                    question: 'Đăng ký ký kết mua sỉ giá tốt cho nhà hàng như thế nào?',
                    answer: 'Quý khách hàng sỉ chỉ việc gửi form yêu cầu liên hệ trực tuyến cho vựa thương lái, hoặc bốc nối nhanh đường dây nóng 0912.345.567 để phòng điều vận Năm Căn gọi điện tư vấn sỉ và báo giá gốc cầu cảng.'
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="py-5 space-y-2">
                    <h3 className="text-sm font-bold text-[#0a0a0a] flex items-start gap-2 leading-relaxed m-0">
                      <HelpCircle className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
                      {faq.question}
                    </h3>
                    <p className="text-xs text-gray-600 pl-7 leading-relaxed font-light m-0">
                      {faq.answer}
                    </p>
                  </div>
                ))
            }
          </div>
        </div>
      </section>
    </div>
  );
}
