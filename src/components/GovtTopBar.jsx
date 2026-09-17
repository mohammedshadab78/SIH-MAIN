import { Globe, PhoneCall, Volume2, Moon, Sun } from 'lucide-react';

export default function GovtTopBar({
  currentLang,
  onLanguageChange,
  fontScale,
  onFontScaleChange,
  highContrast,
  onToggleHighContrast,
  t
}) {
  const languages = [
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'te', label: 'తెలుగు' }
  ];

  return (
    <header className="w-full text-xs select-none">
      {/* Tricolor Header Accent */}
      <div className="tiranga-stripe w-full" />

      {/* Top Utility Row */}
      <div className="bg-slate-800 text-slate-200 border-b border-slate-700 py-1 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2">
        {/* Left: National Identity & Skip link */}
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-100 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t?.common?.govtOfIndia || "भारत सरकार | Government of India"}
          </span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-slate-400 hidden lg:inline">
            Smart India Hackathon 2026 (ID: 26097)
          </span>
        </div>

        {/* Right: Accessibility Controls & Language */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-4">
          {/* Toll Free Helpline */}
          <div className="hidden sm:flex items-center gap-1.5 text-amber-400 font-medium bg-slate-900/60 px-2 py-0.5 rounded border border-amber-500/30">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t?.common?.tollFreeNum || "टोल-फ्री: 1800-123-9626"}</span>
          </div>

          {/* Font Resizer (A- / A / A+) */}
          <div className="flex items-center bg-slate-700/80 rounded px-1 border border-slate-600">
            <button
              onClick={() => onFontScaleChange(Math.max(0.85, fontScale - 0.05))}
              className="px-1.5 py-0.5 hover:text-white font-medium transition-colors"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => onFontScaleChange(1)}
              className="px-1.5 py-0.5 hover:text-white font-medium transition-colors"
              title="Default Font Size"
            >
              A
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => onFontScaleChange(Math.min(1.25, fontScale + 0.05))}
              className="px-1.5 py-0.5 hover:text-white font-medium transition-colors"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={onToggleHighContrast}
            className={`p-1 rounded border transition-colors flex items-center gap-1 ${
              highContrast
                ? 'bg-amber-400 text-black border-amber-300 font-bold'
                : 'bg-slate-700/80 hover:bg-slate-600 text-slate-200 border-slate-600'
            }`}
            title="Toggle High Contrast"
          >
            {highContrast ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{t?.common?.contrast || "कंट्रास्ट"}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-700/80 rounded px-2 py-0.5 border border-slate-600">
            <Globe className="w-3.5 h-3.5 text-slate-300" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-800 text-white">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
