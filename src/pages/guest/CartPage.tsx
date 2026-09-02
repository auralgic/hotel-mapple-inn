import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../lib/formatters';
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2, Utensils, Sparkles, MessageSquare } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    roomNumber,
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    taxAmount,
    totalAmount,
    specialInstructions,
    setSpecialInstructions,
  } = useCart();

  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-[#fcfaf7]">
        <div className="w-20 h-20 rounded-3xl bg-hotel-100 text-hotel-600 flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-1">Your cart is empty</h2>
        <p className="text-xs text-neutral-500 max-w-xs mb-6">
          Add something delicious from our pure veg dining menu to get started.
        </p>
        <Link
          to={`/order?room=${roomNumber}`}
          className="inline-flex items-center space-x-2 bg-hotel-600 hover:bg-hotel-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition"
        >
          <Utensils className="w-4 h-4" />
          <span>Browse Room Menu</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to={`/order?room=${roomNumber}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Add More Items</span>
          </Link>
          <div className="text-right">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold">Delivery To</span>
            <span className="text-sm font-bold text-hotel-800">Room {roomNumber}</span>
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mb-6">
          Your Order Summary
        </h1>

        {/* Cart Item Cards */}
        <div className="bg-white rounded-2xl border border-hotel-200 shadow-sm p-4 sm:p-6 mb-6 divide-y divide-neutral-100">
          {items.map((ci, idx) => (
            <div key={`${ci.menu_item.id}-${ci.variant?.name || 'def'}`} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                    <h3 className="font-bold text-sm text-neutral-900 truncate">
                      {ci.menu_item.name}
                    </h3>
                  </div>
                  {ci.variant && (
                    <span className="text-xs text-hotel-600 font-medium ml-4 block">
                      Size: {ci.variant.name} ({formatCurrency(ci.unitPrice)})
                    </span>
                  )}
                  <span className="text-xs text-neutral-500 ml-4">
                    {formatCurrency(ci.unitPrice)} × {ci.quantity}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-neutral-100 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(ci.menu_item.id, ci.quantity - 1, ci.variant?.name)}
                      className="w-7 h-7 bg-white rounded-lg shadow-sm flex items-center justify-center text-neutral-700 hover:bg-neutral-50 font-bold active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-neutral-900 px-1">{ci.quantity}</span>
                    <button
                      onClick={() => updateQuantity(ci.menu_item.id, ci.quantity + 1, ci.variant?.name)}
                      className="w-7 h-7 bg-hotel-600 rounded-lg shadow-sm flex items-center justify-center text-white hover:bg-hotel-700 font-bold active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-bold text-neutral-900 w-16 text-right">
                    {formatCurrency(ci.unitPrice * ci.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 flex justify-between items-center text-xs">
            <button
              onClick={clearCart}
              className="text-red-600 hover:underline flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Entire Cart</span>
            </button>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="bg-white rounded-2xl border border-hotel-200 shadow-sm p-4 sm:p-5 mb-6">
          <label className="flex items-center space-x-2 text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-hotel-600" />
            <span>Special Cooking / Delivery Instructions</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Less spicy, send extra napkins, no onions..."
            value={specialInstructions}
            onChange={e => setSpecialInstructions(e.target.value)}
            className="w-full text-xs sm:text-sm p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-hotel-500"
          ></textarea>
        </div>

        {/* Bill Breakdown */}
        <div className="bg-white rounded-2xl border border-hotel-200 shadow-sm p-5 mb-6 space-y-2.5 text-xs sm:text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>Item Subtotal</span>
            <span className="font-medium text-neutral-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>GST / Taxes (5%)</span>
            <span className="font-medium text-neutral-900">{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Room Service Delivery</span>
            <span className="font-medium text-emerald-600 font-bold">FREE</span>
          </div>
          <div className="pt-3 border-t border-neutral-100 flex justify-between text-base sm:text-lg font-bold text-neutral-900">
            <span>Total Payable</span>
            <span className="text-hotel-700">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={() => navigate('/order/checkout')}
          className="w-full bg-hotel-600 hover:bg-hotel-700 text-white py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-hotel-600/30 transition transform active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>Continue to Checkout</span>
          <span>({formatCurrency(totalAmount)})</span>
        </button>
      </div>
    </div>
  );
};
