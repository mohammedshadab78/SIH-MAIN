import { useState } from 'react';
import { Phone, PhoneCall, PhoneIncoming, Volume2, Hash, Star, ChevronRight, CheckCircle2, Mic2, Globe, AlertCircle, ExternalLink } from 'lucide-react';

const IVR_MENU = [
  { digit: '1', en: 'NSQF Skill Courses', hi: 'एनएसक्यूएफ कौशल पाठ्यक्रम', mr: 'एनएसक्यूएफ कौशल्य अभ्यासक्रम', color: 'bg-emerald-500' },
  { digit: '2', en: 'Government Schemes', hi: 'सरकारी योजनाएं', mr: 'शासकीय योजना', color: 'bg-blue-500' },
  { digit: '3', en: 'Nearest Training Center', hi: 'नजदीकी प्रशिक्षण केंद्र', mr: 'जवळचे प्रशिक्षण केंद्र', color: 'bg-violet-500' },
  { digit: '4', en: 'Kisan Drone Course', hi: 'किसान ड्रोन कोर्स', mr: 'किसान ड्रोन कोर्स', color: 'bg-sky-500' },
  { digit: '5', en: 'Solar Pump Course', hi: 'सोलर पंप कोर्स', mr: 'सोलर पंप कोर्स', color: 'bg-amber-500' },
  { digit: '6', en: 'Switch to Hindi', hi: 'हिंदी में सुनें', mr: 'हिंदीत ऐका', color: 'bg-orange-500' },
  { digit: '7', en: 'Switch Language', hi: 'भाषा बदलें', mr: 'भाषा बदला', color: 'bg-rose-500' },
  { digit: '*', en: 'Repeat Menu', hi: 'मेनू दोबारा सुनें', mr: 'मेनू पुन्हा ऐका', color: 'bg-slate-500' },
  { digit: '#', en: 'End Call', hi: 'कॉल समाप्त करें', mr: 'कॉल संपवा', color: 'bg-red-600' },
];

