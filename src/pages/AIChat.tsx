import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { getGeminiResponse } from '../services/gemini';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChat = () => {
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI English teacher. How can I help you today? We can practice conversation, or you can ask me any grammar questions." }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => `${m.role === 'user' ? 'User' : 'Teacher'}: ${m.content}`).join('\n');
      const prompt = `${history}\nUser: ${userMessage}\nTeacher:`;
      const response = await getGeminiResponse(prompt, "You are a friendly and encouraging English teacher. Correct the user's mistakes gently if they make any, and keep the conversation engaging.");
      
      setMessages(prev => [...prev, { role: 'assistant', content: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having some trouble connecting right now." }]);
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
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1600&h=400"
          alt="AI Teacher"
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
              AI Tutor
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10 h-[calc(100vh-200px)] flex flex-col">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-12 shadow-2xl shadow-slate-200 border border-white flex-1 flex flex-col overflow-hidden">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Bot size={24} />
              </div>
              <span className="text-sm font-bold text-purple-600 uppercase tracking-widest">AI Tutor</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Practice Your <span className="text-purple-500 italic serif">English</span></h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">A safe, judgment-free space to improve your conversation skills.</p>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col bg-slate-50 rounded-[2rem] border border-slate-100">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex gap-6 max-w-[80%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                      msg.role === 'user' ? "bg-blue-600" : "bg-slate-900"
                    )}>
                      {msg.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
                    </div>
                    <div className={cn(
                      "p-6 rounded-3xl text-lg leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : "bg-white text-slate-900 rounded-tl-none border border-slate-100"
                    )}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-6"
                >
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-sm">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div className="p-6 rounded-3xl bg-white rounded-tl-none shadow-sm flex items-center gap-3 border border-slate-100">
                    <Loader2 className="animate-spin text-blue-600" size={20} />
                    <span className="text-slate-400 italic">Teacher is thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-white/50 backdrop-blur-md">
              <div className="relative max-w-3xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-8 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-lg leading-relaxed"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white disabled:opacity-50 hover:scale-110 transition-transform shadow-lg shadow-blue-200"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
