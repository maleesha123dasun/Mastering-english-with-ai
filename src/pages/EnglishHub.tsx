import React, { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocFromServer
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { CATEGORIES, Category, UserExample, Example } from '../types';
import { PREDEFINED_EXAMPLES } from '../data/examples';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  LogOut, 
  LogIn, 
  ChevronRight, 
  Search,
  Info,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Book,
  Layers,
  Quote,
  MessageSquare,
  Zap,
  Scroll,
  Menu,
  X,
  Loader2,
  Languages,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";

// Error handling helper
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

export const EnglishHub = ({ category }: { category?: Category }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>(category || 'grammar');
  const [customExamples, setCustomExamples] = useState<UserExample[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newExample, setNewExample] = useState({ phrase: '', meaning: '', sinhalaMeaning: '', example: '' });
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Test connection
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Firestore listener for custom examples
  useEffect(() => {
    if (!user || !isAuthReady) {
      setCustomExamples([]);
      return;
    }

    const path = `users/${user.uid}/customExamples`;
    const q = query(collection(db, path));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const examples = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as UserExample[];
      setCustomExamples(examples);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user, isAuthReady]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login failed', err);
      setError('Failed to sign in. Please try again.');
    }
  };

  const handleAddExample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!newExample.phrase || !newExample.meaning || !newExample.sinhalaMeaning || !newExample.example) {
      setError('Please fill in all fields.');
      return;
    }

    const path = `users/${user.uid}/customExamples`;
    try {
      await addDoc(collection(db, path), {
        ...newExample,
        category: selectedCategory,
        userId: user.uid,
        isCustom: true,
        createdAt: new Date().toISOString(),
      });
      setNewExample({ phrase: '', meaning: '', sinhalaMeaning: '', example: '' });
      setIsAdding(false);
      setError(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
      setError('Failed to add example. Please try again.');
    }
  };

  const handleAiAutoFill = async () => {
    if (!newExample.phrase) {
      setError('Please enter a phrase or pattern first.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate meaning, Sinhala meaning, and a usage example for this ${selectedCategory.replace('_', ' ')}: "${newExample.phrase}".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              meaning: { type: Type.STRING, description: "English meaning of the phrase" },
              sinhalaMeaning: { type: Type.STRING, description: "Sinhala translation of the meaning" },
              example: { type: Type.STRING, description: "A natural usage example in English" }
            },
            required: ["meaning", "sinhalaMeaning", "example"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      if (result.meaning && result.sinhalaMeaning && result.example) {
        setNewExample(prev => ({
          ...prev,
          meaning: result.meaning,
          sinhalaMeaning: result.sinhalaMeaning,
          example: result.example
        }));
      } else {
        throw new Error('Incomplete response from AI');
      }
    } catch (err) {
      console.error('AI generation failed', err);
      setError('AI generation failed. Please fill in manually.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteExample = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/customExamples/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const filteredExamples = useMemo(() => {
    const all = [
      ...PREDEFINED_EXAMPLES.filter(ex => ex.category === selectedCategory),
      ...customExamples.filter(ex => ex.category === selectedCategory)
    ];

    if (!searchQuery) return all;

    const query = searchQuery.toLowerCase();
    return all.filter(ex => 
      ex.phrase.toLowerCase().includes(query) || 
      ex.meaning.toLowerCase().includes(query) ||
      ex.example.toLowerCase().includes(query)
    );
  }, [selectedCategory, customExamples, searchQuery]);

  const categoryStyles: Record<Category, { 
    color: string, 
    bg: string, 
    border: string, 
    text: string, 
    icon: string, 
    bgHex: string,
    borderHex: string,
    textHex: string,
    suggestions: string[] 
  }> = {
    grammar: { 
      color: '#0071E3', 
      bg: 'bg-blue-50/50', 
      border: 'border-blue-100/50', 
      text: 'text-blue-700', 
      icon: 'text-blue-500',
      bgHex: '#EFF6FF',
      borderHex: '#DBEAFE',
      textHex: '#1D4ED8',
      suggestions: ['Subject + Verb + Object', 'Present Continuous', 'Passive Voice', 'Conditional Sentences']
    },
    phrasal_verbs: { 
      color: '#AF52DE', 
      bg: 'bg-purple-50/50', 
      border: 'border-purple-100/50', 
      text: 'text-purple-700', 
      icon: 'text-purple-500',
      bgHex: '#FAF5FF',
      borderHex: '#F3E8FF',
      textHex: '#7E22CE',
      suggestions: ['Get along', 'Break down', 'Look forward to', 'Put off']
    },
    idioms: { 
      color: '#FF2D55', 
      bg: 'bg-rose-50/50', 
      border: 'border-rose-100/50', 
      text: 'text-rose-700', 
      icon: 'text-rose-500',
      bgHex: '#FFF1F2',
      borderHex: '#FFE4E6',
      textHex: '#BE123C',
      suggestions: ['Piece of cake', 'Under the weather', 'Spill the tea', 'Once in a blue moon']
    },
    speaking: { 
      color: '#34C759', 
      bg: 'bg-emerald-50/50', 
      border: 'border-emerald-100/50', 
      text: 'text-emerald-700', 
      icon: 'text-emerald-500',
      bgHex: '#ECFDF5',
      borderHex: '#D1FAE5',
      textHex: '#047857',
      suggestions: ['How have you been?', 'Could you please...?', 'I was wondering if...', 'That sounds great!']
    },
    slang: { 
      color: '#FF9500', 
      bg: 'bg-orange-50/50', 
      border: 'border-orange-100/50', 
      text: 'text-orange-700', 
      icon: 'text-orange-500',
      bgHex: '#FFF7ED',
      borderHex: '#FFEDD5',
      textHex: '#C2410C',
      suggestions: ['No cap', 'Bet', 'Slay', 'G.O.A.T']
    },
    proverbs: { 
      color: '#5856D6', 
      bg: 'bg-indigo-50/50', 
      border: 'border-indigo-100/50', 
      text: 'text-indigo-700', 
      icon: 'text-indigo-500',
      bgHex: '#EEF2FF',
      borderHex: '#E0E7FF',
      textHex: '#4338CA',
      suggestions: ['Time is money', 'Practice makes perfect', 'Easy come, easy go', 'Better late than never']
    },
    online_resources: { 
      color: '#10B981', 
      bg: 'bg-emerald-50/50', 
      border: 'border-emerald-100/50', 
      text: 'text-emerald-700', 
      icon: 'text-emerald-500',
      bgHex: '#ECFDF5',
      borderHex: '#D1FAE5',
      textHex: '#047857',
      suggestions: ['BBC Learning English', 'The Guardian', 'YouTube Channels', 'Podcasts']
    },
  };

  const currentStyle = categoryStyles[selectedCategory];

  const categoryIcons: Record<Category, React.ReactNode> = {
    grammar: <Book size={18} />,
    phrasal_verbs: <Layers size={18} />,
    idioms: <Quote size={18} />,
    speaking: <MessageSquare size={18} />,
    slang: <Zap size={18} />,
    proverbs: <Scroll size={18} />,
    online_resources: <Globe size={18} />,
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
          <div className="h-4 w-32 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col lg:flex-row font-sans text-[#1D1D1F]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/70 backdrop-blur-2xl border-b border-neutral-200/50 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <Sparkles className="text-apple-blue" size={20} />
          {CATEGORIES.find(c => c.id === selectedCategory)?.label}
        </h1>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-neutral-100 rounded-full transition-all"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar / Slide Bar */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <>
            {/* Backdrop for mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/5 backdrop-blur-sm z-[60] lg:hidden"
            />
            
            {/* Sidebar Content */}
            <motion.aside 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-72 bg-white/70 backdrop-blur-2xl border-r border-neutral-200/50 z-[70] lg:relative lg:z-0 lg:translate-x-0 flex flex-col h-screen"
            >
              <div className="p-8 border-b border-neutral-100/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1D1D1F] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/10">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h1 className="font-bold text-[#1D1D1F] leading-tight">English Hub</h1>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Study Guide</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-neutral-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-8">
                <div>
                  <h2 className="px-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-4">Categories</h2>
                  <nav className="space-y-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          if (window.innerWidth < 1024) setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all group ${
                          selectedCategory === cat.id 
                            ? 'text-white shadow-xl shadow-black/20' 
                            : 'text-neutral-500 hover:bg-neutral-100 hover:text-[#1D1D1F]'
                        }`}
                        style={selectedCategory === cat.id ? { backgroundColor: categoryStyles[cat.id].color } : {}}
                      >
                        <span className={`${selectedCategory === cat.id ? 'text-white' : 'text-neutral-400 group-hover:text-[#1D1D1F]'}`}>
                          {categoryIcons[cat.id]}
                        </span>
                        <span className="flex-1 text-left">{cat.label}</span>
                        <ChevronRight size={14} className={`transition-transform duration-300 ${selectedCategory === cat.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="px-4">
                  <div className="p-5 bg-[#F5F5F7]/50 rounded-3xl border border-neutral-100/50 space-y-3">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Info size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Insights</span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                      {CATEGORIES.find(c => c.id === selectedCategory)?.description}
                    </p>
                    <div className="pt-3 border-t border-neutral-200/50 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total</span>
                      <span className="text-sm font-bold text-[#1D1D1F]">{filteredExamples.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {user ? (
                <div className="p-6 border-t border-neutral-100/50">
                  <div className="flex items-center gap-3 p-3.5 bg-[#F5F5F7]/50 rounded-2xl mb-4">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-9 h-9 rounded-full border border-white shadow-sm" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-9 h-9 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-500 text-xs font-bold">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1D1D1F] truncate">{user.displayName}</p>
                      <p className="text-[10px] text-neutral-400 truncate font-medium">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => signOut(auth)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-[11px] font-bold text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all uppercase tracking-widest"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="p-6 border-t border-neutral-100/50">
                  <button 
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#1D1D1F] text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl shadow-black/10"
                  >
                    <LogIn size={14} />
                    Sign In
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto scrollbar-hide bg-[#FBFBFD] scroll-smooth">
        {/* Page Cover Image */}
        <div className="h-[350px] w-full relative overflow-hidden">
          <motion.img
            key={selectedCategory}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src={
              selectedCategory === 'grammar' ? "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1600&h=400" :
              selectedCategory === 'phrasal_verbs' ? "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1600&h=400" :
              selectedCategory === 'idioms' ? "https://images.unsplash.com/photo-1490127252417-7c393f993ee4?auto=format&fit=crop&q=80&w=1600&h=400" :
              selectedCategory === 'speaking' ? "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1600&h=400" :
              selectedCategory === 'slang' ? "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1600&h=400" :
              selectedCategory === 'proverbs' ? "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1600&h=400" :
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1600&h=400"
            }
            alt={selectedCategory}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-[#FBFBFD]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-7xl font-black text-white drop-shadow-2xl tracking-tighter uppercase italic">
                {CATEGORIES.find(c => c.id === selectedCategory)?.label}
              </h1>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 -mt-20 relative z-10 pb-20">
          <header className="mb-12 bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: currentStyle.bgHex, color: currentStyle.color }}
                >
                  {categoryIcons[selectedCategory]}
                </div>
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: currentStyle.color }}>
                  {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                </span>
              </div>
              <h2 
                className="text-4xl font-bold tracking-tight mb-4 transition-colors duration-500"
                style={{ color: '#1D1D1F' }}
              >
                Master <span style={{ color: currentStyle.color }}>{CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
              </h2>
              <div 
                className="h-1.5 w-24 rounded-full mb-6"
                style={{ backgroundColor: currentStyle.color }}
              />
              <p className="text-lg text-neutral-500 font-medium max-w-2xl leading-relaxed">
                {CATEGORIES.find(c => c.id === selectedCategory)?.description}
              </p>
            </motion.div>
          </header>

          <div className="space-y-10">
            {/* Search and Add */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#1D1D1F] transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder={`Search ${CATEGORIES.find(c => c.id === selectedCategory)?.label.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white border border-neutral-200/50 rounded-3xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-neutral-300 transition-all text-base shadow-sm"
                />
              </div>
              <button 
                onClick={() => user ? setIsAdding(true) : handleLogin()}
                className="flex items-center justify-center gap-2 px-10 py-5 text-white rounded-3xl text-sm font-bold uppercase tracking-widest transition-all shadow-2xl shadow-black/10 active:scale-95"
                style={{ backgroundColor: currentStyle.color }}
              >
                <Plus size={20} />
                Add New
              </button>
            </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-red-50/50 backdrop-blur-md border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm"
              >
                <AlertCircle size={18} />
                <span>{error}</span>
                <button onClick={() => setError(null)} className="ml-auto text-xs font-bold uppercase tracking-wider">Dismiss</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Form */}
          <AnimatePresence>
            {isAdding && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleAddExample} className="bg-white/80 backdrop-blur-xl border border-neutral-200/50 rounded-3xl p-8 space-y-6 shadow-xl shadow-black/5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">Add Custom {CATEGORIES.find(c => c.id === selectedCategory)?.label}</h3>
                    <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-neutral-400 hover:text-neutral-600 font-bold uppercase tracking-wider">Cancel</button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-2">Quick Suggestions</label>
                    <div className="flex flex-wrap gap-2">
                      {currentStyle.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setNewExample({ ...newExample, phrase: suggestion })}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border hover:scale-105 active:scale-95`}
                          style={{ 
                            backgroundColor: currentStyle.bgHex, 
                            borderColor: currentStyle.borderHex, 
                            color: currentStyle.textHex 
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between ml-2">
                        <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Phrase / Pattern</label>
                        <button
                          type="button"
                          onClick={handleAiAutoFill}
                          disabled={isGenerating || !newExample.phrase}
                          className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${isGenerating ? 'text-neutral-300' : currentStyle.text + ' hover:opacity-70'}`}
                        >
                          {isGenerating ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Sparkles size={12} />
                          )}
                          AI Auto-fill
                        </button>
                      </div>
                      <input 
                        type="text"
                        value={newExample.phrase}
                        onChange={(e) => setNewExample({...newExample, phrase: e.target.value})}
                        placeholder="e.g. Break a leg"
                        className={`w-full px-6 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-base font-medium`}
                        style={{ 
                          borderColor: currentStyle.borderHex, 
                          backgroundColor: currentStyle.bgHex,
                          color: currentStyle.textHex
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-2">English Meaning</label>
                      <input 
                        type="text"
                        value={newExample.meaning}
                        onChange={(e) => setNewExample({...newExample, meaning: e.target.value})}
                        placeholder="e.g. Good luck"
                        className={`w-full px-6 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-base font-medium`}
                        style={{ 
                          borderColor: currentStyle.borderHex, 
                          backgroundColor: currentStyle.bgHex,
                          color: currentStyle.textHex
                        }}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-2">Sinhala Meaning</label>
                      <textarea 
                        value={newExample.sinhalaMeaning}
                        onChange={(e) => setNewExample({...newExample, sinhalaMeaning: e.target.value})}
                        placeholder="සිංහල තේරුම"
                        rows={3}
                        className={`w-full px-6 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-base font-medium resize-none`}
                        style={{ 
                          borderColor: currentStyle.borderHex, 
                          backgroundColor: currentStyle.bgHex,
                          color: currentStyle.textHex
                        }}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-2">Usage Example</label>
                      <textarea 
                        value={newExample.example}
                        onChange={(e) => setNewExample({...newExample, example: e.target.value})}
                        placeholder="e.g. Break a leg on your audition!"
                        rows={3}
                        className={`w-full px-6 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-base font-medium resize-none`}
                        style={{ 
                          borderColor: currentStyle.borderHex, 
                          backgroundColor: currentStyle.bgHex,
                          color: currentStyle.textHex
                        }}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-black/10"
                    style={{ backgroundColor: currentStyle.color }}
                  >
                    Save to Collection
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List */}
          <div className="space-y-8">
            {selectedCategory === 'online_resources' ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-neutral-200/50 rounded-[2.5rem] p-12 text-center shadow-xl shadow-black/5"
              >
                <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Globe size={40} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Explore Learning Resources</h3>
                <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
                  We've curated a dedicated directory of podcasts, newspapers, and YouTube channels to help you immerse yourself in English.
                </p>
                <Link 
                  to="/resources"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 text-white rounded-[2rem] text-sm font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200 active:scale-95"
                >
                  View All Resources
                  <ChevronRight size={20} />
                </Link>
              </motion.div>
            ) : filteredExamples.length > 0 ? (
              filteredExamples.map((ex, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.3) }}
                  key={ex.id}
                  className="group bg-white border border-neutral-200/50 rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 relative overflow-hidden"
                >
                  <div 
                    className="absolute top-0 right-0 w-48 h-48 rounded-full -mr-24 -mt-24 transition-transform duration-1000 group-hover:scale-150 opacity-40" 
                    style={{ backgroundColor: currentStyle.bg.replace('bg-', '').split('/')[0] === 'bg-white' ? '#F5F5F7' : currentStyle.color + '10' }}
                  />
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-8 flex-1">
                      <div className="flex items-center gap-4">
                        <h3 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">{ex.phrase}</h3>
                        {ex.isCustom && (
                          <span 
                            className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border"
                            style={{ 
                              backgroundColor: currentStyle.bgHex, 
                              borderColor: currentStyle.borderHex, 
                              color: currentStyle.color 
                            }}
                          >
                            Personal
                          </span>
                        )}
                      </div>

                      <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-neutral-400">
                              <Info size={14} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">English Meaning</span>
                            </div>
                            <p className="text-lg text-neutral-600 leading-relaxed font-medium">{ex.meaning}</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-neutral-400">
                              <CheckCircle2 size={14} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Usage</span>
                            </div>
                            <div className="bg-[#F5F5F7]/80 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-100/50">
                              <p className="text-lg text-[#1D1D1F] italic font-medium leading-relaxed">"{ex.example}"</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-neutral-400">
                            <Languages size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Sinhala Meaning</span>
                          </div>
                          <div 
                            className={`p-8 rounded-[2rem] border shadow-sm transition-all hover:shadow-md`}
                            style={{ 
                              backgroundColor: currentStyle.bgHex, 
                              borderColor: currentStyle.borderHex 
                            }}
                          >
                            <p className={`text-2xl font-bold leading-relaxed`} style={{ color: currentStyle.textHex }}>{ex.sinhalaMeaning}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {ex.isCustom && (
                      <button 
                        onClick={() => handleDeleteExample(ex.id)}
                        className="p-3 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-300">
                  <Search size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-neutral-900 font-medium">No examples found</p>
                  <p className="text-sm text-neutral-500">Try a different search or add your own example.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  </div>
);
};

export default EnglishHub;
