import React from 'react';
import { CalendarCheck, MessageSquare, Phone } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';

interface MobileStickyBookingBarProps {
  onOpenBookingModal: () => void;
}

export const MobileStickyBookingBar: React.FC<MobileStickyBookingBarProps> = ({ onOpenBookingModal }) => {
  const { settings } = useHotelData();

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-hotel-200 p-2.5 z-40 sm:hidden shadow-2xl">
      <div className="grid grid-cols-12 gap-2 items-center">
        {/* Call Quick Button */}
        <a
          href={`tel:${settings.phone}`}
          className="col-span-2 flex items-center justify-center p-2.5 rounded-xl border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition"
          title="Call Hotel"
        >
          <Phone className="w-4 h-4 text-hotel-700" />
        </a>

        {/* WhatsApp Quick Button */}
        <a
          href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
            'Hello Hotel Mapple Inn! I would like to check room availability.'
          )}`}
          target="_blank"
          rel="noreferrer"
          className="col-span-3 flex items-center justify-center space-x-1 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs transition"
          title="WhatsApp Hotel"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Chat</span>
        </a>

        {/* Primary Booking CTA */}
        <button
          onClick={onOpenBookingModal}
          className="col-span-7 bg-hotel-700 hover:bg-hotel-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-hotel-700/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Check Availability</span>
        </button>
      </div>
    </div>
  );
};
