import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { HotelMediaConfig } from '../../types';
import { INITIAL_MEDIA_CONFIG } from '../../lib/demoData';
import {
  Image,
  Video,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  BedDouble,
  Sunset,
  Utensils,
  Eye,
} from 'lucide-react';

export const AdminMediaPage: React.FC = () => {
  const { mediaConfig, updateMediaConfig } = useHotelData();
  const [formData, setFormData] = useState<HotelMediaConfig>(mediaConfig || INITIAL_MEDIA_CONFIG);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (key: keyof HotelMediaConfig, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMediaConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    setFormData(INITIAL_MEDIA_CONFIG);
    updateMediaConfig(INITIAL_MEDIA_CONFIG);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const mediaSections = [
    {
      title: 'Brand Identity & Navbar Logo',
      desc: 'Horizontal shape PNG logo with hotel name rendered in the header and footer.',
      icon: Sparkles,
      fields: [
        {
          key: 'logoUrl' as keyof HotelMediaConfig,
          label: 'Horizontal PNG Logo URL (Transparent background recommended)',
          hint: 'Leave empty to use default text/monogram branding.',
        },
      ],
    },
    {
      title: 'Hero Section Assets',
      desc: 'Ambient background video & hero photography seen at the top of the homepage.',
      icon: Video,
      fields: [
        {
          key: 'heroVideoUrl' as keyof HotelMediaConfig,
          label: 'Hero Background Ambient Video (.mp4 URL)',
          hint: 'Plays automatically in the background (muted, non-clickable).',
        },
        {
          key: 'heroImageUrl' as keyof HotelMediaConfig,
          label: 'Hero Image Poster / Fallback URL',
          hint: 'Displays on initial load and on mobile browsers.',
        },
      ],
    },
    {
      title: '16 Boutique Rooms & Suites Photography',
      desc: 'Featured cards and slide-over gallery photos for the 3 room categories.',
      icon: BedDouble,
      fields: [
        {
          key: 'deluxeRoomImage' as keyof HotelMediaConfig,
          label: 'Deluxe Room Featured Photo URL',
          hint: 'Rooms 201, 202, 205, 206, 301, 302.',
        },
        {
          key: 'superDeluxeImage' as keyof HotelMediaConfig,
          label: 'Super Deluxe Balcony Room Photo URL',
          hint: 'Rooms 203, 204, 207, 208, 303, 304.',
        },
        {
          key: 'executiveSuiteImage' as keyof HotelMediaConfig,
          label: 'Executive Master Suite Photo URL',
          hint: 'Rooms 305, 306, 307, 308 on Floor 3.',
        },
      ],
    },
    {
      title: 'Skyline Rooftop & Cafe Terrace',
      desc: 'Open-air rooftop sunset and upcoming Mapple Sky Cafe imagery.',
      icon: Sunset,
      fields: [
        {
          key: 'rooftopSunsetUrl' as keyof HotelMediaConfig,
          label: 'Rooftop Sunset Skyline Photo URL',
          hint: 'Scenic dusk view over Jaipur Pink City skyline.',
        },
        {
          key: 'rooftopCafeUrl' as keyof HotelMediaConfig,
          label: 'Rooftop Sky Cafe Evening Ambience URL',
          hint: 'Fairy lights, cozy seating, and mocktails/coffee lounge.',
        },
      ],
    },
    {
      title: 'Dining & Property Atmosphere',
      desc: '100% pure-veg restaurant showcase and reception lobby.',
      icon: Utensils,
      fields: [
        {
          key: 'diningThaliUrl' as keyof HotelMediaConfig,
          label: 'Rajasthani Royal Thali Signature Dish URL',
          hint: 'Featured in the "Jaipur, Served Fresh" gastronomy section.',
        },
        {
          key: 'lobbyReceptionUrl' as keyof HotelMediaConfig,
          label: 'Lobby & Reception Photo URL',
          hint: 'Front desk and ground entrance greeting visual.',
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-hotel-600 uppercase tracking-widest block mb-1">
            WEBSITE ASSETS & CONTENT MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Property Media & Image Manager
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Update hero background videos, room photos, rooftop cafe visuals, and dining images across the live hotel website.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="bg-white hover:bg-neutral-100 text-neutral-700 font-bold px-4 py-2 rounded-xl text-xs border border-neutral-300 shadow-sm transition flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs flex items-center space-x-2 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span><strong>Media Updated Successfully!</strong> All changes are now live across the public hotel website.</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {mediaSections.map(sec => {
          const Icon = sec.icon;

          return (
            <div
              key={sec.title}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6"
            >
              <div className="flex items-center space-x-3 border-b border-neutral-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-hotel-100 text-hotel-700 flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-neutral-500">{sec.desc}</p>
                </div>
              </div>

              <div className="space-y-5">
                {sec.fields.map(field => {
                  const currentValue = formData[field.key];
                  const isVideo = field.key === 'heroVideoUrl';

                  return (
                    <div
                      key={field.key}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80"
                    >
                      <div className="lg:col-span-8 space-y-1">
                        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                          {field.label}
                        </label>
                        <input
                          type="url"
                          required
                          value={currentValue}
                          onChange={e => handleChange(field.key, e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 font-mono focus:outline-none focus:border-hotel-600 shadow-sm"
                        />
                        <span className="text-[11px] text-neutral-500 block">{field.hint}</span>
                      </div>

                      {/* Live Thumbnail Preview */}
                      <div className="lg:col-span-4 flex items-center space-x-3">
                        <div className="relative aspect-[16/10] w-36 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-300 shadow-sm shrink-0">
                          {isVideo ? (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-amber-400">
                              <Video className="w-6 h-6" />
                            </div>
                          ) : (
                            <img
                              src={currentValue}
                              alt="Live Preview"
                              className="w-full h-full object-cover"
                              onError={e => {
                                (e.target as HTMLElement).style.opacity = '0.3';
                              }}
                            />
                          )}
                        </div>
                        <a
                          href={currentValue}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-hotel-600 hover:underline inline-flex items-center space-x-1 font-semibold"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Full</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Save Bar */}
        <div className="sticky bottom-6 bg-neutral-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-neutral-700 flex items-center justify-between">
          <div className="text-xs">
            <strong className="block font-bold">Unsaved changes?</strong>
            <span className="text-neutral-400 text-[11px]">Click Save to immediately publish image updates to the website.</span>
          </div>

          <button
            type="submit"
            className="bg-hotel-600 hover:bg-hotel-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-lg transition flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Publish Media Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
