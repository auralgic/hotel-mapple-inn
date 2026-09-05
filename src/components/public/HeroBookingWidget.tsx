import React, { useState } from 'react';
import { Calendar, Users, BedDouble, Search, Sparkles } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';
import { formatCurrency } from '../../lib/formatters';

interface HeroBookingWidgetProps {
  onSearch: (params: {
    checkIn: string;
    checkOut: string;
    adults: number;
    roomType: string;
  }) => void;
}

export const HeroBookingWidget: React.FC<HeroBookingWidgetProps> = ({ onSearch }) => {
  const { rooms, roomTypes } = useHotelData();
  const availableCount = rooms.filter(r => r.status === 'available').length;

  const deluxePrice = roomTypes.find(rt => rt.id === 'rt-deluxe')?.base_price || 2200;
  const superDeluxePrice = roomTypes.find(rt => rt.id === 'rt-super-deluxe')?.base_price || 2800;
  const executivePrice = roomTypes.find(rt => rt.id === 'rt-executive')?.base_price || 3800;

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60000).toISOString().slice(0, 10);

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState(2);
  const [roomType, setRoomType] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      checkIn,
      checkOut,
      adults,
      roomType,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl border border-hotel-200/80">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
          {/* Check-In Date */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-hotel-700" />
              <span>Check-In</span>
            </label>
            <input
              type="date"
              required
              min={today}
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              className="w-full bg-[#faf8f5] hover:bg-white text-xs sm:text-sm font-semibold text-neutral-800 px-3.5 py-2.5 rounded-xl border border-hotel-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-hotel-600 transition"
            />
          </div>

          {/* Check-Out Date */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-hotel-700" />
              <span>Check-Out</span>
            </label>
            <input
              type="date"
              required
              min={checkIn || today}
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              className="w-full bg-[#faf8f5] hover:bg-white text-xs sm:text-sm font-semibold text-neutral-800 px-3.5 py-2.5 rounded-xl border border-hotel-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-hotel-600 transition"
            />
          </div>

          {/* Guests Count */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-hotel-700" />
              <span>Guests</span>
            </label>
            <select
              value={adults}
              onChange={e => setAdults(Number(e.target.value))}
              className="w-full bg-[#faf8f5] hover:bg-white text-xs sm:text-sm font-semibold text-neutral-800 px-3.5 py-2.5 rounded-xl border border-hotel-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-hotel-600 transition cursor-pointer"
            >
              <option value={1}>1 Guest (Solo)</option>
              <option value={2}>2 Guests (Couple)</option>
              <option value={3}>3 Guests (Family)</option>
              <option value={4}>4 Guests (Suite)</option>
            </select>
          </div>

          {/* Room Category */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <BedDouble className="w-3.5 h-3.5 text-hotel-700" />
              <span>Room Type</span>
            </label>
            <select
              value={roomType}
              onChange={e => setRoomType(e.target.value)}
              className="w-full bg-[#faf8f5] hover:bg-white text-xs sm:text-sm font-semibold text-neutral-800 px-3.5 py-2.5 rounded-xl border border-hotel-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-hotel-600 transition cursor-pointer"
            >
              <option value="all">Any Room (16 Rooms)</option>
              <option value="rt-deluxe">Deluxe Room (₹{deluxePrice.toLocaleString('en-IN')})</option>
              <option value="rt-super-deluxe">Super Deluxe (₹{superDeluxePrice.toLocaleString('en-IN')})</option>
              <option value="rt-executive">Executive Suite (₹{executivePrice.toLocaleString('en-IN')})</option>
            </select>
          </div>

          {/* Primary Dominant Conversion Action */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full bg-hotel-700 hover:bg-hotel-800 active:scale-95 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-hotel-700/30 transition flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Check Availability</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
