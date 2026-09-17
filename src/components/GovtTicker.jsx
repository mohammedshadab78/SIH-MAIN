import { Megaphone, AlertCircle } from 'lucide-react';

export default function GovtTicker({ t }) {
  const items = t.tickerItems || [];
  const loopItems = [...items, ...items];

  return (
    <div className="bg-amber-100/90 border-y border-amber-300 py-1.5 px-4 sm:px-8 text-xs text-amber-950 flex items-center gap-3 overflow-hidden shadow-xs">
      {/* Ticker Badge */}
      <div className="flex items-center gap-1.5 bg-orange-600 text-white font-bold px-2.5 py-0.5 rounded text-[11px] shrink-0 tracking-wide uppercase shadow-xs z-10">
        <Megaphone className="w-3.5 h-3.5 animate-bounce" />
        <span>{t.tickerTitle}</span>
      </div>

      {/* Marquee Container */}
      <div className="overflow-hidden relative w-full flex items-center">
        <div className="animate-marquee-infinite flex items-center gap-8 whitespace-nowrap cursor-pointer">
          {loopItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-800 hover:text-orange-700 font-medium transition-colors shrink-0">
              <span className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase animate-pulse">
                NEW
              </span>
              <span>{item}</span>
              <span className="text-amber-500 font-bold ml-2">★</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
