export interface Blog {
  id: number;
  title: string;
  slug: string;
  meta_description: string | null;
  content: string;
  cover_image_url: string | null;
  is_published: boolean;
  publish_date: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CreateBlogInput {
  title: string;
  slug: string;
  meta_description?: string | null;
  content: string;
  cover_image_url?: string | null;
  is_published?: boolean;
  publish_date?: Date | null;
}

export interface UpdateBlogInput {
  title?: string;
  slug?: string;
  meta_description?: string | null;
  content?: string;
  cover_image_url?: string | null;
  is_published?: boolean;
  publish_date?: Date | null;
}
