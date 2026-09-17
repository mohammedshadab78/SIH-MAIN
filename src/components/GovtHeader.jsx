import { Mic, Search, Sparkles } from 'lucide-react';
import AshokaEmblem from './AshokaEmblem';

export default function GovtHeader({
  lang,
  t,
  onOpenVoiceBot,
  searchQuery,
  onSearchChange
}) {
  const isHi = lang === 'hi';

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Official Emblem, Website Logo & Ministry Titles */}
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-start">
          <AshokaEmblem className="text-amber-800 shrink-0" />
          
          {/* Website Logo */}
          <div className="relative group shrink-0 hidden sm:block">
            <img 
              src="/logo.png" 
              alt="GramSaksham Portal Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-emerald-500/70 shadow-sm group-hover:scale-105 transition-transform"
            />
          </div>

          <div className="border-l-2 border-amber-600/40 pl-3">
            <div className="flex items-center gap-1.5 sm:hidden mb-1">
              <img 
                src="/logo.png" 
                alt="GramSaksham Logo" 
                className="w-6 h-6 rounded-full object-cover border border-emerald-500"
              />
              <span className="text-xs font-bold text-gov-blue">{t.portalName}</span>
            </div>
            <h2 className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight leading-tight">
              {t.ministry1}
            </h2>
            <h3 className="text-[11px] sm:text-xs text-slate-600 font-medium leading-tight">
              {t.ministry2}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                SIH 2026
              </span>
              <span className="text-[11px] font-bold text-gov-blue">
                {t.portalName}
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right: Search Bar with Voice Mic & Voice Bot CTA */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
          {/* Quick Voice-Enabled Search Bar */}
          <div className="relative flex-1 md:w-72 lg:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-50 border border-slate-300 rounded-full py-1.5 pl-8 pr-10 text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <button
              onClick={onOpenVoiceBot}
              title={t.micButtonTooltip}
              className="absolute right-1 top-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white p-1 rounded-full shadow-sm hover:scale-105 transition-transform"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse" />
            </button>
          </div>

          {/* Saksham Sathi Voice Bot Trigger CTA */}
          <button
            onClick={onOpenVoiceBot}
            className="flex items-center gap-1.5 bg-gradient-to-r from-gov-navy to-gov-blue hover:from-gov-blue hover:to-blue-800 text-white px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow hover:shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>{t.voiceModal?.title || t.navAssistant}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
