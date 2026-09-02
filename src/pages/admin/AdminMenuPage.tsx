import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { MenuItem, MenuCategory } from '../../types';
import { formatCurrency } from '../../lib/formatters';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const AdminMenuPage: React.FC = () => {
  const { categories, menuItems, toggleItemAvailability, addMenuItem, updateMenuItem, deleteMenuItem } = useHotelData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'sandwiches');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(150);
  const [imageUrl, setImageUrl] = useState('');
  const [vegType, setVegType] = useState<'veg' | 'non_veg' | 'egg'>('veg');
  const [prepTime, setPrepTime] = useState(15);
  const [featured, setFeatured] = useState(false);

  const filteredItems = menuItems.filter(item => {
    if (selectedCategory !== 'all' && item.category_id !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice(150);
    setImageUrl('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop');
    setVegType('veg');
    setPrepTime(15);
    setFeatured(false);
    setItemModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategoryId(item.category_id);
    setDescription(item.description);
    setPrice(item.price);
    setImageUrl(item.image_url || '');
    setVegType(item.veg_type);
    setPrepTime(item.prep_time_minutes);
    setFeatured(item.featured);
    setItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      updateMenuItem({
        ...editingItem,
        name,
        category_id: categoryId,
        description,
        price,
        image_url: imageUrl,
        veg_type: vegType,
        prep_time_minutes: prepTime,
        featured,
      });
    } else {
      addMenuItem({
        category_id: categoryId,
        name,
        description,
        price,
        tax_rate: 5,
        image_url: imageUrl,
        veg_type: vegType,
        prep_time_minutes: prepTime,
        available: true,
        featured,
        sort_order: menuItems.length + 1,
      });
    }
    setItemModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-hotel-600 uppercase tracking-widest block mb-1">
            Kitchen Catalog
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Digital Menu & Recipe Manager
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Toggle item availability instantly or modify dishes, prices, and chef specials.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 bg-hotel-600 hover:bg-hotel-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items by name or ingredients..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-hotel-600 text-white shadow-sm'
                : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            All Categories ({menuItems.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-hotel-600 text-white shadow-sm'
                  : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {cat.name} ({menuItems.filter(i => i.category_id === cat.id).length})
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-neutral-50 text-neutral-800 uppercase tracking-wider font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-5 py-3.5">Dish</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price (₹)</th>
                <th className="px-5 py-3.5">Prep Time</th>
                <th className="px-5 py-3.5">Instant Availability</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-neutral-50 transition">
                  <td className="px-5 py-3 flex items-center space-x-3">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-neutral-100 shrink-0"
                      />
                    )}
                    <div>
                      <div className="font-bold text-neutral-900 flex items-center space-x-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.veg_type === 'veg' ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                        ></span>
                        <span>{item.name}</span>
                        {item.featured && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 rounded">
                            Special
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 max-w-xs">{item.description}</p>
                    </div>
                  </td>

                  <td className="px-5 py-3 capitalize font-semibold text-neutral-700">
                    {categories.find(c => c.id === item.category_id)?.name || item.category_id}
                  </td>

                  <td className="px-5 py-3 text-sm font-bold text-neutral-900">
                    {formatCurrency(item.price)}
                  </td>

                  <td className="px-5 py-3 text-neutral-500">
                    {item.prep_time_minutes} mins
                  </td>

                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                        item.available
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      <span>{item.available ? 'In Stock (Live)' : 'Sold Out (Hidden)'}</span>
                    </button>
                  </td>

                  <td className="px-5 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-neutral-600 hover:text-hotel-700 hover:bg-hotel-50 rounded-lg transition"
                      title="Edit Item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${item.name}" from menu?`)) {
                          deleteMenuItem(item.id);
                        }
                      }}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Item Modal */}
      {itemModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setItemModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-neutral-900 mb-4">
              {editingItem ? 'Edit Dish Details' : 'Add New Dish to Digital Menu'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-hotel-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-neutral-300 bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-300"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Type</label>
                  <select
                    value={vegType}
                    onChange={e => setVegType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-neutral-300 bg-white"
                  >
                    <option value="veg">Pure Veg</option>
                    <option value="non_veg">Non-Veg</option>
                    <option value="egg">Egg</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    value={prepTime}
                    onChange={e => setPrepTime(Number(e.target.value))}
                    className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="feat"
                  checked={featured}
                  onChange={e => setFeatured(e.target.checked)}
                  className="rounded text-hotel-600 focus:ring-hotel-500"
                />
                <label htmlFor="feat" className="text-xs font-semibold text-neutral-700">
                  Mark as Chef's Special / Featured Item
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-hotel-600 hover:bg-hotel-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition"
              >
                {editingItem ? 'Save Changes' : 'Add Item to Menu'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
