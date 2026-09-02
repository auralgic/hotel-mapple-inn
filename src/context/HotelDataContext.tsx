import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Room,
  RoomStatus,
  MenuCategory,
  MenuItem,
  Order,
  OrderStatus,
  Payment,
  Booking,
  FolioStay,
  RoomCharge,
  HotelSettings,
  AuditLog,
  CartItem,
  HotelMediaConfig,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_ROOMS,
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_PAYMENTS,
  INITIAL_BOOKINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_MEDIA_CONFIG,
} from '../lib/demoData';
import { generateOrderNumber, generateBookingNumber } from '../lib/formatters';
import { generateRoomToken } from '../lib/qr';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface HotelDataContextType {
  settings: HotelSettings;
  updateSettings: (newSettings: Partial<HotelSettings>) => void;

  // Media Config
  mediaConfig: HotelMediaConfig;
  updateMediaConfig: (newMedia: Partial<HotelMediaConfig>) => void;
  
  // Rooms
  rooms: Room[];
  updateRoomStatus: (roomId: string, status: RoomStatus, notes?: string) => void;
  updateRoomPrice: (roomTypeId: string, newPrice: number) => void;
  regenerateRoomQR: (roomId: string) => string;
  getRoomByNumber: (roomNum: string) => Room | undefined;

  // Menu
  categories: MenuCategory[];
  menuItems: MenuItem[];
  toggleItemAvailability: (itemId: string) => void;
  updateMenuItem: (item: MenuItem) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => MenuItem;
  deleteMenuItem: (itemId: string) => void;

  // Orders
  orders: Order[];
  createGuestOrder: (
    roomNumber: string,
    guestName: string,
    guestPhone: string,
    items: CartItem[],
    guestNote?: string,
    idempotencyKey?: string
  ) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNum: string) => Order | undefined;
  getOrdersForRoom: (roomNumber: string) => Order[];

  // Payments
  payments: Payment[];
  submitUPIPayment: (
    orderId: string,
    upiReference: string,
    screenshotUrl?: string
  ) => Promise<{ success: boolean; payment?: Payment; error?: string }>;
  verifyPayment: (paymentId: string, staffName: string) => void;
  rejectPayment: (paymentId: string, reason: string, staffName: string) => void;

  // Bookings & Operations
  bookings: Booking[];
  createBooking: (bookingData: Omit<Booking, 'id' | 'booking_number'>) => Booking;
  checkInGuest: (bookingId: string, guestDetails?: any) => void;
  checkOutGuest: (bookingId: string) => void;
  getBookingById: (bookingId: string) => Booking | undefined;
  getFolioForBooking: (bookingId: string) => FolioStay | null;
  addRoomCharge: (bookingId: string, charge: Omit<RoomCharge, 'id' | 'booking_id' | 'created_at'>) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAudit: (action: string, entityType: string, entityId: string, newData?: any, oldData?: any) => void;

  // Reset demo
  resetToDemoData: () => void;
}

const HotelDataContext = createContext<HotelDataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'mapple_inn_settings_v1',
  ROOMS: 'mapple_inn_rooms_v1',
  CATEGORIES: 'mapple_inn_categories_v1',
  MENU_ITEMS: 'mapple_inn_menu_items_v1',
  ORDERS: 'mapple_inn_orders_v1',
  PAYMENTS: 'mapple_inn_payments_v1',
  BOOKINGS: 'mapple_inn_bookings_v1',
  CHARGES: 'mapple_inn_charges_v1',
  AUDIT: 'mapple_inn_audit_v1',
  MEDIA: 'mapple_inn_media_v1',
};

