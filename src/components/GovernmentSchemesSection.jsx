import { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Mic, 
  Building2, 
  Search, 
  FileText, 
  Printer, 
  X 
} from 'lucide-react';
import { governmentSchemes } from '../data/governmentSchemes';

export default function GovernmentSchemesSection({ lang, t, onOpenVoiceBot }) {
  const isEn = lang === 'en';
  const [search, setSearch] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);

  const sTrans = t?.schemes || {};

  const filteredSchemes = governmentSchemes.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    (s.titleHi && s.titleHi.includes(search)) ||
    s.ministry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-[11px] font-bold px-3 py-1 rounded-full border border-orange-200 mb-2 uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
              <span>{sTrans.badge || "Government of India Flagship Schemes"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {sTrans.title || "Rural Livelihood, Skilling & Grant Schemes"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {sTrans.subtitle || "Official guidelines, subsidies, and application linkages for PMKVY 4.0, Namo Drone Didi, PM-KUSUM, and PM Vishwakarma."}
            </p>
          </div>

          <button
            onClick={onOpenVoiceBot}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow hover:shadow-md transition-all self-start md:self-auto cursor-pointer"
          >
            <Mic className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>{sTrans.voiceInquire || "Inquire via Voice Bot"}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6 relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={sTrans.searchPlaceholder || "Search scheme or ministry..."}
            className="w-full bg-white border border-slate-300 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border-2 border-slate-200 hover:border-orange-400 shadow-sm hover:shadow-xl transition-all duration-200 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="bg-orange-50 text-orange-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-orange-200 uppercase tracking-wider">
                    {lang === 'mr' ? (scheme.badgeMr || scheme.badge) : lang === 'hi' ? (scheme.badgeHi || scheme.badge) : scheme.badge}
                  </span>
                  <a
                    href={scheme.officialPortal}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-orange-600 p-1 cursor-pointer"
                    title="Open Official Ministry Portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {lang === 'mr' ? (scheme.titleMr || scheme.title) : lang === 'hi' ? (scheme.titleHi || scheme.title) : scheme.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{lang === 'mr' ? (scheme.ministryMr || scheme.ministry) : lang === 'hi' ? (scheme.ministryHi || scheme.ministry) : scheme.ministry}</span>
                </p>

                {/* Key Benefits List */}
                <div className="mt-4 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    {sTrans.benefits || "Key Benefits & Subsidies:"}
                  </span>
                  <div className="space-y-1.5">
                    {(lang === 'mr' && scheme.keyBenefitsMr ? scheme.keyBenefitsMr : lang === 'hi' && scheme.keyBenefitsHi ? scheme.keyBenefitsHi : scheme.keyBenefits).map((b, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Eligibility Box */}
                <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block mb-0.5">
                    {sTrans.eligibility || "Eligibility:"}:
                  </span>
                  <p>{lang === 'mr' ? (scheme.eligibilityMr || scheme.eligibility) : lang === 'hi' ? (scheme.eligibilityHi || scheme.eligibility) : scheme.eligibility}</p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedScheme(scheme)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 px-2.5 py-1.5 rounded-lg border border-orange-200 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? "दस्तावेज़ चेकलिस्ट" : lang === 'mr' ? "कागदपत्रे यादी" : lang === 'bn' ? "নথিপত্র তালিকা" : lang === 'te' ? "పత్రాల జాబితా" : "Required Docs"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenVoiceBot}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-orange-600 cursor-pointer"
                    title="Inquire with Saksham Sathi"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? "पूछें" : lang === 'mr' ? "विचारा" : lang === 'bn' ? "জিজ্ঞাসা" : lang === 'te' ? "అడగండి" : "Ask"}</span>
                  </button>

                  <a
                    href={scheme.officialPortal}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gov-navy hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>{sTrans.viewOfficial || "Portal"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Scheme Eligibility & Document Checklist Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-orange-500 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200 block">
                  {lang === 'hi' ? "योजना दस्तावेज़ एवं पात्रता चेकलिस्ट" : lang === 'mr' ? "योजना कागदपत्रे व पात्रता यादी" : lang === 'bn' ? "প্রকল্প নথিপত্র ও যোগ্যতা" : lang === 'te' ? "పథకం పత్రాలు & అర్హత" : "Scheme Eligibility & Documents"}
                </span>
                <h3 className="font-bold text-base sm:text-lg leading-snug">
                  {isEn ? selectedScheme.title : (selectedScheme.titleHi || selectedScheme.title)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
              
              {/* Eligibility Highlight */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3.5 space-y-1">
                <span className="font-bold text-orange-950 block text-xs uppercase tracking-wider">
                  {sTrans.eligibility || "Eligibility Criteria:"}
                </span>
                <p className="text-xs text-orange-900 leading-relaxed">
                  {lang === 'mr' ? (selectedScheme.eligibilityMr || selectedScheme.eligibility) : lang === 'hi' ? (selectedScheme.eligibilityHi || selectedScheme.eligibility) : selectedScheme.eligibility}
                </p>
              </div>

              {/* Document Checklist */}
              <div className="space-y-2.5">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                  {lang === 'hi' ? "आवेदन हेतु आवश्यक दस्तावेज़:" : lang === 'mr' ? "अर्जासाठी आवश्यक कागदपत्रे:" : lang === 'bn' ? "আবেদনের জন্য প্রয়োজনীয় নথি:" : lang === 'te' ? "దరఖాస్తుకు అవసరమైన పత్రాలు:" : "Mandatory Application Documents:"}
                </span>
                
                <div className="space-y-2">
                  {[
                    { 
                      title: lang === 'hi' ? "आधार कार्ड (Aadhaar Card)" : lang === 'mr' ? "आधार कार्ड" : lang === 'bn' ? "আধার কার্ড" : lang === 'te' ? "ఆధార్ కార్డు" : "Aadhaar Card", 
                      desc: lang === 'hi' ? "मोबाइल नंबर से लिंक होना अनिवार्य" : lang === 'mr' ? "मोबाईल नंबर लिंक असणे आवश्यक" : lang === 'bn' ? "মোবাইল নম্বর লিঙ্ক থাকা আবশ্যক" : lang === 'te' ? "మొబైల్ నంబర్ లింక్ అయి ఉండాలి" : "Mandatory Mobile Linked" 
                    },
                    { 
                      title: lang === 'hi' ? "बैंक खाता पासबुक (Bank Passbook)" : lang === 'mr' ? "बँक पासबुक" : lang === 'bn' ? "ব্যাঙ্ক পাসবুক" : lang === 'te' ? "బ్యాంక్ పాస్ బుక్" : "Bank Passbook", 
                      desc: lang === 'hi' ? "डीबीटी (DBT) सक्रिय बैंक खाता प्रति" : lang === 'mr' ? "डीबीटी (DBT) सक्रिय बँक खाते" : lang === 'bn' ? "ডিবিটি সক্রিয় ব্যাঙ্ক অ্যাকাউন্ট" : lang === 'te' ? "DBT సక్రియ బ్యాంక్ ఖాతా" : "DBT Active Account" 
                    },
                    { 
                      title: lang === 'hi' ? "मूल निवास प्रमाण पत्र / ग्राम पंचायत सत्यापन" : lang === 'mr' ? "अधिवास प्रमाणपत्र / ग्रामपंचायत दाखला" : lang === 'bn' ? "আবাসিক প্রমাণপত্র / পঞ্চায়েত সার্টিফিকেট" : lang === 'te' ? "స్థానికత ధృవీకరణ పత్రం" : "Domicile / Gram Panchayat Certificate", 
                      desc: lang === 'hi' ? "निवास का आधिकारिक प्रमाण" : lang === 'mr' ? "निवासाचा अधिकृत पुरावा" : lang === 'bn' ? "বাসস্থানের সরকারি প্রমাণ" : lang === 'te' ? "నివాస ధృవీకరణ" : "Proof of Residence" 
                    },
                    { 
                      title: lang === 'hi' ? "पासपोर्ट आकार का हालिया रंगीन फोटो" : lang === 'mr' ? "पासपोर्ट आकाराचे २ रंगीत फोटो" : lang === 'bn' ? "২ কপি পাসপোর্ট ছবি" : lang === 'te' ? "పాస్‌పోర్ట్ సైజు ఫోటోలు" : "Passport Sized Photographs", 
                      desc: "2 Copies" 
                    }
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">{doc.title}</span>
                        <span className="text-[11px] text-slate-500">{doc.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ministry & Processing Time */}
              <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <p><strong>{lang === 'hi' ? "मंत्रालय:" : lang === 'mr' ? "मंत्रालय:" : lang === 'bn' ? "মন্ত্রক:" : lang === 'te' ? "మంత్రిత్వ శాఖ:" : "Ministry:"}</strong> {lang === 'mr' ? (selectedScheme.ministryMr || selectedScheme.ministry) : lang === 'hi' ? (selectedScheme.ministryHi || selectedScheme.ministry) : selectedScheme.ministry}</p>
                <p><strong>{lang === 'hi' ? "हेल्पलाइन:" : "Helpline:"}</strong> {t?.common?.tollFreeNum || "1800-123-9626 (Toll-Free)"}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => window.print()}
                  className="bg-gov-navy hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t?.common?.print || "Print Checklist"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedScheme(null);
                      onOpenVoiceBot();
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{t?.navAssistant || "Voice Help"}</span>
                  </button>

                  <a
                    href={selectedScheme.officialPortal}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>{sTrans.viewOfficial || "Portal"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
