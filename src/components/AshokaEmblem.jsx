export default function AshokaEmblem({ className = "h-14 sm:h-16 w-auto", dark = false }) {
  return (
    <div className={`flex flex-col items-center justify-center shrink-0 ${className} select-none`}>
      <div className={`flex flex-col items-center justify-center ${dark ? 'bg-white/95 p-1.5 rounded-xl shadow-md border border-amber-400/40' : ''}`}>
        <img
          src="/emblem.png"
          alt="State Emblem of India - भारत का राजचिह्न"
          className="h-12 sm:h-14 w-auto object-contain drop-shadow-xs hover:scale-105 transition-transform"
          loading="eager"
        />
        <span className={`text-[9px] sm:text-[10px] font-extrabold tracking-wider font-serif mt-0.5 ${dark ? 'text-amber-950' : 'text-amber-950'}`}>
          सत्यमेव जयते
        </span>
      </div>
    </div>
  );
}
