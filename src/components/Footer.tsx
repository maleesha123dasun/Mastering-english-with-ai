import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-glass-border pt-24 pb-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-apple-dark flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-apple-dark">
              EnglishMaster
            </span>
          </Link>
          <p className="text-apple-gray text-lg leading-relaxed">
            Empowering language learners worldwide with cutting-edge AI technology. 
            Master English faster, smarter, and more effectively.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-apple-dark mb-8 text-lg">Platform</h4>
          <ul className="space-y-4 text-apple-gray font-medium">
            <li><Link to="/grammar" className="hover:text-apple-blue transition-colors">Grammar Lessons</Link></li>
            <li><Link to="/vocabulary" className="hover:text-apple-blue transition-colors">Vocabulary Builder</Link></li>
            <li><Link to="/chat" className="hover:text-apple-blue transition-colors">AI Teacher</Link></li>
            <li><Link to="/quizzes" className="hover:text-apple-blue transition-colors">Quizzes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-apple-dark mb-8 text-lg">Company</h4>
          <ul className="space-y-4 text-apple-gray font-medium">
            <li><Link to="/about" className="hover:text-apple-blue transition-colors">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-apple-blue transition-colors">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-apple-blue transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-apple-dark mb-8 text-lg">Stay Updated</h4>
          <p className="text-apple-gray mb-6 leading-relaxed">Subscribe to our newsletter for tips and updates.</p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Email address"
              className="bg-apple-bg border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue/10 flex-1"
            />
            <button className="bg-apple-dark text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-black transition-colors shadow-lg shadow-apple-dark/10">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-apple-gray text-sm font-medium">
          © {new Date().getFullYear()} EnglishMaster AI. All rights reserved.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-apple-gray hover:text-apple-blue transition-colors"><Facebook size={20} /></a>
          <a href="#" className="text-apple-gray hover:text-apple-blue transition-colors"><Twitter size={20} /></a>
          <a href="#" className="text-apple-gray hover:text-apple-blue transition-colors"><Instagram size={20} /></a>
          <a href="#" className="text-apple-gray hover:text-apple-blue transition-colors"><Github size={20} /></a>
          <a href="#" className="text-apple-gray hover:text-apple-blue transition-colors"><Mail size={20} /></a>
        </div>
      </div>
    </footer>
  );
};
