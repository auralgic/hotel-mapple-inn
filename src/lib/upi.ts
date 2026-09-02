// UPI Intent & QR Generation Utilities

export interface UPIParams {
  vpa: string;          // e.g. mappleinn@icici
  payeeName: string;    // e.g. Hotel Mapple Inn
  amount: number;       // e.g. 380.00
  transactionNote: string; // e.g. Room 101 Order MI-2026-000123
  transactionRef?: string;
  currency?: string;    // INR
}

/**
 * Builds the standard UPI URI specification:
 * upi://pay?pa={vpa}&pn={payeeName}&am={amount}&tn={note}&cu=INR
 */
export function buildUPIString(params: UPIParams): string {
  const vpa = encodeURIComponent(params.vpa);
  const pn = encodeURIComponent(params.payeeName);
  const am = encodeURIComponent(params.amount.toFixed(2));
  const tn = encodeURIComponent(params.transactionNote);
  const cu = params.currency || 'INR';
  const tr = params.transactionRef ? `&tr=${encodeURIComponent(params.transactionRef)}` : '';

  return `upi://pay?pa=${vpa}&pn=${pn}&am=${am}&tn=${tn}&cu=${cu}${tr}`;
}

export function getUPIDeepLinks(params: UPIParams) {
  const baseUpi = buildUPIString(params);
  return {
    generic: baseUpi,
    gpay: `gpay://upi/pay?pa=${params.vpa}&pn=${encodeURIComponent(params.payeeName)}&am=${params.amount.toFixed(2)}&tn=${encodeURIComponent(params.transactionNote)}&cu=INR`,
    phonepe: `phonepe://pay?pa=${params.vpa}&pn=${encodeURIComponent(params.payeeName)}&am=${params.amount.toFixed(2)}&tn=${encodeURIComponent(params.transactionNote)}&cu=INR`,
    paytm: `paytmmp://pay?pa=${params.vpa}&pn=${encodeURIComponent(params.payeeName)}&am=${params.amount.toFixed(2)}&tn=${encodeURIComponent(params.transactionNote)}&cu=INR`,
  };
}
