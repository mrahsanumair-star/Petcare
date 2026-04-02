import React, { useState } from 'react';
import { ArrowLeft, MapPin, Phone, Clock, Plus, Search, Filter } from 'lucide-react';
import { lostCats } from '../data/lostCats';
import { motion, AnimatePresence } from 'motion/react';

interface LostFoundScreenProps {
  onBack: () => void;
}

export const LostFoundScreen: React.FC<LostFoundScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const filteredCats = lostCats.filter(cat => cat.status === activeTab);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCF0] text-[#1A1A2E] pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-[#FDFCF0]/80 backdrop-blur-md z-10">
        <button 
          onClick={onBack}
          className="p-3 glass rounded-full text-[#1A1A2E] shadow-sm"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-black italic">Lost & Found</h1>
        <button className="p-3 glass rounded-full text-[#FF7E5F]">
          <Filter className="w-5 h-5" />
        </button>
      </header>

      {/* Tab Switcher */}
      <div className="px-6 mb-8">
        <div className="bg-slate-100 p-1 rounded-2xl flex relative h-14">
          <motion.div 
            className="absolute top-1 bottom-1 bg-white rounded-xl shadow-sm z-0"
            initial={false}
            animate={{ 
              left: activeTab === 'lost' ? '4px' : '50%',
              right: activeTab === 'lost' ? '50%' : '4px'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button 
            onClick={() => setActiveTab('lost')}
            className={`flex-1 z-10 font-black text-sm uppercase tracking-widest transition-colors ${activeTab === 'lost' ? 'text-[#FF7E5F]' : 'text-slate-400'}`}
          >
            Lost
          </button>
          <button 
            onClick={() => setActiveTab('found')}
            className={`flex-1 z-10 font-black text-sm uppercase tracking-widest transition-colors ${activeTab === 'found' ? 'text-[#FF7E5F]' : 'text-slate-400'}`}
          >
            Found
          </button>
        </div>
      </div>

      {/* List of Cats */}
      <div className="px-6 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6"
          >
            {filteredCats.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-50 group"
              >
                <div className="relative h-64">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${activeTab === 'lost' ? 'bg-[#FF7E5F] text-white' : 'bg-green-500 text-white'}`}>
                      {activeTab === 'lost' ? 'Missing' : 'Found'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black italic text-[#1A1A2E]">{cat.name}</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{cat.breed}</p>
                    </div>
                    <button className="p-3 bg-slate-50 rounded-2xl text-[#FF7E5F] hover:bg-[#FF7E5F] hover:text-white transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-slate-500">
                      <MapPin className="w-4 h-4 text-[#FF7E5F]" />
                      <span className="text-sm font-medium">{cat.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <Clock className="w-4 h-4 text-[#FF7E5F]" />
                      <span className="text-sm font-medium">{cat.lastSeen}</span>
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6 italic">
                    "{cat.description}"
                  </p>

                  <button className="w-full py-4 bg-[#1A1A2E] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-slate-900/20 active:scale-95 transition-transform">
                    Contact Owner
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-28 right-6 w-16 h-16 bg-[#FF7E5F] text-white rounded-full shadow-2xl flex items-center justify-center z-40 border-4 border-white"
      >
        <Plus className="w-8 h-8" />
      </motion.button>
    </div>
  );
};
