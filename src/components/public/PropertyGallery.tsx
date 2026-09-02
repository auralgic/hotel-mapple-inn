import React, { useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

export const PropertyGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const galleryItems = [
    {
      id: 'g1',
      title: 'Deluxe Room Setup',
      category: 'rooms',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      caption: 'King bed, air conditioning, and LED TV setup.',
    },
    {
      id: 'g2',
      title: 'Super Deluxe Balcony Suite',
      category: 'rooms',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      caption: 'Spacious room with seating area and work desk.',
    },
    {
      id: 'g3',
      title: 'Executive Living Room',
      category: 'rooms',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      caption: 'Dedicated living lounge in Executive Suite.',
    },
    {
      id: 'g4',
      title: 'Spotless Ensuite Bathroom',
      category: 'bathrooms',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      caption: 'Modern bathroom with geyser and clean amenities.',
    },
    {
      id: 'g5',
      title: 'Royal Thali Dining',
      category: 'dining',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
      caption: 'Pure veg Rajasthani thali served hot to room.',
    },
    {
      id: 'g6',
      title: 'Front Desk & Reception',
      category: 'reception',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      caption: 'Welcoming front desk lobby at Nirman Nagar.',
    },
  ];

  const filteredItems = galleryItems.filter(i => activeCategory === 'all' || i.category === activeCategory);

  return (
    <section className="py-20 bg-[#fcfaf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-hotel-700 uppercase tracking-widest block mb-2">
            Property Visuals
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
            See What Awaits You at Hotel Mapple Inn
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2">
            Explore our rooms, bathrooms, pure-veg kitchen dining, and hospitality spaces.
          </p>

          {/* Gallery Category Filter Tabs */}
          <div className="flex items-center justify-center space-x-2 mt-6 flex-wrap gap-2 text-xs">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'rooms', label: 'Rooms & Suites' },
              { id: 'bathrooms', label: 'Bathrooms' },
              { id: 'dining', label: 'In-Room Dining' },
              { id: 'reception', label: 'Lobby & Reception' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  activeCategory === cat.id
                    ? 'bg-hotel-700 text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-hotel-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery 6-Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden border border-hotel-200 shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-60 w-full overflow-hidden bg-neutral-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-5">
                  <div className="text-white">
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-xs text-neutral-300 mt-0.5">{item.caption}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-800">{item.title}</span>
                <span className="text-[10px] text-neutral-500 uppercase font-semibold">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
