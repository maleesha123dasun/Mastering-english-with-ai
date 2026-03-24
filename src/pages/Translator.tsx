import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, ArrowRightLeft, Loader2, Copy, Trash2, Sparkles } from 'lucide-react';
import { translateText } from '../services/gemini';
import { cn } from '../lib/utils';

export const Translator = () => {
  const [text, setText] = React.useState('');
  const [translated, setTranslated] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEngToSin, setIsEngToSin] = React.useState(true);

  const handleTranslate = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const source = isEngToSin ? 'English' : 'Sinhala';
      const target = isEngToSin ? 'Sinhala' : 'English';
      const result = await translateText(text, source, target);
      setTranslated(result || '');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    setIsEngToSin(!isEngToSin);
    setText(translated);
    setTranslated(text);
  };

  return (
    <div className="pb-24">
      {/* Page Cover Image */}
      <div className="h-[300px] w-full relative overflow-hidden">
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1600&h=400"
          alt="Translator"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-white" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-6xl font-black text-white drop-shadow-2xl tracking-tighter uppercase italic">
              Bridge Languages
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-12 shadow-2xl shadow-slate-200 border border-white">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Languages size={24} />
              </div>
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Smart Translator</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">English-Sinhala <span className="text-indigo-500 italic serif">Translator</span></h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">Instant, accurate translations powered by advanced AI models.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-6 py-3 rounded-t-3xl bg-slate-50 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  {isEngToSin ? 'English' : 'Sinhala'}
                </span>
                <button onClick={() => setText('')} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={isEngToSin ? "Type to translate..." : "සිංහලෙන් ලියන්න..."}
                className="w-full h-80 bg-slate-50/50 border-none rounded-b-3xl p-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none text-xl leading-relaxed text-slate-900"
              />
            </div>

            <div className="flex lg:flex-col gap-6 justify-center">
              <button
                onClick={swapLanguages}
                className="w-14 h-14 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-all hover:rotate-180 duration-500"
              >
                <ArrowRightLeft size={24} />
              </button>
              <button
                onClick={handleTranslate}
                disabled={isLoading || !text.trim()}
                className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white disabled:opacity-50 shadow-lg shadow-indigo-200 hover:scale-110 transition-transform"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-6 py-3 rounded-t-3xl bg-slate-50 border-b border-slate-100">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">
                  {isEngToSin ? 'Sinhala' : 'English'}
                </span>
                <button 
                  onClick={() => translated && navigator.clipboard.writeText(translated)} 
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="w-full h-80 bg-slate-50/30 border-none rounded-b-3xl p-8 overflow-y-auto text-xl leading-relaxed text-slate-900">
                {isLoading ? (
                  <div className="flex items-center gap-3 text-slate-400 italic">
                    <Loader2 className="animate-spin" size={20} />
                    Translating...
                  </div>
                ) : translated || (
                  <span className="text-slate-300 italic">Translation will appear here...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
