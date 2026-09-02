import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDateTime } from '../../lib/formatters';
import { Payment } from '../../types';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  AlertCircle,
  FileImage,
  X,
  ShieldCheck,
} from 'lucide-react';

export const AdminPaymentsPage: React.FC = () => {
  const { payments, verifyPayment, rejectPayment } = useHotelData();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewProofModalUrl, setViewProofModalUrl] = useState<string | null>(null);
  const [rejectModalPayment, setRejectModalPayment] = useState<Payment | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filteredPayments = payments.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.order_number?.toLowerCase().includes(q) ||
        p.room_number?.includes(q) ||
        p.upi_reference?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const staffName = user?.name || 'Reception Staff';

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectModalPayment) {
      rejectPayment(rejectModalPayment.id, rejectReason || 'UPI Reference not received in bank account', staffName);
      setRejectModalPayment(null);
      setRejectReason('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-hotel-600 uppercase tracking-widest block mb-1">
            Financial Reconciliation
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            UPI Payment Verification Queue
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Verify bank credit against UPI references submitted by guests before kitchen food release.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order #, Room, or UPI Reference..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-1 text-xs overflow-x-auto w-full sm:w-auto">
          {['all', 'submitted', 'verified', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize whitespace-nowrap transition ${
                filterStatus === st
                  ? 'bg-hotel-600 text-white shadow-sm'
                  : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-neutral-50 text-neutral-800 uppercase tracking-wider font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-5 py-3.5">Payment ID & Order</th>
                <th className="px-5 py-3.5">Room</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">UPI Reference / Proof</th>
                <th className="px-5 py-3.5">Verification Status</th>
                <th className="px-5 py-3.5">Verified By / Timestamp</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {filteredPayments.map(p => (
                <tr key={p.id} className="hover:bg-neutral-50 transition">
                  <td className="px-5 py-4">
                    <div className="font-bold text-neutral-900">{p.order_number || p.id}</div>
                    <span className="text-[10px] text-neutral-400 font-mono">Method: {p.method.toUpperCase()}</span>
                  </td>

                  <td className="px-5 py-4 font-bold text-neutral-900">
                    Room {p.room_number || 'N/A'}
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-neutral-900">
                    {formatCurrency(p.amount)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-800 inline-block">
                      {p.upi_reference || 'N/A'}
                    </div>
                    {p.screenshot_url && (
                      <button
                        onClick={() => setViewProofModalUrl(p.screenshot_url!)}
                        className="ml-2 text-hotel-600 hover:underline inline-flex items-center text-[11px]"
                      >
                        <FileImage className="w-3.5 h-3.5 mr-1" />
                        <span>View Proof</span>
                      </button>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        p.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'submitted'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : p.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {p.status}
                    </span>
                    {p.rejection_reason && (
                      <div className="text-[10px] text-red-600 mt-1 italic">Reason: {p.rejection_reason}</div>
                    )}
                  </td>

                  <td className="px-5 py-4 text-[11px] text-neutral-500">
                    {p.verified_by_name ? (
                      <div>
                        <span className="font-semibold text-neutral-800">{p.verified_by_name}</span>
                        <div className="text-[10px] text-neutral-400">{formatDateTime(p.verified_at)}</div>
                      </div>
                    ) : (
                      <span>Pending Staff Check</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right space-x-2">
                    {p.status === 'submitted' && (
                      <>
                        <button
                          onClick={() => verifyPayment(p.id, staffName)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
                        >
                          Verify Payment
                        </button>
                        <button
                          onClick={() => setRejectModalPayment(p)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Proof Modal */}
      {viewProofModalUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setViewProofModalUrl(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-lg mb-3">Guest Payment Screenshot Proof</h3>
            <img src={viewProofModalUrl} alt="Payment Receipt" className="w-full rounded-xl border" />
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setRejectModalPayment(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-lg text-red-900 mb-2">Reject UPI Payment</h3>
            <p className="text-xs text-neutral-500 mb-4">
              Enter reason why this transaction was rejected (e.g. invalid UTR, payment reversed).
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <textarea
                rows={3}
                required
                placeholder="e.g. UTR number not found in ICICI bank statement..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Confirm Payment Rejection
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
