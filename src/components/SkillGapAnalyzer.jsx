import { useState, useEffect } from 'react';
import { 
  Compass, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Briefcase, 
  RefreshCw,
  IndianRupee,
  FileCheck,
  ShieldCheck,
  Printer,
  ChevronRight,
  AlertTriangle,
  Zap,
  Layers,
  Bot,
  MapPin,
  Check,
  GraduationCap,
  Wrench,
  Target,
  Navigation,
  Building2,
  Volume2,
  VolumeX,
  Play,
  Square,
  QrCode,
  Download,
  Share2,
  BadgeCheck
} from 'lucide-react';
import { nsqfCourses } from '../data/nsqfCourses';
import { 
  generateSkillGapGemini,
  EDUCATION_LABELS, 
  EXPERIENCE_LABELS, 
  GOAL_LABELS 
} from '../lib/aiService';
import { speechManager } from '../lib/speechService';
import AshokaEmblem from './AshokaEmblem';

export default function SkillGapAnalyzer({ lang, t, onOpenVoiceBot, onNavigate }) {
  const isHi = lang === 'hi';
  const isMr = lang === 'mr';
  const pTrans = t?.pathway || {};
  const cTrans = t?.common || {};

  const [step, setStep] = useState(1);
  const [education, setEducation] = useState('10th');
  const [experience, setExperience] = useState('farming');
  const [stateName, setStateName] = useState('मध्य प्रदेश (Madhya Pradesh)');
  const [district, setDistrict] = useState('बड़वानी (Barwani)');
  const [blockPanchayat, setBlockPanchayat] = useState('');
  const [pincode, setPincode] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [goal, setGoal] = useState('drone');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiStatusMsg, setAiStatusMsg] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isSpeakingRoadmap, setIsSpeakingRoadmap] = useState(false);

  useEffect(() => {
    return () => {
      speechManager.stopSpeaking();
    };
  }, []);

  const handleToggleAudioRoadmap = () => {
    if (isSpeakingRoadmap) {
      speechManager.stopSpeaking();
      setIsSpeakingRoadmap(false);
      return;
    }

    if (!roadmap) return;

    const narration = isMr
      ? `नमस्कार! सक्षम एआयने तुमच्या माहितीच्या आधारे तुमचा ४-टप्प्यांचा करिअर रोडमॅप तयार केला आहे. तुमचे लक्षित पद आहे: ${roadmap.targetRole}। सध्या तुमचे अंदाजे अनौपचारिक उत्पन्न ${roadmap.baselineWage} आहे, जे या सरकारी एनएसक्यूएफ प्रशिक्षणानंतर वाढून अंदाजे ${roadmap.expectedMonthlyIncome} प्रति महिना होऊ शकते. सक्षम एआयचा वैयक्तिक सल्ला: ${roadmap.aiPersonalizedAdvice || ''}। याचे प्रमुख चार टप्पे आहेत: ` +
        (roadmap.steps || []).map((s, idx) => `टप्पा ${idx + 1}: ${s.phase}, कालावधी ${s.duration}, विद्यावेतन ${s.stipend}। तपशील: ${s.desc}।`).join(' ') +
        ` हा अभ्यासक्रम तुमच्या ${district} जिल्ह्यातील शासकीय केंद्रावर उपलब्ध आहे. आजच तुमचे अधिकृत लर्नर पास डाऊनलोड करा. जय महाराष्ट्र, जय हिंद!`
      : isHi
      ? `नमस्ते! सक्षम एआई ने आपके इनपुट के आधार पर आपका 4-चरणीय करियर रोडमैप तैयार किया है। आपका लक्षित पद है: ${roadmap.targetRole}। वर्तमान में आपकी अनुमानित अनौपचारिक आय ${roadmap.baselineWage} है, जो इस सरकारी एनएसक्यूएफ प्रशिक्षण के बाद बढ़कर लगभग ${roadmap.expectedMonthlyIncome} प्रति माह हो सकती है। सक्षम एआई की व्यक्तिगत सलाह: ${roadmap.aiPersonalizedAdvice || ''}। इसके प्रमुख चार चरण हैं: ` +
        (roadmap.steps || []).map((s, idx) => `चरण ${idx + 1}: ${s.phase}, अवधि ${s.duration}, स्टाइपेंड ${s.stipend}। विवरण: ${s.desc}।`).join(' ') +
        ` यह कोर्स आपके जिले ${district} के नजदीकी सरकारी केंद्र पर उपलब्ध है। अपना लर्नर पास डाउनलोड करके तुरंत नामांकन कराएं। जय हिन्द!`
      : `Hello! Based on your profile, Saksham AI has generated your 4-phase NSQF career progression roadmap. Your target role is: ${roadmap.targetRole}. Your informal baseline earnings of ${roadmap.baselineWage} can rise to approximately ${roadmap.expectedMonthlyIncome} per month upon certification. Advisor note: ${roadmap.aiPersonalizedAdvice || ''}. The four progression phases are: ` +
        (roadmap.steps || []).map((s, idx) => `Phase ${idx + 1}: ${s.phase}, duration ${s.duration}, stipend ${s.stipend}. Details: ${s.desc}.`).join(' ') +
        ` This course is active in your district ${district}. Download your official learner pass to enroll today.`;

    setIsSpeakingRoadmap(true);
    speechManager.speak(narration, {
      lang: isMr ? 'mr-IN' : isHi ? 'hi-IN' : 'en-IN',
      rate: 0.95,
      onStart: () => setIsSpeakingRoadmap(true),
      onEnd: () => setIsSpeakingRoadmap(false)
    });
  };

  const handleStartOver = () => {
    speechManager.stopSpeaking();
    setIsSpeakingRoadmap(false);
    setStep(1);
  };

  const stateDistrictsMap = {
    'मध्य प्रदेश (Madhya Pradesh)': ['बड़वानी (Barwani)', 'सीहोर (Sehore)', 'इंदौर (Indore)', 'भोपाल (Bhopal)', 'धार (Dhar)', 'खरगोन (Khargone)', 'उज्जैन (Ujjain)'],
    'उत्तर प्रदेश (Uttar Pradesh)': ['वाराणसी (Varanasi)', 'बाराबंकी (Barabanki)', 'लखनऊ (Lucknow)', 'गोरखपुर (Gorakhpur)', 'अयोध्या (Ayodhya)', 'प्रयागराज (Prayagraj)'],
    'राजस्थान (Rajasthan)': ['जयपुर (Jaipur)', 'जोधपुर (Jodhpur)', 'उदयपुर (Udaipur)', 'कोटा (Kota)', 'अलवर (Alwar)', 'बीकानेर (Bikaner)'],
    'महाराष्ट्र (Maharashtra)': ['नागपुर (Nagpur)', 'नासिक (Nashik)', 'पुणे (Pune)', 'छत्रपति संभाजीनगर (Aurangabad)', 'अमरावती (Amravati)'],
    'बिहार (Bihar)': ['पटना (Patna)', 'गया (Gaya)', 'मुजफ्फरपुर (Muzaffarpur)', 'भागलपुर (Bhagalpur)', 'दरभंगा (Darbhanga)'],
    'झारखंड (Jharkhand)': ['रांची (Ranchi)', 'धनबाद (Dhanbad)', 'हजारीबाग (Hazaribagh)', 'बोकारो (Bokaro)'],
    'गुजरात (Gujarat)': ['अहमदाबाद (Ahmedabad)', 'सूरत (Surat)', 'राजकोट (Rajkot)', 'वडोदरा (Vadodara)', 'आनंद (Anand)'],
    'छत्तीसगढ़ (Chhattisgarh)': ['रायपुर (Raipur)', 'बिलासपुर (Bilaspur)', 'दुर्ग (Durg)', 'बस्तर (Bastar)']
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert(isMr ? "तुमच्या ब्राउझरमध्ये जीपीएस लोकेशन समर्थित नाही." : isHi ? "आपके ब्राउज़र में जीपीएस लोकेशन समर्थित नहीं है।" : "Geolocation is not supported by your browser.");
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setTimeout(() => {
          setIsDetectingLocation(false);
          setStateName('मध्य प्रदेश (Madhya Pradesh)');
          setDistrict('बड़वानी (Barwani)');
        }, 600);
      },
      (err) => {
        setIsDetectingLocation(false);
        setStateName('मध्य प्रदेश (Madhya Pradesh)');
        setDistrict('बड़वानी (Barwani)');
      },
      { timeout: 5000 }
    );
  };

  const handleGenerateRoadmap = async () => {
    setIsAnalyzing(true);
    setAiStatusMsg(isMr ? "१/३: तुमच्या इनपुट प्रोफाइलचे (शिक्षण, अनुभव, स्थान, ध्येय) विश्लेषण सुरू आहे..." : isHi ? "1/3: आपके इनपुट (शिक्षा, अनुभव, स्थान, लक्ष्य) का विश्लेषण जारी है..." : "1/3: Analyzing candidate input profile...");

    const timer1 = setTimeout(() => {
      setAiStatusMsg(lang === 'hi' ? "2/3: एनएसक्यूएफ लेवल 1-7 मैपिंग व स्थानीय केवीके/पीएमकेके केंद्र जोड़े जा रहे हैं..." : lang === 'mr' ? "२/३: एनएसक्यूएफ स्तर १-७ मॅपिंग आणि स्थानिक केंद्र जोडले जात आहेत..." : "2/3: Mapping NSQF Level & nearby centers...");
    }, 600);

    const timer2 = setTimeout(() => {
      setAiStatusMsg(lang === 'hi' ? "3/3: जेमिनी एआई द्वारा व्यक्तिगत 4-चरणीय करियर रोडमैप तैयार हो रहा है..." : lang === 'mr' ? "३/३: एआय द्वारे वैयक्तिकृत ४-टप्प्यांचा करिअर रोडमॅप तयार होत आहे..." : "3/3: Generating AI progression roadmap...");
    }, 1200);

    const fullLocation = `${district}, ${stateName}${blockPanchayat ? `, ब्लॉक: ${blockPanchayat}` : ''}${pincode ? ` (${pincode})` : ''}`;

    try {
      const generated = await generateSkillGapGemini({
        education,
        experience,
        goal,
        district: fullLocation,
        additionalNotes,
        language: lang
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      setRoadmap(generated);
      setStep(5);
    } catch (err) {
      console.error("AI Roadmap generation error:", err);
      const fallback = await generateSkillGapGemini({
        education,
        experience,
        goal,
        district: fullLocation,
        additionalNotes,
        language: lang,
        userApiKey: ''
      });
      setRoadmap(fallback);
      setStep(5);
    } finally {
      setIsAnalyzing(false);
      setAiStatusMsg('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 text-[11px] font-bold px-3 py-1 rounded-full border border-purple-200 mb-1 uppercase">
              <Bot className="w-3.5 h-3.5 text-purple-700" />
              <span>{pTrans.badge || "AI-Powered Career Guidance"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>{pTrans.title || "Skill Gap Pathway & NSQF Certificate"}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {pTrans.subtitle || "Real-time AI diagnostic report mapping applicant qualification, experience, district, and goal to NSQF standards."}
            </p>
          </div>

          <button
            onClick={onOpenVoiceBot}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow hover:shadow-md transition-all self-start md:self-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>{t?.navAssistant || "Voice Consultation"}</span>
          </button>
        </div>

        {/* Wizard Step Progress Bar - 5 Step Flow */}
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto px-2">
          {[
            { num: 1, label: lang === 'hi' ? "शिक्षा" : lang === 'mr' ? "शिक्षण" : lang === 'bn' ? "শিক্ষা" : lang === 'te' ? "విద్య" : "Education" },
            { num: 2, label: lang === 'hi' ? "अनुभव" : lang === 'mr' ? "अनुभव" : lang === 'bn' ? "অভিজ্ঞতা" : lang === 'te' ? "అనుభవం" : "Experience" },
            { num: 3, label: lang === 'hi' ? "स्थान" : lang === 'mr' ? "स्थान" : lang === 'bn' ? "স্থান" : lang === 'te' ? "ప్రాంతం" : "Location" },
            { num: 4, label: lang === 'hi' ? "लक्ष्य" : lang === 'mr' ? "ध्येय" : lang === 'bn' ? "লক্ষ্য" : lang === 'te' ? "లక్ష్యం" : "Goal" },
            { num: 5, label: lang === 'hi' ? "एआई रोडमैप" : lang === 'mr' ? "रोडमॅप" : lang === 'bn' ? "রোডম্যাপ" : lang === 'te' ? "రోడ్‌మ్యాప్" : "Roadmap" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center">
              <div
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= item.num
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > item.num ? <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : item.num}
              </div>
              <span className={`text-[10px] sm:text-[11px] font-semibold ml-1.5 hidden md:inline ${
                step >= item.num ? 'text-purple-950 font-bold' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
              {idx < 4 && (
                <div className={`w-4 sm:w-8 md:w-12 h-0.5 mx-1 sm:mx-2 ${
                  step > item.num ? 'bg-purple-600' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Questionnaire Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md">
          
          {/* Step 1: Education */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {isMr ? "तुमची सर्वोच्च शैक्षणिक पात्रता काय आहे?" : isHi ? "आपकी अधिकतम शैक्षणिक योग्यता क्या है?" : "What is your highest educational qualification?"}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {isMr
                  ? "एआय तुमच्या शिक्षणाच्या आधारे एनएसक्यूएफ स्तर (Level ३ ते ५) आणि योग्य ब्रिज मॉड्युल्स निश्चित करेल."
                  : isHi 
                  ? "एआई आपकी शिक्षा के आधार पर एनएसक्यूएफ स्तर (Level 3 से 5) और उपयुक्त ब्रिज मॉड्यूल तय करेगा।"
                  : "AI maps qualification to appropriate NSQF Level entry criteria and bridge learning modules."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'literate', labelMr: "मूलभूत साक्षरता / ५वी पास", labelHi: "बुनियादी साक्षरता / 5वीं पास", labelEn: "Basic Literacy / 5th Class Pass", desc: isMr ? "कौशल्य विकास व प्रात्यक्षिक कामासाठी पात्र" : "कौशल विकास व प्रायोगिक कार्य हेतु पात्र" },
                  { id: '8th', labelMr: "८वी उत्तीर्ण", labelHi: "8वीं कक्षा उत्तीर्ण", labelEn: "8th Class Pass", desc: isMr ? "प्रशिक्षणार्थी व तंत्रज्ञ ट्रेड्स" : "प्रशिक्षु कारीगर व तकनीशियन ट्रेड्स" },
                  { id: '10th', labelMr: "१०वी (मॅट्रिक) उत्तीर्ण", labelHi: "10वीं कक्षा (मैट्रिक) उत्तीर्ण", labelEn: "10th Class (Matric) Pass", desc: isMr ? "किसान ड्रोन व सोलर तंत्रज्ञासाठी आदर्श" : "किसान ड्रोन व सोलर तकनीशियन के लिए आदर्श" },
                  { id: '12th', labelMr: "१२वी / आयटीआय (ITI)", labelHi: "12वीं कक्षा / आईटीआई (ITI)", labelEn: "12th Pass / ITI Diploma", desc: isMr ? "सुपरवायझर व ऑपरेटर ट्रेड्स" : "उन्नत सुपरवाइजर व ऑपरेटर ट्रेड्स" },
                  { id: 'graduate', labelMr: "पदवीधर (Graduate) किंवा पदविका", labelHi: "स्नातक (Graduate) या अन्य", labelEn: "Graduate / Polytechnic Diploma", desc: isMr ? "कृषी उद्योजकता व व्यवस्थापन" : "कृषि उद्यमिता व प्रबंधन ट्रेड्स" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEducation(item.id)}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all relative ${
                      education === item.id
                        ? 'bg-purple-50 border-purple-600 text-purple-950 ring-2 ring-purple-200 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{isMr ? item.labelMr : isHi ? item.labelHi : item.labelEn}</span>
                      {education === item.id && <Check className="w-4 h-4 text-purple-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 block font-normal mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow"
                >
                  <span>{isMr ? "पुढील पायरी: अनुभव" : isHi ? "अगला कदम: अनुभव" : "Next Step: Experience"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Experience */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-purple-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {isMr ? "सध्या तुमचे काम किंवा पूर्वीचा अनौपचारिक अनुभव काय आहे?" : isHi ? "वर्तमान में आपका कार्य अथवा पूर्व अनौपचारिक अनुभव क्या है?" : "What is your current work or informal trade experience?"}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {isMr
                  ? "एआय हे ओळखेल की तुमच्या कौशल्याचा उपयोग उच्च-वेतन नोकरीत कसा केला जाऊ शकतो."
                  : isHi
                  ? "एआई यह पहचानेगा कि आपके मौजूदा हुनर का उपयोग नए उच्च-वेतन वाले काम में कैसे किया जा सकता है।"
                  : "AI analyzes prior domain exposure to bridge existing competencies with certified skills."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'farming', labelMr: "पारंपरिक शेतमजुरी आणि पेरणी-कापणी", labelHi: "पारंपरिक कृषि मजदूरी व बुवाई-कटाई", labelEn: "Traditional Farm Labour & Sowing" },
                  { id: 'dairy', labelMr: "पशुपालन व गाय/म्हैस दूध उत्पादन", labelHi: "पशुपालन व गाय/भैंस का दूध उत्पादन", labelEn: "Milch Cattle & Livestock Care" },
                  { id: 'electric', labelMr: "मोटर पंप दुरुस्ती आणि वीज काम", labelHi: "मोटर पंप मरम्मत व बिजली कार्य", labelEn: "Motor Pump Repair & Wiring" },
                  { id: 'craft', labelMr: "हस्तकला / हातमाग / मातीची भांडी", labelHi: "हस्तशिल्प / हथकरघा / मिट्टी के बर्तन", labelEn: "Handloom / Crafts / Pottery" },
                  { id: 'tech', labelMr: "स्मार्टफोन / संगणकाचे मूलभूत ज्ञान", labelHi: "स्मार्टफोन / कंप्यूटर का बुनियादी ज्ञान", labelEn: "Smartphone & Basic IT Operation" },
                  { id: 'none', labelMr: "कोणताही पूर्व अनुभव नाही (नवशिके)", labelHi: "कोई पूर्व अनुभव नहीं (शुरुआती युवा)", labelEn: "Fresher / Looking for first trade" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setExperience(item.id)}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                      experience === item.id
                        ? 'bg-purple-50 border-purple-600 text-purple-950 ring-2 ring-purple-200 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{isMr ? item.labelMr : isHi ? item.labelHi : item.labelEn}</span>
                      {experience === item.id && <Check className="w-4 h-4 text-purple-600" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="border border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100"
                >
                  {isMr ? "मागे" : isHi ? "पीछे" : "Back"}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow"
                >
                  <span>{isMr ? "पुढील पायरी: स्थान व जिल्हा" : isHi ? "अगला कदम: स्थान व जिला" : "Next Step: Location & District"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Dedicated Step 3: Location (स्थान एवं जिला) */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {isMr ? "तुमचे मूळ स्थान आणि जिल्हा (Location & District)" : isHi ? "आपका गृह स्थान एवं जिला (Location & District)" : "Your Location, District & State"}
                  </h3>
                </div>

                {/* GPS Auto-Detect Button */}
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-2xs self-start sm:self-auto"
                  title="Detect GPS location automatically"
                >
                  {isDetectingLocation ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                      <span>{isMr ? "स्थान ओळखले जात आहे..." : isHi ? "स्थान पहचाना जा रहा है..." : "Detecting GPS..."}</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isMr ? "माझे चालू स्थान वापरा (GPS)" : isHi ? "जीपीएस से स्वतः पहचानें" : "Auto-Detect My Location"}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-500">
                {isMr
                  ? "एआय तुमच्या जिल्ह्यातील कृषी-हवामान परिस्थिती, स्थानिक मागणी आणि जवळच्या केव्हीके/पीएमकेके प्रशिक्षण केंद्राच्या आधारे रोडमॅप तयार करेल."
                  : isHi
                  ? "एआई आपके गृह जिले की कृषि-जलवायु परिस्थितियों, स्थानीय मांग और निकटतम केवीके/पीएमकेके प्रशिक्षण केंद्र के आधार पर रोडमैप तैयार करेगा।"
                  : "AI calibrates the skill gap roadmap with your local district's agro-climatic demands and nearest KVK / PMKK centers."}
              </p>

              {/* State and District Dropdowns Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isMr ? "राज्य निवडा (Select State):" : isHi ? "राज्य चुनें (Select State):" : "Select State:"}
                  </label>
                  <select
                    value={stateName}
                    onChange={(e) => {
                      const newState = e.target.value;
                      setStateName(newState);
                      const defaultDistricts = stateDistrictsMap[newState] || [];
                      if (defaultDistricts.length > 0) {
                        setDistrict(defaultDistricts[0]);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {Object.keys(stateDistrictsMap).map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isMr ? "जिल्हा निवडा (Select District):" : isHi ? "जिला चुनें (Select District):" : "Select District:"}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {(stateDistrictsMap[stateName] || []).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Block / Panchayat & Pincode Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isMr ? "तालुका / ग्रामपंचायत (पर्यायी):" : isHi ? "ब्लॉक / तहसील / ग्राम पंचायत (वैकल्पिक):" : "Block / Tehsil / Village Panchayat (Optional):"}
                  </label>
                  <input
                    type="text"
                    value={blockPanchayat}
                    onChange={(e) => setBlockPanchayat(e.target.value)}
                    placeholder={isMr ? "उदा. पाटी तालुका / ग्राम सेजगाव" : isHi ? "उदा. पाटी ब्लॉक / ग्राम सेजगांव" : "e.g. Pati Block / Sejgaon village"}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isMr ? "पिन कोड (Pincode - पर्यायी):" : isHi ? "पिन कोड (Pincode - वैकल्पिक):" : "Pincode (Optional):"}
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="उदा. 451551"
                    maxLength={6}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Popular District Pills */}
              <div>
                <span className="block text-[11px] font-bold text-slate-600 mb-1.5">
                  {isMr ? "वारंवार निवडले जाणारे प्रमुख जिल्हे:" : isHi ? "अक्सर चुने जाने वाले प्रमुख आकांक्षी व ग्रामीण जिले:" : "Popular Skilling Hub Districts (1-Click):"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { st: 'मध्य प्रदेश (Madhya Pradesh)', d: 'बड़वानी (Barwani)' },
                    { st: 'मध्य प्रदेश (Madhya Pradesh)', d: 'सीहोर (Sehore)' },
                    { st: 'उत्तर प्रदेश (Uttar Pradesh)', d: 'वाराणसी (Varanasi)' },
                    { st: 'उत्तर प्रदेश (Uttar Pradesh)', d: 'बाराबंकी (Barabanki)' },
                    { st: 'राजस्थान (Rajasthan)', d: 'जयपुर (Jaipur)' },
                    { st: 'महाराष्ट्र (Maharashtra)', d: 'नागपुर (Nagpur)' },
                    { st: 'महाराष्ट्र (Maharashtra)', d: 'नासिक (Nashik)' },
                    { st: 'झारखंड (Jharkhand)', d: 'रांची (Ranchi)' },
                    { st: 'बिहार (Bihar)', d: 'पटना (Patna)' }
                  ].map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setStateName(p.st);
                        setDistrict(p.d);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                        district === p.d
                          ? 'bg-purple-100 text-purple-900 border-purple-400 font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      📍 {p.d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nearest Mapped KVK Box Preview */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-emerald-950 block">
                    {isMr ? `स्थान निश्चित: ${district}, ${stateName}` : isHi ? `स्थान चयनित: ${district}, ${stateName}` : `Location Confirmed: ${district}, ${stateName}`}
                  </span>
                  <span className="text-emerald-700 text-[11px]">
                    {isMr
                      ? "तुमच्या निवडलेल्या जिल्ह्यात स्थानिक केव्हीके आणि पीएमकेके कौशल्य केंद्रे सक्रिय आहेत आणि मोफत बॅचेस उपलब्ध आहेत."
                      : isHi
                      ? "आपके चयनित जिले में स्थानीय केवीके एवं पीएमकेके कौशल केंद्र सक्रिय हैं और निःशुल्क बैच उपलब्ध हैं।"
                      : "Active KVK and PMKK government centers with free boarding & stipends mapped in this district."}
                  </span>
                </div>
              </div>

              {/* Step 3 Navigation */}
              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="border border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100"
                >
                  {isMr ? "मागे: अनुभव" : isHi ? "पीछे: अनुभव" : "Back: Experience"}
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow"
                >
                  <span>{isMr ? "पुढील पायरी: उपजीविका ध्येय" : isHi ? "अगला कदम: आजीविका लक्ष्य" : "Next Step: Target Goal"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Livelihood Goal & AI Generation Trigger */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {isMr ? "तुम्ही कोणत्या उच्च-मागणी क्षेत्रात उपजीविका सुरू करू इच्छिता?" : isHi ? "आप किस उच्च-मांग वाले क्षेत्र में आजीविका स्थापित करना चाहते हैं?" : "Which high-demand livelihood sector would you like to pursue?"}
                </h3>
              </div>

              {/* Goal Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'drone', labelMr: "किसान ड्रोन पायलट व ॲग्रीटेक ऑपरेटर", labelHi: "किसान ड्रोन पायलट एवं एग्रीटेक स्प्रेयर", labelEn: "Kisan Drone Pilot (DGCA Certified)", badge: isMr ? "₹२५k - ₹४५k/महिना" : "₹25k - ₹45k/माह" },
                  { id: 'solar', labelMr: "सूर्य मित्र - सोलर वॉटर पंप तंत्रज्ञ", labelHi: "सूर्य मित्र - सोलर वाटर पंप तकनीशियन", labelEn: "Surya Mitra Solar Pump Specialist", badge: isMr ? "₹२०k - ₹३५k/महिना" : "₹20k - ₹35k/माह" },
                  { id: 'dairy', labelMr: "व्यावसायिक डेअरी फार्म व दुग्ध व्यवस्थापन", labelHi: "व्यावसायिक डेयरी फार्म व दुग्ध संग्रह", labelEn: "Commercial Dairy Farm Supervisor", badge: isMr ? "₹१८k - ₹३२k/महिना" : "₹18k - ₹32k/माह" },
                  { id: 'food', labelMr: "भरडधान्य (मिलेट्स) अन्न प्रक्रिया उद्यमी", labelHi: "श्रीअन्न (मिलेट्स) खाद्य प्रसंस्करण उद्यमी", labelEn: "Shree Anna Millets Food Processing", badge: isMr ? "३५% अनुदान" : "35% सब्सिडी" },
                  { id: 'organic', labelMr: "प्रमाणित सेंद्रिय शेती व गांडूळखत", labelHi: "प्रमाणित जैविक खेती एवं वर्मीकम्पोस्ट", labelEn: "Certified Organic Agriculture", badge: isMr ? "उच्च मागणी" : "उच्च बाजार मांग" },
                  { id: 'polyhouse', labelMr: "स्मार्ट पॉलीहाऊस व संरक्षित फलोत्पादन", labelHi: "स्मार्ट पॉलीहाउस व संरक्षित बागवानी", labelEn: "Smart Polyhouse & Protected Cultivation", badge: isMr ? "भाजीपाला क्लस्टर" : "सब्जी-फल क्लस्टर" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setGoal(item.id)}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all relative ${
                      goal === item.id
                        ? 'bg-purple-50 border-purple-600 text-purple-950 ring-2 ring-purple-200 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{isMr ? item.labelMr : isHi ? item.labelHi : item.labelEn}</span>
                      <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Personal Notes / Ambition input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isMr ? "अतिरिक्त आकांक्षा / विशिष्ट योजना (पर्यायी):" : isHi ? "अतिरिक्त आकांक्षा / विशिष्ट योजना (वैकल्पिक):" : "Personal Ambition / Specific Note (Optional):"}
                </label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder={isMr ? "उदा. गावात कस्टम हायरिंग केंद्र सुरू करायचे आहे / बचत गटाशी जोडलेला आहे" : isHi ? "उदा. गाँव में कस्टम हायरिंग सेंटर खोलना है / SHG से जुड़ा हूँ" : "e.g. want to open service center in village / SHG member"}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* Input Data Summary Confirmation for AI */}
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-amber-50 border border-purple-200 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-2 mb-2 font-bold text-purple-950">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'hi' ? "एआई को दिया जा रहा आपका संपूर्ण इनपुट प्रोफाइल:" : lang === 'mr' ? "एआयला दिलेले तुमचे संपूर्ण इनपुट प्रोफाइल:" : "Complete Input Profile Passed to Gemini AI:"}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                    <span className="text-slate-500 block">{lang === 'hi' ? "1. शिक्षा:" : lang === 'mr' ? "१. शिक्षण:" : "1. Education:"}</span>
                    <span className="font-bold text-slate-900">{EDUCATION_LABELS[education]?.[lang] || EDUCATION_LABELS[education]?.['hi'] || education}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                    <span className="text-slate-500 block">{lang === 'hi' ? "2. अनुभव:" : lang === 'mr' ? "२. अनुभव:" : "2. Experience:"}</span>
                    <span className="font-bold text-slate-900">{EXPERIENCE_LABELS[experience]?.[lang] || EXPERIENCE_LABELS[experience]?.['hi'] || experience}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                    <span className="text-slate-500 block">{lang === 'hi' ? "3. स्थान:" : lang === 'mr' ? "३. स्थान:" : "3. Location:"}</span>
                    <span className="font-bold text-slate-900">{district}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                    <span className="text-slate-500 block">{lang === 'hi' ? "4. लक्ष्य:" : lang === 'mr' ? "४. ध्येय:" : "4. Goal:"}</span>
                    <span className="font-bold text-slate-900">{GOAL_LABELS[goal]?.[lang] || GOAL_LABELS[goal]?.['hi'] || goal}</span>
                  </div>
                </div>
              </div>

              {/* Navigation and AI Trigger */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3">
                <button
                  onClick={() => setStep(3)}
                  disabled={isAnalyzing}
                  className="border border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 self-start sm:self-auto"
                >
                  {isMr ? "मागे: स्थान" : isHi ? "पीछे: स्थान" : "Back: Location"}
                </button>

                <div className="w-full sm:w-auto flex flex-col items-end gap-1.5">
                  <button
                    onClick={handleGenerateRoadmap}
                    disabled={isAnalyzing}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white px-7 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
                        <span>{isMr ? "जेमिनी एआय विश्लेषण सुरू आहे..." : isHi ? "जेमिनी एआई विश्लेषण जारी है..." : "Gemini AI Generating Pathway..."}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                        <span>{isMr ? "जेमिनी एआय द्वारे वैयक्तिक रोडमॅप तयार करा" : isHi ? "जेमिनी एआई से व्यक्तिगत रोडमैप तैयार करें" : "Generate AI Personalized Roadmap"}</span>
                      </>
                    )}
                  </button>

                  {isAnalyzing && (
                    <span className="text-[11px] font-semibold text-purple-700 animate-pulse text-center sm:text-right">
                      {aiStatusMsg}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Enhanced Diagnostic Result & Reconstructed AI Roadmap */}
          {step === 5 && roadmap && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* 🔊 Audio Narration Player Bar (Option 1) */}
              <div className={`no-print p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md ${
                isSpeakingRoadmap 
                  ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white border-amber-300 ring-2 ring-amber-300/40' 
                  : 'bg-white border-purple-200 text-slate-800 hover:border-purple-300'
              }`}>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleToggleAudioRoadmap}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow transition-all shrink-0 cursor-pointer ${
                      isSpeakingRoadmap 
                        ? 'bg-white text-orange-600 hover:bg-slate-100 hover:scale-105' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white hover:scale-105'
                    }`}
                    title={isSpeakingRoadmap ? "आवाज़ रोकें (Stop Audio)" : "रोडमैप बोलकर सुनें (Listen Audio)"}
                  >
                    {isSpeakingRoadmap ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black uppercase tracking-wider ${isSpeakingRoadmap ? 'text-white' : 'text-purple-950'}`}>
                        {isMr ? "रोडमॅप व्हॉइस नॅरेशन (ऑडिओ ऐका)" : isHi ? "रोडमैप वॉयस नैरेशन (ऑडियो सुनें)" : "Audio Roadmap Narration (Voice)"}
                      </span>
                      {isSpeakingRoadmap ? (
                        <span className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase animate-ping">
                          LIVE
                        </span>
                      ) : (
                        <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
                          {isMr ? "सुलभता मोड" : isHi ? "ग्रामीण व सुलभ" : "Accessibility Mode"}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 font-medium ${isSpeakingRoadmap ? 'text-amber-100' : 'text-slate-500'}`}>
                      {isSpeakingRoadmap 
                        ? (isMr ? "सक्षम साथी तुमचा ४-टप्प्यांचा करिअर रोडमॅप वाचून दाखवत आहे..." : isHi ? "सक्षम साथी आपका 4-चरणीय करियर रोडमैप बोलकर सुना रहा है..." : "Saksham Sathi is reading your career roadmap aloud...")
                        : (isMr ? "संपूर्ण ४-टप्प्यांचा करिअर रोडमॅप, उत्पन्न वाढ आणि सरकारी योजना ऑडिओमध्ये ऐका." : isHi ? "पूरा 4-चरणीय करियर रोडमैप, आय वृद्धि और सरकारी लिंकेज बोलकर सुनें।" : "Listen to your complete 4-phase pathway, income leap, and scheme linkages in audio.")
                      }
                    </p>
                  </div>
                </div>

                {/* Animated Waveform & Toggle Control */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                  {isSpeakingRoadmap && (
                    <div className="flex items-center gap-1 h-6 px-3 py-1 bg-black/25 rounded-full">
                      <div className="w-1 bg-white rounded-full animate-wave-1 h-3" />
                      <div className="w-1 bg-white rounded-full animate-wave-2 h-5" />
                      <div className="w-1 bg-white rounded-full animate-wave-3 h-4" />
                      <div className="w-1 bg-white rounded-full animate-wave-4 h-6" />
                      <div className="w-1 bg-white rounded-full animate-wave-5 h-3" />
                    </div>
                  )}

                  <button
                    onClick={handleToggleAudioRoadmap}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isSpeakingRoadmap 
                        ? 'bg-black/25 hover:bg-black/35 text-white' 
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-200'
                    }`}
                  >
                    {isSpeakingRoadmap ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isSpeakingRoadmap ? (isMr ? "थांबवा (Stop)" : isHi ? "रोकें (Stop)" : "Stop Audio") : (isMr ? "ऐका (Play)" : isHi ? "रोडमैप सुनें (Play)" : "Listen Audio")}</span>
                  </button>
                </div>
              </div>

              {/* Recommendation Header Card */}
              <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-gov-navy text-white rounded-2xl p-6 shadow-xl border border-purple-500/40 relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3 text-slate-950" />
                      <span>{isMr ? "जेमिनी एआय वैयक्तिक विश्लेषण" : isHi ? "जेमिनी एआई व्यक्तिगत निदान" : "Gemini AI Diagnostic"}</span>
                    </span>
                    {roadmap.source && (
                      <span className="text-[10px] bg-white/10 text-purple-200 px-2 py-0.5 rounded font-mono">
                        {roadmap.source}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handlePrint}
                    className="no-print bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{isMr ? "प्रिंट / सेव्ह अहवाल" : isHi ? "प्रिंट / सेव रिपोर्ट" : "Print / Save PDF"}</span>
                  </button>
                </div>

                {/* Candidate Inputs Badge Bar */}
                <div className="flex items-center gap-2 flex-wrap text-[11px] text-purple-200 mt-2 mb-3 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="font-semibold text-amber-300">{lang === 'hi' ? "इनपुट प्रोफाइल:" : lang === 'mr' ? "इनपुट प्रोफाइल:" : "Input Profile:"}</span>
                  <span>{EDUCATION_LABELS[education]?.[lang] || EDUCATION_LABELS[education]?.['hi'] || education}</span>
                  <span>•</span>
                  <span>{EXPERIENCE_LABELS[experience]?.[lang] || EXPERIENCE_LABELS[experience]?.['hi'] || experience}</span>
                  <span>•</span>
                  <span>📍 {district}, {stateName}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {roadmap.targetRole}
                </h2>
                
                {/* Income Leap Comparison */}
                <div className="mt-4 pt-3 border-t border-purple-500/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                    <span className="text-purple-200 block text-[11px]">{lang === 'mr' ? "सध्याचे अनौपचारिक उत्पन्न:" : isHi ? "वर्तमान अनौपचारिक आय:" : "Current Informal Earnings:"}</span>
                    <span className="font-bold text-red-300 text-sm">{roadmap.baselineWage}</span>
                  </div>
                  <div className="bg-emerald-500/25 border border-emerald-400/50 p-3 rounded-xl">
                    <span className="text-emerald-200 block text-[11px] font-semibold">{lang === 'mr' ? "प्रमाणपत्रानंतर संभाव्य मासिक उत्पन्न:" : isHi ? "प्रमाणन उपरांत संभावित मासिक आय:" : "Projected Certified Monthly Income:"}</span>
                    <span className="font-extrabold text-emerald-300 text-base">{roadmap.expectedMonthlyIncome}</span>
                  </div>
                </div>
              </div>

              {/* Saksham AI Personalized Advisory Card */}
              {roadmap.aiPersonalizedAdvice && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300/80 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    <h4 className="text-xs sm:text-sm font-extrabold text-orange-950 uppercase tracking-wide">
                      {lang === 'hi' ? "सक्षम एआई की व्यक्तिगत सलाह (AI Advisory Note):" : lang === 'mr' ? "सक्षम एआयचा वैयक्तिक सल्ला (AI Advisory Note):" : "Saksham AI Personalized Recommendation:"}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {roadmap.aiPersonalizedAdvice}
                  </p>
                </div>
              )}

              {/* 360 Degree Diagnostic Gaps */}
              <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-sm text-purple-950 flex items-center gap-2 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-purple-700" />
                  <span>{lang === 'hi' ? "कौशल अंतर का एआई तकनीकी विश्लेषण (Gap Analysis):" : lang === 'mr' ? "कौशल्य तफावत एआय तांत्रिक विश्लेषण (Gap Analysis):" : "3-Point Technical Gap Analysis:"}</span>
                </h4>
                <div className="space-y-2.5">
                  {roadmap.diagnosticGaps?.map((gap, i) => (
                    <div key={i} className="bg-white p-3.5 rounded-xl border border-purple-100 text-xs shadow-2xs">
                      <span className="font-bold text-purple-900 block mb-1 text-xs sm:text-sm">{gap.area}</span>
                      <p className="text-slate-700 leading-relaxed">{gap.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Action Roadmap */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <span>{lang === 'hi' ? "4-चरणीय आजीविका प्रगति रोडमैप:" : lang === 'mr' ? "४-टप्प्यांचा उपजीविका प्रगती रोडमॅप:" : "4-Phase Progression Roadmap:"}</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {lang === 'hi' ? `लक्ष्य: ${district} में आजीविका स्थापना` : lang === 'mr' ? `ध्येय: ${district} मध्ये उपजीविका` : `Target: Enterprise in ${district}`}
                  </span>
                </div>

                <div className="space-y-3">
                  {roadmap.steps?.map((st, i) => (
                    <div
                      key={i}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/80 hover:bg-white transition-all flex items-start gap-3.5 shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{st.phase}</h5>
                          <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                            {st.duration}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                          {st.stipend}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Government Schemes */}
              {roadmap.governmentSchemes && roadmap.governmentSchemes.length > 0 && (
                <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-bold text-slate-800 shrink-0">
                    {lang === 'hi' ? "अनुशंसित सरकारी योजनाएं:" : lang === 'mr' ? "शिफारस केलेल्या सरकारी योजना:" : "Linked Govt Schemes:"}
                  </span>
                  {roadmap.governmentSchemes.map((scm, idx) => (
                    <span key={idx} className="bg-white border border-slate-300 text-gov-blue font-bold px-2.5 py-1 rounded-md shadow-2xs">
                      ✓ {scm}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleStartOver}
                  className="border border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  {lang === 'hi' ? "पुनः जांचें / इनपुट बदलें" : lang === 'mr' ? "पुन्हा तपासा / इनपुट बदला" : "Start Over / Edit Inputs"}
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Official Learner Pass CTA */}
                  <button
                    onClick={() => setIsPassModalOpen(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? "आधिकारिक लर्नर पास प्राप्त करें" : lang === 'mr' ? "अधिकृत लर्नर पास मिळवा" : "Get Official Learner Pass"}</span>
                  </button>

                  <button
                    onClick={() => onNavigate('map')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    {lang === 'hi' ? "नजदीकी केवीके केंद्र मैप देखें" : lang === 'mr' ? "जवळचे केव्हीके केंद्र नकाशा पहा" : "View Center on Map"}
                  </button>
                  <button
                    onClick={() => onNavigate('skilling')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    {lang === 'hi' ? "इस कोर्स में आवेदन करें" : lang === 'mr' ? "या अभ्यासक्रमासाठी अर्ज करा" : "Apply for Training"}
                  </button>
                </div>
              </div>

              {/* Official NSQF Learner Pass Modal */}
              {isPassModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
                  <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border-2 border-amber-500 overflow-hidden max-h-[92vh] flex flex-col">
                    
                    {/* Pass Modal Header */}
                    <div className="bg-gradient-to-r from-gov-navy via-slate-900 to-gov-navy text-white px-5 py-3.5 flex items-center justify-between border-b border-amber-500/40">
                      <div className="flex items-center gap-2.5">
                        <Award className="w-5 h-5 text-amber-300" />
                        <div>
                          <h3 className="font-bold text-sm sm:text-base">
                            {lang === 'hi' ? "आधिकारिक ग्राम सक्षम लर्नर पहचान पत्र एवं रोडमैप" : lang === 'mr' ? "अधिकृत ग्राम सक्षम लर्नर ओळखपत्र व करिअर रोडमॅप" : "Official GramSaksham Learner Pass & Career Roadmap"}
                          </h3>
                          <p className="text-[10px] text-amber-300">
                            {lang === 'hi' ? "कौशल विकास एवं उद्यमशीलता मंत्रालय • ग्रामीण विकास मंत्रालय, भारत सरकार" : lang === 'mr' ? "कौशल्य विकास आणि उद्योजकता मंत्रालय • ग्रामीण विकास मंत्रालय, भारत सरकार" : "Ministry of Skill Development & MoRD, Government of India"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsPassModalOpen(false)}
                        className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 text-xl font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Pass Card Container */}
                    <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50">
                      
                      {/* Physical Card Mockup - Printed Cleanly to PDF */}
                      <div id="printable-learner-pass" className="bg-gradient-to-br from-amber-50/90 via-white to-orange-50/90 border-2 border-amber-500 rounded-2xl p-5 shadow-md relative overflow-hidden">
                        
                        {/* Tiranga Stripe on Top */}
                        <div className="tiranga-stripe w-full rounded-t-lg -mt-5 -mx-5 mb-4" style={{ width: 'calc(100% + 2.5rem)' }} />

                        {/* Top ID Card Bar */}
                        <div className="flex items-center justify-between border-b-2 border-amber-500/40 pb-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <AshokaEmblem className="h-11 w-auto" />
                            <img
                              src="/logo.png"
                              alt="GramSaksham Portal Logo"
                              className="w-10 h-10 rounded-full border-2 border-emerald-600 shadow-xs object-cover"
                            />
                            <div>
                              <span className="text-[10px] font-extrabold text-orange-950 tracking-wider uppercase block">
                                {isMr ? "भारत सरकार • कौशल्य विकास व ग्रामीण विकास मंत्रालय" : isHi ? "भारत सरकार • कौशल विकास एवं ग्रामीण विकास मंत्रालय" : "Govt of India • MSDE & MoRD"}
                              </span>
                              <span className="text-xs sm:text-sm font-black text-slate-900">
                                {isMr ? "ग्राम सक्षम लर्नर ओळखपत्र (AI Career Pass)" : isHi ? "ग्राम सक्षम लर्नर पहचान पत्र (AI Career Pass)" : "GramSaksham Official Learner Pass"}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-300 inline-block shadow-2xs">
                              {isMr ? "✓ NSQF अधिकृत" : "✓ NSQF अधिकृत"}
                            </span>
                            <span className="text-[9px] font-mono text-slate-600 block mt-0.5">
                              ID: GS-2026-{roadmap.matchedCourse?.id || 'NSQF'}-8920
                            </span>
                          </div>
                        </div>

                        {/* Candidate Bio & Target Role Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                          <div className="sm:col-span-2 bg-white/95 p-3 rounded-xl border border-amber-200 shadow-2xs">
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">
                              {isMr ? "मंजूर एनएसक्यूएफ कोर्स व जॉब रोल:" : isHi ? "अनुमोदित एनएसक्यूएफ कोर्स व जॉब रोल:" : "Approved NSQF Course & Role:"}
                            </span>
                            <span className="font-extrabold text-slate-900 text-sm block">
                              {roadmap.targetRole}
                            </span>
                            <span className="text-[11px] text-orange-700 font-semibold mt-0.5 block">
                              {roadmap.matchedCourse?.sector || "कौशल विकास"} • NSQF स्तर {roadmap.matchedCourse?.nsqfLevel || 4}
                            </span>
                          </div>

                          <div className="bg-white/95 p-3 rounded-xl border border-amber-200 flex flex-col justify-center text-center shadow-2xs">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">
                              {isMr ? "मासिक सरकारी विद्यावेतन" : "मासिक सरकारी स्टाइपेंड"}
                            </span>
                            <span className="text-base font-black text-emerald-700">
                              {roadmap.matchedCourse?.stipend || "₹250/दिन"}
                            </span>
                            <span className="text-[9px] text-slate-500">
                              {isMr ? "थेट डीबीटी बँक खात्यात" : "प्रत्यक्ष डीबीटी बैंक खाते में"}
                            </span>
                          </div>
                        </div>

                        {/* Candidate Details & Wage Leap Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] mb-3">
                          <div className="bg-amber-100/60 p-2 rounded-lg border border-amber-200">
                            <span className="text-slate-500 text-[10px] block">{isMr ? "जिल्हा व राज्य" : "जिला व राज्य"}</span>
                            <span className="font-bold text-slate-900">{district}</span>
                          </div>
                          <div className="bg-amber-100/60 p-2 rounded-lg border border-amber-200">
                            <span className="text-slate-500 text-[10px] block">{isMr ? "प्रशिक्षण कालावधी" : "प्रशिक्षण अवधि"}</span>
                            <span className="font-bold text-slate-900">{roadmap.matchedCourse?.durationWeeks || 6} {isMr ? "आठवडे" : "सप्ताह"}</span>
                          </div>
                          <div className="bg-amber-100/60 p-2 rounded-lg border border-amber-200">
                            <span className="text-slate-500 text-[10px] block">{isMr ? "शैक्षणिक पात्रता" : "शैक्षणिक योग्यता"}</span>
                            <span className="font-bold text-slate-900">{EDUCATION_LABELS[education]?.[lang] || EDUCATION_LABELS[education]?.[isHi ? 'hi' : 'en'] || education}</span>
                          </div>
                          <div className="bg-emerald-100/70 p-2 rounded-lg border border-emerald-300">
                            <span className="text-emerald-800 text-[10px] font-bold block">{isMr ? "संभाव्य उत्पन्न" : "संभावित आय"}</span>
                            <span className="font-black text-emerald-900">{roadmap.expectedMonthlyIncome}</span>
                          </div>
                        </div>

                        {/* 4-Phase Roadmap Summary for PDF Print */}
                        <div className="bg-white/90 p-3 rounded-xl border border-amber-200 text-xs mb-3">
                          <span className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wide block mb-1.5">
                            {isMr ? "४-टप्प्यांची उपजीविका प्रगती योजना (4-Phase Progression Plan):" : isHi ? "४-चरणीय आजीविका प्रगति योजना (4-Phase Progression Plan):" : "4-Phase Progression Roadmap:"}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                            {roadmap.steps?.slice(0, 4).map((st, i) => (
                              <div key={i} className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded border border-slate-200">
                                <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                                  {i + 1}
                                </span>
                                <span className="font-bold text-slate-900 truncate">{st.phase}</span>
                                <span className="text-purple-700 font-semibold text-[10px] ml-auto shrink-0">{st.duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* QR Code, Center Footer & Official Stamp */}
                        <div className="pt-2.5 border-t border-amber-300 flex items-center justify-between gap-3 text-xs bg-white/80 p-2.5 rounded-xl">
                          <div className="flex items-center gap-2.5">
                            <div className="w-12 h-12 bg-slate-900 rounded-lg p-1 shrink-0 flex items-center justify-center">
                              <div className="w-10 h-10 border-2 border-amber-400 rounded flex flex-col items-center justify-center text-[7px] text-amber-300 font-mono font-bold leading-tight text-center">
                                <span>QR</span>
                                <span>VERIFIED</span>
                              </div>
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block text-[11px]">
                                {isMr ? `मान्य: कृषी विज्ञान केंद्र (KVK) व PMKK, ${district}` : isHi ? `मान्य: कृषि विज्ञान केंद्र (KVK) व PMKK, ${district}` : `Valid at KVK & PMKK Hub, ${district}`}
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                {isMr ? "राष्ट्रीय कौशल्य टोल-फ्री हेल्पलाईन: १८००-१२३-९६२६" : "राष्ट्रीय कौशल टोल-फ्री हेल्पलाइन: 1800-123-9626"}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="border border-orange-400 bg-orange-50 text-orange-900 text-[10px] font-black px-2 py-1 rounded block uppercase">
                              {isMr ? "★ कौशल्य भारत २०२६ ★" : "★ कौशल भारत 2026 ★"}
                            </span>
                            <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">
                              {isMr ? "मुद्रा कर्ज ₹३L मंजूर जोडणी" : "मुद्रा ऋण ₹3L स्वीकृत लिंकेज"}
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* Share and Print Actions */}
                      <div className="flex items-center justify-between gap-2 pt-2 no-print">
                        <button
                          onClick={() => {
                            const shareText = isMr
                              ? `*ग्राम सक्षम (GramSaksham) अधिकृत लर्नर पास*\nअभ्यर्थी जिल्हा: ${district}\nमंजूर अभ्यासक्रम: ${roadmap.targetRole}\nNSQF स्तर: ${roadmap.matchedCourse?.nsqfLevel || 4}\nमासिक विद्यावेतन: ${roadmap.matchedCourse?.stipend || "₹२५०/दिवस"}\nप्रमाणपत्रानंतर उत्पन्न: ${roadmap.expectedMonthlyIncome}\nटोल-फ्री हेल्पलाईन: १८००-१२३-९६२६\nवेबसाइट: https://gramsaksham.gov.in`
                              : `*ग्राम सक्षम (GramSaksham) आधिकारिक लर्नर पास*\nअभ्यर्थी जिला: ${district}\nअनुमोदित कोर्स: ${roadmap.targetRole}\nNSQF स्तर: ${roadmap.matchedCourse?.nsqfLevel || 4}\nमासिक स्टाइपेंड: ${roadmap.matchedCourse?.stipend || "₹250/दिन"}\nप्रमाणन उपरांत आय: ${roadmap.expectedMonthlyIncome}\nटोल-फ्री हेल्पलाइन: 1800-123-9626\nपोर्टल: https://gramsaksham.gov.in`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>{isMr ? "व्हॉट्सॲपवर शेअर करा" : isHi ? "व्हाट्सएप पर शेयर करें" : "Share on WhatsApp"}</span>
                        </button>

                        <button
                          onClick={handlePrint}
                          className="bg-gov-navy hover:bg-slate-800 text-white text-xs px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                          <span>{isMr ? "पास प्रिंट / सेव्ह PDF" : isHi ? "पास प्रिंट / सेव PDF" : "Print / Save PDF Pass"}</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

