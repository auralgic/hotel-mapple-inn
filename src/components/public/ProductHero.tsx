import React, { useState } from 'react';
import { Calendar, Users, Search, Sparkles, MapPin } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';

interface ProductHeroProps {
  onSearch: (params: {
    checkIn: string;
    checkOut: string;
    adults: number;
    roomType: string;
  }) => void;
}

export const ProductHero: React.FC<ProductHeroProps> = ({ onSearch }) => {
  const { mediaConfig } = useHotelData();

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60000).toISOString().slice(0, 10);

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState(2);
  const [roomType, setRoomType] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ checkIn, checkOut, adults, roomType });
  };

  return (
    <div className="relative bg-[#0d0c0b] text-white overflow-hidden w-full max-w-full">
      {/* ========================================================================= */}
      {/* 1. FULLSCREEN CINEMATIC HERO VIEWPORT CONTAINER */}
      {/* ========================================================================= */}
      <section className="relative min-h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden pt-12 sm:pt-16 lg:pt-20 pb-24 sm:pb-32 lg:pb-38 w-full">
        {/* Ambient Video / Image Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={mediaConfig?.heroImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=85'}
            className="w-full h-full object-cover object-center animate-ambient-drift"
          >
            <source
              src={mediaConfig?.heroVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-hotel-swimming-pool-and-sun-loungers-34320-large.mp4'}
              type="video/mp4"
            />
          </video>

          {/* Film Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/35"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/45"></div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PRO LUXURY SEARCH CAPSULE (POSITIONED LOWER FOR BALANCED RHYTHM) */}
        {/* ========================================================================= */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-10 lg:px-16 w-full animate-search-bar mb-6 sm:mb-8">
          <div className="bg-white text-neutral-900 rounded-none shadow-2xl border border-neutral-200 overflow-hidden w-full">
            <form onSubmit={handleSubmit} className="p-3 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
              {/* Destination Column */}
              <div className="lg:col-span-4 px-3 py-2 border-b sm:border-b-0 sm:border-r border-neutral-200 hover:bg-neutral-50/80 transition">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center space-x-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>DESTINATION</span>
                </label>
                <div className="font-bold text-sm sm:text-base text-neutral-950 truncate">
                  Hotel Mapple Inn
                </div>
                <span className="text-[11px] text-neutral-500 block truncate font-normal">
                  Nirman Nagar, Mansarovar, Jaipur
                </span>
              </div>

              {/* Dates Column (Spacious & Easy to Choose) */}
              <div className="lg:col-span-4 px-3 py-2 border-b sm:border-b-0 sm:border-r border-neutral-200 hover:bg-neutral-50/80 transition">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center space-x-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>CHECK-IN & CHECK-OUT</span>
                </label>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-neutral-900 font-bold">
                  <input
                    type="date"
                    required
                    min={today}
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className="bg-transparent focus:outline-none w-28 text-xs sm:text-sm cursor-pointer font-bold text-neutral-950"
                  />
                  <span className="text-neutral-400 font-light">→</span>
                  <input
                    type="date"
                    required
                    min={checkIn || today}
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className="bg-transparent focus:outline-none w-28 text-xs sm:text-sm cursor-pointer font-bold text-neutral-950"
                  />
                </div>
              </div>

              {/* Guests Column */}
              <div className="lg:col-span-2 px-3 py-2 border-b lg:border-b-0 border-neutral-200 hover:bg-neutral-50/80 transition">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center space-x-1.5 mb-1">
                  <Users className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>GUESTS</span>
                </label>
                <select
                  value={adults}
                  onChange={e => setAdults(Number(e.target.value))}
                  className="bg-transparent text-xs sm:text-sm font-bold text-neutral-950 focus:outline-none w-full cursor-pointer"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>

              {/* Find Rooms Button (Strict 2 Words) */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-neutral-950 hover:bg-amber-700 text-white font-bold py-3.5 sm:py-4 px-4 rounded-none text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center space-x-2 whitespace-nowrap active:scale-95"
                >
                  <Search className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Find Rooms</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. HERO CONTENT (ELEVATED HIGHER UP ON SCREEN) */}
        {/* ========================================================================= */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 w-full animate-hero-fade">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center space-x-2 bg-black/60 backdrop-blur-md border border-white/20 text-neutral-200 px-3.5 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-sm font-semibold uppercase tracking-wider mb-4 rounded-none">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
              <span>NIRMAN NAGAR, JAIPUR · BOUTIQUE HOSPITALITY</span>
            </div>

            {/* Bold Headline with Warm Orange / Amber Sandstone Glow (#f5ede2 / #f59e0b) */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-4 tracking-tight break-words">
              Your Pink City Sanctuary.<br />
              <span className="text-[#f5ede2] text-amber-400/95 inline-block animate-hero-glow">
                Peaceful Stays in Jaipur.
              </span>
            </h1>

            {/* Human, Persuasive Subtext */}
            <p className="text-xs sm:text-base md:text-lg lg:text-xl text-neutral-200 leading-relaxed font-normal max-w-3xl">
              Handcrafted comfort in quiet residential Nirman Nagar — 10–15 minutes from Jaipur Junction & heritage palaces, featuring an open-air skyline sunset terrace, all-day in-room dining, and attentive direct hospitality.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
