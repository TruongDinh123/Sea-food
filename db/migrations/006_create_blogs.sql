-- Up
BEGIN;

CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    meta_description TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE NOT NULL,
    publish_date TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    CONSTRAINT uniq_blogs_slug UNIQUE (slug)
);

-- Index cho blogs
CREATE INDEX idx_blogs_slug ON blogs (slug);
CREATE INDEX idx_blogs_is_published ON blogs (is_published);
CREATE INDEX idx_blogs_active ON blogs (deleted_at) WHERE deleted_at IS NULL;

COMMIT;

-- Down
BEGIN;

DROP TABLE IF EXISTS blogs;

COMMIT;
