import React from 'react';
import { ShieldCheck, IndianRupee, Clock, MessageSquare, CheckCircle2 } from 'lucide-react';

export const WhyBookDirect: React.FC = () => {
  const benefits = [
    {
      title: 'Guaranteed Best Direct Rate',
      desc: 'No middleman OTA commissions. Book directly with us to get the most competitive room price in Jaipur.',
      icon: IndianRupee,
    },
    {
      title: 'Direct Hotel Team Support',
      desc: 'Instant WhatsApp & phone access to our on-site team for special requests, early check-in, or meal preferences.',
      icon: MessageSquare,
    },
    {
      title: 'Flexible Check-In Priority',
      desc: 'Direct website bookings receive first priority room assignment upon arrival at Nirman Nagar.',
      icon: Clock,
    },
    {
      title: 'Zero Hidden Booking Fees',
      desc: 'Transparent pricing with all GST taxes clearly calculated upfront without surprise charges.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-hotel-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-hotel-700 uppercase tracking-widest block mb-1">
            Direct Reservation Advantage
          </span>
          <h2 className="font-serif text-3xl font-bold text-neutral-900">
            Book Direct. Get More.
          </h2>
          <p className="text-xs text-neutral-500 mt-2">
            Why reserving directly with Hotel Mapple Inn gives you the best stay experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(b => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="p-5 rounded-2xl bg-[#faf8f5] border border-hotel-200/80 text-xs">
                <div className="w-10 h-10 rounded-xl bg-white border border-hotel-200 text-hotel-700 flex items-center justify-center mb-3.5 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-neutral-900 mb-1.5">{b.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
