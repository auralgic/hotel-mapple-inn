import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { Users, Search, Phone, Mail, FileText, BedDouble, Calendar, Trash2 } from 'lucide-react';

export const AdminGuestsPage: React.FC = () => {
  const { bookings, wipeAllMockData } = useHotelData();
  const [searchQuery, setSearchQuery] = useState('');
  const [clearing, setClearing] = useState(false);

  // Group unique guests from bookings
  const guestsMap: Record<string, {
    name: string;
    phone: string;
    email?: string;
    totalStays: number;
    totalSpend: number;
    lastStay: string;
    roomNumbers: string[];
    notes?: string;
  }> = {};

  bookings.forEach(b => {
    const key = b.guest?.phone || b.guest?.name || 'unknown';
    if (!guestsMap[key]) {
      guestsMap[key] = {
        name: b.guest?.name || 'Guest',
        phone: b.guest?.phone || 'N/A',
        email: b.guest?.email,
        totalStays: 0,
        totalSpend: 0,
        lastStay: b.check_out,
        roomNumbers: [],
        notes: b.guest?.notes || b.notes,
      };
    }
    guestsMap[key].totalStays += 1;
    guestsMap[key].totalSpend += b.total;
    if (b.room?.room_number && !guestsMap[key].roomNumbers.includes(b.room.room_number)) {
      guestsMap[key].roomNumbers.push(b.room.room_number);
    }
  });

  const guestList = Object.values(guestsMap).filter(g => {
    const q = searchQuery.toLowerCase();
    return g.name.toLowerCase().includes(q) || g.phone.includes(q);
  });

  const handleClearMock = async () => {
    if (window.confirm('Wipe all dummy/test bookings and guest records to start completely clean?')) {
      setClearing(true);
      await wipeAllMockData();
      setClearing(false);
      window.alert('All mock data and dummy guests have been cleared successfully.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-hotel-600 uppercase tracking-widest block mb-1">
            CRM & Guest Directory
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Guest Profiles & Stay History
          </h1>
        </div>

        <button
          onClick={handleClearMock}
          disabled={clearing}
          className="self-start sm:self-auto bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3.5 py-2 text-xs flex items-center space-x-1.5 transition active:scale-95 disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
          <span>{clearing ? 'Clearing...' : 'Clear All Mock Data'}</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-none border border-neutral-200 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Guest Name or Mobile Number..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-none border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Guest Directory Grid */}
      {guestList.length === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-bold text-neutral-800 text-base mb-1">No Guest Records Found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Clean slate active. Real guest profiles will automatically be recorded here as direct website bookings and check-ins occur.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guestList.map((guest, idx) => (
            <div
              key={idx}
              className="bg-white rounded-none border border-neutral-200 p-5 shadow-xs hover:border-amber-700 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">{guest.name}</h3>
                  <div className="flex items-center space-x-1 text-xs text-neutral-500 font-mono mt-0.5">
                    <Phone className="w-3 h-3 text-neutral-400" />
                    <span>{guest.phone}</span>
                  </div>
                </div>
                <span className="bg-neutral-100 text-neutral-800 text-[10px] font-bold px-2 py-0.5">
                  {guest.totalStays} Stay{guest.totalStays > 1 ? 's' : ''}
                </span>
              </div>

              {guest.email && (
                <div className="flex items-center space-x-1 text-xs text-neutral-500 mb-2">
                  <Mail className="w-3 h-3 text-neutral-400" />
                  <span className="truncate">{guest.email}</span>
                </div>
              )}

              <div className="pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 font-medium block">Total Spend</span>
                  <span className="font-bold text-neutral-900">{formatCurrency(guest.totalSpend)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 font-medium block">Rooms Stayed</span>
                  <span className="font-bold text-neutral-800">
                    {guest.roomNumbers.length > 0 ? guest.roomNumbers.map(r => `Room ${r}`).join(', ') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
