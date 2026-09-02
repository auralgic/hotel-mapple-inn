import React, { useState } from 'react';
import { X, Check, CalendarCheck, ShieldCheck, ArrowRight, BedDouble, Users, Maximize, Sparkles, MessageSquare } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import { Link } from 'react-router-dom';
import { RoomCategoryData } from '../../lib/roomCategories';

export type { RoomCategoryData };

interface RoomDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomCategoryData | null;
  onBookNow: (roomTypeId: string) => void;
}

export const RoomDetailDrawer: React.FC<RoomDetailDrawerProps> = ({
  isOpen,
  onClose,
  room,
  onBookNow,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white text-neutral-900 shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-neutral-300">
          {/* Header */}
          <div className="p-6 border-b border-[#e5ded4] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">
                {room.floorInfo}
              </span>
              <h2 className="text-2xl font-semibold text-neutral-950">
                {room.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition rounded-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 space-y-6 flex-grow">
            {/* Main Photo + Thumbnails */}
            <div>
              <div className="relative aspect-[16/10] bg-neutral-900 rounded-none overflow-hidden mb-3 border border-neutral-300">
                <img
                  src={room.images[activePhotoIdx] || room.images[0]}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                {room.badge && (
                  <div className="absolute top-3 left-3 bg-amber-700 text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-none shadow">
                    {room.badge}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {room.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative aspect-[16/10] rounded-none overflow-hidden border-2 transition ${
                      activePhotoIdx === idx ? 'border-amber-700' : 'border-neutral-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Specs Bar */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#fcfaf7] border border-[#e8e2d8] rounded-none text-center">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Room Size</span>
                <strong className="text-sm font-semibold text-neutral-950">{room.size}</strong>
              </div>
              <div className="border-x border-[#e8e2d8]">
                <span className="text-[10px] text-neutral-500 uppercase block">Max Occupancy</span>
                <strong className="text-sm font-semibold text-neutral-950">{room.occupancy}</strong>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Bed Type</span>
                <strong className="text-sm font-semibold text-neutral-950">{room.bed}</strong>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Room Description
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                {room.description}
              </p>
            </div>

            {/* Key Highlights */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Key Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {room.highlights.map(h => (
                  <div key={h} className="flex items-center text-xs text-neutral-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Room Amenities */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Included Amenities
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
                {room.amenities.map(a => (
                  <div key={a} className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-amber-700 mr-2 shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bathroom Features */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Ensuite Bathroom
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
                {room.bathroomFeatures.map(b => (
                  <div key={b} className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-amber-700 mr-2 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Numbers */}
            <div className="p-3.5 bg-[#faf8f5] rounded-none border border-[#e8e2d8] text-xs">
              <span className="text-neutral-500 block mb-0.5 font-medium">Assigned Room Numbers:</span>
              <strong className="text-amber-900">
                Rooms {room.roomNumbers.join(', ')} ({room.floorInfo.split('(')[0].trim()})
              </strong>
            </div>
          </div>

          {/* Fixed Drawer Footer */}
          <div className="p-6 border-t border-[#e5ded4] bg-[#fcfaf7] sticky bottom-0 z-10 space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Direct Guaranteed Rate</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-neutral-950">
                    {formatCurrency(room.price)}
                  </span>
                  <span className="text-xs text-neutral-500">/ night + 5% GST</span>
                </div>
              </div>

              <span className="text-[11px] text-emerald-700 font-semibold flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Zero Booking Fees
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to={`/rooms/${room.slug}`}
                onClick={onClose}
                className="bg-white hover:bg-neutral-100 text-neutral-900 font-semibold py-3 px-3 rounded-none text-xs uppercase tracking-wider border border-neutral-300 transition text-center flex items-center justify-center whitespace-nowrap"
              >
                <span>Full Details</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>

              <button
                type="button"
                onClick={() => onBookNow(room.id)}
                className="bg-neutral-950 hover:bg-amber-700 text-white font-bold py-3 px-3 rounded-none text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center space-x-1.5 whitespace-nowrap"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Reserve Room</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
