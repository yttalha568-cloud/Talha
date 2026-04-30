import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  const steps = [
    {
      title: t('onboarding1Title'),
      description: t('onboarding1Desc'),
      image: "🌾",
      color: "bg-brand-primary"
    },
    {
      title: t('onboarding2Title'),
      description: t('onboarding2Desc'),
      image: "📈",
      color: "bg-brand-accent"
    },
    {
      title: t('onboarding3Title'),
      description: t('onboarding3Desc'),
      image: "🏛️",
      color: "bg-brand-earth"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-[1000] bg-brand-primary flex flex-col items-center justify-center p-8 text-white">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center shadow-2xl mb-8"
        >
          <span className="text-5xl font-black text-brand-primary">FK</span>
        </motion.div>
        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-black tracking-tighter uppercase italic"
        >
          Farmer Helper
        </motion.h1>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "120px" }}
          className="h-1.5 bg-white/20 mt-6 rounded-full overflow-hidden"
        >
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-1/2 h-full bg-white"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[900] bg-background">
      <div className="h-full max-w-md mx-auto flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className={`w-40 h-40 ${steps[currentStep].color} rounded-[3rem] flex items-center justify-center text-6xl shadow-2xl mb-12 transform -rotate-3`}>
                {steps[currentStep].image}
              </div>
              <h2 className="text-4xl font-black text-brand-secondary mb-5 leading-[1.1] tracking-tight">
                {steps[currentStep].title}
              </h2>
              <p className="text-brand-earth/70 text-lg leading-relaxed px-4 italic font-medium">
                "{steps[currentStep].description}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-10 flex flex-col gap-6">
          <div className="flex justify-center gap-3">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-500 ${i === currentStep ? 'w-12 bg-brand-primary' : 'w-3 bg-brand-border'}`} 
              />
            ))}
          </div>
          
          <button 
            onClick={() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
              } else {
                onComplete();
              }
            }}
            className="w-full bg-brand-primary text-white py-6 rounded-[2rem] text-xl font-black flex items-center justify-center gap-2 shadow-2xl shadow-emerald-200 uppercase tracking-widest transition-transform active:scale-95"
          >
            {currentStep === steps.length - 1 ? t('start') : t('next')}
            <ArrowRight size={24} />
          </button>
          
          {currentStep < steps.length - 1 && (
            <button 
              onClick={onComplete}
              className="text-brand-earth/50 font-black text-sm uppercase tracking-widest px-4 py-2"
            >
              {t('skip')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
