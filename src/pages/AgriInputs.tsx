import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Droplets, 
  Leaf, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Info,
  ChevronRight,
  Filter,
  MapPin,
  X,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const inputRates = [
  { 
    id: '1', 
    name: 'Sona Urea', 
    company: 'FFC', 
    price: 4800, 
    prevPrice: 4650, 
    trend: 'up', 
    category: 'Fertilizer',
    details: {
      dosage: "Wheat: 1.5 bags/acre. Cotton: 2 bags/acre. Rice: 1.25 bags/acre. Use 20% more in sandy soils.",
      timing: "Apply 1/3 at sowing, remaining during 1st and 2nd irrigation cycles.",
      impact: "Provides 46% Nitrogen for rapid vegetative growth and deep green leaf color.",
      soilCompatibility: "Suitable for all soils; leaching risk high in sandy soil - apply in split doses."
    }
  },
  { 
    id: '2', 
    name: 'DAP', 
    company: 'Engro', 
    price: 13000, 
    prevPrice: 12800, 
    trend: 'up', 
    category: 'Fertilizer',
    details: {
      dosage: "Wheat/Rice: 1 bag/acre. Potato/Maize: 1.5 bags/acre. Best for loamy/clay soils.",
      timing: "Apply as basal dose during land preparation or exactly at the time of sowing.",
      impact: "Primary source of Phosphorus (46%) and Nitrogen (18%) for strong root development.",
      soilCompatibility: "Essential for alkaline soils of Pakistan; requires moisture for optimal solubility."
    }
  },
  { 
    id: '3', 
    name: 'SOP', 
    company: 'Engro', 
    price: 11500, 
    prevPrice: 11500, 
    trend: 'stable', 
    category: 'Fertilizer',
    details: {
      dosage: "Fruits/Vegetables: 1.5 bags/acre. Wheat/Rice: 0.5-1 bag during grain filling.",
      timing: "Best applied at flowering stage or when fruit starts to set for maximum quality.",
      impact: "Provides Potassium (50%) and Sulphur (18%) for grain weight and disease resistance.",
      soilCompatibility: "Ideal for saline soils; improves plant water use efficiency in dry areas."
    }
  },
  { 
    id: '4', 
    name: 'Confidor', 
    company: 'Bayer', 
    price: 1850, 
    prevPrice: 1750, 
    trend: 'up', 
    category: 'Pesticide',
    details: {
      targetPests: "Whitefly, Jassid, Thrips",
      method: "Foliar spray with high-pressure nozzle",
      precautions: "Wear mask and gloves. Avoid spraying in high winds.",
      safetyPeriod: "Do not harvest for 7 days after spray",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  },
  { 
    id: '5', 
    name: 'Belt', 
    company: 'Bayer', 
    price: 2900, 
    prevPrice: 3100, 
    trend: 'down', 
    category: 'Pesticide', 
    details: {
      targetPests: "American Bollworm, Armyworm",
      method: "Spray when pest population reaches economic threshold",
      precautions: "Highly toxic. Keep away from children and livestock.",
      safetyPeriod: "14 days wait before harvest",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  },
  { 
    id: '6', 
    name: 'Mortein Agri', 
    company: 'Syngenta', 
    price: 4200, 
    prevPrice: 4200, 
    trend: 'stable', 
    category: 'Pesticide', 
    details: {
      targetPests: "Aphids, Mites",
      method: "Uniform coverage of leaves is essential",
      precautions: "Spray in early morning or late evening.",
      safetyPeriod: "10 days safety interval",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  }
,
];

export default function AgriInputs() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Fertilizer' | 'Pesticide'>('All');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  const filteredRates = inputRates.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 flex flex-col gap-6 pb-24">
      <header>
        <h2 className="text-3xl font-black text-brand-secondary tracking-tighter italic">{t('agriInputs')}</h2>
        <p className="text-brand-earth/50 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{t('khadSprayRates')}</p>
      </header>

      {/* Market Sentiment */}
      <section className="bg-brand-secondary text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <TrendingUp size={16} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{t('marketStatus')}</span>
          </div>
          <h3 className="text-xl font-black mb-1">{t('ureaRising')}</h3>
          <p className="text-brand-light/60 text-xs font-medium leading-relaxed">
            {t('ureaDesc')}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
      </section>

      {/* Category Toggles */}
      <div className="flex gap-2">
        {['All', 'Fertilizer', 'Pesticide'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as any)}
            className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all border-2 ${
              activeCategory === cat 
                ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-emerald-100' 
                : 'bg-white border-brand-light text-brand-earth/40 hover:border-brand-primary/20'
            }`}
          >
            {cat === 'Fertilizer' ? t('fertilizer') : cat === 'Pesticide' ? t('pesticide') : t('all')}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative group">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-earth/40 group-focus-within:text-brand-primary transition-colors" />
        <input 
          type="text" 
          placeholder={t('searchProduct')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border-2 border-brand-light rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-brand-secondary focus:border-brand-primary outline-none transition-all shadow-sm"
        />
      </div>

      {/* Rates List */}
      <div className="flex flex-col gap-4">
        {filteredRates.map((item) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            key={item.id}
            onClick={() => setSelectedProduct(item)}
            className="bg-white border-2 border-brand-light p-4 rounded-[1.8rem] flex items-center justify-between group hover:border-brand-primary/20 transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                item.category === 'Fertilizer' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {item.category === 'Fertilizer' ? <Leaf size={22} strokeWidth={2.5} /> : <Droplets size={22} strokeWidth={2.5} />}
              </div>
              <div>
                <h4 className="font-black text-brand-secondary text-base group-hover:text-brand-primary transition-colors">{item.name}</h4>
                <p className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest">{item.company}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1 mb-0.5">
                {item.trend === 'up' ? <TrendingUp size={12} className="text-rose-500" strokeWidth={3} /> : 
                 item.trend === 'down' ? <TrendingDown size={12} className="text-emerald-500" strokeWidth={3} /> : null}
                <span className="text-lg font-black text-brand-secondary italic">
                  <span className="text-[10px] font-black not-italic mr-0.5">Rs.</span>
                  {item.price.toLocaleString()}
                </span>
              </div>
              <p className={`text-[9px] font-black uppercase tracking-tighter ${
                item.trend === 'up' ? 'text-rose-500' : item.trend === 'down' ? 'text-emerald-500' : 'text-brand-earth/30'
              }`}>
                {item.trend === 'up' ? 'Increased' : item.trend === 'down' ? 'Decreased' : 'Stable'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[2000] flex items-end justify-center p-4 bg-brand-secondary/40 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-white rounded-t-[3rem] p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 p-2 text-brand-earth/30 hover:text-rose-500 transition-colors"
              >
                <X size={24} strokeWidth={3} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl ${
                  selectedProduct.category === 'Fertilizer' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {selectedProduct.category === 'Fertilizer' ? <Leaf size={28} strokeWidth={3} /> : <Droplets size={28} strokeWidth={3} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-brand-secondary tracking-tight">{selectedProduct.name}</h3>
                  <p className="text-xs text-brand-earth/40 font-bold uppercase tracking-widest">{selectedProduct.company} • {selectedProduct.category}</p>
                </div>
              </div>

              <div className="bg-brand-light/50 rounded-[2rem] p-6 flex flex-col gap-5 border border-brand-light mb-8">
                {selectedProduct.category === 'Fertilizer' ? (
                  <>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest">{t('recommendedDosage')}</span>
                      <p className="font-bold text-brand-secondary">{selectedProduct.details.dosage}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest">{t('applicationTiming')}</span>
                      <p className="font-bold text-brand-secondary">{selectedProduct.details.timing}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest">{t('soilNutrientImpact')}</span>
                      <p className="font-bold text-brand-secondary italic">{selectedProduct.details.impact}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest">{t('soilCompatibility')}</span>
                      <p className="font-bold text-brand-secondary">{selectedProduct.details.soilCompatibility}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest">{t('targetPests')}</span>
                      <p className="font-bold text-brand-secondary">{selectedProduct.details.targetPests}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest">{t('applicationMethod')}</span>
                      <p className="font-bold text-brand-secondary">{selectedProduct.details.method}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{t('safetyPrecautions')}</span>
                      <p className="font-bold text-brand-secondary italic">{selectedProduct.details.precautions}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest">{t('safetyPeriod')}</span>
                      <p className="font-bold text-brand-secondary">{selectedProduct.details.safetyPeriod}</p>
                    </div>
                  </>
                )}
              </div>

              {selectedProduct.category === 'Pesticide' && selectedProduct.details.videoUrl && (
                <button 
                  onClick={() => setShowVideo(true)}
                  className="w-full mb-8 bg-brand-secondary text-white py-4 rounded-[1.8rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-slate-200 active:scale-95 transition-all"
                >
                  <PlayCircle size={20} strokeWidth={3} />
                  {t('watchDemo')}
                </button>
              )}

              <div className="bg-brand-primary/10 p-5 rounded-3xl border border-brand-primary/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">{t('currentMarketPrice')}</p>
                  <p className="text-2xl font-black text-brand-primary tracking-tight">Rs. {selectedProduct.price.toLocaleString()}</p>
                </div>
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase ${
                  selectedProduct.trend === 'up' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {selectedProduct.trend === 'up' ? t('rising') : t('dropping')}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && selectedProduct && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-brand-secondary/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl bg-black rounded-[2rem] overflow-hidden shadow-2xl relative aspect-video"
            >
              <button 
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </button>
              <iframe 
                src={selectedProduct.details.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Advisory Banner */}
      <div className="bg-brand-light p-5 rounded-[2.2rem] border-2 border-brand-border flex items-start gap-4">
        <div className="bg-brand-primary/10 p-2 rounded-xl text-brand-primary">
          <AlertCircle size={20} strokeWidth={3} />
        </div>
        <div>
          <h4 className="font-black text-brand-secondary text-sm">{t('noticeForFarmers')}</h4>
          <p className="text-xs text-brand-earth/60 font-medium leading-relaxed mt-1">
            {t('advisoryDesc')}
          </p>
        </div>
      </div>
    </div>
  );
}
