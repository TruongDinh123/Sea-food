import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs — Component điều hướng phân cấp chuẩn SEO
 * Hỗ trợ JSON-LD BreadcrumbList đã được inject tại page level.
 * Tuân thủ Pyramid Architecture từ AGENTS.md.
 */
export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Điều hướng phân cấp"
      className={`flex items-center flex-wrap gap-1 text-[11px] font-medium text-gray-500 font-sans ${className}`}
    >
      {/* Trang chủ luôn là phần tử đầu tiên */}
      <Link
        href="/"
        className="flex items-center gap-1 text-gray-400 hover:text-[#d97706] transition-colors duration-200 decoration-transparent"
        aria-label="Trang chủ"
      >
        <Home className="w-3 h-3 shrink-0" />
        <span className="hidden sm:inline">Trang chủ</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} className="flex items-center gap-1">
            {/* Dấu phân cách */}
            <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" aria-hidden="true" />

            {isLast || !item.href ? (
              // Trang hiện tại — không có link, dùng để screen reader nhận biết
              <span
                className="text-[#0a0a0a] font-semibold max-w-[200px] truncate"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              // Trang trung gian — có link
              <Link
                href={item.href}
                className="text-gray-500 hover:text-[#d97706] transition-colors duration-200 decoration-transparent max-w-[150px] truncate"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
