import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { ProductHero } from '../../components/public/ProductHero';
import { HeroAmenitiesStrip } from '../../components/public/HeroAmenitiesStrip';
import { DecisionRoomGrid } from '../../components/public/DecisionRoomGrid';
import { RoomMatcherQuiz } from '../../components/public/RoomMatcherQuiz';
import { DirectBookingPerks } from '../../components/public/DirectBookingPerks';
import { EditorialDining } from '../../components/public/EditorialDining';
import { RooftopExperience } from '../../components/public/RooftopExperience';
import { InteractiveTransitMap } from '../../components/public/InteractiveTransitMap';
import { MasonryGallery } from '../../components/public/MasonryGallery';
import { GoogleReviewsSection } from '../../components/public/GoogleReviewsSection';
import { FaqSection } from '../../components/public/FaqSection';
import { DirectBookingModal } from '../../components/public/DirectBookingModal';
import { SmartWhatsAppConcierge } from '../../components/public/SmartWhatsAppConcierge';
import { CalendarCheck, MessageSquare } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { rooms } = useHotelData();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingParams, setBookingParams] = useState<any>(undefined);
  const [quizOpen, setQuizOpen] = useState(false);

  const handleHeroSearch = (params: any) => {
    setBookingParams(params);
    setBookingModalOpen(true);
  };

  const handleDirectBookRoom = (roomTypeId?: string) => {
    const matchingRoom = roomTypeId ? rooms.find(r => r.room_type_id === roomTypeId) : rooms[0];
    setBookingParams({
      roomType: roomTypeId,
      selectedRoom: matchingRoom,
    });
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-neutral-900 overflow-x-hidden w-full max-w-full">
      {/* 01 — HERO (Clean, Impactful Cinematic Hero with Floating Search Capsule) */}
      <ProductHero onSearch={handleHeroSearch} />

      {/* 02 — LUXURY HOTEL FACILITIES STRIP (MakeMyTrip Style 2-Row Single Line) */}
      <HeroAmenitiesStrip />

      {/* 03 — OFFICIAL DIRECT RATE GUARANTEE */}
      <DirectBookingPerks onCheckAvailability={() => setBookingModalOpen(true)} />

      {/* 04 — COMPARE OUR ROOM CATEGORIES (Equal-Height 3-Column Comparison Grid) */}
      <DecisionRoomGrid
        onDirectBook={handleDirectBookRoom}
        onOpenMatcherQuiz={() => setQuizOpen(true)}
      />

      {/* 05 — OPEN-AIR SKYLINE ROOFTOP & EVENING CAFE */}
      <RooftopExperience />

      {/* 06 — FRESH IN-HOUSE KITCHEN & ALL-DAY DINING */}
      <EditorialDining />

      {/* 07 — INTERACTIVE JAIPUR TRANSIT & EXACT HOTEL MAPPLE INN PIN MAP */}
      <InteractiveTransitMap />

      {/* 08 — MOMENTS & SPACES PHOTO GALLERY (Strict 0px Corners) */}
      <MasonryGallery />

      {/* 09 — VERIFIED 4.6★ GOOGLE REVIEWS (Equal-Height Cards) */}
      <GoogleReviewsSection />

      {/* 10 — HOSPITALITY FAQ ACCORDION */}
      <FaqSection />

      {/* 11 — CLEAN CLOSING CTA BANNER */}
      <section className="py-16 sm:py-20 bg-[#121110] text-white border-t border-neutral-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-10 lg:px-16 text-center relative z-10 w-full">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block mb-3">
            DIRECT RESERVATIONS • ZERO COMMISSIONS
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold mb-4 text-white leading-tight">
            Reserve Your Stay in Jaipur.
          </h2>
          <p className="text-xs sm:text-base text-neutral-300 max-w-xl mx-auto mb-8 leading-relaxed font-normal">
            Check today's live availability and book directly with Hotel Mapple Inn for our guaranteed lowest rate and instant front desk confirmation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full">
            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full sm:w-auto bg-white hover:bg-neutral-100 text-neutral-950 font-bold py-3.5 px-8 rounded-none text-xs uppercase tracking-wider shadow-2xl transition active:scale-95 flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Direct</span>
            </button>

            <a
              href="https://wa.me/919680131232?text=Hello%20Hotel%20Mapple%20Inn!%20I%20would%20like%20to%20reserve%20a%20stay."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-7 rounded-none text-xs flex items-center justify-center space-x-2 transition shadow-md whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Reception</span>
            </a>
          </div>
        </div>
      </section>

      {/* Floating Clean WhatsApp Icon */}
      <SmartWhatsAppConcierge />

      {/* Slide-over Matcher Quiz Modal */}
      <RoomMatcherQuiz
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        onSelectRoomToBook={handleDirectBookRoom}
      />

      {/* Direct Booking Modal */}
      <DirectBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialParams={bookingParams}
      />
    </div>
  );
};
