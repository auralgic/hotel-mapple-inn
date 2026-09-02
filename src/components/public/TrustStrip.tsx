import React from 'react';
import { ShieldCheck, Sparkles, BedDouble, Utensils, Star, Award } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';

export const TrustStrip: React.FC = () => {
  const { rooms } = useHotelData();
  const availableRoomsCount = rooms.filter(r => r.status === 'available').length;

  return (
    <section className="bg-white border-y border-hotel-200/80 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center sm:text-left">
          {/* 1. Live Availability */}
          <div className="flex items-center space-x-3 p-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Live Availability
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-neutral-900">
                {availableRoomsCount} of 16 Rooms Available
              </span>
            </div>
          </div>

          {/* 2. Pure Veg Dining */}
          <div className="flex items-center space-x-3 p-2">
            <div className="w-9 h-9 rounded-xl bg-hotel-50 text-hotel-700 flex items-center justify-center shrink-0">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                In-Room Dining
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-neutral-900">
                100% Pure Veg Kitchen
              </span>
            </div>
          </div>

          {/* 3. Boutique Scale */}
          <div className="flex items-center space-x-3 p-2">
            <div className="w-9 h-9 rounded-xl bg-hotel-50 text-hotel-700 flex items-center justify-center shrink-0">
              <BedDouble className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                Property Scale
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-neutral-900">
                16 Rooms Across 4 Floors
              </span>
            </div>
          </div>

          {/* 4. Best Direct Rate */}
          <div className="flex items-center space-x-3 p-2">
            <div className="w-9 h-9 rounded-xl bg-hotel-50 text-hotel-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                Direct Booking
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-neutral-900">
                Best Available Rate
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
