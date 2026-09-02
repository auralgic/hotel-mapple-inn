import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, MessageSquare, CalendarCheck, Menu, X } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';

interface MarriottNavbarProps {
  onOpenBookingModal?: () => void;
}

export const MarriottNavbar: React.FC<MarriottNavbarProps> = ({ onOpenBookingModal }) => {
  const { mediaConfig, settings } = useHotelData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Rooms & Suites', path: '/rooms' },
    { label: 'Contact & Location', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e8e2d8] text-neutral-900 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo Branding (Strict Single-Line Horizontal Layout) */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 shrink-0 group whitespace-nowrap min-w-0">
            {mediaConfig?.logoUrl ? (
              <img
                src={mediaConfig.logoUrl}
                alt="Hotel Mapple Inn Jaipur"
                className="h-8 sm:h-12 w-auto object-contain shrink-0"
              />
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3 whitespace-nowrap shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-700 text-white flex items-center justify-center font-bold text-sm sm:text-lg shadow-sm rounded-none shrink-0">
                  M
                </div>
                <div className="flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap">
                  <span className="font-bold tracking-wider text-xs sm:text-lg text-neutral-950 uppercase whitespace-nowrap leading-none">
                    HOTEL MAPPLE INN
                  </span>
                  <span className="text-neutral-300 font-light hidden sm:inline-block">|</span>
                  <span className="text-[10px] sm:text-[11px] tracking-widest text-amber-800 font-semibold uppercase whitespace-nowrap hidden sm:inline-block leading-none">
                    JAIPUR
                  </span>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-neutral-700 whitespace-nowrap shrink-0">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition hover:text-amber-800 py-1 whitespace-nowrap ${
                  location.pathname === link.path ? 'text-amber-800 font-bold border-b-2 border-amber-800' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Stack (Desktop) */}
          <div className="hidden md:flex items-center space-x-4 shrink-0 whitespace-nowrap">
            {/* Direct Phone */}
            <a
              href={`tel:${(settings.phone || '9680131232').replace(/[^0-9+]/g, '')}`}
              className="flex items-center space-x-1.5 text-xs text-neutral-700 hover:text-neutral-950 transition whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="whitespace-nowrap">{settings.phone || '9680131232'}</span>
            </a>

            {/* Direct WhatsApp */}
            <a
              href={`https://wa.me/${(settings.whatsapp || '919680131232').replace(/[^0-9]/g, '')}?text=Hello%20Hotel%20Mapple%20Inn!%20I%20would%20like%20to%20inquire%20about%20a%20stay.`}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 text-xs flex items-center space-x-1.5 transition shadow-sm whitespace-nowrap rounded-none shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">WhatsApp</span>
            </a>

            {/* Primary Action Button */}
            {onOpenBookingModal && (
              <button
                onClick={onOpenBookingModal}
                className="bg-neutral-950 hover:bg-black text-white font-bold px-5 py-2.5 text-xs uppercase tracking-wider shadow-md transition active:scale-95 flex items-center space-x-1.5 whitespace-nowrap rounded-none border border-neutral-950 shrink-0"
              >
                <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Book Direct</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle & Direct Action */}
          <div className="lg:hidden flex items-center space-x-2 shrink-0">
            {onOpenBookingModal && (
              <button
                onClick={onOpenBookingModal}
                className="bg-neutral-950 text-white font-bold px-3 py-1.5 text-[11px] uppercase tracking-wider whitespace-nowrap rounded-none shrink-0"
              >
                Book Direct
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition rounded-none shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#e8e2d8] px-4 pt-2 pb-6 space-y-2 animate-fadeIn w-full">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 text-sm font-semibold rounded-none ${
                location.pathname === link.path
                  ? 'bg-amber-100 text-amber-900 font-bold'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-[#e8e2d8] space-y-2">
            <a
              href="https://wa.me/919680131232"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-emerald-600 text-white font-bold py-2.5 text-xs flex items-center justify-center space-x-2 rounded-none whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>WhatsApp: 9680131232</span>
            </a>

            <a
              href="tel:9680131232"
              className="w-full bg-neutral-100 text-neutral-900 font-bold py-2.5 text-xs flex items-center justify-center space-x-2 border border-neutral-300 rounded-none whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Call: +91 96801 31232</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
