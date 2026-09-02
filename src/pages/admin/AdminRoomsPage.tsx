import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { formatCurrency, formatDate } from '../../lib/formatters';
import {
  BedDouble,
  CheckCircle2,
  Clock,
  Wrench,
  Sparkles,
  UserCheck,
  AlertCircle,
  FileText,
  Printer,
  X,
  Search,
  Filter,
  IndianRupee,
  Save,
  Edit3,
} from 'lucide-react';
import { Room, RoomStatus } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import { buildGuestRoomUrl } from '../../lib/qr';

export const AdminRoomsPage: React.FC = () => {
  const { rooms, updateRoomStatus, updateRoomPrice, bookings, orders } = useHotelData();
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [qrModalRoom, setQrModalRoom] = useState<Room | null>(null);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);

  // Pricing State
  const deluxePrice = rooms.find(r => r.room_type_id === 'rt-deluxe')?.room_type?.base_price || 2200;
  const superDeluxePrice = rooms.find(r => r.room_type_id === 'rt-super-deluxe')?.room_type?.base_price || 2800;
  const executivePrice = rooms.find(r => r.room_type_id === 'rt-executive')?.room_type?.base_price || 3800;

  const [deluxeInput, setDeluxeInput] = useState(deluxePrice);
  const [superDeluxeInput, setSuperDeluxeInput] = useState(superDeluxePrice);
  const [executiveInput, setExecutiveInput] = useState(executivePrice);
  const [priceSavedSuccess, setPriceSavedSuccess] = useState(false);

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    updateRoomPrice('rt-deluxe', Number(deluxeInput));
    updateRoomPrice('rt-super-deluxe', Number(superDeluxeInput));
    updateRoomPrice('rt-executive', Number(executiveInput));
    setPriceSavedSuccess(true);
    setTimeout(() => {
      setPriceSavedSuccess(false);
      setPricingModalOpen(false);
    }, 1200);
  };

  const filteredRooms = rooms.filter(r => {
    if (selectedFloor !== 'all' && r.floor !== selectedFloor) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'occupied':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'cleaning':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'reserved':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'maintenance':
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
      default:
        return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  const activeBooking = selectedRoom?.current_guest?.booking_id
    ? bookings.find(b => b.id === selectedRoom.current_guest?.booking_id)
    : null;

  const roomOrders = selectedRoom
    ? orders.filter(o => o.room_number === selectedRoom.room_number)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-hotel-600 uppercase tracking-widest block mb-1">
            Property Grid
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            16 Boutique Rooms (Floors 2 & 3)
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Floor 2: Rooms 201–208 | Floor 3: Rooms 301–308. Click any room to manage status or edit rates.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => {
              setDeluxeInput(deluxePrice);
              setSuperDeluxeInput(superDeluxePrice);
              setExecutiveInput(executivePrice);
              setPricingModalOpen(true);
            }}
            className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-xl shadow-sm transition flex items-center space-x-1.5"
          >
            <IndianRupee className="w-4 h-4" />
            <span>Edit Room Rates</span>
          </button>

          <div className="bg-white p-1 rounded-xl border border-neutral-200 shadow-sm flex items-center space-x-1">
            <button
              onClick={() => setSelectedFloor('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedFloor === 'all' ? 'bg-hotel-600 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All 16
            </button>
            <button
              onClick={() => setSelectedFloor(2)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedFloor === 2 ? 'bg-hotel-600 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Floor 2
            </button>
            <button
              onClick={() => setSelectedFloor(3)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedFloor === 3 ? 'bg-hotel-600 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Floor 3
            </button>
          </div>
        </div>
      </div>

      {/* Room Status Filter Pills */}
      <div className="flex items-center space-x-2 text-xs overflow-x-auto pb-2">
        {['all', 'available', 'occupied', 'cleaning', 'reserved', 'maintenance'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl font-bold uppercase transition whitespace-nowrap ${
              statusFilter === st
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Room Grid (16 Sharp Rectangles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredRooms.map(room => (
          <div
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm hover:border-amber-700 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xl font-bold text-neutral-900">
                    {room.room_number}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-bold bg-neutral-100 px-2 py-0.5 rounded">
                    Fl {room.floor}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${getStatusColor(
                    room.status
                  )}`}
                >
                  {room.status}
                </span>
              </div>

              <div className="text-xs space-y-1 mb-4">
                <div className="font-semibold text-neutral-900">
                  {room.room_type?.name}
                </div>
                <div className="text-amber-800 font-bold text-sm">
                  {formatCurrency(room.room_type?.base_price || 2200)} / night
                </div>
                {room.current_guest ? (
                  <div className="text-neutral-600 flex items-center space-x-1 pt-1 border-t border-neutral-100">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-medium truncate">{room.current_guest.name}</span>
                  </div>
                ) : (
                  <div className="text-neutral-400 text-[11px] pt-1">
                    Ready for check-in
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setQrModalRoom(room);
                }}
                className="text-hotel-600 hover:text-hotel-800 font-bold text-[11px]"
              >
                View QR
              </button>
              <span className="text-neutral-400 text-[11px]">Manage →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Room Rates Modal */}
      {pricingModalOpen && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 relative">
            <button
              onClick={() => setPricingModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
              <IndianRupee className="w-4 h-4" />
              <span>Room Rate Management</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-1">
              Update Category Nightly Rates
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              Changes will instantly reflect across the public booking engine and reservation folios.
            </p>

            <form onSubmit={handleSavePrices} className="space-y-4">
              <div className="space-y-3">
                {/* Deluxe Room */}
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-neutral-900">
                      Deluxe King Room
                    </label>
                    <span className="text-[10px] text-neutral-500">6 Rooms (201, 202, 205, 206, 301, 302)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-neutral-500">₹</span>
                    <input
                      type="number"
                      required
                      min={500}
                      step={50}
                      value={deluxeInput}
                      onChange={e => setDeluxeInput(Number(e.target.value))}
                      className="w-24 bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>
                </div>

                {/* Super Deluxe Balcony Room */}
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-neutral-900">
                      Super Deluxe Balcony
                    </label>
                    <span className="text-[10px] text-neutral-500">6 Rooms (203, 204, 207, 208, 303, 304)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-neutral-500">₹</span>
                    <input
                      type="number"
                      required
                      min={500}
                      step={50}
                      value={superDeluxeInput}
                      onChange={e => setSuperDeluxeInput(Number(e.target.value))}
                      className="w-24 bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>
                </div>

                {/* Executive Master Suite */}
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-neutral-900">
                      Executive Master Suite
                    </label>
                    <span className="text-[10px] text-neutral-500">4 Suites (305, 306, 307, 308)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-neutral-500">₹</span>
                    <input
                      type="number"
                      required
                      min={500}
                      step={50}
                      value={executiveInput}
                      onChange={e => setExecutiveInput(Number(e.target.value))}
                      className="w-24 bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>
                </div>
              </div>

              {priceSavedSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg text-center animate-fadeIn">
                  ✓ Rates saved successfully!
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPricingModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Rates</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Room Detail Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-neutral-200 relative">
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 uppercase mb-1">
              <BedDouble className="w-4 h-4" />
              <span>Room {selectedRoom.room_number} Details</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900">
              {selectedRoom.room_type?.name} (Floor {selectedRoom.floor})
            </h3>
            <span className="text-xs text-amber-800 font-bold block mb-4">
              Base Rate: {formatCurrency(selectedRoom.room_type?.base_price || 2200)} / night
            </span>

            {/* Change Status Buttons */}
            <div className="space-y-2 mb-6">
              <label className="block text-xs font-bold text-neutral-700">
                Update Live Status:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['available', 'occupied', 'cleaning', 'reserved', 'maintenance'] as RoomStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      updateRoomStatus(selectedRoom.id, st);
                      setSelectedRoom({ ...selectedRoom, status: st });
                    }}
                    className={`py-2 px-3 rounded-lg font-bold uppercase text-[11px] transition ${
                      selectedRoom.status === st
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Booking Info */}
            {activeBooking && (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mb-4 text-xs space-y-1">
                <div className="font-bold text-amber-900">Active Guest Booking:</div>
                <div className="text-neutral-800">
                  Guest: <strong>{activeBooking.guest?.name || 'Guest'}</strong> ({activeBooking.guest?.phone || 'N/A'})
                </div>
                <div className="text-neutral-600">
                  Dates: {formatDate(activeBooking.check_in)} → {formatDate(activeBooking.check_out)}
                </div>
                <div className="text-neutral-800 font-bold">
                  Total Folio: {formatCurrency(activeBooking.total)}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedRoom(null)}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalRoom && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 text-center relative">
            <button
              onClick={() => setQrModalRoom(null)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-neutral-900 mb-1">
              Room {qrModalRoom.room_number} Dining QR
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Guests scan this QR to order food directly to Room {qrModalRoom.room_number}.
            </p>

            <div className="bg-white p-4 border border-neutral-200 rounded-xl inline-block mb-4 shadow-sm">
              <QRCodeSVG
                value={buildGuestRoomUrl(qrModalRoom.room_number, qrModalRoom.qr_token_hash)}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => window.print()}
                className="bg-neutral-900 hover:bg-black text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print QR Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
