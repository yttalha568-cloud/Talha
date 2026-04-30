import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, ExternalLink, CheckCircle2, Info, Search, Filter } from 'lucide-react';
import { GovernmentScheme } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const schemes: GovernmentScheme[] = [
  {
    id: '1',
    name: 'Kissan Card Program',
    nameUrdu: 'کسان کارڈ پروگرام',
    description: 'Providing direct subsidies for fertilizers, seeds, and pesticides through a digital wallet.',
    descriptionUrdu: 'کھادوں، بیجوں اور کیڑے مار ادویات کے لیے ڈیجیٹل والٹ کے ذریعے براہ راست سبسڈی کی فراہمی۔',
    eligibility: 'Owners of agricultural land registered with the Punjab Land Record Authority.',
    eligibilityUrdu: 'پنجاب لینڈ ریکارڈ اتھارٹی کے ساتھ رجسٹرڈ زرعی اراضی کے مالکان۔',
    benefits: 'Up to Rs. 30,000 subsidy per season, interest-free loans, and insurance.',
    benefitsUrdu: 'فی سیزن 30،000 روپے تک سبسڈی، بلا سود قرضے اور انشورنس۔',
    officialLink: 'https://agripunjab.gov.pk/kissan-card',
    department: 'Punjab Agriculture Department',
    isVerified: true,
    category: 'subsidy'
  },
  {
    id: '2',
    name: 'Solar Tube Well Scheme',
    nameUrdu: 'سولر ٹیوب ویل سکیم',
    description: 'Convert diesel/electric tube wells to solar power to reduce irrigation costs.',
    descriptionUrdu: 'آبپاشی کے اخراجات کو کم کرنے کے لیے ڈیزل/الیکٹرک ٹیوب ویلوں کو شمسی توانائی میں تبدیل کریں۔',
    eligibility: 'Land owners with active irrigation needs and 1-25 acres of land.',
    eligibilityUrdu: 'زمین کے مالکان جن کو آبپاشی کی ضرورت ہے اور 1-25 ایکڑ زمین ہے۔',
    benefits: '60% subsidy on the total cost of high-efficiency solar systems.',
    benefitsUrdu: 'اعلی کارکردگی والے سولر سسٹم کی کل لاگت پر 60 فیصد سبسڈی۔',
    officialLink: 'https://piti.punjab.gov.pk/solar-scheme',
    department: 'Federal Ministry of National Food Security',
    isVerified: true,
    category: 'equipment'
  },
  {
    id: '3',
    name: 'Prime Minister Agriculture Loan',
    nameUrdu: 'وزیراعظم زرعی قرضہ',
    description: 'Interest-free loans for young farmers to start modern farming or livestock business.',
    descriptionUrdu: 'نوجوان کسانوں کے لیے جدید کاشتکاری یا لائیو سٹاک کا کاروبار شروع کرنے کے لیے بلا سود قرضے مجموعی طور پر۔',
    eligibility: 'Youth aged 21-45 with relevant diplomas or experienced in farming.',
    eligibilityUrdu: '21-45 سال کی عمر کے نوجوان جن کے پاس متعلقہ ڈپلومہ یا کاشتکاری کا تجربہ ہے۔',
    benefits: 'Interest-free loans up to Rs. 500,000 for 3 years.',
    benefitsUrdu: '3 سال کے لیے 500،000 روپے تک کے بلا سود قرضے مجموعی طور پر۔',
    officialLink: 'https://ztbl.com.pk/pm-schemes/',
    department: 'Zarai Taraqiati Bank Limited (ZTBL)',
    isVerified: true,
    category: 'loan'
  }
];

