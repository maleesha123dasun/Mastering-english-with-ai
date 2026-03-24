import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  BookOpen, 
  Trophy, 
  Bell, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Volume2,
  ArrowRight,
  Calendar,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  doc, 
  getDoc, 
  setDoc, 
  Timestamp 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface DailyWord {
  word: string;
  meaning: string;
  example: string;
  pronunciation: string;
  date: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface DailyQuiz {
  date: string;
  questions: QuizQuestion[];
}

export const DailyLearning = () => {
  const [user, setUser] = useState<any>(null);
  const [dailyWord, setDailyWord] = useState<DailyWord | null>(null);
  const [dailyQuiz, setDailyQuiz] = useState<DailyQuiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchDailyContent();
    }
  }, [user]);

  const fetchDailyContent = async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, 'dailyContent', today);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setDailyWord(data.wordData);
        setDailyQuiz(data.quizData);
      } else {
        await generateDailyContent();
      }
    } catch (error) {
      console.error("Error fetching daily content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDailyContent = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Generate Word of the Day
      const wordResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Generate a 'Word of the Day' for English learners. Include the word, its meaning in simple English, a pronunciation guide, and an example sentence. Return as JSON.",
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

      // Generate Quiz based on the word or general English
      const quizResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a 3-question multiple choice quiz for English learners. One question should be about the word "${wordData.word}" (meaning: ${wordData.meaning}). The others can be general grammar or vocabulary. Return as JSON.`,
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
      quizData.date = today;

      // Save to Firestore
      await setDoc(doc(db, 'dailyContent', today), {
        wordData,
        quizData,
        createdAt: Timestamp.now()
      });

      setDailyWord(wordData);
      setDailyQuiz(quizData);
      
      // Notify user if permission granted
      if (Notification.permission === 'granted') {
        new Notification("New Word of the Day!", {
          body: `Today's word is "${wordData.word}". Come and learn its meaning!`,
          icon: "/favicon.ico"
        });
      }
    } catch (error) {
      console.error("Error generating daily content:", error);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        new Notification("Notifications Enabled!", {
          body: "You will now receive daily updates for your English learning.",
        });
      }
    }
  };

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option === dailyQuiz?.questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (dailyQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Preparing your daily learning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Page Cover Image */}
      <div className="h-[300px] w-full relative overflow-hidden">
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1600&h=400"
          alt="Daily Learning"
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
              Daily Challenge
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-12 shadow-2xl shadow-slate-200 border border-white">
          <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Calendar size={24} />
                </div>
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Daily Learning</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                Word of the <span className="text-emerald-500 italic serif">Day</span>
              </h1>
            </div>

            {notificationPermission !== 'granted' && (
              <button
                onClick={requestNotificationPermission}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                <Bell size={20} />
                Enable Notifications
              </button>
            )}
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Word of the Day Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          {dailyWord && (
            <div className="bg-white rounded-[2rem] p-10 shadow-xl shadow-slate-100 border border-slate-50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold">
                    <Sparkles size={16} />
                    Featured Word
                  </div>
                  <span className="text-slate-400 font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <div className="mb-10">
                  <h2 className="text-7xl font-black text-slate-900 mb-4 tracking-tighter">
                    {dailyWord.word}
                  </h2>
                  <div className="flex items-center gap-3 text-slate-500 italic text-xl mb-6">
                    <Volume2 size={24} className="text-emerald-500" />
                    {dailyWord.pronunciation}
                  </div>
                  <p className="text-2xl text-slate-600 leading-relaxed max-w-2xl">
                    {dailyWord.meaning}
                  </p>
                </div>

                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Example Usage</h4>
                  <p className="text-xl text-slate-700 leading-relaxed italic">
                    "{dailyWord.example}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Daily Quiz Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-200 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-white/10 text-emerald-400">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold">Daily Challenge</h3>
            </div>

            {!quizCompleted ? (
              <div className="flex-1 flex flex-col">
                <div className="mb-8">
                  <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <span>Question {currentQuestionIndex + 1} of {dailyQuiz?.questions.length}</span>
                    <span>Score: {score}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestionIndex + 1) / (dailyQuiz?.questions.length || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <h4 className="text-xl font-medium mb-8 leading-relaxed">
                  {dailyQuiz?.questions[currentQuestionIndex].question}
                </h4>

                <div className="space-y-3 mb-8">
                  {dailyQuiz?.questions[currentQuestionIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isAnswered}
                      className={`w-full p-5 rounded-2xl text-left font-medium transition-all border-2 ${
                        isAnswered
                          ? option === dailyQuiz.questions[currentQuestionIndex].correctAnswer
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : selectedAnswer === option
                              ? 'bg-red-500/20 border-red-500 text-red-400'
                              : 'bg-white/5 border-transparent opacity-50'
                          : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {isAnswered && option === dailyQuiz.questions[currentQuestionIndex].correctAnswer && (
                          <CheckCircle2 size={20} />
                        )}
                        {isAnswered && selectedAnswer === option && option !== dailyQuiz.questions[currentQuestionIndex].correctAnswer && (
                          <XCircle size={20} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-auto"
                  >
                    <div className="p-4 bg-white/5 rounded-2xl mb-6 text-sm text-slate-400 leading-relaxed">
                      <span className="font-bold text-emerald-400 block mb-1">Explanation:</span>
                      {dailyQuiz?.questions[currentQuestionIndex].explanation}
                    </div>
                    <button
                      onClick={nextQuestion}
                      className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                    >
                      {currentQuestionIndex === (dailyQuiz?.questions.length || 0) - 1 ? 'Finish Quiz' : 'Next Question'}
                      <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-6">
                  <Trophy size={48} />
                </div>
                <h4 className="text-3xl font-bold mb-2">Quiz Completed!</h4>
                <p className="text-slate-400 mb-8">You scored {score} out of {dailyQuiz?.questions.length}</p>
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => {
                      setQuizCompleted(false);
                      setCurrentQuestionIndex(0);
                      setScore(0);
                      setSelectedAnswer(null);
                      setIsAnswered(false);
                    }}
                    className="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all"
                  >
                    Try Again
                  </button>
                  <Link
                    to="/quizzes"
                    className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                  >
                    Explore More Quizzes
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Daily Tips / Motivation */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
          <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center mb-4">
            <BookOpen size={20} />
          </div>
          <h5 className="font-bold text-slate-900 mb-2">Learning Tip</h5>
          <p className="text-slate-600 text-sm leading-relaxed">
            Try to use today's word in at least three different conversations or sentences to lock it into your long-term memory.
          </p>
        </div>
        <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100">
          <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center mb-4">
            <Brain size={20} />
          </div>
          <h5 className="font-bold text-slate-900 mb-2">Did you know?</h5>
          <p className="text-slate-600 text-sm leading-relaxed">
            The most common letter in English is "e", and the most common word is "the".
          </p>
        </div>
        <div className="p-8 bg-purple-50 rounded-3xl border border-purple-100">
          <div className="w-10 h-10 bg-purple-500 text-white rounded-xl flex items-center justify-center mb-4">
            <Sparkles size={20} />
          </div>
          <h5 className="font-bold text-slate-900 mb-2">Daily Goal</h5>
          <p className="text-slate-600 text-sm leading-relaxed">
            Complete your daily quiz and add 5 new words to your vocabulary builder to maintain your learning streak.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};
