import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, BedDouble, RotateCcw, CalendarCheck } from 'lucide-react';
import { ROOM_CATEGORIES_DATA, RoomCategoryData } from '../../lib/roomCategories';
import { formatCurrency } from '../../lib/formatters';

interface RoomMatcherQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoomToBook: (roomTypeId: string) => void;
}

export const RoomMatcherQuiz: React.FC<RoomMatcherQuizProps> = ({
  isOpen,
  onClose,
  onSelectRoomToBook,
}) => {
  const [step, setStep] = useState(1);
  const [travelType, setTravelType] = useState<'couple' | 'family' | 'business' | 'solo'>('couple');
  const [priority, setPriority] = useState<'balcony' | 'lounge' | 'quiet'>('balcony');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [recommendedRoom, setRecommendedRoom] = useState<RoomCategoryData | null>(null);
  const [matchScore, setMatchScore] = useState<number>(94);

  if (!isOpen) return null;

  const handleComputeRecommendation = () => {
    let rec: RoomCategoryData;
    let score = 92;

    if (travelType === 'family' || guestsCount >= 3) {
      rec = ROOM_CATEGORIES_DATA.find(r => r.id === 'rt-executive') || ROOM_CATEGORIES_DATA[2];
      score = 98;
    } else if (priority === 'balcony') {
      rec = ROOM_CATEGORIES_DATA.find(r => r.id === 'rt-super-deluxe') || ROOM_CATEGORIES_DATA[1];
      score = 96;
    } else {
      rec = ROOM_CATEGORIES_DATA.find(r => r.id === 'rt-deluxe') || ROOM_CATEGORIES_DATA[0];
      score = 94;
    }

    setRecommendedRoom(rec);
    setMatchScore(score);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setTravelType('couple');
    setPriority('balcony');
    setGuestsCount(2);
    setRecommendedRoom(null);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white text-neutral-900 rounded-none p-6 sm:p-8 max-w-lg w-full relative shadow-2xl border border-neutral-300">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-500 hover:text-neutral-950 p-1.5 rounded-none hover:bg-neutral-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {step < 4 ? (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>30-Second Room Matcher</span>
              </div>
              <h3 className="text-2xl font-semibold text-neutral-950">
                Find Your Ideal Room
              </h3>
              <p className="text-xs text-neutral-600 mt-1 font-normal">
                Answer 3 quick questions to get personalized room recommendations for your Jaipur trip.
              </p>
            </div>

            {/* Step Progress */}
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 transition-all ${
                    step >= s ? 'bg-amber-700' : 'bg-neutral-200'
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Travel Type */}
            {step === 1 && (
              <div className="space-y-3 animate-fadeIn">
                <label className="block text-xs font-bold uppercase text-neutral-800 tracking-wider">
                  Step 1 of 3: Who are you travelling with?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'couple', label: 'Couple / Partners', desc: 'Romantic or quiet city exploration' },
                    { id: 'family', label: 'Family with Kids', desc: 'Extra space and separate seating' },
                    { id: 'business', label: 'Solo / Business', desc: 'Work desk, fast Wi-Fi, quiet zone' },
                    { id: 'solo', label: 'Friends Group', desc: 'Comfortable bedding & room service' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTravelType(t.id as any);
                        setStep(2);
                      }}
                      className={`p-3.5 text-left border rounded-none transition ${
                        travelType === t.id
                          ? 'border-amber-700 bg-amber-50 shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-400 bg-white'
                      }`}
                    >
                      <strong className="block text-xs text-neutral-950 font-bold">{t.label}</strong>
                      <span className="text-[11px] text-neutral-600 font-normal">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Priority Feature */}
            {step === 2 && (
              <div className="space-y-3 animate-fadeIn">
                <label className="block text-xs font-bold uppercase text-neutral-800 tracking-wider">
                  Step 2 of 3: What matters most for your stay?
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: 'balcony', label: 'Private Open-Air Balcony', desc: 'Fresh air & scenic Nirman Nagar morning views' },
                    { id: 'lounge', label: 'Separate Living Lounge & Mini-Fridge', desc: 'Top-floor luxury for working or family comfort' },
                    { id: 'quiet', label: 'Great Value & Quiet King Bed', desc: 'Peaceful sleep, split AC, and pure veg dining' },
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPriority(p.id as any);
                        setStep(3);
                      }}
                      className={`p-3.5 text-left border rounded-none transition flex items-center justify-between ${
                        priority === p.id
                          ? 'border-amber-700 bg-amber-50 shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-400 bg-white'
                      }`}
                    >
                      <div>
                        <strong className="block text-xs text-neutral-950 font-bold">{p.label}</strong>
                        <span className="text-[11px] text-neutral-600 font-normal">{p.desc}</span>
                      </div>
                      <div className={`w-4 h-4 border flex items-center justify-center ${priority === p.id ? 'border-amber-700 bg-amber-700 text-white' : 'border-neutral-400'}`}>
                        {priority === p.id && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Guests Count */}
            {step === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <label className="block text-xs font-bold uppercase text-neutral-800 tracking-wider">
                  Step 3 of 3: Total Number of Guests?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGuestsCount(g)}
                      className={`py-3 text-center border font-bold text-sm rounded-none transition ${
                        guestsCount === g
                          ? 'border-amber-700 bg-amber-700 text-white'
                          : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-900'
                      }`}
                    >
                      {g} {g === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleComputeRecommendation}
                    className="w-full bg-neutral-950 hover:bg-amber-700 text-white font-bold py-3.5 rounded-none text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center space-x-2 whitespace-nowrap"
                  >
                    <span>See Recommended Room</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Step 4: Recommended Match Result */
          recommendedRoom && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#eee8df] pb-3">
                <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Top Recommendation</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold rounded-none">
                  {matchScore}% Match
                </span>
              </div>

              {/* Recommended Room Card */}
              <div className="bg-[#faf8f5] rounded-none overflow-hidden border border-[#e2d8ca] shadow-sm">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={recommendedRoom.images[0]}
                    alt={recommendedRoom.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-amber-700 text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-none">
                    {recommendedRoom.floorInfo.split('(')[0].trim()}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-950">
                        {recommendedRoom.name}
                      </h4>
                      <span className="text-xs text-neutral-600 font-normal">{recommendedRoom.tagline}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-neutral-950">
                        {formatCurrency(recommendedRoom.price)}
                      </span>
                      <span className="text-[10px] text-neutral-500 block">/ night</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-[#e8e2d8]">
                    {recommendedRoom.highlights.slice(0, 3).map(h => (
                      <div key={h} className="flex items-center text-xs text-neutral-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectRoomToBook(recommendedRoom.id);
                  }}
                  className="w-full bg-neutral-950 hover:bg-amber-700 text-white font-bold py-3.5 rounded-none text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book {recommendedRoom.name}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full bg-white hover:bg-neutral-100 text-neutral-700 font-bold py-2 rounded-none text-xs border border-neutral-300 transition flex items-center justify-center space-x-1.5 whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Matcher Quiz</span>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
