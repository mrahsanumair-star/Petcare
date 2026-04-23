import React, { useState } from 'react';
import { ArrowLeft, Mic, Volume2, RefreshCw, Sparkles, MessageSquare, Briefcase, Play, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";

interface TranslatorScreenProps {
  onBack: () => void;
}

interface VoicePersona {
  voiceProfile: string;
  recommendedSettings: {
    pitch: number;
    speed: number;
    emphasis: string;
  };
  structuredText: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const TranslatorScreen: React.FC<TranslatorScreenProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'human-to-cat' | 'cat-to-human' | 'pro-voice'>('human-to-cat');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [proResults, setProResults] = useState<VoicePersona[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  // Pre-load voices for speech synthesis
  React.useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const catSounds = ["Meow!", "Purrr...", "Mrow?", "Hiss!", "Prrrp!", "Meoooowww", "Chirp chirp"];
  
  const catAudioCategories = {
    angry: [
      "https://actions.google.com/sounds/v1/animals/cat_hiss.ogg"
    ],
    affectionate: [
      "https://actions.google.com/sounds/v1/animals/cat_purr.ogg"
    ],
    hungry: [
      "https://actions.google.com/sounds/v1/animals/cat_meow.ogg"
    ],
    curious: [
      "https://actions.google.com/sounds/v1/animals/cat_meow.ogg"
    ],
    neutral: [
      "https://actions.google.com/sounds/v1/animals/cat_meow.ogg"
    ]
  };

  const humanMeanings = [
    "I'm hungry, feed me now!", 
    "I love you, but don't touch me.", 
    "Look at this cool bug I found!", 
    "Why is the bottom of my bowl visible?", 
    "I shall now zoom across the room at 3 AM.", 
    "Pet me... okay, that's enough, now I bite.",
    "The red dot is my mortal enemy."
  ];

  const getCategoryFromText = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.match(/gussa|angry|bad|stop|no|hate|hiss|shutup|pagal/)) return 'angry';
    if (lowerText.match(/pyar|love|cute|sweet|pet|happy|good|baby|janu/)) return 'affectionate';
    if (lowerText.match(/khana|food|hungry|eat|milk|treat|fish|bhok/)) return 'hungry';
    if (lowerText.match(/look|what|where|bird|play|toy|curious|dekho/)) return 'curious';
    return 'neutral';
  };

  const playSound = (text: string, isCat: boolean, inputContext?: string, settings?: { pitch: number, speed: number }) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (isCat) {
      const category = inputContext ? getCategoryFromText(inputContext) : 'neutral';
      const categoryAudios = catAudioCategories[category as keyof typeof catAudioCategories];
      const randomAudio = categoryAudios[Math.floor(Math.random() * categoryAudios.length)];
      
      const audio = new Audio();
      audio.src = randomAudio;
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.error("Audio playback failed, falling back to speech synthesis:", e);
          // Fallback to speech synthesis with EXTREMELY high pitch to simulate a cat
          const utterance = new SpeechSynthesisUtterance(category === 'angry' ? "Hiss" : "Meow");
          utterance.pitch = 2.0; // Max pitch
          utterance.rate = 2.0;  // Fast rate
          utterance.volume = 1.0;
          // Try to find a high-pitched voice if available
          const voices = window.speechSynthesis.getVoices();
          const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google'));
          if (femaleVoice) utterance.voice = femaleVoice;
          
          window.speechSynthesis.speak(utterance);
        });
      }
    } else {
      // Use Web Speech API for human voice (Translation result)
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings?.speed ?? 1.0;
      utterance.pitch = settings?.pitch ?? 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    setTranslatedText('');
    setProResults([]);
    
    if (mode === 'pro-voice') {
      try {
        const prompt = `For every text input provided, you must generate a structured JSON output that categorizes the content into three distinct professional "Voice Personas":

1. The Corporate Authority (Professional/Neutral): Deep, steady, and clear. Ideal for business presentations and formal announcements.
2. The Enthusiastic Storyteller (High Energy/Dynamic): Varied pitch and fast-paced. Ideal for marketing, social media ads, or YouTube intros.
3. The Calm Guide (Soft/Empathetic): Gentle, slow, and soothing. Ideal for tutorials, meditations, or luxury branding.

Input Text: "${inputText}"

Output Format:
Return a JSON array of objects, each with:
- voiceProfile: string
- recommendedSettings: { pitch: number, speed: number, emphasis: string }
- structuredText: string (The text optimized with SSML tags like <break time="500ms"/> or <emphasis> if supported, or simply the cleaned text formatted for that specific tone.)

Constraint: Always provide these three variations so I can choose the best professional fit for my application.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  voiceProfile: { type: Type.STRING },
                  recommendedSettings: {
                    type: Type.OBJECT,
                    properties: {
                      pitch: { type: Type.NUMBER },
                      speed: { type: Type.NUMBER },
                      emphasis: { type: Type.STRING }
                    },
                    required: ["pitch", "speed", "emphasis"]
                  },
                  structuredText: { type: Type.STRING }
                },
                required: ["voiceProfile", "recommendedSettings", "structuredText"]
              }
            }
          }
        });

        const results = JSON.parse(response.text);
        setProResults(results);
      } catch (error) {
        console.error("Pro Voice translation failed:", error);
      } finally {
        setIsTranslating(false);
      }
      return;
    }

    // Simulate translation delay
    setTimeout(() => {
      let result = '';
      if (mode === 'human-to-cat') {
        const category = getCategoryFromText(inputText);
        if (category === 'angry') result = "Hiss!!! 😾";
        else if (category === 'affectionate') result = "Purrr... ❤️ 😻";
        else if (category === 'hungry') result = "Meoooowww! 🥣";
        else if (category === 'curious') result = "Prrrp? 🐾 🧐";
        else result = "Meow! 😺";
      } else {
        // Cat to Human: Reactive translation
        const lowerInput = inputText.toLowerCase();
        if (lowerInput.includes('meow') && lowerInput.includes('!')) {
          result = "I am extremely hungry, feed me immediately!";
        } else if (lowerInput.includes('purr')) {
          result = "I am very happy and I love you.";
        } else if (lowerInput.includes('hiss')) {
          result = "I am angry! Stay away from me.";
        } else if (lowerInput.includes('mrow') || lowerInput.includes('?')) {
          result = "What is that? I want to play!";
        } else {
          result = humanMeanings[Math.floor(Math.random() * humanMeanings.length)];
        }
      }
      setTranslatedText(result);
      setIsTranslating(false);
      
      // Auto-play sound after translation
      playSound(result, mode === 'human-to-cat', inputText);
    }, 1500);
  };

  const toggleMode = () => {
    if (mode === 'human-to-cat') setMode('cat-to-human');
    else if (mode === 'cat-to-human') setMode('pro-voice');
    else setMode('human-to-cat');
    
    setInputText('');
    setTranslatedText('');
    setProResults([]);
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
        <div className="bg-[#1A1A2E] p-2 rounded-[32px] flex items-center justify-between mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF7E5F]/10 to-[#FEB47B]/10 pointer-events-none" />
          
          <button 
            onClick={() => { setMode('human-to-cat'); setInputText(''); setTranslatedText(''); setProResults([]); }}
            className={`flex-1 text-center py-4 rounded-2xl transition-all z-10 ${mode === 'human-to-cat' ? 'bg-[#FF7E5F] text-white shadow-lg' : 'text-white/40'}`}
          >
            <span className="text-[9px] font-black uppercase tracking-widest">Human → Cat</span>
          </button>
          
          <button 
            onClick={() => { setMode('cat-to-human'); setInputText(''); setTranslatedText(''); setProResults([]); }}
            className={`flex-1 text-center py-4 rounded-2xl transition-all z-10 ${mode === 'cat-to-human' ? 'bg-[#FF7E5F] text-white shadow-lg' : 'text-white/40'}`}
          >
            <span className="text-[9px] font-black uppercase tracking-widest">Cat → Human</span>
          </button>

          <button 
            onClick={() => { setMode('pro-voice'); setInputText(''); setTranslatedText(''); setProResults([]); }}
            className={`flex-1 text-center py-4 rounded-2xl transition-all z-10 ${mode === 'pro-voice' ? 'bg-[#FF7E5F] text-white shadow-lg' : 'text-white/40'}`}
          >
            <span className="text-[9px] font-black uppercase tracking-widest">Pro Voice</span>
          </button>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 mb-6">
          <div className="flex items-center gap-3 mb-4">
            {mode === 'pro-voice' ? <Briefcase className="text-[#FF7E5F] w-5 h-5" /> : <MessageSquare className="text-[#FF7E5F] w-5 h-5" />}
            <h2 className="font-black text-sm uppercase tracking-widest text-slate-400">
              {mode === 'human-to-cat' ? "What do you want to say?" : 
               mode === 'cat-to-human' ? "What did the cat say?" : 
               "Enter text for Pro Voice Personas"}
            </h2>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'human-to-cat' ? "Type something human..." : 
                         mode === 'cat-to-human' ? "Type 'Meow' or record sound..." : 
                         "Enter script for professional voice variations..."}
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
              {mode === 'pro-voice' ? 'Generate Personas' : 'Translate'} <Sparkles className="w-5 h-5" />
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
                <button 
                  onClick={() => playSound(translatedText, mode === 'human-to-cat', inputText)}
                  className="text-[#FEB47B] text-xs font-black uppercase tracking-widest border-b border-[#FEB47B]"
                >
                  Play Sound
                </button>
              </div>
            </motion.div>
          )}

          {proResults.length > 0 && (
            <div className="mt-8 space-y-6">
              {proResults.map((persona, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-[#1A1A2E] text-lg italic">{persona.voiceProfile}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[8px] font-black uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-full text-slate-500">
                          Pitch: {persona.recommendedSettings.pitch}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-full text-slate-500">
                          Speed: {persona.recommendedSettings.speed}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-full text-[#FF7E5F]">
                          {persona.recommendedSettings.emphasis}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => playSound(persona.structuredText, false, undefined, { pitch: persona.recommendedSettings.pitch, speed: persona.recommendedSettings.speed })}
                      className="p-3 bg-[#FF7E5F] rounded-full text-white shadow-lg shadow-[#FF7E5F]/20 hover:scale-110 transition-transform"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl relative">
                    <p className="text-slate-600 text-sm leading-relaxed italic">
                      {persona.structuredText}
                    </p>
                    <div className="absolute top-2 right-2 opacity-10">
                      <Volume2 className="w-8 h-8" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Card */}
      {!translatedText && proResults.length === 0 && !isTranslating && (
        <div className="px-6 mt-8">
          <div className="bg-orange-50 p-6 rounded-[32px] border border-orange-100/50 flex gap-4">
            <div className="mt-1">
              <Info className="text-[#FF7E5F] w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-orange-900 text-sm italic mb-2">
                {mode === 'pro-voice' ? 'Professional Voice Personas' : 'Did you know?'}
              </h3>
              <p className="text-orange-700/70 text-xs leading-relaxed">
                {mode === 'pro-voice' ? 
                  'Generate three distinct professional voice variations for your script: Corporate, Storyteller, and Calm Guide.' : 
                  'Cats have over 100 different vocal sounds, while dogs only have about 10. Every meow is unique to their human!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
