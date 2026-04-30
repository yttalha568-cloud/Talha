import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, ChevronRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Auth({ onLogin }: { onLogin: () => void }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ur' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.setAttribute('dir', newLang === 'ur' ? 'rtl' : 'ltr');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
    navigate('/');
  };

  return (
    <div className={`min-h-screen bg-background max-w-md mx-auto flex flex-col ${i18n.language === 'ur' ? 'urdu-text' : ''}`}>
      {/* Visual Header - Natural Tones Style */}
      <div className="relative h-72 bg-brand-primary overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-light rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-6"
          >
            <span className="text-4xl font-black text-brand-primary italic">FK</span>
          </motion.div>
          <h1 className="text-white text-3xl font-black tracking-tighter uppercase italic">{t('appName')}</h1>
          <p className="text-brand-light/70 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Farmer Helper Pakistan</p>
        </div>

        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl text-white flex items-center justify-center border border-white/20 font-black text-xs hover:bg-white/20 transition-all"
        >
          {i18n.language === 'en' ? 'UR' : 'EN'}
        </button>
      </div>

      <div className="flex-1 px-8 pt-12 pb-10 flex flex-col gap-10">
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="text-3xl font-black text-brand-secondary tracking-tight">{t('login')}</h2>
            <p className="text-brand-earth/60 text-base mt-2 font-medium italic">Hello farmer! Enter your mobile number to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center text-brand-earth/40 group-focus-within:text-brand-primary transition-colors">
                <Phone size={20} strokeWidth={2.5} />
              </div>
              <span className="absolute inset-y-0 left-16 flex items-center text-brand-earth/40 font-black border-r border-brand-light pr-4 transition-colors group-focus-within:text-brand-primary">+92</span>
              <input 
                type="tel" 
                placeholder="300 1234567"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-white border-2 border-brand-light rounded-[1.5rem] py-5 pl-28 pr-6 text-brand-secondary font-black text-lg focus:border-brand-primary outline-none transition-all shadow-sm"
              />
            </div>

            <button 
              type="submit"
              className="bg-brand-primary text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 transition-transform active:scale-95 uppercase tracking-widest"
            >
              {t('login')}
              <ChevronRight size={22} strokeWidth={3} />
            </button>
          </form>

          <div className="relative h-px bg-brand-border/40 my-2">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-6 text-[10px] text-brand-earth/30 font-black uppercase tracking-[0.2em]">Social Login</span>
          </div>

          <button className="flex items-center justify-center gap-4 py-5 bg-white border-2 border-brand-light rounded-[1.5rem] font-black text-brand-secondary hover:bg-brand-light transition-all shadow-sm">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" alt="Google" className="w-6 h-6" />
            Connect with Google
          </button>
        </div>

        <footer className="mt-auto text-center flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-3 py-2 px-6 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            <ShieldCheck size={14} />
            Secure & Trusted
          </div>
          <p className="text-[10px] text-brand-earth/30 font-bold tracking-tight italic">
            © 2026 Farmers Helper Pakistan. Powered by AI Smart Agri.
          </p>
        </footer>
      </div>
    </div>
  );
}
