import React from 'react';
import { Link } from 'react-router-dom';
import { Check, CalendarCheck, ArrowRight, BedDouble, Users, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import { useHotelData } from '../../context/HotelDataContext';

interface MarriottRoomGridProps {
  onSelectRoom: (roomTypeId: string) => void;
}

export const MarriottRoomGrid: React.FC<MarriottRoomGridProps> = ({ onSelectRoom }) => {
  const { rooms } = useHotelData();

  const categories = [
    {
      id: 'rt-deluxe',
      name: 'Deluxe Room',
      tagline: 'Refined comfort for solo & business travelers',
      price: 2200,
      size: '22–25 m²',
      occupancy: '2 Guests',
      bed: 'King Size Bed',
      badge: 'POPULAR CHOICE',
      floorInfo: 'Available on Floor 2 & Floor 3',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&h=600&q=80',
      amenities: ['King Bed & Fresh Linens', 'Split AC & Ceiling Fan', '43" Smart LED TV', 'Ensuite Geyser Bathroom', 'High-Speed Wi-Fi'],
      roomsCount: 6,
      roomList: ['201', '202', '205', '206', '301', '302'],
    },
    {
      id: 'rt-super-deluxe',
      name: 'Super Deluxe Balcony Room',
      tagline: 'Spacious layout with private balcony & city view',
      price: 2800,
      size: '28–32 m²',
      occupancy: '3 Guests',
      bed: 'King Bed + Extra Mat',
      badge: '★ GUEST FAVOURITE',
      floorInfo: 'Available on Floor 2 & Floor 3',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&h=600&q=80',
      amenities: ['Private Balcony / Jaipur City View', 'Dedicated Work Desk', 'Tea & Coffee Maker', 'Premium Toiletries', 'High-Speed Wi-Fi'],
      roomsCount: 6,
      roomList: ['203', '204', '207', '208', '303', '304'],
    },
    {
      id: 'rt-executive',
      name: 'Executive Master Suite',
      tagline: 'Top-floor luxury with separate sofa living lounge',
      price: 3800,
      size: '42–46 m²',
      occupancy: '4 Guests',
      bed: 'King Master + Sofa Lounge',
      badge: 'SIGNATURE SUITE',
      floorInfo: 'Exclusive to Floor 3',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&h=600&q=80',
      amenities: ['Master Bedroom + Living Room', 'Plush Fabric Sofa Set', 'Mini Refrigerator', '2x Smart LED TVs', 'Luxury Bath Geyser'],
      roomsCount: 4,
      roomList: ['305', '306', '307', '308'],
    },
  ];

  return (
    <section className="py-20 bg-[#0d0d0d] text-white border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block mb-2">
              ACCOMMODATIONS • 16 BOUTIQUE ROOMS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Curated Comfort Across Floors 2 & 3
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-3 max-w-xl leading-relaxed">
              Designed for peaceful sleep and modern convenience in Nirman Nagar. Rooms 201–208 on Floor 2 and Rooms 301–308 on Floor 3.
            </p>
          </div>

          <Link
            to="/rooms"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition"
          >
            <span>View All Room Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3-Column Luxury Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="bg-[#171717] rounded-3xl overflow-hidden border border-neutral-800 shadow-xl hover:border-neutral-700 transition duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* 4:3 Image Container with Dark Badges */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                  {cat.badge && (
                    <div className="absolute top-3.5 left-3.5 bg-amber-500 text-neutral-950 font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow">
                      {cat.badge}
                    </div>
                  )}

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex justify-between items-end text-xs">
                    <span className="bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] text-neutral-300 font-mono">
                      {cat.floorInfo}
                    </span>
                    <span className="bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] text-amber-300 font-mono">
                      Rooms: {cat.roomList.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-white mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-amber-400/90 font-medium mb-4">{cat.tagline}</p>

                  <div className="flex items-center space-x-3 text-xs text-neutral-400 pb-4 mb-4 border-b border-neutral-800">
                    <span className="font-semibold text-neutral-200">{cat.size}</span>
                    <span>•</span>
                    <span>{cat.occupancy}</span>
                    <span>•</span>
                    <span>{cat.bed}</span>
                  </div>

                  <div className="space-y-2 mb-6">
                    {cat.amenities.map(a => (
                      <div key={a} className="flex items-center text-xs text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Primary CTA */}
              <div className="p-6 pt-0 space-y-4">
                <div className="flex items-baseline justify-between pt-2 border-t border-neutral-800">
                  <div>
                    <span className="text-[11px] text-neutral-500 block">Direct Best Rate:</span>
                    <span className="text-2xl font-black text-white font-mono">
                      {formatCurrency(cat.price)}
                    </span>
                    <span className="text-xs text-neutral-400 font-normal"> / night + 5% GST</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectRoom(cat.id)}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 transition flex items-center justify-center space-x-2"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Reserve {cat.name}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
