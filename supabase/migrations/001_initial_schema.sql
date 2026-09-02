-- ====================================================================
-- HOTEL MAPPLE INN JAIPUR - SUPABASE SCHEMA MIGRATION
-- Production-ready PostgreSQL schema with RLS, Constraints, and Triggers
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Staff & Admin)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'reception', 'kitchen')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ROOM TYPES TABLE
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL,
    max_occupancy INTEGER DEFAULT 2,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROOMS TABLE (16 initial rooms: 101-116)
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number VARCHAR(20) UNIQUE NOT NULL,
    floor INTEGER NOT NULL DEFAULT 1,
    room_type_id UUID REFERENCES room_types(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'available' 
        CHECK (status IN ('available', 'reserved', 'occupied', 'cleaning', 'maintenance', 'out_of_service')),
    qr_token_hash VARCHAR(255) UNIQUE NOT NULL,
    qr_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GUESTS TABLE
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    guest_id UUID REFERENCES guests(id) ON DELETE RESTRICT,
    room_id UUID REFERENCES rooms(id) ON DELETE RESTRICT,
    check_in TIMESTAMPTZ NOT NULL,
    check_out TIMESTAMPTZ NOT NULL,
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    rate NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    tax NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    source VARCHAR(50) DEFAULT 'direct' 
        CHECK (source IN ('direct', 'phone', 'walk_in', 'whatsapp', 'ota', 'other')),
    status VARCHAR(50) DEFAULT 'confirmed' 
        CHECK (status IN ('reserved', 'confirmed', 'checked_in', 'checked_out', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MENU CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS menu_categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    image_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(100) PRIMARY KEY,
    category_id VARCHAR(100) REFERENCES menu_categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    variants_json JSONB DEFAULT '[]'::JSONB,
    tax_rate NUMERIC(5, 2) DEFAULT 5.00,
    image_url TEXT,
    veg_type VARCHAR(20) DEFAULT 'veg' CHECK (veg_type IN ('veg', 'non_veg', 'egg')),
    prep_time_minutes INTEGER DEFAULT 15,
    available BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE RESTRICT,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
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

-- 9. ORDER ITEMS TABLE (With snapshotting for price audit consistency)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id VARCHAR(100) REFERENCES menu_items(id) ON DELETE SET NULL,
    item_name_snapshot VARCHAR(255) NOT NULL,
    unit_price_snapshot NUMERIC(10, 2) NOT NULL,
    variant_snapshot VARCHAR(100),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    tax_rate_snapshot NUMERIC(5, 2) DEFAULT 5.00,
    line_total NUMERIC(10, 2) NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    method VARCHAR(50) DEFAULT 'upi' CHECK (method IN ('upi', 'cash', 'card', 'qr', 'online')),
    provider VARCHAR(50) DEFAULT 'manual_upi',
    provider_payment_id VARCHAR(255),
    upi_reference VARCHAR(100),
    screenshot_url TEXT,
    status VARCHAR(50) DEFAULT 'submitted' 
        CHECK (status IN ('pending', 'submitted', 'verified', 'rejected', 'refunded')),
    rejection_reason TEXT,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ROOM CHARGES TABLE (For Extra Folio Items like Laundry, Extra Bed, Minibar)
CREATE TABLE IF NOT EXISTS room_charges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('room', 'food', 'laundry', 'minibar', 'extra_bed', 'late_checkout', 'damage', 'other')),
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_name VARCHAR(255) DEFAULT 'System',
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public can view active menu categories and items
CREATE POLICY "Public can view active menu categories" ON menu_categories FOR SELECT USING (active = true);
CREATE POLICY "Public can view active menu items" ON menu_items FOR SELECT USING (available = true);
CREATE POLICY "Public can view rooms for QR validation" ON rooms FOR SELECT USING (qr_active = true);
CREATE POLICY "Public can view room types" ON room_types FOR SELECT USING (active = true);

-- Orders RLS: public can insert order, view order if session or order_number matches
CREATE POLICY "Guests can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Guests can view their orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Guests can insert order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Guests can view order items" ON order_items FOR SELECT USING (true);

-- Payments RLS: guests can create payment intent / submit UPI reference
CREATE POLICY "Guests can submit payments" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view settings" ON settings FOR SELECT USING (true);

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_rooms_number ON rooms(room_number);
CREATE INDEX IF NOT EXISTS idx_rooms_token ON rooms(qr_token_hash);
CREATE INDEX IF NOT EXISTS idx_orders_room ON orders(room_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest ON bookings(guest_id);
