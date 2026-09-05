import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { QRCodeSVG } from 'qrcode.react';
import { buildGuestRoomUrl } from '../../lib/qr';
import { QrCode, Printer, RefreshCw, Sparkles, CheckCircle2, ShieldCheck, Download, Layers } from 'lucide-react';
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

  // Helper to open a pristine printable popup for a Single Table Stand
  const handlePrintSingleStand = (room: Room) => {
    const svgEl = document.getElementById(`qr-svg-${room.room_number}`);
    const svgHtml = svgEl ? svgEl.outerHTML : '';
    const roomUrl = buildGuestRoomUrl(room.room_number, room.qr_token_hash);

    const printWin = window.open('', '_blank', 'width=700,height=900');
    if (!printWin) return;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Table Stand - Room ${room.room_number} - Hotel Mapple Inn</title>
          <style>
            @page {
              size: A5 portrait;
              margin: 12mm;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .no-print-btn { display: none !important; }
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              background-color: #ffffff;
              color: #1a1a1a;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 20px;
            }
            .stand-card {
              width: 130mm;
              height: 190mm;
              border: 3px solid #b48c48;
              border-radius: 16px;
              padding: 24px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              text-align: center;
              background: #fffdf9;
              position: relative;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            .inner-border {
              position: absolute;
              inset: 6px;
              border: 1px solid #d4af37;
              border-radius: 12px;
              pointer-events: none;
            }
            .hotel-name {
              font-family: Georgia, serif;
              font-size: 18px;
              font-weight: bold;
              letter-spacing: 3px;
              color: #78521a;
              text-transform: uppercase;
              margin-top: 8px;
            }
            .sub-title {
              font-size: 10px;
              letter-spacing: 2px;
              color: #8c7853;
              text-transform: uppercase;
              margin-top: 2px;
            }
            .room-banner {
              margin: 12px 0 6px 0;
              background: #1a1a1a;
              color: #ffffff;
              padding: 6px 24px;
              border-radius: 30px;
              display: inline-block;
            }
            .room-num {
              font-size: 24px;
              font-weight: 900;
              letter-spacing: 1px;
            }
            .category-name {
              font-size: 12px;
              color: #666;
              font-weight: 600;
            }
            .qr-box {
              background: #ffffff;
              padding: 16px;
              border-radius: 16px;
              border: 2px solid #e8dec8;
              margin: 12px 0;
              display: inline-flex;
              justify-content: center;
              align-items: center;
              box-shadow: 0 2px 10px rgba(0,0,0,0.04);
            }
            .instructions {
              font-size: 12px;
              font-weight: bold;
              letter-spacing: 1px;
              color: #78521a;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .instructions-sub {
              font-size: 10.5px;
              color: #555;
              max-width: 90%;
              line-height: 1.4;
            }
            .wifi-box {
              width: 100%;
              background: #f7f4ec;
              border: 1px dashed #c4a768;
              border-radius: 8px;
              padding: 8px 12px;
              font-size: 10.5px;
              color: #444;
              margin-top: 8px;
              display: flex;
              justify-content: space-around;
            }
            .wifi-box strong {
              color: #1a1a1a;
            }
            .footer-tag {
              font-size: 9px;
              color: #999;
              letter-spacing: 1px;
              text-transform: uppercase;
              margin-top: 6px;
            }
            .no-print-btn {
              margin-bottom: 20px;
              background: #78521a;
              color: white;
              border: none;
              padding: 10px 24px;
              font-size: 14px;
              font-weight: bold;
              border-radius: 8px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <button class="no-print-btn" onclick="window.print()">🖨️ Click Here to Print Stand Card</button>
          
          <div class="stand-card">
            <div class="inner-border"></div>
            
            <div>
              <div class="hotel-name">Hotel Mapple Inn</div>
              <div class="sub-title">Jaipur • In-Room Dining & Services</div>
              
              <div class="room-banner">
                <div class="room-num">ROOM ${room.room_number}</div>
              </div>
              <div class="category-name">${room.room_type?.name || 'Boutique Room'} • Floor ${room.floor}</div>
            </div>

            <div class="qr-box">
              ${svgHtml}
            </div>

            <div>
              <div class="instructions">Scan to Order Pure Veg Dining</div>
              <div class="instructions-sub">Point your phone camera at this QR to view full in-room dining menu, explore Jaipur travel guides, and request housekeeping.</div>
              
              <div class="wifi-box">
                <div>📶 Wi-Fi: <strong>MappleInn_Guest</strong></div>
                <div>🛎️ Front Desk: <strong>Dial 9 / WhatsApp</strong></div>
              </div>

              <div class="footer-tag">Freshly Prepared • Room Service Folio</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  // Helper to open a pristine printable A4 sheet with 4 cuttable acrylic cards per page
  const handlePrintBatchA4 = () => {
    const cards = filteredRooms.map(room => {
      const svgEl = document.getElementById(`qr-svg-${room.room_number}`);
      const svgHtml = svgEl ? svgEl.outerHTML : '';
      return {
        room,
        svgHtml,
      };
    });

    const printWin = window.open('', '_blank', 'width=900,height=1000');
    if (!printWin) return;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>A4 Acrylic QR Code Stands - Hotel Mapple Inn</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 8mm;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .no-print-btn { display: none !important; }
              .page-break { page-break-after: always; }
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              background-color: #ffffff;
              color: #1a1a1a;
              padding: 10px;
            }
            .no-print-btn {
              display: block;
              margin: 0 auto 16px auto;
              background: #78521a;
              color: white;
              border: none;
              padding: 12px 28px;
              font-size: 15px;
              font-weight: bold;
              border-radius: 8px;
              cursor: pointer;
            }
            .a4-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-template-rows: 1fr 1fr;
              gap: 8mm;
              height: 275mm;
              page-break-after: always;
            }
            .a4-grid:last-child {
              page-break-after: auto;
            }
            .stand-cell {
              border: 1.5px dashed #c4a768;
              border-radius: 12px;
              padding: 12px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              text-align: center;
              background: #fffdf9;
              position: relative;
            }
            .hotel-header {
              font-family: Georgia, serif;
              font-size: 13px;
              font-weight: bold;
              letter-spacing: 2px;
              color: #78521a;
              text-transform: uppercase;
            }
            .room-pill {
              background: #1a1a1a;
              color: #ffffff;
              padding: 3px 14px;
              border-radius: 20px;
              font-size: 16px;
              font-weight: 900;
              margin: 4px 0 2px 0;
              display: inline-block;
            }
            .room-sub {
              font-size: 9.5px;
              color: #666;
              font-weight: 600;
            }
            .qr-wrapper {
              background: #ffffff;
              padding: 8px;
              border-radius: 10px;
              border: 1px solid #e8dec8;
              margin: 6px 0;
              display: inline-flex;
            }
            .qr-wrapper svg {
              width: 95px !important;
              height: 95px !important;
            }
            .scan-text {
              font-size: 9.5px;
              font-weight: bold;
              color: #78521a;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .scan-desc {
              font-size: 8.5px;
              color: #666;
              line-height: 1.2;
              max-width: 90%;
            }
            .cut-guide {
              position: absolute;
              bottom: -4mm;
              left: 50%;
              transform: translateX(-50%);
              font-size: 7.5px;
              color: #aaa;
              letter-spacing: 1px;
            }
          </style>
        </head>
        <body>
          <button class="no-print-btn" onclick="window.print()">🖨️ Click Here to Print All A4 QR Sheets</button>
          
          ${(() => {
            let pagesHtml = '';
            for (let i = 0; i < cards.length; i += 4) {
              const batch = cards.slice(i, i + 4);
              pagesHtml += '<div class="a4-grid">';
              batch.forEach(item => {
                pagesHtml += `
                  <div class="stand-cell">
                    <div>
                      <div class="hotel-header">Hotel Mapple Inn</div>
                      <div class="room-pill">ROOM ${item.room.room_number}</div>
                      <div class="room-sub">${item.room.room_type?.name || 'Boutique Room'} • Floor ${item.room.floor}</div>
                    </div>
                    
                    <div class="qr-wrapper">
                      ${item.svgHtml}
                    </div>

                    <div>
                      <div class="scan-text">Scan for Food & Room Service</div>
                      <div class="scan-desc">Point phone camera to order pure veg food directly to Room ${item.room.room_number}.</div>
                    </div>
                  </div>
                `;
              });
              pagesHtml += '</div>';
            }
            return pagesHtml;
          })()}

          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-hotel-600 uppercase tracking-widest block mb-1">
            In-Room Dining Hardware
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            16 Room QR Code Table Stands (201–208 & 301–308)
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Print individual luxury acrylic table cards or batch A4 sheets for all 16 rooms.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Floor filter */}
          <div className="bg-white p-1 rounded-xl border border-neutral-200 shadow-sm flex text-xs">
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
              Floor 2 (201–208)
            </button>
            <button
              onClick={() => setSelectedFloor(3)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedFloor === 3 ? 'bg-hotel-600 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Floor 3 (301–308)
            </button>
          </div>

          <button
            onClick={handlePrintBatchA4}
            className="inline-flex items-center space-x-2 bg-hotel-600 hover:bg-hotel-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
          >
            <Layers className="w-4 h-4" />
            <span>Print 4-per-page A4 Cut Sheets</span>
          </button>
        </div>
      </div>

      {rotatedSuccessRoom && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-2xl text-xs flex items-center space-x-2">
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
                  {room.room_type?.name || 'Boutique Room'} (Floor {room.floor})
                </span>

                {/* QR Container with ID for SVG extraction */}
                <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-hotel-200 inline-block mb-4 shadow-sm">
                  <QRCodeSVG
                    id={`qr-svg-${room.room_number}`}
                    value={roomUrl}
                    size={140}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="space-y-1 text-xs text-neutral-700 mb-4">
                  <div className="font-bold uppercase tracking-wider text-hotel-800 text-[11px]">
                    SCAN • SELECT • RELAX
                  </div>
                  <p className="text-[10px] text-neutral-500">
                    Scan with phone camera to order pure veg dining directly to this room.
                  </p>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleRotate(room)}
                  className="text-neutral-500 hover:text-hotel-700 font-medium inline-flex items-center space-x-1 text-[11px]"
                  title="Revoke & Regenerate QR"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regen Token</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintSingleStand(room)}
                  className="text-hotel-700 hover:text-hotel-900 font-bold inline-flex items-center space-x-1 text-[11px] bg-hotel-50 hover:bg-hotel-100 px-2.5 py-1 rounded-lg transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Stand</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

