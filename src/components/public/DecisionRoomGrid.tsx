import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, CalendarCheck, ArrowRight, BedDouble, Users, Eye, Sparkles, HelpCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import { RoomCategoryData, RoomDetailDrawer } from './RoomDetailDrawer';
import { useHotelData } from '../../context/HotelDataContext';
import { ROOM_CATEGORIES_DATA } from '../../lib/roomCategories';

export { ROOM_CATEGORIES_DATA };

export const DecisionRoomGrid: React.FC<{
  onDirectBook: (roomTypeId: string) => void;
  onOpenMatcherQuiz?: () => void;
}> = ({ onDirectBook, onOpenMatcherQuiz }) => {
  const { mediaConfig, rooms, roomTypes } = useHotelData();
  const [selectedDrawerRoom, setSelectedDrawerRoom] = useState<RoomCategoryData | null>(null);

  const deluxePrice = roomTypes.find(rt => rt.id === 'rt-deluxe')?.base_price || rooms.find(r => r.room_type_id === 'rt-deluxe')?.room_type?.base_price || 2200;
  const superDeluxePrice = roomTypes.find(rt => rt.id === 'rt-super-deluxe')?.base_price || rooms.find(r => r.room_type_id === 'rt-super-deluxe')?.room_type?.base_price || 2800;
  const executivePrice = roomTypes.find(rt => rt.id === 'rt-executive')?.base_price || rooms.find(r => r.room_type_id === 'rt-executive')?.room_type?.base_price || 3800;

  const roomCategories: RoomCategoryData[] = [
    {
      id: 'rt-deluxe',
      slug: 'deluxe-room',
      name: 'Deluxe Room',
      tagline: 'Perfect for couples & business travellers',
      price: deluxePrice,
      size: '260 sq ft',
      occupancy: '2 Guests',
      bed: 'King Bed',
      badge: null,
      floorInfo: 'Quiet Courtyard View',
      images: [
        mediaConfig?.deluxeRoomImage || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&h=600&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&h=600&q=80',
      ],
      description: 'Designed for restful stays whether you are visiting Jaipur for work or city exploration. Features plush king bedding, split AC, 43" Smart LED TV, high-speed Wi-Fi, and a spotless ensuite bathroom with 24/7 hot water.',
      highlights: ['King Bed & Fresh Linens', 'Quiet Courtyard Facing', 'Dedicated Work Desk', '24/7 Hot Water Geyser'],
      amenities: ['Split Air Conditioner', '43" Smart LED TV', 'High-Speed Wi-Fi', 'Work Desk & Chair', 'Electric Kettle & Tea Kit', 'RO Filtered Water'],
      bathroomFeatures: ['Rain Shower', '24/7 Hot Water Geyser', 'Fresh Bath Towels', 'Complimentary Toiletries'],
      roomNumbers: ['201', '202', '205', '206', '301', '302'],
    },
    {
      id: 'rt-super-deluxe',
      slug: 'super-deluxe-room',
      name: 'Super Deluxe Balcony Room',
      tagline: 'Spacious layout with scenic private balcony',
      price: superDeluxePrice,
      size: '320 sq ft',
      occupancy: '3 Guests',
      bed: 'King Bed + Extra Mat',
      badge: '★ MOST POPULAR',
      floorInfo: 'Private Open-Air Balcony',
      images: [
        mediaConfig?.superDeluxeImage || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&h=600&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&h=600&q=80',
      ],
      description: 'Our most popular boutique room offers extra square footage, a private open-air balcony overlooking Nirman Nagar, dedicated work desk, tea/coffee maker, and plush sitting lounge.',
      highlights: ['Private Balcony with City View', 'Extra Spacious Seating Lounge', 'King Bed + Extra Mattress Option', 'Express In-Room Dining'],
      amenities: ['Private Balcony', '50" Smart LED TV', 'Tea & Coffee Maker', 'Split Air Conditioner', 'Work Desk & Lounge Chair', 'Digital Wardrobe Safe'],
      bathroomFeatures: ['Glass Shower Area', 'High-Pressure Geyser', 'Premium Toiletries', 'Large Vanity Mirror'],
      roomNumbers: ['203', '204', '207', '208', '303', '304'],
    },
    {
      id: 'rt-executive',
      slug: 'executive-suite',
      name: 'Executive Master Suite',
      tagline: 'Top-floor luxury with separate living lounge',
      price: executivePrice,
      size: '480 sq ft',
      occupancy: '4 Guests',
      bed: 'King Master + Sofa Lounge',
      badge: 'SIGNATURE SUITE',
      floorInfo: 'Living Room + Master Bedroom',
      images: [
        mediaConfig?.executiveSuiteImage || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&h=600&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&h=600&q=80',
      ],
      description: 'The pinnacle of comfort at Hotel Mapple Inn. Features a master bedroom with separate living room, plush fabric sofa set, mini-refrigerator, 2 smart LED TVs, and priority front-desk assistance.',
      highlights: ['Separate Living Room & Sofa Set', 'Mini Refrigerator in Suite', '2x Smart LED TVs', 'Top-Floor Peaceful Position'],
      amenities: ['Living Room + Master Bedroom', 'Mini Refrigerator', '2x Smart LED TVs', 'Plush Sofa Set', 'Split AC in both zones', 'Tea & Coffee Station'],
      bathroomFeatures: ['Luxury Bath Vanity', 'Instant Geyser Hot Water', 'Premium Toiletries & Towels', 'Hairdryer on Request'],
      roomNumbers: ['305', '306', '307', '308'],
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white text-neutral-900 border-b border-[#e5e0d8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 w-full">
        {/* Header with Room Matcher Quiz Hook */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
              CURATED ACCOMMODATION
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-950 leading-tight">
              Compare Our Room Categories
            </h2>
            <p className="text-xs sm:text-base text-neutral-600 mt-2 max-w-xl font-normal">
              All rooms include plush king bedding, attached hot water bathrooms, split AC, fast Wi-Fi, and all-day in-room dining.
            </p>
          </div>

          {onOpenMatcherQuiz && (
            <button
              onClick={onOpenMatcherQuiz}
              className="inline-flex items-center space-x-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 px-4 py-2.5 rounded-none text-xs font-semibold transition shadow-sm whitespace-nowrap self-start md:self-auto shrink-0"
            >
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>Not sure? Take 30-sec Room Quiz →</span>
            </button>
          )}
        </div>

        {/* 3 Equal-Height Decision Cards (Strict Symmetry & Mobile-Friendly) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {roomCategories.map(room => (
            <div
              key={room.id}
              className="bg-[#fcfaf7] rounded-none overflow-hidden border border-[#e8e2d8] hover:border-amber-700 shadow-sm card-lift flex flex-col justify-between h-full group"
            >
              <div className="flex flex-col flex-grow">
                {/* 4:3 Image with Zoom Motion */}
                <div
                  onClick={() => setSelectedDrawerRoom(room)}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 cursor-pointer shrink-0"
                >
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                  {room.badge && (
                    <div className="absolute top-3.5 left-3.5 bg-amber-700 text-white font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-none shadow">
                      {room.badge}
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-xs">
                    <span className="bg-black/70 text-white px-2.5 py-1 text-[11px] rounded-none">
                      {room.size} · {room.occupancy}
                    </span>
                    <span className="bg-black/70 text-amber-300 px-2 py-1 text-[11px] inline-flex items-center space-x-1 font-semibold rounded-none">
                      <Eye className="w-3 h-3" />
                      <span>Quick View</span>
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 sm:p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-neutral-950">
                        {room.name}
                      </h3>
                    </div>
                    <span className="text-[11px] text-amber-800 font-semibold block mb-3">
                      {room.floorInfo}
                    </span>

                    {/* 4 Decision Highlights */}
                    <div className="space-y-2 mb-4 bg-white p-3 sm:p-3.5 border border-[#e8e2d8] rounded-none">
                      {room.highlights.map(h => (
                        <div key={h} className="flex items-center text-xs text-neutral-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
                          <span className="break-words">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dedicated Page Link */}
                  <div className="pt-2">
                    <Link
                      to={`/rooms/${room.slug}`}
                      className="text-xs text-neutral-600 hover:text-amber-800 font-semibold inline-flex items-center space-x-1"
                    >
                      <span>Explore full room details & photos</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Price & Decision Action (Pinned to Bottom & Mobile-Safe) */}
              <div className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4 shrink-0 mt-auto">
                <div className="pt-3 border-t border-[#e8e2d8] flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-neutral-500 block font-medium">Guaranteed Direct Rate:</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-xl sm:text-2xl font-bold text-neutral-950">
                        {formatCurrency(room.price)}
                      </span>
                      <span className="text-xs text-neutral-500 font-sans">/ night</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">+ 5% GST · Zero booking fee</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => setSelectedDrawerRoom(room)}
                    className="bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-semibold py-2.5 sm:py-3 px-2 rounded-none text-[11px] sm:text-xs uppercase tracking-wider transition text-center whitespace-nowrap"
                  >
                    View Specs
                  </button>

                  <button
                    type="button"
                    onClick={() => onDirectBook(room.id)}
                    className="bg-neutral-950 hover:bg-amber-700 text-white font-bold py-2.5 sm:py-3 px-2 rounded-none text-[11px] sm:text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center space-x-1 whitespace-nowrap"
                  >
                    <span>Book Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide-over interactive room drawer */}
      <RoomDetailDrawer
        isOpen={!!selectedDrawerRoom}
        onClose={() => setSelectedDrawerRoom(null)}
        room={selectedDrawerRoom}
        onBookNow={roomTypeId => {
          setSelectedDrawerRoom(null);
          onDirectBook(roomTypeId);
        }}
      />
    </section>
  );
};
