import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { formatCurrency, formatDate } from '../../lib/formatters';
import {
  Search,
  Plus,
  Printer,
  BedDouble,
  CheckCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  LogIn,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { Booking, Room } from '../../types';
import { InvoiceModal } from '../../components/admin/InvoiceModal';

export const AdminBookingsPage: React.FC = () => {
  const {
    bookings,
    rooms,
    roomTypes,
    createBooking,
    allotRoomToBooking,
    checkInGuest,
    checkOutGuest,
    orders,
  } = useHotelData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);

  // Quick Allotment Dropdown State
  const [allotModalBooking, setAllotModalBooking] = useState<Booking | null>(null);
  const [selectedRoomIdToAllot, setSelectedRoomIdToAllot] = useState<string>('');

  // New Reservation Form State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('');
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(roomTypes[0]?.id || 'rt-deluxe');
  const [selectedPhysicalRoomId, setSelectedPhysicalRoomId] = useState('');
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
        (b.allotted_room_number && b.allotted_room_number.includes(q)) ||
        (b.room?.room_number && b.room.room_number.includes(q)) ||
        (b.room_type?.name && b.room_type.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenType = roomTypes.find(rt => rt.id === selectedRoomTypeId) || roomTypes[0];
    const chosenRoom = rooms.find(r => r.id === selectedPhysicalRoomId);

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
        name: guestName.trim(),
        phone: guestPhone.trim(),
        email: guestEmail.trim(),
        id_type: idType,
        id_number: idNumber.trim(),
      },
      room_type_id: chosenType.id,
      room_type: chosenType,
      room_id: chosenRoom ? chosenRoom.id : undefined,
      room: chosenRoom || undefined,
      allotted_room_number: chosenRoom ? chosenRoom.room_number : undefined,
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
    setGuestName('');
    setGuestPhone('');
    setGuestEmail('');
    setDeposit(0);
    setNotes('');
  };

  const openAllotModal = (booking: Booking) => {
    setAllotModalBooking(booking);
    // Find first available physical room that matches category (or any available room)
    const matchingAvailable = rooms.find(
      r => (!booking.room_type_id || r.room_type_id === booking.room_type_id) && r.status === 'available'
    );
    setSelectedRoomIdToAllot(matchingAvailable?.id || '');
  };

  const handleConfirmAllotment = () => {
    if (!allotModalBooking || !selectedRoomIdToAllot) return;
    allotRoomToBooking(allotModalBooking.id, selectedRoomIdToAllot);
    setAllotModalBooking(null);
    setSelectedRoomIdToAllot('');
  };

  const handleCheckIn = (booking: Booking) => {
    const roomId = booking.room_id || booking.room?.id;
    if (!roomId) {
      // Need allotment first
      openAllotModal(booking);
      return;
    }
    checkInGuest(booking.id, roomId);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-blue-50 text-blue-800 border border-blue-200 font-bold px-2 py-0.5 text-xs">Confirmed</span>;
      case 'checked_in':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 text-xs">Checked In</span>;
      case 'checked_out':
        return <span className="bg-neutral-100 text-neutral-800 border border-neutral-200 font-bold px-2 py-0.5 text-xs">Checked Out</span>;
      case 'cancelled':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 text-xs">Cancelled</span>;
      default:
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-1">
            FRONT DESK RESERVATIONS & PMS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Guest Reservations & Room Allotments
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage incoming direct website bookings, allot available rooms (201–208, 301–308), and execute seamless guest check-ins.
          </p>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-neutral-950 font-bold px-4 py-2.5 text-xs shadow-xs transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Walk-in / Reservation</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-neutral-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Guest Name, Mobile, Booking ID, Room #..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 text-xs focus:outline-none focus:border-amber-700 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-neutral-500 shrink-0">Filter:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 text-xs px-3 py-2 font-semibold text-neutral-800 focus:outline-none focus:border-amber-700 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Bookings ({bookings.length})</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In (Active Stays)</option>
            <option value="checked_out">Checked Out (Completed)</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100/70 border-b border-neutral-200 text-neutral-700 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="px-5 py-3.5">Booking Ref</th>
                <th className="px-5 py-3.5">Guest Details</th>
                <th className="px-5 py-3.5">Booked Category</th>
                <th className="px-5 py-3.5">Physical Room Allotment</th>
                <th className="px-5 py-3.5">Dates & Nights</th>
                <th className="px-5 py-3.5">Total (GST)</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-neutral-400">
                    <BedDouble className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="font-bold text-neutral-700 text-sm">No Bookings Found</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {searchQuery || statusFilter !== 'all'
                        ? 'No reservations match the search criteria.'
                        : 'New reservations from the website or front desk will appear here.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map(b => {
                  const allottedRoomNum = b.allotted_room_number || b.room?.room_number;
                  const categoryName = b.room_type?.name || b.room?.room_type?.name || 'Deluxe Room';

                  return (
                    <tr key={b.id} className="hover:bg-neutral-50/80 transition">
                      {/* 1. Booking Number */}
                      <td className="px-5 py-4 font-mono font-bold text-neutral-900">
                        {b.booking_number}
                        <span className="text-[10px] text-neutral-400 font-sans block uppercase mt-0.5">
                          {b.source || 'Direct'}
                        </span>
                      </td>

                      {/* 2. Guest Details */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-neutral-900 text-sm">{b.guest?.name || 'Guest'}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">{b.guest?.phone || 'N/A'}</div>
                      </td>

                      {/* 3. Booked Category */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-neutral-800">{categoryName}</span>
                        <span className="text-[10px] text-neutral-500 block mt-0.5">{b.adults} Guest{b.adults > 1 ? 's' : ''}</span>
                      </td>

                      {/* 4. Physical Room Allotment */}
                      <td className="px-5 py-4">
                        {allottedRoomNum ? (
                          <div className="space-y-1">
                            <span className="bg-neutral-900 text-amber-400 font-mono font-bold px-2.5 py-1 text-xs inline-block">
                              Room {allottedRoomNum}
                            </span>
                            {b.status !== 'checked_out' && b.status !== 'cancelled' && (
                              <button
                                onClick={() => openAllotModal(b)}
                                className="block text-[10px] text-amber-800 hover:underline font-bold cursor-pointer"
                              >
                                Re-allot Room
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 text-[10px] uppercase block w-fit">
                              Not Allotted
                            </span>
                            <button
                              onClick={() => openAllotModal(b)}
                              className="bg-amber-600 hover:bg-amber-700 text-neutral-950 font-bold px-2 py-1 text-[11px] uppercase tracking-wider transition cursor-pointer"
                            >
                              Allot Room ▾
                            </button>
                          </div>
                        )}
                      </td>

                      {/* 5. Dates */}
                      <td className="px-5 py-4">
                        <div className="text-neutral-900 font-semibold">{formatDate(b.check_in)}</div>
                        <div className="text-[11px] text-neutral-500">to {formatDate(b.check_out)}</div>
                      </td>

                      {/* 6. Total */}
                      <td className="px-5 py-4 font-serif font-bold text-neutral-900">
                        {formatCurrency(b.total)}
                      </td>

                      {/* 7. Status */}
                      <td className="px-5 py-4">
                        {getStatusBadge(b.status)}
                      </td>

                      {/* 8. Actions */}
                      <td className="px-5 py-4 text-right space-x-1.5">
                        {/* Check In Action */}
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => handleCheckIn(b)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 text-xs transition cursor-pointer active:scale-95 inline-flex items-center space-x-1"
                            title="Check In Guest"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Check In</span>
                          </button>
                        )}

                        {/* Check Out Action */}
                        {b.status === 'checked_in' && (
                          <button
                            onClick={() => checkOutGuest(b.id)}
                            className="bg-neutral-800 hover:bg-neutral-900 text-white font-bold px-3 py-1.5 text-xs transition cursor-pointer active:scale-95 inline-flex items-center space-x-1"
                            title="Check Out Guest"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Check Out</span>
                          </button>
                        )}

                        {/* Print Clean A4 Tax Invoice */}
                        <button
                          onClick={() => setSelectedBookingForInvoice(b)}
                          className="bg-white hover:bg-neutral-100 text-neutral-800 font-bold px-2.5 py-1.5 text-xs border border-neutral-300 transition inline-flex items-center space-x-1 cursor-pointer"
                          title="Print Tax Invoice"
                        >
                          <Printer className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Invoice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* ALLOT ROOM MODAL (Admin assigns physical room) */}
      {/* ==================================================================== */}
      {allotModalBooking && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 max-w-md w-full border border-neutral-300 shadow-2xl space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block mb-1">
                Room Allotment Engine
              </span>
              <h2 className="text-lg font-bold text-neutral-900">
                Allot Room for {allotModalBooking.guest?.name || 'Guest'}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Booked Category: <strong>{allotModalBooking.room_type?.name || 'Deluxe Room'}</strong> ({formatDate(allotModalBooking.check_in)} to {formatDate(allotModalBooking.check_out)})
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-800 uppercase">
                Select Physical Room (Floors 2 & 3)
              </label>
              <select
                value={selectedRoomIdToAllot}
                onChange={e => setSelectedRoomIdToAllot(e.target.value)}
                className="w-full bg-white border border-neutral-300 p-2.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-amber-700 cursor-pointer"
              >
                <option value="">-- Choose Physical Room --</option>
                {rooms
                  .filter(r => !allotModalBooking.room_type_id || r.room_type_id === allotModalBooking.room_type_id)
                  .map(r => (
                    <option key={r.id} value={r.id}>
                      Room {r.room_number} (Floor {r.floor}) — {r.room_type?.name} [{r.status.toUpperCase()}]
                    </option>
                  ))}
              </select>
              <span className="text-[11px] text-neutral-500 block">
                Assigning an available room will lock it for this guest.
              </span>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setAllotModalBooking(null)}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold px-4 py-2 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedRoomIdToAllot}
                onClick={handleConfirmAllotment}
                className="bg-amber-600 hover:bg-amber-700 text-neutral-950 font-bold px-5 py-2 text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
              >
                Confirm Allotment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* NEW RESERVATION MODAL (Front Desk Walk-In) */}
      {/* ==================================================================== */}
      {newModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-7 max-w-xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-neutral-300">
            <h2 className="font-serif text-xl font-bold text-neutral-900 mb-1">
              Create Front Desk Reservation
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Enter walk-in or phone reservation details. Room number can be assigned now or at check-in.
            </p>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 focus:outline-none focus:border-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Guest Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 focus:outline-none focus:border-amber-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Room Category *</label>
                  <select
                    value={selectedRoomTypeId}
                    onChange={e => {
                      setSelectedRoomTypeId(e.target.value);
                      const rt = roomTypes.find(t => t.id === e.target.value);
                      if (rt) setRate(rt.base_price);
                    }}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 focus:outline-none focus:border-amber-700 cursor-pointer font-bold"
                  >
                    {roomTypes.map(rt => (
                      <option key={rt.id} value={rt.id}>
                        {rt.name} ({formatCurrency(rt.base_price)}/night)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Allot Room Now (Optional)
                  </label>
                  <select
                    value={selectedPhysicalRoomId}
                    onChange={e => setSelectedPhysicalRoomId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 focus:outline-none focus:border-amber-700 cursor-pointer"
                  >
                    <option value="">-- Allot Later at Check-In --</option>
                    {rooms
                      .filter(r => r.room_type_id === selectedRoomTypeId && r.status === 'available')
                      .map(r => (
                        <option key={r.id} value={r.id}>
                          Room {r.room_number} (Floor {r.floor}) [Available]
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Check-In</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 focus:outline-none focus:border-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Check-Out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 focus:outline-none focus:border-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Nightly Rate (₹)</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={e => setRate(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 font-mono font-bold"
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
                    className="w-full text-xs px-3 py-2 border border-neutral-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">ID Proof Number</label>
                  <input
                    type="text"
                    placeholder="Aadhaar / DL Number"
                    value={idNumber}
                    onChange={e => setIdNumber(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold px-4 py-2 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-neutral-950 font-bold px-6 py-2 text-xs uppercase tracking-wider transition cursor-pointer active:scale-95"
                >
                  Create Reservation
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
            o =>
              o.room_number === selectedBookingForInvoice.allotted_room_number ||
              o.room_number === selectedBookingForInvoice.room?.room_number ||
              o.booking_id === selectedBookingForInvoice.id
          )}
        />
      )}
    </div>
  );
};
