export interface RoomCategoryData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  size: string;
  occupancy: string;
  bed: string;
  badge?: string | null;
  floorInfo: string;
  images: string[];
  description: string;
  highlights: string[];
  amenities: string[];
  bathroomFeatures: string[];
  roomNumbers: string[];
}

export const ROOM_CATEGORIES_DATA: RoomCategoryData[] = [
  {
    id: 'rt-deluxe',
    slug: 'deluxe-room',
    name: 'Deluxe Room',
    tagline: 'Perfect for couples & business travellers',
    price: 2200,
    size: '260 sq ft',
    occupancy: '2 Guests',
    bed: 'King Bed',
    badge: null,
    floorInfo: 'Floors 2 & 3 (Rooms 201, 202, 205, 206, 301, 302)',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    description: 'Designed for restful stays whether you are visiting Jaipur for work or city exploration. Features plush king bedding, split AC, 43" Smart LED TV, high-speed Wi-Fi, and a spotless ensuite bathroom with 24/7 hot water.',
    highlights: ['King Bed & Fresh Linens', 'Quiet Courtyard Facing', 'Dedicated Work Desk', '24/7 Hot Water Geyser'],
    amenities: ['Split Air Conditioner', '43" Smart LED TV', 'High-Speed Wi-Fi', 'Work Desk & Chair', 'Electric Kettle & Tea Kit', 'RO Filtered Water'],
    bathroomFeatures: ['Rain Shower', '24/7 Hot Water Geyser', 'Fresh Bath Towels', 'Complimentary Toiletries'],
    roomNumbers: ['201', '202', '205', '206', '301', '302'],
  },
  {
    id: 'rt-super-deluxe',
    slug: 'super-deluxe-room',
    name: 'Super Deluxe Balcony Room',
    tagline: 'Spacious layout with scenic private balcony',
    price: 2800,
    size: '320 sq ft',
    occupancy: '3 Guests',
    bed: 'King Bed + Extra Mat',
    badge: '★ MOST POPULAR',
    floorInfo: 'Floors 2 & 3 (Rooms 203, 204, 207, 208, 303, 304)',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    description: 'Our most popular boutique room offers extra square footage, a private open-air balcony overlooking Nirman Nagar, dedicated work desk, tea/coffee maker, and plush sitting lounge.',
    highlights: ['Private Balcony with City View', 'Extra Spacious Seating Lounge', 'King Bed + Extra Mattress Option', 'Express In-Room Dining'],
    amenities: ['Private Balcony', '50" Smart LED TV', 'Tea & Coffee Maker', 'Split Air Conditioner', 'Work Desk & Lounge Chair', 'Digital Wardrobe Safe'],
    bathroomFeatures: ['Glass Shower Area', 'High-Pressure Geyser', 'Premium Toiletries', 'Large Vanity Mirror'],
    roomNumbers: ['203', '204', '207', '208', '303', '304'],
  },
  {
    id: 'rt-executive',
    slug: 'executive-suite',
    name: 'Executive Master Suite',
    tagline: 'Top-floor luxury with separate living lounge',
    price: 3800,
    size: '480 sq ft',
    occupancy: '4 Guests',
    bed: 'King Master + Sofa Lounge',
    badge: 'SIGNATURE SUITE',
    floorInfo: 'Floor 3 Exclusive (Rooms 305, 306, 307, 308)',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    description: 'The pinnacle of comfort at Hotel Mapple Inn. Features a master bedroom with separate living room, plush fabric sofa set, mini-refrigerator, 2 smart LED TVs, and priority front-desk assistance.',
    highlights: ['Separate Living Room & Sofa Set', 'Mini Refrigerator in Suite', '2x Smart LED TVs', 'Top-Floor Peaceful Position'],
    amenities: ['Living Room + Master Bedroom', 'Mini Refrigerator', '2x Smart LED TVs', 'Plush Sofa Set', 'Split AC in both zones', 'Tea & Coffee Station'],
    bathroomFeatures: ['Luxury Bath Vanity', 'Instant Geyser Hot Water', 'Premium Toiletries & Towels', 'Hairdryer on Request'],
    roomNumbers: ['305', '306', '307', '308'],
  },
];
