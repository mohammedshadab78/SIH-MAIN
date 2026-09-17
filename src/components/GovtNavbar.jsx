import { Home, Mic, Award, MapPin, Compass, ShieldCheck } from 'lucide-react';

export default function GovtNavbar({ activeTab, onTabChange, onOpenVoiceBot, t, lang }) {
  const isHi = lang === 'hi';

  const navItems = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'assistant', label: t.navAssistant, icon: Mic, isVoice: true },
    { id: 'skilling', label: t.navSkilling, icon: Award },
    { id: 'schemes', label: t.navSchemes, icon: ShieldCheck },
    { id: 'map', label: t.navMap, icon: MapPin },
    { id: 'pathway', label: t.navPathway, icon: Compass },
  ];

  const handleNavClick = (item) => {
    if (item.isVoice) {
      onOpenVoiceBot();
    } else {
      onTabChange(item.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-gov-navy text-white shadow-md sticky top-0 z-30 select-none border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-1.5 py-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => { onTabChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2 pr-3 border-r border-slate-700/80 mr-1 shrink-0 hover:opacity-90 cursor-pointer"
            title={t.portalName}
          >
            <img src="/logo.png" alt="GramSaksham Logo" className="w-6 h-6 rounded-full border border-amber-400" />
            <span className="text-xs font-bold text-amber-300 hidden md:inline">{t.portalName}</span>
          </button>
          
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-inner font-bold border-b-2 border-amber-300'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-amber-300'
                  } ${item.isVoice ? 'bg-orange-700/80 text-amber-200 font-bold' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${item.isVoice ? 'animate-pulse text-amber-300' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
