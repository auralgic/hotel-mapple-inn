import React, { useState } from 'react';
import {
  Wifi,
  Wind,
  Zap,
  ArrowUpDown,
  UtensilsCrossed,
  Car,
  Droplets,
  Sunset,
  Sparkles,
  Bell,
  Flame,
  Plane,
  Plus,
  X,
  Star,
  Quote,
  CheckCircle2,
  Tv,
  Bath,
  Umbrella,
  Newspaper,
  Shirt,
  Train,
  Bus,
  MapPin,
  Languages,
  Luggage,
  Coins,
  Video,
  ShieldAlert,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react';

export const HeroAmenitiesStrip: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // Exactly 12 Amenities laid out in 2 Clean Uniform Rows (6 per row on desktop)
  // Single-line text with small, clean icons just like MakeMyTrip
  const row1Amenities = [
    { name: 'Free Wi-Fi', icon: Wifi },
    { name: 'Air Conditioning', icon: Wind },
    { name: 'Power Backup', icon: Zap },
    { name: 'Elevator / Lift', icon: ArrowUpDown },
    { name: 'Restaurant & Dining', icon: UtensilsCrossed },
    { name: 'Parking (Free - Onsite)', icon: Car },
  ];

  const row2Amenities = [
    { name: '24/7 Hot Water', icon: Droplets },
    { name: 'Rooftop Cafe', icon: Sunset },
    { name: 'Housekeeping', icon: Sparkles },
    { name: 'Room Service', icon: Bell },
    { name: 'Smoking Area', icon: Flame },
    { name: 'Station & Airport Cabs', icon: Plane },
  ];

  // Full Catalog for '+ More' modal
  const fullCatalog = [
    {
      group: 'Popular & Dining',
      items: [
        { name: 'Restaurant & Dining', icon: UtensilsCrossed },
        { name: 'Rooftop Terrace Cafe', icon: Sunset },
        { name: 'Butler Services (Each Floor)', icon: Bell },
        { name: 'Room Service', icon: Bell },
      ],
    },
    {
      group: 'Room Amenities',
      items: [
        { name: 'Air Conditioning (Room Controlled)', icon: Wind },
        { name: '24/7 Geyser / Water Heater', icon: Droplets },
        { name: 'Toiletries (Shampoo, Soap)', icon: Bath },
        { name: 'Air Purifier (Select Rooms)', icon: Sparkles },
        { name: 'LED Smart TV', icon: Tv },
        { name: 'RO Drinking Water', icon: Droplets },
      ],
    },
    {
      group: 'Basic Facilities',
      items: [
        { name: 'Wi-Fi (Free - Speed Suitable for Work)', icon: Wifi },
        { name: 'Power Backup', icon: Zap },
        { name: 'Elevator / Lift', icon: ArrowUpDown },
        { name: 'Housekeeping', icon: CheckCircle2 },
        { name: 'Parking (Free - Onsite)', icon: Car },
        { name: 'Smoking Area', icon: Flame },
        { name: 'Umbrellas', icon: Umbrella },
        { name: 'Newspaper (English & Local)', icon: Newspaper },
        { name: 'Laundry Service (Paid)', icon: Shirt },
      ],
    },
    {
      group: 'Transfers & Services',
      items: [
        { name: 'Airport Transfers (Paid - Private Taxi)', icon: Plane },
        { name: 'Railway Transfers (Paid)', icon: Train },
        { name: 'Bus Station Transfer (Paid)', icon: Bus },
        { name: 'Sightseeing Shuttles', icon: MapPin },
        { name: 'Multilingual Staff', icon: Languages },
        { name: 'Luggage Assistance', icon: Luggage },
        { name: 'Currency Exchange', icon: Coins },
      ],
    },
    {
      group: 'Safety & Security',
      items: [
        { name: 'CCTV Surveillance', icon: Video },
        { name: 'Fire Extinguishers', icon: ShieldAlert },
        { name: 'Security Alarms', icon: ShieldCheck },
        { name: 'First-aid Services', icon: HeartPulse },
      ],
    },
  ];

  return (
    <section className="bg-[#f8f6f0] text-neutral-900 border-y border-[#e6ded2] py-5 sm:py-6 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 w-full">
        {/* Top Mini Header: Title + Rating + More Trigger */}
        <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-[#e6ded2]">
          <div className="flex items-center space-x-2.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-950">
              HOTEL AMENITIES & FACILITIES
            </span>
            <span className="hidden sm:inline-block text-neutral-300">|</span>
            <div className="hidden sm:flex items-center space-x-1 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-200/70">
              <span>4.1</span>
              <Star className="w-2.5 h-2.5 fill-emerald-700 text-emerald-700" />
              <span>Rated by Guests</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="text-xs font-bold text-amber-900 hover:text-amber-700 transition flex items-center space-x-1 cursor-pointer whitespace-nowrap"
          >
            <span>+ 14 More Amenities</span>
            <span className="text-amber-600">→</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MAKEMYTRIP STYLE: EXACTLY 2 CLEAN ROWS WITH SINGLE-LINE TEXT & SMALL ICONS */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#e2d8ca] p-3.5 sm:p-4 shadow-2xs space-y-3">
          {/* Row 1 (6 items on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2.5 items-center">
            {row1Amenities.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex items-center space-x-2 py-1 px-1.5 rounded-none hover:bg-neutral-50 transition group cursor-default"
                >
                  <Icon className="w-4 h-4 text-neutral-500 group-hover:text-amber-800 shrink-0 transition-colors" />
                  <span className="text-xs sm:text-[12.5px] font-medium text-neutral-800 group-hover:text-neutral-950 truncate whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Row 2 (6 items on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2.5 items-center pt-2 border-t border-neutral-100">
            {row2Amenities.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex items-center space-x-2 py-1 px-1.5 rounded-none hover:bg-neutral-50 transition group cursor-default"
                >
                  <Icon className="w-4 h-4 text-neutral-500 group-hover:text-amber-800 shrink-0 transition-colors" />
                  <span className="text-xs sm:text-[12.5px] font-medium text-neutral-800 group-hover:text-neutral-950 truncate whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full Amenities Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-none p-5 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-neutral-300">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 p-1.5 rounded-none hover:bg-neutral-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
              HOTEL MAPPLE INN JAIPUR
            </span>
            <h3 className="text-xl font-bold text-neutral-950 mb-1">
              All Property Facilities & Services
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              Amenities rated 4.1 by guests • 24/7 Front desk assistance
            </p>

            <div className="space-y-5 divide-y divide-neutral-100">
              {fullCatalog.map(cat => (
                <div key={cat.group} className="pt-3.5 first:pt-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2.5">
                    {cat.group}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {cat.items.map(item => {
                      const Icon = item.icon;
                      return (
                        <div key={item.name} className="flex items-center space-x-2 py-1">
                          <Icon className="w-4 h-4 text-neutral-500 shrink-0" />
                          <span className="text-xs text-neutral-800 font-medium">{item.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-200 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-neutral-950 hover:bg-black text-white font-bold px-6 py-2 text-xs uppercase tracking-wider rounded-none"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
