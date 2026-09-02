import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { Order, OrderStatus } from '../../types';
import { formatCurrency, formatDateTime } from '../../lib/formatters';
import {
  UtensilsCrossed,
  Search,
  Printer,
  X,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useHotelData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewOrderModal, setViewOrderModal] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.room_number.includes(q) ||
        o.guest_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handlePrintKOT = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>KOT - Room ${order.room_number} - ${order.order_number}</title>
          <style>
            body { font-family: monospace; padding: 20px; max-width: 320px; margin: 0 auto; font-size: 13px; }
            h2 { text-align: center; margin: 0; }
            .meta { border-top: 1px dashed #000; border-bottom: 1px dashed #000; margin: 10px 0; padding: 8px 0; }
            .item { display: flex; justify-content: space-between; margin-bottom: 6px; }
            .note { font-style: italic; font-size: 11px; margin-bottom: 4px; }
          </style>
        </head>
        <body>
          <h2>HOTEL MAPPLE INN</h2>
          <div style="text-align:center; font-weight:bold; font-size:16px; margin: 5px 0;">ROOM ${order.room_number}</div>
          <div class="meta">
            <div>KOT: ${order.order_number}</div>
            <div>Guest: ${order.guest_name}</div>
            <div>Time: ${formatDateTime(order.created_at)}</div>
          </div>
          <div>
            ${order.items.map(i => `
              <div class="item">
                <span><strong>${i.quantity}x</strong> ${i.item_name_snapshot} ${i.variant_snapshot ? `(${i.variant_snapshot})` : ''}</span>
              </div>
              ${i.note ? `<div class="note">Note: ${i.note}</div>` : ''}
            `).join('')}
          </div>
          ${order.guest_note ? `<div style="margin-top:10px; border-top:1px solid #000; padding-top:5px;"><strong>Note:</strong> ${order.guest_note}</div>` : ''}
          <div style="margin-top:20px; text-align:center; font-size:11px;">-- PURE VEG KITCHEN TICKET --</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-hotel-600 uppercase tracking-widest block mb-1">
            Food & Beverage
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Room Service Food Orders
          </h1>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order #, Room, or Guest Name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-1 text-xs overflow-x-auto w-full sm:w-auto">
          {['all', 'new', 'preparing', 'ready', 'delivered', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-hotel-600 text-white shadow-sm'
                  : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-neutral-50 text-neutral-800 uppercase tracking-wider font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-5 py-3.5">Order #</th>
                <th className="px-5 py-3.5">Room</th>
                <th className="px-5 py-3.5">Guest & Items</th>
                <th className="px-5 py-3.5">Total & Payment</th>
                <th className="px-5 py-3.5">Preparation Status</th>
                <th className="px-5 py-3.5">Placed At</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-neutral-50 transition">
                  <td className="px-5 py-4 font-mono font-bold text-neutral-900">
                    {o.order_number}
                  </td>

                  <td className="px-5 py-4">
                    <span className="bg-neutral-100 font-bold px-2.5 py-1 rounded-lg text-neutral-900">
                      Room {o.room_number}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-bold text-neutral-900">{o.guest_name}</div>
                    <div className="text-[11px] text-neutral-500 truncate max-w-xs">
                      {o.items.map(i => `${i.quantity}x ${i.item_name_snapshot}`).join(', ')}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-bold text-neutral-900">{formatCurrency(o.total)}</div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        o.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.payment_status.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={o.status}
                      onChange={e => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                      className="bg-neutral-100 border border-neutral-300 font-semibold text-neutral-800 text-xs py-1 px-2 rounded-lg cursor-pointer outline-none capitalize"
                    >
                      <option value="new">New</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="px-5 py-4 text-[11px] text-neutral-500">
                    {formatDateTime(o.created_at)}
                  </td>

                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => handlePrintKOT(o)}
                      className="p-1.5 text-neutral-600 hover:text-hotel-700 hover:bg-hotel-50 rounded-lg transition"
                      title="Print KOT Ticket"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewOrderModal(o)}
                      className="bg-hotel-50 text-hotel-700 hover:bg-hotel-100 px-3 py-1.5 rounded-lg font-bold text-xs transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {viewOrderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setViewOrderModal(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-neutral-900 mb-1">
              Order #{viewOrderModal.order_number}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Room {viewOrderModal.room_number} • Placed {formatDateTime(viewOrderModal.created_at)}
            </p>

            <div className="border border-neutral-200 rounded-2xl p-4 divide-y divide-neutral-100 text-xs mb-4">
              {viewOrderModal.items.map(item => (
                <div key={item.id} className="py-2 flex justify-between">
                  <div>
                    <span className="font-bold text-neutral-900">{item.quantity}x {item.item_name_snapshot}</span>
                    {item.variant_snapshot && <span className="text-hotel-600 block">Size: {item.variant_snapshot}</span>}
                    {item.note && <span className="text-neutral-500 italic block">"{item.note}"</span>}
                  </div>
                  <span className="font-bold text-neutral-800">{formatCurrency(item.line_total)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs text-neutral-600 mb-6 bg-neutral-50 p-4 rounded-xl">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(viewOrderModal.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span>{formatCurrency(viewOrderModal.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total Amount:</span>
                <span className="text-hotel-700">{formatCurrency(viewOrderModal.total)}</span>
              </div>
            </div>

            <button
              onClick={() => handlePrintKOT(viewOrderModal)}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Kitchen KOT Receipt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
