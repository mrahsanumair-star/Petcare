import React, { useState } from 'react';
import { Search, Heart, ChevronRight, Sparkles, MessageSquare } from 'lucide-react';
import { Breed } from '../types';
import { breeds } from '../data/breeds';
import { motion } from 'motion/react';

interface HomeScreenProps {
  onSelectBreed: (breed: Breed) => void;
  onViewAll: () => void;
  onOpenTranslator: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectBreed, onViewAll, onOpenTranslator }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const featuredBreeds = breeds.filter(b => b.featured);

  const filteredBreeds = breeds.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCF0] text-[#1A1A2E] pb-24">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=1200" 
          alt="Hero Cat" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#FDFCF0]" />
        
        <div className="absolute top-16 left-6 right-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl font-black text-white drop-shadow-lg italic">
              Cat <span className="text-[#FF7E5F]">Explorer</span>
            </h1>
            <p className="text-white/90 font-medium mt-2 drop-shadow-md">Discover the art of feline grace</p>
          </motion.div>
        </div>

        {/* Search Bar - Glassmorphism */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="glass rounded-2xl p-1 flex items-center shadow-xl">
            <div className="flex-1 flex items-center px-4">
              <Search className="text-[#FF7E5F] w-5 h-5 mr-3" />
              <input
                type="text"
                placeholder="Search your feline friend..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-3 outline-none text-sm font-medium placeholder:text-slate-400"
              />
            </div>
            <button className="bg-[#FF7E5F] text-white p-3 rounded-xl shadow-lg active:scale-95 transition-transform">
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {searchQuery ? (
        <div className="px-6 mt-6">
          <h2 className="text-2xl font-bold mb-4 italic">Search Results</h2>
          <div className="grid gap-4">
            {filteredBreeds.map(breed => (
              <motion.div
                key={breed.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => onSelectBreed(breed)}
                className="bg-white p-4 rounded-3xl shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-all border border-slate-50"
              >
                <img 
                  src={breed.image} 
                  alt={breed.name} 
                  className="w-16 h-16 rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{breed.name}</h3>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{breed.origin}</p>
                </div>
                <div className="bg-[#FF7E5F]/10 p-2 rounded-full text-[#FF7E5F]">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Featured Section - Editorial Style */}
          <section className="mt-8">
            <div className="flex items-center justify-between px-6 mb-6">
              <h2 className="text-3xl font-black italic tracking-tight">Featured</h2>
              <button 
                onClick={onViewAll}
                className="text-[#FF7E5F] font-bold text-sm tracking-widest uppercase border-b-2 border-[#FF7E5F]"
              >
                View All
              </button>
            </div>
            
            <div className="flex overflow-x-auto gap-6 px-6 pb-8 no-scrollbar">
              {featuredBreeds.map((breed, index) => (
                <motion.div
                  key={breed.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onSelectBreed(breed)}
                  className="flex-shrink-0 w-72 group cursor-pointer"
                >
                  <div className="relative h-96 rounded-[40px] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                    <img 
                      src={breed.image} 
                      alt={breed.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-8 left-8 right-8">
                      <span className="text-[#FEB47B] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">
                        {breed.origin}
                      </span>
                      <h3 className="text-3xl font-black text-white italic leading-none mb-3">
                        {breed.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="h-[1px] w-8 bg-white/50" />
                        <span className="text-white/70 text-xs font-medium uppercase tracking-widest">Explore</span>
                      </div>
                    </div>

                    <button className="absolute top-6 right-6 p-3 glass rounded-full text-[#FF7E5F] shadow-lg active:scale-90 transition-transform">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Unique Grid Section */}
          <section className="px-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={onViewAll}
                className="bg-[#1A1A2E] p-8 rounded-[40px] flex flex-col justify-between h-56 cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FF7E5F]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Sparkles className="text-[#FEB47B] w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-white text-2xl italic leading-tight">All<br/>Breeds</h3>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-2">Discover 50+</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div 
                  onClick={() => onSelectBreed(breeds.find(b => b.id === 'siamese')!)}
                  className="bg-[#FF7E5F] p-6 rounded-[32px] flex-1 flex flex-col justify-between cursor-pointer hover:bg-[#FF6A45] transition-colors shadow-lg shadow-[#FF7E5F]/20"
                >
                  <Heart className="text-white w-6 h-6" />
                  <h3 className="font-black text-white text-lg italic">Favorites</h3>
                </div>
                <div 
                  onClick={onOpenTranslator}
                  className="bg-white p-6 rounded-[32px] flex-1 flex flex-col justify-between cursor-pointer border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="bg-orange-50 w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-[#FF7E5F] transition-colors">
                    <MessageSquare className="text-[#FF7E5F] w-4 h-4 group-hover:text-white" />
                  </div>
                  <h3 className="font-black text-[#1A1A2E] text-lg italic">Translator</h3>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
