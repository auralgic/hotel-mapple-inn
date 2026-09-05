import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useHotelData } from '../../context/HotelDataContext';
import { formatCurrency } from '../../lib/formatters';
import { ShieldCheck, ArrowLeft, Lock, User, Phone, CheckCircle, Loader2, BedDouble } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    roomNumber,
    setRoomNumber,
    isRoomVerified,
    items,
    subtotal,
    taxAmount,
    totalAmount,
    specialInstructions,
    guestName,
    setGuestName,
    guestPhone,
    setGuestPhone,
    clearCart,
  } = useCart();

  const { rooms, createGuestOrder } = useHotelData();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Guard: if cart empty, redirect
  if (items.length === 0) {
    navigate(`/order?room=${roomNumber}`);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    // Idempotency key based on cart content and timestamp window
    const idempotencyKey = `idemp_${roomNumber}_${totalAmount}_${Date.now()}`;

    try {
      const res = await createGuestOrder(
        roomNumber,
        guestName,
        guestPhone,
        items,
        specialInstructions,
        idempotencyKey
      );

      if (res.success && res.order) {
        clearCart();
        navigate(`/order/status/${res.order.id}`);
      } else {
        setErrorMsg(res.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <Link
          to="/order/cart"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          Confirm & Place Order
        </h1>
        <p className="text-xs text-neutral-500 mb-6">
          Please enter your details so our service team can deliver promptly to your room.
        </p>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Guest Info Card */}
          <div className="bg-white rounded-2xl border border-hotel-200 shadow-sm p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Delivery Room Number
              </label>
              {isRoomVerified ? (
                <div className="flex items-center space-x-2 bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-bold text-neutral-800">
                  <Lock className="w-4 h-4 text-hotel-600" />
                  <span>Room {roomNumber} (QR Verified)</span>
                </div>
              ) : (
                <select
                  value={roomNumber}
                  onChange={e => setRoomNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 text-sm font-bold rounded-xl border border-neutral-300 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.room_number}>
                      Room {r.room_number} (Floor {r.floor} — {r.room_type?.name})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Guest Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Contact Phone / WhatsApp (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="e.g. +91 98290 XXXXX"
                  value={guestPhone}
                  onChange={e => setGuestPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Order Summary Snapshot */}
          <div className="bg-white rounded-2xl border border-hotel-200 shadow-sm p-5 space-y-3">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Order Items ({items.reduce((sum, i) => sum + i.quantity, 0)})
            </h3>

            <div className="divide-y divide-neutral-100 text-xs">
              {items.map((item, idx) => (
                <div key={idx} className="py-2 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-neutral-900">{item.quantity}x </span>
                    <span className="text-neutral-800">{item.menu_item.name}</span>
                    {item.variant && (
                      <span className="text-neutral-500 text-[11px]"> ({item.variant.name})</span>
                    )}
                    {item.note && (
                      <div className="text-[10px] text-amber-700 italic">Note: {item.note}</div>
                    )}
                  </div>
                  <span className="font-semibold text-neutral-900">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>GST (5%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1 border-t border-neutral-100">
                <span>Total Amount</span>
                <span className="text-hotel-700">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* In-House Guest Billing Info */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-900 font-bold">
              <CheckCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Billed to Room #{roomNumber} Folio (Pay at Check-Out)</span>
            </div>
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              This food order total will be automatically added to your room bill. You can settle the consolidated payment at the front desk when checking out.
            </p>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center space-x-2 text-xs text-neutral-500 bg-neutral-100/80 p-3 rounded-xl border border-neutral-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Pure Vegetarian preparation guaranteed • Delivered hot & fresh to your room in 15–20 mins.
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-400 text-neutral-950 font-bold py-3.5 rounded-xl text-sm shadow-md transition flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Order to Kitchen...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Place Order & Add to Room Bill ({formatCurrency(totalAmount)})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
