import { Room, RoomType, MenuCategory, MenuItem, Booking, Order, Payment, HotelSettings, User, AuditLog, HotelMediaConfig } from '../types';
import { generateRoomToken } from './qr';

export const INITIAL_SETTINGS: HotelSettings = {
  name: 'Hotel Mapple Inn',
  tagline: 'Comfort, convenience, and Jaipur at your doorstep',
  address: 'Plot No. 408-409, Nirman Nagar, Mansarovar, Jaipur, Rajasthan 302020',
  phone: '+91 96801 31232',
  whatsapp: '+91 96801 31232',
  email: 'contact@mappleinn.com',
  checkInTime: '12:00 PM',
  checkOutTime: '11:00 AM',
  roomServiceHours: '07:00 AM - 11:00 PM',
  currency: 'INR',
  currencySymbol: '₹',
  taxRate: 5.0,
  upiVpa: '9680131232@upi',
  upiName: 'Hotel Mapple Inn Jaipur',
  minOrderAmount: 50,
};

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Hotel Manager (Admin)',
    email: 'admin@mappleinn.com',
    phone: '+91 96801 31232',
    role: 'admin',
    active: true,
  },
  {
    id: 'u-2',
    name: 'Front Desk Reception',
    email: 'reception@mappleinn.com',
    phone: '+91 96801 31232',
    role: 'reception',
    active: true,
  },
  {
    id: 'u-3',
    name: 'Executive Chef & Kitchen',
    email: 'kitchen@mappleinn.com',
    phone: '+91 96801 31232',
    role: 'kitchen',
    active: true,
  },
];

export const INITIAL_ROOM_TYPES: RoomType[] = [
  {
    id: 'rt-deluxe',
    name: 'Deluxe Room',
    description: 'Comfortable king bed, air conditioning, 43" Smart LED TV, high-speed Wi-Fi, attached bathroom.',
    base_price: 2200,
    max_occupancy: 2,
    active: true,
  },
  {
    id: 'rt-super-deluxe',
    name: 'Super Deluxe Room',
    description: 'Spacious room with balcony view, seating lounge, work desk, electric kettle, premium toiletries.',
    base_price: 2800,
    max_occupancy: 3,
    active: true,
  },
  {
    id: 'rt-executive',
    name: 'Executive Suite',
    description: 'Luxury suite with master bedroom, separate living room, plush sofa set, mini-fridge, express dining.',
    base_price: 3800,
    max_occupancy: 4,
    active: true,
  },
];

