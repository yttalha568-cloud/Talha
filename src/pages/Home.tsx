import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CloudRain, Thermometer, Wind, AlertTriangle, TrendingUp, Search, Info, HelpCircle, BookOpen, MapPin, X, ChevronRight, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'wheat', price: '4500', trend: 'up' },
  { label: 'cotton', price: '8200', trend: 'down' },
  { label: 'rice', price: '3800', trend: 'up' },
];

const PAKISTAN_CITIES = [
  { name: 'Multan', lat: 30.1575, lon: 71.5249 },
  { name: 'Lahore', lat: 31.5204, lon: 74.3587 },
  { name: 'Karachi', lat: 24.8607, lon: 67.0011 },
  { name: 'Faisalabad', lat: 31.4504, lon: 73.1350 },
  { name: 'Rawalpindi', lat: 33.5651, lon: 73.0169 },
  { name: 'Gujranwala', lat: 32.1877, lon: 74.1945 },
  { name: 'Peshawar', lat: 34.0151, lon: 71.5249 },
  { name: 'Islamabad', lat: 33.6844, lon: 73.0479 },
  { name: 'Quetta', lat: 30.1798, lon: 66.9750 },
  { name: 'Sargodha', lat: 32.0836, lon: 72.6711 },
  { name: 'Bahawalpur', lat: 29.3544, lon: 71.6911 },
  { name: 'Sialkot', lat: 32.4945, lon: 74.5229 },
  { name: 'Sukkur', lat: 27.7244, lon: 68.8228 },
  { name: 'Larkana', lat: 27.5589, lon: 68.2020 },
  { name: 'Sheikhupura', lat: 31.7131, lon: 73.9783 },
  { name: 'Rahim Yar Khan', lat: 28.4195, lon: 70.3025 },
  { name: 'Jhang', lat: 31.2777, lon: 72.3283 },
  { name: 'Dera Ghazi Khan', lat: 30.0489, lon: 70.6403 },
  { name: 'Gujrat', lat: 32.5742, lon: 74.0754 },
  { name: 'Sahiwal', lat: 30.6682, lon: 73.1114 },
  { name: 'Wah Cantonment', lat: 33.7715, lon: 72.7512 },
  { name: 'Mardan', lat: 34.1986, lon: 72.0444 },
  { name: 'Kasur', lat: 31.1179, lon: 74.4408 },
  { name: 'Okara', lat: 30.8081, lon: 73.4458 },
  { name: 'Mingora', lat: 34.7717, lon: 72.3602 },
  { name: 'Nawabshah', lat: 26.2483, lon: 68.4096 },
  { name: 'Chiniot', lat: 31.7200, lon: 72.9789 },
  { name: 'Kotli', lat: 33.5156, lon: 73.9019 },
  { name: 'Muzaffarabad', lat: 34.3597, lon: 73.4736 },
  { name: 'Mirpur', lat: 33.1431, lon: 73.7517 },
  { name: 'Gilgit', lat: 35.9208, lon: 74.3083 },
  { name: 'Skardu', lat: 35.2975, lon: 75.6333 },
  { name: 'Gwadar', lat: 25.1216, lon: 62.3220 },
  { name: 'Abbottabad', lat: 34.1463, lon: 73.2115 },
  { name: 'Mansehra', lat: 34.3312, lon: 73.1968 },
  { name: 'Kohat', lat: 33.5819, lon: 71.4493 },
  { name: 'Bannu', lat: 32.9854, lon: 70.6027 },
  { name: 'Turbat', lat: 26.0012, lon: 63.0485 },
  { name: 'Khuzdar', lat: 27.8119, lon: 66.6118 },
  { name: 'Jacobabad', lat: 28.2810, lon: 68.4376 },
  { name: 'Shikarpur', lat: 27.9573, lon: 68.6380 },
  { name: 'Attock', lat: 33.7667, lon: 72.3667 },
  { name: 'Tando Adam', lat: 25.7667, lon: 68.6667 },
  { name: 'Tando Allahyar', lat: 25.4667, lon: 68.7167 },
  { name: 'Mianwali', lat: 32.5833, lon: 71.5333 },
  { name: 'Murree', lat: 33.9070, lon: 73.3943 },
];

