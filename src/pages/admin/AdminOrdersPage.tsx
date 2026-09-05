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
                <th className="px-4 py-3.5 whitespace-nowrap">Order & Room</th>
                <th className="px-4 py-3.5">Ordered Items & Quantity</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Guest</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total & Pay</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Placed Time</th>
                <th className="px-4 py-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-amber-50/30 transition">
                  {/* Order & Room */}
                  <td className="px-4 py-3.5 align-top">
                    <div className="font-mono font-bold text-neutral-900 text-xs">{o.order_number}</div>
                    <span className="inline-block mt-1 bg-amber-100 text-amber-950 font-black px-2.5 py-0.5 rounded-md text-xs border border-amber-300 shadow-xs">
                      Room {o.room_number}
                    </span>
                  </td>

                  {/* High Visibility Food Items & Quantity */}
                  <td className="px-4 py-3.5 align-top max-w-md">
                    {o.items && o.items.length > 0 ? (
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-1.5">
                          {o.items.map((item, idx) => (
                            <span
                              key={item.id || idx}
                              className="inline-flex items-center bg-white text-neutral-900 border border-neutral-300 font-bold px-2.5 py-1 rounded-lg text-xs shadow-xs"
                            >
                              <span className="bg-amber-700 text-white font-black px-1.5 py-0.5 rounded text-[11px] mr-1.5 shadow-xs">
                                {item.quantity}x
                              </span>
                              <span className="text-neutral-900">{item.item_name_snapshot}</span>
                              {item.variant_snapshot && (
                                <span className="text-amber-800 text-[10px] ml-1 font-semibold">
                                  ({item.variant_snapshot})
                                </span>
                              )}
                              {item.note && (
                                <span className="text-neutral-500 italic text-[10px] ml-1">
                                  — "{item.note}"
                                </span>
                              )}
                            </span>
                          ))}
                        </div>

                        {/* Special Guest Cooking Request */}
                        {o.guest_note && (
                          <div className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md font-semibold flex items-center space-x-1">
                            <span>📝 Instruction:</span>
                            <span className="font-normal italic">"{o.guest_note}"</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-neutral-400 italic text-[11px]">
                        {o.guest_note || 'Order items recorded in Folio'}
                      </div>
                    )}
                  </td>

                  {/* Guest */}
                  <td className="px-4 py-3.5 align-top">
                    <div className="font-bold text-neutral-900">{o.guest_name}</div>
                    {o.guest_phone && <div className="text-[11px] text-neutral-500 font-mono">{o.guest_phone}</div>}
                  </td>

                  {/* Total & Payment */}
                  <td className="px-4 py-3.5 align-top whitespace-nowrap">
                    <div className="font-bold text-neutral-900 text-xs">{formatCurrency(o.total)}</div>
                    <span
                      className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        o.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {o.payment_status === 'paid' ? 'PAID ✓' : 'ROOM FOLIO'}
                    </span>
                  </td>

                  {/* Preparation Status */}
                  <td className="px-4 py-3.5 align-top">
                    <select
                      value={o.status}
                      onChange={e => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                      className="bg-neutral-50 hover:bg-white border border-neutral-300 font-bold text-neutral-800 text-xs py-1 px-2 rounded-lg cursor-pointer outline-none capitalize shadow-xs transition"
                    >
                      <option value="new">New (Pending)</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Placed At */}
                  <td className="px-4 py-3.5 align-top text-[11px] text-neutral-500 whitespace-nowrap">
                    {formatDateTime(o.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 align-top text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => handlePrintKOT(o)}
                      className="p-1.5 text-neutral-600 hover:text-hotel-700 hover:bg-hotel-50 rounded-lg transition border border-neutral-200"
                      title="Print KOT Ticket"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewOrderModal(o)}
                      className="bg-hotel-50 text-hotel-700 hover:bg-hotel-100 px-3 py-1.5 rounded-lg font-bold text-xs transition border border-hotel-200"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewOrderModal(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-1">
              <span className="bg-amber-100 text-amber-950 font-black px-2.5 py-0.5 rounded-md text-xs border border-amber-300">
                ROOM {viewOrderModal.room_number}
              </span>
              <h3 className="font-serif text-xl font-bold text-neutral-900">
                Order #{viewOrderModal.order_number}
              </h3>
            </div>
            
            <p className="text-xs text-neutral-500 mb-4">
              Guest: <strong>{viewOrderModal.guest_name}</strong> {viewOrderModal.guest_phone && `(${viewOrderModal.guest_phone})`} • Placed {formatDateTime(viewOrderModal.created_at)}
            </p>

            <div className="border border-neutral-200 rounded-2xl p-4 divide-y divide-neutral-100 text-xs mb-4 bg-neutral-50/50">
              <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider pb-2">
                Order Items ({viewOrderModal.items?.length || 0})
              </div>
              {viewOrderModal.items && viewOrderModal.items.length > 0 ? (
                viewOrderModal.items.map((item, idx) => (
                  <div key={item.id || idx} className="py-2.5 flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="bg-amber-700 text-white font-black px-1.5 py-0.5 rounded text-[11px]">
                          {item.quantity}x
                        </span>
                        <span className="font-bold text-neutral-900 text-xs">{item.item_name_snapshot}</span>
                      </div>
                      {item.variant_snapshot && (
                        <span className="text-amber-800 text-[11px] block mt-0.5 font-semibold">
                          Variant: {item.variant_snapshot}
                        </span>
                      )}
                      {item.note && (
                        <span className="text-neutral-500 italic block text-[11px] mt-0.5">
                          Note: "{item.note}"
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-neutral-800 text-xs whitespace-nowrap">
                      {formatCurrency(item.line_total)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-3 text-neutral-500 italic text-center">
                  Items recorded under Folio Charge
                </div>
              )}
            </div>

            {viewOrderModal.guest_note && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <strong>Guest Special Instructions:</strong>
                <p className="mt-0.5 italic">"{viewOrderModal.guest_note}"</p>
              </div>
            )}

            <div className="space-y-1.5 text-xs text-neutral-600 mb-6 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <div className="flex justify-between">
                <span>Food Subtotal:</span>
                <span className="font-medium">{formatCurrency(viewOrderModal.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span className="font-medium">{formatCurrency(viewOrderModal.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Grand Total:</span>
                <span className="text-hotel-700 font-extrabold">{formatCurrency(viewOrderModal.total)}</span>
              </div>
            </div>

            <button
              onClick={() => handlePrintKOT(viewOrderModal)}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md"
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
