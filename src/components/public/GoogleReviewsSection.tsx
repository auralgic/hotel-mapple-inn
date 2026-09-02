import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export const GoogleReviewsSection: React.FC = () => {
  const reviews = [
    {
      author: 'Vikram N.',
      stayType: 'Couple Stay · Deluxe Room',
      rating: 5,
      date: 'August 2026',
      text: 'Super peaceful stay in Nirman Nagar. The room was sparkling clean, the king bed was very comfortable, and the split AC worked quietly. The food from their kitchen was delivered hot and fresh within 15 minutes. Highly recommended for couples visiting Jaipur!',
    },
    {
      author: 'Ananya Verma',
      stayType: 'Business Trip · Super Deluxe Balcony',
      rating: 5,
      date: 'August 2026',
      text: 'Loved the private balcony view and the quiet work desk. Fast Wi-Fi for my Zoom calls. Reserving directly on their website gave me a direct discount and reception answered my WhatsApp queries promptly on 9680131232.',
    },
    {
      author: 'Rohan Mehra & Family',
      stayType: 'Family Stay · Executive Suite',
      rating: 5,
      date: 'July 2026',
      text: 'The Executive Suite was spacious with a separate living room sofa for our kids. Very convenient cab access to Jaipur Junction and Hawa Mahal. Great value and in-room dining thalis were delicious.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#faf6f0] text-neutral-900 border-b border-[#e5ded4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 w-full">
        {/* Header with Google Score */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-2 rounded-none">
              <span>PROVEN GUEST EXPERIENCES</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-neutral-950 leading-tight">
              Stays Worth Talking About
            </h2>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-none border border-[#e5ded4] shadow-sm flex items-center space-x-3 sm:space-x-4 shrink-0 self-start md:self-auto">
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-bold text-amber-800 block leading-none">
                4.6
              </span>
              <span className="text-[9px] sm:text-[10px] text-neutral-500 font-bold uppercase">Out of 5.0</span>
            </div>
            <div className="border-l border-[#e5ded4] pl-3 sm:pl-4">
              <div className="flex items-center space-x-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-600 text-amber-600" />
                ))}
              </div>
              <span className="text-[11px] sm:text-xs text-neutral-700 font-semibold block">Google Verified Rating</span>
            </div>
          </div>
        </div>

        {/* 3 Equal-Height Review Cards on Warm Canvas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {reviews.map(rev => (
            <div
              key={rev.author}
              className="bg-white rounded-none p-5 sm:p-7 border border-[#e8e0d5] shadow-sm card-lift transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-neutral-400">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic mb-5 sm:mb-6 font-normal">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-[#eee8df] flex items-center justify-between mt-auto">
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-neutral-900">{rev.author}</h4>
                  <span className="text-[10px] sm:text-[11px] text-neutral-500 block font-normal">{rev.stayType}</span>
                </div>

                <div className="flex items-center space-x-1 text-[9px] sm:text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 sm:px-2.5 py-1 rounded-none">
                  <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Verified Stay</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
