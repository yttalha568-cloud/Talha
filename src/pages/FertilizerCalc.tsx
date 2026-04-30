import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, Shovel, Droplets, Info, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

export default function FertilizerCalc() {
  const { t } = useTranslation();
  const [crop, setCrop] = useState('wheat');
  const [landSize, setLandSize] = useState(1);
  const [soilType, setSoilType] = useState('loamy');
  const [showResult, setShowResult] = useState(false);

  const calculate = () => {
    setShowResult(true);
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{t('fertilizerCalc')}</h2>
        <p className="text-slate-500 text-sm italic">Calculate exact bags for your land</p>
      </header>

      <div className="flex flex-col gap-6">
        {/* Crop Selection */}
        <section>
          <label className="text-[10px] font-black text-brand-earth/50 uppercase tracking-[0.2em] block mb-3">Select Crop</label>
          <div className="grid grid-cols-3 gap-3">
            {['wheat', 'cotton', 'rice'].map((c) => (
              <button 
                key={c}
                onClick={() => setCrop(c)}
                className={`py-4 rounded-[1.5rem] font-black text-xs transition-all ${crop === c ? 'bg-brand-primary text-white shadow-lg shadow-emerald-100' : 'bg-white text-brand-earth border-2 border-brand-light'}`}
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        {/* Land Size */}
        <section>
          <label className="text-[10px] font-black text-brand-earth/50 uppercase tracking-[0.2em] block mb-3">Land Size (Acres)</label>
          <div className="flex items-center gap-3">
            <input 
              type="number" 
              value={landSize}
              onChange={(e) => setLandSize(Number(e.target.value))}
              className="flex-1 bg-white border-2 border-brand-light rounded-[1.5rem] py-5 px-8 text-2xl font-black text-brand-secondary outline-none focus:border-brand-primary transition-colors"
            />
            <div className="bg-brand-light px-8 py-5 rounded-[1.5rem] font-black text-brand-secondary">ACRE</div>
          </div>
        </section>

        {/* Soil Type */}
        <section>
          <label className="text-[10px] font-black text-brand-earth/50 uppercase tracking-[0.2em] block mb-3">Soil Type</label>
          <div className="flex gap-2">
            {['clayey', 'loamy', 'sandy'].map((s) => (
              <button 
                key={s}
                onClick={() => setSoilType(s)}
                className={`flex-1 py-4 rounded-[1.5rem] font-black text-xs transition-all ${soilType === s ? 'bg-brand-secondary text-white' : 'bg-white text-brand-earth border-2 border-brand-light'}`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        <button 
          onClick={calculate}
          className="bg-brand-primary text-white py-5 rounded-[2rem] font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 mt-2 transition-transform active:scale-95"
        >
          <Calculator size={20} />
          {t('calculateFertilizer')}
        </button>
      </div>

      {showResult && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col gap-6"
        >
          <div className="bg-brand-secondary text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                <Shovel size={24} className="text-emerald-400" />
                Recommended Mix
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-5 rounded-3xl border border-white/10">
                  <span className="text-[10px] font-black uppercase block opacity-60 tracking-widest mb-2">UREA</span>
                  <p className="text-3xl font-black">{landSize * 2} <span className="text-xs opacity-60">BAGS</span></p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-5 rounded-3xl border border-white/10">
                  <span className="text-[10px] font-black uppercase block opacity-60 tracking-widest mb-2">DAP</span>
                  <p className="text-3xl font-black">{Math.ceil(landSize * 1.5)} <span className="text-xs opacity-60">BAGS</span></p>
                </div>
              </div>
            </div>
            <Calculator className="absolute -right-8 -bottom-8 text-white/5 w-48 h-48 rotate-12" />
          </div>

          <div className="app-card border-brand-border bg-[#FDFEFA]">
            <h4 className="font-black text-brand-secondary mb-3 flex items-center gap-2">
              <Droplets size={20} className="text-blue-400" />
              Watering Schedule
            </h4>
            <p className="text-sm text-brand-earth font-medium leading-relaxed italic">
              "First irrigation is recommended after 20-25 days of sowing. Apply 1 bag of Urea per acre with the first water."
            </p>
          </div>

          <button 
            onClick={() => setShowResult(false)}
            className="text-brand-earth font-black text-[10px] flex items-center justify-center gap-2 py-4 uppercase tracking-[0.2em]"
          >
            <RefreshCcw size={14} />
            Recalculate
          </button>
        </motion.div>
      )}

      {!showResult && (
        <div className="bg-brand-light border-2 border-brand-border p-6 rounded-[2rem] flex gap-3">
          <Info size={24} className="text-brand-primary shrink-0" />
          <p className="text-xs text-brand-earth leading-relaxed font-bold italic">
            Calculations are based on standard agriculture university models for Pakistan. For accurate results, get your soil tested at a local lab.
          </p>
        </div>
      )}
    </div>
  );
}
