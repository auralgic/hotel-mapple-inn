import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { formatCurrency, formatDate, formatDateTime } from '../../lib/formatters';
import {
  Calendar,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Phone,
  BedDouble,
  DollarSign,
  Printer,
  Eye,
  LogOut,
} from 'lucide-react';
import { Booking } from '../../types';
import { InvoiceModal } from '../../components/admin/InvoiceModal';

export const AdminBookingsPage: React.FC = () => {
  const { bookings, rooms, createBooking, checkInGuest, checkOutGuest, orders } = useHotelData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);

  // New Booking Form State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('');
  const [roomId, setRoomId] = useState(rooms.find(r => r.status === 'available')?.id || rooms[0]?.id || '');
  const [checkIn, setCheckIn] = useState(new Date().toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [adults, setAdults] = useState(2);
  const [rate, setRate] = useState(2200);
  const [deposit, setDeposit] = useState(0);
  const [notes, setNotes] = useState('');

  const filteredBookings = bookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.booking_number.toLowerCase().includes(q) ||
        (b.guest?.name && b.guest.name.toLowerCase().includes(q)) ||
        (b.guest?.phone && b.guest.phone.includes(q)) ||
        (b.room?.room_number && b.room.room_number.includes(q))
      );
    }
    return true;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedRoomObj = rooms.find(r => r.id === roomId);
    const nights = Math.max(
      1,
      Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24))
    );
    const subtotal = rate * nights;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    createBooking({
      guest_id: `g-${Date.now()}`,
      guest: {
        id: `g-${Date.now()}`,
        name: guestName,
        phone: guestPhone,
        email: guestEmail,
        id_type: idType,
        id_number: idNumber,
      },
      room_id: roomId,
      room: selectedRoomObj,
      check_in: checkIn,
      check_out: checkOut,
      adults,
      children: 0,
      rate,
      discount: 0,
      tax,
      total,
      deposit,
      source: 'walk_in',
      status: 'confirmed',
      notes,
    });

    setNewModalOpen(false);
    // Reset form
    setGuestName('');
    setGuestPhone('');
    setDeposit(0);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full text-xs">Confirmed</span>;
      case 'checked_in':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-xs">Checked In</span>;
      case 'checked_out':
        return <span className="bg-neutral-100 text-neutral-800 font-bold px-2.5 py-1 rounded-full text-xs">Checked Out</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full text-xs">Cancelled</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-hotel-600 uppercase tracking-widest block mb-1">
            Front Desk PMS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Guest Reservations & Tax Invoices
          </h1>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-hotel-600 hover:bg-hotel-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Guest Name, Mobile, Room # (201-208, 301-308)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-1 text-xs overflow-x-auto w-full sm:w-auto">
          {['all', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold uppercase whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-hotel-600 text-white shadow-sm'
                  : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-neutral-50 text-neutral-800 uppercase tracking-wider font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-5 py-3.5">Booking #</th>
                <th className="px-5 py-3.5">Guest Info</th>
                <th className="px-5 py-3.5">Room</th>
                <th className="px-5 py-3.5">Stay Dates</th>
                <th className="px-5 py-3.5">Folio Total</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-neutral-50 transition">
                  <td className="px-5 py-4 font-mono font-bold text-neutral-900">
                    {b.booking_number}
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-bold text-neutral-900">{b.guest?.name}</div>
                    <div className="text-[11px] text-neutral-500 font-mono">{b.guest?.phone}</div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-lg">
                      Room {b.room?.room_number}
                    </span>
                    <span className="text-[11px] text-neutral-500 block mt-0.5">{b.room?.room_type?.name}</span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-neutral-900 font-medium">{formatDate(b.check_in)}</div>
                    <div className="text-[11px] text-neutral-500">to {formatDate(b.check_out)}</div>
                  </td>

                  <td className="px-5 py-4 font-bold text-neutral-900">
                    {formatCurrency(b.total)}
                  </td>

                  <td className="px-5 py-4">
                    {getStatusBadge(b.status)}
                  </td>

                  <td className="px-5 py-4 text-right space-x-2">
                    {/* Check In Action */}
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => checkInGuest(b.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs transition"
                      >
                        Check In
                      </button>
                    )}

                    {/* Check Out Action */}
                    {b.status === 'checked_in' && (
                      <button
                        onClick={() => checkOutGuest(b.id)}
                        className="bg-neutral-800 hover:bg-neutral-900 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs transition"
                      >
                        Check Out
                      </button>
                    )}

                    {/* Print Clean A4 Tax Invoice */}
                    <button
                      onClick={() => setSelectedBookingForInvoice(b)}
                      className="bg-hotel-50 hover:bg-hotel-100 text-hotel-700 font-bold px-2.5 py-1.5 rounded-lg text-xs border border-hotel-200 transition inline-flex items-center space-x-1"
                      title="Print Tax Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Reservation Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <h2 className="font-serif text-xl font-bold text-neutral-900 mb-4">
              Create Front Desk Reservation
            </h2>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Guest Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Assign Room *</label>
                  <select
                    value={roomId}
                    onChange={e => {
                      setRoomId(e.target.value);
                      const rObj = rooms.find(r => r.id === e.target.value);
                      if (rObj?.room_type?.base_price) setRate(rObj.room_type.base_price);
                    }}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>
                        Room {r.room_number} (Floor {r.floor}) - {r.room_type?.name} [{r.status}]
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Nightly Rate (₹)</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={e => setRate(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Check-In</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Check-Out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Advance Deposit (₹)</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={e => setDeposit(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">ID Proof</label>
                  <input
                    type="text"
                    placeholder="Aadhaar / DL Number"
                    value={idNumber}
                    onChange={e => setIdNumber(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold px-4 py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-hotel-600 hover:bg-hotel-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Standalone Dedicated Tax Invoice Printing Modal */}
      {selectedBookingForInvoice && (
        <InvoiceModal
          isOpen={!!selectedBookingForInvoice}
          onClose={() => setSelectedBookingForInvoice(null)}
          booking={selectedBookingForInvoice}
          foodOrders={orders.filter(
            o => o.room_number === selectedBookingForInvoice.room?.room_number || o.booking_id === selectedBookingForInvoice.id
          )}
        />
      )}
    </div>
  );
};
