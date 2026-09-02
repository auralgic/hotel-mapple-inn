import React from 'react';
import { QrCode, MapPin, BedDouble, Headset, Sparkles, CheckCircle2 } from 'lucide-react';

export const WhyStayWithUs: React.FC = () => {
  const pillars = [
    {
      number: '01',
      title: 'QR Room Service',
      description: 'Scan the dedicated QR code stand in your room, browse the pure veg kitchen menu, order and pay via UPI without waiting on reception calls.',
      icon: QrCode,
      tag: 'Tech-Enabled Convenience',
    },
    {
      number: '02',
      title: 'Prime Jaipur Location',
      description: 'Situated in Nirman Nagar, Mansarovar — just 5 minutes from Mansarovar Metro and within easy reach of Jaipur Junction and Jaipur Airport.',
      icon: MapPin,
      tag: 'Strategic Transit Access',
    },
    {
      number: '03',
      title: 'Pristine Comfort',
      description: '16 well-appointed rooms equipped with plush king beds, split air-conditioning, 43"+ smart LED TV, fast Wi-Fi, and spotless attached washrooms.',
      icon: BedDouble,
      tag: 'Restful Boutique Stay',
    },
    {
      number: '04',
      title: 'Personalized Hospitality',
      description: 'Attentive on-site front desk team and instant WhatsApp concierge support to assist with check-in, local guidance, and stay comfort.',
      icon: Headset,
      tag: '24/7 Front Desk Team',
    },
  ];

  return (
    <section className="py-20 bg-[#fcfaf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-hotel-700 uppercase tracking-widest block mb-2">
            The Mapple Inn Difference
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
            Thoughtful Comfort & Modern Guest Convenience
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-3 font-normal leading-relaxed">
            We focus on what actually matters during your stay in Jaipur — clean comfortable rooms, prompt in-room dining, and authentic hospitality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map(pillar => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="bg-white rounded-3xl p-6 border border-hotel-200/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-serif text-2xl font-bold text-hotel-300 group-hover:text-hotel-700 transition">
                      {pillar.number}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#faf8f5] text-hotel-700 flex items-center justify-center border border-hotel-200/60 group-hover:bg-hotel-700 group-hover:text-white transition">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 mt-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-hotel-700 bg-hotel-50 px-2.5 py-1 rounded-full inline-block">
                    {pillar.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
