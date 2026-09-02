import React from 'react';
import { MapPin, Navigation, Phone, Train, Plane, Clock, ShieldCheck } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';

export const LocationSection: React.FC = () => {
  const { settings } = useHotelData();

  const transitPoints = [
    {
      title: 'Mansarovar Metro Station',
      distance: '~2.0 km',
      time: '5 mins drive',
      detail: 'Direct rapid transit line to Central Jaipur & Railway Station.',
      icon: Train,
    },
    {
      title: 'Jaipur Junction Railway Station',
      distance: '~6.5 km',
      time: '15 mins drive',
      detail: 'Main railway hub with express trains from Delhi, Mumbai & Ahmedabad.',
      icon: Train,
    },
    {
      title: 'Jaipur International Airport (JAI)',
      distance: '~11.0 km',
      time: '25 mins drive',
      detail: 'Convenient direct cab route via Tonk Road / Jawahar Circle.',
      icon: Plane,
    },
    {
      title: 'Hawa Mahal & Historic Pink City',
      distance: '~9.5 km',
      time: '22 mins drive',
      detail: 'City Palace, Jantar Mantar, and famous Johari / Bapu Bazaars.',
      icon: MapPin,
    },
  ];

  return (
    <section className="py-20 bg-[#faf8f5] border-t border-hotel-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Address & Transit Timings */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-hotel-700 uppercase tracking-widest block mb-2">
                Strategic Location
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
                Jaipur, With Everything Within Reach
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-3 leading-relaxed">
                Located in the quiet and well-connected neighbourhood of <strong>Nirman Nagar, Mansarovar</strong>. Enjoy peaceful night rests away from tourist noise while staying minutes from key transit hubs.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-hotel-200 shadow-sm space-y-3">
              <div className="flex items-start space-x-3 text-xs">
                <MapPin className="w-5 h-5 text-hotel-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm">Hotel Physical Address</h4>
                  <p className="text-neutral-600 mt-0.5 leading-relaxed">{settings.address}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    'Hotel Mapple Inn Plot 408-409 Nirman Nagar Mansarovar Jaipur'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 bg-hotel-700 hover:bg-hotel-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                </a>

                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center space-x-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  <Phone className="w-3.5 h-3.5 text-hotel-700" />
                  <span>Call for Directions</span>
                </a>
              </div>
            </div>

            {/* Transit Points Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {transitPoints.map(point => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="bg-white p-4 rounded-2xl border border-hotel-200 shadow-sm text-xs">
                    <div className="flex items-center space-x-2 font-bold text-neutral-900 mb-1">
                      <Icon className="w-4 h-4 text-hotel-700 shrink-0" />
                      <span>{point.title}</span>
                    </div>
                    <div className="text-hotel-800 font-extrabold text-xs mb-1">
                      {point.distance} • {point.time}
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-tight">{point.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Map Card */}
          <div className="lg:col-span-6">
            <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-hotel-400 uppercase tracking-wider">
                  Mansarovar • Nirman Nagar
                </span>
                <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                  Safe & Peaceful Locality
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3">
                Effortless City Navigation
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-6">
                Direct cabs (Ola/Uber) and autos are available 24/7 right outside the hotel gate. Reception can also arrange airport/railway station drop-offs upon advance request.
              </p>

              <div className="bg-neutral-800/80 rounded-2xl p-4 border border-neutral-700 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-300">
                  <span>Front Desk Assistance</span>
                  <strong className="text-white">24 Hours / 7 Days</strong>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Parking Facility</span>
                  <strong className="text-white">On-site Street & Valet</strong>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Local Dining & Markets</span>
                  <strong className="text-white">Walking Distance</strong>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
                <span className="text-xs text-hotel-400 font-semibold">
                  Plot No. 408-409, Nirman Nagar, Mansarovar, Jaipur 302020
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
