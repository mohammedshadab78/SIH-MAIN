import { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  X, 
  Sparkles, 
  RefreshCw, 
  Award, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Globe,
  Gauge
} from 'lucide-react';
import { speechManager } from '../lib/speechService';
import { askChatbotGemini } from '../lib/aiService';
import { translations } from '../data/translations';

const AI_LANGUAGES = [
  { code: 'hi', speechCode: 'hi-IN', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', speechCode: 'en-IN', label: 'English', flag: '🇬🇧' },
  { code: 'mr', speechCode: 'mr-IN', label: 'मराठी', flag: '🚩' },
  { code: 'bn', speechCode: 'bn-IN', label: 'বাংলা', flag: '🌾' },
  { code: 'te', speechCode: 'te-IN', label: 'తెలుగు', flag: '🌊' }
];

export default function VoiceAssistantModal({
  isOpen,
  onClose,
  lang = 'hi',
  t,
  onNavigate
}) {
  // Separate choice system for AI Voice Assistant
  const [aiLang, setAiLang] = useState(lang);
  const [speechLang, setSpeechLang] = useState('hi-IN');
  const [speechRate, setSpeechRate] = useState(0.95);

  // Active translation dictionary for the chosen AI language
  const activeAiTrans = translations[aiLang]?.voiceModal || translations.hi.voiceModal;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: activeAiTrans.greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      matchedCourses: [],
      matchedCenters: []
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);

  const messagesEndRef = useRef(null);

  // Sync speechLang when modal opens or portal lang changes initially
  useEffect(() => {
    const localeMap = {
      hi: 'hi-IN',
      en: 'en-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      te: 'te-IN'
    };
    setAiLang(lang);
    setSpeechLang(localeMap[lang] || 'hi-IN');
  }, [lang]);

  // Handle explicit AI Voice Assistant Language change
  const handleSelectAiLanguage = (newLangCode) => {
    const found = AI_LANGUAGES.find(l => l.code === newLangCode);
    if (!found) return;

    setAiLang(found.code);
    setSpeechLang(found.speechCode);

    // Update initial greeting or append a language switch confirmation
    const newTrans = translations[found.code]?.voiceModal || translations.hi.voiceModal;
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'bot',
        text: newTrans.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedCourses: [],
        matchedCenters: []
      }
    ]);

    // Speak the greeting in the newly selected language
    speechManager.stopSpeaking();
    speechManager.speak(newTrans.greeting, {
      lang: found.code,
      rate: speechRate,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false)
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);

  // Clean up speech on close
  useEffect(() => {
    if (!isOpen) {
      speechManager.stopListening();
      speechManager.stopSpeaking();
      setIsListening(false);
      setIsSpeaking(false);
      setCurrentlyPlayingId(null);
    }
  }, [isOpen]);

  const handleToggleListening = () => {
    if (isListening) {
      speechManager.stopListening();
      setIsListening(false);
    } else {
      speechManager.stopSpeaking();
      setIsSpeaking(false);
      setCurrentlyPlayingId(null);
      setInterimTranscript('');

      speechManager.startListening({
        lang: speechLang,
        onResult: ({ text, interim }) => {
          setInterimTranscript(interim);
          if (text && text.trim()) {
            setInputQuery(text);
          }
        },
        onEnd: () => {
          setIsListening(false);
          setInterimTranscript('');
          if (inputQuery.trim()) {
            handleSendMessage();
          }
        },
        onError: () => {
          setIsListening(false);
          setInterimTranscript('');
        }
      });
      setIsListening(true);
    }
  };

  const handleSendMessage = async (customText = null) => {
    const query = customText || inputQuery;
    if (!query || !query.trim() || isProcessing) return;

    // User Message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setInterimTranscript('');
    setIsProcessing(true);

    try {
      const response = await askChatbotGemini({
        message: query.trim(),
        history: messages,
        language: aiLang
      });

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedCourses: response.matchedCourses || [],
        matchedCenters: response.matchedCenters || []
      };

      setMessages((prev) => [...prev, botMsg]);

      // Automatically speak bot response in the selected AI language
      speechManager.speak(response.reply, {
        lang: aiLang,
        rate: speechRate,
        onStart: () => {
          setIsSpeaking(true);
          setCurrentlyPlayingId(botMsg.id);
        },
        onEnd: () => {
          setIsSpeaking(false);
          setCurrentlyPlayingId(null);
        }
      });

    } catch (err) {
      console.error("AI Error:", err);
      const fallbackMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: aiLang === 'hi'
          ? "नमस्ते! सीहोर व मध्य प्रदेश में किसान ड्रोन, सोलर पंप और डेयरी फार्मिंग के निःशुल्क PMKVY 4.0 कौशल बैच शुरू हैं। आप इनमें से क्या सीखना चाहते हैं?"
          : "Hello! PMKVY 4.0 certified skilling batches in Kisan Drone, Solar Pump, and Dairy Farming are active. What would you like to enroll in?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedCourses: [],
        matchedCenters: []
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlayMessageAudio = (msg) => {
    if (currentlyPlayingId === msg.id && isSpeaking) {
      speechManager.stopSpeaking();
      setIsSpeaking(false);
      setCurrentlyPlayingId(null);
      return;
    }

    speechManager.speak(msg.text, {
      lang: aiLang,
      rate: speechRate,
      onStart: () => {
        setIsSpeaking(true);
        setCurrentlyPlayingId(msg.id);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setCurrentlyPlayingId(null);
      }
    });
  };

  if (!isOpen) return null;

  const currentPrompts = activeAiTrans.quickPrompts || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border-2 border-orange-500 flex flex-col h-[90vh] max-h-[740px] overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-gov-navy via-gov-blue to-slate-900 text-white px-4 py-3 sm:px-6 flex items-center justify-between border-b border-orange-500/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Mic className="w-5 h-5" />
              </div>
              {isListening && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg tracking-tight">
                  {activeAiTrans.title || "सक्षम साथी (Saksham Sathi)"}
                </h3>
                <span className="bg-orange-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                  SIH 2026
                </span>
              </div>
              <p className="text-xs text-amber-200">
                {activeAiTrans.subtitle || "Multilingual Voice Skilling Assistant"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Control */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded border border-slate-600 text-amber-200 text-xs">
              <Gauge className="w-3 h-3 text-slate-400" />
              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="bg-transparent text-amber-200 text-xs focus:outline-none cursor-pointer"
                title="Voice Speed"
              >
                <option value="0.8" className="bg-slate-800 text-white">0.8x</option>
                <option value="0.95" className="bg-slate-800 text-white">1.0x</option>
                <option value="1.15" className="bg-slate-800 text-white">1.2x</option>
              </select>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Voice Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SEPARATE CHOICE SYSTEM FOR AI VOICE ASSISTANT */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-orange-200 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-orange-950">
            <Globe className="w-3.5 h-3.5 text-orange-600" />
            <span>{activeAiTrans.assistantLangChoice || "AI वॉयस भाषा चुनें (Choose AI Voice):"}</span>
          </div>

          {/* 5 Distinct Language Choice Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {AI_LANGUAGES.map((langItem) => {
              const isSelected = aiLang === langItem.code;
              return (
                <button
                  key={langItem.code}
                  type="button"
                  onClick={() => handleSelectAiLanguage(langItem.code)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-md ring-2 ring-orange-300 scale-105'
                      : 'bg-white text-slate-700 hover:bg-orange-100 hover:text-orange-900 border border-slate-200'
                  }`}
                  title={`Speak & listen in ${langItem.label}`}
                >
                  <span>{langItem.flag}</span>
                  <span>{langItem.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Bar with Soundwave Visualizer */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-ping' : isSpeaking ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="font-semibold text-slate-800">
              {isListening ? (activeAiTrans.listeningStatus || "Listening... Speak now") : 
               isSpeaking ? (activeAiTrans.speakingStatus || "Speaking response aloud...") : 
               isProcessing ? (activeAiTrans.thinkingStatus || "Thinking...") : 
               (activeAiTrans.readyStatus || "Click mic to speak or type query")}
            </span>

            {/* Live Animated Audio Waveform */}
            {(isListening || isSpeaking) && (
              <div className="inline-flex items-center gap-0.5 ml-2 px-2 py-0.5 bg-amber-200/60 rounded-full border border-amber-300">
                <span className="w-1 bg-orange-600 rounded-full animate-pulse h-2.5" />
                <span className="w-1 bg-amber-600 rounded-full animate-bounce h-3.5" />
                <span className="w-1 bg-orange-500 rounded-full animate-pulse h-2" />
                <span className="w-1 bg-amber-700 rounded-full animate-bounce h-4" />
                <span className="w-1 bg-orange-600 rounded-full animate-pulse h-2.5" />
                <span className="text-[9px] font-bold text-amber-900 ml-1">
                  {isListening ? "MIC REC" : "AI AUDIO"}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-emerald-700 font-bold text-[10px] sm:text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Voice AI Active</span>
            </span>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} animate-fadeIn`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                      : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-tr-xs font-medium'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Audio Replay Button for Bot Messages */}
                  {isBot && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handlePlayMessageAudio(msg)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          currentlyPlayingId === msg.id && isSpeaking
                            ? 'bg-amber-100 text-amber-900 font-extrabold'
                            : 'text-orange-700 hover:bg-orange-50'
                        }`}
                      >
                        {currentlyPlayingId === msg.id && isSpeaking ? (
                          <>
                            <VolumeX className="w-3 h-3 text-red-500" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-orange-600" />
                            <span>Listen Again</span>
                          </>
                        )}
                      </button>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                  )}

                  {/* If courses are recommended */}
                  {isBot && msg.matchedCourses && msg.matchedCourses.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-orange-600" />
                        <span>Recommended NSQF Course:</span>
                      </p>
                      {msg.matchedCourses.slice(0, 1).map((c) => (
                        <div
                          key={c.id}
                          className="bg-orange-50/70 border border-orange-200 rounded-lg p-2 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {aiLang === 'en' ? c.title : (c.titleHi || c.title)}
                            </span>
                            <span className="text-[10px] text-orange-800 font-semibold">
                              NSQF Level {c.nsqfLevel} • {c.stipend}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              onClose();
                              onNavigate('skilling');
                            }}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-[10px] font-bold shrink-0 ml-2 cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* If training centers are recommended */}
                  {isBot && msg.matchedCenters && msg.matchedCenters.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Nearby Center:</span>
                      </p>
                      {msg.matchedCenters.slice(0, 1).map((ctr) => (
                        <div
                          key={ctr.id}
                          className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-2 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {ctr.nameHi || ctr.name}
                            </span>
                            <span className="text-[10px] text-emerald-800">
                              {ctr.village || ctr.district}, MP
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              onClose();
                              onNavigate('map');
                            }}
                            className="text-emerald-700 hover:text-emerald-800 font-bold text-[10px] underline ml-2 cursor-pointer"
                          >
                            Map
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {/* Real-time Interim Voice Speech Feedback */}
          {isListening && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-3 animate-pulse">
              <div className="flex items-center gap-1 h-5">
                <span className="w-1 bg-orange-600 rounded-full animate-wave-1 h-4" />
                <span className="w-1 bg-orange-600 rounded-full animate-wave-2 h-5" />
                <span className="w-1 bg-orange-600 rounded-full animate-wave-3 h-3" />
                <span className="w-1 bg-orange-600 rounded-full animate-wave-4 h-6" />
                <span className="w-1 bg-orange-600 rounded-full animate-wave-5 h-4" />
              </div>
              <div>
                <span className="font-bold block text-orange-800">
                  {aiLang === 'hi' ? "आवाज़ पहचानी जा रही है..." : "Recognizing speech..."}
                </span>
                <span className="italic text-slate-700">
                  {interimTranscript || (aiLang === 'hi' ? "कृपया स्पष्ट रूप से बोलें..." : "Please speak clearly into mic...")}
                </span>
              </div>
            </div>
          )}

          {/* Processing Spinner */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-600" />
              <span>{activeAiTrans.thinkingStatus || "Analyzing skilling opportunities..."}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Voice Chips (dynamically localized for chosen AI language) */}
        <div className="bg-slate-100 px-3 py-2 border-t border-slate-200 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 whitespace-nowrap text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase shrink-0">
              {activeAiTrans.quickPromptsTitle || "Quick:"}
            </span>
            {currentPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 border border-slate-300 hover:border-orange-400 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors shadow-2xs cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Bottom Voice Mic & Text Input */}
        <div className="bg-white p-3 sm:p-4 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Pulsating Big Microphone Button */}
            <button
              type="button"
              onClick={handleToggleListening}
              className={`p-3 rounded-full text-white shadow-md transition-all active:scale-95 shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-red-600 ring-4 ring-red-300 animate-pulse'
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500'
              }`}
              title={isListening ? "Stop listening" : "Click to Speak"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={activeAiTrans.inputPlaceholder || "Type or speak your question..."}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim() || isProcessing}
              className="bg-gov-navy hover:bg-slate-800 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          
          <div className="text-center mt-1.5 text-[10px] text-slate-400">
            <span>Smart India Hackathon 2026 • Problem Statement: 26097</span>
          </div>
        </div>

      </div>
    </div>
  );
}
