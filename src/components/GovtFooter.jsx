import { useState } from 'react';
import { ExternalLink, Phone, Mail, ShieldCheck, Heart, X, CheckCircle2 } from 'lucide-react';
import AshokaEmblem from './AshokaEmblem';

export default function GovtFooter({ lang, t }) {
  const [activeLegalModal, setActiveLegalModal] = useState(null); // 'privacy' | 'terms' | 'sitemap' | null
  const fTrans = t?.footer || {};
  const cTrans = t?.common || {};

  const importantLinks = [
    { title: "Ministry of Skill Development & Entrepreneurship (MSDE)", url: "https://www.msde.gov.in/" },
    { title: "Ministry of Rural Development (MoRD)", url: "https://rural.gov.in/" },
    { title: "National Skill Development Corporation (NSDC)", url: "https://www.nsdcindia.org/" },
    { title: "National Career Service (NCS)", url: "https://www.ncs.gov.in/" },
    { title: "Digital India Initiative", url: "https://www.digitalindia.gov.in/" },
    { title: "Smart India Hackathon (SIH 2026)", url: "https://www.sih.gov.in/" }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t-4 border-orange-500">
      
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Government Emblem & Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <AshokaEmblem className="text-amber-400" dark={true} />
              <img 
                src="/logo.png" 
                alt="GramSaksham Portal Logo" 
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/60 shadow-md"
              />
              <div>
                <h4 className="font-bold text-white text-sm">
                  {t?.portalName || "GramSaksham"}
                </h4>
                <p className="text-[11px] text-amber-400 font-medium">
                  {cTrans.govtOfIndia || "Government of India | SIH 2026"}
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {fTrans.aboutDesc || "AI-driven multilingual voice assistant for rural livelihood & NSQF compliant skilling."}
            </p>
            <div className="text-[11px] text-slate-400">
              <span className="font-semibold text-slate-200">{fTrans.theme || "Theme: "}</span>
              {fTrans.themeVal || "Agri, FoodTech & Rural Dev"}
            </div>
          </div>

          {/* Col 2: Important Portals */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-slate-700 pb-2">
              {fTrans.portalsTitle || "Important Portals"}
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              {importantLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-amber-400 transition-colors flex items-center gap-1 text-slate-400 hover:underline"
                  >
                    <span>{link.title}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Helpline & Support */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-slate-700 pb-2">
              {fTrans.helplineTitle || "Citizen Support & Helpline"}
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">1800-123-9626</span>
                  <span className="text-[11px]">{fTrans.tollFreeSub || "National Skilling Toll-Free"}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold">support@gramsaksham.gov.in</span>
                  <span className="text-[11px] block">{fTrans.supportEmailSub || "Smart India Hackathon Team"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Compliance & Accessibility */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-slate-700 pb-2">
              {fTrans.complianceTitle || "Standards & Compliance"}
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <p>✓ GIGW (Guidelines for Indian Government Websites) Compliant</p>
              <p>✓ W3C WCAG 2.1 AA Accessibility Standards</p>
              <p>✓ Web Speech API (STT & TTS) Integrated</p>
              <p>✓ NSQF 2026 Aligned Framework</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal Stripe */}
      <div className="bg-slate-950 py-4 px-4 sm:px-8 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-center sm:text-left">
            <span>{fTrans.copyright || "© 2026 GramSaksham Portal. All Rights Reserved."}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveLegalModal('privacy')}
              className="hover:text-amber-400 cursor-pointer underline-offset-2 hover:underline transition-colors"
            >
              Privacy Policy
            </button>
            <span>|</span>
            <button
              onClick={() => setActiveLegalModal('terms')}
              className="hover:text-amber-400 cursor-pointer underline-offset-2 hover:underline transition-colors"
            >
              Terms of Service
            </button>
            <span>|</span>
            <button
              onClick={() => setActiveLegalModal('sitemap')}
              className="hover:text-amber-400 cursor-pointer underline-offset-2 hover:underline transition-colors"
            >
              Sitemap
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Compliance Modal Dialog */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border-2 border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">
                  {activeLegalModal === 'privacy' && "Privacy Policy"}
                  {activeLegalModal === 'terms' && "Terms of Service"}
                  {activeLegalModal === 'sitemap' && "Portal Sitemap"}
                </h3>
              </div>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {activeLegalModal === 'privacy' && (
                <>
                  <p className="font-semibold text-slate-900">
                    {fTrans.complianceText || "GramSaksham complies with the Digital Personal Data Protection Act 2023 (DPDP) and Guidelines for Indian Government Websites (GIGW)."}
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
                    <li>Beneficiary voice queries are processed strictly for skilling recommendations with zero third-party commercial sharing.</li>
                    <li>Local browser storage is used exclusively for connectivity resilience and offline caching.</li>
                    <li>Stipend entitlements are routed only through authenticated DBT channels.</li>
                  </ul>
                </>
              )}

              {activeLegalModal === 'terms' && (
                <>
                  <p className="font-semibold text-slate-900">
                    GramSaksham operates under guidelines established by MSDE, NSDC, and MoRD for Smart India Hackathon 2026 (Problem Statement 26097).
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
                    <li>All courses adhere strictly to National Skill Qualification Framework (NSQF) qualification packs.</li>
                    <li>Training under PMKVY 4.0 is 100% free; no candidate fee is charged at any certified center.</li>
                  </ul>
                </>
              )}

              {activeLegalModal === 'sitemap' && (
                <div className="space-y-2 text-xs">
                  <p className="font-bold text-slate-800 uppercase tracking-wider">
                    Core Portal Sections:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <div className="p-2 bg-slate-50 border rounded-lg">1. {t?.navHome || "Home & Overview"}</div>
                    <div className="p-2 bg-slate-50 border rounded-lg">2. {t?.navAssistant || "Voice Assistant"}</div>
                    <div className="p-2 bg-slate-50 border rounded-lg">3. {t?.navSkilling || "NSQF Catalog"}</div>
                    <div className="p-2 bg-slate-50 border rounded-lg">4. {t?.navSchemes || "Govt Schemes"}</div>
                    <div className="p-2 bg-slate-50 border rounded-lg">5. {t?.navMap || "Hyperlocal Map"}</div>
                    <div className="p-2 bg-slate-50 border rounded-lg">6. {t?.navPathway || "Skill Gap Pathway"}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="bg-gov-navy text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                {cTrans.close || "Close"}
              </button>
            </div>

          </div>
        </div>
      )}

    </footer>
  );
}
