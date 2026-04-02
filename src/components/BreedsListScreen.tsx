import React from 'react';
import { ArrowLeft, ChevronRight, Filter } from 'lucide-react';
import { Breed } from '../types';
import { breeds } from '../data/breeds';
import { motion } from 'motion/react';

interface BreedsListScreenProps {
  onBack: () => void;
  onSelectBreed: (breed: Breed) => void;
}

export const BreedsListScreen: React.FC<BreedsListScreenProps> = ({ onBack, onSelectBreed }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCF0] text-slate-900">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-[#FDFCF0]/80 backdrop-blur-md z-10">
        <button 
          onClick={onBack}
          className="p-2 bg-white rounded-full shadow-sm text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">All Breeds</h1>
        <button className="p-2 bg-white rounded-full shadow-sm text-slate-900">
          <Filter className="w-5 h-5" />
        </button>
      </header>

      {/* List */}
      <div className="px-6 pb-10 space-y-4">
        {breeds.map((breed, index) => (
          <motion.div
            key={breed.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectBreed(breed)}
            className="bg-white p-4 rounded-3xl shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="relative w-20 h-20 flex-shrink-0">
              <img 
                src={breed.image} 
                alt={breed.name} 
                className="w-full h-full rounded-2xl object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">{breed.name}</h3>
                <span className="bg-slate-100 text-slate-500 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                  {breed.origin}
                </span>
              </div>
              <p className="text-slate-400 text-sm line-clamp-1">
                {breed.temperament.join(', ')}
              </p>
            </div>
            <div className="bg-orange-50 p-2 rounded-full group-hover:bg-orange-400 group-hover:text-white transition-colors text-orange-400">
              <ChevronRight className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
