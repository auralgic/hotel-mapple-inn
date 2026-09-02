import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';

export const MarriottFooter: React.FC = () => {
  const { mediaConfig } = useHotelData();

  return (
    <footer className="bg-[#121110] text-white border-t border-neutral-800 pt-12 sm:pt-16 pb-12 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 space-y-10 sm:space-y-12 w-full">
        {/* Top 4-Column Grid with Real Map Embed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          {/* Col 1: Brand & Positioning */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-3">
              {mediaConfig?.logoUrl ? (
                <img
                  src={mediaConfig.logoUrl}
                  alt="Hotel Mapple Inn"
                  className="h-9 sm:h-12 w-auto object-contain brightness-0 invert"
                />
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-3 whitespace-nowrap">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-600 text-neutral-950 flex items-center justify-center font-bold text-base sm:text-lg shadow-md rounded-none shrink-0">
                    M
                  </div>
                  <div className="flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap">
                    <span className="font-bold tracking-wider text-base sm:text-xl text-white block leading-tight">
                      HOTEL MAPPLE INN
                    </span>
                    <span className="text-neutral-500 hidden sm:inline">|</span>
                    <span className="text-[10px] tracking-[0.2em] text-amber-400 font-semibold uppercase block">
                      JAIPUR
                    </span>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed font-normal">
              A boutique property in Nirman Nagar, Mansarovar (Plus Code: VQQ2+3G Jaipur), offering quiet residential comfort, open-air skyline rooftop terrace, and personalized hospitality.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
              <a
                href="https://wa.me/919680131232"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3.5 sm:px-4 py-2 text-xs flex items-center space-x-1.5 transition shadow-sm rounded-none whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp: 9680131232</span>
              </a>

              <a
                href="tel:9680131232"
                className="bg-[#1f1e1c] hover:bg-[#2b2926] text-neutral-200 border border-neutral-700 font-semibold px-3 sm:px-3.5 py-2 text-xs transition flex items-center space-x-1.5 rounded-none whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>9680131232</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-2.5 text-xs">
            <span className="font-semibold uppercase tracking-wider text-amber-400 block text-[11px]">
              QUICK EXPLORE
            </span>
            <ul className="space-y-2 text-neutral-400 font-normal">
              <li>
                <Link to="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-white transition">Rooms & Suites</Link>
              </li>
              <li>
                <Link to="/rooms/deluxe-room" className="hover:text-white transition">Deluxe Room</Link>
              </li>
              <li>
                <Link to="/rooms/super-deluxe-room" className="hover:text-white transition">Super Deluxe Balcony</Link>
              </li>
              <li>
                <Link to="/rooms/executive-suite" className="hover:text-white transition">Executive Suite</Link>
              </li>
              <li>
                <Link to="/order" className="hover:text-white transition">In-Room Dining</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact & Location</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Real Property Location & Plus Code */}
          <div className="lg:col-span-3 space-y-2.5 text-xs">
            <span className="font-semibold uppercase tracking-wider text-amber-400 block text-[11px]">
              PROPERTY LOCATION
            </span>
            <div className="text-neutral-300 space-y-2 font-normal">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="break-words">
                  Plot No. 408-409, Nirman Nagar, Mansarovar, Jaipur, Rajasthan - 302020
                </span>
              </p>
              <div className="bg-[#1a1816] p-2.5 rounded-none border border-neutral-800 text-[11px] text-amber-300">
                <strong>Google Plus Code:</strong> VQQ2+3G Jaipur, Rajasthan
              </div>
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>+91 96801 31232</span>
              </p>
            </div>

            <div className="pt-1 text-[11px] text-neutral-400 space-y-1 font-normal">
              <div>• Mansarovar Metro: <strong>1.8 km (4–5 mins)</strong></div>
              <div>• Jaipur Junction: <strong>6.2 km (15 mins)</strong></div>
              <div>• Jaipur Airport (JAI): <strong>10.5 km (22 mins)</strong></div>
            </div>
          </div>

          {/* Col 4: Google Maps Live Embed */}
          <div className="lg:col-span-3 space-y-2.5">
            <span className="font-semibold uppercase tracking-wider text-amber-400 block text-[11px]">
              HOTEL MAPPLE INN (PIN LOCATION)
            </span>

            <div className="rounded-none overflow-hidden border border-neutral-800 aspect-[4/3] w-full bg-neutral-900 shadow-md">
              <iframe
                title="Hotel Mapple Inn Jaipur Map Footer"
                src="https://maps.google.com/maps?q=Hotel+Mapple+Inn,+Plot+408-409,+Nirman+Nagar,+Mansarovar,+Jaipur&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <a
              href="https://maps.app.goo.gl/FzFGvvPQ7QwDAWKk8"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition whitespace-nowrap"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions to Hotel Mapple Inn</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-6 sm:pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-neutral-400 gap-3 font-normal text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Hotel Mapple Inn, Jaipur (Plus Code: VQQ2+3G). All rights reserved.
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link to="/contact" className="hover:text-white transition">Reception Help</Link>
            <span>•</span>
            <Link to="/order" className="hover:text-white transition">In-Room Dining</Link>
            <span>•</span>
            <a href="https://maps.app.goo.gl/FzFGvvPQ7QwDAWKk8" target="_blank" rel="noreferrer" className="hover:text-white transition">
              Google Maps Pin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
