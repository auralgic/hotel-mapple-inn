import React from 'react';
import { Sun, Moon, Coffee, Sparkles, Sunset, Wind, Users, ArrowRight } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';

export const RooftopExperience: React.FC = () => {
  const { mediaConfig } = useHotelData();

  const rooftopPillars = [
    {
      title: 'Panoramic Sunset Views',
      desc: 'Watch the Jaipur Pink City sky turn into warm amber and twilight gold from our peaceful rooftop vantage.',
      icon: Sunset,
      gradient: 'from-amber-600 to-rose-700',
    },
    {
      title: 'Upcoming Rooftop Cafe Lounge',
      desc: 'An ambient open-air terrace serving freshly brewed coffees, artisanal teas, refreshing beverages, and warm snacks.',
      icon: Coffee,
      gradient: 'from-orange-600 to-amber-800',
    },
    {
      title: 'Morning Breeze & Peaceful Serenity',
      desc: 'Start your morning with fresh air, quiet city views, hot ginger masala chai, and natural sunlight.',
      icon: Wind,
      gradient: 'from-teal-600 to-emerald-800',
    },
    {
      title: 'Exclusive In-House Atmosphere',
      desc: 'A private retreat reserved for our resident guests away from busy streets and city rush.',
      icon: Moon,
      gradient: 'from-indigo-600 to-purple-800',
    },
  ];

  return (
    <section id="rooftop" className="py-16 sm:py-24 bg-[#f6efe5] text-neutral-900 border-b border-[#e2d5c3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 relative z-10 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4 sm:gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-amber-200/80 text-amber-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3 rounded-none">
              <Sparkles className="w-3.5 h-3.5 text-amber-800 shrink-0" />
              <span>THE SKYLINE EXPERIENCE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-neutral-950 leading-tight">
              Open-Air Skyline Rooftop & Upcoming Cafe
            </h2>
            <p className="text-xs sm:text-base text-neutral-700 mt-2 sm:mt-3 leading-relaxed font-normal">
              Elevate your Jaipur stay. Experience serene morning chai, evening twilight breezes, and panoramic Pink City skyline views from our open terrace.
            </p>
          </div>

          <div className="shrink-0 bg-white p-3.5 sm:p-4 rounded-none border border-[#dfd2bf] flex items-center space-x-3 shadow-sm self-start md:self-auto">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-700 text-white flex items-center justify-center font-bold shrink-0">
              ★
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Resident Guest Access</span>
              <strong className="text-neutral-950 text-xs sm:text-sm font-semibold">Open Daily 06:00 AM – 11:00 PM</strong>
            </div>
          </div>
        </div>

        {/* Hero Visual Card + Feature Grid with Matching Heights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left: Large Cinematic Rooftop Image */}
          <div className="lg:col-span-7 bg-white rounded-none overflow-hidden border border-[#dfd2bf] flex flex-col justify-between group shadow-sm relative card-lift h-full">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900 shrink-0">
              <img
                src={mediaConfig?.rooftopSunsetUrl || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85'}
                alt="Open-Air Rooftop Sunset at Hotel Mapple Inn"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

              <div className="absolute top-3.5 left-3.5 bg-amber-700 text-white font-semibold text-[11px] sm:text-xs uppercase px-3 py-1 rounded-none shadow">
                Sunset & Skyline Lounge
              </div>

              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                <span className="text-[11px] sm:text-xs text-amber-300 font-semibold uppercase tracking-wider block mb-0.5">
                  COMING SOON TO HOTEL MAPPLE INN
                </span>
                <h3 className="text-xl sm:text-3xl font-semibold text-white">
                  The Mapple Sky Cafe & Terrace
                </h3>
              </div>
            </div>

            <div className="p-5 sm:p-8 flex flex-col justify-between flex-grow bg-white">
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-5 sm:mb-6 font-normal">
                Designed as a tranquil sanctuary above Jaipur’s cityscape. Relax with fairy-lit evenings, comfortable lounge seating, freshly brewed coffee, tasty bites, and open sky stargazing.
              </p>

              <div className="pt-4 border-t border-[#eee8df] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto">
                <span className="text-xs text-neutral-500 font-medium">
                  Complimentary access for all hotel guests
                </span>
                <a
                  href="https://wa.me/919680131232?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20the%20Rooftop%20Cafe%20and%20Sunset%20terrace."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto text-center bg-neutral-950 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-none text-xs uppercase tracking-wider transition whitespace-nowrap"
                >
                  Inquire on WhatsApp →
                </a>
              </div>
            </div>
          </div>

          {/* Right: 4 Equal-Height Experience Pillars Stack */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3.5 sm:gap-4 h-full">
            {rooftopPillars.map(pillar => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white rounded-none p-4 sm:p-5 border border-[#dfd2bf] hover:border-amber-700 card-lift transition shadow-sm flex items-start space-x-3 sm:space-x-4 group flex-1"
                >
                  <div className={`w-10 h-10 rounded-none bg-gradient-to-br ${pillar.gradient} text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-neutral-950 mb-0.5 sm:mb-1">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
