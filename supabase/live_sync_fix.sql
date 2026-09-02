-- ====================================================================
-- HOTEL MAPPLE INN JAIPUR — LIVE MULTI-DEVICE CLOUD SYNC & MEDIA FIX
-- Run this in your Supabase SQL Editor -> Click "Run"
-- ====================================================================

-- 1. Add media_config column to settings table (Stores Logo, Rooftop, Room Photos)
ALTER TABLE settings ADD COLUMN IF NOT EXISTS media_config JSONB;

-- 2. Ensure RLS policies explicitly allow INSERTS with WITH CHECK (true)
DROP POLICY IF EXISTS "Public can manage bookings" ON bookings;
CREATE POLICY "Public can manage bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage guests" ON guests;
CREATE POLICY "Public can manage guests" ON guests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update settings" ON settings;
CREATE POLICY "Public can update settings" ON settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update rooms" ON rooms;
CREATE POLICY "Public can update rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage orders" ON orders;
CREATE POLICY "Public can manage orders" ON orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage order items" ON order_items;
CREATE POLICY "Public can manage order items" ON order_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage payments" ON payments;
CREATE POLICY "Public can manage payments" ON payments FOR ALL USING (true) WITH CHECK (true);

-- 3. Add all tables to Supabase Realtime publication (Instant WebSocket broadcasts)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE settings;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE guests;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;
