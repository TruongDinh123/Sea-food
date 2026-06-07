BEGIN;

-- Up: Add notes column to orders table
ALTER TABLE orders ADD COLUMN notes TEXT DEFAULT NULL;

COMMIT;

-- Down: Remove notes column from orders table
-- BEGIN;
-- ALTER TABLE orders DROP COLUMN notes;
-- COMMIT;
