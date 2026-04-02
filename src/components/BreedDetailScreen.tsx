import React from 'react';
import { ArrowLeft, Heart, Info, Star, Clock, Weight, Activity, Share2 } from 'lucide-react';
import { Breed } from '../types';
import { motion } from 'motion/react';

interface BreedDetailScreenProps {
  breed: Breed;
  onBack: () => void;
}

export const BreedDetailScreen: React.FC<BreedDetailScreenProps> = ({ breed, onBack }) => {
  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <div 
            key={star} 
            className={`w-2.5 h-2.5 rounded-full ${star <= count ? 'bg-[#FF7E5F]' : 'bg-slate-200'}`} 
          />
        ))}
      </div>
    );
  };

  const characteristics = [
    { label: 'Affection', value: breed.characteristics.affectionLevel },
    { label: 'Energy', value: breed.characteristics.energyLevel },
    { label: 'Intelligence', value: breed.characteristics.intelligence },
    { label: 'Shedding', value: breed.characteristics.shedding },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCF0] text-[#1A1A2E]">
      {/* Immersive Hero */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          src={breed.image} 
          alt={breed.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FDFCF0]" />
        
        <header className="absolute top-12 left-0 right-0 px-6 flex items-center justify-between z-20">
          <button 
            onClick={onBack}
            className="p-4 glass rounded-full text-white hover:bg-white/40 transition-colors shadow-2xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-3">
            <button className="p-4 glass rounded-full text-white shadow-2xl">
              <Share2 className="w-6 h-6" />
            </button>
            <button className="p-4 glass rounded-full text-[#FF7E5F] shadow-2xl">
              <Heart className="w-6 h-6 fill-[#FF7E5F]" />
            </button>
          </div>
        </header>

        <div className="absolute bottom-12 left-6 right-6 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-[#FEB47B] text-xs font-black uppercase tracking-[0.3em] mb-3 block drop-shadow-lg">
              {breed.origin}
            </span>
            <h1 className="text-6xl font-black text-white italic leading-none drop-shadow-2xl">
              {breed.name}
            </h1>
          </motion.div>
        </div>
        
        {/* Decorative Curve */}
        <div className="absolute -bottom-1 left-0 right-0 h-16 bg-[#FDFCF0] rounded-t-[60px]" />
      </div>

      {/* Content */}
      <div className="px-8 pb-20 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Quick Facts - Floating Cards */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-8 -mx-8 px-8">
            <div className="bg-white min-w-[140px] p-6 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
                <Clock className="text-[#FF7E5F] w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Life Span</span>
              <span className="text-sm font-bold mt-1 text-[#1A1A2E]">{breed.lifeSpan}</span>
            </div>
            <div className="bg-white min-w-[140px] p-6 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <Weight className="text-blue-400 w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Weight</span>
              <span className="text-sm font-bold mt-1 text-[#1A1A2E]">{breed.weight}</span>
            </div>
            <div className="bg-[#1A1A2E] min-w-[140px] p-6 rounded-[32px] shadow-xl shadow-slate-900/20 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                <Activity className="text-[#FEB47B] w-5 h-5" />
              </div>
              <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Nature</span>
              <span className="text-sm font-bold mt-1 text-white truncate w-full">{breed.temperament[0]}</span>
            </div>
          </div>

          {/* About Section */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-3xl font-black italic">The Story</h2>
              <div className="h-[2px] flex-1 bg-gradient-to-right from-[#FF7E5F]/20 to-transparent" />
            </div>
            <p className="text-slate-500 leading-relaxed text-lg font-medium">
              {breed.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {breed.temperament.map(tag => (
                <span key={tag} className="bg-white text-[#FF7E5F] text-[10px] px-4 py-2 rounded-full font-black uppercase tracking-widest border border-[#FF7E5F]/10 shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Characteristics - Modern Visualization */}
          <section className="bg-[#1A1A2E] p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FF7E5F]/10 rounded-full blur-3xl" />
            <h2 className="text-2xl font-black text-white italic mb-8">Traits</h2>
            <div className="grid gap-8">
              {characteristics.map((item) => (
                <div key={item.label} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs font-black uppercase tracking-widest">{item.label}</span>
                    <span className="text-[#FEB47B] text-xs font-black">{item.value}/5</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / 5) * 100}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="h-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B]" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};
