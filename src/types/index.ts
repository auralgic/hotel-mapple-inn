// TypeScript interfaces for Hotel Mapple Inn Jaipur System

export type UserRole = 'admin' | 'reception' | 'kitchen';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  active: boolean;
  created_at?: string;
}

export type RoomStatus = 'available' | 'reserved' | 'occupied' | 'cleaning' | 'maintenance' | 'out_of_service';

export interface RoomType {
  id: string;
  name: string;
  description: string;
  base_price: number;
  max_occupancy: number;
  active: boolean;
}

export interface Room {
  id: string;
  room_number: string;
  floor: number;
  room_type_id: string;
  room_type?: RoomType;
  status: RoomStatus;
  qr_token_hash: string;
  qr_active: boolean;
  current_guest?: {
    name: string;
    phone: string;
    check_in: string;
    check_out: string;
    booking_id: string;
  };
  pending_orders_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  id_type?: string;
  id_number?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export type BookingStatus = 'reserved' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type BookingSource = 'direct' | 'phone' | 'walk_in' | 'whatsapp' | 'ota' | 'other';

export interface Booking {
  id: string;
  booking_number: string;
  guest_id: string;
  guest?: Guest;
  room_id?: string;
  room?: Room;
  room_type_id?: string;
  room_type?: RoomType;
  allotted_room_number?: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  rate: number;
  discount: number;
  tax: number;
  total: number;
  source: BookingSource;
  status: BookingStatus;
  notes?: string;
  deposit?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  sort_order: number;
  image_url?: string;
  active: boolean;
}

export interface ItemVariant {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  variants_json?: ItemVariant[];
  tax_rate: number;
  image_url?: string;
  veg_type: 'veg' | 'non_veg' | 'egg';
  prep_time_minutes: number;
  available: boolean;
  featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export type OrderStatus = 'new' | 'confirmed' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'pending_verification' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name_snapshot: string;
  unit_price_snapshot: number;
  variant_snapshot?: string;
  quantity: number;
  tax_rate_snapshot: number;
  line_total: number;
  note?: string;
}

export interface Order {
  id: string;
  order_number: string; // e.g. MI-2026-000123
  room_id: string;
  room_number: string;
  booking_id?: string;
  guest_id?: string;
  guest_name: string;
  guest_phone?: string;
  guest_session_id?: string;
  idempotency_key?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payment_status: PaymentStatus;
  status: OrderStatus;
  guest_note?: string;
  payment_id?: string;
  upi_reference?: string;
  screenshot_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id?: string;
  booking_id?: string;
  order_number?: string;
  room_number?: string;
  amount: number;
  method: 'upi' | 'cash' | 'card' | 'qr' | 'online';
  provider: string;
  provider_payment_id?: string;
  upi_reference?: string;
  screenshot_url?: string;
  status: 'pending' | 'submitted' | 'verified' | 'rejected' | 'refunded';
  rejection_reason?: string;
  verified_by?: string;
  verified_by_name?: string;
  verified_at?: string;
  created_at: string;
}

export interface RoomCharge {
  id: string;
  booking_id: string;
  category: 'room' | 'food' | 'laundry' | 'minibar' | 'extra_bed' | 'late_checkout' | 'damage' | 'other';
  description: string;
  amount: number;
  tax: number;
  created_at: string;
}

export interface FolioStay {
  booking: Booking;
  room_charges: RoomCharge[];
  food_orders: Order[];
  payments: Payment[];
  room_total: number;
  food_total: number;
  other_charges_total: number;
  taxes_total: number;
  gross_total: number;
  payments_total: number;
  balance_due: number;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_data?: any;
  new_data?: any;
  created_at: string;
}

export interface HotelSettings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  roomServiceHours: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  upiVpa: string;
  upiName: string;
  minOrderAmount: number;
}

export interface CartItem {
  menu_item: MenuItem;
  variant?: ItemVariant;
  quantity: number;
  note?: string;
  unitPrice: number;
}

export interface HotelMediaConfig {
  logoUrl?: string;
  heroVideoUrl: string;
  heroImageUrl: string;
  deluxeRoomImage: string;
  superDeluxeImage: string;
  executiveSuiteImage: string;
  rooftopSunsetUrl: string;
  rooftopCafeUrl: string;
  diningThaliUrl: string;
  lobbyReceptionUrl: string;
}
