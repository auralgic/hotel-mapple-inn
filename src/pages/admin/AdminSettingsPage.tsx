import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { Settings, Save, CheckCircle, Hotel, QrCode, Phone, Mail, Clock, DollarSign } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useHotelData();
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-hotel-600 uppercase tracking-widest block mb-1">
          System Configuration
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
          Hotel Profile & Operations Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          All factual hotel details, UPI payment parameters, and stay policies are editable here without modifying code.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">Settings saved successfully and applied across all guest and staff screens!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Hotel Info */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center space-x-2">
            <Hotel className="w-5 h-5 text-hotel-600" />
            <span>Property Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Hotel Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-hotel-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-hotel-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Physical Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-hotel-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Reception Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">WhatsApp Booking</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300"
              />
            </div>
          </div>
        </div>

        {/* UPI Payment Configuration */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-hotel-600" />
            <span>UPI Payment Gateway / Intent Parameters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Hotel UPI VPA / ID</label>
              <input
                type="text"
                required
                value={formData.upiVpa}
                onChange={e => setFormData({ ...formData, upiVpa: e.target.value })}
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300 font-mono focus:ring-2 focus:ring-hotel-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Payee Name in Bank</label>
              <input
                type="text"
                required
                value={formData.upiName}
                onChange={e => setFormData({ ...formData, upiName: e.target.value })}
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-hotel-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">GST Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.taxRate}
                onChange={e => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Minimum Order (₹)</label>
              <input
                type="number"
                value={formData.minOrderAmount}
                onChange={e => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours & Timings */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-hotel-600" />
            <span>Stay Timings & Dining Hours</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Check-In Time</label>
              <input
                type="text"
                value={formData.checkInTime}
                onChange={e => setFormData({ ...formData, checkInTime: e.target.value })}
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Check-Out Time</label>
              <input
                type="text"
                value={formData.checkOutTime}
                onChange={e => setFormData({ ...formData, checkOutTime: e.target.value })}
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Kitchen Service Hours</label>
              <input
                type="text"
                value={formData.roomServiceHours}
                onChange={e => setFormData({ ...formData, roomServiceHours: e.target.value })}
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-300"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-hotel-600 hover:bg-hotel-700 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Hotel Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
