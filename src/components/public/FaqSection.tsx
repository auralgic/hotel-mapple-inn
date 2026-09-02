import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'Rooftop & Terrace',
      q: 'Do resident guests have free access to the open-air skyline rooftop?',
      a: 'Yes! All resident guests enjoy complimentary daily access (06:00 AM to 11:00 PM) to the rooftop terrace for sunrise tea, quiet relaxation, and sunset views over Jaipur. Our upcoming Mapple Sky Cafe will also serve artisanal teas and beverages directly on the terrace.',
    },
    {
      category: 'Check-In & Timings',
      q: 'What are your standard check-in and check-out timings?',
      a: 'Our standard check-in is at 12:00 PM (Noon) and check-out is at 11:00 AM. Early check-in or late check-out can be requested by contacting our front desk directly on WhatsApp at 9680131232.',
    },
    {
      category: 'Location & Transit',
      q: 'How far is the hotel from Mansarovar Metro and Jaipur Railway Station?',
      a: 'We are situated at Plot No. 408-409, Nirman Nagar (Plus Code: VQQ2+3G Jaipur). Mansarovar Metro Station is only 1.8 km (4–5 mins drive), and Jaipur Junction Railway Station is 6.2 km (14–16 mins drive).',
    },
    {
      category: 'In-Room Dining',
      q: 'What kind of meals are available from the in-house kitchen?',
      a: 'Our in-house kitchen prepares fresh authentic Rajasthani platters, North Indian specialties, hot breakfast items, tea/coffee, and snacks from 07:00 AM to 11:00 PM. Custom dietary preferences, Jain food, and continental breakfast arrangements for international guests are happily accommodated upon request.',
    },
    {
      category: 'Direct Booking Privileges',
      q: 'Why should I book directly on this website instead of OTAs?',
      a: 'Direct bookings come with our guaranteed lowest rate (zero OTA commission markups), first priority on room allocation, flexible payment options, and direct WhatsApp concierge support from reception.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white text-neutral-900 border-b border-[#e5ded4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 w-full">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-none text-xs font-semibold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-amber-800 shrink-0" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-neutral-950 leading-tight">
            Everything You Need to Know
          </h2>
          <p className="text-xs sm:text-base text-neutral-600 mt-2 font-normal leading-relaxed">
            Clear, honest answers about our boutique property, rooftop access, dining, and location.
          </p>
        </div>

        {/* Wide FAQ Accordion List (Mobile Fitted) */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={faq.q}
                className="bg-[#fcfaf7] border border-[#e8e2d8] rounded-none overflow-hidden transition shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-[#f7f2ea] transition gap-2"
                >
                  <div className="pr-2 min-w-0">
                    <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block mb-0.5">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-lg font-semibold text-neutral-950 break-words">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-800 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-neutral-700 leading-relaxed border-t border-[#eee8df] bg-white font-normal animate-fadeIn break-words">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