export const HotelDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 0. Media Configuration State
  const [mediaConfig, setMediaConfig] = useState<HotelMediaConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEDIA);
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_CONFIG;
  });

  // 1. Settings State
  const [settings, setSettings] = useState<HotelSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // 2. Rooms State
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROOMS);
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  // 3. Categories & Menu Items
  const [categories, setCategories] = useState<MenuCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  // 4. Orders & Payments
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  // 5. Bookings & Charges
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [roomCharges, setRoomCharges] = useState<RoomCharge[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHARGES);
    return saved ? JSON.parse(saved) : [];
  });

  // 6. Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHARGES, JSON.stringify(roomCharges));
  }, [roomCharges]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(mediaConfig));
  }, [mediaConfig]);

  // Supabase Cloud Real-Time Sync & Hydration
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    const fetchCloudData = async () => {
      try {
        const [roomsRes, bookingsRes, ordersRes, settingsRes] = await Promise.all([
          client.from('rooms').select('*, room_type:room_types(*)').order('room_number'),
          client.from('bookings').select('*, guest:guests(*), room:rooms(*, room_type:room_types(*))').order('created_at', { ascending: false }),
          client.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false }),
          client.from('settings').select('*').single(),
        ]);

        if (roomsRes.data && roomsRes.data.length > 0) {
          setRooms(roomsRes.data);
        }
        if (bookingsRes.data && bookingsRes.data.length > 0) {
          setBookings(bookingsRes.data);
        }
        if (ordersRes.data && ordersRes.data.length > 0) {
          setOrders(ordersRes.data);
        }
        if (settingsRes.data) {
          setSettings(prev => ({ ...prev, ...settingsRes.data }));
        }
      } catch (err) {
        console.warn('Supabase initial fetch, continuing with local cache:', err);
      }
    };

    fetchCloudData();

    // Listen to real-time database changes across all devices
    const channel = client
      .channel('hotel_mapple_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => {
        fetchCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_types' }, () => {
        fetchCloudData();
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  // Log Audit Action
  const logAudit = useCallback((action: string, entityType: string, entityId: string, newData?: any, oldData?: any) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      actor_name: 'Staff',
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_data: oldData,
      new_data: newData,
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, []);

  // Update Media Config
  const updateMediaConfig = useCallback((newMedia: Partial<HotelMediaConfig>) => {
    setMediaConfig(prev => {
      const updated = { ...prev, ...newMedia };
      logAudit('UPDATE_MEDIA_CONFIG', 'MEDIA', 'property_assets', updated, prev);
      return updated;
    });
  }, [logAudit]);

  // Update Settings
  const updateSettings = useCallback((newSettings: Partial<HotelSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      logAudit('UPDATE_SETTINGS', 'SETTINGS', 'hotel_profile', updated, prev);
      return updated;
    });
  }, [logAudit]);

  // Update Room Status
  const updateRoomStatus = useCallback((roomId: string, status: RoomStatus, notes?: string) => {
    setRooms(prev =>
      prev.map(room => {
        if (room.id === roomId) {
          const oldStatus = room.status;
          logAudit('UPDATE_ROOM_STATUS', 'ROOM', room.room_number, { status, notes }, { status: oldStatus });
          return {
            ...room,
            status,
            updated_at: new Date().toISOString(),
          };
        }
        return room;
      })
    );

    if (isSupabaseConfigured && supabase) {
      supabase.from('rooms').update({ status }).eq('id', roomId).then();
    }
  }, [logAudit]);

  // Regenerate Room QR
  const regenerateRoomQR = useCallback((roomId: string) => {
    let newToken = '';
    setRooms(prev =>
      prev.map(room => {
        if (room.id === roomId) {
          newToken = `mi_tok_${room.room_number}_${Date.now().toString(16)}`;
          logAudit('REGENERATE_ROOM_QR', 'ROOM', room.room_number, { qr_token: newToken });
          return {
            ...room,
            qr_token_hash: newToken,
            updated_at: new Date().toISOString(),
          };
        }
        return room;
      })
    );
    return newToken;
  }, [logAudit]);

  // Update Room Price
  const updateRoomPrice = useCallback((roomTypeId: string, newPrice: number) => {
    setRooms(prev => {
      const updated = prev.map(room => {
        if (room.room_type_id === roomTypeId || room.room_type?.id === roomTypeId) {
          return {
            ...room,
            room_type: room.room_type ? { ...room.room_type, base_price: newPrice } : undefined,
            updated_at: new Date().toISOString(),
          };
        }
        return room;
      });
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(updated));
      return updated;
    });
    logAudit('UPDATE_ROOM_PRICE', 'ROOM_TYPE', roomTypeId, { base_price: newPrice });

    if (isSupabaseConfigured && supabase) {
      supabase.from('room_types').update({ base_price: newPrice }).eq('id', roomTypeId).then();
    }
  }, [logAudit]);

  const getRoomByNumber = useCallback((roomNum: string) => {
    return rooms.find(r => r.room_number === roomNum);
  }, [rooms]);

  // Menu Methods
  const toggleItemAvailability = useCallback((itemId: string) => {
    setMenuItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const updated = !item.available;
          logAudit('TOGGLE_MENU_AVAILABILITY', 'MENU_ITEM', item.name, { available: updated });
          return { ...item, available: updated, updated_at: new Date().toISOString() };
        }
        return item;
      })
    );
  }, [logAudit]);

  const updateMenuItem = useCallback((updatedItem: MenuItem) => {
    setMenuItems(prev =>
      prev.map(item => {
        if (item.id === updatedItem.id) {
          logAudit('UPDATE_MENU_ITEM', 'MENU_ITEM', item.name, updatedItem, item);
          return { ...updatedItem, updated_at: new Date().toISOString() };
        }
        return item;
      })
    );
  }, [logAudit]);

  const addMenuItem = useCallback((itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setMenuItems(prev => [...prev, newItem]);
    logAudit('ADD_MENU_ITEM', 'MENU_ITEM', newItem.name, newItem);
    return newItem;
  }, [logAudit]);

  const deleteMenuItem = useCallback((itemId: string) => {
    const target = menuItems.find(i => i.id === itemId);
    if (target) {
      setMenuItems(prev => prev.filter(i => i.id !== itemId));
      logAudit('DELETE_MENU_ITEM', 'MENU_ITEM', target.name);
    }
  }, [menuItems, logAudit]);

  // Order Placement (Atomically calculates snapshot prices, prevents duplicate orders)
  const createGuestOrder = useCallback(async (
    roomNumber: string,
    guestName: string,
    guestPhone: string,
    cartItems: CartItem[],
    guestNote?: string,
    idempotencyKey?: string
  ): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (!cartItems.length) {
      return { success: false, error: 'Cart is empty.' };
    }

    // Check duplicate submission
    if (idempotencyKey) {
      const existing = orders.find(o => o.idempotency_key === idempotencyKey);
      if (existing) {
        return { success: true, order: existing };
      }
    }

    const room = rooms.find(r => r.room_number === roomNumber) || rooms.find(r => r.room_number === '201') || rooms[0];

    // Snapshot prices from database/state (never trust frontend numbers alone)
    let subtotal = 0;
    const orderItems = cartItems.map((ci, index) => {
      const dbItem = menuItems.find(mi => mi.id === ci.menu_item.id);
      const unitPrice = ci.variant ? ci.variant.price : (dbItem ? dbItem.price : ci.unitPrice);
      const lineTotal = unitPrice * ci.quantity;
      subtotal += lineTotal;

      return {
        id: `oi-${Date.now()}-${index}`,
        order_id: '', // set below
        menu_item_id: ci.menu_item.id,
        item_name_snapshot: dbItem ? dbItem.name : ci.menu_item.name,
        unit_price_snapshot: unitPrice,
        variant_snapshot: ci.variant?.name,
        quantity: ci.quantity,
        tax_rate_snapshot: dbItem ? dbItem.tax_rate : 5,
        line_total: lineTotal,
        note: ci.note,
      };
    });

    const tax = Math.round(subtotal * (settings.taxRate / 100));
    const total = subtotal + tax;
    const orderId = `ord-${Date.now()}`;
    const orderNumber = generateOrderNumber();

    const finalizedOrderItems = orderItems.map(item => ({ ...item, order_id: orderId }));

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      room_id: room.id,
      room_number: room.room_number,
      booking_id: room.current_guest?.booking_id,
      guest_name: guestName || room.current_guest?.name || 'In-Room Guest',
      guest_phone: guestPhone || room.current_guest?.phone || '',
      guest_session_id: `sess-${room.room_number}-${Date.now()}`,
      idempotency_key: idempotencyKey,
      items: finalizedOrderItems,
      subtotal,
      tax,
      discount: 0,
      total,
      payment_status: 'pending_verification',
      status: 'new',
      guest_note: guestNote,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return updated;
    });

    // Update room pending orders
    setRooms(prev =>
      prev.map(r => (r.id === room.id ? { ...r, pending_orders_count: (r.pending_orders_count || 0) + 1 } : r))
    );

    logAudit('CREATE_FOOD_ORDER', 'ORDER', orderNumber, { total, items_count: cartItems.length, room: room.room_number });

    if (isSupabaseConfigured && supabase) {
      (async () => {
        try {
          await supabase.from('orders').insert({
            id: newOrder.id,
            order_number: newOrder.order_number,
            room_id: newOrder.room_id,
            room_number: newOrder.room_number,
            guest_name: newOrder.guest_name,
            guest_phone: newOrder.guest_phone,
            idempotency_key: newOrder.idempotency_key,
            subtotal: newOrder.subtotal,
            tax: newOrder.tax,
            total: newOrder.total,
            payment_status: newOrder.payment_status,
            status: newOrder.status,
            guest_note: newOrder.guest_note,
          });
        } catch (e) {
          console.warn('Supabase order insert warning:', e);
        }
      })();
    }

    return { success: true, order: newOrder };
  }, [rooms, menuItems, settings.taxRate, orders, logAudit]);

  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const oldStatus = o.status;
          logAudit('UPDATE_ORDER_STATUS', 'ORDER', o.order_number, { status: newStatus }, { status: oldStatus });
          return {
            ...o,
            status: newStatus,
            updated_at: new Date().toISOString(),
          };
        }
        return o;
      })
    );

    if (isSupabaseConfigured && supabase) {
      supabase.from('orders').update({ status: newStatus }).eq('id', orderId).then();
    }
  }, [logAudit]);

  const getOrderById = useCallback((orderId: string) => {
    return orders.find(o => o.id === orderId);
  }, [orders]);

  const getOrderByNumber = useCallback((orderNum: string) => {
    return orders.find(o => o.order_number.toLowerCase() === orderNum.toLowerCase());
  }, [orders]);

  const getOrdersForRoom = useCallback((roomNumber: string) => {
    return orders.filter(o => o.room_number === roomNumber);
  }, [orders]);

  // Submit UPI Payment
  const submitUPIPayment = useCallback(async (
    orderId: string,
    upiReference: string,
    screenshotUrl?: string
  ): Promise<{ success: boolean; payment?: Payment; error?: string }> => {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return { success: false, error: 'Order not found.' };
    }

    const paymentId = `pay-${Date.now()}`;
    const newPayment: Payment = {
      id: paymentId,
      order_id: order.id,
      order_number: order.order_number,
      room_number: order.room_number,
      booking_id: order.booking_id,
      amount: order.total,
      method: 'upi',
      provider: 'manual_upi',
      upi_reference: upiReference,
      screenshot_url: screenshotUrl,
      status: 'submitted',
      created_at: new Date().toISOString(),
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update order with payment ID and submitted state
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            payment_id: paymentId,
            upi_reference: upiReference,
            screenshot_url: screenshotUrl,
            payment_status: 'pending_verification',
            updated_at: new Date().toISOString(),
          };
        }
        return o;
      })
    );

    logAudit('SUBMIT_UPI_PAYMENT', 'PAYMENT', paymentId, { order_number: order.order_number, amount: order.total, upi_reference: upiReference });

    return { success: true, payment: newPayment };
  }, [orders, logAudit]);

  // Verify Payment by Staff
  const verifyPayment = useCallback((paymentId: string, staffName: string) => {
    setPayments(prev =>
      prev.map(p => {
        if (p.id === paymentId) {
          logAudit('VERIFY_PAYMENT', 'PAYMENT', p.order_number || paymentId, { verified_by: staffName, amount: p.amount });
          return {
            ...p,
            status: 'verified',
            verified_by_name: staffName,
            verified_at: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    // Also update order status
    setOrders(prev =>
      prev.map(o => {
        if (o.payment_id === paymentId) {
          return {
            ...o,
            payment_status: 'paid',
            status: o.status === 'new' ? 'preparing' : o.status,
            updated_at: new Date().toISOString(),
          };
        }
        return o;
      })
    );
  }, [logAudit]);

  // Reject Payment
  const rejectPayment = useCallback((paymentId: string, reason: string, staffName: string) => {
    setPayments(prev =>
      prev.map(p => {
        if (p.id === paymentId) {
          logAudit('REJECT_PAYMENT', 'PAYMENT', p.order_number || paymentId, { rejected_by: staffName, reason });
          return {
            ...p,
            status: 'rejected',
            rejection_reason: reason,
            verified_by_name: staffName,
            verified_at: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    setOrders(prev =>
      prev.map(o => {
        if (o.payment_id === paymentId) {
          return {
            ...o,
            payment_status: 'failed',
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          };
        }
        return o;
      })
    );
  }, [logAudit]);

  // Bookings & Operations
  const createBooking = useCallback((bookingData: Omit<Booking, 'id' | 'booking_number'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      booking_number: generateBookingNumber(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setBookings(prev => [newBooking, ...prev]);
    logAudit('CREATE_BOOKING', 'BOOKING', newBooking.booking_number, newBooking);

    // Sync to Supabase Cloud if configured
    if (isSupabaseConfigured && supabase) {
      (async () => {
        try {
          if (newBooking.guest) {
            await supabase.from('guests').upsert({
              id: newBooking.guest_id,
              name: newBooking.guest.name,
              phone: newBooking.guest.phone,
              email: newBooking.guest.email,
              id_type: newBooking.guest.id_type,
              id_number: newBooking.guest.id_number,
            });
          }
          await supabase.from('bookings').insert({
            id: newBooking.id,
            booking_number: newBooking.booking_number,
            guest_id: newBooking.guest_id,
            room_id: newBooking.room_id,
            check_in: newBooking.check_in,
            check_out: newBooking.check_out,
            adults: newBooking.adults,
            children: newBooking.children || 0,
            rate: newBooking.rate,
            discount: newBooking.discount || 0,
            tax: newBooking.tax || 0,
            total: newBooking.total,
            deposit: newBooking.deposit || 0,
            source: newBooking.source,
            status: newBooking.status,
            notes: newBooking.notes,
          });
        } catch (err) {
          console.warn('Supabase booking sync error:', err);
        }
      })();
    }

    return newBooking;
  }, [logAudit]);

  const checkInGuest = useCallback((bookingId: string, guestDetails?: any) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          logAudit('CHECK_IN_GUEST', 'BOOKING', b.booking_number, { room_id: b.room_id });
          return { ...b, status: 'checked_in', updated_at: new Date().toISOString() };
        }
        return b;
      })
    );

    // Update Room to Occupied
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setRooms(prev =>
        prev.map(r => {
          if (r.id === booking.room_id) {
            return {
              ...r,
              status: 'occupied',
              current_guest: {
                name: booking.guest?.name || guestDetails?.name || 'Guest',
                phone: booking.guest?.phone || guestDetails?.phone || '',
                check_in: new Date().toISOString(),
                check_out: booking.check_out,
                booking_id: booking.id,
              },
            };
          }
          return r;
        })
      );
    }
  }, [bookings, logAudit]);

  const checkOutGuest = useCallback((bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'checked_out', updated_at: new Date().toISOString() } : b))
      );

      // Set Room to Cleaning
      setRooms(prev =>
        prev.map(r => {
          if (r.id === booking.room_id) {
            return {
              ...r,
              status: 'cleaning',
              current_guest: undefined,
              pending_orders_count: 0,
            };
          }
          return r;
        })
      );

      logAudit('CHECK_OUT_GUEST', 'BOOKING', booking.booking_number, { room_id: booking.room_id });
    }
  }, [bookings, logAudit]);

  const getBookingById = useCallback((bookingId: string) => {
    return bookings.find(b => b.id === bookingId);
  }, [bookings]);

  // Folio Calculation (Room charges + Food charges + Other charges - Payments = Balance)
  const getFolioForBooking = useCallback((bookingId: string): FolioStay | null => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    const charges = roomCharges.filter(c => c.booking_id === bookingId);
    const foodOrders = orders.filter(o => o.booking_id === bookingId && o.status !== 'cancelled');
    const stayPayments = payments.filter(
      p => (p.booking_id === bookingId || foodOrders.some(fo => fo.id === p.order_id)) && p.status === 'verified'
    );

    const roomTotal = booking.total;
    const foodTotal = foodOrders.reduce((sum, fo) => sum + fo.total, 0);
    const otherChargesTotal = charges.reduce((sum, c) => sum + c.amount + (c.tax || 0), 0);
    const grossTotal = roomTotal + foodTotal + otherChargesTotal;
    
    // Include initial booking deposit if paid
    const initialDeposit = booking.deposit || 0;
    const paidViaPayments = stayPayments.reduce((sum, p) => sum + p.amount, 0);
    const paymentsTotal = paidViaPayments + (booking.status === 'checked_in' || booking.status === 'checked_out' ? initialDeposit : 0);
    const balanceDue = Math.max(0, grossTotal - paymentsTotal);

    return {
      booking,
      room_charges: charges,
      food_orders: foodOrders,
      payments: stayPayments,
      room_total: roomTotal,
      food_total: foodTotal,
      other_charges_total: otherChargesTotal,
      taxes_total: booking.tax + foodOrders.reduce((sum, fo) => sum + fo.tax, 0),
      gross_total: grossTotal,
      payments_total: paymentsTotal,
      balance_due: balanceDue,
    };
  }, [bookings, roomCharges, orders, payments]);

  const addRoomCharge = useCallback((bookingId: string, charge: Omit<RoomCharge, 'id' | 'booking_id' | 'created_at'>) => {
    const newCharge: RoomCharge = {
      ...charge,
      id: `rc-${Date.now()}`,
      booking_id: bookingId,
      created_at: new Date().toISOString(),
    };
    setRoomCharges(prev => [...prev, newCharge]);
    logAudit('ADD_ROOM_CHARGE', 'FOLIO', bookingId, newCharge);
  }, [logAudit]);

  const resetToDemoData = useCallback(() => {
    setSettings(INITIAL_SETTINGS);
    setRooms(INITIAL_ROOMS);
    setCategories(INITIAL_CATEGORIES);
    setMenuItems(INITIAL_MENU_ITEMS);
    setOrders(INITIAL_ORDERS);
    setPayments(INITIAL_PAYMENTS);
    setBookings(INITIAL_BOOKINGS);
    setRoomCharges([]);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }, []);

  return (
    <HotelDataContext.Provider
      value={{
        settings,
        updateSettings,
        mediaConfig,
        updateMediaConfig,
        rooms,
        updateRoomStatus,
        updateRoomPrice,
        regenerateRoomQR,
        getRoomByNumber,
        categories,
        menuItems,
        toggleItemAvailability,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem,
        orders,
        createGuestOrder,
        updateOrderStatus,
        getOrderById,
        getOrderByNumber,
        getOrdersForRoom,
        payments,
        submitUPIPayment,
        verifyPayment,
        rejectPayment,
        bookings,
        createBooking,
        checkInGuest,
        checkOutGuest,
        getBookingById,
        getFolioForBooking,
        addRoomCharge,
        auditLogs,
        logAudit,
        resetToDemoData,
      }}
    >
      {children}
    </HotelDataContext.Provider>
  );
};

export const useHotelData = (): HotelDataContextType => {
  const context = useContext(HotelDataContext);
  if (!context) {
    throw new Error('useHotelData must be used within a HotelDataProvider');
  }
  return context;
};
