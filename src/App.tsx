import { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { BreedsListScreen } from './components/BreedsListScreen';
import { BreedDetailScreen } from './components/BreedDetailScreen';
import { LostFoundScreen } from './components/LostFoundScreen';
import { TranslatorScreen } from './components/TranslatorScreen';
import { Breed, Screen } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);

  const handleSelectBreed = (breed: Breed) => {
    setSelectedBreed(breed);
    setCurrentScreen('detail');
  };

  const handleBack = () => {
    if (currentScreen === 'detail') {
      // If we came from the list, go back to list, otherwise home
      // For simplicity in this demo, we'll just track if we were in list mode
      // But let's just go back to home or list based on what's more natural
      setCurrentScreen(selectedBreed && !selectedBreed.featured ? 'list' : 'home');
    } else {
      setCurrentScreen('home');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomeScreen 
              onSelectBreed={handleSelectBreed} 
              onViewAll={() => setCurrentScreen('list')} 
              onOpenTranslator={() => setCurrentScreen('translator')}
            />
          </motion.div>
        )}

        {currentScreen === 'list' && (
          <motion.div
            key="list"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <BreedsListScreen 
              onBack={() => setCurrentScreen('home')} 
              onSelectBreed={handleSelectBreed} 
            />
          </motion.div>
        )}

        {currentScreen === 'detail' && selectedBreed && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <BreedDetailScreen 
              breed={selectedBreed} 
              onBack={handleBack} 
            />
          </motion.div>
        )}

        {currentScreen === 'lost-found' && (
          <motion.div
            key="lost-found"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <LostFoundScreen 
              onBack={() => setCurrentScreen('home')} 
            />
          </motion.div>
        )}

        {currentScreen === 'translator' && (
          <motion.div
            key="translator"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <TranslatorScreen 
              onBack={() => setCurrentScreen('home')} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation - Premium Glassmorphism */}
      {currentScreen !== 'detail' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-md glass rounded-[32px] px-6 py-5 flex justify-between items-center z-30 shadow-2xl border border-white/50">
          <button 
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentScreen === 'home' ? 'text-[#FF7E5F] scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full mb-1 transition-all ${currentScreen === 'home' ? 'bg-[#FF7E5F] scale-150' : 'bg-transparent'}`} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Home</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('list')}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentScreen === 'list' ? 'text-[#FF7E5F] scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full mb-1 transition-all ${currentScreen === 'list' ? 'bg-[#FF7E5F] scale-150' : 'bg-transparent'}`} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Breeds</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('lost-found')}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentScreen === 'lost-found' ? 'text-[#FF7E5F] scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full mb-1 transition-all ${currentScreen === 'lost-found' ? 'bg-[#FF7E5F] scale-150' : 'bg-transparent'}`} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Lost</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('translator')}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentScreen === 'translator' ? 'text-[#FF7E5F] scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full mb-1 transition-all ${currentScreen === 'translator' ? 'bg-[#FF7E5F] scale-150' : 'bg-transparent'}`} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Talk</span>
          </button>
        </div>
      )}
    </div>
  );
}
