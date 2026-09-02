import React, { useState } from 'react';
import { Navigation, Train, Plane, MapPin, Clock, ExternalLink, ShieldCheck, Compass } from 'lucide-react';

interface TransitDestination {
  id: string;
  name: string;
  category: 'transit' | 'heritage' | 'shopping';
  distance: string;
  duration: string;
  bestRoute: string;
  tip: string;
  icon: typeof Train;
}

export const InteractiveTransitMap: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('metro');

  const destinations: TransitDestination[] = [
    {
      id: 'metro',
      name: 'Mansarovar Metro Station',
      category: 'transit',
      distance: '1.8 km',
      duration: '4–5 Mins',
      bestRoute: 'Direct auto-rickshaw or 15-min walk via Nirman Nagar main road',
      tip: 'Connects directly to Jaipur Railway Station, Sindhi Camp, and Chandpole (Old City).',
      icon: Train,
    },
    {
      id: 'railway',
      name: 'Jaipur Junction (Main Railway Station)',
      category: 'transit',
      distance: '6.2 km',
      duration: '14–16 Mins',
      bestRoute: 'Via Ajmer Road or New Sanganer Road',
      tip: 'Ola/Uber and 24/7 prepaid autos readily available outside the station.',
      icon: Train,
    },
    {
      id: 'airport',
      name: 'Jaipur International Airport (JAI)',
      category: 'transit',
      distance: '10.5 km',
      duration: '20–25 Mins',
      bestRoute: 'Via B2 Bypass / Jawahar Circle',
      tip: 'Direct cabs take ~20 mins during non-peak hours. Front desk can arrange early airport drops.',
      icon: Plane,
    },
    {
      id: 'hawa-mahal',
      name: 'Hawa Mahal & City Palace (Old Walled City)',
      category: 'heritage',
      distance: '9.8 km',
      duration: '22–26 Mins',
      bestRoute: 'Via MI Road or Metro to Badi Chaupar',
      tip: 'Take Mansarovar Metro to Chandpole/Badi Chaupar to avoid Old City traffic.',
      icon: Compass,
    },
    {
      id: 'amer',
      name: 'Amer Fort (Amber Palace)',
      category: 'heritage',
      distance: '18.5 km',
      duration: '38–42 Mins',
      bestRoute: 'Via Jaipur-Delhi Bypass Road',
      tip: 'Best visited early morning (08:00 AM) to experience elephant rides and avoid lines.',
      icon: Compass,
    },
    {
      id: 'bapu-bazar',
      name: 'Bapu & Johari Bazaar (Handicrafts & Textiles)',
      category: 'shopping',
      distance: '8.5 km',
      duration: '18–22 Mins',
      bestRoute: 'Via Ajmer Road & MI Road',
      tip: 'Renowned for Jaipuri quilts (Razai), block prints, juttis, and silver jewelry.',
      icon: MapPin,
    },
  ];

  const activeDest = destinations.find(d => d.id === selectedId) || destinations[0];

  return (
    <section className="py-16 sm:py-24 bg-white text-neutral-900 border-b border-[#e5ded4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 w-full">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
            LOCATION & CONNECTIVITY
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-neutral-950 leading-tight">
            Explore Jaipur with Effortless Transit
          </h2>
          <p className="text-xs sm:text-base text-neutral-600 mt-2 font-normal leading-relaxed">
            Situated in quiet Nirman Nagar, Mansarovar (Plus Code: <strong>VQQ2+3G Jaipur</strong>). Select any destination to see accurate distance, commute duration, and transit tips.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left Column: Interactive Destination Selector List */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
            {destinations.map(dest => {
              const isSelected = dest.id === selectedId;
              const Icon = dest.icon;

              return (
                <div
                  key={dest.id}
                  onClick={() => setSelectedId(dest.id)}
                  className={`p-3.5 sm:p-4 rounded-none cursor-pointer border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-md'
                      : 'bg-[#fcfaf7] text-neutral-800 border-[#e8e2d8] hover:border-amber-700 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-amber-600 text-white' : 'bg-[#eee8df] text-neutral-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-xs sm:text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-neutral-950'}`}>
                        {dest.name}
                      </h4>
                      <span className={`text-[10px] sm:text-[11px] block truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {dest.bestRoute}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs sm:text-sm font-bold block ${isSelected ? 'text-amber-300' : 'text-amber-800'}`}>
                      {dest.duration}
                    </span>
                    <span className={`text-[10px] block ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {dest.distance}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Destination Card + Google Map Embed */}
          <div className="lg:col-span-7 bg-[#faf6f0] p-4 sm:p-8 rounded-none border border-[#dfd5c7] flex flex-col justify-between shadow-sm">
            <div>
              {/* Selected Destination Highlights Box */}
              <div className="bg-white p-4 sm:p-6 rounded-none border border-[#e2d8ca] mb-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block mb-0.5">
                      ROUTE FROM HOTEL MAPPLE INN (NIRMAN NAGAR)
                    </span>
                    <h3 className="text-lg sm:text-2xl font-semibold text-neutral-950">
                      {activeDest.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 bg-amber-100 px-3 py-1.5 rounded-none text-xs font-bold text-amber-900">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{activeDest.duration} ({activeDest.distance})</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed mb-3 font-normal">
                  <strong>Recommended Route:</strong> {activeDest.bestRoute}
                </p>

                <div className="bg-[#faf8f5] p-3 rounded-none border border-[#eee8df] text-[11px] sm:text-xs text-neutral-600">
                  <strong className="text-neutral-950 font-semibold">Local Tip:</strong> {activeDest.tip}
                </div>
              </div>

              {/* Exact Google Map Embed querying Hotel Mapple Inn */}
              <div className="relative aspect-[16/9] w-full rounded-none overflow-hidden border border-[#dfd5c7] shadow-sm bg-neutral-900">
                <iframe
                  title="Hotel Mapple Inn Google Map Embed"
                  src="https://maps.google.com/maps?q=Hotel+Mapple+Inn,+Plot+408-409,+Nirman+Nagar,+Mansarovar,+Jaipur&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Direct Google Maps Action Link */}
            <div className="mt-4 pt-4 border-t border-[#dfd5c7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-neutral-600 font-medium text-center sm:text-left">
                Plot No. 408-409, Nirman Nagar, Mansarovar, Jaipur
              </span>

              <a
                href="https://maps.app.goo.gl/FzFGvvPQ7QwDAWKk8"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto text-center bg-neutral-950 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-none uppercase tracking-wider text-[11px] transition inline-flex items-center justify-center space-x-1.5 whitespace-nowrap"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
