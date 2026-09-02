import React, { useState } from 'react';
import { X, CalendarCheck, CheckCircle2, MessageSquare, ArrowRight, BedDouble, Users, AlertCircle, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { RoomType } from '../../types';

interface DirectBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialParams?: {
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    roomType?: string;
  };
}

export const DirectBookingModal: React.FC<DirectBookingModalProps> = ({
  isOpen,
  onClose,
  initialParams,
}) => {
  const { roomTypes, settings, mediaConfig, createBooking, checkAvailability } = useHotelData();

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60000).toISOString().slice(0, 10);

  const [checkIn, setCheckIn] = useState(initialParams?.checkIn || today);
  const [checkOut, setCheckOut] = useState(initialParams?.checkOut || tomorrow);
  const [adults, setAdults] = useState(initialParams?.adults || 2);

  // Step state: 'select_room' | 'guest_details' | 'confirmed'
  const [step, setStep] = useState<'select_room' | 'guest_details' | 'confirmed'>('select_room');
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(() => {
    if (initialParams?.roomType && initialParams.roomType !== 'all') {
      return roomTypes.find(rt => rt.id === initialParams.roomType) || null;
    }
    return null;
  });

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [confirmedBookingNum, setConfirmedBookingNum] = useState('');

  if (!isOpen) return null;

  const nights = Math.max(
    1,
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24))
  );

  const getRoomTypeImage = (typeId: string) => {
    if (typeId === 'rt-deluxe') return mediaConfig.deluxeRoomImage || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80';
    if (typeId === 'rt-super-deluxe') return mediaConfig.superDeluxeImage || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
    return mediaConfig.executiveSuiteImage || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80';
  };

  const handleSelectCategory = (roomType: RoomType) => {
    const avail = checkAvailability(checkIn, checkOut, roomType.id);
    if (!avail.available) return;
    setSelectedRoomType(roomType);
    setStep('guest_details');
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomType || !guestName.trim() || !guestPhone.trim()) return;

    const rate = selectedRoomType.base_price;
    const subtotal = rate * nights;
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const totalAmount = subtotal + tax;

    const newBooking = createBooking({
      guest_id: `g-${Date.now()}`,
      guest: {
        id: `g-${Date.now()}`,
        name: guestName.trim(),
        phone: guestPhone.trim(),
        email: guestEmail.trim(),
      },
      room_type_id: selectedRoomType.id,
      room_type: selectedRoomType,
      room_id: undefined, // Unassigned: Front desk allots room upon check-in!
      check_in: checkIn,
      check_out: checkOut,
      adults,
      children: 0,
      rate,
      discount: 0,
      tax,
      total: totalAmount,
      deposit: 0,
      source: 'direct',
      status: 'confirmed',
      notes: specialRequests || 'Direct website reservation',
    });

    setConfirmedBookingNum(newBooking.booking_number);
    setStep('confirmed');
  };

  const handleWhatsAppInstant = () => {
    if (!selectedRoomType) return;
    const rate = selectedRoomType.base_price;
    const subtotal = rate * nights;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const text = encodeURIComponent(
      `Hello Hotel Mapple Inn! I would like to book a stay.\n\n` +
      `Booking ID: ${confirmedBookingNum || 'Direct Request'}\n` +
      `Guest Name: ${guestName || 'Guest'}\n` +
      `Phone: ${guestPhone}\n` +
      `Room Category: ${selectedRoomType.name}\n` +
      `Dates: ${formatDate(checkIn)} to ${formatDate(checkOut)} (${nights} Night${nights > 1 ? 's' : ''})\n` +
      `Estimated Total: ₹${total.toLocaleString('en-IN')}\n\n` +
      `Please confirm my reservation.`
    );
    window.open(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-none p-5 sm:p-7 max-w-2xl w-full max-h-[92vh] overflow-y-auto relative shadow-2xl border border-neutral-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-600 hover:text-neutral-950 p-1.5 rounded-none hover:bg-neutral-100 transition cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ==================================================================== */}
        {/* STEP 1: ROOM SEARCH RESULTS & AVAILABILITY */}
        {/* ==================================================================== */}
        {step === 'select_room' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
                <CalendarCheck className="w-4 h-4 shrink-0" />
                <span>Live Availability Search</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 mb-1">
                Select Your Room Category
              </h2>
              <p className="text-xs text-neutral-600">
                Choose from our 16 boutique rooms in Nirman Nagar, Jaipur. Guaranteed best direct rates.
              </p>
            </div>

            {/* Date Range Modification Bar */}
            <div className="bg-[#faf8f5] p-3.5 border border-[#e2d8ca] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Check-In</label>
                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  className="w-full bg-white px-2.5 py-1.5 border border-neutral-300 font-medium text-neutral-900 focus:outline-none focus:border-amber-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Check-Out</label>
                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  className="w-full bg-white px-2.5 py-1.5 border border-neutral-300 font-medium text-neutral-900 focus:outline-none focus:border-amber-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Guests</label>
                <select
                  value={adults}
                  onChange={e => setAdults(Number(e.target.value))}
                  className="w-full bg-white px-2.5 py-1.5 border border-neutral-300 font-medium text-neutral-900 focus:outline-none focus:border-amber-700 cursor-pointer"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>
            </div>

            {/* Room Categories Results */}
            <div className="space-y-3.5">
              {roomTypes.map(type => {
                const avail = checkAvailability(checkIn, checkOut, type.id);
                const subtotal = type.base_price * nights;
                const totalWithTax = subtotal + Math.round(subtotal * 0.05);

                return (
                  <div
                    key={type.id}
                    className={`border transition p-3.5 sm:p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${
                      avail.available
                        ? 'border-neutral-200 hover:border-amber-600 bg-white'
                        : 'border-neutral-200 bg-neutral-50/70 opacity-75'
                    }`}
                  >
                    <div className="flex gap-3.5 items-center w-full sm:w-auto">
                      <img
                        src={getRoomTypeImage(type.id)}
                        alt={type.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover border border-neutral-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-neutral-900 text-sm sm:text-base">{type.name}</h3>
                          {avail.available ? (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5">
                              {avail.remainingCount} Available
                            </span>
                          ) : (
                            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5">
                              Sold Out
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 line-clamp-1">{type.description}</p>
                        <div className="text-[11px] text-neutral-600 flex items-center space-x-2">
                          <span>Max {type.max_occupancy} Guests</span>
                          <span>•</span>
                          <span>Free Wi-Fi & AC</span>
                          <span>•</span>
                          <span>Pure Veg Dining</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 flex sm:flex-col justify-between items-center sm:items-end gap-2 shrink-0">
                      <div>
                        <div className="text-sm sm:text-base font-bold text-neutral-950 font-serif">
                          {formatCurrency(type.base_price)}
                          <span className="text-[10px] font-normal text-neutral-500 font-sans"> / night</span>
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {nights} Night{nights > 1 ? 's' : ''}: <strong>{formatCurrency(totalWithTax)}</strong> incl. GST
                        </div>
                      </div>

                      {avail.available ? (
                        <button
                          onClick={() => handleSelectCategory(type)}
                          className="bg-amber-600 hover:bg-amber-700 text-neutral-950 font-bold px-4 py-2 text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer shrink-0"
                        >
                          Select & Reserve
                        </button>
                      ) : (
                        <span className="text-neutral-400 text-xs font-bold py-2 px-3 bg-neutral-100 border border-neutral-200">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STEP 2: GUEST DETAILS & RESERVATION CONFIRMATION */}
        {/* ==================================================================== */}
        {step === 'guest_details' && selectedRoomType && (
          <form onSubmit={handleConfirmReservation} className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <button
                type="button"
                onClick={() => setStep('select_room')}
                className="text-xs text-neutral-600 hover:text-neutral-900 font-bold flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Room Results</span>
              </button>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Step 2 of 2</span>
            </div>

            {/* Stay Summary Card */}
            <div className="bg-[#faf8f5] p-3.5 border border-[#e2d8ca] flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">Selected Stay</span>
                <strong className="text-neutral-900 text-sm">{selectedRoomType.name}</strong>
                <div className="text-neutral-600 mt-0.5">
                  {formatDate(checkIn)} to {formatDate(checkOut)} ({nights} Night{nights > 1 ? 's' : ''}, {adults} Guest{adults > 1 ? 's' : ''})
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 uppercase block">Total Payable</span>
                <strong className="text-sm font-bold text-neutral-900 font-serif">
                  {formatCurrency(selectedRoomType.base_price * nights + Math.round(selectedRoomType.base_price * nights * 0.05))}
                </strong>
                <span className="text-[10px] text-neutral-500 block">5% GST included</span>
              </div>
            </div>

            {/* Note regarding Room Allotment */}
            <div className="bg-amber-50/80 border border-amber-200/80 p-3 text-[11px] text-amber-950 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Front Desk Allotment:</strong> Your room category reservation is guaranteed upon confirmation. Your exact room number (Floors 2 & 3) will be allotted at the front desk upon arrival.
              </span>
            </div>

            {/* Guest Form Fields */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className="w-full bg-white text-xs px-3 py-2 border border-neutral-300 font-medium text-neutral-900 focus:outline-none focus:border-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Mobile / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98290 12345"
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    className="w-full bg-white text-xs px-3 py-2 border border-neutral-300 font-medium text-neutral-900 focus:outline-none focus:border-amber-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={guestEmail}
                    onChange={e => setGuestEmail(e.target.value)}
                    className="w-full bg-white text-xs px-3 py-2 border border-neutral-300 font-medium text-neutral-900 focus:outline-none focus:border-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Special Requests
                  </label>
                  <input
                    type="text"
                    placeholder="Quiet room, late check-in, ground floor"
                    value={specialRequests}
                    onChange={e => setSpecialRequests(e.target.value)}
                    className="w-full bg-white text-xs px-3 py-2 border border-neutral-300 font-medium text-neutral-900 focus:outline-none focus:border-amber-700"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-neutral-950 font-bold py-3 text-xs uppercase tracking-wider transition shadow-sm cursor-pointer active:scale-95"
              >
                Confirm Direct Reservation Request
              </button>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* STEP 3: RESERVATION CONFIRMED */}
        {/* ==================================================================== */}
        {step === 'confirmed' && selectedRoomType && (
          <div className="text-center py-5 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest block">
                Reservation Request Received
              </span>
              <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-1">
                Booking Confirmed!
              </h2>
              <div className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 inline-block px-3 py-1 mt-2">
                Booking ID: {confirmedBookingNum}
              </div>
            </div>

            <div className="bg-[#faf8f5] p-4 text-xs text-neutral-700 border border-[#e2d8ca] max-w-md mx-auto text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Guest:</span>
                <strong className="text-neutral-900">{guestName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Room Category:</span>
                <strong className="text-neutral-900">{selectedRoomType.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Dates:</span>
                <strong className="text-neutral-900">{formatDate(checkIn)} — {formatDate(checkOut)} ({nights} Nights)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Physical Room Number:</span>
                <span className="text-amber-800 font-bold">To be allotted at Front Desk</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 max-w-md mx-auto">
              <button
                type="button"
                onClick={handleWhatsAppInstant}
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-4 py-2.5 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send to Hotel WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-4 py-2.5 text-xs uppercase tracking-wider transition cursor-pointer"
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
