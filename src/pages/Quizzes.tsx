import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Trophy, RefreshCcw, ArrowRight, Loader2, Brain, Sparkles, Calendar, BookOpen, Film, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { GoogleGenAI, Type } from "@google/genai";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

type QuizCategory = 'daily' | 'grammar' | 'vocabulary' | 'movies' | 'business';

export const Quizzes = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<QuizCategory>('daily');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadQuiz();
  }, [category]);

  const loadQuiz = async () => {
    setIsLoading(true);
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);

    try {
      if (category === 'daily') {
        const docRef = doc(db, 'dailyContent', today);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setQuestions(docSnap.data().quizData.questions);
        } else {
          await generateQuiz('daily');
        }
      } else {
        // For other categories, we generate on the fly for now
        // In a real app, you might cache these or have a pool
        await generateQuiz(category);
      }
    } catch (error) {
      console.error("Error loading quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuiz = async (cat: QuizCategory) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let prompt = "";
      if (cat === 'daily') {
        // First, we need a word to base the quiz on if it doesn't exist
        const wordResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "Generate a 'Word of the Day' for English learners. Include the word, its meaning, pronunciation, and an example sentence. Return as JSON.",
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                meaning: { type: Type.STRING },
                pronunciation: { type: Type.STRING },
                example: { type: Type.STRING }
              },
              required: ["word", "meaning", "pronunciation", "example"]
            }
          }
        });

        const wordData = JSON.parse(wordResponse.text);
        wordData.date = today;
        prompt = `Generate a 5-question multiple choice quiz for English learners. Include questions about grammar, vocabulary, and specifically one question about the word "${wordData.word}". Return as JSON.`;
        
        const quizResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctAnswer", "explanation"]
                  }
                }
              },
              required: ["questions"]
            }
          }
        });

        const quizData = JSON.parse(quizResponse.text);
        
        await setDoc(doc(db, 'dailyContent', today), {
          wordData,
          quizData,
          createdAt: Timestamp.now()
        });

        setQuestions(quizData.questions);
      } else {
        prompt = `Generate a 5-question multiple choice quiz for English learners focusing on the category: ${cat}. Return as JSON.`;
        
        const quizResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctAnswer", "explanation"]
                  }
                }
              },
              required: ["questions"]
            }
          }
        });

        const quizData = JSON.parse(quizResponse.text);
        setQuestions(quizData.questions);
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  };

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === questions[currentStep].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const categories: { id: QuizCategory; label: string; icon: any; image: string }[] = [
    { id: 'daily', label: 'Daily Challenge', icon: Sparkles, image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800&h=400' },
    { id: 'grammar', label: 'Grammar', icon: BookOpen, image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800&h=400' },
    { id: 'vocabulary', label: 'Vocabulary', icon: Languages, image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800&h=400' },
    { id: 'movies', label: 'Movies & Media', icon: Film, image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800&h=400' },
    { id: 'business', label: 'Business English', icon: Brain, image: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=800&h=400' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Preparing your {category} quiz...</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="py-20 px-8 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white p-16 max-w-xl w-full text-center rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-50"
        >
          <div className="w-24 h-24 rounded-3xl bg-emerald-50 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Trophy className="text-emerald-500" size={48} />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Quiz Completed!</h2>
          <p className="text-2xl text-slate-500 mb-12">You scored <span className="text-emerald-500 font-bold">{score}</span> out of {questions.length}</p>
          
          <div className="space-y-4 max-w-xs mx-auto">
            <button onClick={resetQuiz} className="w-full bg-slate-900 text-white py-5 rounded-2xl flex items-center justify-center gap-2 text-lg font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">
              <RefreshCcw size={20} />
              Try Again
            </button>
            <Link to="/daily-learning" className="w-full py-4 text-emerald-600 font-bold hover:underline block">Back to Daily Learning</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuiz = questions[currentStep];

  return (
    <div className="pb-24">
      {/* Page Cover Image */}
      <div className="h-[300px] w-full relative overflow-hidden">
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1600&h=400"
          alt="Quizzes"
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
              Knowledge Hub
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-12 shadow-2xl shadow-slate-200 border border-white">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Brain size={24} />
                </div>
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Interactive Quizzes</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                Master <span className="text-emerald-500 italic serif">English</span>
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Current Score</span>
                <div className="text-3xl font-black text-emerald-500">{score} <span className="text-slate-300 text-xl font-medium">/ {questions.length}</span></div>
              </div>
            </div>
          </header>

          {/* Category Selection */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all border-2",
                  category === cat.id
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200"
                    : "bg-white border-slate-100 text-slate-500 hover:border-emerald-200 hover:text-emerald-600"
                )}
              >
                <cat.icon size={18} />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="mb-12">
            <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] mb-10 shadow-xl shadow-slate-100 border border-slate-50 relative overflow-hidden">
            {/* Category Cover Image */}
            <div className="h-48 w-full relative overflow-hidden">
              <img 
                src={categories.find(c => c.id === category)?.image} 
                alt={category}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              <div className="absolute bottom-6 left-12">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                  {React.createElement(categories.find(c => c.id === category)?.icon, { size: 16, className: "text-emerald-600" })}
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                    {categories.find(c => c.id === category)?.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-12 relative z-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
              
              <h2 className="text-3xl font-bold text-slate-900 mb-12 leading-tight">
                {currentQuiz?.question}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {currentQuiz?.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(option)}
                    className={cn(
                      "w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between group text-xl font-medium",
                      selectedOption === option
                        ? option === currentQuiz.correctAnswer
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                          : "bg-red-50 border-red-500 text-red-700"
                        : isAnswered && option === currentQuiz.correctAnswer
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                        : "bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100 hover:border-slate-200"
                    )}
                  >
                    <span>{option}</span>
                    <AnimatePresence>
                      {isAnswered && option === currentQuiz.correctAnswer && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <CheckCircle2 size={24} className="text-emerald-600" />
                        </motion.div>
                      )}
                      {isAnswered && selectedOption === option && option !== currentQuiz.correctAnswer && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <XCircle size={24} className="text-red-600" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                      <Sparkles size={18} />
                      Explanation
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {currentQuiz.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="bg-slate-900 text-white px-12 py-5 rounded-2xl flex items-center gap-3 disabled:opacity-50 text-xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
            >
              {currentStep === questions.length - 1 ? "Finish Quiz" : "Next Question"}
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
