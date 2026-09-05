import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHotelData } from '../../context/HotelDataContext';
import { formatTime, formatCurrency } from '../../lib/formatters';
import { Order, OrderStatus } from '../../types';
import {
  Utensils,
  Clock,
  CheckCircle,
  AlertCircle,
  Volume2,
  VolumeX,
  Sparkles,
  ChefHat,
  ArrowRight,
  Flame,
  CheckCheck,
  LayoutDashboard,
  Home,
} from 'lucide-react';

export const KitchenPage: React.FC = () => {
  const { orders, updateOrderStatus } = useHotelData();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastNewOrderCount, setLastNewOrderCount] = useState(0);
  const [audioAlertTriggered, setAudioAlertTriggered] = useState(false);

  // Group active orders by Kanban columns
  const newOrders = orders.filter(o => o.status === 'new');
  const preparingOrders = orders.filter(o => o.status === 'preparing' || o.status === 'confirmed' || o.status === 'accepted');
  const readyOrders = orders.filter(o => o.status === 'ready' || o.status === 'out_for_delivery');
  const completedOrders = orders.filter(o => o.status === 'delivered').slice(0, 10); // Show recent 10

  // Sound and Visual Alert effect on new incoming order
  useEffect(() => {
    if (newOrders.length > lastNewOrderCount) {
      setAudioAlertTriggered(true);
      if (soundEnabled) {
        try {
          // Play web audio chime
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
          // Audio blocked by browser policy
        }
      }
    }
    setLastNewOrderCount(newOrders.length);
  }, [newOrders.length, lastNewOrderCount, soundEnabled]);

  const getElapsedTime = (createdTime: string) => {
    const diffMins = Math.floor((Date.now() - new Date(createdTime).getTime()) / 60000);
    if (diffMins < 1) return 'Just now';
    return `${diffMins}m ago`;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-6 pb-12 font-sans">
      {/* Kitchen Top Bar */}
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-neutral-800 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-600/30">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center space-x-2">
              <span>Mapple Inn Kitchen Order Board</span>
              <span className="text-xs bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold px-2 py-0.5 rounded-full">
                KDS Realtime
              </span>
            </h1>
            <p className="text-xs text-neutral-400">
              Live touch-screen ticket manager for pure veg room dining preparation.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Navigation to Dashboard */}
          <Link
            to="/admin"
            className="flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-neutral-800 transition"
          >
            <LayoutDashboard className="w-4 h-4 text-amber-400" />
            <span>Admin Dashboard</span>
          </Link>

          {/* Navigation to Home */}
          <Link
            to="/"
            className="flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-neutral-800 transition"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Website</span>
          </Link>

          {/* Audio Chime Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              soundEnabled
                ? 'bg-amber-600/20 border-amber-500/40 text-amber-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            <span>Audio: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <div className="bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800 text-xs text-neutral-300">
            Active: <strong className="text-white">{newOrders.length + preparingOrders.length + readyOrders.length}</strong>
          </div>
        </div>
      </div>

      {/* Visual Flashing Banner if new incoming orders exist */}
      {newOrders.length > 0 && (
        <div className="max-w-[1600px] mx-auto mb-6 bg-gradient-to-r from-red-950 via-amber-950 to-neutral-900 border-2 border-red-500/80 rounded-2xl p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3">
            <Flame className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                {newOrders.length} NEW ORDER{newOrders.length > 1 ? 'S' : ''} WAITING FOR ACCEPTANCE!
              </h3>
              <p className="text-xs text-neutral-300">
                Review items and tap "Accept & Start Preparing" to begin cooking.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board Columns Grid */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* COLUMN 1: NEW ORDERS */}
        <div className="bg-neutral-900/90 rounded-2xl p-4 border border-neutral-800 flex flex-col h-[calc(100vh-210px)] min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
              <h2 className="font-bold text-sm text-white uppercase tracking-wider">
                1. New Orders ({newOrders.length})
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {newOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 text-xs">
                <Utensils className="w-8 h-8 mb-2 opacity-40" />
                <span>No new incoming orders</span>
              </div>
            ) : (
              newOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-neutral-950 border-2 border-amber-600/70 rounded-2xl p-4 shadow-lg space-y-3 hover:border-amber-500 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-amber-400 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-700/50">
                      ROOM {order.room_number}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-amber-500" />
                      {getElapsedTime(order.created_at)}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-300 font-mono">
                    #{order.order_number} • {order.guest_name}
                  </div>

                  {/* Item List */}
                  <div className="bg-neutral-900 rounded-xl p-3 space-y-2 border border-neutral-800 text-xs">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div>
                          <span className="text-amber-300 font-bold text-sm mr-2">{item.quantity}x</span>
                          <span className="text-white font-medium">{item.item_name_snapshot}</span>
                          {item.variant_snapshot && (
                            <span className="text-neutral-400 block text-[11px]">({item.variant_snapshot})</span>
                          )}
                          {item.note && (
                            <span className="text-amber-400 block italic text-[11px]">"{item.note}"</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.guest_note && (
                    <div className="p-2.5 bg-neutral-900 border border-amber-700/40 rounded-xl text-xs text-amber-200">
                      <strong>Special Note:</strong> {order.guest_note}
                    </div>
                  )}

                  {/* Payment Verification Status */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.payment_status === 'paid'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {order.payment_status === 'paid' ? 'PAID ✓' : 'VERIFICATION PENDING'}
                    </span>
                    <span className="text-xs font-bold text-neutral-300">{formatCurrency(order.total)}</span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition transform active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <span>Accept & Start Preparing</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: PREPARING */}
        <div className="bg-neutral-900/90 rounded-2xl p-4 border border-neutral-800 flex flex-col h-[calc(100vh-210px)] min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <h2 className="font-bold text-sm text-white uppercase tracking-wider">
                2. Preparing ({preparingOrders.length})
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {preparingOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 text-xs">
                <span>No orders currently on stove</span>
              </div>
            ) : (
              preparingOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-amber-400">ROOM {order.room_number}</span>
                    <span className="text-xs text-neutral-400 font-mono">{getElapsedTime(order.created_at)}</span>
                  </div>

                  <div className="text-xs text-neutral-400 font-mono">#{order.order_number}</div>

                  <div className="bg-neutral-900 rounded-xl p-3 space-y-2 text-xs">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <span className="text-amber-400 font-bold text-sm mr-2">{item.quantity}x</span>
                          <span className="text-white">{item.item_name_snapshot}</span>
                          {item.variant_snapshot && <span className="text-neutral-400 block">({item.variant_snapshot})</span>}
                          {item.note && <span className="text-amber-300 italic block">"{item.note}"</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition transform active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <span>Mark Ready & Packed</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: READY & PACKED */}
        <div className="bg-neutral-900/90 rounded-2xl p-4 border border-neutral-800 flex flex-col h-[calc(100vh-210px)] min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <h2 className="font-bold text-sm text-white uppercase tracking-wider">
                3. Ready for Dispatch ({readyOrders.length})
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {readyOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 text-xs">
                <span>No orders waiting for pickup</span>
              </div>
            ) : (
              readyOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-neutral-950 border border-blue-900 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-blue-400">ROOM {order.room_number}</span>
                    <span className="text-xs text-neutral-400 font-mono">Ready</span>
                  </div>

                  <div className="text-xs text-neutral-400 font-mono">#{order.order_number}</div>

                  <div className="bg-neutral-900 rounded-xl p-3 space-y-1.5 text-xs text-neutral-300">
                    {order.items.map(item => (
                      <div key={item.id}>
                        <span className="font-bold text-white">{item.quantity}x</span> {item.item_name_snapshot}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition transform active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Delivered to Guest</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 4: COMPLETED */}
        <div className="bg-neutral-900/90 rounded-2xl p-4 border border-neutral-800 flex flex-col h-[calc(100vh-210px)] min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <h2 className="font-bold text-sm text-white uppercase tracking-wider">
                4. Completed ({completedOrders.length})
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {completedOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 text-xs">
                <span>No delivered orders yet</span>
              </div>
            ) : (
              completedOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-3 text-xs opacity-75 hover:opacity-100 transition space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Room {order.room_number}</span>
                    <span className="text-emerald-400 font-bold text-[10px]">DELIVERED ✓</span>
                  </div>
                  <div className="text-neutral-500 font-mono text-[11px]">#{order.order_number}</div>
                  <div className="text-neutral-400 text-[11px] truncate">
                    {order.items.map(i => `${i.quantity}x ${i.item_name_snapshot}`).join(', ')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
