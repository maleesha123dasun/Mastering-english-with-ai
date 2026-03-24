import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, MessageSquare, PenTool, Brain, LayoutDashboard, Menu, X, Book, BookMarked, Languages } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Home', path: '/', icon: BookOpen },
  { name: 'Dictionary', path: '/dictionary', icon: Book },
  { name: 'Translator', path: '/translator', icon: Languages },
  { name: 'My Vocabulary', path: '/my-vocabulary', icon: BookMarked },
  { name: 'AI Teacher', path: '/chat', icon: MessageSquare },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              EnglishMaster AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-neon-blue",
                  location.pathname === item.path ? "text-neon-blue" : "text-slate-400"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/login" className="btn-primary py-2 px-4 text-sm">
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-dark-bg border-b border-glass-border px-4 py-4 space-y-2"
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-colors",
                location.pathname === item.path ? "bg-neon-blue/10 text-neon-blue" : "text-slate-400 hover:bg-white/5"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center btn-primary py-3 mt-4"
          >
            Sign In
          </Link>
        </motion.div>
      )}
    </nav>
  );
};
