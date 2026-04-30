import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Search, MapPin, TrendingUp, TrendingDown, Clock, Info, Plus, Phone, LayoutGrid, List as ListIcon, X, MessageCircle } from 'lucide-react';
import { MandiPrice } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';

interface CropListing {
  id: string;
  userId: string;
  farmerName: string;
  cropType: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  contact: string;
  createdAt: Timestamp;
}

const samplePrices: MandiPrice[] = [
  { id: '1', crop: 'Wheat (Gandum)', city: 'Multan', price: 3900, unit: '40 KG', trend: 'stable', lastUpdated: '2 hours ago' },
  { id: '2', crop: 'Cotton (Phutti)', city: 'Multan', price: 8500, unit: '40 KG', trend: 'up', lastUpdated: '3 hours ago' },
  { id: '3', crop: 'Rice (Basmati)', city: 'Gujranwala', price: 9000, unit: '40 KG', trend: 'up', lastUpdated: '5 hours ago' },
  { id: '4', crop: 'Corn (Makai)', city: 'Sahiwal', price: 2800, unit: '40 KG', trend: 'stable', lastUpdated: '1 hour ago' },
  { id: '5', crop: 'Sugarcane', city: 'Faisalabad', price: 450, unit: '40 KG', trend: 'stable', lastUpdated: '6 hours ago' },
  { id: '6', crop: 'Wheat', city: 'Lahore', price: 3900, unit: '40 KG', trend: 'stable', lastUpdated: '1 hour ago' },
  { id: '7', crop: 'Rice', city: 'Lahore', price: 9000, unit: '40 KG', trend: 'stable', lastUpdated: '2 hours ago' },
  { id: '8', crop: 'Wheat', city: 'Karachi', price: 4000, unit: '40 KG', trend: 'stable', lastUpdated: '4 hours ago' },
  { id: '9', crop: 'Onion', city: 'Karachi', price: 3200, unit: '40 KG', trend: 'up', lastUpdated: '5 hours ago' },
  { id: '10', crop: 'Potato', city: 'Peshawar', price: 2100, unit: '40 KG', trend: 'stable', lastUpdated: '3 hours ago' },
  { id: '11', crop: 'Wheat', city: 'Sargodha', price: 3900, unit: '40 KG', trend: 'stable', lastUpdated: '2 hours ago' },
  { id: '12', crop: 'Kinnow', city: 'Sargodha', price: 2500, unit: '100 PCS', trend: 'up', lastUpdated: '1 hour ago' },
];

const PAKISTAN_CITIES = [
  { name: 'Multan' }, { name: 'Lahore' }, { name: 'Karachi' }, { name: 'Faisalabad' }, { name: 'Rawalpindi' },
  { name: 'Gujranwala' }, { name: 'Peshawar' }, { name: 'Islamabad' }, { name: 'Quetta' }, { name: 'Sargodha' },
  { name: 'Bahawalpur' }, { name: 'Sialkot' }, { name: 'Sukkur' }, { name: 'Larkana' }, { name: 'Sheikhupura' },
  { name: 'Rahim Yar Khan' }, { name: 'Jhang' }, { name: 'Dera Ghazi Khan' }, { name: 'Gujrat' }, { name: 'Sahiwal' },
  { name: 'Wah Cantonment' }, { name: 'Mardan' }, { name: 'Kasur' }, { name: 'Okara' }, { name: 'Mingora' },
  { name: 'Nawabshah' }, { name: 'Chiniot' }, { name: 'Kotli' }, { name: 'Muzaffarabad' }, { name: 'Mirpur' },
  { name: 'Gilgit' }, { name: 'Skardu' }, { name: 'Gwadar' }, { name: 'Abbottabad' }, { name: 'Mansehra' },
  { name: 'Kohat' }, { name: 'Bannu' }, { name: 'Turbat' }, { name: 'Khuzdar' }, { name: 'Jacobabad' },
  { name: 'Shikarpur' }, { name: 'Attock' }, { name: 'Tando Adam' }, { name: 'Tando Allahyar' }, { name: 'Mianwali' },
  { name: 'Murree' }
];

