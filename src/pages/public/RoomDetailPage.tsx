import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ROOM_CATEGORIES_DATA, RoomCategoryData } from '../../lib/roomCategories';
import { DirectBookingModal } from '../../components/public/DirectBookingModal';
import { formatCurrency } from '../../lib/formatters';
import { useHotelData } from '../../context/HotelDataContext';
import {
  Check,
  CalendarCheck,
  ArrowLeft,
  BedDouble,
  Users,
  ShieldCheck,
  Sparkles,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
} from 'lucide-react';

export const RoomDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { rooms, roomTypes } = useHotelData();

  const room: RoomCategoryData = ROOM_CATEGORIES_DATA.find((r: RoomCategoryData) => r.slug === slug) || ROOM_CATEGORIES_DATA[0];
  const livePrice = rooms.find(r => r.room_type_id === room.id)?.room_type?.base_price || roomTypes.find(rt => rt.id === room.id)?.base_price || room.price;

  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#fbf8f3] text-neutral-900 py-10 pb-24 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/rooms"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Return to All Rooms</span>
          </Link>
        </div>

        {/* Room Header & Rate Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#e2d8ca] gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest">
                {room.floorInfo}
              </span>
              {room.badge && (
                <span className="bg-amber-700 text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-none shadow">
                  {room.badge}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-950">
              {room.name}
            </h1>
            <p className="text-sm text-neutral-600 mt-1 font-normal">{room.tagline}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-left md:text-right">
              <span className="text-[11px] text-neutral-500 block uppercase">Best Direct Rate:</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold text-neutral-950">
                  {formatCurrency(livePrice)}
                </span>
                <span className="text-xs text-neutral-500">/ night</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block">+ 5% GST · Zero OTA commission</span>
            </div>

            <button
              onClick={() => setBookingModalOpen(true)}
              className="bg-neutral-950 hover:bg-amber-700 text-white font-bold py-3.5 px-6 rounded-none text-xs uppercase tracking-wider shadow-md transition flex items-center space-x-2 whitespace-nowrap"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Room</span>
            </button>
          </div>
        </div>

        {/* Photo Gallery Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Main Large Photo */}
          <div className="lg:col-span-8 relative aspect-[16/10] rounded-none overflow-hidden bg-neutral-900 border border-[#e2d8ca]">
            <img
              src={room.images[activePhotoIdx] || room.images[0]}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails & Specs Stack */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {room.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative aspect-[4/3] rounded-none overflow-hidden border-2 transition ${
                    activePhotoIdx === idx ? 'border-amber-700 scale-95' : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Room Dimension Pills */}
            <div className="bg-white p-5 rounded-none border border-[#e2d8ca] space-y-3 text-xs shadow-sm">
              <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">
                ROOM ESSENTIALS
              </span>
              <div className="flex justify-between border-b border-[#eee8df] pb-2">
                <span className="text-neutral-600">Total Dimensions:</span>
                <strong className="text-neutral-950">{room.size}</strong>
              </div>
              <div className="flex justify-between border-b border-[#eee8df] pb-2">
                <span className="text-neutral-600">Max Guests:</span>
                <strong className="text-neutral-950">{room.occupancy}</strong>
              </div>
              <div className="flex justify-between border-b border-[#eee8df] pb-2">
                <span className="text-neutral-600">Bedding Setup:</span>
                <strong className="text-neutral-950">{room.bed}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Assigned Rooms:</span>
                <strong className="text-amber-900">Rooms {room.roomNumbers.join(', ')}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Description & Amenities */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-none border border-[#e2d8ca] space-y-4 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-950">
                About the {room.name}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                {room.description}
              </p>

              <div className="pt-4 border-t border-[#eee8df] grid grid-cols-1 sm:grid-cols-2 gap-3">
                {room.highlights.map((h: string) => (
                  <div key={h} className="flex items-center text-xs text-neutral-700">
                    <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Room Amenities Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-none border border-[#e2d8ca] space-y-4 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-950">
                Included Room Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {room.amenities.map((a: string) => (
                  <div key={a} className="flex items-center text-neutral-700">
                    <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bathroom Specifications */}
            <div className="bg-white p-6 sm:p-8 rounded-none border border-[#e2d8ca] space-y-4 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-950">
                Ensuite Bathroom & Toiletries
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {room.bathroomFeatures.map((b: string) => (
                  <div key={b} className="flex items-center text-neutral-700">
                    <Check className="w-4 h-4 text-amber-700 mr-2 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Direct Booking Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-none border border-[#e2d8ca] shadow-sm space-y-6 sticky top-24">
              <div>
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-widest block mb-1">
                  DIRECT RESERVATION
                </span>
                <h3 className="text-2xl font-semibold text-neutral-950">
                  Reserve This Room
                </h3>
              </div>

              <div className="space-y-3 text-xs text-neutral-700 border-y border-[#eee8df] py-4">
                <div className="flex justify-between">
                  <span>Nightly Rate:</span>
                  <strong className="text-neutral-950">{formatCurrency(room.price)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Applicable GST:</span>
                  <strong className="text-neutral-950">5% (₹{Math.round(room.price * 0.05)})</strong>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>OTA Markup:</span>
                  <span>₹0 (None)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#eee8df] text-sm font-bold text-neutral-950">
                  <span>Estimated Total:</span>
                  <span className="text-amber-900">{formatCurrency(Math.round(room.price * 1.05))}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full bg-neutral-950 hover:bg-amber-700 text-white font-bold py-3.5 rounded-none text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Check Dates & Reserve</span>
                </button>

                <a
                  href={`https://wa.me/919680131232?text=${encodeURIComponent(
                    `Hello Hotel Mapple Inn! I want to book the ${room.name}. Please confirm availability.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-none text-xs flex items-center justify-center space-x-2 transition whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp: 9680131232</span>
                </a>
              </div>

              <div className="text-[11px] text-neutral-500 text-center space-y-1 pt-2 font-normal">
                <span className="flex items-center justify-center text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Instant Direct Confirmation
                </span>
                <span>Free cancellation up to 24h prior to check-in.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DirectBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialParams={{ roomType: room.id }}
      />
    </div>
  );
};
