import React from 'react';
import { Star, CheckCircle, Quote, Sparkles } from 'lucide-react';

export const GuestReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: 'rev-1',
      author: 'Vikram Sharma',
      origin: 'New Delhi',
      roomStayed: 'Deluxe Room Stay',
      rating: 5,
      date: 'August 2026',
      review:
        'The QR code room service ordering was super smooth! Scanned the code on our bedside table, ordered food and hot chai, paid via GPay, and it arrived in 15 minutes. Very clean room and polite staff.',
    },
    {
      id: 'rev-2',
      author: 'Ananya Verma',
      origin: 'Mumbai',
      roomStayed: 'Super Deluxe Balcony',
      rating: 5,
      date: 'August 2026',
      review:
        'Great location in Nirman Nagar. Quiet surroundings, comfortable king mattress, and fast Wi-Fi for my remote work calls. The MappleInn Special Thali in room dining was delicious and 100% pure veg.',
    },
    {
      id: 'rev-3',
      author: 'Rohan & Sneha Mehra',
      origin: 'Ahmedabad',
      roomStayed: 'Executive Suite',
      rating: 5,
      date: 'July 2026',
      review:
        'Booked directly on their website and got the best rate. The suite was spacious with a separate sofa lounge. Reception team assisted us with early morning airport transfer. Highly recommended boutique hotel in Jaipur!',
    },
  ];

  return (
    <section className="py-20 bg-[#fcfaf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-hotel-700 uppercase tracking-widest block mb-2">
            Verified Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
            Stays Worth Talking About
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2">
            Read what guests love about staying at Hotel Mapple Inn Jaipur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(rev => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-hotel-200 shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed italic mb-6">
                  "{rev.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">{rev.author}</h4>
                  <span className="text-[11px] text-neutral-500 block">{rev.origin} • {rev.roomStayed}</span>
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
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
