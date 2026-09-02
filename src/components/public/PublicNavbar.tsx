import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hotel, Phone, MessageSquare, Menu, X, CalendarCheck, Utensils } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';

interface PublicNavbarProps {
  onOpenBookingModal?: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onOpenBookingModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useHotelData();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Rooms & Suites', path: '/rooms' },
    { label: 'In-Room Dining', path: '/order' },
    { label: 'Location & Contact', path: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-hotel-200/80 py-2.5'
          : 'bg-[#fcfaf7] border-b border-hotel-200/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo & Boutique Brand Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-hotel-700 flex items-center justify-center text-white shadow-md shadow-hotel-700/20 group-hover:bg-hotel-800 transition">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-neutral-900 block leading-tight">
                {settings.name}
              </span>
              <span className="text-[10px] text-hotel-700 font-semibold tracking-widest uppercase block">
                Nirman Nagar • Mansarovar • Jaipur
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-semibold tracking-wide uppercase transition ${
                    isActive
                      ? 'text-hotel-800 font-bold border-b-2 border-hotel-700 pb-0.5'
                      : 'text-neutral-600 hover:text-hotel-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs (Call, WhatsApp, Primary Booking) */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Hello Hotel Mapple Inn! I would like to check room availability.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl transition"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 transition"
              title="Call Front Desk"
            >
              <Phone className="w-3.5 h-3.5 text-hotel-700" />
              <span>{settings.phone}</span>
            </a>

            <button
              onClick={onOpenBookingModal}
              className="inline-flex items-center space-x-2 bg-hotel-700 hover:bg-hotel-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-hotel-700/25 transition transform active:scale-95"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Check Availability</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={onOpenBookingModal}
              className="bg-hotel-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
            >
              Book Stay
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-700 hover:text-neutral-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-hotel-200 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-hotel-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenBookingModal) onOpenBookingModal();
              }}
              className="w-full bg-hotel-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Check Availability & Book</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 py-2.5 rounded-xl text-xs font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Us</span>
              </a>
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-center space-x-1.5 bg-neutral-100 text-neutral-800 py-2.5 rounded-xl text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-hotel-700" />
                <span>Call Hotel</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
