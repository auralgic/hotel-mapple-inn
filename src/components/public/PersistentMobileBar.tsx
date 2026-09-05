import React from 'react';
import { CalendarCheck, MessageSquare, Phone } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';

interface PersistentMobileBarProps {
  onOpenBookingModal: () => void;
}

export const PersistentMobileBar: React.FC<PersistentMobileBarProps> = ({ onOpenBookingModal }) => {
  const { roomTypes, rooms } = useHotelData();
  const lowestPrice = Math.min(
    ...roomTypes.map(rt => rt.base_price),
    ...rooms.map(r => r.room_type?.base_price || 2200),
    2200
  );

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#e5ded4] p-2.5 z-40 sm:hidden shadow-2xl mobile-sticky-bar text-neutral-900">
      <div className="flex items-center justify-between gap-2">
        {/* Rate context */}
        <div className="pl-1">
          <span className="text-[10px] text-neutral-500 block uppercase font-semibold leading-none">From</span>
          <span className="font-bold text-sm text-neutral-950 leading-tight">₹{lowestPrice.toLocaleString('en-IN')}</span>
          <span className="text-[9px] text-neutral-500 block leading-none">/ night</span>
        </div>

        <div className="flex items-center space-x-2 flex-grow justify-end">
          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/919680131232"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-none bg-emerald-50 border border-emerald-300 text-emerald-700"
            title="WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>

          {/* Primary Action */}
          <button
            onClick={onOpenBookingModal}
            className="bg-neutral-950 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-none text-xs uppercase tracking-wider shadow-md flex items-center space-x-1.5 active:scale-95 transition whitespace-nowrap"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Select Dates & Book</span>
          </button>
        </div>
      </div>
    </div>
  );
};
