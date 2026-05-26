import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// Inter là substitute cho Soehne theo Arc Design System
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Hải Sản Cà Mau — Tôm Sú, Cua Biển Tươi Sống',
    template: '%s | Hải Sản Cà Mau',
  },
  description:
    'Nguồn hải sản tươi sống và đặc sản khô từ vùng biển Cà Mau — Tôm Sú, Cua Biển, Ghẹ, Mực. Kết nối trực tiếp với thương lái uy tín tại Mũi Cà Mau.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? 'https://haisancamau.vn'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Hải Sản Cà Mau',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-canvas antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
