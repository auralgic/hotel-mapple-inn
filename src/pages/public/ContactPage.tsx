import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Train,
  Plane,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useHotelData();
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dates: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="min-h-screen bg-[#fbf8f3] text-neutral-900">
      {/* Top Banner */}
      <section className="relative py-16 bg-[#f5ede2] border-b border-[#e2d5c3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
            RECEPTION & LOCATION
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-950 mb-4">
            We're Here in Nirman Nagar, Jaipur
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Whether you need driving directions, early check-in assistance, or corporate room booking, our reception team is available 24/7.
          </p>
        </div>
      </section>

      {/* Main 2-Column Section on Warm Sandstone Canvas */}
      <section className="py-20 bg-[#fbf8f3] text-neutral-900 border-b border-[#e5ded4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Contact Info & Verified Jaipur Distances */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-none border border-[#e2d8ca] shadow-sm space-y-6">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block">
                  OFFICIAL HOTEL DETAILS
                </span>
                <h3 className="text-2xl font-semibold text-neutral-950">
                  Hotel Mapple Inn, Jaipur
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-neutral-700">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-neutral-950 font-bold mb-0.5">Physical Address:</strong>
                      <span>{settings.address || 'Plot No. 408-409, Nirman Nagar, Mansarovar, Jaipur, Rajasthan 302020'}</span>
                      <div className="mt-1 text-xs text-amber-900 font-semibold bg-amber-50 p-2 border border-amber-200">
                        <strong>Google Plus Code:</strong> VQQ2+3G Jaipur, Rajasthan
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <strong className="block text-neutral-950 font-bold">Front Desk & WhatsApp:</strong>
                      <a href={`tel:${(settings.phone || '9680131232').replace(/[^0-9+]/g, '')}`} className="text-amber-800 font-bold hover:underline">
                        {settings.phone || '+91 96801 31232'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <strong className="block text-neutral-950 font-bold">Direct Email:</strong>
                      <span className="text-neutral-700">{settings.email || 'contact@mappleinn.com'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <strong className="block text-neutral-950 font-bold">Check-In / Out Timings:</strong>
                      <span>Check-In: {settings.checkInTime || '12:00 PM'} • Check-Out: {settings.checkOutTime || '11:00 AM'} (24/7 Front Desk)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="https://maps.app.goo.gl/FzFGvvPQ7QwDAWKk8"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-neutral-950 hover:bg-amber-700 text-white font-bold px-5 py-3 rounded-none text-xs uppercase tracking-wider transition shadow-sm flex items-center space-x-2 whitespace-nowrap"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open in Google Maps (VQQ2+3G)</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>

                  <a
                    href="https://wa.me/919680131232"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-3 rounded-none text-xs flex items-center space-x-1.5 transition shadow-sm whitespace-nowrap"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Interactive Direct Inquiry Form */}
            <div className="lg:col-span-6">
              <div className="bg-white p-6 sm:p-8 rounded-none border border-[#e2d8ca] shadow-sm">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-1">
                  DIRECT ENQUIRY
                </span>
                <h3 className="text-2xl font-semibold text-neutral-950 mb-4">
                  Send a Direct Message to Reception
                </h3>

                {formSent ? (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-6 rounded-none text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="text-lg font-semibold">Message Received!</h4>
                    <p className="text-xs text-emerald-700">
                      Our front desk reception team will get in touch with you shortly on your provided phone number.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-neutral-800 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Vikram Sharma"
                        className="w-full bg-[#faf8f5] border border-neutral-400 rounded-none p-3 text-neutral-900 focus:outline-none focus:border-amber-700 font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-neutral-800 uppercase mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98290 XXXXX"
                          className="w-full bg-[#faf8f5] border border-neutral-400 rounded-none p-3 text-neutral-900 focus:outline-none focus:border-amber-700 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-neutral-800 uppercase mb-1">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@example.com"
                          className="w-full bg-[#faf8f5] border border-neutral-400 rounded-none p-3 text-neutral-900 focus:outline-none focus:border-amber-700 font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-800 uppercase mb-1">Message or Special Request</label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us your travel dates, room requirements, or special preferences..."
                        className="w-full bg-[#faf8f5] border border-neutral-400 rounded-none p-3 text-neutral-900 focus:outline-none focus:border-amber-700 font-semibold resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-neutral-950 hover:bg-amber-700 text-white font-bold py-3.5 rounded-none text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center space-x-2 whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Direct Enquiry</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Live Google Maps Strip Explicitly Querying Hotel Mapple Inn */}
      <section className="bg-white py-16 border-t border-[#e5ded4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-1">
              HOTEL MAPPLE INN (PINNED LOCATION)
            </span>
            <h3 className="text-2xl font-semibold text-neutral-950">
              Find Hotel Mapple Inn on Google Maps
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              Plus Code: <strong>VQQ2+3G Jaipur, Rajasthan</strong> • Direct Pin:{' '}
              <a
                href="https://maps.app.goo.gl/FzFGvvPQ7QwDAWKk8"
                target="_blank"
                rel="noreferrer"
                className="text-amber-800 font-semibold underline"
              >
                https://maps.app.goo.gl/FzFGvvPQ7QwDAWKk8
              </a>
            </p>
          </div>

          <div className="rounded-none overflow-hidden border border-[#e2d8ca] aspect-[21/9] w-full bg-neutral-100 shadow-sm">
            <iframe
              title="Hotel Mapple Inn Jaipur Location Full Map"
              src="https://maps.google.com/maps?q=Hotel+Mapple+Inn,+Plot+408-409,+Nirman+Nagar,+Mansarovar,+Jaipur&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};
