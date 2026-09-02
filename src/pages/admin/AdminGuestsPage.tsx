import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { Users, Search, Phone, Mail, FileText, BedDouble, Calendar } from 'lucide-react';

export const AdminGuestsPage: React.FC = () => {
  const { bookings } = useHotelData();
  const [searchQuery, setSearchQuery] = useState('');

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
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Guest Name or Mobile Number..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Guests Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guestList.map(g => (
          <div
            key={g.phone + g.name}
            className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-sm text-neutral-900">{g.name}</h3>
                <div className="flex items-center text-xs text-neutral-500 mt-0.5">
                  <Phone className="w-3 h-3 mr-1 text-hotel-600" />
                  <span>{g.phone}</span>
                </div>
              </div>
              <span className="bg-hotel-50 text-hotel-700 font-bold text-xs px-2.5 py-1 rounded-full">
                {g.totalStays} Stay{g.totalStays > 1 ? 's' : ''}
              </span>
            </div>

            <div className="pt-2 border-t border-neutral-100 grid grid-cols-2 gap-2 text-xs text-neutral-600">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Total Lifetime Spend</span>
                <span className="font-bold text-neutral-900">{formatCurrency(g.totalSpend)}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Rooms Preferred</span>
                <span className="font-semibold text-neutral-800">
                  {g.roomNumbers.length ? g.roomNumbers.join(', ') : 'Room 101'}
                </span>
              </div>
            </div>

            {g.notes && (
              <div className="bg-neutral-50 p-2.5 rounded-xl text-xs text-neutral-600 border border-neutral-100">
                <span className="font-semibold text-neutral-700">Notes:</span> {g.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
