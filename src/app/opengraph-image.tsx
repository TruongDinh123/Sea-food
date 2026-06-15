/**
 * opengraph-image.tsx — Dynamic Open Graph Image Generator (Root Route)
 *
 * Next.js file convention: file này tự động được serve tại /opengraph-image
 * và được inject vào <meta property="og:image"> khi không có override từ route con.
 *
 * Theo chuẩn NotebookLM: "opengraph-image.tsx are automatically recognized
 * and served with the correct headers and caching behavior."
 */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Hải Sản Cao Cấp Cà Mau — Kết Nối Thương Lái & Người Tiêu Dùng';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#031e25',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 100px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '8px',
            height: '100%',
            background: '#d97706',
          }}
        />

        {/* Label */}
        <div
          style={{
            display: 'flex',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#d97706',
            marginBottom: 24,
          }}
        >
          MARKETPLACE · CÀ MAU · VIỆT NAM
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.1,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            marginBottom: 24,
          }}
        >
          Hải Sản
          <br />
          Cao Cấp
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: '0.02em',
          }}
        >
          Kết nối thương lái &amp; người tiêu dùng — Tươi sống mỗi ngày
        </div>

        {/* Bottom right watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 80,
            fontSize: 14,
            color: 'rgba(255,255,255,0.3)',
            fontWeight: 500,
            letterSpacing: '0.1em',
          }}
        >
          haisancaocap.vn
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
