-- Run this in your Supabase SQL Editor

CREATE TABLE product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  price INTEGER NOT NULL,
  color TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Admin all variants" ON product_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);
