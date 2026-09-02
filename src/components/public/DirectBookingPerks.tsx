import React from 'react';
import { IndianRupee, MessageSquare, Clock, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Building2 } from 'lucide-react';

interface DirectBookingPerksProps {
  onCheckAvailability: () => void;
}

export const DirectBookingPerks: React.FC<DirectBookingPerksProps> = ({ onCheckAvailability }) => {
  const perks = [
    {
      title: 'Guaranteed Best Rates',
      desc: 'No middleman OTA commissions. Book directly with us for our lowest guaranteed price.',
      icon: IndianRupee,
    },
    {
      title: 'Direct WhatsApp Concierge',
      desc: 'Personal front desk assistance on 9680131232 for check-in timings and special requests.',
      icon: MessageSquare,
    },
    {
      title: 'Priority Room Allocation',
      desc: 'Direct website guests receive first preference on quiet rooms and early check-in.',
      icon: Building2,
    },
    {
      title: 'Zero Hidden Fees & GST Clear',
      desc: 'Completely transparent pricing with room rates and taxes itemized clearly upfront.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#f8f4ec] text-neutral-900 border-b border-[#e2d8ca] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 w-full">
        {/* The Marriott-style "The Best Rates Are Always Here" Container */}
        <div className="bg-white rounded-none p-6 sm:p-12 border border-[#dfd5c7] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 w-full">
          {/* Left Column: Heading & CTAs */}
          <div className="max-w-xl space-y-3 sm:space-y-4 text-center lg:text-left w-full">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">
              OFFICIAL DIRECT RATE GUARANTEE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-950 leading-tight">
              The Best Rates Are Always Here.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              When you reserve directly through our official website or reception, you receive our lowest rate guarantee, priority room selection, and personal hospitality.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3 w-full">
              <button
                onClick={onCheckAvailability}
                className="w-full sm:w-auto bg-neutral-950 hover:bg-amber-700 text-white font-bold py-3 sm:py-3.5 px-6 rounded-none text-xs uppercase tracking-wider transition shadow-md whitespace-nowrap active:scale-95 text-center"
              >
                Claim Direct Rate
              </button>

              <a
                href="https://wa.me/919680131232?text=Hello%20Hotel%20Mapple%20Inn!%20I%20would%20like%20to%20inquire%20about%20direct%20booking%20rates."
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-bold py-3 sm:py-3.5 px-5 rounded-none text-xs transition whitespace-nowrap flex items-center justify-center space-x-1.5 text-center"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: 4 Clean Minimal Feature Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-[#eee8df] pt-6 lg:pt-0 lg:pl-10">
            {perks.map(p => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="space-y-1 sm:max-w-[200px]">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
                  <h4 className="font-semibold text-xs text-neutral-950 leading-tight">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 font-normal leading-normal">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
