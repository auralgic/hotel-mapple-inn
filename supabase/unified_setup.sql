-- ====================================================================
-- HOTEL MAPPLE INN JAIPUR — UNIFIED SUPABASE SCHEMA & SEED SCRIPT
-- Copy this entire file and paste into Supabase SQL Editor -> Click "Run"
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean drop of previous partial tables if needed
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS room_charges CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS menu_categories CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS guests CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS room_types CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. USERS TABLE (Staff & Admin)
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'reception', 'kitchen')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SETTINGS TABLE
CREATE TABLE settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    address TEXT,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    check_in_time VARCHAR(20) DEFAULT '12:00 PM',
    check_out_time VARCHAR(20) DEFAULT '11:00 AM',
    room_service_hours VARCHAR(50) DEFAULT '07:00 AM - 11:00 PM',
    currency VARCHAR(10) DEFAULT 'INR',
    currency_symbol VARCHAR(10) DEFAULT '₹',
    tax_rate NUMERIC(5, 2) DEFAULT 5.0,
    upi_vpa VARCHAR(100),
    upi_name VARCHAR(255),
    min_order_amount NUMERIC(10, 2) DEFAULT 50,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROOM TYPES TABLE
CREATE TABLE room_types (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL,
    max_occupancy INTEGER DEFAULT 2,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ROOMS TABLE (16 Rooms: Floors 2 & 3: 201-208 & 301-308)
CREATE TABLE rooms (
    id VARCHAR(100) PRIMARY KEY,
    room_number VARCHAR(20) UNIQUE NOT NULL,
    floor INTEGER NOT NULL DEFAULT 2,
    room_type_id VARCHAR(100) REFERENCES room_types(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'available' 
        CHECK (status IN ('available', 'reserved', 'occupied', 'cleaning', 'maintenance', 'out_of_service')),
    qr_token_hash VARCHAR(255) UNIQUE NOT NULL,
    qr_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GUESTS TABLE
CREATE TABLE guests (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BOOKINGS TABLE
CREATE TABLE bookings (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    guest_id TEXT REFERENCES guests(id) ON DELETE SET NULL,
    room_id VARCHAR(100) REFERENCES rooms(id) ON DELETE SET NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    adults INTEGER NOT NULL DEFAULT 1,
    children INTEGER DEFAULT 0,
    rate NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    tax NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    deposit NUMERIC(10, 2) DEFAULT 0,
    source VARCHAR(50) DEFAULT 'direct' CHECK (source IN ('direct', 'phone', 'walk_in', 'whatsapp', 'ota', 'other')),
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('reserved', 'confirmed', 'checked_in', 'checked_out', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MENU CATEGORIES TABLE
CREATE TABLE menu_categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    image_url TEXT,
    active BOOLEAN DEFAULT TRUE
);

-- 9. MENU ITEMS TABLE
CREATE TABLE menu_items (
    id VARCHAR(100) PRIMARY KEY,
    category_id VARCHAR(100) REFERENCES menu_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    variants_json JSONB,
    tax_rate NUMERIC(5, 2) DEFAULT 5.0,
    image_url TEXT,
    veg_type VARCHAR(20) DEFAULT 'veg' CHECK (veg_type IN ('veg', 'non_veg', 'egg')),
    prep_time_minutes INTEGER DEFAULT 15,
    available BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ORDERS TABLE (In-Room Dining Orders)
CREATE TABLE orders (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    room_id VARCHAR(100) REFERENCES rooms(id) ON DELETE SET NULL,
    room_number VARCHAR(20) NOT NULL,
    booking_id TEXT REFERENCES bookings(id) ON DELETE SET NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(50),
    guest_session_id VARCHAR(255),
    idempotency_key VARCHAR(255) UNIQUE,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) DEFAULT 0,
    discount NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending_verification' 
        CHECK (payment_status IN ('pending', 'pending_verification', 'paid', 'failed', 'refunded')),
    status VARCHAR(50) DEFAULT 'new' 
        CHECK (status IN ('new', 'confirmed', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')),
    guest_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ORDER ITEMS TABLE
CREATE TABLE order_items (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id VARCHAR(100) REFERENCES menu_items(id) ON DELETE SET NULL,
    item_name_snapshot VARCHAR(255) NOT NULL,
    unit_price_snapshot NUMERIC(10, 2) NOT NULL,
    variant_snapshot VARCHAR(100),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    tax_rate_snapshot NUMERIC(5, 2) DEFAULT 5.0,
    line_total NUMERIC(10, 2) NOT NULL,
    note TEXT
);

-- 12. PAYMENTS TABLE
CREATE TABLE payments (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
    booking_id TEXT REFERENCES bookings(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    method VARCHAR(50) DEFAULT 'upi' CHECK (method IN ('upi', 'cash', 'card', 'qr', 'online')),
    provider VARCHAR(50) DEFAULT 'manual_upi',
    provider_payment_id VARCHAR(255),
    upi_reference VARCHAR(100),
    screenshot_url TEXT,
    status VARCHAR(50) DEFAULT 'submitted' 
        CHECK (status IN ('pending', 'submitted', 'verified', 'rejected', 'refunded')),
    rejection_reason TEXT,
    verified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    actor_name VARCHAR(255) DEFAULT 'Staff',
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Access Policies (Allow guests to browse, order & book)
CREATE POLICY "Public can view settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public can update settings" ON settings FOR ALL USING (true);
CREATE POLICY "Public can view room types" ON room_types FOR SELECT USING (true);
CREATE POLICY "Public can view rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public can update rooms" ON rooms FOR ALL USING (true);
CREATE POLICY "Public can view menu categories" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "Public can view menu items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public can manage bookings" ON bookings FOR ALL USING (true);
CREATE POLICY "Public can manage guests" ON guests FOR ALL USING (true);
CREATE POLICY "Public can manage orders" ON orders FOR ALL USING (true);
CREATE POLICY "Public can manage order items" ON order_items FOR ALL USING (true);
CREATE POLICY "Public can manage payments" ON payments FOR ALL USING (true);
CREATE POLICY "Public can insert audit logs" ON audit_logs FOR ALL USING (true);

-- ====================================================================
-- INITIAL SEED DATA INSERTION
-- ====================================================================

-- 1. Hotel Settings
INSERT INTO settings (id, name, tagline, address, phone, whatsapp, email, check_in_time, check_out_time, room_service_hours, currency, currency_symbol, tax_rate, upi_vpa, upi_name, min_order_amount)
VALUES (
  'default',
  'Hotel Mapple Inn',
  'Your Pink City Sanctuary. Peaceful Stays in Jaipur.',
  'Plot No. 408-409, Nirman Nagar, Mansarovar, Jaipur, Rajasthan 302020',
  '+91 96801 31232',
  '+91 96801 31232',
  'contact@mappleinn.com',
  '12:00 PM',
  '11:00 AM',
  '07:00 AM - 11:00 PM',
  'INR',
  '₹',
  5.0,
  '9680131232@upi',
  'Hotel Mapple Inn Jaipur',
  50
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp;

-- 2. Room Types
INSERT INTO room_types (id, name, description, base_price, max_occupancy, active)
VALUES 
  ('rt-deluxe', 'Deluxe Room', 'Comfortable king bed, air conditioning, 43" Smart LED TV, high-speed Wi-Fi, attached bathroom.', 2200, 2, true),
  ('rt-super-deluxe', 'Super Deluxe Room', 'Spacious room with balcony view, seating lounge, work desk, electric kettle, premium toiletries.', 2800, 3, true),
  ('rt-executive', 'Executive Suite', 'Luxury suite with master bedroom, separate living room, plush sofa set, mini-fridge, express dining.', 3800, 4, true)
ON CONFLICT (id) DO UPDATE SET base_price = EXCLUDED.base_price;

-- 3. 16 Boutique Rooms (Floor 2: 201-208, Floor 3: 301-308)
INSERT INTO rooms (id, room_number, floor, room_type_id, status, qr_token_hash, qr_active)
VALUES
  -- Floor 2 (201-208)
  ('r-201', '201', 2, 'rt-deluxe', 'available', 'mi_tok_201_sec', true),
  ('r-202', '202', 2, 'rt-deluxe', 'available', 'mi_tok_202_sec', true),
  ('r-203', '203', 2, 'rt-super-deluxe', 'available', 'mi_tok_203_sec', true),
  ('r-204', '204', 2, 'rt-super-deluxe', 'available', 'mi_tok_204_sec', true),
  ('r-205', '205', 2, 'rt-deluxe', 'available', 'mi_tok_205_sec', true),
  ('r-206', '206', 2, 'rt-deluxe', 'available', 'mi_tok_206_sec', true),
  ('r-207', '207', 2, 'rt-super-deluxe', 'available', 'mi_tok_207_sec', true),
  ('r-208', '208', 2, 'rt-super-deluxe', 'available', 'mi_tok_208_sec', true),

  -- Floor 3 (301-308)
  ('r-301', '301', 3, 'rt-deluxe', 'available', 'mi_tok_301_sec', true),
  ('r-302', '302', 3, 'rt-deluxe', 'available', 'mi_tok_302_sec', true),
  ('r-303', '303', 3, 'rt-super-deluxe', 'available', 'mi_tok_303_sec', true),
  ('r-304', '304', 3, 'rt-super-deluxe', 'available', 'mi_tok_304_sec', true),
  ('r-305', '305', 3, 'rt-executive', 'available', 'mi_tok_305_sec', true),
  ('r-306', '306', 3, 'rt-executive', 'available', 'mi_tok_306_sec', true),
  ('r-307', '307', 3, 'rt-executive', 'available', 'mi_tok_307_sec', true),
  ('r-308', '308', 3, 'rt-executive', 'available', 'mi_tok_308_sec', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Initial Menu Categories
INSERT INTO menu_categories (id, name, sort_order, active)
VALUES
  ('cat-breakfast', 'Breakfast & Beverages', 1, true),
  ('cat-snacks', 'Starters & Quick Bites', 2, true),
  ('cat-main', 'Main Course (North Indian & Rajasthani)', 3, true),
  ('cat-breads', 'Breads, Rice & Dal', 4, true),
  ('cat-dessert', 'Desserts & Refreshments', 5, true)
ON CONFLICT (id) DO NOTHING;

-- 5. Signature Menu Items
INSERT INTO menu_items (id, category_id, name, description, price, veg_type, prep_time_minutes, available, featured, sort_order)
VALUES
  ('mi-1', 'cat-breakfast', 'Masala Poha with Sev & Lemon', 'Traditional flattened rice tempered with mustard, peanuts and fresh coriander', 120, 'veg', 10, true, true, 1),
  ('mi-2', 'cat-breakfast', 'Aloo Pyaz Paratha with Curd & Pickle', 'Stuffed tawa paratha served with home-style curd and spicy butter', 140, 'veg', 15, true, true, 2),
  ('mi-3', 'cat-breakfast', 'Masala Chai (Pot for Two)', 'Freshly brewed ginger and cardamom tea', 80, 'veg', 8, true, false, 3),
  ('mi-4', 'cat-main', 'Paneer Butter Masala', 'Soft cottage cheese simmered in rich cashew tomato gravy with aromatic butter', 280, 'veg', 20, true, true, 4),
  ('mi-5', 'cat-main', 'Dal Tadka (Desi Ghee)', 'Yellow lentils tempered with cumin, garlic and dry red chillies in pure cow ghee', 210, 'veg', 15, true, true, 5),
  ('mi-6', 'cat-breads', 'Butter Tandoori Roti (2 Pcs)', 'Fresh wheat rotis baked in clay oven with Amul butter', 50, 'veg', 10, true, false, 6),
  ('mi-7', 'cat-breads', 'Jeera Rice', 'Fragrant basmati rice tossed with roasted cumin seeds and fresh coriander', 160, 'veg', 12, true, false, 7)
ON CONFLICT (id) DO NOTHING;
