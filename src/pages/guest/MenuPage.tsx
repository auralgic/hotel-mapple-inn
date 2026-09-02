import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useHotelData } from '../../context/HotelDataContext';
import { useCart } from '../../context/CartContext';
import { validateRoomToken, generateRoomToken } from '../../lib/qr';
import { formatCurrency } from '../../lib/formatters';
import { MenuItem, ItemVariant } from '../../types';
import { Search, Utensils, ShoppingBag, Plus, Minus, Check, AlertCircle, Info, ChevronRight, Sparkles } from 'lucide-react';

export const MenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { categories, menuItems, rooms, settings } = useHotelData();
  const { roomNumber, token, setRoomDetails, addItem, updateQuantity, items: cartItems, totalItemCount, totalAmount } = useCart();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, ItemVariant>>({});
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Check URL params on mount
  useEffect(() => {
    const urlRoom = searchParams.get('room');
    const urlToken = searchParams.get('token');

    if (urlRoom) {
      // Find room in database
      const registeredTokens: Record<string, string> = {};
      rooms.forEach(r => {
        registeredTokens[r.room_number] = r.qr_token_hash;
      });

      const isValid = urlToken ? validateRoomToken(urlRoom, urlToken, registeredTokens) : false;

      if (isValid) {
        setRoomDetails(urlRoom, urlToken || '', true);
        setTokenError(null);
      } else if (!urlToken) {
        // Fallback demo auto-token if visiting directly
        const generated = generateRoomToken(urlRoom);
        setRoomDetails(urlRoom, generated, true);
        setTokenError(null);
      } else {
        setTokenError(`QR Token for Room ${urlRoom} is invalid or has expired.`);
        setRoomDetails(urlRoom, '', false);
      }
    }
  }, [searchParams, rooms, setRoomDetails]);

  // Filter items
  const filteredItems = menuItems.filter(item => {
    if (!item.available) return false; // Guest menu hides unavailable items
    if (activeCategory !== 'all' && item.category_id !== activeCategory) return false;
    if (vegOnly && item.veg_type !== 'veg') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  const getItemQuantityInCart = (item: MenuItem, variant?: ItemVariant) => {
    const vName = variant ? variant.name : undefined;
    const found = cartItems.find(ci => ci.menu_item.id === item.id && ci.variant?.name === vName);
    return found ? found.quantity : 0;
  };

  const handleAdd = (item: MenuItem) => {
    const variant = item.variants_json && item.variants_json.length > 0 ? (selectedVariant[item.id] || item.variants_json[0]) : undefined;
    addItem(item, variant);
  };

  const handleDecrease = (item: MenuItem) => {
    const variant = item.variants_json && item.variants_json.length > 0 ? (selectedVariant[item.id] || item.variants_json[0]) : undefined;
    const currentQty = getItemQuantityInCart(item, variant);
    updateQuantity(item.id, currentQty - 1, variant?.name);
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] pb-28">
      {/* Room Service Header Banner */}
      <div className="bg-neutral-900 text-white pt-8 pb-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-hotel-500/20 text-hotel-300 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                <Utensils className="w-3.5 h-3.5" />
                <span>Room Service Menu</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                Order Directly to Your Room
              </h1>
              <p className="text-xs text-neutral-300 mt-1">
                Freshly prepared Rajasthani & North Indian favourites delivered hot to your doorstep.
              </p>
            </div>

            {/* Room Identifier Badge */}
            <div className="bg-hotel-800/80 border border-hotel-600/50 rounded-xl px-4 py-2 text-right">
              <span className="text-[10px] text-hotel-300 uppercase tracking-wider block font-semibold">Detected Room</span>
              <div className="text-xl font-black text-white flex items-center justify-end space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Room {roomNumber}</span>
              </div>
            </div>
          </div>

          {tokenError && (
            <div className="mt-4 bg-amber-900/60 border border-amber-500/40 text-amber-200 p-3 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{tokenError} Please rescan the QR on your room table.</span>
            </div>
          )}
        </div>
      </div>

      {/* Search & Sticky Filter Bar */}
      <div className="sticky top-[29px] bg-white/95 backdrop-blur-md border-b border-hotel-200 shadow-sm z-30 px-4 py-3">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Search Box & Veg Toggle */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dishes (e.g., Thali, Paneer, Maggi, Chai)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition shrink-0 ${
                vegOnly
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Veg Only</span>
            </button>
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === 'all'
                  ? 'bg-hotel-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Items ({menuItems.filter(i => i.available).length})
            </button>
            {categories.map(cat => {
              const count = menuItems.filter(i => i.category_id === cat.id && i.available).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    activeCategory === cat.id
                      ? 'bg-hotel-600 text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Items List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-hotel-200 p-8">
            <Utensils className="w-12 h-12 text-hotel-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-neutral-800">No menu items found</h3>
            <p className="text-xs text-neutral-500 mt-1">Try changing the category or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(item => {
              const currentVariant = item.variants_json && item.variants_json.length > 0
                ? (selectedVariant[item.id] || item.variants_json[0])
                : undefined;
              const displayPrice = currentVariant ? currentVariant.price : item.price;
              const qtyInCart = getItemQuantityInCart(item, currentVariant);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-hotel-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="flex space-x-3.5">
                    {/* Item Image */}
                    {item.image_url && (
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur rounded p-0.5 shadow">
                          <span
                            className={`w-2.5 h-2.5 rounded-full block ${
                              item.veg_type === 'veg' ? 'bg-emerald-600' : 'bg-red-600'
                            }`}
                          ></span>
                        </div>
                      </div>
                    )}

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-sm text-neutral-900 leading-snug">
                            {item.name}
                          </h3>
                          {item.featured && (
                            <span className="inline-flex items-center text-[10px] text-amber-700 bg-amber-50 font-semibold px-1.5 py-0.5 rounded mt-0.5">
                              ★ Chef Special
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Variant Selector if available */}
                      {item.variants_json && item.variants_json.length > 0 && (
                        <div className="flex items-center space-x-1.5 mt-2.5">
                          {item.variants_json.map(v => (
                            <button
                              key={v.name}
                              onClick={() => setSelectedVariant(prev => ({ ...prev, [item.id]: v }))}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition ${
                                (currentVariant?.name === v.name)
                                  ? 'bg-hotel-600 text-white border-hotel-600'
                                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                              }`}
                            >
                              {v.name} ({formatCurrency(v.price)})
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                    <div>
                      <span className="text-base font-bold text-neutral-900">
                        {formatCurrency(displayPrice)}
                      </span>
                      <span className="text-[10px] text-neutral-400 block">+5% GST</span>
                    </div>

                    {qtyInCart > 0 ? (
                      <div className="flex items-center space-x-2 bg-hotel-50 border border-hotel-300 rounded-xl p-1">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="w-7 h-7 bg-white rounded-lg shadow-sm flex items-center justify-center text-hotel-700 hover:bg-hotel-100 font-bold active:scale-95 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-hotel-900 px-1.5">{qtyInCart}</span>
                        <button
                          onClick={() => handleAdd(item)}
                          className="w-7 h-7 bg-hotel-600 rounded-lg shadow-sm flex items-center justify-center text-white hover:bg-hotel-700 font-bold active:scale-95 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAdd(item)}
                        className="inline-flex items-center space-x-1.5 bg-hotel-600 hover:bg-hotel-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-neutral-900/95 backdrop-blur-md text-white border-t border-neutral-800 p-4 z-40 shadow-2xl">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-hotel-600 flex items-center justify-center text-white font-bold relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-white text-neutral-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItemCount}
                </span>
              </div>
              <div>
                <span className="text-xs text-neutral-400 block font-medium">Your Room {roomNumber} Cart</span>
                <span className="text-base font-bold text-white">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <Link
              to="/order/cart"
              className="inline-flex items-center space-x-2 bg-hotel-600 hover:bg-hotel-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-hotel-600/30 transition transform active:scale-95"
            >
              <span>View Cart & Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
