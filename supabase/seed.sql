-- Seed Data for Hotel Mapple Inn Jaipur
-- Scale: 16 Rooms (Floor 2: 201-208, Floor 3: 301-308)

-- 1. Hotel Settings
INSERT INTO settings (id, name, tagline, address, phone, whatsapp, email, check_in_time, check_out_time, room_service_hours, currency, currency_symbol, tax_rate, upi_vpa, upi_name, min_order_amount)
VALUES (
  'default',
  'Hotel Mapple Inn',
  'Comfort, convenience, and Jaipur at your doorstep',
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
) ON CONFLICT (id) DO NOTHING;

-- 2. Room Types
INSERT INTO room_types (id, name, description, base_price, max_occupancy, active)
VALUES 
  ('rt-deluxe', 'Deluxe Room', 'Comfortable king bed, air conditioning, 43" Smart LED TV, high-speed Wi-Fi, attached bathroom.', 2200, 2, true),
  ('rt-super-deluxe', 'Super Deluxe Room', 'Spacious room with balcony view, seating lounge, work desk, electric kettle, premium toiletries.', 2800, 3, true),
  ('rt-executive', 'Executive Suite', 'Luxury suite with master bedroom, separate living room, plush sofa set, mini-fridge, express dining.', 3800, 4, true)
ON CONFLICT (id) DO NOTHING;

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
