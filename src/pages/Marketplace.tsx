import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  MapPin, 
  Plus, 
  Phone, 
  MessageCircle, 
  X, 
  Filter,
  LayoutGrid,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';

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
  type?: 'sell' | 'buy';
}

export default function Marketplace() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('sell');
  const [listings, setListings] = useState<CropListing[]>([]);
  const [showListingForm, setShowListingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedListing, setSelectedListing] = useState<CropListing | null>(null);
  
  const [formData, setFormData] = useState({
    type: 'sell' as 'sell' | 'buy',
    cropType: '',
    quantity: '',
    unit: 'Maund (40kg)',
    price: '',
    location: '',
    contact: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'cropListings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CropListing));
      setListings(docs);
    });
    return () => unsubscribe();
  }, []);

  const handlePostListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'cropListings'), {
        userId: auth.currentUser.uid,
        farmerName: auth.currentUser.displayName || (formData.type === 'sell' ? 'Farmer' : 'Buyer'),
        type: formData.type || 'sell',
        cropType: formData.cropType,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        price: parseFloat(formData.price),
        location: formData.location,
        contact: formData.contact,
        createdAt: serverTimestamp()
      });
      setShowListingForm(false);
      setFormData({ type: 'sell', cropType: '', quantity: '', unit: 'Maund (40kg)', price: '', location: '', contact: '' });
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredListings = listings.filter(l => 
    (l.type === activeTab || (!l.type && activeTab === 'sell')) && (
      l.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-4 flex flex-col gap-6 pb-24">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-brand-secondary tracking-tighter italic">{t('marketplace')}</h2>
          <p className="text-brand-earth/50 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{t('buySellDirectly')}</p>
        </div>
        <div className="bg-brand-primary text-white p-3 rounded-2xl shadow-xl shadow-emerald-100">
          <ShoppingBag size={24} />
        </div>
      </header>

      {/* Hero Action Card */}
      <div className="bg-brand-primary text-white p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2">{activeTab === 'sell' ? t('sellYourHarvest') : t('buySellDirectly')}</h3>
          <p className="text-emerald-100 text-xs font-medium leading-relaxed mb-6 opacity-80">
            {activeTab === 'sell' 
              ? t('reachThousands')
              : t('ureaDesc')} 
          </p>
          <button 
            onClick={() => {
              setFormData({ ...formData, type: activeTab });
              setShowListingForm(true);
            }}
            className="bg-white text-brand-primary px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} strokeWidth={3} />
            {activeTab === 'sell' ? t('postNewListing') : t('postBuyRequest')}
          </button>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-10 opacity-20 transform translate-y-1/4">
          <ShoppingBag size={120} />
        </div>
      </div>

      {/* Type Toggles */}
      <div className="flex gap-2">
        <button 
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all border-2 ${
            activeTab === 'sell' 
              ? 'bg-brand-secondary border-brand-secondary text-white shadow-lg' 
              : 'bg-white border-brand-light text-brand-earth/40 hover:border-brand-primary/20'
          }`}
        >
          {t('farmerSelling')}
        </button>
        <button 
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all border-2 ${
            activeTab === 'buy' 
              ? 'bg-brand-secondary border-brand-secondary text-white shadow-lg' 
              : 'bg-white border-brand-light text-brand-earth/40 hover:border-brand-primary/20'
          }`}
        >
          {t('merchantsBuying')}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-earth/40 group-focus-within:text-brand-primary transition-colors" />
          <input 
            type="text" 
            placeholder={t('searchCrops')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-brand-light rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-brand-secondary focus:border-brand-primary outline-none transition-all shadow-sm"
          />
        </div>
        <button className="bg-white border-2 border-brand-light w-14 rounded-2xl text-brand-earth/40 flex items-center justify-center shadow-sm hover:border-brand-primary/20">
          <Filter size={22} />
        </button>
      </div>

      {/* Listings Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="font-black text-brand-secondary uppercase tracking-widest text-[10px]">{t('recentListings')}</h4>
          <span className="text-[10px] font-black text-brand-primary">{filteredListings.length} {t('results')}</span>
        </div>

        {filteredListings.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-brand-light p-12 rounded-[2.5rem] flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-earth/20">
              <LayoutGrid size={32} />
            </div>
            <div>
              <h4 className="font-black text-brand-secondary">No Harvests Found</h4>
              <p className="text-xs text-brand-earth/40 font-medium mt-1">Try broadening your search criteria.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredListings.map((item) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={item.id}
                onClick={() => setSelectedListing(item)}
                className="bg-white border-2 border-brand-light p-5 rounded-[2.2rem] shadow-sm hover:border-brand-primary/20 transition-all group relative overflow-hidden cursor-pointer active:scale-[0.99]"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center text-2xl group-hover:text-white transition-all shadow-sm ${
                      item.type === 'buy' ? 'bg-amber-100 text-amber-600 group-hover:bg-amber-500' : 'bg-brand-light group-hover:bg-brand-primary'
                    }`}>
                      {item.cropType.toLowerCase().includes('wheat') ? '🌾' : 
                       item.cropType.toLowerCase().includes('cotton') ? '☁️' : 
                       item.cropType.toLowerCase().includes('rice') ? '🍚' : '🌱'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-black text-lg transition-colors ${
                          item.type === 'buy' ? 'text-amber-600 group-hover:text-amber-700' : 'text-brand-secondary group-hover:text-brand-primary'
                        }`}>{item.cropType}</h4>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-[0.1em] ${
                          item.type === 'buy' ? 'bg-amber-100 text-amber-600' : 'bg-brand-primary/10 text-brand-primary'
                        }`}>
                          {item.type === 'buy' ? 'Wanted' : 'Selling'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-brand-earth/40 uppercase tracking-tighter">
                        <MapPin size={10} strokeWidth={3} className={item.type === 'buy' ? 'text-amber-500' : 'text-brand-primary'} />
                        {item.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-brand-earth/30 uppercase tracking-widest leading-none mb-1">
                      {item.type === 'buy' ? t('price') : t('askingPrice')}
                    </p>
                    <p className={`text-2xl font-black italic ${item.type === 'buy' ? 'text-amber-600' : 'text-brand-secondary'}`}>
                      <span className="text-xs mr-0.5">Rs.</span>
                      {item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="bg-brand-light/50 backdrop-blur-sm rounded-3xl p-5 flex justify-between items-center mb-6 border border-brand-light">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-brand-earth/40 uppercase tracking-widest mb-1">
                      {item.type === 'buy' ? 'Required Qty' : 'Lot Size'}
                    </span>
                    <span className="font-black text-brand-secondary text-base">{item.quantity} {item.unit}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] font-black text-brand-earth/40 uppercase tracking-widest mb-1">
                      {item.type === 'buy' ? 'Merchant' : 'Farmer'}
                    </span>
                    <span className="font-black text-brand-secondary text-base">{item.farmerName}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a 
                    href={`tel:${item.contact}`}
                    className="flex-1 bg-brand-light text-brand-secondary py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm hover:bg-brand-border transition-all active:scale-95"
                  >
                    <Phone size={18} strokeWidth={3} />
                    {t('call')}
                  </a>
                  <button 
                    onClick={() => navigate(`/chat/${item.userId}`)}
                    disabled={item.userId === auth.currentUser?.uid}
                    className={`flex-[2] py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all active:scale-95 ${
                      item.userId === auth.currentUser?.uid 
                        ? 'bg-brand-light text-brand-earth/20 cursor-not-allowed' 
                        : item.type === 'buy'
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-100 hover:shadow-amber-200'
                          : 'bg-brand-primary text-white shadow-lg shadow-emerald-100 hover:shadow-emerald-200'
                    }`}
                  >
                    <MessageCircle size={18} strokeWidth={3} />
                    {item.type === 'buy' ? t('chatWithBuyer') : t('chatWithSeller')}
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-brand-light flex justify-between items-center">
                  <span className="text-[9px] font-bold text-brand-earth/30">ID: {item.id.slice(0, 8)}</span>
                  <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details <ArrowRight size={10} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

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

              <h3 className="text-2xl font-black text-brand-secondary tracking-tight mb-2">
                {formData.type === 'sell' ? t('sellYourHarvest') : t('postBuyRequest')}
              </h3>
              <p className="text-xs text-brand-earth/40 font-bold uppercase tracking-widest mb-8">
                {formData.type === 'sell' ? t('reachThousands') : t('postBuyRequest')}
              </p>

              <form onSubmit={handlePostListing} className="flex flex-col gap-5">
                <div className="flex gap-2 p-1 bg-brand-light rounded-xl mb-2">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'sell'})}
                    className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${formData.type === 'sell' ? 'bg-white text-brand-primary shadow-sm' : 'text-brand-earth/40'}`}
                  >
                    {t('iWantToSell')}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'buy'})}
                    className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${formData.type === 'buy' ? 'bg-white text-amber-600 shadow-sm' : 'text-brand-earth/40'}`}
                  >
                    {t('iWantToBuy')}
                  </button>
                </div>

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
                  {isSubmitting ? 'Posting...' : 'Post Listing Now'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Listing Details Modal */}
      <AnimatePresence>
        {selectedListing && (
          <div className="fixed inset-0 z-[1100] flex items-end justify-center p-4 bg-brand-secondary/40 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-white rounded-t-[3rem] p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedListing(null)}
                className="absolute top-6 right-6 p-2 text-brand-earth/30 hover:text-rose-500 transition-colors"
              >
                <X size={24} strokeWidth={3} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl ${
                  selectedListing.type === 'buy' ? 'bg-amber-100 text-amber-600' : 'bg-brand-light text-brand-primary'
                }`}>
                  {selectedListing.cropType.toLowerCase().includes('wheat') ? '🌾' : 
                   selectedListing.cropType.toLowerCase().includes('cotton') ? '☁️' : 
                   selectedListing.cropType.toLowerCase().includes('rice') ? '🍚' : '🌱'}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-brand-secondary tracking-tight">{selectedListing.cropType}</h3>
                  <p className="text-xs text-brand-earth/40 font-bold uppercase tracking-widest">
                    {selectedListing.type === 'buy' ? 'Buy Request' : 'Sale Listing'}
                  </p>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="bg-brand-light/50 rounded-[2rem] p-6 border border-brand-light space-y-4">
                  <div className="flex justify-between items-center border-b border-brand-light pb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest">{t('listingId')}</span>
                      <span className="font-mono font-bold text-brand-secondary text-sm">{selectedListing.id}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-b border-brand-light pb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest">
                        {selectedListing.type === 'buy' ? t('buyerName') : t('sellerName')}
                      </span>
                      <span className="font-black text-brand-secondary text-lg">{selectedListing.farmerName}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest">{t('contactNumber')}</span>
                      <span className="font-black text-brand-secondary text-lg">{selectedListing.contact}</span>
                    </div>
                    <a 
                      href={`tel:${selectedListing.contact}`}
                      className="bg-brand-primary text-white p-3 rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-transform"
                    >
                      <Phone size={20} strokeWidth={3} />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-light/30 rounded-2xl p-4 border border-brand-light">
                    <span className="text-[9px] font-black text-brand-earth/40 uppercase tracking-widest block mb-1">{t('quantity')}</span>
                    <span className="font-black text-brand-secondary">{selectedListing.quantity} {selectedListing.unit}</span>
                  </div>
                  <div className="bg-brand-light/30 rounded-2xl p-4 border border-brand-light">
                    <span className="text-[9px] font-black text-brand-earth/40 uppercase tracking-widest block mb-1">{t('price')}</span>
                    <span className="font-black text-brand-secondary">Rs. {selectedListing.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                  {selectedListing.userId === auth.currentUser?.uid ? (
                    <button 
                      disabled
                      className="flex-1 bg-brand-light text-brand-earth/40 py-5 rounded-[2rem] font-black text-lg disabled:opacity-50"
                    >
                      Your Listing
                    </button>
                  ) : (
                    <button 
                      onClick={() => navigate(`/chat/${selectedListing.userId}`)}
                      className="flex-1 bg-brand-secondary text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-slate-200 transition-all active:scale-95"
                    >
                      {selectedListing.type === 'buy' ? t('chatWithBuyer') : t('chatWithSeller')}
                    </button>
                  )}
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
