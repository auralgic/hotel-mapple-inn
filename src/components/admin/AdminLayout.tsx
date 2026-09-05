import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHotelData } from '../../context/HotelDataContext';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  UtensilsCrossed,
  ChefHat,
  CreditCard,
  BookOpen,
  QrCode,
  BarChart3,
  Settings,
  History,
  LogOut,
  Hotel,
  Menu,
  X,
  Bell,
  Sparkles,
  Image,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { settings, orders, payments } = useHotelData();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingPaymentsCount = payments.filter(p => p.status === 'submitted' || p.status === 'pending').length;
  const newOrdersCount = orders.filter(o => o.status === 'new').length;

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Rooms (16)', path: '/admin/rooms', icon: BedDouble },
    { label: 'Bookings & Stays', path: '/admin/bookings', icon: CalendarCheck },
    { label: 'Guests', path: '/admin/guests', icon: Users },
    { label: 'Food Orders', path: '/admin/orders', icon: UtensilsCrossed, badge: newOrdersCount },
    { label: 'Kitchen Board', path: '/kitchen', icon: ChefHat, external: true },
    { label: 'Menu Editor', path: '/admin/menu', icon: BookOpen },
    { label: 'Media & Images', path: '/admin/media', icon: Image },
    { label: '16 Room QRs', path: '/admin/qr', icon: QrCode },
    { label: 'Reports & CSV', path: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
    { label: 'Audit Log', path: '/admin/audit', icon: History },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle Header */}
      <div className="md:hidden bg-neutral-900 text-white p-4 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <Hotel className="w-5 h-5 text-hotel-400" />
          <span className="font-serif font-bold text-sm">{settings.name} Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-neutral-300 hover:text-white">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-[29px] h-[calc(100vh-29px)] w-64 bg-neutral-900 text-neutral-200 z-40 flex flex-col justify-between border-r border-neutral-800 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center space-x-3 px-2 py-3 mb-4 border-b border-neutral-800">
            <div className="w-9 h-9 rounded-lg bg-hotel-600 flex items-center justify-center text-white font-bold shadow">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-sm font-bold text-white leading-tight">{settings.name}</h2>
              <span className="text-[10px] text-hotel-400 font-semibold uppercase tracking-wider block">
                {role ? `${role.toUpperCase()} PORTAL` : 'STAFF DASHBOARD'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition ${
                    isActive
                      ? 'bg-hotel-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-hotel-700' : 'bg-hotel-600 text-white animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-white block">{user?.name || 'Staff User'}</span>
              <span className="text-[10px] text-neutral-400 font-mono capitalize">{user?.role || 'Admin'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
