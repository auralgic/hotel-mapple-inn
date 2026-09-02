import React, { useState } from 'react';
import { Calendar, Users, BedDouble, Search, Sparkles, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';
import { Link } from 'react-router-dom';

interface MarriottHeroProps {
  onSearch: (params: {
    checkIn: string;
    checkOut: string;
    adults: number;
    roomType: string;
  }) => void;
}

export const MarriottHero: React.FC<MarriottHeroProps> = ({ onSearch }) => {
  const { rooms } = useHotelData();
  const availableCount = rooms.filter(r => r.status === 'available').length;

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
    <div className="relative bg-[#0d0d0d] text-white">
      {/* ========================================================================= */}
      {/* 1. TOP SLEEK FLOATING SEARCH BAR (MARRIOTT STYLE) */}
      {/* ========================================================================= */}
      <div className="bg-[#141414] border-b border-neutral-800/80 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-[#1f1f1f] rounded-2xl sm:rounded-full p-2 sm:p-2.5 border border-neutral-700/80 shadow-2xl grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
            {/* Dates Selector */}
            <div className="sm:col-span-4 flex items-center space-x-2.5 px-4 py-2 bg-[#181818] rounded-xl sm:rounded-full border border-neutral-700/50">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex-1 flex items-center space-x-2 text-xs">
                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none w-28 text-xs"
                />
                <span className="text-neutral-500">—</span>
                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none w-28 text-xs"
                />
              </div>
            </div>

            {/* Guests Selector */}
            <div className="sm:col-span-3 flex items-center space-x-2.5 px-4 py-2 bg-[#181818] rounded-xl sm:rounded-full border border-neutral-700/50">
              <Users className="w-4 h-4 text-amber-400 shrink-0" />
              <select
                value={adults}
                onChange={e => setAdults(Number(e.target.value))}
                className="bg-transparent text-white text-xs font-medium focus:outline-none w-full cursor-pointer"
              >
                <option value={1} className="bg-neutral-900 text-white">1 Room, 1 Guest</option>
                <option value={2} className="bg-neutral-900 text-white">1 Room, 2 Guests</option>
                <option value={3} className="bg-neutral-900 text-white">1 Room, 3 Guests</option>
                <option value={4} className="bg-neutral-900 text-white">1 Suite, 4 Guests</option>
              </select>
            </div>

            {/* Room Type Selector */}
            <div className="sm:col-span-3 flex items-center space-x-2.5 px-4 py-2 bg-[#181818] rounded-xl sm:rounded-full border border-neutral-700/50">
              <BedDouble className="w-4 h-4 text-amber-400 shrink-0" />
              <select
                value={roomType}
                onChange={e => setRoomType(e.target.value)}
                className="bg-transparent text-white text-xs font-medium focus:outline-none w-full cursor-pointer"
              >
                <option value="all" className="bg-neutral-900 text-white">All 16 Rooms</option>
                <option value="rt-deluxe" className="bg-neutral-900 text-white">Deluxe (₹2,200)</option>
                <option value="rt-super-deluxe" className="bg-neutral-900 text-white">Super Deluxe (₹2,800)</option>
                <option value="rt-executive" className="bg-neutral-900 text-white">Executive Suite (₹3,800)</option>
              </select>
            </div>

            {/* Dominant Find Rooms CTA */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-white font-bold py-2.5 px-5 rounded-xl sm:rounded-full text-xs uppercase tracking-wider shadow-lg shadow-amber-900/40 transition flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Find Rooms</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FULL-BLEED EDITORIAL HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative min-h-[520px] lg:min-h-[580px] flex items-center overflow-hidden">
        {/* Background Visual with Sunset Warmth */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
            alt="Hotel Mapple Inn Jaipur Luxury Boutique Stay"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/40"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 z-10">
          <div className="max-w-2xl">
            {/* Location Tag */}
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 backdrop-blur border border-amber-400/30 text-amber-300 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>NIRMAN NAGAR • MANSAROVAR • JAIPUR</span>
            </div>

            {/* Editorial Title */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              Your Pink City Sanctuary, Reimagined.
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal mb-8 max-w-xl">
              16 curated boutique rooms across Floors 2 & 3 (Rooms 201–208 & 301–308). Experience pure-veg dining, restful king bedding, and direct best rates.
            </p>

            {/* Direct CTAs */}
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => onSearch({ checkIn, checkOut, adults, roomType })}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-xl shadow-amber-950/60 transition transform active:scale-95 flex items-center space-x-2"
              >
                <span>Check Availability</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/rooms"
                className="bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/25 font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition"
              >
                Explore 16 Rooms
              </Link>
            </div>

            {/* Live Inventory Banner */}
            <div className="mt-8 flex items-center space-x-3 text-xs text-neutral-400 bg-black/50 backdrop-blur px-4 py-2 rounded-xl border border-neutral-800 w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-neutral-300">
                <strong>{availableCount} of 16 Rooms Available Today</strong>
              </span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">Direct Booking Rate Guarantee</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
