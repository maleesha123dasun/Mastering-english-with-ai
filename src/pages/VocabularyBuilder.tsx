import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Search, Loader2, Volume2, Plus, Sparkles } from 'lucide-react';
import { suggestVocabulary } from '../services/gemini';

interface Word {
  word: string;
  definition: string;
  example: string;
}

export const VocabularyBuilder = () => {
  const [topic, setTopic] = React.useState('');
  const [words, setWords] = React.useState<Word[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSearch = async () => {
    if (!topic.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const data = await suggestVocabulary(topic);
      setWords(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Page Cover Image */}
      <div className="h-[350px] w-full relative overflow-hidden">
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1600&h=400"
          alt="Vocabulary Builder"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-[#FBFBFD]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-7xl font-black text-white drop-shadow-2xl tracking-tighter uppercase italic">
              Lexicon Master
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 -mt-20 relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-12 shadow-2xl shadow-slate-200 border border-white mb-20">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                <Book size={24} />
              </div>
              <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">Vocabulary Builder</span>
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">Expand Your <span className="text-orange-500 italic serif">Lexicon</span></h1>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
              AI-powered suggestions tailored to your specific interests and goals.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500" size={24} />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter a topic (e.g., Technology, Business, Travel)..."
                className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 pl-16 pr-44 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all text-xl shadow-sm"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading || !topic.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500 text-white font-bold py-4 px-10 rounded-2xl disabled:opacity-50 text-lg shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                  <div className="flex items-center gap-2">
                    <Sparkles size={20} />
                    <span>Generate</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {words.length > 0 ? (
              words.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-100 border border-slate-50 hover:shadow-2xl hover:-translate-y-1 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{item.word}</h3>
                    <div className="flex gap-3">
                      <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-orange-500 transition-colors">
                        <Volume2 size={20} />
                      </button>
                      <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-orange-500 transition-colors">
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Definition</span>
                      <p className="text-lg text-slate-700 leading-relaxed">
                        {item.definition}
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-50 italic text-slate-500 text-base leading-relaxed border border-slate-100">
                      "{item.example}"
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              !isLoading && [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/50 rounded-[2.5rem] p-10 border-dashed border-2 border-slate-200">
                  <div className="h-10 w-40 bg-slate-100 rounded-xl mb-6 animate-pulse" />
                  <div className="h-4 w-full bg-slate-100 rounded-lg mb-3 animate-pulse" />
                  <div className="h-4 w-2/3 bg-slate-100 rounded-lg mb-8 animate-pulse" />
                  <div className="h-24 w-full bg-slate-100 rounded-2xl animate-pulse" />
                </div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
