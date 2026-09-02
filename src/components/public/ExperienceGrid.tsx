import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BedDouble, Sunset, Utensils, MapPin, Coffee, Sparkles } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';

export const ExperienceGrid: React.FC<{ onBookNow: (roomTypeId?: string) => void }> = ({ onBookNow }) => {
  const { mediaConfig } = useHotelData();
  const [activeTab, setActiveTab] = useState<'all' | 'rooms' | 'rooftop' | 'dining' | 'transit'>('all');

  const cards = [
    {
      id: 'deluxe',
      category: 'rooms',
      title: 'Deluxe King Rooms',
      subtitle: 'Plush King Bed, Quiet Courtyard Facing & High-Speed Wi-Fi',
      image: mediaConfig?.deluxeRoomImage || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=85',
      badge: 'COUPLES & BUSINESS',
      link: '/rooms/deluxe-room',
      roomTypeId: 'rt-deluxe',
      colSpan: 'lg:col-span-6',
      height: 'h-80',
    },
    {
      id: 'super-deluxe',
      category: 'rooms',
      title: 'Super Deluxe Balcony Rooms',
      subtitle: 'Private Open-Air Balcony with Scenic Views of Nirman Nagar',
      image: mediaConfig?.superDeluxeImage || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85',
      badge: 'GUEST FAVOURITE',
      link: '/rooms/super-deluxe-room',
      roomTypeId: 'rt-super-deluxe',
      colSpan: 'lg:col-span-6',
      height: 'h-80',
    },
    {
      id: 'rooftop',
      category: 'rooftop',
      title: 'Open-Air Skyline Sunset Terrace',
      subtitle: 'Evening breezes and panoramic amber skyline views over Jaipur',
      image: mediaConfig?.rooftopSunsetUrl || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=85',
      badge: 'SIGNATURE EXPERIENCE',
      link: '/#rooftop',
      colSpan: 'lg:col-span-4',
      height: 'h-72',
    },
    {
      id: 'suite',
      category: 'rooms',
      title: 'Executive Master Suite',
      subtitle: 'Separate living room, plush sofa lounge & mini refrigerator',
      image: mediaConfig?.executiveSuiteImage || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85',
      badge: 'PREMIUM SUITE',
      link: '/rooms/executive-suite',
      roomTypeId: 'rt-executive',
      colSpan: 'lg:col-span-4',
      height: 'h-72',
    },
    {
      id: 'dining',
      category: 'dining',
      title: 'Fresh In-House Kitchen & Dining',
      subtitle: 'Authentic Rajasthani platters, North Indian specialties & breakfast',
      image: mediaConfig?.diningThaliUrl || 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=85',
      badge: 'ALL-DAY DINING',
      link: '/order',
      colSpan: 'lg:col-span-4',
      height: 'h-72',
    },
    {
      id: 'transit-metro',
      category: 'transit',
      title: 'Mansarovar Metro (1.8 km / 4 Mins)',
      subtitle: 'Rapid transit connection to Jaipur city line & heritage palaces',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=85',
      badge: 'RAPID TRANSIT',
      link: '/contact',
      colSpan: 'lg:col-span-6',
      height: 'h-64',
    },
    {
      id: 'transit-station',
      category: 'transit',
      title: 'Jaipur Junction (6.2 km / 15 Mins)',
      subtitle: 'Effortless cab commute with 24/7 prepaid taxi & auto service',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85',
      badge: 'EASY ACCESS',
      link: '/contact',
      colSpan: 'lg:col-span-6',
      height: 'h-64',
    },
  ];

  const filteredCards = cards.filter(
    c => activeTab === 'all' || c.category === activeTab
  );

  return (
    <section className="py-24 bg-[#141312] text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              DISCOVER HOTEL MAPPLE INN
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">
              Your Jaipur Stay Starts Here
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl font-normal leading-relaxed">
              Explore our boutique rooms and suites, open-air skyline sunset terrace, and fresh in-house kitchen in Nirman Nagar.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 text-xs font-semibold shrink-0">
            {[
              { id: 'all', label: 'All Highlights' },
              { id: 'rooms', label: 'Rooms & Suites' },
              { id: 'rooftop', label: 'Skyline Terrace' },
              { id: 'dining', label: 'In-Room Dining' },
              { id: 'transit', label: 'Transit & Map' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-none transition text-xs whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-neutral-950 font-bold shadow-md'
                    : 'bg-[#1f1e1c] text-neutral-300 hover:text-white border border-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Card Grid Architecture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
          {filteredCards.map(card => (
            <Link
              key={card.id}
              to={card.link}
              className={`relative overflow-hidden rounded-none group cursor-pointer border border-neutral-800 hover:border-amber-500/80 transition-all ${
                activeTab === 'all' && card.colSpan ? card.colSpan : 'col-span-1 sm:col-span-2 lg:col-span-4'
              } ${card.height}`}
            >
              {/* Background Image */}
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

              {/* Top Badge */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-amber-300 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-none border border-white/10">
                {card.badge}
              </div>

              {/* Bottom Text Overlay with Arrow */}
              <div className="absolute inset-x-0 bottom-0 p-5 text-white flex items-end justify-between">
                <div className="max-w-md pr-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-amber-200 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-neutral-300 line-clamp-1 mt-1 font-normal">
                    {card.subtitle}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-none bg-white/20 group-hover:bg-white group-hover:text-neutral-950 text-white flex items-center justify-center transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
