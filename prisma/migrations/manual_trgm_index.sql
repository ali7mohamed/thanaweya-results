-- Run this once after `prisma db push` / `prisma migrate deploy`.
-- Prisma cannot declare GIN + pg_trgm indexes natively, so it's applied here by hand.
-- This is what makes Arabic name search fast (fuzzy/partial match) at high concurrency.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

DROP INDEX IF EXISTS results_name_normalized_idx;

CREATE INDEX IF NOT EXISTS idx_results_name_trgm
  ON results USING gin (name_normalized gin_trgm_ops);
