// Speech Recognition & Synthesis utility for GramSaksham

export const LANG_SPEECH_MAP = {
  hi: 'hi-IN',
  en: 'en-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  ta: 'ta-IN'
};

// Standard DTMF Telephone frequencies for phone keypad simulation
const DTMF_FREQS = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477]
};

// Play realistic DTMF telephone key beep in browser without external sound files
export function playDtmfTone(key) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const freqs = DTMF_FREQS[key] || [440, 440];

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = freqs[0];
    osc2.frequency.value = freqs[1];

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.18);
    osc2.stop(ctx.currentTime + 0.18);
  } catch (err) {
    console.warn("DTMF tone error:", err);
  }
}

// Play a friendly simulated SMS / incoming chime
export function playSmsChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const notes = [587.33, 880]; // D5, A5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.12;
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  } catch (e) {
    // Ignore audio context auto-play restrictions
  }
}

export class SpeechManager {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.initRecognition();
  }

  initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
    }
  }

  getLocale(lang) {
    return LANG_SPEECH_MAP[lang] || (lang.includes('-') ? lang : 'hi-IN');
  }

  startListening({ lang = 'hi', onResult, onEnd, onError }) {
    if (!this.recognition) {
      onError && onError("Speech Recognition not supported in this browser. Please type your query.");
      return;
    }

    try {
      this.recognition.lang = this.getLocale(lang);
      this.isListening = true;

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        onResult && onResult({
          final: finalTranscript,
          interim: interimTranscript,
          text: finalTranscript || interimTranscript
        });
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        this.isListening = false;
        onError && onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd && onEnd();
      };

      this.recognition.start();
    } catch (err) {
      console.warn("Could not start recognition:", err);
      this.isListening = false;
      onError && onError(err.message || "Failed to start microphone");
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error(e);
      }
      this.isListening = false;
    }
  }

  speak(text, { lang = 'hi', rate = 0.95, onStart, onEnd } = {}) {
    if (!this.synth) return;

    // Stop any currently playing speech and clear timers
    this.stopSpeaking();

    if (!text || typeof text !== 'string') return;

    // Clean formatting for natural speech synthesis
    const cleanText = text
      .replace(/[*_#`[\]()]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[\r]+/g, ' ')
      .trim();

    if (!cleanText) return;

    const locale = this.getLocale(lang);
    const voices = this.synth.getVoices();
    const baseCode = locale.split('-')[0];
    const regionalVoice = voices.find(v => 
      v.lang.toLowerCase().startsWith(baseCode) || 
      (baseCode === 'en' && (v.lang.includes('en-IN') || v.name.includes('India')))
    );

    // Split text into natural sentence chunks to prevent Chrome TTS 15s freeze
    const rawSentences = cleanText.split(/([।?!.\n]+)/);
    const sentences = [];
    for (let i = 0; i < rawSentences.length; i += 2) {
      const part = (rawSentences[i] || '').trim();
      const punct = (rawSentences[i + 1] || '').trim();
      const sentence = `${part} ${punct}`.trim();
      if (sentence.length > 1) {
        sentences.push(sentence);
      }
    }

    if (sentences.length === 0) {
      sentences.push(cleanText);
    }

    this.activeUtterances = [];
    let currentIndex = 0;
    let started = false;

    // Chrome TTS KeepAlive timer to prevent pause/freeze
    this.keepAliveInterval = setInterval(() => {
      if (this.synth && this.synth.speaking) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 9000);

    const speakNextChunk = () => {
      if (currentIndex >= sentences.length) {
        clearInterval(this.keepAliveInterval);
        this.activeUtterances = [];
        if (onEnd) onEnd();
        return;
      }

      const chunkText = sentences[currentIndex];
      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.lang = locale;
      utterance.rate = rate;
      utterance.pitch = 1.0;
      if (regionalVoice) {
        utterance.voice = regionalVoice;
      }

      utterance.onstart = () => {
        if (!started) {
          started = true;
          if (onStart) onStart();
        }
      };

      utterance.onend = () => {
        currentIndex++;
        speakNextChunk();
      };

      utterance.onerror = (e) => {
        // If canceled manually, exit cleanly
        if (e.error === 'canceled' || e.error === 'interrupted') return;
        currentIndex++;
        speakNextChunk();
      };

      // Keep utterance in memory array to prevent V8 garbage collection
      this.activeUtterances.push(utterance);
      this.synth.speak(utterance);
    };

    speakNextChunk();
  }

  stopSpeaking() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
    this.activeUtterances = [];
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechManager = new SpeechManager();
