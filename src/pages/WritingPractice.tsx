import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { correctGrammar } from '../services/gemini';

export const WritingPractice = () => {
  const [text, setText] = React.useState('');
  const [result, setResult] = React.useState<{ correctedText: string; explanation: string } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCheck = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const data = await correctGrammar(text);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1600&h=400"
          alt="Writing Practice"
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
              Creative Scribe
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-12 shadow-2xl shadow-slate-200 border border-white">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <PenTool size={24} />
              </div>
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Writing Practice</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Refine Your <span className="text-emerald-500 italic serif">Writing</span></h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">AI-powered corrections and insights to perfect your English prose.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Input Text</label>
                  <span className="text-xs text-slate-400 font-medium">{text.length} characters</span>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your sentences here..."
                  className="w-full h-80 bg-white border border-slate-100 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all text-lg leading-relaxed resize-none shadow-inner"
                />
                <div className="mt-8">
                  <button
                    onClick={handleCheck}
                    disabled={isLoading || !text.trim()}
                    className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                    Check Grammar
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                    className="space-y-8"
                  >
                    <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-emerald-50 border-l-8 border-emerald-500 border border-slate-100">
                      <div className="flex items-center gap-3 text-emerald-600 font-bold mb-6">
                        <CheckCircle size={24} />
                        <span className="text-lg uppercase tracking-wider">Corrected Version</span>
                      </div>
                      <p className="text-2xl text-slate-900 leading-relaxed font-medium">{result.correctedText}</p>
                    </div>

                    <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-blue-50 border-l-8 border-blue-500 border border-slate-100">
                      <div className="flex items-center gap-3 text-blue-600 font-bold mb-6">
                        <AlertCircle size={24} />
                        <span className="text-lg uppercase tracking-wider">AI Insights</span>
                      </div>
                      <p className="text-lg text-slate-500 leading-relaxed">{result.explanation}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-slate-50/50 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-200 h-full min-h-[400px]"
                  >
                    <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center mb-8 text-slate-300 shadow-sm border border-slate-100">
                      <PenTool size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Ready to refine?</h3>
                    <p className="text-slate-500 max-w-sm text-lg">Enter your text on the left and our AI will help you perfect it.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
