-- ============================================
-- Miamor Coffee House - Database Migration
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. Rooms Table ──
CREATE TABLE rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,         -- 'Private' or 'Open'
  capacity INT NOT NULL,          -- max persons
  tables_count INT,
  seats_per_table INT,
  is_combinable BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 2. Menu Items (Mapped to Loyverse) ──
CREATE TABLE menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Minuman', -- 'Minuman', 'Makanan', 'Pencuci Mulut'
  price NUMERIC NOT NULL,
  loyverse_variant_id TEXT,       -- For POS Sync (nullable until configured)
  is_available BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 3. Reservations Table ──
CREATE TABLE reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  room_id UUID REFERENCES rooms(id),     -- NULL until staff assigns
  guest_count INT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',          -- pending, confirmed, completed
  is_synced BOOLEAN DEFAULT false,
  order_type TEXT DEFAULT 'remote',       -- 'remote' or 'qr_walkin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 4. Reservation Items ──
CREATE TABLE reservation_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INT NOT NULL
);

-- ============================================
-- SEED DATA
-- ============================================

-- ── Rooms ──
INSERT INTO rooms (name, category, capacity, tables_count, seats_per_table, is_combinable) VALUES
  ('La Amistad', 'Private', 8, 2, 4, true),
  ('Amorcito', 'Private', 6, 2, 3, false),
  ('Duo', 'Private', 4, 1, 4, false),
  ('El Corazon', 'Private', 15, null, null, false),
  ('La Rossa', 'Open', 8, 2, 4, true);

-- ── Sample Menu Items ──
INSERT INTO menu_items (name, category, price, is_available) VALUES
  -- Minuman (Drinks)
  ('Espresso', 'Minuman', 8.00, true),
  ('Americano', 'Minuman', 10.00, true),
  ('Latte', 'Minuman', 12.00, true),
  ('Cappuccino', 'Minuman', 12.00, true),
  ('Mocha', 'Minuman', 14.00, true),
  ('Matcha Latte', 'Minuman', 14.00, true),
  ('Iced Chocolate', 'Minuman', 12.00, true),
  ('Teh Tarik', 'Minuman', 6.00, true),
  -- Makanan (Food)
  ('Nasi Lemak Ayam', 'Makanan', 15.00, true),
  ('Mee Goreng Mamak', 'Makanan', 12.00, true),
  ('Roti Bakar Telur', 'Makanan', 8.00, true),
  ('Sandwich Klub', 'Makanan', 16.00, true),
  ('Pasta Carbonara', 'Makanan', 18.00, true),
  ('Nasi Goreng Kampung', 'Makanan', 14.00, true),
  -- Pencuci Mulut (Desserts)
  ('Kek Coklat Lava', 'Pencuci Mulut', 16.00, true),
  ('Churros', 'Pencuci Mulut', 12.00, true),
  ('Ais Krim Vanila', 'Pencuci Mulut', 8.00, true),
  ('Waffle & Ais Krim', 'Pencuci Mulut', 18.00, true);

-- ============================================
-- Enable Realtime on key tables
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE reservation_items;

-- ============================================
-- Row Level Security (RLS) - Basic Setup
-- For production, customize these policies
-- ============================================
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access for customer-facing data
CREATE POLICY "Public can view rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public can view menu items" ON menu_items FOR SELECT USING (true);

-- Allow public to create reservations and items
CREATE POLICY "Public can create reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view reservations" ON reservations FOR SELECT USING (true);
CREATE POLICY "Public can update reservations" ON reservations FOR UPDATE USING (true);

CREATE POLICY "Public can create reservation items" ON reservation_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view reservation items" ON reservation_items FOR SELECT USING (true);

-- Allow mutations on rooms and menu_items (for staff management)
CREATE POLICY "Staff can manage rooms" ON rooms FOR ALL USING (true);
CREATE POLICY "Staff can manage menu items" ON menu_items FOR ALL USING (true);
