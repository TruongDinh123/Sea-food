import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const beVietnam = Be_Vietnam_Pro({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["vietnamese", "latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "Hải Sản Cao Cấp - Kết Nối Thương Lái & Người Tiêu Dùng",
    template: "%s | Hải Sản Cao Cấp"
  },
  description: "Hệ thống kết nối trực tiếp thương lái và người mua hải sản chất lượng cao, tươi ngon mỗi ngày.",
  openGraph: {
    title: "Hải Sản Cao Cấp - Kết Nối Thương Lái & Người Tiêu Dùng",
    description: "Hệ thống kết nối trực tiếp thương lái và người mua hải sản chất lượng cao, tươi ngon mỗi ngày.",
    url: "/",
    siteName: "Hải Sản Cao Cấp Marketplace",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Hải Sản Cao Cấp Marketplace Cà Mau",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hải Sản Cao Cấp - Kết Nối Thương Lái & Người Tiêu Dùng",
    description: "Hệ thống kết nối trực tiếp thương lái và người mua hải sản chất lượng cao, tươi ngon mỗi ngày.",
    images: ["/images/og-default.jpg"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {/* Google Tag Manager — Đoạn 1: đặt trong <head> */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
 new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
 j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
 })(window,document,'script','dataLayer','GTM-T4D7G4TR');`,
          }}
        />
      </head>
      <body className={`${beVietnam.variable} ${beVietnam.className} antialiased min-h-screen flex flex-col bg-[var(--color-canvas)] text-[var(--color-ink)]`}>
        {/* Google Tag Manager — Đoạn 2: noscript fallback, ngay sau <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T4D7G4TR"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto py-6 px-4 md:px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
