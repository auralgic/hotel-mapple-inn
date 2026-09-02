import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Eye, Sparkles, Maximize2 } from 'lucide-react';
import { useHotelData } from '../../context/HotelDataContext';

interface GalleryItem {
  id: string;
  title: string;
  category: 'rooms' | 'bathrooms' | 'dining' | 'rooftop' | 'property';
  image: string;
  tag: string;
  colSpan?: string;
  rowSpan?: string;
}

export const MasonryGallery: React.FC = () => {
  const { mediaConfig } = useHotelData();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g1',
      title: 'Open-Air Skyline Rooftop at Golden Hour',
      category: 'rooftop',
      image: mediaConfig?.rooftopSunsetUrl || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
      tag: 'SKYLINE TERRACE',
      colSpan: 'lg:col-span-2',
      rowSpan: 'lg:row-span-2',
    },
    {
      id: 'g2',
      title: 'Deluxe King Suite with Fresh Linens',
      category: 'rooms',
      image: mediaConfig?.deluxeRoomImage || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=85',
      tag: 'DELUXE ROOMS',
      colSpan: 'lg:col-span-2',
    },
    {
      id: 'g3',
      title: 'Spotless Ensuite Bathroom with Rain Shower',
      category: 'bathrooms',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=85',
      tag: 'HOT WATER ENSUITE',
      colSpan: 'lg:col-span-1',
    },
    {
      id: 'g4',
      title: 'Authentic Royal Special Thali & Delicacies',
      category: 'dining',
      image: mediaConfig?.diningThaliUrl || 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=85',
      tag: 'IN-ROOM DINING',
      colSpan: 'lg:col-span-1',
    },
    {
      id: 'g5',
      title: 'Executive Master Suite with Private Lounge',
      category: 'rooms',
      image: mediaConfig?.executiveSuiteImage || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85',
      tag: 'EXECUTIVE SUITES',
      colSpan: 'lg:col-span-2',
    },
    {
      id: 'g6',
      title: 'Evening Ambiance at Mapple Sky Cafe',
      category: 'rooftop',
      image: mediaConfig?.rooftopCafeUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85',
      tag: 'ROOFTOP LOUNGE',
      colSpan: 'lg:col-span-1',
    },
    {
      id: 'g7',
      title: 'Welcoming Reception & Guest Lobby',
      category: 'property',
      image: mediaConfig?.lobbyReceptionUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85',
      tag: 'FRONT DESK & LOBBY',
      colSpan: 'lg:col-span-1',
    },
  ];

  const filteredItems = galleryItems.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIdx !== null) {
      setLightboxIdx((lightboxIdx - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIdx !== null) {
      setLightboxIdx((lightboxIdx + 1) % filteredItems.length);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#f7f3ec] text-neutral-900 border-b border-[#e2d8ca] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4 sm:gap-6">
          <div>
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
              MOMENTS & SPACES · VISUAL GALLERY
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-neutral-950 leading-tight">
              A Glimpse Inside Hotel Mapple Inn
            </h2>
            <p className="text-xs sm:text-base text-neutral-600 mt-2 max-w-2xl font-normal leading-relaxed">
              From sunlit bedrooms with fresh king linens to twilight sunsets on our skyline terrace, discover the handcrafted spaces that make your Jaipur stay unforgettable.
            </p>
          </div>

          {/* Filter Pills with strict 0px radius */}
          <div className="flex flex-wrap gap-2 text-xs font-semibold shrink-0">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'rooms', label: 'Rooms & Suites' },
              { id: 'rooftop', label: 'Rooftop & Cafe' },
              { id: 'dining', label: 'In-Room Dining' },
              { id: 'bathrooms', label: 'Bathrooms' },
              { id: 'property', label: 'Lobby' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-none transition text-[11px] sm:text-xs whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-neutral-950 text-white font-bold shadow-sm'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-[#dfd5c7]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Cell Photo Grid Architecture with strict rounded-none */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[220px] sm:auto-rows-[270px]">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIdx(idx)}
              className={`rounded-none bg-neutral-900 border border-[#dfd5c7] shadow-sm group cursor-pointer relative overflow-hidden ${
                activeCategory === 'all' && item.colSpan ? item.colSpan : 'col-span-1'
              } ${activeCategory === 'all' && item.rowSpan ? item.rowSpan : 'row-span-1'}`}
            >
              {/* Background Image with Hover Scale */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 rounded-none"
                loading="lazy"
              />

              {/* Top Zoom Icon (0px radius) */}
              <div className="absolute top-3 right-3 bg-black/70 text-white p-1.5 sm:p-2 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              </div>

              {/* Bottom Pinned Text Overlay with Luxury Gradient */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-12 sm:pt-16 pb-3 sm:pb-4 px-3.5 sm:px-5 text-white flex flex-col justify-end">
                <span className="text-[9px] sm:text-[10px] text-amber-300 font-semibold uppercase tracking-wider block mb-0.5 sm:mb-1">
                  {item.tag}
                </span>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs sm:text-base text-white group-hover:text-amber-200 transition-colors truncate">
                    {item.title}
                  </h4>
                  <span className="text-xs text-neutral-300 hidden sm:group-hover:inline-block font-medium whitespace-nowrap ml-2">
                    View →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Fullscreen Modal with 0px radius */}
      {lightboxIdx !== null && (
        <div
          onClick={() => setLightboxIdx(null)}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fadeIn"
        >
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-none bg-black/50"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-8 text-white p-2 sm:p-3 rounded-none bg-black/60 hover:bg-black/90 transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            onClick={e => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh] rounded-none overflow-hidden border border-neutral-700 shadow-2xl text-center"
          >
            <img
              src={filteredItems[lightboxIdx].image}
              alt={filteredItems[lightboxIdx].title}
              className="max-h-[75vh] w-auto mx-auto object-contain rounded-none"
            />
            <div className="p-3 sm:p-4 bg-[#141312] text-white rounded-none">
              <span className="text-[11px] sm:text-xs text-amber-400 font-semibold uppercase">
                {filteredItems[lightboxIdx].tag}
              </span>
              <h3 className="text-sm sm:text-lg font-semibold mt-0.5">
                {filteredItems[lightboxIdx].title}
              </h3>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-8 text-white p-2 sm:p-3 rounded-none bg-black/60 hover:bg-black/90 transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};
