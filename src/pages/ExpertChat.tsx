import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, User, MessageCircle, MoreVertical, PhoneCall, Mic } from 'lucide-react';
import { getExpertHelp } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ExpertChat() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: i18n.language === 'en' 
        ? "Hello! I am Kissan Dost. How can I help you with your crops today?" 
        : "اسلام علیکم! میں کسان دوست ہوں۔ آج میں آپ کی فصلوں کے حوالے سے کیا مدد کر سکتا ہوں؟",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getExpertHelp(input, i18n.language as 'en' | 'ur');
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-background">
      {/* Mini Profile Header - Natural Tones Style */}
      <div className="bg-white border-b border-brand-border p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-md">
              <MessageCircle size={20} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="font-black text-brand-secondary text-sm">Kissan Dost AI</h3>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest leading-none">Always Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-brand-earth/40 hover:text-brand-primary transition-colors">
            <PhoneCall size={20} />
          </button>
          <button className="p-2 text-brand-earth/40">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Chat Space */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black ${msg.sender === 'user' ? 'bg-brand-border text-brand-secondary' : 'bg-brand-primary text-white shadow-sm'}`}>
                {msg.sender === 'user' ? 'ME' : 'KD'}
              </div>
              <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed font-medium shadow-sm transition-all ${
                msg.sender === 'user' 
                  ? 'bg-brand-primary text-white rounded-tr-none' 
                  : 'bg-white text-brand-secondary border border-brand-light rounded-tl-none'
              }`}>
                {msg.text}
                <div className={`text-[8px] mt-2 font-black tracking-widest uppercase ${msg.sender === 'user' ? 'text-white/60 text-right' : 'text-brand-earth/30 text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none border border-brand-light shadow-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-brand-border">
        <form onSubmit={handleSend} className="max-w-md mx-auto flex items-center gap-2">
          <button type="button" className="p-3 text-brand-earth/40 hover:text-brand-primary transition-colors hover:bg-brand-light rounded-2xl">
            <Mic size={22} />
          </button>
          <input 
            type="text" 
            placeholder={i18n.language === 'en' ? "Ask anything..." : "کچھ بھی پوچھیں..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-background border-2 border-brand-light rounded-2xl py-3 px-5 text-sm font-bold text-brand-secondary focus:border-brand-primary outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className={`p-3 rounded-2xl transition-all shadow-lg ${input.trim() && !loading ? 'bg-brand-primary text-white shadow-emerald-100/50' : 'bg-slate-100 text-slate-400 shadow-none'}`}
          >
            <Send size={22} />
          </button>
        </form>
      </div>
    </div>
  );
}
