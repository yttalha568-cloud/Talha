import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Share2, LogOut, ChevronRight, Settings, Info, CreditCard, X, Save, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isUrdu = i18n.language === 'ur';

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile States
  const [profileData, setProfileData] = useState({
    name: 'Ahmed Khan',
    mobile: '0300 1234567',
    village: 'Chak 124-RB',
    district: 'Faisalabad',
    province: 'Punjab',
    soilType: 'Loamy',
    mainCrop: 'Wheat',
    landSize: '24'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setProfileData(prev => ({ ...prev, ...userDoc.data() }));
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), profileData, { merge: true });
      setActiveModal(null);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const shareAppLink = () => {
    const link = "https://farmer-helper.pk/invite";
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleItemClick = (label: string) => {
    if (label === t('inviteFarmer')) {
      shareAppLink();
    } else if ([t('personalInfo'), t('farmLocation'), t('agriDetails')].includes(label)) {
      setActiveModal(label);
    }
  };

  const sections = [
    {
      title: t('farmerProfile'),
      items: [
        { icon: User, label: t('personalInfo'), sub: `${profileData.name}, ${profileData.mobile}` },
        { icon: MapPin, label: t('farmLocation'), sub: `${profileData.village}, ${profileData.district}` },
        { icon: Settings, label: t('agriDetails'), sub: `${profileData.soilType}, ${profileData.mainCrop}` },
      ]
    },
    {
      title: t('subscription'),
      items: [
        { icon: CreditCard, label: t('premiumMember'), sub: t('premiumBenefit'), accent: true },
      ]
    },
    {
      title: t('settings'),
      items: [
        { icon: Info, label: t('aboutApp'), sub: t('appVersion') },
        { icon: Share2, label: t('inviteFarmer'), sub: copied ? t('linkCopied') : t('shareApp') },
      ]
    }
  ];

  return (
    <div className={`p-4 flex flex-col gap-8 ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Profile Header */}
      <section className="bg-brand-primary text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl flex flex-col items-center text-center">
        <div className="relative z-10">
          <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mb-6 border-4 border-white/20 shadow-xl mx-auto transform -rotate-3">
            <User size={56} className="text-brand-light" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter">{profileData.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-[10px] font-black text-brand-light/60 uppercase tracking-[0.2em]">{t('villageChak')}: {profileData.village}</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Stats Quick Look */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white border-2 border-brand-light p-6 rounded-[2rem] text-center shadow-sm">
          <p className="text-[10px] font-black text-brand-earth/40 uppercase tracking-[0.2em] mb-2">{t('totalLand')}</p>
          <p className="text-2xl font-black text-brand-secondary">{profileData.landSize} <span className="text-xs font-bold text-brand-earth/60 uppercase">{t('acres')}</span></p>
        </div>
        <div className="bg-white border-2 border-brand-light p-6 rounded-[2rem] text-center shadow-sm">
          <p className="text-[10px] font-black text-brand-earth/40 uppercase tracking-[0.2em] mb-2">{t('mainCrop')}</p>
          <p className="text-2xl font-black text-brand-secondary italic">{profileData.mainCrop}</p>
        </div>
      </section>

      {/* Menu Sections */}
      <div className="flex flex-col gap-10">
        {sections.map((section, idx) => (
          <section key={idx} className="flex flex-col gap-4">
            <h3 className="text-[10px] font-black text-brand-earth/40 uppercase tracking-[0.3em] px-4">{section.title}</h3>
            <div className="flex flex-col gap-3">
              {section.items.map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => handleItemClick(item.label)}
                  className={`bg-white border-2 border-brand-light p-4 rounded-[1.8rem] flex items-center justify-between group transition-all active:scale-[0.97] shadow-sm hover:border-brand-primary/20 ${item.accent ? 'border-brand-accent/30 bg-amber-50 shadow-md shadow-amber-100/50' : ''}`}
                >
                  <div className="flex items-center gap-5 text-left">
                    <div className={`p-3.5 rounded-2xl transition-all shadow-sm ${item.accent ? 'bg-brand-accent text-white' : 'bg-brand-background text-brand-earth group-hover:bg-brand-primary group-hover:text-white'}`}>
                      {item.label === 'Invite Fellow Farmer' && copied ? <Check size={22} strokeWidth={2.5} /> : <item.icon size={22} strokeWidth={2.5} />}
                    </div>
                    <div>
                      <h4 className="font-black text-brand-secondary text-sm leading-tight group-hover:text-brand-primary transition-colors">{item.label}</h4>
                      <p className="text-[10px] text-brand-earth/40 font-bold uppercase tracking-tight mt-1">{item.sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-brand-border group-hover:text-brand-primary transition-colors" strokeWidth={3} />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Log Out */}
      <button 
        onClick={() => {
          localStorage.removeItem('isKissanLoggedIn');
          window.location.href = '/auth';
        }}
        className="flex items-center justify-center gap-3 py-6 bg-rose-50 text-rose-600 rounded-[2.2rem] font-black uppercase tracking-[0.2em] text-[10px] border-2 border-rose-100 hover:bg-rose-100 transition-colors mb-12 shadow-sm"
      >
        <LogOut size={20} strokeWidth={3} />
        {t('logout')}
      </button>

      {/* Profile Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[1000] flex items-end justify-center p-4 bg-brand-secondary/40 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-white rounded-t-[3rem] p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 text-brand-earth/30 hover:text-rose-500 transition-colors"
              >
                <X size={24} strokeWidth={3} />
              </button>

              <h3 className="text-2xl font-black text-brand-secondary tracking-tight mb-2">{activeModal}</h3>
              <p className="text-xs text-brand-earth/40 font-bold uppercase tracking-widest mb-8">{t('saveChanges')}</p>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="flex flex-col gap-6">
                {activeModal === t('personalInfo') && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest ml-1">{t('fullName')}</label>
                      <input 
                        type="text" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="bg-brand-light border-2 border-transparent p-4 rounded-2xl font-bold text-brand-secondary outline-none focus:border-brand-primary transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest ml-1">{t('mobileNumber')}</label>
                      <input 
                        type="tel" 
                        value={profileData.mobile}
                        onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
                        className="bg-brand-light border-2 border-transparent p-4 rounded-2xl font-bold text-brand-secondary outline-none focus:border-brand-primary transition-all"
                      />
                    </div>
                  </>
                )}

                {activeModal === t('farmLocation') && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest ml-1">{t('villageChak')}</label>
                      <input 
                        type="text" 
                        value={profileData.village}
                        onChange={(e) => setProfileData({...profileData, village: e.target.value})}
                        className="bg-brand-light border-2 border-transparent p-4 rounded-2xl font-bold text-brand-secondary outline-none focus:border-brand-primary transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest ml-1">{t('district')}</label>
                        <input 
                          type="text" 
                          value={profileData.district}
                          onChange={(e) => setProfileData({...profileData, district: e.target.value})}
                          className="bg-brand-light border-2 border-transparent p-4 rounded-2xl font-bold text-brand-secondary outline-none focus:border-brand-primary transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest ml-1">{t('province')}</label>
                        <input 
                          type="text" 
                          value={profileData.province}
                          onChange={(e) => setProfileData({...profileData, province: e.target.value})}
                          className="bg-brand-light border-2 border-transparent p-4 rounded-2xl font-bold text-brand-secondary outline-none focus:border-brand-primary transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeModal === t('agriDetails') && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest ml-1">{t('soilType')}</label>
                      <select 
                        value={profileData.soilType}
                        onChange={(e) => setProfileData({...profileData, soilType: e.target.value})}
                        className="bg-brand-light border-2 border-transparent p-4 rounded-2xl font-bold text-brand-secondary outline-none focus:border-brand-primary transition-all appearance-none"
                      >
                        <option value="Loamy">{t('loamy')}</option>
                        <option value="Clay">{t('clay')}</option>
                        <option value="Sandy">{t('sandy')}</option>
                        <option value="Silt">{t('silt')}</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest ml-1">{t('mainCrop')}</label>
                        <input 
                          type="text" 
                          value={profileData.mainCrop}
                          onChange={(e) => setProfileData({...profileData, mainCrop: e.target.value})}
                          className="bg-brand-light border-2 border-transparent p-4 rounded-2xl font-bold text-brand-secondary outline-none focus:border-brand-primary transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-brand-earth/40 uppercase tracking-widest ml-1">{t('landSize')}</label>
                        <input 
                          type="number" 
                          value={profileData.landSize}
                          onChange={(e) => setProfileData({...profileData, landSize: e.target.value})}
                          className="bg-brand-light border-2 border-transparent p-4 rounded-2xl font-bold text-brand-secondary outline-none focus:border-brand-primary transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className={`bg-brand-primary text-white py-5 rounded-[2rem] font-black text-lg mt-4 shadow-xl shadow-emerald-100 transition-all uppercase tracking-widest flex items-center justify-center gap-3 ${loading ? 'opacity-50 scale-95' : 'hover:scale-105 active:scale-95'}`}
                >
                  <Save size={20} strokeWidth={3} />
                  {loading ? t('saving') : t('saveChanges')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
