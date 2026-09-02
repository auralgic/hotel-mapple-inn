import React from 'react';
import { Link } from 'react-router-dom';
import { useHotelData } from '../../context/HotelDataContext';
import { formatCurrency, formatDateTime } from '../../lib/formatters';
import {
  BedDouble,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  UtensilsCrossed,
  ArrowRight,
  Sparkles,
  Phone,
  ChefHat,
  Eye,
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { rooms, orders, updateOrderStatus, bookings, payments, settings } = useHotelData();

  // Metrics calculation
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const cleaningRooms = rooms.filter(r => r.status === 'cleaning').length;

  const todayOrders = orders.filter(o => o.status !== 'cancelled');
  const pendingOrdersCount = orders.filter(
    o => o.status === 'new' || o.status === 'preparing' || o.status === 'confirmed'
  ).length;

  const pendingPayments = payments.filter(p => p.status === 'submitted');

  const foodRevenueToday = todayOrders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const roomRevenueToday = bookings.reduce((sum, b) => sum + b.total, 0);
  const totalRevenue = foodRevenueToday + roomRevenueToday;

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse';
      case 'preparing':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'ready':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'cancelled':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-hotel-900 to-hotel-800 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-hotel-300 uppercase tracking-widest block mb-1">
            Master Property Operations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Hotel Mapple Inn Jaipur Dashboard
          </h1>
          <p className="text-xs text-neutral-300 mt-1">
            16 Boutique Rooms Across Floors 2 & 3 (201–208 & 301–308) • Reception Hotline: <strong>9680131232</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/bookings"
            className="bg-white hover:bg-neutral-100 text-hotel-900 font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
          >
            New Reservation
          </Link>
          <Link
            to="/admin/payments"
            className="bg-hotel-600 hover:bg-hotel-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition flex items-center space-x-1.5"
          >
            <span>Verify UPI Payments</span>
            {pendingPayments.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {pendingPayments.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">Live Occupancy</span>
            <BedDouble className="w-4 h-4 text-hotel-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">
            {occupiedRooms} <span className="text-sm font-normal text-neutral-400">/ 16 Rooms</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {availableRooms} Available • {cleaningRooms} In Cleaning
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Food: {formatCurrency(foodRevenueToday)} • Rooms: {formatCurrency(roomRevenueToday)}
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">Kitchen Active Tickets</span>
            <UtensilsCrossed className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">
            {pendingOrdersCount} <span className="text-sm font-normal text-neutral-400">Tickets</span>
          </div>
          <Link to="/kitchen" className="text-[11px] text-hotel-600 font-bold hover:underline mt-1 block">
            Open Touch KDS Screen →
          </Link>
        </div>

        {/* Unverified UPI Payments */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">Pending UPI Verification</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">
            {pendingPayments.length} <span className="text-sm font-normal text-neutral-400">Requests</span>
          </div>
          <Link to="/admin/payments" className="text-[11px] text-rose-600 font-bold hover:underline mt-1 block">
            Review UPI UTR Reference →
          </Link>
        </div>
      </div>

      {/* 5. LIVE KITCHEN & DINING ORDERS TABLE */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-900">
                Live Kitchen & Room Service Orders
              </h3>
              <p className="text-xs text-neutral-500">
                Orders placed from guest QR codes and in-room dining
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/kitchen"
              className="text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg transition"
            >
              Touch KDS Screen
            </Link>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-hotel-600 hover:text-hotel-700 inline-flex items-center space-x-1"
            >
              <span>View All Orders ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8 text-xs text-neutral-500">
            No kitchen orders placed yet. Scan a room QR code or open /order to place an order.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Room</th>
                  <th className="py-2.5 px-3">Guest</th>
                  <th className="py-2.5 px-3">Items Summary</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.slice(0, 8).map(order => (
                  <tr key={order.id} className="hover:bg-neutral-50/80 transition">
                    <td className="py-3 px-3 font-mono font-bold text-neutral-900">
                      {order.order_number}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                        Room {order.room_number}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-neutral-800">
                      {order.guest_name}
                    </td>
                    <td className="py-3 px-3 text-neutral-600 max-w-xs truncate">
                      {order.items.map(i => `${i.quantity}x ${i.item_name_snapshot}`).join(', ')}
                    </td>
                    <td className="py-3 px-3 font-bold text-neutral-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${getOrderStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                      {order.status === 'new' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded text-[10px] transition"
                        >
                          Start Prep
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-2.5 py-1 rounded text-[10px] transition"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded text-[10px] transition"
                        >
                          Delivered
                        </button>
                      )}
                      <Link
                        to="/admin/orders"
                        className="text-neutral-500 hover:text-neutral-900 font-semibold text-[11px] inline-block px-1.5"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 16-Room Live Status Floor Grid */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">
              16-Room Live Status Board
            </h3>
            <p className="text-xs text-neutral-500">Floor 2 (Rooms 201–208) & Floor 3 (Rooms 301–308)</p>
          </div>
          <Link
            to="/admin/rooms"
            className="text-xs font-bold text-hotel-600 hover:text-hotel-700 inline-flex items-center space-x-1"
          >
            <span>Manage All Rooms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Floor 2 Grid */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
            Floor 2 (Rooms 201 to 208)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {rooms.filter(r => r.floor === 2).map(r => (
              <div
                key={r.id}
                className={`p-3 rounded-xl border text-center text-xs font-bold ${
                  r.status === 'occupied'
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : r.status === 'available'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : r.status === 'cleaning'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-neutral-50 border-neutral-300 text-neutral-700'
                }`}
              >
                <div className="font-serif text-base">{r.room_number}</div>
                <span className="text-[10px] uppercase block opacity-80">{r.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floor 3 Grid */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
            Floor 3 (Rooms 301 to 308)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {rooms.filter(r => r.floor === 3).map(r => (
              <div
                key={r.id}
                className={`p-3 rounded-xl border text-center text-xs font-bold ${
                  r.status === 'occupied'
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : r.status === 'available'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : r.status === 'cleaning'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-neutral-50 border-neutral-300 text-neutral-700'
                }`}
              >
                <div className="font-serif text-base">{r.room_number}</div>
                <span className="text-[10px] uppercase block opacity-80">{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
