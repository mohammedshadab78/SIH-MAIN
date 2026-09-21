import { useState, useEffect } from 'react';
import GovtTopBar from './components/GovtTopBar';
import GovtHeader from './components/GovtHeader';
import GovtNavbar from './components/GovtNavbar';
import GovtTicker from './components/GovtTicker';
import HeroBanner from './components/HeroBanner';
import PortalOverviewCards from './components/PortalOverviewCards';
import NSQFCatalog from './components/NSQFCatalog';
import GovernmentSchemesSection from './components/GovernmentSchemesSection';
import HyperlocalMap from './components/HyperlocalMap';
import SkillGapAnalyzer from './components/SkillGapAnalyzer';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import GovtFooter from './components/GovtFooter';
import IVRSection from './components/IVRSection';
import { translations } from './data/translations';

import { Mic, WifiOff } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('hi');
  const [activeTab, setActiveTab] = useState('home');
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  // Get active translation dictionary safely (fallback to Hindi)
  const t = translations[lang] || translations.hi;

  // Apply font scale CSS variable
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--font-scale', fontScale);
    }
  }, [fontScale]);

  // Network connectivity listener for low-connectivity rural simulation
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query.trim() && activeTab === 'home') {
      // If user starts searching from home, switch to skilling catalog
      setActiveTab('skilling');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-orange-500 selection:text-white ${highContrast ? 'high-contrast' : 'bg-slate-50'}`}>
      
      {/* Low Connectivity Alert Banner for rural areas */}
      {!isOnline && (
        <div className="bg-red-600 text-white text-xs px-4 py-1.5 flex items-center justify-center gap-2 font-bold sticky top-0 z-50 shadow-md">
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          <span>{t.common?.offlineNotice || "कम कनेक्टिविटी मोड सक्रिय (Offline Cache Active)"}</span>
        </div>
      )}

      {/* 1. Indian Government Top Utility Bar */}
      <GovtTopBar
        currentLang={lang}
        onLanguageChange={setLang}
        fontScale={fontScale}
        onFontScaleChange={setFontScale}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        t={t}
      />

      {/* 2. Official Emblem, Ministry & Search Header */}
      <GovtHeader
        lang={lang}
        t={t}
        onOpenVoiceBot={() => setIsVoiceOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* 3. Official Navy Navigation Bar */}
      <GovtNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenVoiceBot={() => setIsVoiceOpen(true)}
        t={t}
        lang={lang}
      />

      {/* 4. Latest Announcements Marquee Ticker */}
      <GovtTicker t={t} />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* Hero Banner with SIH 2026 Branding */}
            <HeroBanner
              t={t}
              lang={lang}
              onOpenVoiceBot={() => setIsVoiceOpen(true)}
              onNavigate={setActiveTab}
            />

            {/* Dedicated Landing Page Overview & Gateway Links */}
            <PortalOverviewCards
              lang={lang}
              t={t}
              onNavigate={setActiveTab}
              onOpenVoiceBot={() => setIsVoiceOpen(true)}
            />

            {/* IVR Helpline Section */}
            <IVRSection lang={lang} t={t} />
          </div>
        )}


        {activeTab === 'skilling' && (
          <NSQFCatalog
            lang={lang}
            t={t}
            onOpenVoiceBot={() => setIsVoiceOpen(true)}
          />
        )}

        {activeTab === 'schemes' && (
          <GovernmentSchemesSection
            lang={lang}
            t={t}
            onOpenVoiceBot={() => setIsVoiceOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <HyperlocalMap
            lang={lang}
            t={t}
            onOpenVoiceBot={() => setIsVoiceOpen(true)}
          />
        )}

        {activeTab === 'pathway' && (
          <SkillGapAnalyzer
            lang={lang}
            t={t}
            onOpenVoiceBot={() => setIsVoiceOpen(true)}
            onNavigate={setActiveTab}
          />
        )}
      </main>

      {/* 5. Official Indian Government Footer */}
      <GovtFooter lang={lang} t={t} />

      {/* Floating Voice Assistant Action Widget (Saksham Sathi) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsVoiceOpen(true)}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white pl-3.5 pr-4.5 py-2.5 sm:py-3 rounded-full shadow-2xl hover:shadow-orange-600/50 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/80"
          title={t.voiceModal?.title || "Saksham Sathi"}
        >
          {/* Animated pulse ring */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-300" />
          </span>

          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Mic className="w-4 h-4 text-white animate-pulse" />
          </div>

          <div className="text-left leading-tight hidden sm:block">
            <span className="text-[10px] font-medium text-amber-200 block uppercase tracking-wider">
              {t.voiceModal?.subtitle || "Voice AI"}
            </span>
            <span className="text-xs font-extrabold tracking-wide">
              {t.voiceModal?.title || "सक्षम साथी"}
            </span>
          </div>
        </button>
      </div>

      {/* Saksham Sathi Voice Bot Dialog Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        lang={lang}
        t={t}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
