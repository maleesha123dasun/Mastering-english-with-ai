import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Mic, 
  Newspaper, 
  Youtube, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  PlayCircle,
  Headphones,
  FileText,
  Plus,
  X,
  Loader2,
  Film,
  CheckCircle2,
  Circle,
  MessageSquare,
  Sparkles as SparklesIcon,
  Trash2,
  ChevronDown,
  ChevronUp,
  Languages
} from 'lucide-react';
import { toast } from 'sonner';
import { db, auth } from '../firebase';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface Resource {
  id?: string;
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  tags: string[];
  icon: any;
  color: string;
  isCustom?: boolean;
  watched?: boolean;
  vocabulary?: { word: string; meaning: string; example: string }[];
}

const resources: Record<string, Resource[]> = {
  podcasts: [
    {
      title: "BBC 6 Minute English",
      description: "Learn and practice useful English language for everyday situations with the BBC.",
      url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english",
      tags: ["Intermediate", "Daily", "BBC"],
      icon: Headphones,
      color: "bg-blue-500"
    },
    {
      title: "The English We Speak",
      description: "Every week, we take a look at a different everyday English phrase or slang word.",
      url: "https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak",
      tags: ["Slang", "Phrases", "Short"],
      icon: Mic,
      color: "bg-indigo-500"
    },
    {
      title: "Luke's English Podcast",
      description: "An award-winning podcast for learners of English as a foreign language.",
      url: "https://teacherluke.co.uk/",
      tags: ["Advanced", "British", "Humor"],
      icon: Headphones,
      color: "bg-purple-500"
    },
    {
      title: "Voice of America (VOA) Learning English",
      description: "News and information for English learners at various levels.",
      url: "https://learningenglish.voanews.com/p/5373.html",
      tags: ["American", "Beginner", "News"],
      icon: Mic,
      color: "bg-sky-500"
    }
  ],
  newspapers: [
    {
      title: "The Guardian - English Learning",
      description: "High-quality journalism that is excellent for advanced reading practice.",
      url: "https://www.theguardian.com/international",
      tags: ["Advanced", "Global", "Journalism"],
      icon: Newspaper,
      color: "bg-emerald-500"
    },
    {
      title: "The New York Times Learning Network",
      description: "Resources for students and teachers using NYT content.",
      url: "https://www.nytimes.com/section/learning",
      tags: ["Academic", "Writing", "American"],
      icon: FileText,
      color: "bg-slate-800"
    },
    {
      title: "BBC News",
      description: "World news in clear, standard English.",
      url: "https://www.bbc.com/news",
      tags: ["Current Events", "British", "Reliable"],
      icon: Newspaper,
      color: "bg-red-600"
    },
    {
      title: "News in Levels",
      description: "World news for students of English in 3 levels.",
      url: "https://www.newsinlevels.com/",
      tags: ["Graded Reading", "All Levels"],
      icon: FileText,
      color: "bg-amber-500"
    },
    {
      title: "The Wall Street Journal",
      description: "Business and financial news with a focus on American and international markets.",
      url: "https://www.wsj.com/",
      tags: ["Business", "American", "Advanced"],
      icon: FileText,
      color: "bg-slate-900"
    },
    {
      title: "Reuters",
      description: "Global news coverage with a focus on unbiased, factual reporting.",
      url: "https://www.reuters.com/",
      tags: ["Global", "Factual", "Intermediate"],
      icon: Newspaper,
      color: "bg-orange-600"
    },
    {
      title: "Al Jazeera English",
      description: "In-depth global news and analysis from a unique international perspective.",
      url: "https://www.aljazeera.com/",
      tags: ["Global", "Analysis", "Diverse"],
      icon: Globe,
      color: "bg-amber-600"
    },
    {
      title: "CNN International",
      description: "Breaking news and top stories from around the world.",
      url: "https://edition.cnn.com/",
      tags: ["Breaking News", "American", "Global"],
      icon: Newspaper,
      color: "bg-red-700"
    },
    {
      title: "The Washington Post",
      description: "Award-winning journalism covering politics, business, and world news.",
      url: "https://www.washingtonpost.com/",
      tags: ["Politics", "American", "Advanced"],
      icon: FileText,
      color: "bg-slate-800"
    }
  ],
  youtube: [
    {
      title: "English with Lucy",
      description: "Learn beautiful British English with Lucy's engaging lessons.",
      url: "https://www.youtube.com/@EnglishwithLucy",
      tags: ["British", "Pronunciation", "Grammar"],
      icon: Youtube,
      color: "bg-rose-500"
    },
    {
      title: "Learn English with TV Series",
      description: "Learn English by watching your favorite TV shows and movies.",
      url: "https://www.youtube.com/@LearnEnglishWithTVSeries",
      tags: ["Fun", "Listening", "Pop Culture"],
      icon: PlayCircle,
      color: "bg-red-500"
    },
    {
      title: "mmmEnglish",
      description: "Emma helps you build confidence and fluency in English.",
      url: "https://www.youtube.com/@mmmEnglish_Emma",
      tags: ["Fluency", "Confidence", "Australian"],
      icon: Youtube,
      color: "bg-orange-500"
    },
    {
      title: "BBC Learning English YouTube",
      description: "The official YouTube channel for BBC Learning English.",
      url: "https://www.youtube.com/@bbclearningenglish",
      tags: ["Comprehensive", "Official", "British"],
      icon: PlayCircle,
      color: "bg-blue-600"
    }
  ]
};

