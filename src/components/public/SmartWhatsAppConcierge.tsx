import React from 'react';
import { MessageSquare } from 'lucide-react';

export const SmartWhatsAppConcierge: React.FC = () => {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <a
        href="https://wa.me/919680131232?text=Hello%20Hotel%20Mapple%20Inn!%20I%20would%20like%20to%20inquire%20about%20a%20stay."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp with Hotel Mapple Inn Front Desk"
        className="w-13 h-13 sm:w-14 sm:h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-none shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border-2 border-white"
      >
        <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
      </a>
    </div>
  );
};
