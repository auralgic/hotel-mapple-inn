import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHotelData } from '../../context/HotelDataContext';
import { Hotel, Lock, Mail, ShieldAlert, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const { settings, mediaConfig } = useHotelData();
  const navigate = useNavigate();

  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.trim() || !password.trim()) {
      setErrorMsg('Please enter both your staff ID/email and password.');
      return;
    }

    if (failedAttempts >= 5) {
      setErrorMsg('Too many failed attempts. Please wait 60 seconds before trying again.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await login(identity, password);
    setLoading(false);

    if (res.success) {
      if (identity.toLowerCase().includes('kitchen')) {
        navigate('/kitchen');
      } else {
        navigate('/admin');
      }
    } else {
      setFailedAttempts(prev => prev + 1);
      setErrorMsg(res.error || 'Access denied. Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#141210] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-neutral-100 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 to-black/80 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        {mediaConfig?.logoUrl ? (
          <img
            src={mediaConfig.logoUrl}
            alt="Hotel Mapple Inn"
            className="h-14 w-auto mx-auto mb-4 object-contain"
          />
        ) : (
          <div className="w-14 h-14 bg-amber-800 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-lg shadow-amber-950/40 border border-amber-600/40">
            M
          </div>
        )}

        <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase block mb-1">
          OFFICIAL STAFF ACCESS PORTAL
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {settings.name}
        </h2>
        <p className="mt-1.5 text-xs text-neutral-400">
          Protected Management & Operations Gateway • Jaipur
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#1f1b18] py-8 px-6 shadow-2xl border border-neutral-800 sm:px-9">
          {/* Security Alert Header */}
          <div className="mb-6 flex items-center space-x-2.5 bg-neutral-900/90 border border-neutral-800 p-3 text-xs text-neutral-300">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Authorized hotel personnel only. All access attempts are logged for security.</span>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-5 bg-rose-950/70 border border-rose-800/80 p-3.5 text-xs text-rose-200 flex items-start space-x-2.5 animate-shake">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Staff Email or Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identity}
                  onChange={e => setIdentity(e.target.value)}
                  placeholder="admin@mappleinn.com"
                  className="w-full bg-[#12100e] border border-neutral-700 text-white px-3.5 py-2.5 pl-10 text-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                  autoComplete="username"
                />
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#12100e] border border-neutral-700 text-white px-3.5 py-2.5 pl-10 pr-10 text-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                  autoComplete="current-password"
                />
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-white p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold py-3 px-4 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg disabled:opacity-50 cursor-pointer active:scale-95"
              >
                <span>{loading ? 'Verifying Identity...' : 'Secure Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-800/80 text-center">
            <Link
              to="/"
              className="text-xs text-neutral-400 hover:text-amber-400 transition inline-flex items-center space-x-1"
            >
              <span>← Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
