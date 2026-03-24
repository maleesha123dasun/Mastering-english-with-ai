import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  MessageSquare, 
  PenTool, 
  Book, 
  BookMarked, 
  Languages,
  ChevronRight,
  LogOut,
  Award,
  Clock,
  Repeat,
  Sparkles,
  Layers,
  Quote,
  Zap,
  Scroll,
  Globe
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Home', path: '/', icon: BookOpen, color: 'text-blue-500' },
  { name: 'Dictionary', path: '/dictionary', icon: Book, color: 'text-sky-500' },
  { name: 'Translator', path: '/translator', icon: Languages, color: 'text-violet-500' },
  { name: 'My Vocabulary', path: '/my-vocabulary', icon: BookMarked, color: 'text-pink-500' },
  { name: 'Grammar Patterns', path: '/grammar-patterns', icon: Book, color: 'text-indigo-500' },
  { name: 'Phrasal Verbs', path: '/phrasal-verbs', icon: Layers, color: 'text-purple-500' },
  { name: 'Idioms', path: '/idioms', icon: Quote, color: 'text-rose-500' },
  { name: 'Speaking Patterns', path: '/speaking-patterns', icon: MessageSquare, color: 'text-emerald-500' },
  { name: 'Slangs', path: '/slangs', icon: Zap, color: 'text-amber-500' },
  { name: 'Proverbs', path: '/proverbs', icon: Scroll, color: 'text-orange-500' },
  { name: 'Tenses', path: '/tenses', icon: Clock, color: 'text-blue-600' },
  { name: 'Active & Passive Voice', path: '/active-passive', icon: Repeat, color: 'text-indigo-600' },
  { name: 'Online Resources', path: '/resources', icon: Globe, color: 'text-emerald-500' },
  { name: 'Daily Learning', path: '/daily-learning', icon: Sparkles, color: 'text-emerald-500' },
  { name: 'Quizzes', path: '/quizzes', icon: Award, color: 'text-yellow-500' },
  { name: 'AI Teacher', path: '/chat', icon: MessageSquare, color: 'text-cyan-500' },
  { name: 'Writing', path: '/writing', icon: PenTool, color: 'text-teal-500' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-72 h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col p-6 overflow-y-auto scrollbar-hide">
      <div className="mb-10 px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            EnglishMaster
          </span>
        </Link>
      </div>

      <div className="flex-1 space-y-1">
        <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "sidebar-item",
                isActive && "sidebar-item-active"
              )}
            >
              <item.icon size={20} className={cn(isActive ? item.color : "text-slate-400 group-hover:text-slate-600")} />
              <span className={cn("flex-1", isActive && "font-bold text-slate-900")}>{item.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-pill" 
                  className={cn("w-1.5 h-1.5 rounded-full", item.color.replace('text-', 'bg-'))} 
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-glass-border space-y-1">
        <button className="sidebar-item w-full text-left text-rose-500 hover:text-rose-600 hover:bg-rose-50">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
