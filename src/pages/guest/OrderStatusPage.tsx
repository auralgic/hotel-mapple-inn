import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHotelData } from '../../context/HotelDataContext';
import { formatCurrency, formatDateTime } from '../../lib/formatters';
import { OrderStatus } from '../../types';
import {
  CheckCircle2,
  Clock,
  Utensils,
  Truck,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Phone,
  ShieldCheck,
} from 'lucide-react';

export const OrderStatusPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, settings } = useHotelData();

  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p className="text-xs text-neutral-500 mt-1 mb-4">Please check the order number or consult reception.</p>
        <Link
          to="/order"
          className="bg-hotel-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  // Define steps
  const steps: { key: string; label: string; description: string; icon: any }[] = [
    {
      key: 'confirmed',
      label: 'Order Confirmed',
      description: `Billed to Room #${order.room_number} Folio (Pay at Check-Out)`,
      icon: CheckCircle2,
    },
    {
      key: 'preparing',
      label: 'Kitchen Preparing',
      description: 'Chef is freshly cooking in our dedicated kitchen',
      icon: Utensils,
    },
    {
      key: 'ready',
      label: 'Ready & Dispatched',
      description: `Plated hot and on the way to Floor #${order.room_number[0] || '2'}`,
      icon: Clock,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      description: `Enjoy your meal in Room ${order.room_number}`,
      icon: Sparkles,
    },
  ];

  // Helper to determine step status
  const getStepState = (stepIndex: number) => {
    // Determine overall progress index 0-3
    let currentIdx = 0;
    if (order.status === 'new') currentIdx = 0;
    else if (order.status === 'preparing' || order.status === 'confirmed' || order.status === 'accepted') currentIdx = 1;
    else if (order.status === 'ready' || order.status === 'out_for_delivery') currentIdx = 2;
    else if (order.status === 'delivered') currentIdx = 3;

    if (stepIndex < currentIdx) return 'completed';
    if (stepIndex === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Order Placed Successfully</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Live Order Status
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Order #{order.order_number} • Room {order.room_number}
          </p>
        </div>

        {/* Live Status Card */}
        <div className="bg-white rounded-3xl border border-hotel-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">Current State</span>
              <span className="text-base font-bold text-hotel-700 capitalize">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">Payment</span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  order.payment_status === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.payment_status === 'paid' ? 'Payment Verified ✓' : 'Awaiting Verification'}
              </span>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="space-y-6">
            {steps.map((step, idx) => {
              const state = getStepState(idx);
              const Icon = step.icon;

              return (
                <div key={step.key} className="flex items-start space-x-4 relative">
                  {/* Vertical connector line */}
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 -bottom-6 w-0.5 ${
                        state === 'completed' ? 'bg-emerald-500' : 'bg-neutral-200'
                      }`}
                    ></div>
                  )}

                  {/* Icon Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold transition ${
                      state === 'completed'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : state === 'active'
                        ? 'bg-hotel-600 text-white animate-pulse shadow-md shadow-hotel-500/30'
                        : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Step Info */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-bold ${
                        state === 'pending' ? 'text-neutral-400' : 'text-neutral-900'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details Accordion */}
        <div className="bg-white rounded-2xl border border-hotel-200 shadow-sm p-5 mb-6 space-y-4">
          <h3 className="font-serif text-base font-bold text-neutral-900 border-b border-neutral-100 pb-2">
            Items Ordered
          </h3>

          <div className="divide-y divide-neutral-100 text-xs">
            {order.items.map(item => (
              <div key={item.id} className="py-2.5 flex justify-between">
                <div>
                  <span className="font-bold text-neutral-800">
                    {item.quantity}x {item.item_name_snapshot}
                  </span>
                  {item.variant_snapshot && (
                    <span className="text-hotel-600 block text-[11px]">Size: {item.variant_snapshot}</span>
                  )}
                  {item.note && (
                    <span className="text-neutral-500 italic block text-[11px]">Note: "{item.note}"</span>
                  )}
                </div>
                <span className="font-semibold text-neutral-900">{formatCurrency(item.line_total)}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST / Taxes (5%)</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            {order.upi_reference && (
              <div className="flex justify-between text-neutral-500 font-mono text-[11px]">
                <span>UPI Ref:</span>
                <span>{order.upi_reference}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-100">
              <span>Total Paid</span>
              <span className="text-hotel-700">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Support Help */}
        <div className="bg-neutral-100 rounded-2xl p-4 text-center text-xs text-neutral-600 flex items-center justify-between">
          <span>Need help or change order?</span>
          <a
            href={`tel:${settings.phone}`}
            className="font-bold text-hotel-700 hover:underline flex items-center space-x-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Reception ({settings.phone})</span>
          </a>
        </div>

        <div className="mt-6 text-center">
          <Link
            to={`/order?room=${order.room_number}`}
            className="text-xs font-semibold text-hotel-700 hover:underline"
          >
            ← Order more food for Room {order.room_number}
          </Link>
        </div>
      </div>
    </div>
  );
};