export default function MandiPrices() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'prices' | 'marketplace'>('prices');
  const [showListingForm, setShowListingForm] = useState(false);
  const [listings, setListings] = useState<CropListing[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    unit: 'Maund (40kg)',
    price: '',
    location: '',
    contact: ''
  });

  const isUrdu = i18n.language === 'ur';

  useEffect(() => {
    if (activeTab === 'marketplace') {
      const q = query(collection(db, 'cropListings'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CropListing));
        setListings(docs);
      });
      return () => unsubscribe();
    }
  }, [activeTab]);

  const handlePostListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'cropListings'), {
        userId: auth.currentUser.uid,
        farmerName: auth.currentUser.displayName || 'Farmer',
        cropType: formData.cropType,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        price: parseFloat(formData.price),
        location: formData.location,
        contact: formData.contact,
        createdAt: serverTimestamp()
      });
      setShowListingForm(false);
      setFormData({ cropType: '', quantity: '', unit: 'Maund (40kg)', price: '', location: '', contact: '' });
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPrices = samplePrices.filter(p => {
    const matchesSearch = p.crop.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || p.city === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         l.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || l.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  const filteredCities = PAKISTAN_CITIES.filter(city => 
    city.name.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col gap-6">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-black text-brand-secondary tracking-tight">{t('mandiTrends')}</h2>
          <p className="text-brand-earth/50 text-xs font-bold uppercase tracking-widest mt-1">{t('khadSprayRates')}</p>
        </div>
        <div className="bg-brand-primary text-white p-3 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center">
          <BarChart3 size={24} />
        </div>
      </header>

      {/* Modern Tabs */}
      <div className="flex bg-brand-light p-1 rounded-2xl">
        <button 
          onClick={() => setActiveTab('prices')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'prices' ? 'bg-white text-brand-primary shadow-sm' : 'text-brand-earth/40'}`}
        >
          <TrendingUp size={18} />
          {t('mandiPrices')}
        </button>
        <button 
          onClick={() => setActiveTab('marketplace')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'marketplace' ? 'bg-brand-primary text-white shadow-lg shadow-emerald-100' : 'text-brand-earth/40'}`}
        >
          <LayoutGrid size={18} />
          {t('marketplace')}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'prices' ? (
          <motion.div 
            key="prices-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-primary text-white p-5 rounded-[2rem] shadow-xl relative overflow-hidden">
                <p className="text-[10px] text-emerald-100 font-black uppercase tracking-widest mb-1 relative z-10">Top Gainer</p>
                <div className="flex items-center gap-2 relative z-10">
                  <h4 className="font-black text-lg italic">Wheat</h4>
                  <span className="text-[10px] bg-white text-emerald-600 px-2 py-0.5 rounded-lg font-black">+5%</span>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full translate-x-1/4 -translate-y-1/4" />
              </div>
              <div className="bg-white border-2 border-brand-light p-5 rounded-[2rem] shadow-sm">
                <p className="text-[10px] text-brand-earth/40 font-black uppercase tracking-widest mb-1">Sentiment</p>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-brand-secondary">Bullish</h4>
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-earth/40 group-focus-within:text-brand-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder={selectedLocation ? `Search harvested in ${selectedLocation}...` : "Search crop or city..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border-2 border-brand-light rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-brand-secondary focus:border-brand-primary outline-none transition-all shadow-sm"
                />
              </div>
              <button 
                onClick={() => setShowLocationPicker(true)}
                className={`border-2 w-14 rounded-2xl flex items-center justify-center shadow-sm transition-all ${selectedLocation ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white border-brand-light text-brand-earth/40'}`}
              >
                <MapPin size={22} />
              </button>
            </div>

            {selectedLocation && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest">Showing:</span>
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-2 hover:bg-brand-primary/20 transition-all border border-brand-primary/20"
                >
                  {selectedLocation}
                  <X size={10} strokeWidth={3} />
                </button>
              </div>
            )}

            {/* Quick City Scroll */}
            {!selectedLocation && (
              <div className="flex flex-col gap-2">
                <h4 className="text-[9px] font-black text-brand-earth/40 uppercase tracking-[0.2em] ml-1">{t('browseByCity')}</h4>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 custom-scrollbar scrollbar-hide">
                  {['Multan', 'Lahore', 'Karachi', 'Faisalabad', 'Gujranwala', 'Peshawar', 'Sargodha', 'Sahiwal'].map(city => (
                    <button 
                      key={city}
                      onClick={() => setSelectedLocation(city)}
                      className="bg-white border-2 border-brand-light px-4 py-2 rounded-2xl whitespace-nowrap text-xs font-black text-brand-secondary hover:border-brand-primary/20 transition-all shadow-sm"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Table */}
            <div className="flex flex-col gap-3">
              {filteredPrices.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.id} 
                  className="bg-white border-2 border-brand-light p-4 rounded-[1.8rem] flex items-center justify-between group hover:border-brand-primary/20 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-light w-12 h-12 rounded-2xl flex items-center justify-center text-brand-earth/40 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-brand-secondary text-sm leading-tight group-hover:text-brand-primary transition-colors">{item.crop}</h4>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-brand-earth/30 mt-1 uppercase tracking-tighter">
                        <MapPin size={10} />
                        <span>{item.city}</span>
                        <span className="mx-1 opacity-30">•</span>
                        <Clock size={10} />
                        <span>{item.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-brand-secondary text-lg">
                      <span className="text-[10px] font-bold text-brand-earth/40 mr-1 italic underline decoration-brand-primary decoration-2 underline-offset-2">PKR</span>
                      {item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <span className="text-[8px] text-brand-earth/30 font-black uppercase tracking-widest">/ {item.unit}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-brand-light border-2 border-brand-border/30 p-5 rounded-[2rem] flex gap-4">
              <Info size={24} className="text-brand-primary shrink-0" />
              <p className="text-[11px] text-brand-earth/60 font-medium leading-relaxed italic">
                Prices are gathered from official market sources. Actual trade prices may vary based on quality, volume, and local demand.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="marketplace-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            {/* Marketplace Actions */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-brand-secondary">Available Harvests</h3>
                  {selectedLocation && (
                    <span className="text-[10px] font-black text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full border border-brand-primary/10">
                      In {selectedLocation}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-brand-earth/40 font-bold uppercase tracking-[0.2em]">Buy directly from farmers</p>
              </div>
              <button 
                onClick={() => setShowListingForm(true)}
                className="bg-brand-primary text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-black text-sm shadow-lg shadow-emerald-100 hover:scale-105 transition-transform"
              >
                <Plus size={18} strokeWidth={3} />
                Sell Crop
              </button>
            </div>

            {/* Active Listings */}
            <div className="flex flex-col gap-4">
              {listings.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-brand-light p-12 rounded-[2.5rem] flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-earth/20">
                    <LayoutGrid size={32} />
                  </div>
                  <div>
                    <h4 className="font-black text-brand-secondary">No Listings Yet</h4>
                    <p className="text-xs text-brand-earth/40 font-medium mt-1">Be the first to list your harvest!</p>
                  </div>
                </div>
              ) : (
                filteredListings.map((item) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={item.id}
                    className="bg-white border-2 border-brand-light p-5 rounded-[2rem] shadow-sm hover:border-brand-primary/20 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-brand-primary font-black group-hover:bg-brand-primary group-hover:text-white transition-all">
                          {item.cropType.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-brand-secondary group-hover:text-brand-primary transition-colors">{item.cropType}</h4>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-brand-earth/40 uppercase tracking-tight">
                            <MapPin size={10} />
                            {item.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-brand-earth/30 uppercase tracking-widest leading-none mb-1">{t('askingPrice')}</p>
                        <p className="text-xl font-black text-brand-secondary italic">
                          <span className="text-[10px] mr-1">Rs.</span>
                          {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-brand-light rounded-2xl p-4 flex justify-between items-center mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-brand-earth/30 uppercase tracking-widest">Quantity</span>
                        <span className="font-black text-brand-secondary text-sm">{item.quantity} {item.unit}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] font-black text-brand-earth/30 uppercase tracking-widest">Seller</span>
                        <span className="font-black text-brand-secondary text-sm">{item.farmerName}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <a 
                        href={`tel:${item.contact}`}
                        className="flex-1 bg-brand-light text-brand-secondary py-3 rounded-xl flex items-center justify-center gap-2 font-black text-sm hover:bg-brand-border transition-all"
                      >
                        <Phone size={16} strokeWidth={3} />
                        Call
                      </a>
                      <button 
                        onClick={() => navigate(`/chat/${item.userId}`)}
                        disabled={item.userId === auth.currentUser?.uid}
                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-black text-sm transition-all ${item.userId === auth.currentUser?.uid ? 'bg-brand-light text-brand-earth/20 cursor-not-allowed' : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white'}`}
                      >
                        <MessageCircle size={16} strokeWidth={3} />
                        Chat
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listing Form Modal */}
      <AnimatePresence>
        {showListingForm && (
          <div className="fixed inset-0 z-[1000] flex items-end justify-center p-4 bg-brand-secondary/40 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-white rounded-t-[3rem] p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowListingForm(false)}
                className="absolute top-6 right-6 p-2 text-brand-earth/30 hover:text-rose-500 transition-colors"
              >
                <X size={24} strokeWidth={3} />
              </button>

              <h3 className="text-2xl font-black text-brand-secondary tracking-tight mb-2">Sell Your Harvest</h3>
              <p className="text-xs text-brand-earth/40 font-bold uppercase tracking-widest mb-8">List your crop for thousands of buyers</p>

              <form onSubmit={handlePostListing} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest ml-1">Crop Type</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Wheat"
                      value={formData.cropType}
                      onChange={(e) => setFormData({...formData, cropType: e.target.value})}
                      className="bg-brand-light border-2 border-transparent p-4 rounded-2xl font-bold text-brand-secondary outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest ml-1">Quantity</label>
                    <input 
                      type="number" 
                      required
                      placeholder="100"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="bg-brand-light border-2 border-transparent p-4 rounded-2xl font-bold text-brand-secondary outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest ml-1">Price / Unit</label>
                    <input 
                      type="number" 
                      required
                      placeholder="4500"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="bg-brand-light border-2 border-transparent p-4 rounded-2xl font-bold text-brand-secondary outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest ml-1">Unit</label>
                    <select 
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      className="bg-brand-light border-2 border-transparent p-4 rounded-2xl font-bold text-brand-secondary outline-none focus:border-brand-primary transition-all"
                    >
                      <option>Maund (40kg)</option>
                      <option>KG</option>
                      <option>Ton</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest ml-1">Your Location</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Sargodha, Punjab"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-brand-light border-2 border-transparent p-4 rounded-2xl font-bold text-brand-secondary outline-none focus:border-brand-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest ml-1">Mobile Number</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="0300 1234567"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    className="bg-brand-light border-2 border-transparent p-4 rounded-2xl font-bold text-brand-secondary outline-none focus:border-brand-primary transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-brand-primary text-white py-5 rounded-[2rem] font-black text-lg mt-4 shadow-xl shadow-emerald-100 transition-all uppercase tracking-widest ${isSubmitting ? 'opacity-50 scale-95' : 'hover:scale-105 active:scale-95'}`}
                >
                  {isSubmitting ? 'Posting...' : 'Post Listing'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Location Picker Modal */}
      <AnimatePresence>
        {showLocationPicker && (
          <div className="fixed inset-0 z-[2000] flex items-end justify-center p-4 bg-brand-secondary/40 backdrop-blur-sm">
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

              <h3 className="text-2xl font-black text-brand-secondary tracking-tight mb-2">Check Local Rates</h3>
              <p className="text-xs text-brand-earth/40 font-bold uppercase tracking-widest mb-6">Select a city to filter Mandi results</p>

              <div className="relative mb-6">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-earth/30" />
                <input 
                  type="text" 
                  placeholder="Search city/mandi..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full bg-brand-light border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl font-bold text-brand-secondary focus:border-brand-primary outline-none transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-2 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => {
                        setSelectedLocation(city.name);
                        setShowLocationPicker(false);
                        setLocationSearch('');
                      }}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                        selectedLocation === city.name 
                          ? 'bg-brand-primary text-white shadow-lg shadow-emerald-100' 
                          : 'bg-brand-light text-brand-secondary hover:bg-brand-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className={selectedLocation === city.name ? 'text-white' : 'text-brand-primary'} />
                        <span className="font-bold">{city.name}</span>
                      </div>
                      {selectedLocation === city.name && (
                        <div className="bg-white/20 p-1 rounded-full text-white">
                          <TrendingUp size={14} strokeWidth={4} />
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-earth/20">
                      <Search size={32} />
                    </div>
                    <div>
                      <p className="font-black text-brand-secondary">No Mandi found</p>
                      <p className="text-xs text-brand-earth/40">Try searching for a major district</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
