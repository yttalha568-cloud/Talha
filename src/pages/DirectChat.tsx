import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Send, PhoneCall, MoreVertical, ChevronLeft, Mic, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  Timestamp,
  updateDoc,
  limit
} from 'firebase/firestore';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
}

interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  updatedAt: Timestamp;
}

export default function DirectChat() {
  const { sellerId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [sellerName, setSellerName] = useState('Farmer');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.currentUser || !sellerId) return;

    const findOrCreateChat = async () => {
      // Find existing chat
      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', auth.currentUser!.uid)
      );
      const snapshot = await getDocs(q);
      const existingChat = snapshot.docs.find(doc => {
        const participants = doc.data().participants as string[];
        return participants.includes(sellerId);
      });

      if (existingChat) {
        setChatId(existingChat.id);
      } else {
        // Create new chat
        const newChat = await addDoc(collection(db, 'chats'), {
          participants: [auth.currentUser!.uid, sellerId],
          updatedAt: serverTimestamp()
        });
        setChatId(newChat.id);
      }

      // Fetch seller info
      const sellerDoc = await getDoc(doc(db, 'users', sellerId));
      if (sellerDoc.exists()) {
        setSellerName(sellerDoc.data().displayName || 'Farmer');
      }
      setLoading(false);
    };

    findOrCreateChat();
  }, [sellerId]);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatId || !auth.currentUser) return;

    const text = input;
    setInput('');

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: auth.currentUser.uid,
        text,
        timestamp: serverTimestamp()
      });

      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: text,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-background">
      {/* Header */}
      <div className="bg-white border-b border-brand-border p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-brand-earth/40">
            <ChevronLeft size={24} />
          </button>
          <div className="relative">
            <div className="w-10 h-10 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-md">
              <User size={20} />
            </div>
          </div>
          <div>
            <h3 className="font-black text-brand-secondary text-sm">{sellerName}</h3>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest leading-none">Online</p>
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

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={msg.id}
            className={`flex ${msg.senderId === auth.currentUser?.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] flex gap-3 ${msg.senderId === auth.currentUser?.uid ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black ${msg.senderId === auth.currentUser?.uid ? 'bg-brand-border text-brand-secondary' : 'bg-brand-primary text-white shadow-sm'}`}>
                {msg.senderId === auth.currentUser?.uid ? 'ME' : 'FK'}
              </div>
              <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed font-medium shadow-sm ${
                msg.senderId === auth.currentUser?.uid 
                  ? 'bg-brand-primary text-white rounded-tr-none' 
                  : 'bg-white text-brand-secondary border border-brand-light rounded-tl-none'
              }`}>
                {msg.text}
                <div className={`text-[8px] mt-2 font-black tracking-widest uppercase ${msg.senderId === auth.currentUser?.uid ? 'text-white/60 text-right' : 'text-brand-earth/30 text-left'}`}>
                  {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-brand-border">
        <form onSubmit={handleSend} className="max-w-md mx-auto flex items-center gap-2">
          <button type="button" className="p-3 text-brand-earth/40 hover:text-brand-primary transition-colors hover:bg-brand-light rounded-2xl">
            <Mic size={22} />
          </button>
          <input 
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-background border-2 border-brand-light rounded-2xl py-3 px-5 text-sm font-bold text-brand-secondary focus:border-brand-primary outline-none transition-all"
          />
          <button 
            type="submit"
            className={`p-3 rounded-2xl transition-all shadow-lg ${input.trim() ? 'bg-brand-primary text-white shadow-emerald-100/50' : 'bg-slate-100 text-slate-400 shadow-none'}`}
          >
            <Send size={22} />
          </button>
        </form>
      </div>
    </div>
  );
}
