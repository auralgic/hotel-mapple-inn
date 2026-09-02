import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hotel, Utensils, Phone, Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useHotelData } from '../../context/HotelDataContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItemCount } = useCart();
  const { settings } = useHotelData();

  const isGuestOrderRoute = location.pathname.startsWith('/order');

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-hotel-200/80 sticky top-[29px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Hotel Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-hotel-600 flex items-center justify-center text-white shadow-md shadow-hotel-500/20 group-hover:bg-hotel-700 transition">
              <Hotel className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-neutral-900 block leading-tight">
                {settings.name}
              </span>
              <span className="text-[11px] text-hotel-600 font-medium tracking-wide uppercase block">
                Jaipur • Nirman Nagar
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition ${
                location.pathname === '/' ? 'text-hotel-700 font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/rooms"
              className={`text-sm font-medium transition ${
                location.pathname === '/rooms' ? 'text-hotel-700 font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Rooms & Suites
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition ${
                location.pathname === '/contact' ? 'text-hotel-700 font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Location & Contact
            </Link>
            <Link
              to="/order"
              className="inline-flex items-center space-x-2 bg-hotel-600 hover:bg-hotel-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition transform active:scale-95"
            >
              <Utensils className="w-4 h-4" />
              <span>Room Service Menu</span>
            </Link>

            {totalItemCount > 0 && (
              <Link
                to="/order/cart"
                className="relative bg-hotel-100 text-hotel-800 p-2 rounded-lg hover:bg-hotel-200 transition"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-hotel-600 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItemCount}
                </span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {totalItemCount > 0 && (
              <Link
                to="/order/cart"
                className="relative bg-hotel-100 text-hotel-800 p-2 rounded-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-hotel-600 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItemCount}
                </span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-600 hover:text-neutral-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-hotel-200 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-hotel-50"
          >
            Home
          </Link>
          <Link
            to="/rooms"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-hotel-50"
          >
            Rooms & Suites
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-hotel-50"
          >
            Contact & Directions
          </Link>
          <Link
            to="/order"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 bg-hotel-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm"
          >
            <Utensils className="w-4 h-4" />
            <span>Order Room Service</span>
          </Link>
        </div>
      )}
    </nav>
  );
};
