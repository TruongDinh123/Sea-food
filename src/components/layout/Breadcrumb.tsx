import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  light?: boolean
}

/**
 * Breadcrumb — SEO-ready, JSON-LD BreadcrumbList schema tích hợp
 * Dùng trong trang danh sách và chi tiết để hỗ trợ liên kết kim tự tháp
 * Server Component
 */
export default function Breadcrumb({ items, light = false }: BreadcrumbProps) {
  const allItems = [{ label: 'Trang chủ', href: '/' }, ...items]

  // JSON-LD BreadcrumbList schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://haisancamau.vn'}${item.href}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="py-3">
        <ol
          className={`flex flex-wrap items-center gap-1.5 text-caption tracking-caption uppercase ${
            light ? 'text-pure-white/60' : 'text-soft-gray'
          }`}
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1

            return (
              <li
                key={item.href}
                className="flex items-center gap-1.5"
                itemScope
                itemType="https://schema.org/ListItem"
                itemProp="itemListElement"
              >
                {isLast ? (
                  <span
                    itemProp="name"
                    aria-current="page"
                    className={light ? 'text-pure-white' : 'text-ink-black'}
                  >
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.href}
                      itemProp="item"
                      className={`transition-colors duration-150 ${
                        light ? 'hover:text-pure-white text-pure-white/60' : 'hover:text-ink-black'
                      }`}
                    >
                      <span itemProp="name">{item.label}</span>
                    </Link>
                    <span aria-hidden="true" className={light ? 'text-pure-white/30' : 'text-soft-gray/50'}>
                      /
                    </span>
                  </>
                )}
                <meta itemProp="position" content={String(index + 1)} />
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
