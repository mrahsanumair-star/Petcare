import React, { useState } from 'react';
import { ArrowLeft, Mic, Volume2, RefreshCw, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TranslatorScreenProps {
  onBack: () => void;
}

export const TranslatorScreen: React.FC<TranslatorScreenProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'human-to-cat' | 'cat-to-human'>('human-to-cat');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const catSounds = ["Meow!", "Purrr...", "Mrow?", "Hiss!", "Prrrp!", "Meoooowww", "Chirp chirp"];
  const humanMeanings = [
    "I'm hungry, feed me now!", 
    "I love you, but don't touch me.", 
    "Look at this cool bug I found!", 
    "Why is the bottom of my bowl visible?", 
    "I shall now zoom across the room at 3 AM.", 
    "Pet me... okay, that's enough, now I bite.",
    "The red dot is my mortal enemy."
  ];

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    setTranslatedText('');
    
    // Simulate translation delay
    setTimeout(() => {
      if (mode === 'human-to-cat') {
        const randomSound = catSounds[Math.floor(Math.random() * catSounds.length)];
        setTranslatedText(randomSound);
      } else {
        const randomMeaning = humanMeanings[Math.floor(Math.random() * humanMeanings.length)];
        setTranslatedText(randomMeaning);
      }
      setIsTranslating(false);
    }, 1500);
  };

  const toggleMode = () => {
    setMode(mode === 'human-to-cat' ? 'cat-to-human' : 'human-to-cat');
    setInputText('');
    setTranslatedText('');
  };

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
        <h1 className="text-2xl font-black italic">Cat Translator</h1>
        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
          <Sparkles className="text-[#FF7E5F] w-6 h-6" />
        </div>
      </header>

      <div className="px-6 mt-4">
        {/* Mode Toggle */}
        <div className="bg-[#1A1A2E] p-2 rounded-[32px] flex items-center justify-between mb-8 shadow-xl">
          <div className={`flex-1 text-center py-4 rounded-2xl transition-all ${mode === 'human-to-cat' ? 'bg-[#FF7E5F] text-white shadow-lg' : 'text-white/40'}`}>
            <span className="text-[10px] font-black uppercase tracking-widest">Human</span>
          </div>
          <button 
            onClick={toggleMode}
            className="mx-4 p-3 bg-white/10 rounded-full text-[#FEB47B] hover:rotate-180 transition-transform duration-500"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <div className={`flex-1 text-center py-4 rounded-2xl transition-all ${mode === 'cat-to-human' ? 'bg-[#FF7E5F] text-white shadow-lg' : 'text-white/40'}`}>
            <span className="text-[10px] font-black uppercase tracking-widest">Cat</span>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="text-[#FF7E5F] w-5 h-5" />
            <h2 className="font-black text-sm uppercase tracking-widest text-slate-400">
              {mode === 'human-to-cat' ? "What do you want to say?" : "What did the cat say?"}
            </h2>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'human-to-cat' ? "Type something human..." : "Type 'Meow' or record sound..."}
            className="w-full bg-transparent border-none outline-none text-xl font-bold italic placeholder:text-slate-200 min-h-[120px] resize-none"
          />
          <div className="flex justify-end mt-4">
            <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-[#FF7E5F] transition-colors">
              <Mic className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Translate Button */}
        <button 
          onClick={handleTranslate}
          disabled={isTranslating || !inputText.trim()}
          className={`w-full py-6 rounded-[32px] font-black uppercase tracking-[0.3em] text-sm shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isTranslating || !inputText.trim() ? 'bg-slate-200 text-slate-400' : 'bg-[#FF7E5F] text-white shadow-[#FF7E5F]/30'}`}
        >
          {isTranslating ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Translate <Sparkles className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Result Area */}
        <AnimatePresence>
          {translatedText && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-8 bg-[#1A1A2E] rounded-[40px] p-10 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FF7E5F]/10 rounded-full blur-3xl" />
              <div className="flex items-center gap-3 mb-6">
                <Volume2 className="text-[#FEB47B] w-6 h-6" />
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Translation</span>
              </div>
              <p className="text-white text-3xl font-black italic leading-tight">
                "{translatedText}"
              </p>
              <div className="mt-8 flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF7E5F]" />
                  <div className="w-2 h-2 rounded-full bg-[#FEB47B]" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                </div>
                <button className="text-[#FEB47B] text-xs font-black uppercase tracking-widest border-b border-[#FEB47B]">
                  Play Sound
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fun Fact Card */}
      {!translatedText && !isTranslating && (
        <div className="px-6 mt-8">
          <div className="bg-orange-50 p-6 rounded-[32px] border border-orange-100/50">
            <h3 className="font-black text-orange-900 text-sm italic mb-2">Did you know?</h3>
            <p className="text-orange-700/70 text-xs leading-relaxed">
              Cats have over 100 different vocal sounds, while dogs only have about 10. Every meow is unique to their human!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
