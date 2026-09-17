import { Mic, ArrowRight, Award, MapPin, Users, CheckCircle, Sparkles, GraduationCap, IndianRupee, Zap, Bot, Compass } from 'lucide-react';

const iconMap = {
  GraduationCap,
  IndianRupee,
  Zap,
  Bot
};

export default function HeroBanner({ t, lang, onOpenVoiceBot, onNavigate }) {
  const isHi = lang === 'hi';
  const goals = t.futureGoals || [];

  return (
    <section className="relative bg-gov-navy text-white overflow-hidden py-10 sm:py-16 border-b-4 border-orange-500 shadow-xl">
      {/* Background Landscape Video (75% visibility) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center opacity-75"
        >
          <source src="/VDO.mp4" type="video/mp4" />
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Navy & dark gradient tint to maintain portal contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-gov-navy/35 to-slate-950/60 pointer-events-none" />
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Text Content (7 cols) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* SIH 2026 Tag */}
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 px-3 py-1 rounded-full text-xs font-semibold text-orange-300 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
              <span>{t.sihBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-slate-50">
              {t.heroTitle}
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
              {t.heroDesc}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Primary Voice CTA with pulse */}
              <button
                onClick={onOpenVoiceBot}
                className="group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-xl shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-102 transition-all active:scale-98"
              >
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-white text-orange-600 items-center justify-center">
                    <Mic className="w-2.5 h-2.5 fill-current" />
                  </span>
                </span>
                <span>{t.speakNow}</span>
                <Sparkles className="w-4 h-4 text-amber-200" />
              </button>

              {/* Browse Courses */}
              <button
                onClick={() => onNavigate('skilling')}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm px-4 py-3 rounded-xl border border-slate-600 transition-colors"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>{t.exploreCourses}</span>
              </button>

              {/* View Map */}
              <button
                onClick={() => onNavigate('map')}
                className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm px-4 py-3 rounded-xl border border-slate-600 transition-colors"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{t.viewMap}</span>
              </button>
            </div>

            {/* Highlights pill tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'hi' ? "बिना पढ़े-लिखे केवल आवाज़ से संवाद" : lang === 'mr' ? "केवळ आवाजाने संवाद" : lang === 'bn' ? "কণ্ঠস্বর দিয়ে সহজ যোগাযোগ" : lang === 'te' ? "వాయిస్ ద్వారా సులభ సంభాషణ" : "100% Voice-First Accessibility"}
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'hi' ? "एनएसक्यूएफ स्तर 1-7 सरकारी प्रमाणपत्र" : lang === 'mr' ? "एनएसक्यूएफ स्तर १-७ सरकारी प्रमाणपत्र" : lang === 'bn' ? "এনএসকিউএফ লেভেল ১-৭ সরকারি সার্টিফিকেট" : lang === 'te' ? "NSQF స్థాయి 1-7 అధికారిక సర్టిఫికేట్" : "NSQF Compliant Modules"}
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'hi' ? "पीएमकेवीवाई 4.0 मासिक स्टाइपेंड" : lang === 'mr' ? "पीएमकेव्हीवाय ४.० मासिक विद्यावेतन" : lang === 'bn' ? "PMKVY 4.0 মাসিক স্টাইপেন্ড" : lang === 'te' ? "PMKVY 4.0 నెలవారీ స్టైపెండ్" : "PMKVY 4.0 Monthly Stipend"}
              </span>
            </div>
          </div>

          {/* Right Voice Assistant Interactive Teaser Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-2 border-orange-500/40 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-sm">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{t.voiceModal?.title || "सक्षम साथी"}</h3>
                    <p className="text-[11px] text-amber-300">{t.voiceModal?.subtitle || "AI Voice Assistant"}</p>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {lang === 'hi' ? "लाइव वॉयस सक्रिय" : lang === 'mr' ? "थेट व्हॉइस सक्रिय" : lang === 'bn' ? "লাইভ ভয়েস সক্রিয়" : lang === 'te' ? "లైవ్ వాయిస్ సిద్ధం" : "Live Voice Active"}
                </span>
              </div>

              {/* Sample Voice Interaction preview */}
              <div className="space-y-3 text-xs mb-4">
                <div className="bg-slate-700/60 text-slate-200 p-2.5 rounded-lg border border-slate-600/80 flex items-start gap-2">
                  <span className="text-orange-400 font-bold">{lang === 'hi' ? "आवाज़:" : lang === 'mr' ? "आवाज:" : lang === 'bn' ? "কণ্ঠ:" : lang === 'te' ? "వాయిస్:" : "Voice:"}</span>
                  <span>{t.voiceModal?.quickPrompts?.[0] || "सीहोर में ड्रोन पायलट प्रशिक्षण कहाँ मिलेगा?"}</span>
                </div>
                <div className="bg-gov-navy/80 text-amber-100 p-2.5 rounded-lg border border-orange-500/30 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">AI:</span>
                  <span>{t.overview?.gateways?.[0]?.description || t.voiceModal?.greeting}</span>
                </div>
              </div>

              {/* Quick Spoken Prompts */}
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {t.voiceModal?.quickPromptsTitle || "Quick Prompts:"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {(t.voiceModal?.quickPrompts || []).slice(0, 4).map((prompt, i) => (
                    <button
                      key={i}
                      onClick={onOpenVoiceBot}
                      className="text-left bg-slate-700/40 hover:bg-orange-500/20 hover:border-orange-400/60 border border-slate-600 text-slate-200 hover:text-white px-2.5 py-1.5 rounded text-[11px] transition-colors truncate flex items-center gap-1.5 cursor-pointer"
                    >
                      <Mic className="w-3 h-3 text-orange-400 shrink-0" />
                      <span className="truncate">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Launch Full Voice Modal CTA */}
              <button
                onClick={onOpenVoiceBot}
                className="mt-4 w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>{t.speakNow}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>

        </div>

        {/* Portal Future Goals Section */}
        <div className="mt-10 pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-orange-400">
              <Compass className="w-4 h-4 text-orange-400 animate-spin-slow" />
              <span>{t.futureGoalsTitle || (lang === 'mr' ? "पोर्टलचे प्रमुख भविष्य ध्येय" : isHi ? "पोर्टल के प्रमुख भविष्य लक्ष्य" : "Strategic Future Goals")}</span>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium">
              {t.futureGoalsSubtitle || "Mission 2026"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {goals.map((goal, idx) => {
              const IconComponent = iconMap[goal.icon] || GraduationCap;
              return (
                <div
                  key={idx}
                  className="bg-slate-800/60 hover:bg-slate-800/90 p-3.5 rounded-xl border border-slate-700/60 hover:border-slate-600 transition-all duration-200 group text-left shadow-xs"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`p-2 rounded-lg border ${goal.color || 'text-orange-400 border-orange-500/30 bg-orange-500/10'}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      0{idx + 1}
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-orange-300 transition-colors leading-snug">
                    {goal.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                    {goal.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
