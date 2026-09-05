import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { formatCurrency } from '../../lib/formatters';
import { Check, CalendarCheck, MessageSquare, Phone, BedDouble, Users, ArrowRight } from 'lucide-react';
import { DirectBookingModal } from '../../components/public/DirectBookingModal';
import { PersistentMobileBar } from '../../components/public/PersistentMobileBar';

export const RoomsPage: React.FC = () => {
  const { settings, rooms, roomTypes } = useHotelData();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoomParams, setSelectedRoomParams] = useState<any>(undefined);

  const deluxePrice = rooms.find(r => r.room_type_id === 'rt-deluxe')?.room_type?.base_price || roomTypes.find(rt => rt.id === 'rt-deluxe')?.base_price || 2200;
  const superDeluxePrice = rooms.find(r => r.room_type_id === 'rt-super-deluxe')?.room_type?.base_price || roomTypes.find(rt => rt.id === 'rt-super-deluxe')?.base_price || 2800;
  const executivePrice = rooms.find(r => r.room_type_id === 'rt-executive')?.room_type?.base_price || roomTypes.find(rt => rt.id === 'rt-executive')?.base_price || 3800;

  const roomCategories = [
    {
      id: 'rt-deluxe',
      name: 'Deluxe Room',
      tagline: 'Ideal for solo & business travelers',
      price: deluxePrice,
      size: '22–25 m²',
      occupancy: 'Max 2 Guests',
      bed: 'King Size Bed',
      badge: 'POPULAR CHOICE',
      floorInfo: 'Floor 2 (Rooms 201, 202, 205, 206) & Floor 3 (Rooms 301, 302)',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Our standard Deluxe Room offers a restful haven after exploring Jaipur. Features comfortable king bedding, spotless ensuite bathroom with 24/7 hot water geyser, and high-speed Wi-Fi.',
      amenities: [
        'King Bed with Fresh Linens',
        'Split Air Conditioner & Ceiling Fan',
        '43-inch Smart LED TV',
        'High-Speed Wi-Fi Internet',
        'Ensuite Bathroom with Geyser',
        'Work Desk & Chair',
        'Complimentary RO Filtered Water',
      ],
      roomNumbers: ['201', '202', '205', '206', '301', '302'],
    },
    {
      id: 'rt-super-deluxe',
      name: 'Super Deluxe Room',
      tagline: 'Extra space with scenic private balcony view',
      price: superDeluxePrice,
      size: '28–32 m²',
      occupancy: 'Max 3 Guests',
      bed: 'King Bed + Extra Mat option',
      badge: '★ GUEST FAVOURITE',
      floorInfo: 'Floor 2 (Rooms 203, 204, 207, 208) & Floor 3 (Rooms 303, 304)',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Spacious and elegantly furnished with sitting area, private balcony view, electric tea/coffee maker, premium bath amenities, and comfortable work setup.',
      amenities: [
        'King Bed + Extra Bed Option',
        'Private Balcony / Jaipur City View',
        '50-inch Smart LED TV',
        'Tea & Coffee Electric Kettle',
        'Work Desk & Seating Lounge',
        'Premium Bath Toiletries',
        'Wardrobe Storage & Digital Safe',
      ],
      roomNumbers: ['203', '204', '207', '208', '303', '304'],
    },
    {
      id: 'rt-executive',
      name: 'Executive Suite',
      tagline: 'Top-floor luxury suite with separate living room',
      price: executivePrice,
      size: '42–45 m²',
      occupancy: 'Max 4 Guests',
      bed: 'King Bed + Living Area Sofa Set',
      badge: 'PREMIUM SUITE',
      floorInfo: 'Floor 3 Exclusive (Rooms 305, 306, 307, 308)',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Our top-tier offering features a master bedroom with separate living room, plush sofa set, mini refrigerator, premium bathroom vanity, and express room service.',
      amenities: [
        'Separate Living Room & Master Bedroom',
        'Plush Fabric Sofa Set & Coffee Table',
        'Mini Refrigerator in Room',
        '2 Smart LED TVs (Living + Bed)',
        'Split Air Conditioning in both rooms',
        'Complimentary Tea, Coffee & Snacks Kit',
        'Priority 24/7 Front Desk Assistance',
      ],
      roomNumbers: ['305', '306', '307', '308'],
    },
  ];

  const handleBookRoom = (roomTypeId: string) => {
    setSelectedRoomParams({ roomType: roomTypeId });
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fbf8f3] text-neutral-900 py-12 pb-24 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
            ACCOMMODATION • 16 BOUTIQUE ROOMS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-950 mb-4">
            Curated Rooms for Every Stay
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
            Exactly 16 boutique rooms on Floors 2 & 3 in Nirman Nagar. All rooms feature plush king bedding, split AC, smart TVs, fast Wi-Fi, and 100% pure veg in-room dining.
          </p>
        </div>

        {/* Room Categories Stack (Sharp Rectangular Cards) */}
        <div className="space-y-10">
          {roomCategories.map(room => (
            <div
              key={room.id}
              className="bg-white rounded-none overflow-hidden border border-[#e2d8ca] shadow-sm grid grid-cols-1 lg:grid-cols-12 hover:border-amber-700 transition"
            >
              {/* Room Image */}
              <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto min-h-[280px] bg-neutral-900">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                {room.badge && (
                  <div className="absolute top-4 left-4 bg-amber-700 text-white font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-none shadow">
                    {room.badge}
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/75 text-white px-3 py-1 text-xs rounded-none">
                  {room.floorInfo}
                </div>
              </div>

              {/* Room Body Content & Specs */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                    <div>
                      <h2 className="text-2xl font-semibold text-neutral-950">{room.name}</h2>
                      <span className="text-xs text-amber-800 font-semibold">{room.tagline}</span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-2xl font-bold text-neutral-950">{formatCurrency(room.price)}</span>
                      <span className="text-xs text-neutral-500 block">/ night + 5% GST</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 mb-6 leading-relaxed font-normal">
                    {room.description}
                  </p>

                  <div className="flex items-center space-x-4 text-xs font-semibold text-neutral-700 pb-3 mb-4 border-b border-[#eee8df]">
                    <span className="bg-[#f5ede2] px-2.5 py-1 rounded-none">Size: {room.size}</span>
                    <span className="bg-[#f5ede2] px-2.5 py-1 rounded-none">Occupancy: {room.occupancy}</span>
                    <span className="bg-[#f5ede2] px-2.5 py-1 rounded-none">Bed: {room.bed}</span>
                  </div>

                  <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-3">
                    Included Amenities:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                    {room.amenities.map(amenity => (
                      <div key={amenity} className="flex items-center text-xs text-neutral-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="pt-6 border-t border-[#eee8df] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-neutral-500">
                    Check-In: <strong className="text-neutral-900">12:00 PM</strong> • Check-Out: <strong className="text-neutral-900">11:00 AM</strong>
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <a
                      href={`https://wa.me/919680131232?text=${encodeURIComponent(`Hello Hotel Mapple Inn! I would like to book the ${room.name}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap rounded-none"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => handleBookRoom(room.id)}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-neutral-950 hover:bg-amber-700 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md transition whitespace-nowrap rounded-none"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      <span>Book Room</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PersistentMobileBar onOpenBookingModal={() => setBookingModalOpen(true)} />

      <DirectBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialParams={selectedRoomParams}
      />
    </div>
  );
};
