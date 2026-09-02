import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { QRCodeSVG } from 'qrcode.react';
import { buildGuestRoomUrl } from '../../lib/qr';
import { QrCode, Printer, RefreshCw, Sparkles, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { Room } from '../../types';

export const AdminQRPage: React.FC = () => {
  const { rooms, regenerateRoomQR } = useHotelData();
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [rotatedSuccessRoom, setRotatedSuccessRoom] = useState<string | null>(null);

  const filteredRooms = rooms.filter(r => selectedFloor === 'all' || r.floor === selectedFloor);

  const handleRotate = (room: Room) => {
    regenerateRoomQR(room.id);
    setRotatedSuccessRoom(room.room_number);
    setTimeout(() => setRotatedSuccessRoom(null), 3000);
  };

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header (hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <span className="text-xs font-semibold text-hotel-600 uppercase tracking-widest block mb-1">
            In-Room Dining Hardware
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            16 Room QR Code Table Stands (201–208 & 301–308)
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Print these individual QR cards to paste inside rooms 201–208 (Floor 2) and 301–308 (Floor 3).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Floor filter */}
          <div className="bg-white p-1 rounded-xl border border-neutral-200 shadow-sm flex text-xs">
            <button
              onClick={() => setSelectedFloor('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedFloor === 'all' ? 'bg-hotel-600 text-white' : 'text-neutral-600'
              }`}
            >
              All 16
            </button>
            <button
              onClick={() => setSelectedFloor(2)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedFloor === 2 ? 'bg-hotel-600 text-white' : 'text-neutral-600'
              }`}
            >
              Floor 2 (201-208)
            </button>
            <button
              onClick={() => setSelectedFloor(3)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedFloor === 3 ? 'bg-hotel-600 text-white' : 'text-neutral-600'
              }`}
            >
              Floor 3 (301-308)
            </button>
          </div>

          <button
            onClick={handlePrintAll}
            className="inline-flex items-center space-x-2 bg-hotel-600 hover:bg-hotel-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Acrylic QR Sheet</span>
          </button>
        </div>
      </div>

      {rotatedSuccessRoom && (
        <div className="no-print bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-2xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Security token for Room {rotatedSuccessRoom} rotated successfully! Previous QR stands are now revoked.</span>
        </div>
      )}

      {/* 16 Acrylic Stand Printable Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRooms.map(room => {
          const roomUrl = buildGuestRoomUrl(room.room_number, room.qr_token_hash);

          return (
            <div
              key={room.id}
              className="bg-white rounded-3xl p-6 border-2 border-hotel-300 shadow-md text-center flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <span className="text-[10px] font-bold text-hotel-600 uppercase tracking-widest block mb-1">
                  HOTEL MAPPLE INN • JAIPUR
                </span>
                <h3 className="font-serif text-2xl font-black text-neutral-900 mb-0.5">
                  ROOM {room.room_number}
                </h3>
                <span className="text-[11px] text-neutral-500 font-semibold block mb-4">
                  {room.room_type?.name} (Floor {room.floor})
                </span>

                {/* QR Container */}
                <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-hotel-200 inline-block mb-4 shadow-sm">
                  <QRCodeSVG
                    value={roomUrl}
                    size={140}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="space-y-1 text-xs text-neutral-700 mb-4">
                  <div className="font-bold uppercase tracking-wider text-hotel-800 text-[11px]">
                    SCAN • SELECT • PAY • RELAX
                  </div>
                  <p className="text-[10px] text-neutral-500">
                    Scan with phone camera to order food & beverages directly to this room.
                  </p>
                </div>
              </div>

              {/* Admin Actions (hidden on print) */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between no-print text-xs">
                <button
                  type="button"
                  onClick={() => handleRotate(room)}
                  className="text-neutral-500 hover:text-hotel-700 font-medium inline-flex items-center space-x-1 text-[11px]"
                  title="Revoke & Regenerate QR"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Regen Token</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="text-hotel-700 hover:text-hotel-900 font-bold inline-flex items-center space-x-1 text-[11px]"
                >
                  <Printer className="w-3 h-3" />
                  <span>Print Card</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
