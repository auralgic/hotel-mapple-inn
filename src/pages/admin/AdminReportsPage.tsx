import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { exportToCSV } from '../../lib/csvExport';
import {
  BarChart3,
  Download,
  Calendar,
  FileSpreadsheet,
  TrendingUp,
  UtensilsCrossed,
  BedDouble,
  DollarSign,
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { orders, bookings, payments, rooms } = useHotelData();
  const [reportPeriod, setReportPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Revenue totals
  const verifiedOrders = orders.filter(o => o.payment_status === 'paid' && o.status !== 'cancelled');
  const totalFoodSales = verifiedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalRoomSales = bookings.reduce((sum, b) => sum + b.total, 0);
  const totalGrossRevenue = totalFoodSales + totalRoomSales;

  const averageFoodOrderValue = verifiedOrders.length > 0 ? totalFoodSales / verifiedOrders.length : 0;
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
  const occupancyRate = ((occupiedCount / 16) * 100).toFixed(0);

  // Top Food Items Calculation
  const itemCounts: Record<string, { name: string; quantity: number; revenue: number }> = {};
  verifiedOrders.forEach(o => {
    o.items.forEach(i => {
      if (!itemCounts[i.item_name_snapshot]) {
        itemCounts[i.item_name_snapshot] = { name: i.item_name_snapshot, quantity: 0, revenue: 0 };
      }
      itemCounts[i.item_name_snapshot].quantity += i.quantity;
      itemCounts[i.item_name_snapshot].revenue += i.line_total;
    });
  });

  const topDishes = Object.values(itemCounts)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // CSV Export Handlers
  const exportDailySalesCSV = () => {
    const data = [
      {
        Date: new Date().toISOString().slice(0, 10),
        'Total Revenue': totalGrossRevenue,
        'Food Revenue': totalFoodSales,
        'Room Revenue': totalRoomSales,
        'Total Orders': orders.length,
        'Occupied Rooms': occupiedCount,
        'Occupancy Rate': `${occupancyRate}%`,
      },
    ];
    exportToCSV('Mapple_Inn_Daily_Sales_Report', data);
  };

  const exportFoodOrdersCSV = () => {
    const data = orders.map(o => ({
      'Order Number': o.order_number,
      'Room Number': o.room_number,
      'Guest Name': o.guest_name,
      'Item Count': o.items.reduce((s, i) => s + i.quantity, 0),
      Subtotal: o.subtotal,
      Tax: o.tax,
      Total: o.total,
      'Payment Status': o.payment_status,
      'Order Status': o.status,
      'UPI Reference': o.upi_reference || '',
      Date: formatDate(o.created_at),
    }));
    exportToCSV('Mapple_Inn_Food_Orders', data);
  };

  const exportBookingsCSV = () => {
    const data = bookings.map(b => ({
      'Booking Number': b.booking_number,
      'Guest Name': b.guest?.name || '',
      Phone: b.guest?.phone || '',
      'Room Number': b.room?.room_number || '',
      'Check In': formatDate(b.check_in),
      'Check Out': formatDate(b.check_out),
      'Nightly Rate': b.rate,
      Total: b.total,
      Deposit: b.deposit || 0,
      Source: b.source,
      Status: b.status,
    }));
    exportToCSV('Mapple_Inn_Bookings_Folio', data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-hotel-600 uppercase tracking-widest block mb-1">
            Analytics & Exports
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Revenue & Operational Reports
          </h1>
        </div>

        {/* CSV Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={exportDailySalesCSV}
            className="inline-flex items-center space-x-1.5 bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-50 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Daily CSV</span>
          </button>
          <button
            onClick={exportFoodOrdersCSV}
            className="inline-flex items-center space-x-1.5 bg-hotel-600 hover:bg-hotel-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Orders CSV</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">Gross Total Revenue</span>
            <DollarSign className="w-4 h-4 text-hotel-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{formatCurrency(totalGrossRevenue)}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Rooms + Kitchen Dining</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">Food Sales Revenue</span>
            <UtensilsCrossed className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{formatCurrency(totalFoodSales)}</div>
          <span className="text-[11px] text-neutral-500 mt-1 block">{verifiedOrders.length} Paid In-Room Orders</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">Avg Food Order Value</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{formatCurrency(averageFoodOrderValue)}</div>
          <span className="text-[11px] text-neutral-500 mt-1 block">Per room ticket</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">Current Occupancy</span>
            <BedDouble className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{occupancyRate}%</div>
          <span className="text-[11px] text-neutral-500 mt-1 block">{occupiedCount} of 16 Rooms Occupied</span>
        </div>
      </div>

      {/* Reports Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Dishes */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-neutral-900 mb-1">
            Top Selling Food Items
          </h3>
          <p className="text-xs text-neutral-500 mb-4">Most popular dishes ordered by room guests.</p>

          <div className="space-y-3">
            {topDishes.map((dish, idx) => (
              <div key={dish.name} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-hotel-600 text-white font-bold flex items-center justify-center text-[10px]">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-neutral-900 block">{dish.name}</span>
                    <span className="text-neutral-500 text-[11px]">{dish.quantity} plates served</span>
                  </div>
                </div>
                <span className="font-bold text-neutral-900">{formatCurrency(dish.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Export & Google Sheets Archive Info */}
        <div className="bg-hotel-900 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-hotel-300 uppercase tracking-widest block mb-2">
              Data Archival & Integration
            </span>
            <h3 className="font-serif text-xl font-bold mb-3">
              Export to Google Sheets & CSV
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed mb-6">
              Download clean structured CSV spreadsheets compatible with Google Sheets, Microsoft Excel, or accounting software. PostgreSQL remains the transactional source of truth.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={exportBookingsCSV}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-hotel-400" />
              <span>Download Guest Bookings Folio CSV</span>
            </button>
            <button
              onClick={exportFoodOrdersCSV}
              className="w-full bg-hotel-600 hover:bg-hotel-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Complete Kitchen Orders CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