// Exactly 16 Rooms: Floor 2 (201-208) & Floor 3 (301-308) — Fresh Clean State
export const INITIAL_ROOMS: Room[] = [
  // --- FLOOR 2 (Rooms 201 - 208) ---
  {
    id: 'r-201',
    room_number: '201',
    floor: 2,
    room_type_id: 'rt-deluxe',
    room_type: INITIAL_ROOM_TYPES[0],
    status: 'available',
    qr_token_hash: generateRoomToken('201'),
    qr_active: true,
  },
  {
    id: 'r-202',
    room_number: '202',
    floor: 2,
    room_type_id: 'rt-deluxe',
    room_type: INITIAL_ROOM_TYPES[0],
    status: 'available',
    qr_token_hash: generateRoomToken('202'),
    qr_active: true,
  },
  {
    id: 'r-203',
    room_number: '203',
    floor: 2,
    room_type_id: 'rt-super-deluxe',
    room_type: INITIAL_ROOM_TYPES[1],
    status: 'available',
    qr_token_hash: generateRoomToken('203'),
    qr_active: true,
  },
  {
    id: 'r-204',
    room_number: '204',
    floor: 2,
    room_type_id: 'rt-super-deluxe',
    room_type: INITIAL_ROOM_TYPES[1],
    status: 'available',
    qr_token_hash: generateRoomToken('204'),
    qr_active: true,
  },
  {
    id: 'r-205',
    room_number: '205',
    floor: 2,
    room_type_id: 'rt-deluxe',
    room_type: INITIAL_ROOM_TYPES[0],
    status: 'available',
    qr_token_hash: generateRoomToken('205'),
    qr_active: true,
  },
  {
    id: 'r-206',
    room_number: '206',
    floor: 2,
    room_type_id: 'rt-deluxe',
    room_type: INITIAL_ROOM_TYPES[0],
    status: 'available',
    qr_token_hash: generateRoomToken('206'),
    qr_active: true,
  },
  {
    id: 'r-207',
    room_number: '207',
    floor: 2,
    room_type_id: 'rt-super-deluxe',
    room_type: INITIAL_ROOM_TYPES[1],
    status: 'available',
    qr_token_hash: generateRoomToken('207'),
    qr_active: true,
  },
  {
    id: 'r-208',
    room_number: '208',
    floor: 2,
    room_type_id: 'rt-super-deluxe',
    room_type: INITIAL_ROOM_TYPES[1],
    status: 'available',
    qr_token_hash: generateRoomToken('208'),
    qr_active: true,
  },

  // --- FLOOR 3 (Rooms 301 - 308) ---
  {
    id: 'r-301',
    room_number: '301',
    floor: 3,
    room_type_id: 'rt-deluxe',
    room_type: INITIAL_ROOM_TYPES[0],
    status: 'available',
    qr_token_hash: generateRoomToken('301'),
    qr_active: true,
  },
  {
    id: 'r-302',
    room_number: '302',
    floor: 3,
    room_type_id: 'rt-deluxe',
    room_type: INITIAL_ROOM_TYPES[0],
    status: 'available',
    qr_token_hash: generateRoomToken('302'),
    qr_active: true,
  },
  {
    id: 'r-303',
    room_number: '303',
    floor: 3,
    room_type_id: 'rt-super-deluxe',
    room_type: INITIAL_ROOM_TYPES[1],
    status: 'available',
    qr_token_hash: generateRoomToken('303'),
    qr_active: true,
  },
  {
    id: 'r-304',
    room_number: '304',
    floor: 3,
    room_type_id: 'rt-super-deluxe',
    room_type: INITIAL_ROOM_TYPES[1],
    status: 'available',
    qr_token_hash: generateRoomToken('304'),
    qr_active: true,
  },
  {
    id: 'r-305',
    room_number: '305',
    floor: 3,
    room_type_id: 'rt-executive',
    room_type: INITIAL_ROOM_TYPES[2],
    status: 'available',
    qr_token_hash: generateRoomToken('305'),
    qr_active: true,
  },
  {
    id: 'r-306',
    room_number: '306',
    floor: 3,
    room_type_id: 'rt-executive',
    room_type: INITIAL_ROOM_TYPES[2],
    status: 'available',
    qr_token_hash: generateRoomToken('306'),
    qr_active: true,
  },
  {
    id: 'r-307',
    room_number: '307',
    floor: 3,
    room_type_id: 'rt-executive',
    room_type: INITIAL_ROOM_TYPES[2],
    status: 'available',
    qr_token_hash: generateRoomToken('307'),
    qr_active: true,
  },
  {
    id: 'r-308',
    room_number: '308',
    floor: 3,
    room_type_id: 'rt-executive',
    room_type: INITIAL_ROOM_TYPES[2],
    status: 'available',
    qr_token_hash: generateRoomToken('308'),
    qr_active: true,
  },
];

