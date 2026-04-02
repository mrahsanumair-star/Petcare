import { LostCat } from '../types';

export const lostCats: LostCat[] = [
  {
    id: 'lc1',
    name: 'Whiskers',
    breed: 'Siamese',
    lastSeen: '2 hours ago',
    location: 'Central Park, NY',
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=400&h=400',
    status: 'lost',
    description: 'Very friendly, wearing a red collar with a bell.',
    contact: '+1 234 567 890'
  },
  {
    id: 'lc2',
    name: 'Luna',
    breed: 'Maine Coon',
    lastSeen: 'Yesterday',
    location: 'Brooklyn Heights',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400&h=400',
    status: 'lost',
    description: 'Large cat, very shy. Please do not chase.',
    contact: '+1 987 654 321'
  },
  {
    id: 'lc3',
    name: 'Found Cat',
    breed: 'Unknown (Grey Tabby)',
    lastSeen: '3 days ago',
    location: 'Queens, NY',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400&h=400',
    status: 'found',
    description: 'Found near the library. Very calm and well-fed.',
    contact: '+1 555 0199'
  }
];
