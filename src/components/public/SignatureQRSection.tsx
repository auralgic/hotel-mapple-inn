import React, { useState } from 'react';
import { QrCode, Smartphone, Utensils, CreditCard, ChefHat, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SignatureQRSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const journeySteps = [
    {
      step: '01',
      title: 'Scan QR Stand',
      subtitle: 'Open phone camera & point at table QR',
      detail: 'No app download needed. Your room number is automatically identified with a secure token.',
      icon: QrCode,
      mockScreen: 'Scanning Room 101 QR...',
    },
    {
      step: '02',
      title: 'Browse Live Menu',
      subtitle: 'Pick pure-veg delicacies & thalis',
      detail: 'Explore full North Indian, Rajasthani, Chinese, Snacks, and Beverages with customizable portions.',
      icon: Utensils,
      mockScreen: 'Viewing Pure Veg Dining Menu',
    },
    {
      step: '03',
      title: 'Pay via UPI',
      subtitle: 'GPay, PhonePe, Paytm or BHIM',
      detail: 'Dynamic UPI QR with exact amount and zero convenience fees. Enter UTR reference for instant verification.',
      icon: CreditCard,
      mockScreen: 'UPI Payment Confirmed (₹)',
    },
    {
      step: '04',
      title: 'Kitchen Prepares',
      subtitle: 'Live ticket dispatched to Chef',
      detail: 'Our kitchen team prepares your dishes fresh and packs them hot with live status updates on your phone.',
      icon: ChefHat,
      mockScreen: 'Chef Cooking on Stove (KDS)',
    },
    {
      step: '05',
      title: 'Room Delivery',
      subtitle: 'Knock on door in 15–25 mins',
      detail: 'Enjoy hot food delivered directly to your room table. Settle back and relax.',
      icon: CheckCircle2,
      mockScreen: 'Delivered to Room 101 Door',
    },
  ];

  return (
    <section className="py-20 bg-[#1f1915] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-hotel-700/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-hotel-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-hotel-400 uppercase tracking-widest block mb-2">
            Signature Guest Experience
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            SCAN • SELECT • PAY • RELAX
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-3 max-w-xl mx-auto leading-relaxed">
            Your in-room dining menu is always within reach. No phone calls to front desk. No waiting on hold. Just tap, order, and relax.
          </p>
        </div>

        {/* 5-Step Customer Journey Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;

            return (
              <div
                key={step.step}
                onClick={() => setActiveStep(idx)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-hotel-900/90 border-hotel-500 shadow-xl shadow-hotel-600/20 scale-[1.02]'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`font-serif text-lg font-bold ${isSelected ? 'text-hotel-400' : 'text-neutral-500'}`}>
                      {step.step}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-hotel-700 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-serif text-base font-bold text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-hotel-300 font-medium mb-2">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {step.detail}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-500">
                  <span>Step {idx + 1} of 5</span>
                  {isSelected && <span className="text-hotel-400 font-bold">Active View</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Phone Simulation Mockup Bar */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-hotel-700 flex items-center justify-center text-white shrink-0 shadow-lg shadow-hotel-700/30">
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-hotel-400 uppercase tracking-wider block">
                Digital Guest Flow
              </span>
              <h4 className="font-serif text-lg font-bold text-white">
                Experience Room Service On Your Phone
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Current Step Preview: <strong className="text-white">{journeySteps[activeStep].title}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Link
              to="/order"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-hotel-700 hover:bg-hotel-600 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md"
            >
              <span>Explore In-Room Menu Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
