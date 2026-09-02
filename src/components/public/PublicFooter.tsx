import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Phone, Mail, MapPin, QrCode, ArrowRight, MessageSquare, ShieldCheck } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';

export const PublicFooter: React.FC = () => {
  const { settings } = useHotelData();

  return (
    <footer className="bg-[#1f1915] text-neutral-300 pt-16 pb-12 border-t border-[#342820]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand & Story Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-hotel-700 flex items-center justify-center text-white font-bold">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-white tracking-wide block">
                  {settings.name}
                </span>
                <span className="text-[10px] text-hotel-400 font-semibold uppercase tracking-widest block">
                  Jaipur • Rajasthan
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              An independent 16-room boutique hotel in Nirman Nagar, Mansarovar, Jaipur. Offering comfortable accommodations, modern QR in-room dining, and authentic hospitality.
            </p>

            <div className="pt-2 flex items-center space-x-3 text-xs">
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-lg transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Direct WhatsApp Concierge</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Explore Hotel
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-hotel-300 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-neutral-400 hover:text-hotel-300 transition">
                  Rooms & Suites (16)
                </Link>
              </li>
              <li>
                <Link to="/order" className="text-neutral-400 hover:text-hotel-300 transition">
                  In-Room Dining Menu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-400 hover:text-hotel-300 transition">
                  Location & Directions
                </Link>
              </li>
            </ul>
          </div>

          {/* Stay Info */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Stay & Dining Hours
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="flex justify-between border-b border-neutral-800/80 pb-1.5">
                <span>Check-In Time:</span>
                <strong className="text-white">{settings.checkInTime}</strong>
              </li>
              <li className="flex justify-between border-b border-neutral-800/80 pb-1.5">
                <span>Check-Out Time:</span>
                <strong className="text-white">{settings.checkOutTime}</strong>
              </li>
              <li className="flex justify-between border-b border-neutral-800/80 pb-1.5">
                <span>Room Dining:</span>
                <strong className="text-white">{settings.roomServiceHours}</strong>
              </li>
              <li className="flex justify-between">
                <span>Cuisine:</span>
                <strong className="text-emerald-400">100% Pure Veg Kitchen</strong>
              </li>
            </ul>
          </div>

          {/* In-House Guest Prompt & Contact */}
          <div className="md:col-span-3 space-y-4">
            <div className="bg-hotel-950/60 border border-hotel-800/50 p-4 rounded-2xl">
              <div className="flex items-center space-x-2 text-hotel-300 font-bold text-xs mb-1">
                <QrCode className="w-4 h-4 text-hotel-400" />
                <span>Staying With Us Right Now?</span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-3">
                Scan the QR code stand in your room to order hot food & beverages directly to your doorstep.
              </p>
              <Link
                to="/order"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-hotel-300 hover:text-white transition"
              >
                <span>Access Digital Menu →</span>
              </Link>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-hotel-500 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white font-medium">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-hotel-500 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start space-x-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-hotel-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500 space-y-2 sm:space-y-0">
          <p>© {new Date().getFullYear()} {settings.name}, Jaipur. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Direct Booking Best Rate Guarantee</span>
            <span>•</span>
            <Link to="/contact" className="hover:text-neutral-400">
              Help & Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
