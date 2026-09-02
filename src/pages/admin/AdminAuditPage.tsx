import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { formatDateTime } from '../../lib/formatters';
import { History, Search, Shield, Filter } from 'lucide-react';

export const AdminAuditPage: React.FC = () => {
  const { auditLogs } = useHotelData();
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    if (entityFilter !== 'all' && log.entity_type !== entityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.entity_type.toLowerCase().includes(q) ||
        log.entity_id.toLowerCase().includes(q) ||
        log.actor_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-hotel-600 uppercase tracking-widest block mb-1">
          Security & Compliance
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
          System Audit & Activity Trail
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Immutable ledger recording every payment verification, room status adjustment, price change, and check-in/out.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit actions, staff names, or entity IDs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-1 text-xs overflow-x-auto w-full sm:w-auto">
          {['all', 'PAYMENT', 'ROOM', 'ORDER', 'BOOKING', 'MENU_ITEM', 'SETTINGS'].map(et => (
            <button
              key={et}
              onClick={() => setEntityFilter(et)}
              className={`px-3 py-1.5 rounded-xl font-semibold uppercase whitespace-nowrap transition ${
                entityFilter === et
                  ? 'bg-hotel-600 text-white shadow-sm'
                  : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {et}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-neutral-50 text-neutral-800 uppercase tracking-wider font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Staff / Actor</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Entity Target</th>
                <th className="px-5 py-3.5">Change Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-neutral-50 transition">
                  <td className="px-5 py-3.5 text-neutral-500 whitespace-nowrap">
                    {formatDateTime(log.created_at)}
                  </td>

                  <td className="px-5 py-3.5 font-bold text-neutral-900 font-sans">
                    {log.actor_name}
                  </td>

                  <td className="px-5 py-3.5">
                    <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-bold">
                      {log.action}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-hotel-700 font-bold">
                    {log.entity_type} ({log.entity_id})
                  </td>

                  <td className="px-5 py-3.5 text-neutral-600 max-w-xs truncate">
                    {log.new_data ? JSON.stringify(log.new_data) : 'State modification'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
