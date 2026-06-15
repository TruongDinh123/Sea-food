/**
 * authors.ts — Author profiles cố định cho blog
 *
 * Hai author personas đại diện cho thương lái Cà Mau.
 * Dùng constants thay vì hardcode logic theo title để tránh schema drift.
 * (Audit finding H3: author hardcode theo title → JSON-LD mismatch risk)
 */

export interface AuthorProfile {
  name: string;
  role: string;
  slug: string;
  bio: string;
  avatar: string;
}

/** Thương lái Năm Căn — author mặc định */
export const AUTHOR_CHU_NAM: AuthorProfile = {
  name: 'Chú Năm Đất Mũi',
  role: 'Thương Lái Thu Mua Cà Mau',
  slug: 'chu-nam-dat-mui',
  bio: 'Bậc thầy thu mua cua tự nhiên tại đầm Năm Căn, Cà Mau hơn 25 năm thâm niên — bảo tồn giống cua sạch ngon ăn.',
  avatar:
    'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=100&h=100&q=80',
};

/** Chủ nhiệm HTX Sông Đốc */
export const AUTHOR_ANH_BA: AuthorProfile = {
  name: 'Anh Ba Biên Sông Đốc',
  role: 'Chủ Nhiệm HTX Đánh Bắt Sông Đốc',
  slug: 'anh-ba-bien-song-doc',
  bio: 'Sinh trưởng bờ biển Sông Đốc Cà Mau, quản lý đội tàu cào cá ngàn mã lực — vận chuyển hải sản tươi mặn từ khơi xa về đất liền.',
  avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
};

/** Map slug bài viết → author profile (mở rộng khi có thêm tác giả) */
export const AUTHOR_DEFAULT = AUTHOR_CHU_NAM;
