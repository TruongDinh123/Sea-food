import type { Metadata } from "next";
import { blogService } from "@/lib/services";
import BlogListClient from "./BlogListClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Cẩm Nang Hải Sản Cà Mau | Bí Quyết & Kinh Nghiệm Hay",
  description: "Kinh nghiệm chọn mua cua biển chắc thịt, cách chế biến tôm sú sinh thái, tôm khô Năm Căn chuẩn vị từ chuyên gia và thương lái lâu năm.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Cẩm Nang Hải Sản Cà Mau | Bí Quyết & Kinh Nghiệm Hay",
    description: "Kinh nghiệm chọn mua cua biển chắc thịt, cách chế biến tôm sú sinh thái, tôm khô Năm Căn chuẩn vị từ chuyên gia và thương lái lâu năm.",
    url: "/blog",
    type: "website",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Cẩm Nang Hải Sản Cà Mau — Bí quyết chọn mua và chế biến từ thương lái",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cẩm Nang Hải Sản Cà Mau | Bí Quyết & Kinh Nghiệm Hay",
    description: "Kinh nghiệm chọn mua cua biển chắc thịt, cách chế biến tôm sú sinh thái, tôm khô Năm Căn chuẩn vị từ chuyên gia và thương lái lâu năm.",
    images: ["/images/og-default.jpg"],
  }
};

export default async function BlogListPage() {
  const blogs = await blogService.getAllBlogs(true);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs items={[{ label: 'Bài viết' }]} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#031e25] uppercase tracking-wide">
          Cẩm Nang Hải Sản Cà Mau — Kinh Nghiệm Chọn Lựa & Chế Biến
        </h1>
      </div>
      <BlogListClient initialBlogs={blogs} />
    </div>
  );
}
