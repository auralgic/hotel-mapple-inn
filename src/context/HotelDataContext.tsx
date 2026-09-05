import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Room,
  RoomType,
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
  INITIAL_ROOM_TYPES,
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

  // Room Types & Inventory Engine
  roomTypes: RoomType[];
  checkAvailability: (checkIn: string, checkOut: string, roomTypeId?: string) => {
    available: boolean;
    remainingCount: number;
    totalRooms: number;
    isSoldOut: boolean;
  };

  // Bookings & Operations
  bookings: Booking[];
  createBooking: (bookingData: Omit<Booking, 'id' | 'booking_number'>) => Booking;
  allotRoomToBooking: (bookingId: string, roomId: string) => void;
  checkInGuest: (bookingId: string, allottedRoomId?: string, guestDetails?: any) => void;
  checkOutGuest: (bookingId: string) => void;
  getBookingById: (bookingId: string) => Booking | undefined;
  getFolioForBooking: (bookingId: string) => FolioStay | null;
  addRoomCharge: (bookingId: string, charge: Omit<RoomCharge, 'id' | 'booking_id' | 'created_at'>) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAudit: (action: string, entityType: string, entityId: string, newData?: any, oldData?: any) => void;

  // Reset demo / wipe mock data
  resetToDemoData: () => void;
  wipeAllMockData: () => Promise<void>;
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

  const [roomTypes, setRoomTypes] = useState<RoomType[]>(() => {
    const saved = localStorage.getItem('mapple_inn_room_types_v1');
    return saved ? JSON.parse(saved) : INITIAL_ROOM_TYPES;
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

  // Automated One-Time Clean Slate for Live Operations (Wipes old demo data from browser cache)
  useEffect(() => {
    if (localStorage.getItem('mapple_live_clean_slate_v3') !== 'true') {
      localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
      localStorage.removeItem(STORAGE_KEYS.ORDERS);
      localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
      localStorage.removeItem(STORAGE_KEYS.CHARGES);
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
      localStorage.setItem('mapple_live_clean_slate_v3', 'true');
      setBookings([]);
      setOrders([]);
      setPayments([]);
      setRoomCharges([]);
      setRooms(INITIAL_ROOMS);
    }
  }, []);

  // Supabase Cloud Real-Time Sync & Hydration
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    const fetchCloudData = async () => {
      try {
        const [roomsRes, bookingsRes, ordersRes, settingsRes, roomTypesRes] = await Promise.all([
          client.from('rooms').select('*, room_type:room_types(*)').order('room_number'),
          client.from('bookings').select('*, guest:guests(*), room:rooms(*, room_type:room_types(*))').order('created_at', { ascending: false }),
          client.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false }),
          client.from('settings').select('*').single(),
          client.from('room_types').select('*'),
        ]);

        if (roomTypesRes.data && roomTypesRes.data.length > 0) {
          setRoomTypes(roomTypesRes.data);
          localStorage.setItem('mapple_inn_room_types_v1', JSON.stringify(roomTypesRes.data));
        }

        if (roomsRes.data && roomsRes.data.length > 0) {
          setRooms(roomsRes.data);
          localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(roomsRes.data));
        }
        if (bookingsRes.data) {
          setBookings(bookingsRes.data);
          localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookingsRes.data));
        }
        if (ordersRes.data) {
          setOrders(ordersRes.data);
          localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersRes.data));
        }
        if (settingsRes.data) {
          setSettings(prev => ({ ...prev, ...settingsRes.data }));
          if (settingsRes.data.media_config) {
            setMediaConfig(settingsRes.data.media_config);
            localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(settingsRes.data.media_config));
          }
        }
      } catch (err) {
        console.warn('Supabase initial fetch, continuing with local cache:', err);
      }
    };

    fetchCloudData();

    // Real-time WebSocket subscriptions across all devices (non-blocking, triggers only on real cloud events)
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
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

  // Update Media Config (Saves to both LocalStorage AND Supabase Cloud)
  const updateMediaConfig = useCallback((newMedia: Partial<HotelMediaConfig>) => {
    setMediaConfig(prev => {
      const updated = { ...prev, ...newMedia };
      logAudit('UPDATE_MEDIA_CONFIG', 'MEDIA', 'property_assets', updated, prev);
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(updated));

      // Persist to Cloud Supabase so mobile gets the new logo and photos!
      if (isSupabaseConfigured && supabase) {
        supabase
          .from('settings')
          .update({
            media_config: updated,
            updated_at: new Date().toISOString(),
          })
          .eq('id', 'default')
          .then();
      }

      return updated;
    });
  }, [logAudit]);

  // Update Settings
  const updateSettings = useCallback((newSettings: Partial<HotelSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      logAudit('UPDATE_SETTINGS', 'SETTINGS', 'hotel_profile', updated, prev);

      if (isSupabaseConfigured && supabase) {
        supabase.from('settings').update(updated).eq('id', 'default').then();
      }

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

  // Update Room Price (Updates both roomTypes, rooms, localStorage, and Supabase cloud)
  const updateRoomPrice = useCallback((roomTypeId: string, newPrice: number) => {
    // 1. Update roomTypes state
    setRoomTypes(prev => {
      const updated = prev.map(rt => (rt.id === roomTypeId ? { ...rt, base_price: newPrice } : rt));
      localStorage.setItem('mapple_inn_room_types_v1', JSON.stringify(updated));
      return updated;
    });

    // 2. Update rooms state
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

    // 3. Persist to Cloud Supabase
    if (isSupabaseConfigured && supabase) {
      supabase.from('room_types').update({ base_price: newPrice, updated_at: new Date().toISOString() }).eq('id', roomTypeId).then();
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

    const activeBooking = bookings.find(
      b => (b.room_id === room.id || b.allotted_room_number === room.room_number) && b.status === 'checked_in'
    );
    const bookingId = room.current_guest?.booking_id || activeBooking?.id;

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      room_id: room.id,
      room_number: room.room_number,
      booking_id: bookingId,
      guest_name: guestName || room.current_guest?.name || activeBooking?.guest?.name || `Guest Room ${room.room_number}`,
      guest_phone: guestPhone || room.current_guest?.phone || activeBooking?.guest?.phone || '',
      guest_session_id: `sess-${room.room_number}-${Date.now()}`,
      idempotency_key: idempotencyKey,
      items: finalizedOrderItems,
      subtotal,
      tax,
      discount: 0,
      total,
      payment_method: 'room_folio',
      payment_status: 'posted_to_room',
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
            payment_status: 'pending',
            status: newOrder.status,
            guest_note: newOrder.guest_note,
          });

          if (finalizedOrderItems.length > 0) {
            const itemsPayload = finalizedOrderItems.map(item => ({
              id: item.id,
              order_id: newOrder.id,
              menu_item_id: item.menu_item_id,
              item_name_snapshot: item.item_name_snapshot,
              unit_price_snapshot: item.unit_price_snapshot,
              variant_snapshot: item.variant_snapshot || null,
              quantity: item.quantity,
              tax_rate_snapshot: item.tax_rate_snapshot,
              line_total: item.line_total,
              note: item.note || null,
            }));
            await supabase.from('order_items').insert(itemsPayload);
          }
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
              email: newBooking.guest.email || '',
              id_type: newBooking.guest.id_type || 'ID',
              id_number: newBooking.guest.id_number || '',
            });
          }
          const { error: bErr } = await supabase.from('bookings').insert({
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
          if (bErr) {
            console.error('Supabase booking sync error:', bErr);
          }
        } catch (err) {
          console.warn('Supabase booking sync error:', err);
        }
      })();
    }

    return newBooking;
  }, [logAudit]);

  // Dynamic Room Availability Engine (Evaluates actual date ranges across existing bookings and operable rooms)
  const checkAvailability = useCallback((checkInDate: string, checkOutDate: string, roomTypeId?: string) => {
    const s2 = (checkInDate || '').slice(0, 10);
    const e2 = (checkOutDate || '').slice(0, 10);

    // 1. Filter operable physical rooms (exclude maintenance)
    const matchingRooms = rooms.filter(r => {
      if (r.status === 'maintenance') return false;
      if (roomTypeId && roomTypeId !== 'all') {
        return r.room_type_id === roomTypeId || r.room_type?.id === roomTypeId;
      }
      return true;
    });
    const totalRooms = matchingRooms.length;

    // 2. Count active overlapping bookings for this category
    const overlappingBookings = bookings.filter(b => {
      if (b.status === 'cancelled' || b.status === 'checked_out') return false;
      if (roomTypeId && roomTypeId !== 'all') {
        const matchesType =
          b.room_type_id === roomTypeId ||
          b.room?.room_type_id === roomTypeId ||
          b.room_type?.id === roomTypeId;
        if (!matchesType) return false;
      }
      const s1 = (b.check_in || '').slice(0, 10);
      const e1 = (b.check_out || '').slice(0, 10);
      if (!s1 || !e1 || !s2 || !e2) return false;

      // Strict interval overlap: s1 < e2 && e1 > s2
      return s1 < e2 && e1 > s2;
    });

    const bookedCount = overlappingBookings.length;
    const remainingCount = Math.max(0, totalRooms - bookedCount);
    const isSoldOut = remainingCount === 0;

    return {
      available: !isSoldOut,
      remainingCount,
      totalRooms,
      isSoldOut,
    };
  }, [rooms, bookings]);

  // Allot Room to Booking (Front Desk assigns physical room)
  const allotRoomToBooking = useCallback((bookingId: string, roomId: string) => {
    const physicalRoom = rooms.find(r => r.id === roomId);
    if (!physicalRoom) return;

    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          logAudit('ALLOT_ROOM', 'BOOKING', b.booking_number, { room_id: roomId, room_number: physicalRoom.room_number });
          return {
            ...b,
            room_id: roomId,
            room: physicalRoom,
            allotted_room_number: physicalRoom.room_number,
            updated_at: new Date().toISOString(),
          };
        }
        return b;
      })
    );

    if (isSupabaseConfigured && supabase) {
      supabase.from('bookings').update({ room_id: roomId, updated_at: new Date().toISOString() }).eq('id', bookingId).then();
    }
  }, [rooms, logAudit]);

  // Check In Guest (Ensures room is allotted, marks occupied, sets guest details)
  const checkInGuest = useCallback((bookingId: string, allottedRoomId?: string, guestDetails?: any) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const targetRoomId = allottedRoomId || booking.room_id;
    if (!targetRoomId) {
      alert('Please allot an available room before checking in the guest.');
      return;
    }

    const physicalRoom = rooms.find(r => r.id === targetRoomId);

    // 1. Update Booking status
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          logAudit('CHECK_IN_GUEST', 'BOOKING', b.booking_number, { room_id: targetRoomId });
          return {
            ...b,
            room_id: targetRoomId,
            room: physicalRoom || b.room,
            allotted_room_number: physicalRoom?.room_number || b.allotted_room_number,
            status: 'checked_in',
            updated_at: new Date().toISOString(),
          };
        }
        return b;
      })
    );

    // 2. Mark physical room as occupied
    setRooms(prev =>
      prev.map(r => {
        if (r.id === targetRoomId) {
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

    // 3. Persist to Supabase
    if (isSupabaseConfigured && supabase) {
      supabase.from('bookings').update({ status: 'checked_in', room_id: targetRoomId, updated_at: new Date().toISOString() }).eq('id', bookingId).then();
      supabase.from('rooms').update({ status: 'occupied' }).eq('id', targetRoomId).then();
    }
  }, [bookings, rooms, logAudit]);

  // Check Out Guest (Marks checked_out, frees room into cleaning)
  const checkOutGuest = useCallback((bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'checked_out', updated_at: new Date().toISOString() } : b))
      );

      // Set Room to Cleaning
      if (booking.room_id) {
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
      }

      logAudit('CHECK_OUT_GUEST', 'BOOKING', booking.booking_number, { room_id: booking.room_id });

      if (isSupabaseConfigured && supabase) {
        supabase.from('bookings').update({ status: 'checked_out', updated_at: new Date().toISOString() }).eq('id', bookingId).then();
        if (booking.room_id) {
          supabase.from('rooms').update({ status: 'cleaning' }).eq('id', booking.room_id).then();
        }
      }
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

  // Wipe All Mock Data from LocalStorage and Cloud Database
  const wipeAllMockData = useCallback(async () => {
    // 1. Wipe local state
    setBookings([]);
    setOrders([]);
    setPayments([]);
    setRoomCharges([]);
    setRooms(INITIAL_ROOMS);

    // 2. Wipe localStorage
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.CHARGES);
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));

    // 3. Wipe Cloud Supabase if connected
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('order_items').delete().neq('id', 'placeholder');
        await supabase.from('orders').delete().neq('id', 'placeholder');
        await supabase.from('bookings').delete().neq('id', 'placeholder');
        await supabase.from('payments').delete().neq('id', 'placeholder');
        await supabase.from('guests').delete().neq('id', 'placeholder');
        await supabase.from('rooms').update({ status: 'available' }).neq('id', 'placeholder');
      } catch (err) {
        console.warn('Supabase cloud purge:', err);
      }
    }

    logAudit('WIPE_MOCK_DATA', 'SYSTEM', 'live_purge', { status: 'purged_clean' });
  }, [logAudit]);

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
        roomTypes,
        checkAvailability,
        bookings,
        createBooking,
        allotRoomToBooking,
        checkInGuest,
        checkOutGuest,
        getBookingById,
        getFolioForBooking,
        addRoomCharge,
        auditLogs,
        logAudit,
        resetToDemoData,
        wipeAllMockData,
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
