import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Camera, BarChart2, BookOpen, User, Languages } from 'lucide-react';
import { motion } from 'motion/react';

export default function Layout() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ur' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.setAttribute('dir', newLang === 'ur' ? 'rtl' : 'ltr');
  };

  const navItems = [
    { to: '/', icon: Home, label: t('welcome') },
    { to: '/disease-detection', icon: Camera, label: t('diseaseDetection') },
    { to: '/mandi-prices', icon: BarChart2, label: t('mandiPrices') },
    { to: '/schemes', icon: BookOpen, label: t('govSchemes') },
    { to: '/profile', icon: User, label: t('settings') },
  ];

  return (
    <div className={`flex flex-col min-h-screen ${i18n.language === 'ur' ? 'urdu-text' : ''}`}>
      {/* Top Header - Natural Tones Style */}
      <header className="app-header">
        <div className="max-w-md mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] opacity-70 uppercase font-black tracking-widest leading-none mb-1">
              {t('welcome')}
            </span>
            <h1 className="font-bold text-xl leading-none">Ahmed Ali</h1>
          </div>
          <button 
            onClick={toggleLanguage}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs"
          >
            {i18n.language === 'en' ? 'UR' : 'EN'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full pb-28 pt-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="max-w-md mx-auto px-4 h-full flex items-center justify-around pb-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 transition-all ${
                  isActive ? 'text-brand-primary' : 'text-gray-400'
                }`
              }
            >
              <item.icon size={22} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