export default function GovSchemes() {
  const { t, i18n } = useTranslation();
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);
  const isUrdu = i18n.language === 'ur';

  return (
    <div className="p-4 flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">{t('govSchemes')}</h2>
        <p className="text-slate-500 text-sm">Official updates from Govt of Pakistan</p>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search schemes..."
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-sm"
        />
      </div>

      {/* Schemes List */}
      <div className="flex flex-col gap-5">
        {schemes.map((scheme) => (
          <motion.div 
            key={scheme.id}
            layoutId={scheme.id}
            onClick={() => setSelectedScheme(scheme)}
            className="bg-white border-2 border-brand-light rounded-[2.5rem] p-6 shadow-sm cursor-pointer hover:border-brand-primary/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="bg-brand-light text-brand-primary text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider">
                {scheme.department}
              </span>
              {scheme.isVerified && (
                <div className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 size={12} />
                  <span className="text-[10px] font-black uppercase">Verified</span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-black text-brand-secondary mb-1 group-hover:text-brand-primary transition-colors flex items-center gap-2">
              {isUrdu ? scheme.nameUrdu : scheme.name}
              {scheme.isVerified && (
                <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50" />
              )}
            </h3>
            <p className="text-sm text-brand-earth/70 line-clamp-2 leading-relaxed italic mb-4">
              {isUrdu ? scheme.descriptionUrdu : scheme.description}
            </p>
            
            <div className="mt-2 p-4 bg-background rounded-2xl flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-brand-earth/40 uppercase tracking-widest">Last Date</span>
                <span className="text-xs font-black text-brand-secondary">15 Aug 2026</span>
              </div>
              <button className="bg-brand-primary text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md shadow-emerald-100/50">
                Apply Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Help Tooltip - Natural Tones Style */}
      <div className="mt-2 p-6 bg-brand-earth text-brand-light rounded-[2.5rem] shadow-xl shadow-slate-200">
        <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-60 mb-2">Need Help?</p>
        <p className="text-base font-bold mb-1">Call Helpline: <span className="underline decoration-brand-accent decoration-2 underline-offset-4">0800-29000</span></p>
        <p className="text-xs opacity-80 leading-relaxed italic">Free support for farmers provided by Government of Pakistan.</p>
      </div>

      {/* Scheme Detail Modal */}
      <AnimatePresence>
        {selectedScheme && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScheme(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-md bg-white rounded-t-[40px] p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {isUrdu ? selectedScheme.nameUrdu : selectedScheme.name}
                    </h3>
                    {selectedScheme.isVerified && (
                      <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg border border-emerald-100">
                        <CheckCircle2 size={14} className="fill-emerald-100" />
                        <span className="text-[10px] font-black uppercase">Official</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-brand-primary">
                    <BookOpen size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">{selectedScheme.department}</span>
                  </div>
                </div>

                <div className="h-px bg-slate-50" />

                <div className="flex flex-col gap-4">
                  <section>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      {isUrdu ? selectedScheme.descriptionUrdu : selectedScheme.description}
                    </p>
                  </section>
                  <section>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Eligibility</label>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium capitalize">
                      {isUrdu ? selectedScheme.eligibilityUrdu : selectedScheme.eligibility}
                    </p>
                  </section>
                  <section>
                    <label className="text-[10px] font-bold text-brand-primary uppercase tracking-widest block mb-2">Benefits</label>
                    <p className="text-slate-700 text-sm leading-relaxed font-bold">
                      {isUrdu ? selectedScheme.benefitsUrdu : selectedScheme.benefits}
                    </p>
                  </section>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <a 
                    href={selectedScheme.officialLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                      selectedScheme.isVerified 
                        ? 'bg-emerald-600 text-white shadow-emerald-100' 
                        : 'bg-brand-primary text-white shadow-emerald-100'
                    }`}
                  >
                    {selectedScheme.isVerified && <CheckCircle2 size={18} className="fill-emerald-500/20" />}
                    Apply Now
                    <ExternalLink size={18} />
                  </a>
                  <button className="bg-slate-50 text-slate-600 py-4 rounded-2xl font-bold text-sm">
                    Download PDF Guideline
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
