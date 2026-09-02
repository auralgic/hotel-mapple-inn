import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, MapPin, ShieldCheck, IndianRupee, Clock, MessageSquare, Phone, Train, Plane, ArrowRight, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import { useHotelData } from '../../context/HotelDataContext';

export const MarriottExperience: React.FC = () => {
  const { settings } = useHotelData();

  const diningHighlights = [
    {
      name: 'MappleInn Royal Special Thali',
      price: 300,
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop',
      desc: 'Paneer Sabji + Dal Makhani + Boondi Raita + Jeera Rice + 4 Butter Roti + Gulab Jamun + Papad.',
    },
    {
      name: 'Spicy Paneer Pizza',
      price: 280,
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a30536?w=400&h=300&fit=crop',
      desc: 'Desi style fresh cottage cheese, capsicum, jalapeños, onions and mozzarella.',
    },
    {
      name: 'Dal Makhani (Slow-Cooked)',
      price: 190,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      desc: 'Black lentils simmered overnight with farm-fresh butter, cream and traditional spices.',
    },
    {
      name: 'Special Ginger Masala Chai',
      price: 30,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
      desc: 'Freshly brewed whole-milk tea infused with crushed ginger and aromatic cardamom.',
    },
  ];

  return (
    <div className="bg-[#0d0d0d] text-white">
      {/* ========================================================================= */}
      {/* 1. "THE BEST RATES ARE ALWAYS HERE" DIRECT PRIVILEGES STRIP */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#141414] border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#1c1917] to-[#171717] rounded-3xl p-8 sm:p-10 border border-neutral-700/80 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block mb-2">
                DIRECT RESERVATION PRIVILEGES
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
                The Best Rates Are Always Right Here
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Reserve directly with Hotel Mapple Inn to ensure the lowest direct pricing, direct WhatsApp assistance, priority check-in assignment, and zero booking commissions.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full lg:w-auto">
              <div className="bg-[#111111] p-4 rounded-2xl border border-neutral-800 text-center">
                <IndianRupee className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-white block">Guaranteed Best Rate</span>
                <span className="text-[10px] text-neutral-400">Zero OTA fees</span>
              </div>
              <div className="bg-[#111111] p-4 rounded-2xl border border-neutral-800 text-center">
                <MessageSquare className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-white block">Direct WhatsApp</span>
                <span className="text-[10px] text-neutral-400">Instant response</span>
              </div>
              <div className="bg-[#111111] p-4 rounded-2xl border border-neutral-800 text-center col-span-2 sm:col-span-1">
                <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-white block">Priority Check-In</span>
                <span className="text-[10px] text-neutral-400">12:00 PM standard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PURE VEGETARIAN DINING EXPERIENCE */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block mb-2">
                GASTRONOMY • 100% PURE VEG
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                Authentic Flavours, Prepared Fresh Daily
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl">
                Dedicated in-house pure vegetarian kitchen delivering hot culinary delights directly to your room from {settings.roomServiceHours}.
              </p>
            </div>

            <Link
              to="/order"
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition"
            >
              <span>Explore 30+ Menu Items</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {diningHighlights.map(dish => (
              <div
                key={dish.name}
                className="bg-[#171717] rounded-3xl overflow-hidden border border-neutral-800 shadow-xl flex flex-col justify-between group hover:border-neutral-700 transition"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur p-1 rounded-md">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-base font-bold text-white leading-snug mb-1.5">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {dish.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-neutral-800/80 pt-3 mt-2">
                  <span className="text-base font-black text-white font-mono">
                    {formatCurrency(dish.price)}
                  </span>
                  <Link
                    to="/order"
                    className="text-xs font-bold text-amber-400 hover:text-amber-300"
                  >
                    View Menu →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LOCATION & NIRMAN NAGAR CONNECTIVITY */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#121212] border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block mb-2">
                  JAIPUR TRANSIT & LOCALITY
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                  Quiet Sanctuary in Nirman Nagar, Mansarovar
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 mt-3 leading-relaxed">
                  Enjoy peaceful night rests away from traffic congestion while remaining minutes from Jaipur's vital commercial hubs and sightseeing attractions.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-neutral-800">
                  <div className="flex items-center space-x-2 font-bold text-white mb-1">
                    <Train className="w-4 h-4 text-amber-400" />
                    <span>Mansarovar Metro</span>
                  </div>
                  <span className="text-amber-400 font-extrabold font-mono">~2.0 km • 5 mins</span>
                </div>

                <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-neutral-800">
                  <div className="flex items-center space-x-2 font-bold text-white mb-1">
                    <Train className="w-4 h-4 text-amber-400" />
                    <span>Jaipur Junction</span>
                  </div>
                  <span className="text-amber-400 font-extrabold font-mono">~6.5 km • 15 mins</span>
                </div>

                <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-neutral-800">
                  <div className="flex items-center space-x-2 font-bold text-white mb-1">
                    <Plane className="w-4 h-4 text-amber-400" />
                    <span>Jaipur Airport (JAI)</span>
                  </div>
                  <span className="text-amber-400 font-extrabold font-mono">~11.0 km • 25 mins</span>
                </div>

                <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-neutral-800">
                  <div className="flex items-center space-x-2 font-bold text-white mb-1">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Old Pink City</span>
                  </div>
                  <span className="text-amber-400 font-extrabold font-mono">~9.5 km • 22 mins</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    'Hotel Mapple Inn Plot 408-409 Nirman Nagar Mansarovar Jaipur'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-md"
                >
                  Open in Google Maps
                </a>
                <a
                  href="tel:9680131232"
                  className="bg-[#242424] hover:bg-[#2c2c2c] text-white border border-neutral-700 font-bold px-5 py-2.5 rounded-xl text-xs font-mono transition"
                >
                  Call +91 96801 31232
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#181818] p-6 sm:p-8 rounded-3xl border border-neutral-800 shadow-2xl">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
                VERIFIED PROPERTY ADDRESS
              </span>
              <h3 className="font-serif text-xl font-bold text-white mb-3">
                Plot No. 408-409, Nirman Nagar, Mansarovar, Jaipur 302020
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-6">
                Reception operates 24/7. Cabs (Uber/Ola) and local autos have direct doorstep access at all hours.
              </p>

              <div className="space-y-2 text-xs text-neutral-300 border-t border-neutral-800 pt-4">
                <div className="flex justify-between">
                  <span>Standard Check-In:</span>
                  <strong className="text-white">12:00 PM</strong>
                </div>
                <div className="flex justify-between">
                  <span>Standard Check-Out:</span>
                  <strong className="text-white">11:00 AM</strong>
                </div>
                <div className="flex justify-between">
                  <span>Direct Reservations:</span>
                  <strong className="text-amber-400 font-mono">9680131232</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
