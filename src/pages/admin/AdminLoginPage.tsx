import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHotelData } from '../../context/HotelDataContext';
import { Hotel, Lock, Mail, Shield, User, ArrowRight, ChefHat, Sparkles } from 'lucide-react';
import { UserRole } from '../../types';

export const AdminLoginPage: React.FC = () => {
  const { login, switchRole } = useAuth();
  const { settings } = useHotelData();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email);
    setLoading(false);
    navigate('/admin');
  };

  const handleQuickRoleSelect = (role: UserRole) => {
    switchRole(role);
    if (role === 'kitchen') {
      navigate('/kitchen');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-hotel-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-hotel-500/30">
          <Hotel className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-neutral-900">
          {settings.name} Staff Portal
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Sign in to access property management, reservations, and room service.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-hotel-200">
          {/* Quick 1-Click Role Presets */}
          <div className="mb-6 space-y-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block text-center">
              Quick Role-Based Access
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickRoleSelect('admin')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-hotel-50 hover:bg-hotel-100 border border-hotel-200 text-xs font-bold text-hotel-900 transition"
              >
                <Shield className="w-4 h-4 text-hotel-600 mb-1" />
                <span>Admin</span>
              </button>
              <button
                onClick={() => handleQuickRoleSelect('reception')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-900 transition"
              >
                <User className="w-4 h-4 text-blue-600 mb-1" />
                <span>Reception</span>
              </button>
              <button
                onClick={() => handleQuickRoleSelect('kitchen')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-900 transition"
              >
                <ChefHat className="w-4 h-4 text-amber-600 mb-1" />
                <span>Kitchen</span>
              </button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-neutral-400 font-semibold">Or enter credentials</span>
            </div>
          </div>

          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Staff Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@mappleinn.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-hotel-500 focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-hotel-500 focus:bg-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-hotel-600 hover:bg-hotel-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-hotel-700 hover:underline">
              ← Return to Hotel Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
