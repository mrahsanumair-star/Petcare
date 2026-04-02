export interface Breed {
  id: string;
  name: string;
  origin: string;
  description: string;
  temperament: string[];
  lifeSpan: string;
  weight: string;
  image: string;
  characteristics: {
    affectionLevel: number; // 1-5
    energyLevel: number;    // 1-5
    intelligence: number;   // 1-5
    shedding: number;       // 1-5
  };
  featured?: boolean;
}

export interface LostCat {
  id: string;
  name: string;
  breed: string;
  lastSeen: string;
  location: string;
  image: string;
  status: 'lost' | 'found';
  description: string;
  contact: string;
}

export type Screen = 'home' | 'list' | 'detail' | 'lost-found' | 'translator';
