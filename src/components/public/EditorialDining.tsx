import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ArrowRight, Sparkles, Clock, CheckCircle2, HeartHandshake } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import { useHotelData } from '../../context/HotelDataContext';

export const EditorialDining: React.FC = () => {
  const { mediaConfig } = useHotelData();

  const sideDishes = [
    {
      name: 'Paneer Butter Masala & Tandoori Roti',
      category: 'North Indian Specialty',
      price: 280,
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a30536?w=400&h=300&fit=crop',
      desc: 'Plush cottage cheese in a rich, buttery tomato gravy served piping hot with fresh breads.',
    },
    {
      name: 'Slow-Cooked Dal Makhani',
      category: 'Traditional Delicacy',
      price: 190,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      desc: 'Black lentils slow-simmered overnight with mild spices, butter, and rich cream.',
    },
    {
      name: 'Fresh Ginger Masala Chai & Evening Snacks',
      category: 'Hot Beverages & Bites',
      price: 30,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
      desc: 'Aromatic tea hand-brewed with fresh crushed ginger and cardamom paired with warm crisp snacks.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#fbf8f3] text-neutral-900 border-b border-[#e5ded4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4 sm:gap-6">
          <div>
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
              FRESH IN-HOUSE KITCHEN & ALL-DAY DINING
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-neutral-950 leading-tight">
              Flavors of Jaipur, Served Hot to Your Room
            </h2>
            <p className="text-xs sm:text-base text-neutral-600 mt-2 max-w-2xl font-normal leading-relaxed">
              Prepared fresh to order in our dedicated in-house kitchen. From authentic Rajasthani platters and North Indian specialties to breakfast favorites, delivered hot from 07:00 AM to 11:00 PM.
            </p>
          </div>

          <Link
            to="/order"
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-800 hover:text-amber-950 transition whitespace-nowrap self-start md:self-auto shrink-0"
          >
            <span>View Full Menu (30+ Items)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Editorial Layout with Matching Left and Right Heights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left: Large Hero Feature Card */}
          <div className="lg:col-span-7 bg-white rounded-none overflow-hidden border border-[#e2d8ca] flex flex-col justify-between group shadow-sm card-lift h-full">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900 shrink-0">
              <img
                src={mediaConfig?.diningThaliUrl || 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80'}
                alt="MappleInn Royal Special Thali"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              <div className="absolute top-3.5 left-3.5 bg-amber-700 text-white font-bold text-[11px] sm:text-xs uppercase px-3 py-1 rounded-none shadow">
                Chef's Signature Platter
              </div>
              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                <span className="text-[11px] sm:text-xs text-amber-300 font-semibold uppercase tracking-wider block mb-0.5">
                  Authentic Rajasthani & North Indian Feast
                </span>
                <h3 className="text-xl sm:text-3xl font-semibold text-white">
                  MappleInn Royal Special Platter
                </h3>
              </div>
            </div>

            <div className="p-5 sm:p-8 flex flex-col justify-between flex-grow bg-white">
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-5 sm:mb-6 font-normal">
                A rich culinary experience: Shahi Paneer, Slow-Cooked Dal Makhani, Boondi Raita, Jeera Rice, 4 Butter Tandoori Rotis, Sweet Gulab Jamun, Roasted Papad, and Crisp Farm Salad.
              </p>

              <div className="pt-4 border-t border-[#eee8df] flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[10px] text-neutral-500 block uppercase font-semibold">Special Direct Price:</span>
                  <span className="text-xl sm:text-2xl font-bold text-neutral-950">₹300</span>
                </div>
                <Link
                  to="/order"
                  className="bg-neutral-950 hover:bg-amber-700 text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-none text-xs uppercase tracking-wider transition whitespace-nowrap"
                >
                  Order to Room →
                </Link>
              </div>
            </div>
          </div>

          {/* Right: 3 Smaller Editorial Dishes Stack + Reassurance Card */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3.5 sm:gap-4 h-full">
            {sideDishes.map(dish => (
              <div
                key={dish.name}
                className="bg-white rounded-none p-3.5 sm:p-4 border border-[#e2d8ca] flex items-center space-x-3 sm:space-x-4 hover:border-amber-700 card-lift transition flex-1"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-none overflow-hidden shrink-0 bg-neutral-900">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">
                    {dish.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-950 truncate">
                    {dish.name}
                  </h4>
                  <p className="text-[11px] text-neutral-600 line-clamp-1 mt-0.5 font-normal">
                    {dish.desc}
                  </p>
                  <span className="font-bold text-xs sm:text-sm text-neutral-950 block mt-1">
                    {formatCurrency(dish.price)}
                  </span>
                </div>
              </div>
            ))}

            {/* In-House Dining Reassurance for All Guests */}
            <div className="bg-[#f5ede2] p-3.5 sm:p-4 rounded-none border border-[#e2d5c3] text-xs text-neutral-900 flex items-center space-x-3 shrink-0">
              <HeartHandshake className="w-5 h-5 text-amber-800 shrink-0" />
              <span className="font-normal text-[11px] sm:text-[11.5px] leading-relaxed">
                <strong>Personalized Hospitality:</strong> Custom meal requests, Jain food, and continental breakfast arrangements available on request.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
