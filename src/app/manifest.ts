import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hải Sản Cao Cấp Marketplace',
    short_name: 'HảiSảnCC',
    description: 'Marketplace hải sản cao cấp Cà Mau',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#031e25',
    icons: [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
