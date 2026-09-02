import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHotelData } from '../../context/HotelDataContext';
import { Shield, Utensils, Hotel, QrCode, Sparkles, RefreshCw, KeyRound } from 'lucide-react';
import { buildRoomOrderUrl } from '../../lib/qr';

export const StaffRoleBar: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const { rooms, resetToDemoData } = useHotelData();
  const [selectedRoom, setSelectedRoom] = useState<string>('101');
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoomJump = (roomNum: string) => {
    setSelectedRoom(roomNum);
    const room = rooms.find(r => r.room_number === roomNum);
    if (room) {
      navigate(`/order?room=${room.room_number}&token=${room.qr_token_hash}`);
    }
  };

  // Do not show on print-specific full views if desired, but keep visible everywhere for testing
  return (
    <div className="bg-neutral-900 text-neutral-200 text-xs py-1.5 px-3 md:px-6 flex flex-wrap items-center justify-between border-b border-neutral-800 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center space-x-3 overflow-x-auto py-0.5">
        <span className="flex items-center text-hotel-400 font-semibold tracking-wider uppercase text-[10px]">
          <Sparkles className="w-3 h-3 mr-1" /> Mapple Inn Jaipur
        </span>

        <span className="text-neutral-600">|</span>

        {/* Quick Links */}
        <div className="flex items-center space-x-1.5">
          <Link
            to="/"
            className={`px-2 py-0.5 rounded transition ${
              location.pathname === '/' ? 'bg-hotel-600 text-white font-medium' : 'hover:bg-neutral-800 text-neutral-300'
            }`}
          >
            Public Site
          </Link>
          <Link
            to="/admin"
            className={`px-2 py-0.5 rounded flex items-center transition ${
              location.pathname.startsWith('/admin')
                ? 'bg-hotel-600 text-white font-medium'
                : 'hover:bg-neutral-800 text-neutral-300'
            }`}
          >
            <Shield className="w-3 h-3 mr-1" /> Admin
          </Link>
          <Link
            to="/kitchen"
            className={`px-2 py-0.5 rounded flex items-center transition ${
              location.pathname === '/kitchen'
                ? 'bg-hotel-600 text-white font-medium'
                : 'hover:bg-neutral-800 text-neutral-300'
            }`}
          >
            <Utensils className="w-3 h-3 mr-1" /> Kitchen Board
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-3 mt-1 sm:mt-0">
        {/* Simulate Room QR Scan */}
        <div className="flex items-center space-x-1 bg-neutral-800/80 px-2 py-0.5 rounded border border-neutral-700">
          <QrCode className="w-3 h-3 text-hotel-400" />
          <span className="text-[11px] text-neutral-400 hidden sm:inline">Simulate Room QR:</span>
          <select
            value={selectedRoom}
            onChange={e => handleRoomJump(e.target.value)}
            className="bg-transparent text-white text-[11px] font-medium outline-none cursor-pointer pr-1"
          >
            {rooms.map(r => (
              <option key={r.id} value={r.room_number} className="bg-neutral-900 text-white">
                Room {r.room_number} ({r.status})
              </option>
            ))}
          </select>
        </div>

        {/* Role Quick Switch */}
        <div className="flex items-center space-x-1">
          <span className="text-neutral-500 text-[10px] hidden md:inline">Role:</span>
          <button
            onClick={() => switchRole('admin')}
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              role === 'admin' ? 'bg-amber-600 text-white font-bold' : 'text-neutral-400 hover:bg-neutral-800'
            }`}
            title="Switch to Admin"
          >
            Admin
          </button>
          <button
            onClick={() => switchRole('reception')}
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              role === 'reception' ? 'bg-amber-600 text-white font-bold' : 'text-neutral-400 hover:bg-neutral-800'
            }`}
            title="Switch to Reception"
          >
            Reception
          </button>
          <button
            onClick={() => switchRole('kitchen')}
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              role === 'kitchen' ? 'bg-amber-600 text-white font-bold' : 'text-neutral-400 hover:bg-neutral-800'
            }`}
            title="Switch to Kitchen"
          >
            Kitchen
          </button>
        </div>

        {/* Reset Demo State Button */}
        <button
          onClick={() => {
            if (confirm('Reset Hotel Mapple Inn data back to initial seed state?')) {
              resetToDemoData();
              window.location.reload();
            }
          }}
          title="Reset sample data"
          className="text-neutral-500 hover:text-neutral-300 p-1 hover:bg-neutral-800 rounded transition"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