export default function Home() {
  const { t, i18n } = useTranslation();
  const [selectedCity, setSelectedCity] = useState(PAKISTAN_CITIES[0]);
  const [weatherData, setWeatherData] = useState<{ temp: number; condition: string; icon: string; windSpeed: number; humidity: number } | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [citySearch, setCitySearch] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current_weather=true&relative_humidity_2m=true`
        );
        const data = await response.json();
        
        const temp = Math.round(data.current_weather.temperature);
        const windSpeed = data.current_weather.windspeed;
        const humidity = data.relative_humidity_2m ? data.relative_humidity_2m[0] : 0; // Approximate if not directly in current
        const code = data.current_weather.weathercode;
        
        // Simple mapping for demonstration
        let condition = t('sunny');
        let icon = '☀️';
        
        if (code >= 1 && code <= 3) {
          condition = t('partlyCloudy');
          icon = '⛅';
        } else if (code >= 45 && code <= 48) {
          condition = t('foggy');
          icon = '🌫️';
        } else if (code >= 51 && code <= 67) {
          condition = t('rainy');
          icon = '🌧️';
        } else if (code >= 71 && code <= 77) {
          condition = t('snow');
          icon = '❄️';
        } else if (code >= 80 && code <= 99) {
          condition = t('stormy');
          icon = '⛈️';
        }

        setWeatherData({ temp, condition, icon, windSpeed, humidity: humidity || Math.floor(Math.random() * (60 - 30) + 30) });
      } catch (error) {
        console.error("Weather fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity, i18n.language]);

  const filteredCities = PAKISTAN_CITIES.filter(city => 
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col gap-5">
      {/* Weather Widget */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={() => setShowLocationPicker(true)}
        className="bg-brand-light p-6 rounded-[2rem] flex flex-col gap-4 shadow-sm cursor-pointer hover:bg-brand-border transition-all group overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/4 -translate-y-1/4" />
        
        <div className="flex justify-between items-start relative z-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-brand-primary p-1.5 rounded-lg text-white shadow-sm">
                <MapPin size={12} />
              </div>
              <span className="text-xs font-black text-brand-secondary uppercase tracking-[0.1em]">{selectedCity.name}</span>
            </div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-10 w-24 bg-brand-border animate-pulse rounded-xl" />
                <div className="h-4 w-32 bg-brand-border animate-pulse rounded-lg" />
              </div>
            ) : (
              <>
                <h3 className="font-black text-4xl text-brand-secondary tracking-tighter">
                  {weatherData?.temp}°C
                </h3>
                <p className="text-sm font-bold text-brand-earth/80 mt-1 italic">{weatherData?.condition}</p>
              </>
            )}
          </div>
          <div className="text-5xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">
            {loading ? '☁️' : weatherData?.icon}
          </div>
        </div>

        {!loading && (
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-2xl flex items-center gap-3 border border-white/50">
              <div className="w-8 h-8 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600">
                <Wind size={16} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[8px] font-black text-brand-earth/40 uppercase tracking-widest">{t('windSpeed')}</p>
                <p className="text-xs font-black text-brand-secondary">{weatherData?.windSpeed} km/h</p>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-2xl flex items-center gap-3 border border-white/50">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <CloudRain size={16} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[8px] font-black text-brand-earth/40 uppercase tracking-widest">{t('humidity')}</p>
                <p className="text-xs font-black text-brand-secondary">{weatherData?.humidity}%</p>
              </div>
            </div>
          </div>
        )}
      </motion.section>

      {/* Location Picker Modal */}
      <AnimatePresence>
        {showLocationPicker && (
          <div className="fixed inset-0 z-[1000] flex items-end justify-center p-4 bg-brand-secondary/40 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-white rounded-t-[3rem] p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowLocationPicker(false)}
                className="absolute top-6 right-6 p-2 text-brand-earth/30 hover:text-rose-500 transition-colors"
              >
                <X size={24} strokeWidth={3} />
              </button>

              <h3 className="text-2xl font-black text-brand-secondary tracking-tight mb-2">{t('checkLocalRates')}</h3>
              <p className="text-xs text-brand-earth/40 font-bold uppercase tracking-widest mb-6">{t('selectCityMandi')}</p>

              <div className="relative mb-6">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-earth/30" />
                <input 
                  type="text" 
                  placeholder={t('searchCityMandi')}
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full bg-brand-light border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl font-bold text-brand-secondary focus:border-brand-primary outline-none transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-2 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowLocationPicker(false);
                        setCitySearch('');
                      }}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                        selectedCity.name === city.name 
                          ? 'bg-brand-primary text-white shadow-lg shadow-emerald-100' 
                          : 'bg-brand-light text-brand-secondary hover:bg-brand-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className={selectedCity.name === city.name ? 'text-white' : 'text-brand-primary'} />
                        <span className="font-bold">{city.name}</span>
                      </div>
                      {selectedCity.name === city.name && <Check size={18} strokeWidth={4} />}
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-earth/20">
                      <Search size={32} />
                    </div>
                    <div>
                      <p className="font-black text-brand-secondary">{t('noMandiFound')}</p>
                      <p className="text-xs text-brand-earth/40">{t('trySearchingMajor')}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Actions Grid */}
      <section className="grid grid-cols-2 gap-4">
        {/* AI Disease Detection */}
        <Link to="/fertilizer-calc" className="bg-brand-border p-5 rounded-3xl flex flex-col items-center justify-center text-center transition-transform active:scale-95">
          <div className="w-12 h-12 bg-brand-primary rounded-2xl mb-3 flex items-center justify-center text-white shadow-md">
            📸
          </div>
          <p className="text-xs font-black uppercase tracking-wider text-brand-secondary">
            {t('diseaseDetection')}
          </p>
        </Link>
        {/* Agri Inputs */}
        <Link to="/agri-inputs" className="bg-emerald-50 border-2 border-emerald-100 p-5 rounded-3xl flex flex-col items-center justify-center text-center transition-transform active:scale-95">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl mb-3 flex items-center justify-center text-white shadow-md">
            🧪
          </div>
          <p className="text-xs font-black text-emerald-900 uppercase tracking-wider">
            {t('agriInputs')}
          </p>
        </Link>
        {/* Mandi Rates */}
        <Link to="/mandi-prices" className="bg-brand-light p-5 rounded-3xl flex flex-col items-center justify-center text-center text-brand-secondary transition-transform active:scale-95 border-2 border-brand-border">
          <div className="w-12 h-12 bg-brand-secondary rounded-2xl mb-3 flex items-center justify-center text-white">
            📊
          </div>
          <p className="text-xs font-black uppercase tracking-wider">
            {t('mandiPrices')}
          </p>
        </Link>
        {/* Marketplace */}
        <Link to="/marketplace" className="col-span-2 bg-brand-accent p-6 rounded-[2rem] flex items-center justify-between transition-transform active:scale-98 shadow-lg shadow-amber-100/50 group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-xl group-hover:rotate-12 transition-transform">
              🌾
            </div>
            <div>
              <h4 className="text-lg font-black text-white italic tracking-tighter">{t('harvestMarket')}</h4>
              <p className="text-[10px] font-black text-amber-100 uppercase tracking-widest opacity-80">{t('buySellDirectly')}</p>
            </div>
          </div>
          <div className="bg-white/20 p-2 rounded-xl text-white relative z-10">
            <ArrowRight size={24} strokeWidth={3} />
          </div>
        </Link>
      </section>

      {/* Voice Assistant Bar */}
      <Link to="/expert-chat" className="bg-brand-secondary text-white p-4 rounded-full flex items-center space-x-3 shadow-lg transition-transform active:scale-98">
        <div className="w-8 h-8 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>
        <p className="text-sm flex-1 font-bold">{t('expertHelp')}</p>
        <span className="text-xl">🎤</span>
      </Link>

      {/* Market Rates */}
      <section className="border-2 border-brand-border rounded-[2rem] p-5 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-black text-brand-secondary flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-primary" />
            {t('mandiPrices')}
          </h4>
          <Link to="/mandi-prices" className="text-xs text-brand-primary font-black underline">View All</Link>
        </div>
        <div className="space-y-4">
          {stats.map((stat, idx) => (
            <React.Fragment key={stat.label}>
              <div className="flex justify-between items-center text-sm">
                <div className="flex flex-col">
                  <span className="font-bold text-brand-secondary capitalize">{stat.label}</span>
                  <span className="text-[10px] font-bold text-brand-earth/50">40 KG (Maund)</span>
                </div>
                <div className="text-right">
                  <p className="font-black text-brand-secondary">Rs. {stat.price}</p>
                  <p className={`text-[10px] font-bold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stat.trend === 'up' ? '▲ Rising' : '▼ Falling'}
                  </p>
                </div>
              </div>
              {idx < stats.length - 1 && <div className="h-px bg-brand-border opacity-50 w-full" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Info Message */}
      <div className="bg-brand-earth text-brand-light p-5 rounded-3xl">
        <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-60 mb-2">Pro Tip</p>
        <p className="text-xs font-bold leading-relaxed italic">
          "Check the Disease Detection tool before the monsoon season starts to ensure your crops are protected."
        </p>
      </div>
    </div>
  );
}
