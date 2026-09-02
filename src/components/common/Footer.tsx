import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Phone, Mail, MapPin, QrCode } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';

export const Footer: React.FC = () => {
  const { settings } = useHotelData();

  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-12 pb-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded bg-hotel-600 flex items-center justify-center text-white">
                <Hotel className="w-5 h-5" />
              </div>
              <span className="font-serif text-lg font-bold text-white tracking-wide">
                {settings.name}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              {settings.tagline}. A modern boutique property in Mansarovar, Jaipur.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-hotel-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-neutral-400 hover:text-hotel-400 transition">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-400 hover:text-hotel-400 transition">
                  Contact & Location
                </Link>
              </li>
              <li>
                <Link to="/order" className="text-hotel-400 hover:underline">
                  Guest Room Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Operations & Staff */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Hotel Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/admin" className="text-neutral-400 hover:text-white transition">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/rooms" className="text-neutral-400 hover:text-white transition">
                  Room Management Grid
                </Link>
              </li>
              <li>
                <Link to="/kitchen" className="text-neutral-400 hover:text-white transition">
                  Kitchen Live Display
                </Link>
              </li>
              <li>
                <Link to="/admin/qr" className="text-neutral-400 hover:text-white transition">
                  16-Room QR Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Contact & Address
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-hotel-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-hotel-500 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-hotel-500 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 text-center text-xs text-neutral-500 flex flex-col sm:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Hotel Mapple Inn, Jaipur. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">16 Rooms • Nirman Nagar, Mansarovar, Jaipur</p>
        </div>
      </div>
    </footer>
  );
};
