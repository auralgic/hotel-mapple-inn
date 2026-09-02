import React from 'react';
import { X, Printer, Download, Hotel, Phone, Mail, MapPin } from 'lucide-react';
import { Booking, Order } from '../../types';
import { formatCurrency, formatDate, formatDateTime } from '../../lib/formatters';
import { useHotelData } from '../../context/HotelDataContext';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  foodOrders?: Order[];
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  booking,
  foodOrders = [],
}) => {
  const { settings, mediaConfig } = useHotelData();

  if (!isOpen) return null;

  const nights = Math.max(
    1,
    Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 3600 * 24))
  );

  const roomSubtotal = booking.rate * nights;
  const foodTotal = foodOrders
    .filter(o => o.payment_status === 'paid' || o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.subtotal, 0);

  const grossSubtotal = roomSubtotal + foodTotal;
  const cgst = Math.round(grossSubtotal * 0.025); // 2.5% CGST
  const sgst = Math.round(grossSubtotal * 0.025); // 2.5% SGST
  const totalTax = cgst + sgst;
  const grandTotal = grossSubtotal + totalTax;
  const advanceDeposit = booking.deposit || 0;
  const balanceDue = Math.max(0, grandTotal - advanceDeposit);

  const invoiceNumber = `INV-${new Date().getFullYear()}-${booking.booking_number.replace('BK-', '')}`;
  const invoiceDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Dedicated standalone HTML A4 printer (Zero webpage background, pure original PDF format)
  const handlePrintDocument = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const logoHtml = mediaConfig?.logoUrl
      ? `<img src="${mediaConfig.logoUrl}" alt="Hotel Mapple Inn" style="height: 52px; width: auto; object-fit: contain; margin-bottom: 8px;" />`
      : `<div style="display: inline-block; background-color: #b45309; color: #ffffff; font-size: 20px; font-weight: bold; width: 36px; height: 36px; line-height: 36px; text-align: center; margin-bottom: 8px;">M</div>`;

    const foodRowsHtml = foodOrders.map((order, idx) => `
      <tr>
        <td style="padding: 9px 12px; border: 1px solid #d4d4d4; text-align: center; font-size: 11px;">${idx + 2}</td>
        <td style="padding: 9px 12px; border: 1px solid #d4d4d4;">
          <div style="font-weight: bold; font-size: 12px; color: #111827;">In-Room Dining Service</div>
          <div style="font-size: 10px; color: #4b5563;">Order Ref: ${order.order_number} (${order.items.map(i => `${i.quantity}x ${i.item_name_snapshot}`).join(', ')})</div>
        </td>
        <td style="padding: 9px 12px; border: 1px solid #d4d4d4; text-align: center; font-size: 11px;">996331</td>
        <td style="padding: 9px 12px; border: 1px solid #d4d4d4; text-align: center; font-size: 11px;">1</td>
        <td style="padding: 9px 12px; border: 1px solid #d4d4d4; text-align: right; font-size: 11px;">₹${order.subtotal.toFixed(2)}</td>
        <td style="padding: 9px 12px; border: 1px solid #d4d4d4; text-align: right; font-weight: bold; font-size: 11px; color: #111827;">₹${order.subtotal.toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Tax Invoice - ${invoiceNumber} - Hotel Mapple Inn</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            color: #111827;
            background-color: #ffffff;
            font-size: 11.5px;
            line-height: 1.45;
            padding: 20px;
          }
          .invoice-container {
            width: 100%;
            max-width: 780px;
            margin: 0 auto;
            background: #ffffff;
          }
          .header-table {
            width: 100%;
            border-bottom: 2px solid #111827;
            padding-bottom: 14px;
            margin-bottom: 18px;
          }
          .hotel-title {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #111827;
            text-transform: uppercase;
          }
          .tax-badge {
            background-color: #111827;
            color: #ffffff;
            font-weight: 700;
            font-size: 11px;
            letter-spacing: 1px;
            text-transform: uppercase;
            padding: 5px 12px;
            display: inline-block;
            margin-bottom: 6px;
          }
          .meta-grid {
            display: flex;
            justify-content: space-between;
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 12px 16px;
            margin-bottom: 18px;
            border-radius: 4px;
          }
          .meta-col {
            width: 48%;
          }
          .meta-label {
            font-size: 9px;
            text-transform: uppercase;
            font-weight: 700;
            color: #6b7280;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
          }
          .items-table th {
            background-color: #f3f4f6;
            border: 1px solid #d1d5db;
            padding: 9px 12px;
            font-size: 10.5px;
            text-transform: uppercase;
            font-weight: 700;
            color: #111827;
          }
          .totals-table {
            width: 100%;
            margin-bottom: 22px;
          }
          .totals-box {
            width: 48%;
            vertical-align: top;
          }
          .grand-total-row {
            background-color: #f3f4f6;
            font-weight: 800;
            font-size: 13px;
          }
          .due-box {
            background-color: #111827;
            color: #ffffff;
            font-weight: 700;
            padding: 8px 12px;
            font-size: 12px;
            margin-top: 6px;
            border-radius: 2px;
          }
          .footer-section {
            border-top: 1px solid #d1d5db;
            padding-top: 16px;
            margin-top: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- 1. Header & Brand Details -->
          <table class="header-table" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align: top; width: 62%;">
                ${logoHtml}
                <div class="hotel-title">${settings.name}</div>
                <div style="color: #4b5563; font-size: 11px; margin-top: 4px; max-width: 360px;">${settings.address}</div>
                <div style="color: #4b5563; font-size: 10.5px; margin-top: 6px;">
                  <div><strong>Phone:</strong> ${settings.phone} | <strong>WhatsApp:</strong> ${settings.whatsapp}</div>
                  <div><strong>Email:</strong> ${settings.email}</div>
                  <div><strong>GSTIN:</strong> 08AAACH1234F1Z5 | <strong>State:</strong> 08 - Rajasthan</div>
                </div>
              </td>
              <td style="vertical-align: top; text-align: right; width: 38%;">
                <div class="tax-badge">TAX INVOICE</div>
                <div style="font-size: 11px; color: #374151; margin-top: 6px; line-height: 1.6;">
                  <div><strong>Invoice No:</strong> ${invoiceNumber}</div>
                  <div><strong>Invoice Date:</strong> ${invoiceDate}</div>
                  <div><strong>Booking Ref:</strong> ${booking.booking_number}</div>
                  <div><strong>Place of Supply:</strong> Rajasthan (08)</div>
                </div>
              </td>
            </tr>
          </table>

          <!-- 2. Guest Details & Stay Specifics -->
          <div class="meta-grid">
            <div class="meta-col">
              <div class="meta-label">Billed To (Guest Details)</div>
              <div style="font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 2px;">${booking.guest?.name || 'Walk-in Guest'}</div>
              <div style="color: #4b5563;"><strong>Phone:</strong> ${booking.guest?.phone || 'N/A'}</div>
              ${booking.guest?.email ? `<div style="color: #4b5563;"><strong>Email:</strong> ${booking.guest.email}</div>` : ''}
              ${booking.guest?.id_number ? `<div style="color: #4b5563;"><strong>ID Proof:</strong> ${booking.guest.id_type || 'ID'} - ${booking.guest.id_number}</div>` : ''}
            </div>
            <div class="meta-col" style="text-align: right;">
              <div class="meta-label">Stay Particulars</div>
              <div style="font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 2px;">Room ${booking.room?.room_number} (${booking.room?.room_type?.name || 'Deluxe'})</div>
              <div style="color: #4b5563;"><strong>Check-In:</strong> ${formatDate(booking.check_in)}</div>
              <div style="color: #4b5563;"><strong>Check-Out:</strong> ${formatDate(booking.check_out)}</div>
              <div style="color: #4b5563;"><strong>Duration:</strong> ${nights} Night${nights > 1 ? 's' : ''} (${booking.adults} Guest${booking.adults > 1 ? 's' : ''})</div>
            </div>
          </div>

          <!-- 3. Line Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 36px; text-align: center;">#</th>
                <th style="text-align: left;">Description / Services</th>
                <th style="width: 75px; text-align: center;">HSN/SAC</th>
                <th style="width: 70px; text-align: center;">Nights</th>
                <th style="width: 100px; text-align: right;">Rate (₹)</th>
                <th style="width: 110px; text-align: right;">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 9px 12px; border: 1px solid #d4d4d4; text-align: center; font-size: 11px;">1</td>
                <td style="padding: 9px 12px; border: 1px solid #d4d4d4;">
                  <div style="font-weight: bold; font-size: 12px; color: #111827;">Room Accommodation Charges</div>
                  <div style="font-size: 10px; color: #4b5563;">Room ${booking.room?.room_number} — ${booking.room?.room_type?.name || 'Deluxe'}</div>
                </td>
                <td style="padding: 9px 12px; border: 1px solid #d4d4d4; text-align: center; font-size: 11px;">996311</td>
                <td style="padding: 9px 12px; border: 1px solid #d4d4d4; text-align: center; font-size: 11px;">${nights}</td>
                <td style="padding: 9px 12px; border: 1px solid #d4d4d4; text-align: right; font-size: 11px;">₹${booking.rate.toFixed(2)}</td>
                <td style="padding: 9px 12px; border: 1px solid #d4d4d4; text-align: right; font-weight: bold; font-size: 11px; color: #111827;">₹${roomSubtotal.toFixed(2)}</td>
              </tr>
              ${foodRowsHtml}
            </tbody>
          </table>

          <!-- 4. Totals & Tax Calculation Breakdown -->
          <table class="totals-table" cellpadding="0" cellspacing="0">
            <tr>
              <td class="totals-box" style="padding-right: 18px;">
                <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 4px;">
                  <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #4b5563; margin-bottom: 4px;">Bank & UPI Settlement Details</div>
                  <div style="font-size: 11px; color: #1f2937;"><strong>UPI VPA:</strong> ${settings.upiVpa}</div>
                  <div style="font-size: 11px; color: #1f2937;"><strong>Payee Name:</strong> ${settings.upiName}</div>
                  <div style="font-size: 10px; color: #6b7280; margin-top: 8px; line-height: 1.4;">
                    Terms: Computer-generated document. Pure vegetarian property. Subject to Jaipur Jurisdiction.
                  </div>
                </div>
              </td>
              <td class="totals-box" style="text-align: right;">
                <table style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
                  <tr>
                    <td style="padding: 3px 0; color: #4b5563;">Taxable Subtotal:</td>
                    <td style="padding: 3px 0; text-align: right; font-weight: 700; color: #111827;">₹${grossSubtotal.toLocaleString('en-IN')}.00</td>
                  </tr>
                  <tr>
                    <td style="padding: 3px 0; color: #4b5563;">CGST @ 2.5%:</td>
                    <td style="padding: 3px 0; text-align: right; color: #111827;">₹${cgst.toLocaleString('en-IN')}.00</td>
                  </tr>
                  <tr>
                    <td style="padding: 3px 0; color: #4b5563;">SGST @ 2.5%:</td>
                    <td style="padding: 3px 0; text-align: right; color: #111827;">₹${sgst.toLocaleString('en-IN')}.00</td>
                  </tr>
                  <tr style="border-top: 1px solid #d1d5db;">
                    <td style="padding: 6px 0; font-weight: 800; font-size: 13px; color: #111827;">Grand Total:</td>
                    <td style="padding: 6px 0; text-align: right; font-weight: 800; font-size: 13px; color: #111827;">₹${grandTotal.toLocaleString('en-IN')}.00</td>
                  </tr>
                  <tr>
                    <td style="padding: 3px 0; color: #059669; font-weight: 600;">Advance Paid:</td>
                    <td style="padding: 3px 0; text-align: right; color: #059669; font-weight: 600;">₹${advanceDeposit.toLocaleString('en-IN')}.00</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top: 6px;">
                      <div class="due-box">
                        <table style="width: 100%; color: #ffffff;">
                          <tr>
                            <td style="text-align: left; font-weight: 700;">Net Balance Due:</td>
                            <td style="text-align: right; font-weight: 800; font-size: 14px;">₹${balanceDue.toLocaleString('en-IN')}.00</td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- 5. Signatures & Seal -->
          <div class="footer-section">
            <div style="font-size: 10px; color: #6b7280; line-height: 1.5;">
              Thank you for staying at Hotel Mapple Inn Jaipur.<br>
              We look forward to welcoming you again!
            </div>
            <div style="text-align: center; width: 170px;">
              <div style="border-bottom: 1px solid #111827; margin-bottom: 4px; height: 35px;"></div>
              <div style="font-weight: 700; font-size: 11px; color: #111827;">Authorized Signatory</div>
              <div style="font-size: 9.5px; color: #6b7280;">For Hotel Mapple Inn Jaipur</div>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.focus();
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Container (on-screen modal) */}
      <div className="bg-white rounded-none max-w-3xl w-full my-6 shadow-2xl border border-neutral-300 relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* On-screen modal action toolbar */}
        <div className="no-print bg-[#1a1614] text-white px-5 sm:px-6 py-3.5 flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center space-x-2">
            <Hotel className="w-4 h-4 text-amber-400" />
            <span className="font-serif font-bold text-xs sm:text-sm">Official Tax Invoice Preview</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handlePrintDocument}
              className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-3.5 sm:px-4 py-2 rounded-none text-xs shadow-md transition whitespace-nowrap active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF / Print</span>
            </button>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-none hover:bg-neutral-800 transition"
              aria-label="Close invoice preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Body */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-white text-neutral-900 font-sans" id="invoice-print-area">
          {/* Header & Brand */}
          <div className="border-b-2 border-neutral-900 pb-5 mb-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div>
                {mediaConfig?.logoUrl ? (
                  <img
                    src={mediaConfig.logoUrl}
                    alt="Hotel Mapple Inn"
                    className="h-10 w-auto object-contain mb-2"
                  />
                ) : (
                  <div className="w-9 h-9 bg-amber-700 text-white flex items-center justify-center font-bold text-lg mb-2 shadow-xs">
                    M
                  </div>
                )}
                <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 uppercase">
                  {settings.name}
                </h1>
                <p className="text-xs text-neutral-600 font-normal mt-1 max-w-sm">
                  {settings.address}
                </p>
                <div className="text-xs text-neutral-600 mt-2 space-y-0.5">
                  <div><strong>Phone:</strong> {settings.phone} | <strong>WhatsApp:</strong> {settings.whatsapp}</div>
                  <div><strong>Email:</strong> {settings.email}</div>
                  <div><strong>GSTIN:</strong> 08AAACH1234F1Z5 (State: 08 - Rajasthan)</div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block bg-neutral-900 text-white font-bold text-xs uppercase px-3 py-1 tracking-wider rounded-none mb-2">
                  TAX INVOICE
                </span>
                <div className="text-xs text-neutral-600 space-y-0.5">
                  <div><strong>Invoice No:</strong> {invoiceNumber}</div>
                  <div><strong>Invoice Date:</strong> {invoiceDate}</div>
                  <div><strong>Booking Ref:</strong> {booking.booking_number}</div>
                  <div><strong>Place of Supply:</strong> Rajasthan (08)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Guest & Stay Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 border border-neutral-200 text-xs mb-5">
            <div>
              <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">Billed To (Guest Details)</span>
              <div className="font-bold text-sm text-neutral-900">{booking.guest?.name || 'Walk-in Guest'}</div>
              <div className="text-neutral-600">Contact: {booking.guest?.phone}</div>
              {booking.guest?.email && <div className="text-neutral-600">Email: {booking.guest?.email}</div>}
              {booking.guest?.id_number && (
                <div className="text-neutral-600">ID Proof: {booking.guest?.id_type} - {booking.guest?.id_number}</div>
              )}
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">Stay Particulars</span>
              <div className="font-bold text-sm text-neutral-900">Room {booking.room?.room_number} ({booking.room?.room_type?.name})</div>
              <div className="text-neutral-600">Check-In: {formatDate(booking.check_in)}</div>
              <div className="text-neutral-600">Check-Out: {formatDate(booking.check_out)}</div>
              <div className="text-neutral-600">Duration: {nights} Night{nights > 1 ? 's' : ''} ({booking.adults} Adults)</div>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <div className="overflow-x-auto mb-5">
            <table className="w-full text-left text-xs border border-neutral-300">
              <thead className="bg-neutral-100 text-neutral-900 uppercase font-bold border-b border-neutral-300 text-[10px]">
                <tr>
                  <th className="p-2.5 border-r border-neutral-300 w-10 text-center">#</th>
                  <th className="p-2.5 border-r border-neutral-300">Description / Service</th>
                  <th className="p-2.5 border-r border-neutral-300 text-center">HSN/SAC</th>
                  <th className="p-2.5 border-r border-neutral-300 text-center">Qty / Nights</th>
                  <th className="p-2.5 border-r border-neutral-300 text-right">Unit Rate (₹)</th>
                  <th className="p-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-xs">
                {/* Room Rent Line */}
                <tr>
                  <td className="p-2.5 border-r border-neutral-200 text-center">1</td>
                  <td className="p-2.5 border-r border-neutral-200">
                    <strong className="text-neutral-900 block font-semibold">Room Accommodation Charges</strong>
                    <span className="text-neutral-500 text-[10px] block">Room {booking.room?.room_number} — {booking.room?.room_type?.name}</span>
                  </td>
                  <td className="p-2.5 border-r border-neutral-200 text-center">996311</td>
                  <td className="p-2.5 border-r border-neutral-200 text-center">{nights}</td>
                  <td className="p-2.5 border-r border-neutral-200 text-right">{booking.rate.toFixed(2)}</td>
                  <td className="p-2.5 text-right font-bold text-neutral-900">{roomSubtotal.toFixed(2)}</td>
                </tr>

                {/* Food Orders (if any) */}
                {foodOrders.map((order, idx) => (
                  <tr key={order.id}>
                    <td className="p-2.5 border-r border-neutral-200 text-center">{idx + 2}</td>
                    <td className="p-2.5 border-r border-neutral-200">
                      <strong className="text-neutral-900 block font-semibold">In-Room Dining / Food Service</strong>
                      <span className="text-neutral-500 text-[10px] block">Order Ref: {order.order_number} ({order.items.map(i => `${i.quantity}x ${i.item_name_snapshot}`).join(', ')})</span>
                    </td>
                    <td className="p-2.5 border-r border-neutral-200 text-center">996331</td>
                    <td className="p-2.5 border-r border-neutral-200 text-center">1</td>
                    <td className="p-2.5 border-r border-neutral-200 text-right">{order.subtotal.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-bold text-neutral-900">{order.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Calculation Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 text-xs mb-6">
            <div className="sm:col-span-7 bg-neutral-50 p-4 border border-neutral-200 space-y-1.5">
              <span className="font-bold text-[10px] uppercase text-neutral-500 block">Bank & UPI Settlement Details</span>
              <div><strong>Payee VPA:</strong> {settings.upiVpa}</div>
              <div><strong>Payee Name:</strong> {settings.upiName}</div>
              <div><strong>Payment Mode:</strong> Cash / UPI / Card</div>
              <p className="text-[10px] text-neutral-500 pt-1">
                Terms: This invoice is a computer-generated commercial document. Pure vegetarian property. All disputes are subject to Jaipur Jurisdiction.
              </p>
            </div>

            <div className="sm:col-span-5 space-y-1.5 text-right">
              <div className="flex justify-between text-neutral-600">
                <span>Taxable Subtotal:</span>
                <span className="font-bold text-neutral-900">{formatCurrency(grossSubtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>CGST @ 2.5%:</span>
                <span>{formatCurrency(cgst)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>SGST @ 2.5%:</span>
                <span>{formatCurrency(sgst)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 border-t border-neutral-300 pt-1.5 font-bold text-sm text-neutral-950">
                <span>Grand Total:</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 text-xs">
                <span>Advance / Paid:</span>
                <span className="text-emerald-700 font-semibold">{formatCurrency(advanceDeposit)}</span>
              </div>
              <div className="flex justify-between text-xs bg-neutral-900 text-white p-2 font-bold rounded-none">
                <span>Net Balance Due:</span>
                <span>{formatCurrency(balanceDue)}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t border-neutral-300 flex justify-between items-end text-xs">
            <div className="text-neutral-500 text-[10px]">
              Thank you for choosing Hotel Mapple Inn Jaipur.<br />
              We look forward to welcoming you again.
            </div>

            <div className="text-center">
              <div className="w-36 border-b border-neutral-800 mb-1"></div>
              <span className="font-bold text-neutral-900 text-[11px] block">Authorized Signatory</span>
              <span className="text-[10px] text-neutral-500">For Hotel Mapple Inn</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
