import React from 'react';
import { BedDouble, MapPin, Utensils, ShieldCheck } from 'lucide-react';

export const BrandPromise: React.FC = () => {
  const proofPoints = [
    {
      title: 'Boutique Comfort & Suites',
      desc: 'Spacious layouts with plush king bedding, split AC, and peaceful residential surroundings for deep rest.',
      icon: BedDouble,
      iconGradient: 'from-amber-600 to-amber-800',
    },
    {
      title: 'Peaceful Nirman Nagar',
      desc: 'A calm residential locality with fast 4–15 min connectivity to Mansarovar Metro and Jaipur Junction.',
      icon: MapPin,
      iconGradient: 'from-amber-700 to-orange-800',
    },
    {
      title: 'Fresh In-House Dining',
      desc: 'Authentic local flavors, comfort meals, and continental breakfast prepared fresh and delivered hot to your room.',
      icon: Utensils,
      iconGradient: 'from-emerald-700 to-teal-800',
    },
    {
      title: 'Direct Booking Privileges',
      desc: 'Guaranteed lowest rate with zero commission markups, priority room allocation, and direct WhatsApp concierge.',
      icon: ShieldCheck,
      iconGradient: 'from-amber-700 to-yellow-800',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#f5ede2] text-neutral-900 border-y border-[#e2d5c3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 w-full">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
            WHY GUESTS CHOOSE HOTEL MAPPLE INN
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-neutral-950 leading-tight mb-3 sm:mb-4">
            Stay somewhere that feels like Jaipur — peaceful, warm & well-connected.
          </h2>
          <p className="text-xs sm:text-base text-neutral-700 font-normal leading-relaxed">
            A boutique hospitality retreat in Nirman Nagar, Mansarovar, crafted around restful bedrooms, seamless city travel, and genuine Rajasthani care.
          </p>
        </div>

        {/* 4 Crisp Proof Pillars (Mobile-Friendly & Equal Height) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
          {proofPoints.map(point => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="bg-white rounded-none p-5 sm:p-7 border border-[#dfd2bf] hover:border-amber-700 shadow-sm card-lift flex flex-col justify-between group h-full"
              >
                <div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-none bg-gradient-to-br ${point.iconGradient} text-white flex items-center justify-center mb-4 sm:mb-5 shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-neutral-950 mb-1.5 sm:mb-2">
                    {point.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                    {point.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
