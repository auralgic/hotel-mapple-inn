import React, { useState } from 'react';
import { X, CalendarCheck, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { Room } from '../../types';

interface DirectBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialParams?: {
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    roomType?: string;
    selectedRoom?: Room;
  };
}

export const DirectBookingModal: React.FC<DirectBookingModalProps> = ({
  isOpen,
  onClose,
  initialParams,
}) => {
  const { rooms, settings, createBooking } = useHotelData();

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60000).toISOString().slice(0, 10);

  const [checkIn, setCheckIn] = useState(initialParams?.checkIn || today);
  const [checkOut, setCheckOut] = useState(initialParams?.checkOut || tomorrow);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [adults, setAdults] = useState(initialParams?.adults || 2);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(() => {
    if (initialParams?.selectedRoom) return initialParams.selectedRoom.id;
    const available = rooms.find(r => r.status === 'available');
    return available ? available.id : rooms[0]?.id || '';
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingNum, setConfirmedBookingNum] = useState('');

  if (!isOpen) return null;

  const targetRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];
  const nightlyRate = targetRoom?.room_type?.base_price || 2200;

  const nights = Math.max(
    1,
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24))
  );

  const subtotal = nightlyRate * nights;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const totalAmount = subtotal + tax;

  const availableRoomsForSelection = rooms.filter(r => r.status === 'available' || r.id === selectedRoomId);

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) return;

    const newBooking = createBooking({
      guest_id: `g-${Date.now()}`,
      guest: {
        id: `g-${Date.now()}`,
        name: guestName,
        phone: guestPhone,
        email: guestEmail,
      },
      room_id: targetRoom.id,
      room: targetRoom,
      check_in: checkIn,
      check_out: checkOut,
      adults,
      children: 0,
      rate: nightlyRate,
      discount: 0,
      tax,
      total: totalAmount,
      deposit: 0,
      source: 'direct',
      status: 'confirmed',
      notes: 'Direct website booking request',
    });

    setConfirmedBookingNum(newBooking.booking_number);
    setBookingConfirmed(true);
  };

  const handleWhatsAppInstant = () => {
    const text = encodeURIComponent(
      `Hello Hotel Mapple Inn! I would like to book a stay.\n\n` +
      `Guest Name: ${guestName || 'Guest'}\n` +
      `Phone: ${guestPhone}\n` +
      `Room: ${targetRoom.room_type?.name}\n` +
      `Dates: ${formatDate(checkIn)} to ${formatDate(checkOut)} (${nights} Night${nights > 1 ? 's' : ''})\n` +
      `Estimated Total: ₹${totalAmount.toLocaleString('en-IN')}\n\n` +
      `Please confirm availability.`
    );
    window.open(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-none p-5 sm:p-7 max-w-lg w-full max-h-[92vh] overflow-y-auto relative shadow-2xl border border-neutral-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-600 hover:text-neutral-950 p-1.5 rounded-none hover:bg-neutral-100 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!bookingConfirmed ? (
          <div>
            <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
              <CalendarCheck className="w-4 h-4 shrink-0" />
              <span>Direct Reservation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 mb-1">
              Reserve Your Stay
            </h2>
            <p className="text-xs text-neutral-600 mb-4 font-normal">
              Guaranteed lowest rate with zero booking fees and priority check-in.
            </p>

            <form onSubmit={handleConfirmReservation} className="space-y-3.5">
              {/* Dates & Room Selection */}
              <div className="bg-[#faf8f5] p-3.5 sm:p-4 rounded-none border border-[#e2d8ca] space-y-3">
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">
                      Check-In
                    </label>
                    <input
                      type="date"
                      required
                      min={today}
                      value={checkIn}
                      onChange={e => setCheckIn(e.target.value)}
                      className="w-full bg-white text-xs font-semibold px-2.5 py-2 rounded-none border border-neutral-400 text-neutral-900 focus:outline-none focus:border-amber-700 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">
                      Check-Out
                    </label>
                    <input
                      type="date"
                      required
                      min={checkIn}
                      value={checkOut}
                      onChange={e => setCheckOut(e.target.value)}
                      className="w-full bg-white text-xs font-semibold px-2.5 py-2 rounded-none border border-neutral-400 text-neutral-900 focus:outline-none focus:border-amber-700 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">
                    Select Room Category
                  </label>
                  <select
                    value={selectedRoomId}
                    onChange={e => setSelectedRoomId(e.target.value)}
                    className="w-full bg-white text-xs font-semibold px-3 py-2.5 rounded-none border border-neutral-400 text-neutral-900 focus:outline-none focus:border-amber-700 cursor-pointer"
                  >
                    {availableRoomsForSelection.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.room_type?.name} — {formatCurrency(r.room_type?.base_price)}/night
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-800 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-none border border-neutral-400 text-neutral-900 focus:border-amber-700 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-800 uppercase mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98290 XXXXX"
                      value={guestPhone}
                      onChange={e => setGuestPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-none border border-neutral-400 text-neutral-900 focus:border-amber-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-800 uppercase mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={guestEmail}
                      onChange={e => setGuestEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-none border border-neutral-400 text-neutral-900 focus:border-amber-700 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-[#faf8f5] p-3 rounded-none border border-[#e2d8ca] text-xs space-y-1">
                <div className="flex justify-between text-neutral-700">
                  <span>Room Rate ({formatCurrency(nightlyRate)} × {nights} Night{nights > 1 ? 's' : ''})</span>
                  <span className="font-semibold text-neutral-950">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-700">
                  <span>Estimated Taxes (5% GST)</span>
                  <span className="font-semibold text-neutral-950">{formatCurrency(tax)}</span>
                </div>
                <div className="pt-1.5 border-t border-neutral-300 flex justify-between text-sm font-bold text-neutral-950">
                  <span>Total Amount</span>
                  <span className="text-amber-900 font-bold">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Strict Max 2-Word Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  className="w-full bg-neutral-950 hover:bg-amber-700 text-white font-bold py-3.5 px-4 rounded-none text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center space-x-2 whitespace-nowrap active:scale-95"
                >
                  <span>Confirm Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppInstant}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold py-2.5 px-4 rounded-none text-xs flex items-center justify-center space-x-2 transition whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>WhatsApp Request</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-4 space-y-3">
            <div className="w-14 h-14 rounded-none bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-semibold text-neutral-950">
              Reservation Received!
            </h3>

            <div className="bg-[#faf8f5] p-3.5 rounded-none border border-[#e2d8ca] max-w-sm mx-auto text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-600 font-semibold">Booking ID:</span>
                <strong className="text-neutral-950">{confirmedBookingNum}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 font-semibold">Guest:</span>
                <strong className="text-neutral-950">{guestName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 font-semibold">Category:</span>
                <strong className="text-amber-900">{targetRoom.room_type?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 font-semibold">Dates:</span>
                <span className="text-neutral-950">{formatDate(checkIn)} → {formatDate(checkOut)} ({nights} Nights)</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-neutral-300 text-sm font-bold">
                <span>Total:</span>
                <span className="text-amber-900">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 max-w-sm mx-auto font-normal">
              Our front desk will contact you on <strong>{guestPhone}</strong> to verify check-in timings.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={handleWhatsAppInstant}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-none text-xs flex items-center justify-center space-x-2 transition whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat WhatsApp</span>
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold px-5 py-2.5 rounded-none text-xs border border-neutral-300 transition whitespace-nowrap"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