export const OnlineResources = () => {
  const [activeSubCategory, setActiveSubCategory] = useState<'all' | 'podcasts' | 'newspapers' | 'youtube' | 'movies'>('all');
  const [customResources, setCustomResources] = useState<Resource[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    url: '',
    imageUrl: '',
    type: 'podcasts' as 'podcasts' | 'newspapers' | 'youtube' | 'movies'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setCustomResources([]);
      return;
    }

    const q = query(
      collection(db, `users/${user.uid}/customResources`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const resources = snapshot.docs.map(doc => {
        const data = doc.data();
        let icon = Headphones;
        let color = 'bg-indigo-500';

        if (data.type === 'newspapers') {
          icon = FileText;
          color = 'bg-emerald-500';
        } else if (data.type === 'youtube') {
          icon = PlayCircle;
          color = 'bg-red-500';
        } else if (data.type === 'movies') {
          icon = Film;
          color = 'bg-amber-500';
        }

        return {
          id: doc.id,
          ...data,
          icon,
          color,
          isCustom: true
        };
      }) as Resource[];
      setCustomResources(resources);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Check for duplicate URL
    if (newResource.url) {
      const isDuplicate = customResources.some(r => r.url === newResource.url);
      if (isDuplicate) {
        toast.error('This URL is already in your resources!');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const resourceData: any = {
        ...newResource,
        tags: ['My Resource'],
        createdAt: Timestamp.now().toDate().toISOString(),
        userId: user.uid,
        vocabulary: []
      };

      if (newResource.type === 'movies' && !newResource.url) {
        delete resourceData.url;
      }

      await addDoc(collection(db, `users/${user.uid}/customResources`), resourceData);
      setIsModalOpen(false);
      setNewResource({ title: '', description: '', url: '', imageUrl: '', type: 'podcasts' });
    } catch (error) {
      console.error("Error adding resource: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!user || !id) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/customResources`, id));
    } catch (error) {
      console.error("Error deleting resource: ", error);
    }
  };

  const handleToggleWatched = async (id: string, currentStatus: boolean) => {
    if (!user || !id) return;
    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      await updateDoc(doc(db, `users/${user.uid}/customResources`, id), {
        watched: !currentStatus
      });
    } catch (error) {
      console.error("Error updating watched status: ", error);
    }
  };

  const getResources = (type: string) => {
    const staticOnes = resources[type] || [];
    const customOnes = customResources.filter(r => (r as any).type === type);
    return [...staticOnes, ...customOnes];
  };

  const subCategories = [
    { id: 'all', label: 'All', icon: Globe, color: 'text-slate-500' },
    { id: 'podcasts', label: 'Podcasts', icon: Mic, color: 'text-indigo-500' },
    { id: 'newspapers', label: 'Newspapers', icon: Newspaper, color: 'text-emerald-500' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500' },
    { id: 'movies', label: 'Movies', icon: Film, color: 'text-amber-500' },
  ];

  const categoryImages: Record<string, string> = {
    all: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1600&h=400',
    podcasts: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=1600&h=400',
    newspapers: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1600&h=400',
    youtube: 'https://images.unsplash.com/photo-1524508762098-fd966ffb6ef9?auto=format&fit=crop&q=80&w=1600&h=400',
    movies: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1600&h=400',
  };

  return (
    <div className="pb-24">
      {/* Page Cover Image */}
      <div className="h-[300px] w-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSubCategory}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            src={categoryImages[activeSubCategory]}
            alt={activeSubCategory}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-white" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-6xl font-black text-white drop-shadow-2xl tracking-tighter uppercase italic">
              {activeSubCategory === 'all' ? 'Directory' : activeSubCategory}
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-12 shadow-2xl shadow-slate-200 border border-white">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Globe size={24} />
                </div>
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Learning Directory</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-bold text-slate-900 mb-6 tracking-tight"
              >
                Online <span className="text-emerald-500 italic serif">Resources</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-500 max-w-2xl leading-relaxed"
              >
                Curated collection of the best free resources to help you master English through immersion and practice.
              </motion.p>
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all"
            >
              <Plus size={20} />
              Add My Resource
            </motion.button>
          </header>

          {/* Sub-categories Navigation */}
          <div className="mb-16 flex flex-wrap gap-3 sticky top-0 z-20 py-4 -mx-6 px-6">
            {subCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveSubCategory(cat.id as any)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeSubCategory === cat.id 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105' 
                    : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <cat.icon size={18} className={activeSubCategory === cat.id ? 'text-white' : cat.color} />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-24">
        {/* Podcasts Section */}
        <AnimatePresence mode="wait">
          {(activeSubCategory === 'all' || activeSubCategory === 'podcasts') && (
            <motion.section
              key="podcasts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Mic size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Podcasts</h2>
                  <p className="text-slate-500">Improve your listening skills on the go.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getResources('podcasts').map((resource, idx) => (
                  <ResourceCard key={resource.id || idx} resource={resource} delay={idx * 0.1} onDelete={handleDeleteResource} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Newspapers Section */}
        <AnimatePresence mode="wait">
          {(activeSubCategory === 'all' || activeSubCategory === 'newspapers') && (
            <motion.section
              key="newspapers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Newspaper size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Newspapers & Reading</h2>
                  <p className="text-slate-500">Expand your vocabulary with real-world news.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getResources('newspapers').map((resource, idx) => (
                  <ResourceCard key={resource.id || idx} resource={resource} delay={idx * 0.1} onDelete={handleDeleteResource} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* YouTube Section */}
        <AnimatePresence mode="wait">
          {(activeSubCategory === 'all' || activeSubCategory === 'youtube') && (
            <motion.section
              key="youtube"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                  <Youtube size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">YouTube Channels</h2>
                  <p className="text-slate-500">Visual lessons from world-class teachers.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getResources('youtube').map((resource, idx) => (
                  <ResourceCard key={resource.id || idx} resource={resource} delay={idx * 0.1} onDelete={handleDeleteResource} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Movies Section */}
        <AnimatePresence mode="wait">
          {(activeSubCategory === 'all' || activeSubCategory === 'movies') && (
            <motion.section
              key="movies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Film size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Movies & Series</h2>
                    <p className="text-slate-500">Track movies you've watched to improve your English.</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setNewResource(prev => ({ ...prev, type: 'movies' }));
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all"
                >
                  <Plus size={20} />
                  Add Movie
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getResources('movies').map((resource, idx) => (
                  <ResourceCard 
                    key={resource.id || idx} 
                    resource={resource} 
                    delay={idx * 0.1} 
                    onDelete={handleDeleteResource}
                    onToggleWatched={handleToggleWatched}
                  />
                ))}
                {getResources('movies').length === 0 && (
                  <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Film size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">Add movies you want to watch or have watched!</p>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Add Resource Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">Add My Resource</h3>
              <p className="text-slate-500 mb-8">Save your favorite learning links for easy access.</p>

              <form onSubmit={handleAddResource} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Resource Type</label>
                  <div className="grid grid-cols-5 gap-3">
                    {['podcasts', 'newspapers', 'youtube', 'movies'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewResource(prev => ({ ...prev, type: type as any }))}
                        className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                          newResource.type === type 
                            ? 'bg-slate-900 text-white border-slate-900' 
                            : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Title</label>
                  <input
                    required
                    type="text"
                    value={newResource.title}
                    onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., My Favorite Podcast"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Description</label>
                  <textarea
                    required
                    value={newResource.description}
                    onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What is this resource about?"
                    rows={3}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                  />
                </div>

                {newResource.type !== 'movies' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">URL</label>
                    <input
                      required
                      type="url"
                      value={newResource.url}
                      onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={newResource.imageUrl}
                    onChange={(e) => setNewResource(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://... (Poster or thumbnail)"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                  {isSubmitting ? 'Adding...' : 'Add Resource'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suggestion Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="mt-24 p-10 rounded-3xl bg-slate-900 text-white relative overflow-hidden"
      >
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-bold mb-4">Missing something?</h3>
          <p className="text-slate-400 mb-8 text-lg">
            We're constantly updating our resource list. If you know a great website or channel that helped you, let us know!
          </p>
          <button className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all flex items-center gap-2 group">
            Suggest a Resource
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full -mr-48 -mb-48" />
      </motion.div>
      </div>
    </div>
  </div>
  );
};

const ResourceCard = ({ resource, delay, onDelete, onToggleWatched }: { resource: Resource; delay: number; onDelete?: (id: string) => void; onToggleWatched?: (id: string, status: boolean) => void; key?: any }) => {
  const [isVocabOpen, setIsVocabOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [newVocab, setNewVocab] = useState({ word: '', meaning: '', example: '' });

  const handleAddVocab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resource.id || !newVocab.word) return;
    
    try {
      const { updateDoc, doc, arrayUnion } = await import('firebase/firestore');
      const user = auth.currentUser;
      if (!user) return;
      
      await updateDoc(doc(db, `users/${user.uid}/customResources`, resource.id), {
        vocabulary: arrayUnion(newVocab)
      });
      setNewVocab({ word: '', meaning: '', example: '' });
    } catch (error) {
      console.error("Error adding vocab:", error);
    }
  };

  const handleAiAutoFill = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest 3 useful English vocabulary words from the movie "${resource.title}". For each word, provide:
        1. The word itself.
        2. Its meaning in Sinhala.
        3. An example sentence using the word.
        Return the result as a JSON array of objects with keys: "word", "meaning", "example".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                meaning: { type: Type.STRING },
                example: { type: Type.STRING }
              },
              required: ["word", "meaning", "example"]
            }
          }
        }
      });

      const suggestedVocab = JSON.parse(response.text);
      const { updateDoc, doc, arrayUnion } = await import('firebase/firestore');
      const user = auth.currentUser;
      if (!user) return;

      for (const item of suggestedVocab) {
        await updateDoc(doc(db, `users/${user.uid}/customResources`, resource.id), {
          vocabulary: arrayUnion(item)
        });
      }
    } catch (error) {
      console.error("AI Auto-fill error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleRemoveVocab = async (vocabItem: any) => {
    if (!resource.id) return;
    try {
      const { updateDoc, doc, arrayRemove } = await import('firebase/firestore');
      const user = auth.currentUser;
      if (!user) return;
      
      await updateDoc(doc(db, `users/${user.uid}/customResources`, resource.id), {
        vocabulary: arrayRemove(vocabItem)
      });
    } catch (error) {
      console.error("Error removing vocab:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
      className={`group p-6 rounded-3xl bg-white border shadow-sm hover:shadow-xl transition-all flex flex-col h-full relative ${
        resource.watched ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100'
      }`}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {(resource as any).type === 'movies' && onToggleWatched && (
          <button
            onClick={(e) => {
              e.preventDefault();
              if (resource.id) onToggleWatched(resource.id, !!resource.watched);
            }}
            className={`p-2 rounded-xl transition-all ${
              resource.watched 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
            title={resource.watched ? "Mark as unwatched" : "Mark as watched"}
          >
            {resource.watched ? <CheckCircle2 size={14} /> : <Circle size={14} />}
          </button>
        )}
        
        {resource.isCustom && onDelete && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (resource.id) onDelete(resource.id);
            }}
            className="p-2 rounded-xl bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-100"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-col h-full">
        {resource.imageUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden aspect-video bg-slate-100 relative group-hover:scale-[1.02] transition-transform duration-500">
            <img 
              src={resource.imageUrl} 
              alt={resource.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        
        {resource.url ? (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4"
          >
            <div className={`w-12 h-12 rounded-2xl ${resource.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
              <resource.icon size={24} />
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
              {resource.title}
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            
            <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
              {resource.description}
            </p>
          </a>
        ) : (
          <div className="mb-4">
            <div className={`w-12 h-12 rounded-2xl ${resource.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
              <resource.icon size={24} />
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
              {resource.title}
            </h3>
            
            <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
              {resource.description}
            </p>
          </div>
        )}

        {/* Vocabulary Section */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <button 
            onClick={() => setIsVocabOpen(!isVocabOpen)}
            className="flex items-center justify-between w-full text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-500" />
              Learned Words ({resource.vocabulary?.length || 0})
            </div>
            {isVocabOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {isVocabOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4">
                  {/* AI Auto-fill Button */}
                  {(resource as any).type === 'movies' && (
                    <button
                      onClick={handleAiAutoFill}
                      disabled={isAiLoading}
                      className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all disabled:opacity-50"
                    >
                      {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <SparklesIcon size={14} />}
                      AI Auto-fill Vocabulary
                    </button>
                  )}

                  {/* Vocab List */}
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {resource.vocabulary?.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl relative group/item">
                        <button 
                          onClick={() => handleRemoveVocab(item)}
                          className="absolute top-2 right-2 p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover/item:opacity-100 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 text-sm">{item.word}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <Languages size={10} />
                            {item.meaning}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 italic">"{item.example}"</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Vocab Form */}
                  <form onSubmit={handleAddVocab} className="space-y-2 pt-2 border-t border-slate-50">
                    <input 
                      type="text"
                      placeholder="Word"
                      value={newVocab.word}
                      onChange={(e) => setNewVocab(prev => ({ ...prev, word: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <input 
                      type="text"
                      placeholder="Sinhala Meaning"
                      value={newVocab.meaning}
                      onChange={(e) => setNewVocab(prev => ({ ...prev, meaning: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <textarea 
                      placeholder="Example Sentence"
                      value={newVocab.example}
                      onChange={(e) => setNewVocab(prev => ({ ...prev, example: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border-none focus:ring-1 focus:ring-emerald-500 resize-none"
                      rows={2}
                    />
                    <button 
                      type="submit"
                      className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
                    >
                      Add Word
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {resource.tags.map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
