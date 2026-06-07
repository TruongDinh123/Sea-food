import postgres from 'postgres';
import sql from '../db/index';
import { Blog, CreateBlogInput, UpdateBlogInput } from '../../types/blog.types';

interface DbBlog {
  id: number;
  title: string;
  slug: string;
  meta_description: string | null;
  content: string;
  cover_image_url: string | null;
  is_published: boolean;
  publish_date: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export class BlogRepository {
  private mapRow(row: DbBlog): Blog {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      meta_description: row.meta_description,
      content: row.content,
      cover_image_url: row.cover_image_url,
      is_published: row.is_published,
      publish_date: row.publish_date ? new Date(row.publish_date) : null,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
    };
  }

  async findById(id: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<Blog | null> {
    const client = tx || sql;
    const rows = await client`
      SELECT * FROM blogs
      WHERE id = ${id} AND deleted_at IS NULL
    `;
    if (rows.length === 0) return null;
    return this.mapRow(rows[0] as DbBlog);
  }

  async findBySlug(slug: string, tx?: postgres.Sql | postgres.TransactionSql): Promise<Blog | null> {
    const client = tx || sql;
    const rows = await client`
      SELECT * FROM blogs
      WHERE slug = ${slug} AND deleted_at IS NULL
    `;
    if (rows.length === 0) return null;
    return this.mapRow(rows[0] as DbBlog);
  }

  async findAll(publishedOnly: boolean = false, tx?: postgres.Sql | postgres.TransactionSql): Promise<Blog[]> {
    const client = tx || sql;
    let rows;
    if (publishedOnly) {
      rows = await client`
        SELECT * FROM blogs
        WHERE is_published = true AND deleted_at IS NULL
        ORDER BY publish_date DESC, id DESC
      `;
    } else {
      rows = await client`
        SELECT * FROM blogs
        WHERE deleted_at IS NULL
        ORDER BY id DESC
      `;
    }
    return rows.map((row) => this.mapRow(row as DbBlog));
  }

  async create(input: CreateBlogInput, tx?: postgres.Sql | postgres.TransactionSql): Promise<Blog> {
    const client = tx || sql;
    const data = {
      title: input.title,
      slug: input.slug,
      meta_description: input.meta_description ?? null,
      content: input.content,
      cover_image_url: input.cover_image_url ?? null,
      is_published: input.is_published ?? false,
      publish_date: input.publish_date ?? (input.is_published ? new Date() : null),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const rows = await client`
      INSERT INTO blogs ${client(data)}
      RETURNING *
    `;
    return this.mapRow(rows[0] as DbBlog);
  }

  async update(id: number, input: UpdateBlogInput, tx?: postgres.Sql | postgres.TransactionSql): Promise<Blog | null> {
    const client = tx || sql;
    const updateData: Record<string, postgres.ParameterOrJSON<never>> = {
      ...input,
      updated_at: new Date(),
    } as Record<string, postgres.ParameterOrJSON<never>>;

    // If publishing, update publish_date if not specified
    if (input.is_published === true && !input.publish_date) {
      updateData.publish_date = new Date();
    } else if (input.is_published === false) {
      updateData.publish_date = null;
    }

    const columns = Object.keys(updateData);
    if (columns.length === 0) {
      return this.findById(id, tx);
    }

    const rows = await client`
      UPDATE blogs
      SET ${client(updateData, columns)}
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING *
    `;

    if (rows.length === 0) return null;
    return this.mapRow(rows[0] as DbBlog);
  }

  async softDelete(id: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<boolean> {
    const client = tx || sql;
    const rows = await client`
      UPDATE blogs
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING id
    `;
    return rows.length > 0;
  }
}

