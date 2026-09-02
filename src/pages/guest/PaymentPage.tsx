import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useHotelData } from '../../context/HotelDataContext';
import { formatCurrency } from '../../lib/formatters';
import { buildUPIString, getUPIDeepLinks } from '../../lib/upi';
import { ShieldCheck, CheckCircle2, Copy, Check, Upload, AlertCircle, Clock, Smartphone, ChevronRight } from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  const { getOrderById, settings, submitUPIPayment } = useHotelData();
  const order = orderId ? getOrderById(orderId) : undefined;

  const [upiRef, setUpiRef] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!order) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p className="text-xs text-neutral-500 mt-1 mb-4">The requested order does not exist or has expired.</p>
        <button
          onClick={() => navigate('/order')}
          className="bg-hotel-600 text-white px-4 py-2 rounded-xl text-xs font-semibold"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  // Prepare UPI Data
  const upiParams = {
    vpa: settings.upiVpa || 'mappleinn@icici',
    payeeName: settings.upiName || 'Hotel Mapple Inn Jaipur',
    amount: order.total,
    transactionNote: `Room ${order.room_number} Order ${order.order_number}`,
  };

  const upiString = buildUPIString(upiParams);
  const deepLinks = getUPIDeepLinks(upiParams);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(settings.upiVpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshotMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiRef.trim()) {
      setErrorMessage('Please enter the 12-digit UPI Reference / UTR Number from your payment app.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await submitUPIPayment(order.id, upiRef, screenshotUrl);
    if (res.success) {
      navigate(`/order/status/${order.id}`);
    } else {
      setErrorMessage(res.error || 'Failed to submit payment details.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] py-8 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-hotel-600 uppercase tracking-widest block mb-1">
            Order #{order.order_number}
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Complete Your Payment
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Scan the QR code with GPay, PhonePe, Paytm, or BHIM
          </p>
        </div>

        {/* Amount Card */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-3xl p-6 mb-6 shadow-xl text-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs text-neutral-400 uppercase tracking-wider block font-semibold mb-1">
              Exact Payable Total (Including Taxes)
            </span>
            <div className="text-4xl font-extrabold text-white mb-2">
              {formatCurrency(order.total)}
            </div>
            <div className="inline-flex items-center space-x-1.5 bg-neutral-800 text-xs px-3 py-1 rounded-full text-neutral-300 border border-neutral-700">
              <span>Room {order.room_number}</span>
              <span>•</span>
              <span>{order.items.length} Items</span>
            </div>
          </div>
        </div>

        {/* Dynamic UPI QR Code Box */}
        <div className="bg-white rounded-3xl border border-hotel-200 shadow-sm p-6 mb-6 text-center">
          <div className="bg-hotel-50 p-4 rounded-2xl inline-block border border-hotel-200 mb-4">
            <QRCodeSVG
              value={upiString}
              size={200}
              level="H"
              includeMargin={true}
              className="mx-auto"
            />
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-neutral-600 mb-4">
            <span className="font-semibold text-neutral-800">UPI VPA: {settings.upiVpa}</span>
            <button
              onClick={handleCopyUPI}
              className="p-1 text-hotel-600 hover:bg-hotel-50 rounded transition"
              title="Copy UPI ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* UPI App Quick Intent Buttons (Mobile friendly) */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-100">
            <a
              href={deepLinks.gpay}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-neutral-50 hover:bg-hotel-50 border border-neutral-200 transition text-[11px] font-semibold text-neutral-800"
            >
              <Smartphone className="w-4 h-4 text-blue-600 mb-1" />
              <span>Google Pay</span>
            </a>
            <a
              href={deepLinks.phonepe}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-neutral-50 hover:bg-hotel-50 border border-neutral-200 transition text-[11px] font-semibold text-neutral-800"
            >
              <Smartphone className="w-4 h-4 text-purple-600 mb-1" />
              <span>PhonePe</span>
            </a>
            <a
              href={deepLinks.paytm}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-neutral-50 hover:bg-hotel-50 border border-neutral-200 transition text-[11px] font-semibold text-neutral-800"
            >
              <Smartphone className="w-4 h-4 text-sky-600 mb-1" />
              <span>Paytm / UPI</span>
            </a>
          </div>
        </div>

        {/* Verification Notice */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 mb-6 text-xs flex items-start space-x-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-950">Payment Verification Policy</h4>
            <p className="mt-0.5 leading-relaxed text-amber-800">
              Your order will be confirmed and sent to our kitchen team immediately after payment verification by our reception desk.
            </p>
          </div>
        </div>

        {/* Submit Reference Form */}
        <div className="bg-white rounded-3xl border border-hotel-200 shadow-sm p-6 mb-8">
          <h3 className="font-bold text-sm text-neutral-900 mb-1">
            After Payment: Submit Transaction Reference
          </h3>
          <p className="text-xs text-neutral-500 mb-4">
            Copy the 12-digit UPI UTR / Reference ID from your payment receipt and paste below:
          </p>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                UPI Reference / UTR Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. UPI/623491829304 or 12-digit UTR"
                value={upiRef}
                onChange={e => setUpiRef(e.target.value)}
                className="w-full text-sm px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-hotel-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Payment Screenshot (Optional)
              </label>
              <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:bg-neutral-50 transition text-center">
                <Upload className="w-5 h-5 text-neutral-400 mb-1" />
                <span className="text-xs text-neutral-600 font-medium">
                  {screenshotUrl ? 'Screenshot Attached ✓' : 'Upload Payment Receipt / Screenshot'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotMock}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-hotel-600 hover:bg-hotel-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-hotel-600/30 transition transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>I've Paid • Confirm My Order</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
