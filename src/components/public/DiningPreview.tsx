import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ArrowRight, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import { useHotelData } from '../../context/HotelDataContext';

export const DiningPreview: React.FC = () => {
  const { settings } = useHotelData();

  const signatureDishes = [
    {
      id: 'th4',
      name: 'MappleInn Royal Special Thali',
      category: 'Thalis & Combos',
      price: 300,
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop',
      tag: "Chef's Signature",
      desc: 'Paneer Sabji + Dal Makhani + Boondi Raita + Jeera Rice + 4 Butter Roti + Sweet Gulab Jamun + Papad.',
    },
    {
      id: 'p3',
      name: 'Spicy Paneer Pizza',
      category: 'Pizza & Pasta',
      price: 280,
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a30536?w=400&h=300&fit=crop',
      tag: 'Guest Favourite',
      desc: 'Spicy marinated paneer cubes, crisp capsicum, jalapeños, onions and melted mozzarella cheese.',
    },
    {
      id: 'd3',
      name: 'Dal Makhani',
      category: 'Dal & Lentils',
      price: 190,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      tag: 'Slow-Cooked',
      desc: 'Black lentils slow-cooked overnight with creamy butter, rich cream and authentic traditional spices.',
    },
    {
      id: 'bev1',
      name: 'Special Masala Chai',
      category: 'Beverages',
      price: 30,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
      tag: 'Freshly Brewed',
      desc: 'Freshly brewed aromatic tea infused with crushed ginger, cardamom, cloves and whole milk.',
    },
  ];

  return (
    <section className="py-20 bg-[#faf8f5] border-y border-hotel-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <span className="text-xs font-bold text-hotel-700 uppercase tracking-widest block mb-2">
              In-Room Dining
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
              Pure Vegetarian Flavours of Jaipur
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-xl">
              Freshly prepared in our dedicated kitchen and delivered hot to your room. Operating daily from {settings.roomServiceHours}.
            </p>
          </div>

          <Link
            to="/order"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-hotel-800 hover:text-hotel-900 transition"
          >
            <span>Explore Full Digital Menu (30+ Dishes)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Curated Dish Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {signatureDishes.map(dish => (
            <div
              key={dish.id}
              className="bg-white rounded-3xl overflow-hidden border border-hotel-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-neutral-100 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-hotel-800 shadow-sm">
                    {dish.tag}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur p-1 rounded-md shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 block"></span>
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                    {dish.category}
                  </span>
                  <h3 className="font-serif text-base font-bold text-neutral-900 leading-snug mb-2">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {dish.desc}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-neutral-100">
                <span className="text-base font-black text-neutral-900">
                  {formatCurrency(dish.price)}
                </span>

                <Link
                  to={`/order`}
                  className="text-xs font-bold text-hotel-700 hover:text-hotel-900"
                >
                  Order via QR →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pure Veg Assurance Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-hotel-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0"></span>
            <span className="font-medium text-neutral-700">
              <strong>100% Pure Vegetarian Kitchen</strong> — We prepare all meals with hygienic standards, fresh daily produce, and pure desi spices.
            </span>
          </div>
          <Link
            to="/order"
            className="shrink-0 bg-hotel-700 hover:bg-hotel-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
          >
            Open Room Service Menu
          </Link>
        </div>
      </div>
    </section>
  );
};
