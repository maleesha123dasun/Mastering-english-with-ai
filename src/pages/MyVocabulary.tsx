import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2, Sparkles, BookMarked } from 'lucide-react';
import { autoFillVocabulary } from '../services/gemini';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface VocabularyItem {
  id: string;
  word: string;
  sinhalaMeaning: string;
  uses: {
    useType: string;
    sinhalaUseType: string;
    examples: string[];
  }[];
  userSentence?: string;
  createdAt: number;
}

export const MyVocabulary = () => {
  const [word, setWord] = React.useState('');
  const [userSentence, setUserSentence] = React.useState('');
  const [aiPreview, setAiPreview] = React.useState<any>(null);
  const [vocabulary, setVocabulary] = React.useState<VocabularyItem[]>(() => {
    const saved = localStorage.getItem('my_vocabulary');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    localStorage.setItem('my_vocabulary', JSON.stringify(vocabulary));
  }, [vocabulary]);

  const handleFetchAI = async () => {
    if (!word.trim() || isLoading) return;

    // Check for duplicates
    const isDuplicate = vocabulary.some(v => v.word.toLowerCase() === word.trim().toLowerCase());
    if (isDuplicate) {
      toast.error(`"${word.trim()}" is already in your vocabulary!`);
      return;
    }

    setIsLoading(true);
    try {
      const aiData = await autoFillVocabulary(word);
      setAiPreview(aiData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWord = () => {
    if (!word.trim() || !aiPreview) return;
    const newItem: VocabularyItem = {
      id: Math.random().toString(36).substr(2, 9),
      word: word.trim(),
      sinhalaMeaning: aiPreview.sinhalaMeaning,
      uses: aiPreview.uses,
      userSentence: userSentence.trim(),
      createdAt: Date.now(),
    };
    setVocabulary([newItem, ...vocabulary]);
    setWord('');
    setUserSentence('');
    setAiPreview(null);
  };

  const removeWord = (id: string) => {
    setVocabulary(vocabulary.filter(v => v.id !== id));
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
          alt="My Vocabulary"
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
              Word <span className="text-amber-400">Vault</span>
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-12 shadow-2xl shadow-slate-200 border border-white">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <BookMarked size={24} />
              </div>
              <span className="text-sm font-bold text-amber-600 uppercase tracking-widest">Personal Lexicon</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">My <span className="text-amber-500 italic serif">Vocabulary</span></h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">Your personal word collection enhanced with AI-powered insights and examples.</p>
          </div>

          <div className="bg-slate-50 rounded-[2rem] p-10 mb-16 border border-slate-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Word</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => {
                      setWord(e.target.value);
                      setAiPreview(null);
                    }}
                    placeholder="e.g. Serendipity"
                    className="flex-1 bg-white border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-amber-500/10 transition-all text-lg shadow-inner"
                  />
                  <button
                    onClick={handleFetchAI}
                    disabled={isLoading || !word.trim()}
                    className="bg-amber-600 text-white font-bold px-8 rounded-2xl flex items-center justify-center gap-2 text-lg whitespace-nowrap shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all active:scale-95"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                    Auto-fill
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Your Sentence (Optional)</label>
                <input
                  type="text"
                  value={userSentence}
                  onChange={(e) => setUserSentence(e.target.value)}
                  placeholder="Use it in a sentence..."
                  className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-amber-500/10 transition-all text-lg shadow-inner"
                />
              </div>
            </div>

            <AnimatePresence>
              {aiPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-8 rounded-3xl bg-white border border-amber-100 mb-8 space-y-8 shadow-sm">
                    <div className="flex items-baseline gap-4">
                      <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">AI Result:</span>
                      <span className="text-2xl font-bold text-slate-900">{aiPreview.sinhalaMeaning}</span>
                    </div>
                    
                    <div className="space-y-6">
                      {aiPreview.uses.map((use: any, i: number) => (
                        <div key={i} className="space-y-3">
                          <div className="flex items-baseline gap-3">
                            <span className="text-lg font-bold text-slate-900">{use.useType}</span>
                            <span className="text-slate-400 italic text-sm">{use.sinhalaUseType}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {use.examples.map((ex: string, j: number) => (
                              <div key={j} className="p-4 rounded-xl bg-slate-50 text-slate-700 text-sm border border-slate-100">
                                "{ex}"
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleSaveWord}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
                  >
                    <Plus size={24} />
                    Save to Collection
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {vocabulary.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm"
                >
                  <div 
                    className="p-8 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  >
                    <div className="flex items-baseline gap-6">
                      <h3 className="text-3xl font-bold text-slate-900">{item.word}</h3>
                      <span className="text-xl text-amber-600 font-medium">{item.sinhalaMeaning}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeWord(item.id);
                        }}
                        className="p-3 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                      {expandedId === item.id ? <ChevronUp size={24} className="text-slate-300" /> : <ChevronDown size={24} className="text-slate-300" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-50"
                      >
                        <div className="p-8 space-y-10">
                          {item.userSentence && (
                            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                              <div className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-2">My Sentence</div>
                              <p className="text-xl italic text-slate-900">"{item.userSentence}"</p>
                            </div>
                          )}

                          <div className="space-y-12">
                            {item.uses.map((use, i) => (
                              <div key={i} className="space-y-4">
                                <div className="pb-3 border-b border-slate-100">
                                  <p className="text-xl text-slate-900 font-semibold mb-1">{use.useType}</p>
                                  <p className="text-slate-400 italic">{use.sinhalaUseType}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {use.examples.map((ex, j) => (
                                    <div key={j} className="p-4 rounded-xl bg-slate-50 text-slate-600 text-sm leading-relaxed border border-slate-100 shadow-inner">
                                      "{ex}"
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {vocabulary.length === 0 && !isLoading && (
              <div className="text-center py-32 bg-slate-50/50 rounded-[2rem] border-dashed border-2 border-slate-200">
                <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-sm border border-slate-100">
                  <BookMarked size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">No words yet</h3>
                <p className="text-slate-500">Start building your personal lexicon above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
