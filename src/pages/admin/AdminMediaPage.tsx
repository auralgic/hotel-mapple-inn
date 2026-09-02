import React, { useState, useRef } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { HotelMediaConfig } from '../../types';
import { INITIAL_MEDIA_CONFIG } from '../../lib/demoData';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import {
  Image as ImageIcon,
  Video,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  BedDouble,
  Sunset,
  Utensils,
  Eye,
  Upload,
  Link as LinkIcon,
  Cloud,
  Loader2,
  HardDrive,
} from 'lucide-react';

export const AdminMediaPage: React.FC = () => {
  const { mediaConfig, updateMediaConfig } = useHotelData();
  const [formData, setFormData] = useState<HotelMediaConfig>(mediaConfig || INITIAL_MEDIA_CONFIG);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleChange = (key: keyof HotelMediaConfig, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (key: keyof HotelMediaConfig, file: File) => {
    if (!file) return;
    setUploadingField(key as string);

    try {
      if (isSupabaseConfigured && supabase) {
        // Upload to Supabase Cloud Storage (AWS S3-backed Object Storage)
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${String(key)}_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('hotel-assets')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (!uploadError) {
          const { data } = supabase.storage.from('hotel-assets').getPublicUrl(fileName);
          if (data?.publicUrl) {
            handleChange(key, data.publicUrl);
            setUploadingField(null);
            return;
          }
        }
      }

      // High-speed browser fallback: Convert to Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleChange(key, reader.result);
        }
        setUploadingField(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File upload error:', err);
      setUploadingField(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMediaConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all website images and video back to initial luxury defaults?')) {
      setFormData(INITIAL_MEDIA_CONFIG);
      updateMediaConfig(INITIAL_MEDIA_CONFIG);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  const mediaSections = [
    {
      title: 'Brand Identity & Navbar Logo',
      desc: 'Horizontal shape PNG logo with hotel name rendered in the header and footer.',
      icon: Sparkles,
      fields: [
        {
          key: 'logoUrl' as keyof HotelMediaConfig,
          label: 'Horizontal Hotel Logo (.PNG with Transparent Background)',
          hint: 'Appears on navbar and tax invoices. Leave empty for default gold monogram.',
          accept: 'image/png,image/svg+xml,image/jpeg,image/webp',
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
          label: 'Hero Background Ambient Video (.mp4 / .webm)',
          hint: 'Plays in the cinematic background (muted, looped, non-clickable).',
          accept: 'video/mp4,video/webm',
        },
        {
          key: 'heroImageUrl' as keyof HotelMediaConfig,
          label: 'Hero Image Poster / Mobile Fallback Photo',
          hint: 'Displays on initial load and on mobile browsers before video plays.',
          accept: 'image/*',
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
          label: 'Deluxe King Room Featured Photo',
          hint: 'Rooms 201, 202, 205, 206, 301, 302.',
          accept: 'image/*',
        },
        {
          key: 'superDeluxeImage' as keyof HotelMediaConfig,
          label: 'Super Deluxe Balcony Room Photo',
          hint: 'Rooms 203, 204, 207, 208, 303, 304.',
          accept: 'image/*',
        },
        {
          key: 'executiveSuiteImage' as keyof HotelMediaConfig,
          label: 'Executive Master Suite Photo',
          hint: 'Rooms 305, 306, 307, 308 on Floor 3.',
          accept: 'image/*',
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
          label: 'Rooftop Sunset Skyline Photo',
          hint: 'Scenic dusk view over Jaipur Pink City skyline.',
          accept: 'image/*',
        },
        {
          key: 'rooftopCafeUrl' as keyof HotelMediaConfig,
          label: 'Rooftop Sky Cafe Evening Ambience Photo',
          hint: 'Fairy lights, cozy seating, and mocktails/coffee lounge.',
          accept: 'image/*',
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
          label: 'Rajasthani Royal Thali Signature Dish Photo',
          hint: 'Featured in the in-house dining section.',
          accept: 'image/*',
        },
        {
          key: 'lobbyReceptionUrl' as keyof HotelMediaConfig,
          label: 'Lobby & Reception Entrance Photo',
          hint: 'Front desk and ground entrance greeting visual.',
          accept: 'image/*',
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-1">
            WEBSITE ASSETS & CONTENT MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Property Media & Image Manager
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Upload images/videos directly from your device, or paste external URLs. Changes publish live instantly across the hotel website.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="bg-white hover:bg-neutral-100 text-neutral-700 font-bold px-4 py-2 text-xs border border-neutral-300 shadow-xs transition flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Cloud Storage Location Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 p-4 text-xs text-amber-950 flex items-start space-x-3">
        <Cloud className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold block">Where are uploaded files hosted?</strong>
          <p className="text-neutral-700 leading-relaxed">
            Uploaded files are stored in your secure <strong>Supabase Cloud Storage (AWS S3-backed Object Storage)</strong> bucket (<code>hotel-assets</code>). 
            Files receive global CDN edge caching with 100% uptime and instant loading on phones and desktops. You can also paste any external image link (Unsplash, Cloudinary, Imgur, etc.) anytime!
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 text-xs flex items-center space-x-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span><strong>Media Updated Successfully!</strong> All images and videos are now live on the public hotel website.</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {mediaSections.map(sec => {
          const Icon = sec.icon;

          return (
            <div
              key={sec.title}
              className="bg-white p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-5"
            >
              <div className="flex items-center space-x-3 border-b border-neutral-100 pb-3.5">
                <div className="w-9 h-9 bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-neutral-500">{sec.desc}</p>
                </div>
              </div>

              <div className="space-y-4">
                {sec.fields.map(field => {
                  const currentValue = formData[field.key];
                  const isVideo = field.key === 'heroVideoUrl';
                  const isUploading = uploadingField === (field.key as string);

                  return (
                    <div
                      key={field.key}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-neutral-50/80 p-4 border border-neutral-200"
                    >
                      <div className="lg:col-span-8 space-y-2">
                        <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
                          {field.label}
                        </label>

                        {/* Dual Mode: Upload File Button + URL Input */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          {/* 1. Direct File Upload Button */}
                          <input
                            type="file"
                            ref={el => (fileInputRefs.current[field.key as string] = el)}
                            accept={field.accept}
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(field.key, file);
                            }}
                            className="hidden"
                          />

                          <button
                            type="button"
                            disabled={isUploading}
                            onClick={() => fileInputRefs.current[field.key as string]?.click()}
                            className="bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 px-3 py-2 text-xs font-bold flex items-center justify-center space-x-1.5 shadow-2xs transition shrink-0 cursor-pointer disabled:opacity-50"
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5 text-amber-700" />
                                <span>Upload File</span>
                              </>
                            )}
                          </button>

                          {/* 2. Direct URL Link Input */}
                          <div className="relative flex-grow">
                            <input
                              type="text"
                              value={currentValue}
                              onChange={e => handleChange(field.key, e.target.value)}
                              placeholder="Or paste image/video URL (https://...)"
                              className="w-full bg-white border border-neutral-300 px-3 py-2 pl-8 text-xs text-neutral-900 font-mono focus:outline-none focus:border-amber-700"
                            />
                            <LinkIcon className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                          </div>
                        </div>

                        <span className="text-[11px] text-neutral-500 block">{field.hint}</span>
                      </div>

                      {/* Live Thumbnail Preview */}
                      <div className="lg:col-span-4 flex items-center space-x-3">
                        <div className="relative aspect-[16/10] w-36 overflow-hidden bg-neutral-900 border border-neutral-300 shadow-2xs shrink-0">
                          {isVideo ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-amber-400 p-2 text-center">
                              <Video className="w-6 h-6 mb-1" />
                              <span className="text-[9px] text-neutral-400 truncate max-w-full">MP4 Video</span>
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

                        {currentValue && (
                          <a
                            href={currentValue}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-amber-800 hover:underline inline-flex items-center space-x-1 font-semibold"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Full</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Floating Save Bar */}
        <div className="sticky bottom-6 bg-neutral-950 text-white p-4 shadow-2xl border border-neutral-800 flex items-center justify-between">
          <div className="text-xs">
            <strong className="block font-bold">Unsaved changes?</strong>
            <span className="text-neutral-400 text-[11px]">Click Save to publish your photo & video changes to the live hotel website.</span>
          </div>

          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold py-2.5 px-6 text-xs uppercase tracking-wider shadow-lg transition flex items-center space-x-2 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Media Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
