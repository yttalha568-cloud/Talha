import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Upload, AlertCircle, CheckCircle2, RotateCcw, Activity } from 'lucide-react';
import { analyzeCropImage } from '../services/geminiService';
import { DiseaseAnalysis } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function DiseaseDetection() {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const data = await analyzeCropImage(base64Data);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">{t('diseaseDetection')}</h2>
        <p className="text-slate-500 text-sm">{t('uploadLeaf')}</p>
      </header>

      {/* Image Upload Area */}
      <section className="flex flex-col gap-5">
        <div className={`relative border-4 border-dashed rounded-[3rem] overflow-hidden aspect-[4/3] flex items-center justify-center transition-all shadow-inner ${image ? 'border-brand-primary' : 'border-brand-border bg-white'}`}>
          {image ? (
            <img src={image} alt="Crop Leaf" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-brand-border gap-2">
              <Camera size={56} strokeWidth={1.5} />
              <p className="text-sm font-black uppercase tracking-widest">Capture Photo</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {image && !result && !loading && (
          <button
            onClick={startAnalysis}
            className="bg-brand-primary text-white py-5 rounded-[2rem] font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 transition-transform active:scale-95"
          >
            <Activity size={20} />
            Start AI Diagnosis
          </button>
        )}

        {image && !loading && (
          <button
            onClick={() => { setImage(null); setResult(null); }}
            className="text-slate-500 text-sm font-bold flex items-center justify-center gap-1"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        )}
      </section>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="app-card flex flex-col items-center py-12 gap-4"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary"></div>
              <Activity className="absolute inset-0 m-auto text-brand-primary animate-pulse" />
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800 tracking-wide">AI is analyzing...</p>
              <p className="text-xs text-slate-400 mt-1">Detecting disease patterns and treatment</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Section */}
      {result && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col gap-4"
        >
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-3xl flex items-center gap-3">
            <CheckCircle2 size={24} className="text-emerald-500" />
            <div>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Detection Complete</p>
              <h3 className="text-xl font-bold text-slate-800">{result.diseaseName}</h3>
            </div>
          </div>

          <div className="app-card flex flex-col gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Reason</h4>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.reason}</p>
            </div>
            <div className="h-px bg-slate-50" />
            <div>
              <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-1">Treatment</h4>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.treatment}</p>
            </div>
            <div className="h-px bg-slate-50" />
            <div>
              <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Organic Method</h4>
              <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-4 flex flex-col gap-3">
                <div>
                  <span className="text-[10px] font-black text-amber-600/60 uppercase tracking-wider block mb-0.5">{t('method')}</span>
                  <p className="text-sm font-bold text-slate-800">{result.organicTreatment.method}</p>
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-600/60 uppercase tracking-wider block mb-0.5">{t('recommendedDosage')}</span>
                  <p className="text-sm font-bold text-slate-800">{result.organicTreatment.dosage}</p>
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-600/60 uppercase tracking-wider block mb-0.5">{t('applicationMethod')}</span>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed italic">{result.organicTreatment.preparation}</p>
                </div>
              </div>
            </div>
            <div className="h-px bg-slate-50" />
            <div>
              <h4 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">Recommended Pesticide</h4>
              <p className="text-sm text-slate-700 leading-bold font-bold">{result.recommendedPesticide}</p>
            </div>
          </div>

          {result.preventionTips.length > 0 && (
            <div className="app-card bg-slate-800 text-white">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <AlertCircle size={18} className="text-brand-accent" />
                Prevention Tips
              </h4>
              <ul className="flex flex-col gap-2">
                {result.preventionTips.map((tip, i) => (
                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-brand-accent">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-600 text-sm font-medium flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
    </div>
  );
}
