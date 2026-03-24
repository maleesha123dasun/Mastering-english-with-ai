import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { AIChat } from './pages/AIChat';
import { WritingPractice } from './pages/WritingPractice';
import { VocabularyBuilder } from './pages/VocabularyBuilder';
import { Quizzes } from './pages/Quizzes';
import { Dictionary } from './pages/Dictionary';
import { Translator } from './pages/Translator';
import { MyVocabulary } from './pages/MyVocabulary';
import { Tenses } from './pages/Tenses';
import { ActivePassive } from './pages/ActivePassive';
import { EnglishHub } from './pages/EnglishHub';
import { OnlineResources } from './pages/OnlineResources';
import { DailyLearning } from './pages/DailyLearning';
import { PageTransition } from './components/PageTransition';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/english-hub" element={<PageTransition><EnglishHub /></PageTransition>} />
        <Route path="/grammar-patterns" element={<PageTransition><EnglishHub category="grammar" /></PageTransition>} />
        <Route path="/phrasal-verbs" element={<PageTransition><EnglishHub category="phrasal_verbs" /></PageTransition>} />
        <Route path="/idioms" element={<PageTransition><EnglishHub category="idioms" /></PageTransition>} />
        <Route path="/speaking-patterns" element={<PageTransition><EnglishHub category="speaking" /></PageTransition>} />
        <Route path="/slangs" element={<PageTransition><EnglishHub category="slang" /></PageTransition>} />
        <Route path="/proverbs" element={<PageTransition><EnglishHub category="proverbs" /></PageTransition>} />
        <Route path="/dictionary" element={<PageTransition><Dictionary /></PageTransition>} />
        <Route path="/translator" element={<PageTransition><Translator /></PageTransition>} />
        <Route path="/my-vocabulary" element={<PageTransition><MyVocabulary /></PageTransition>} />
        <Route path="/chat" element={<PageTransition><AIChat /></PageTransition>} />
        <Route path="/writing" element={<PageTransition><WritingPractice /></PageTransition>} />
        <Route path="/vocabulary" element={<PageTransition><VocabularyBuilder /></PageTransition>} />
        <Route path="/quizzes" element={<PageTransition><Quizzes /></PageTransition>} />
        <Route path="/resources" element={<PageTransition><OnlineResources /></PageTransition>} />
        <Route path="/grammar" element={<PageTransition><WritingPractice /></PageTransition>} />
        <Route path="/speaking" element={<PageTransition><AIChat /></PageTransition>} />
        <Route path="/login" element={<PageTransition><div className="py-32 text-center text-4xl font-bold text-apple-dark">Login Page Placeholder</div></PageTransition>} />
        <Route path="/tenses" element={<PageTransition><Tenses /></PageTransition>} />
        <Route path="/active-passive" element={<PageTransition><ActivePassive /></PageTransition>} />
        <Route path="/daily-learning" element={<PageTransition><DailyLearning /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen flex bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}
