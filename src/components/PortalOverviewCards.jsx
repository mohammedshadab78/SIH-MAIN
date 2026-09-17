import { 
  Mic, 
  Award, 
  MapPin, 
  Compass, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function PortalOverviewCards({ lang, t, onNavigate, onOpenVoiceBot }) {
  const iconConfig = [
    {
      id: 'voice-assistant',
      icon: Mic,
      gradient: "from-orange-500 to-amber-600",
      borderHover: "hover:border-orange-500",
      badgeColor: "bg-orange-100 text-orange-800 border-orange-300",
      onClick: onOpenVoiceBot
    },
    {
      id: 'nsqf-courses',
      icon: Award,
      gradient: "from-blue-600 to-indigo-700",
      borderHover: "hover:border-blue-500",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      onClick: () => onNavigate('skilling')
    },
    {
      id: 'gov-schemes',
      icon: ShieldCheck,
      gradient: "from-amber-600 to-orange-700",
      borderHover: "hover:border-amber-500",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      onClick: () => onNavigate('schemes')
    },
    {
      id: 'hyperlocal-map',
      icon: MapPin,
      gradient: "from-emerald-600 to-teal-700",
      borderHover: "hover:border-emerald-500",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      onClick: () => onNavigate('map')
    },
    {
      id: 'skill-gap',
      icon: Compass,
      gradient: "from-purple-600 to-indigo-800",
      borderHover: "hover:border-purple-500",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      onClick: () => onNavigate('pathway')
    }
  ];

  const localizedGateways = (t?.overview?.gateways || []).map((gw, idx) => ({
    ...gw,
    ...(iconConfig[idx] || iconConfig[0])
  }));

  // Localized SIH Problem-Solution Cards
  const problemSolutionCards = [
    {
      border: "border-red-500",
      title: lang === 'hi' 
        ? "1. कौशल व आजीविका बेमेल (Mismatch)" 
        : lang === 'mr' 
        ? "१. कौशल्य व उपजीविका तफावत" 
        : lang === 'bn' 
        ? "১. দক্ষতা ও জীবিকার অমিল" 
        : lang === 'te' 
        ? "1. నైపుణ్య & జీవనోపాధి అసమతుల్యత" 
        : "1. Skill & Livelihood Mismatch",
      desc: lang === 'hi'
        ? "पारंपरिक प्रशिक्षण अक्सर लाभार्थी की वास्तविक रुचि, वर्तमान हुनर और स्थानीय जिले की मांग से मेल नहीं खाता।"
        : lang === 'mr'
        ? "पारंपरिक प्रशिक्षण अनेकदा लाभार्थ्याची आवड, स्थानिक जिल्ह्यातील मागणी यांच्याशी सुसंगत नसते."
        : lang === 'bn'
        ? "ঐতিহ্যবাহী প্রশিক্ষণ প্রায়ই প্রার্থীর আগ্রহ এবং স্থানীয় জেলার অর্থনৈতিক চাহিদার সাথে মেলে না।"
        : lang === 'te'
        ? "సాంప్రదాయ శిక్షణ తరచుగా లబ్ధిదారుడి ఆసక్తి మరియు స్థానిక జిల్లా అవసరాలకు అనుగుణంగా ఉండదు."
        : "Beneficiaries often receive generic training not matching their local district's economic opportunities."
    },
    {
      border: "border-amber-500",
      title: lang === 'hi'
        ? "2. भाषा व डिजिटल साक्षरता की बाधा"
        : lang === 'mr'
        ? "२. भाषा व डिजिटल साक्षरतेची अडचण"
        : lang === 'bn'
        ? "২. ভাষা ও ডিজিটাল সাক্ষরতার বাধা"
        : lang === 'te'
        ? "2. భాష & డిజిటల్ అడ్డంకులు"
        : "2. Accessibility & Language Barriers",
      desc: lang === 'hi'
        ? "कठिन अंग्रेजी व टेक्स्ट आधारित पोर्टल्स के कारण ग्रामीण नागरिक व महिला समूह सरकारी योजनाओं से वंचित रह जाते हैं।"
        : lang === 'mr'
        ? "कठीण इंग्रजी आणि मजकूर आधारित वेबसाइट्समुळे ग्रामीण नागरिक आणि महिला बचत गट योजनांपासून वंचित राहतात."
        : lang === 'bn'
        ? "জটিল ইংরেজি এবং পাঠ্য-ভিত্তিক পোর্টালের কারণে গ্রামীণ নাগরিক ও স্বনির্ভর দল সুযোগ থেকে বঞ্চিত হয়।"
        : lang === 'te'
        ? "క్లిష్టమైన ఆంగ్ల పోర్టల్‌ల వల్ల గ్రామీణ ప్రజలు మరియు మహిళా సంఘాలు ప్రభుత్వ పథకాలకు దూరమవుతున్నాయి."
        : "Text-heavy English portals create barriers for rural citizens and women SHGs with basic literacy."
    },
    {
      border: "border-emerald-500",
      title: lang === 'hi'
        ? "3. ग्राम सक्षम वॉयस समाधान"
        : lang === 'mr'
        ? "३. ग्राम सक्षम व्हॉइस उपाय"
        : lang === 'bn'
        ? "৩. গ্রাম সক্ষম ভয়েস সমাধান"
        : lang === 'te'
        ? "3. గ్రామ్ సక్షమ్ వాయిస్ పరిష్కారం"
        : "3. Our Solution: GramSaksham Voice AI",
      desc: lang === 'hi'
        ? "मातृभाषा में बोलकर संवाद, एनएसक्यूएफ मान्यता प्राप्त कोर्सेज, और स्थानीय जिले में केवीके व ऋण की मैपिंग।"
        : lang === 'mr'
        ? "मातृभाषेत बोलून संवाद, एनएसक्यूएफ मान्यताप्राप्त अभ्यासक्रम आणि स्थानिक जिल्ह्यातील केंद्रे व कर्ज जोडणी."
        : lang === 'bn'
        ? "মাতৃভাষায় কথা বলে যোগাযোগ, এনএসকিউএফ অনুমোদিত কোর্স এবং স্থানীয় জেলার প্রশিক্ষণ কেন্দ্র ও ঋণের সংযোগ।"
        : lang === 'te'
        ? "మాతృభాషలో మాట్లాడే సదుపాయం, NSQF కోర్సులు మరియు స్థానిక కేంద్రాలు & రుణాల అనుసంధానం."
        : "Voice-first regional interaction mapping skills directly to NSQF qualification packs and local KVKs."
    }
  ];

  return (
    <section className="py-12 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full border border-orange-200 mb-2 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>{t?.overview?.badge || "National Skilling & Livelihood Mission"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t?.overview?.title || "GramSaksham: Integrated Rural Digital Gateway"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            {t?.overview?.subtitle || "Access flagship government skilling, grants, and rural livelihood programs via one click or voice"}
          </p>
        </div>

        {/* 3 SIH Problems vs Solutions Summary */}
        <div className="bg-white rounded-2xl p-5 mb-10 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-5">
          {problemSolutionCards.map((item, i) => (
            <div key={i} className={`border-l-4 ${item.border} pl-3.5`}>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                {item.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 5 Gateway Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localizedGateways.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`bg-white rounded-2xl p-6 border-2 border-slate-200 transition-all duration-200 hover:shadow-xl ${card.borderHover} flex flex-col justify-between group relative overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.gradient}`} />

                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${card.badgeColor}`}>
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {card.subtitle}
                  </p>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={card.onClick}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-blue hover:text-orange-600 transition-colors group-hover:translate-x-1 duration-150 cursor-pointer"
                  >
                    <span>{card.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-400 font-semibold">SIH 2026</span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Live Portal Impact Metrics */}
        {t?.overview?.stats && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {t.overview.stats.map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
                <div className="text-lg sm:text-2xl font-black text-gov-navy">{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
