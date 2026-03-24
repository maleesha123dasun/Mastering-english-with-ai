import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Globe, Zap, Users, ShieldCheck, Lightbulb, Bell, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const TypewriterText = ({ texts }: { texts: string[] }) => {
  const [index, setIndex] = React.useState(0);
  const [displayText, setDisplayText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const currentText = texts[index];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentText.substring(0, displayText.length + 1));
        if (displayText.length === currentText.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentText.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setIndex((index + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index, texts]);

  return (
    <span className="text-apple-dark min-h-[1.2em] inline-block">
      {displayText}
      <span className="animate-pulse ml-1 text-apple-blue">|</span>
    </span>
  );
};

export const Home = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [dailyWord, setDailyWord] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const fetchDailyWord = async () => {
      const today = new Date().toISOString().split('T')[0];
      try {
        const docRef = doc(db, 'dailyContent', today);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDailyWord(docSnap.data().wordData.word);
        }
      } catch (error) {
        console.error("Error fetching daily word for notification:", error);
      }
    };
    fetchDailyWord();
  }, []);

  return (
    <div className="bg-white">
      {/* Notification Bar */}
      <AnimatePresence>
        {showNotification && dailyWord && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-emerald-500 text-white py-3 px-6 relative z-50"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm font-bold">
              <div className="flex items-center gap-2">
                <Bell size={16} className="animate-bounce" />
                <span>Word of the Day is ready: <span className="underline decoration-2 underline-offset-4 decoration-white/50">"{dailyWord}"</span></span>
              </div>
              <Link 
                to="/daily-learning" 
                className="bg-white text-emerald-600 px-4 py-1 rounded-full hover:bg-emerald-50 transition-colors"
              >
                Learn Now
              </Link>
              <button 
                onClick={() => setShowNotification(false)}
                className="absolute right-6 p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-8">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920&h=1080"
            alt="Learning Environment"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-sm font-bold tracking-[0.2em] text-apple-gray uppercase mb-6"
            >
              EnglishMaster AI
            </motion.span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-apple-dark mb-8 leading-[1.1]">
              Master English with <br />
              <TypewriterText texts={['Intelligence', 'Precision', 'Fluency']} />
            </h1>
            <p className="text-xl md:text-2xl text-apple-gray max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              A revolutionary language platform. Personalized AI lessons, 
              real-time correction, and adaptive practice.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/dictionary" className="btn-primary text-lg px-10 py-4 shadow-xl shadow-apple-blue/20">
                Get Started
              </Link>
              <Link to="/chat" className="text-apple-blue font-bold text-lg hover:underline flex items-center gap-2">
                Talk to AI Teacher <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Daily Learning Section */}
      <section className="py-20 px-8 bg-apple-bg">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card p-10 border-none shadow-sm bg-white group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 block">Daily Learning</span>
                  <h3 className="text-3xl font-bold text-apple-dark">Word of the Day & AI Quiz</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Sparkles size={24} />
                </div>
              </div>
              <p className="text-lg text-apple-gray mb-8 leading-relaxed">
                Boost your English every day with a new AI-curated word and a personalized quiz to test your knowledge.
              </p>
              <div className="flex items-center gap-4">
                <Link to="/daily-learning" className="btn-primary inline-flex items-center gap-2">
                  Start Learning <ArrowRight size={18} />
                </Link>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      {i}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">
                    +
                  </div>
                </div>
                <span className="text-sm text-slate-400 font-medium">Join 500+ daily learners</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'AI Grammar',
                desc: 'Real-time feedback with deep linguistic analysis.',
                icon: Zap,
                color: 'bg-amber-100 text-amber-600'
              },
              {
                title: 'Smart Dictionary',
                desc: 'Comprehensive Cambridge-style definitions in Sinhala.',
                icon: Globe,
                color: 'bg-blue-100 text-blue-600'
              },
              {
                title: 'Personal Lexicon',
                desc: 'Build your vocabulary with AI-powered auto-fill.',
                icon: Sparkles,
                color: 'bg-purple-100 text-purple-600'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500",
                  feature.color
                )}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-apple-gray leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