export default function IVRSection({ lang, t }) {
  const [activeLang, setActiveLang] = useState('hi');
  const [showSetup, setShowSetup] = useState(false);
  const isHi = lang === 'hi';
  const isMr = lang === 'mr';

  const label = (hi, mr, en) => isMr ? mr : isHi ? hi : en;

  const IVR_PHONE = import.meta.env.VITE_IVR_PHONE_NUMBER || '1800-XXX-XXXX';
  const hasRealNumber = IVR_PHONE !== '1800-XXX-XXXX';

  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-orange-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <PhoneIncoming className="w-3.5 h-3.5 animate-pulse" />
            {label('लाइव आईवीआर हेल्पलाइन', 'लाइव्ह आयव्हीआर हेल्पलाइन', 'Live IVR Helpline')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            {label(
              'सक्षम साथी टेलीफोन हेल्पलाइन',
              'सक्षम साथी टेलिफोन हेल्पलाइन',
              'Saksham Sathi Phone Helpline'
            )}
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto">
            {label(
              'बिना इंटरनेट के भी! अपने साधारण मोबाइल से कॉल करें और कौशल पाठ्यक्रम, सरकारी योजनाएं व नजदीकी केंद्र की जानकारी हिंदी, अंग्रेजी या मराठी में पाएं।',
              'इंटरनेटशिवायही! आपल्या साध्या मोबाइलवरून कॉल करा आणि कौशल्य अभ्यासक्रम, शासकीय योजना व जवळच्या केंद्राची माहिती हिंदी, इंग्रजी किंवा मराठीत मिळवा.',
              'No internet needed! Call from any basic mobile phone and get information about skill courses, government schemes & nearby centers in Hindi, English or Marathi.'
            )}
          </p>
        </div>

        {/* Big Phone Number Card */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-orange-900/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-orange-200 text-xs font-semibold uppercase tracking-widest mb-1">
                {label('निःशुल्क कॉल करें', 'मोफत कॉल करा', 'Call Toll-Free')}
              </p>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-wider font-mono">
                {IVR_PHONE}
              </div>
              <p className="text-orange-100 text-xs mt-1">
                {label(
                  '24×7 उपलब्ध — हिंदी · English · मराठी',
                  '24×7 उपलब्ध — हिंदी · English · मराठी',
                  'Available 24×7 — Hindi · English · Marathi'
                )}
              </p>
            </div>
          </div>

          {!hasRealNumber && (
            <div className="flex items-start gap-2 bg-white/10 rounded-xl p-3 text-orange-100 text-xs max-w-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                {label(
                  'Twilio नंबर जोड़ने के बाद यहाँ असली नंबर दिखेगा।',
                  'Twilio नंबर जोडल्यानंतर येथे खरा नंबर दिसेल.',
                  'Real number will appear here after connecting Twilio.'
                )}
              </span>
            </div>
          )}

          {hasRealNumber && (
            <a
              href={`tel:${IVR_PHONE.replace(/[^+\d]/g, '')}`}
              className="flex items-center gap-2 bg-white text-orange-600 font-black text-sm px-6 py-3 rounded-xl hover:bg-orange-50 active:scale-95 transition-all shadow-lg"
            >
              <PhoneCall className="w-5 h-5" />
              {label('अभी कॉल करें', 'आत्ता कॉल करा', 'Call Now')}
            </a>
          )}
        </div>

        {/* IVR Menu Preview */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Hash className="w-4 h-4 text-orange-400" />
            {label('आईवीआर मेनू — इन कुंजियों को दबाएं', 'आयव्हीआर मेनू — या कळा दाबा', 'IVR Menu — Press These Keys')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {IVR_MENU.map((item) => (
              <div key={item.digit} className="flex items-center gap-3 bg-slate-700/60 border border-slate-600/40 rounded-xl p-3 hover:bg-slate-700/90 transition-colors">
                <div className={`w-9 h-9 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0 text-white font-black text-lg shadow-md`}>
                  {item.digit}
                </div>
                <span className="text-sm text-slate-200 font-medium">
                  {isMr ? item.mr : isHi ? item.hi : item.en}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* IVR Flow Diagram */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            {label('आईवीआर कॉल फ्लो', 'आयव्हीआर कॉल फ्लो', 'IVR Call Flow')}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            {[
              label('कॉल करें', 'कॉल करा', 'Dial Number'),
              label('भाषा सुनें', 'भाषा ऐका', 'Hear Welcome'),
              label('मेनू चुनें (1-7)', 'मेनू निवडा (1-7)', 'Press Menu Key'),
              label('विस्तृत जानकारी', 'विस्तृत माहिती', 'Detailed Info'),
              label('नामांकन मार्गदर्शन', 'नोंदणी मार्गदर्शन', 'Enrollment Guidance'),
            ].map((step, i, arr) => (
              <span key={i} className="flex items-center gap-2">
                <span className="bg-slate-700 border border-slate-600 px-3 py-1.5 rounded-lg font-medium">{step}</span>
                {i < arr.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />}
              </span>
            ))}
          </div>
        </div>

        {/* Language selector demo */}
        <div className="flex flex-wrap gap-3 mb-8">
          <p className="w-full text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {label('डेमो: भाषा चुनें', 'डेमो: भाषा निवडा', 'Demo: Select Language')}
          </p>
          {[
            { code: 'hi', flag: '🇮🇳', label: 'हिंदी' },
            { code: 'en', flag: '🇬🇧', label: 'English' },
            { code: 'mr', flag: '🚩', label: 'मराठी' },
          ].map(({ code, flag, label: lbl }) => (
            <button
              key={code}
              onClick={() => setActiveLang(code)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                activeLang === code
                  ? 'bg-orange-500 border-orange-400 text-white shadow-lg'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span>{flag}</span> {lbl}
            </button>
          ))}
        </div>

        {/* Welcome preview text */}
        <div className="bg-slate-700/40 border border-slate-600/30 rounded-xl p-4 mb-8 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Mic2 className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
              {label('वॉयस प्रिव्यू (IVR स्वागत संदेश)', 'व्हॉइस प्रिव्ह्यू (IVR स्वागत संदेश)', 'Voice Preview (IVR Welcome Message)')}
            </p>
            <p className="text-slate-200 text-sm leading-relaxed italic">
              {activeLang === 'hi' && '"नमस्ते! ग्राम सक्षम हेल्पलाइन पर आपका स्वागत है। मैं सक्षम साथी हूँ, आपका एआई कौशल सहायक।"'}
              {activeLang === 'en' && '"Welcome to GramSaksham Helpline. I am Saksham Sathi, your AI Skilling Companion."'}
              {activeLang === 'mr' && '"नमस्कार! ग्राम सक्षम हेल्पलाइनवर आपले स्वागत आहे. मी सक्षम साथी आहे, आपला एआई कौशल्य सहाय्यक."'}
            </p>
          </div>
        </div>

        {/* Twilio Setup Accordion */}
        <div className="border border-slate-600/40 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowSetup(!showSetup)}
            className="w-full flex items-center justify-between px-6 py-4 bg-slate-700/50 hover:bg-slate-700 transition-colors text-left"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <Globe className="w-4 h-4 text-blue-400" />
              {label('Twilio से जोड़कर IVR लाइव करें — सेटअप गाइड', 'Twilio जोडून IVR लाइव्ह करा — सेटअप मार्गदर्शिका', 'Connect Twilio to Go Live — Setup Guide')}
            </span>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showSetup ? 'rotate-90' : ''}`} />
          </button>

          {showSetup && (
            <div className="px-6 py-5 bg-slate-800/60 space-y-3">
              {[
                {
                  n: '1',
                  title: 'Twilio Account बनाएं',
                  desc: 'https://www.twilio.com पर free account बनाएं। Indian number लें या trial number use करें।',
                  link: 'https://www.twilio.com/try-twilio'
                },
                {
                  n: '2',
                  title: 'Phone Number Configure करें',
                  desc: 'Twilio Console → Phone Numbers → Manage → Active Numbers → Incoming Call Webhook:',
                  code: 'https://your-vercel-domain.vercel.app/api/ivr'
                },
                {
                  n: '3',
                  title: 'Vercel Environment Variables जोड़ें',
                  desc: 'Vercel Dashboard → Project Settings → Environment Variables में ये add करें:',
                  envs: ['TWILIO_ACCOUNT_SID = ACxxxxxxxx', 'TWILIO_AUTH_TOKEN = your_auth_token', 'TWILIO_IVR_PHONE_NUMBER = +91XXXXXXXXXX', 'VITE_IVR_PHONE_NUMBER = +91XXXXXXXXXX']
                },
                {
                  n: '4',
                  title: 'Deploy और Test करें',
                  desc: 'Vercel पर deploy करें, फिर अपने Twilio number पर call करें और IVR menu सुनें!',
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5">{step.n}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-100">{step.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                    {step.code && (
                      <code className="block bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 mt-2 text-xs text-emerald-400 font-mono break-all">{step.code}</code>
                    )}
                    {step.envs && (
                      <div className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 mt-2 space-y-1">
                        {step.envs.map((e) => (
                          <code key={e} className="block text-xs text-emerald-400 font-mono">{e}</code>
                        ))}
                      </div>
                    )}
                    {step.link && (
                      <a href={step.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1">
                        {step.link} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mt-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-emerald-300">
                  {label(
                    'Vercel API endpoints पहले से तैयार हैं: /api/ivr, /api/ivr-action, /api/ivr-course, /api/ivr-status — सिर्फ Twilio जोड़ना बाकी है!',
                    'Vercel API endpoints आधीच तयार आहेत: /api/ivr, /api/ivr-action, /api/ivr-course, /api/ivr-status — फक्त Twilio जोडायचे आहे!',
                    'All Vercel API endpoints are already deployed: /api/ivr, /api/ivr-action, /api/ivr-course, /api/ivr-status — just connect Twilio!'
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