export const INITIAL_CATEGORIES: MenuCategory[] = [
  { id: 'sandwiches', name: 'Sandwiches', sort_order: 1, image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop', active: true },
  { id: 'pizzas-pastas', name: 'Pizza & Pasta', sort_order: 2, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop', active: true },
  { id: 'maggi', name: 'Maggi & Noodles', sort_order: 3, image_url: 'https://images.unsplash.com/photo-1612929633738-8fe01f7c8166?w=300&h=300&fit=crop', active: true },
  { id: 'soups-corn', name: 'Soups & Corn', sort_order: 4, image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop', active: true },
  { id: 'starters', name: 'Tandoori & Starters', sort_order: 5, image_url: 'https://images.unsplash.com/photo-1599487405270-817441dcfa76?w=300&h=300&fit=crop', active: true },
  { id: 'snacks', name: 'Chinese & Snacks', sort_order: 6, image_url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=300&h=300&fit=crop', active: true },
  { id: 'main-dry', name: 'Main Course (Dry)', sort_order: 7, image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop', active: true },
  { id: 'main-gravy', name: 'Main Course (Gravy)', sort_order: 8, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=300&fit=crop', active: true },
  { id: 'paneer', name: 'Paneer Specialities', sort_order: 9, image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=300&h=300&fit=crop', active: true },
  { id: 'mushroom', name: 'Mushroom Delights', sort_order: 10, image_url: 'https://images.unsplash.com/photo-1627308595229-7830f5c9203e?w=300&h=300&fit=crop', active: true },
  { id: 'dal', name: 'Dal & Lentils', sort_order: 11, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop', active: true },
  { id: 'rajasthani', name: 'Rajasthani Specials', sort_order: 12, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=300&fit=crop', active: true },
  { id: 'rice', name: 'Rice & Pulao', sort_order: 13, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop', active: true },
  { id: 'breads', name: 'Indian Breads', sort_order: 14, image_url: 'https://images.unsplash.com/photo-1626082895617-2c6c74d32f74?w=300&h=300&fit=crop', active: true },
  { id: 'thali', name: 'Thali & Combos', sort_order: 15, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300&h=300&fit=crop', active: true },
  { id: 'beverages', name: 'Beverages & Desserts', sort_order: 16, image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop', active: true },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Sandwiches
  { id: 's1', category_id: 'sandwiches', name: 'Bombay Sandwich', description: 'Classic Mumbai-style sandwich layered with fresh vegetables and special green mint chutney.', price: 120, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 15, available: true, featured: false, sort_order: 1 },
  { id: 's2', category_id: 'sandwiches', name: 'Veg. Grilled Sandwich', description: 'Crispy grilled sandwich loaded with seasoned vegetables, cheese and delicious house-special spread.', price: 130, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 15, available: true, featured: true, sort_order: 2 },
  { id: 's3', category_id: 'sandwiches', name: 'Paneer Sandwich', description: 'Grilled sandwich filled with delicious spiced paneer, fresh vegetables and a flavourful house-special spread.', price: 170, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 15, available: true, featured: false, sort_order: 3 },
  { id: 's4', category_id: 'sandwiches', name: 'MappleInn Veg. Club Sandwich', description: 'Our signature triple-layered sandwich loaded with fresh vegetables, cheese and flavourful house-special filling.', price: 180, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 20, available: true, featured: true, sort_order: 4 },

  // Pizzas & Pastas
  { id: 'p1', category_id: 'pizzas-pastas', name: 'Classic Margherita Pizza', description: 'Timeless delight with rich tomato sauce, melted mozzarella cheese and oregano.', price: 240, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 20, available: true, featured: false, sort_order: 5 },
  { id: 'p2', category_id: 'pizzas-pastas', name: 'Indian Twist Pizza', description: 'A desi style pizza topped with onion, capsicum, tomato, and seasoned paneer cubes.', price: 260, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 20, available: true, featured: true, sort_order: 6 },
  { id: 'p3', category_id: 'pizzas-pastas', name: 'Spicy Paneer Pizza', description: 'Spicy marinated paneer, red onions, crisp capsicum, jalapeños and mozzarella.', price: 280, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1604068549290-dea0e4a30536?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 20, available: true, featured: true, sort_order: 7 },
  { id: 'p5', category_id: 'pizzas-pastas', name: 'Red Sauce Pasta', description: 'Pasta tossed in a tangy and flavourful red tomato sauce with authentic Italian herbs.', price: 190, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1621996316585-f20387532d56?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 15, available: true, featured: false, sort_order: 8 },
  { id: 'p7', category_id: 'pizzas-pastas', name: 'White Sauce Pasta', description: 'Classic pasta cooked in a smooth, creamy Alfredo white sauce with bell peppers.', price: 220, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 15, available: true, featured: true, sort_order: 9 },

  // Maggi
  { id: 'm1', category_id: 'maggi', name: 'Plain Maggi', description: 'Classic 2-minute Maggi noodles prepared with authentic Indian spices.', price: 100, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1612929633738-8fe01f7c8166?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 10, available: true, featured: false, sort_order: 10 },
  { id: 'm3', category_id: 'maggi', name: 'Veg Masala Maggi', description: 'Maggi noodles cooked with fresh crunchy vegetables and aromatic masala.', price: 120, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1612929633738-8fe01f7c8166?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 12, available: true, featured: true, sort_order: 11 },
  { id: 'm5', category_id: 'maggi', name: 'MappleInn Special Veg Milk Maggi', description: 'Signature Maggi noodles cooked with rich creamy milk, vegetables and melted butter.', price: 180, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1612929633738-8fe01f7c8166?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 15, available: true, featured: true, sort_order: 12 },

  // Starters
  { id: 'st1', category_id: 'starters', name: 'Paneer Tikka', description: 'Cottage cheese marinated in spiced yogurt and grilled to perfection in clay oven.', price: 340, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1599487405270-817441dcfa76?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 25, available: true, featured: true, sort_order: 13 },
  { id: 'st2', category_id: 'starters', name: 'Malai Paneer Tikka', description: 'Soft and creamy paneer marinated in malai, cashew paste and mild spices.', price: 380, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1599487405270-817441dcfa76?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 25, available: true, featured: true, sort_order: 14 },
  { id: 'st4', category_id: 'starters', name: 'Masala Papad', description: 'Crisp roasted papad topped with diced onions, tomatoes, green chillies and chaat masala.', price: 80, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 5, available: true, featured: false, sort_order: 15 },

  // Snacks & Chinese
  { id: 'sn1', category_id: 'snacks', name: 'French Fries', description: 'Crispy golden potato fries served with tomato ketchup.', price: 120, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 10, available: true, featured: false, sort_order: 16 },
  { id: 'sn2', category_id: 'snacks', name: 'Peri Peri Fries', description: 'Crispy fries tossed in spicy peri peri seasoning.', price: 140, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 10, available: true, featured: true, sort_order: 17 },
  { id: 'sn5', category_id: 'snacks', name: 'Veg Chowmein', description: 'Stir fried noodles with crunchy vegetables, soy sauce and flavorful spices.', price: 170, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 15, available: true, featured: true, sort_order: 18 },
  { id: 'sn10', category_id: 'snacks', name: 'Chilli Paneer (Dry)', description: 'Crispy paneer tossed with onion, capsicum, green chilli & spicy Indo-Chinese sauces.', price: 260, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1599487405270-817441dcfa76?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 20, available: true, featured: true, sort_order: 19 },

  // Paneer
  { id: 'pn5', category_id: 'paneer', name: 'Shahi Paneer', description: 'Cottage cheese cubes cooked in a rich, creamy and mildly spiced royal gravy.', price: 240, variants_json: [{ name: 'Half', price: 240 }, { name: 'Full', price: 370 }], tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 20, available: true, featured: true, sort_order: 20 },
  { id: 'pn7', category_id: 'paneer', name: 'Paneer Butter Masala', description: 'Soft paneer cubes cooked in a rich, buttery tomato gravy with aromatic fenugreek.', price: 250, variants_json: [{ name: 'Half', price: 250 }, { name: 'Full', price: 410 }], tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 20, available: true, featured: true, sort_order: 21 },

  // Dal & Rajasthani
  { id: 'd3', category_id: 'dal', name: 'Dal Makhani', description: 'Black lentils slow-cooked overnight with butter, cream and authentic spices.', price: 190, variants_json: [{ name: 'Half', price: 190 }, { name: 'Full', price: 290 }], tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 20, available: true, featured: true, sort_order: 22 },
  { id: 'rj1', category_id: 'rajasthani', name: 'Sev Tamatar', description: 'Traditional Rajasthani tangy and flavorful curry made with fresh tomatoes and crispy sev.', price: 130, variants_json: [{ name: 'Half', price: 130 }, { name: 'Full', price: 200 }], tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 15, available: true, featured: true, sort_order: 23 },

  // Rice & Breads
  { id: 'ri2', category_id: 'rice', name: 'Jeera Rice', description: 'Fragrant basmati rice cooked with tempered cumin seeds.', price: 120, variants_json: [{ name: 'Half', price: 120 }, { name: 'Full', price: 190 }], tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 12, available: true, featured: false, sort_order: 24 },
  { id: 'ri4', category_id: 'rice', name: 'Veg Dum Biryani', description: 'Aromatic basmati rice cooked with fresh garden vegetables, mint, saffron and spices.', price: 260, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 25, available: true, featured: true, sort_order: 25 },
  { id: 'b4', category_id: 'breads', name: 'Butter Tandoori Roti', description: 'Whole wheat flatbread cooked in tandoor and brushed with fresh butter.', price: 20, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1626082895617-2c6c74d32f74?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 5, available: true, featured: false, sort_order: 26 },
  { id: 'b14', category_id: 'breads', name: 'Garlic Naan', description: 'Leavened bread topped with minced garlic, coriander and butter baked in tandoor.', price: 110, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1626082895617-2c6c74d32f74?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 10, available: true, featured: true, sort_order: 27 },

  // Thalis
  { id: 'th1', category_id: 'thali', name: 'Executive Office Thali', description: 'Seasonal Sabji + Dal/Kadhi + Steamed Rice + 3 Butter Roti + Salad + Pickle.', price: 140, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 20, available: true, featured: true, sort_order: 28 },
  { id: 'th4', category_id: 'thali', name: 'MappleInn Royal Special Thali', description: 'Paneer Sabji + Dal Makhani + Boondi Raita + Jeera Rice + 4 Butter Roti + Sweet Gulab Jamun + Papad + Salad.', price: 300, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 25, available: true, featured: true, sort_order: 29 },

  // Beverages & Desserts
  { id: 'bev1', category_id: 'beverages', name: 'Special Masala Chai', description: 'Freshly brewed aromatic Indian tea with ginger, cardamom and milk.', price: 30, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 8, available: true, featured: true, sort_order: 30 },
  { id: 'bev8', category_id: 'beverages', name: 'Chilled Cold Coffee', description: 'Refreshing blended coffee with milk, cream and chocolate drizzle.', price: 80, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 10, available: true, featured: true, sort_order: 31 },
  { id: 'des2', category_id: 'beverages', name: 'Hot Gulab Jamun (2 Pcs)', description: 'Deep fried cottage cheese balls soaked in warm rose-flavored sugar syrup.', price: 70, tax_rate: 5, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=300&fit=crop', veg_type: 'veg', prep_time_minutes: 5, available: true, featured: true, sort_order: 32 },
];

export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_PAYMENTS: Payment[] = [];
export const INITIAL_BOOKINGS: Booking[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-live-init',
    actor_name: 'System',
    action: 'SYSTEM_INITIALIZED',
    entity_type: 'SYSTEM',
    entity_id: 'property_live',
    new_data: { status: 'live_clean_slate', total_rooms: 16 },
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_MEDIA_CONFIG: HotelMediaConfig = {
  logoUrl: '',
  heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hotel-swimming-pool-and-sun-loungers-34320-large.mp4',
  heroImageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=85',
  deluxeRoomImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=85',
  superDeluxeImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85',
  executiveSuiteImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85',
  rooftopSunsetUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
  rooftopCafeUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
  diningThaliUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=85',
  lobbyReceptionUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85',
};
