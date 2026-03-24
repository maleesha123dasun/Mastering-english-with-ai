import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Book, Loader2, Volume2 } from 'lucide-react';
import { dictionaryLookup, generateSpeech } from '../services/gemini';
import { cn } from '../lib/utils';

export const Dictionary = () => {
  const [query, setQuery] = React.useState('');
  const [result, setResult] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const handleSearch = async () => {
    if (!query.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const data = await dictionaryLookup(query);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioUrl = await generateSpeech(text);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error("Speech generation failed:", error);
      // Fallback to browser TTS if Gemini TTS fails
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Page Cover Image */}
      <div className="h-[300px] w-full relative overflow-hidden">
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src="https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&q=80&w=1600&h=400"
          alt="Dictionary"
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
              Linguistic Guide
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-12 shadow-2xl shadow-slate-200 border border-white">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Book size={24} />
              </div>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Smart Dictionary</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">English-Sinhala <span className="text-blue-500 italic serif">Dictionary</span></h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">Comprehensive definitions with AI-powered context and examples.</p>
          </div>

          <div className="relative mb-16">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for a word..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-6 pl-8 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-xl"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              Search
            </button>
          </div>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-12 border-none shadow-sm bg-white"
              >
                <div className="flex flex-wrap items-center gap-4 mb-10">
                  <h2 className="text-6xl font-bold text-slate-900">{result.word}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-blue-600 font-medium">{result.phonetic}</span>
                    <button 
                      onClick={() => handleSpeak(result.word)}
                      disabled={isSpeaking}
                      className="p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all active:scale-90 disabled:opacity-50"
                      title="Listen to pronunciation"
                    >
                      {isSpeaking ? <Loader2 className="animate-spin" size={24} /> : <Volume2 size={24} />}
                    </button>
                  </div>
                  <span className="px-4 py-1 rounded-full bg-slate-100 text-slate-500 text-sm font-bold uppercase tracking-widest">
                    {result.class}
                  </span>
                </div>

                <div className="mb-12 p-8 rounded-3xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Sinhala Meaning</div>
                  <div className="text-4xl font-bold text-slate-900">{result.sinhalaMeaning}</div>
                </div>

                <div className="space-y-16">
                  {result.entries.map((entry: any, i: number) => (
                    <div key={i} className="space-y-6">
                      <div className="pb-4 border-b border-slate-100">
                        <p className="text-2xl text-slate-900 font-semibold mb-2">{entry.definition}</p>
                        <p className="text-slate-500 text-xl">{entry.sinhalaDefinition}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {entry.examples.map((ex: string, j: number) => (
                          <div key={j} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 italic text-slate-700 leading-relaxed">
                            "{ex}"
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {(result.synonyms?.length > 0 || result.antonyms?.length > 0) && (
                  <div className="mt-20 pt-12 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {result.synonyms?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Synonyms</h4>
                        <div className="flex flex-wrap gap-3">
                          {result.synonyms.map((s: string) => (
                            <span key={s} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.antonyms?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Antonyms</h4>
                        <div className="flex flex-wrap gap-3">
                          {result.antonyms.map((a: string) => (
                            <span key={a} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
