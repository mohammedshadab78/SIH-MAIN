// Vercel Serverless Function: /api/chat
// GramSaksham SIH 2026 - Multilingual Voice Assistant & Skilling Recommender
// Securely proxies requests to Google Gemini using process.env.GEMINI_API_KEY
// Fallback guarantees 100% uptime with 200 OK responses on Vercel

const NSQF_COURSES = [
  {
    id: "nsqf-agr-01",
    title: "Organic Farmer & Crop Cultivator",
    titleHi: "जैविक किसान एवं फसल उत्पादक",
    titleMr: "सेंद्रिय शेतकरी आणि पीक उत्पादक",
    sector: "Agriculture & Allied",
    sectorHi: "कृषि एवं संबद्ध",
    sectorMr: "कृषी व संलग्न",
    nsqfLevel: 4,
    durationWeeks: 6,
    stipend: "₹3,500 / month",
    certification: "Agriculture Skill Council of India (ASCI)"
  },
  {
    id: "nsqf-drn-02",
    title: "Kisan Drone Operator & Maintenance Specialist",
    titleHi: "किसान ड्रोन ऑपरेटर एवं रखरखाव विशेषज्ञ",
    titleMr: "किसान ड्रोन ऑपरेटर आणि देखभाल तज्ज्ञ",
    sector: "AgriTech & Modern Equipment",
    sectorHi: "एग्रीटेक एवं आधुनिक उपकरण",
    sectorMr: "अॅग्रीटेक व आधुनिक उपकरणे",
    nsqfLevel: 5,
    durationWeeks: 8,
    stipend: "₹4,500 / month",
    certification: "DGCA / Aerospace & Aviation SSC"
  },
  {
    id: "nsqf-sol-03",
    title: "Surya Mitra - Solar Pump & Micro-Grid Technician",
    titleHi: "सूर्य मित्र - सोलर पंप एवं माइक्रोग्रिड तकनीशियन",
    titleMr: "सूर्य मित्र - सोलर पंप आणि मायक्रोग्रिड तंत्रज्ञ",
    sector: "Renewable Energy & Solar",
    sectorHi: "नवीकरणीय ऊर्जा एवं सोलर",
    sectorMr: "नवीकरणीय ऊर्जा व सौर",
    nsqfLevel: 4,
    durationWeeks: 7,
    stipend: "₹4,000 / month",
    certification: "Skill Council for Green Jobs (SCGJ)"
  },
  {
    id: "nsqf-dai-04",
    title: "Dairy Farm Supervisor & Livestock Healthcare Assistant",
    titleHi: "डेयरी फार्म पर्यवेक्षक एवं पशु स्वास्थ्य सहायक",
    titleMr: "डेअरी फार्म पर्यवेक्षक आणि पशुआरोग्य साहाय्यक",
    sector: "Animal Husbandry & Dairy",
    sectorHi: "पशुपालन एवं डेयरी",
    sectorMr: "पशुसंवर्धन व दुग्धव्यवसाय",
    nsqfLevel: 5,
    durationWeeks: 10,
    stipend: "₹4,000 / month",
    certification: "Agriculture Skill Council of India (ASCI)"
  },
  {
    id: "nsqf-fdp-05",
    title: "Food Processing Artisan & Millets Value-Addition Specialist",
    titleHi: "फूड प्रोसेसिंग कारीगर एवं श्रीअन्न (मिलेट्स) मूल्य संवर्धन",
    titleMr: "अन्न प्रक्रिया कारागीर आणि श्रीअन्न (मिलेट्स) मूल्यवर्धन तज्ज्ञ",
    sector: "Food Processing & SHG Enterprises",
    sectorHi: "खाद्य प्रसंस्करण एवं एसएचजी",
    sectorMr: "अन्न प्रक्रिया व महिला बचत गट",
    nsqfLevel: 3,
    durationWeeks: 4,
    stipend: "₹3,000 / month",
    certification: "Food Industry Capacity & Skill Initiative (FICSI)"
  },
  {
    id: "nsqf-hnd-06",
    title: "Rural Crafts & Handloom Master Artisan",
    titleHi: "ग्रामीण हस्तशिल्प एवं हथकरघा मास्टर कारीगर",
    titleMr: "ग्रामीण हस्तकला आणि हातमाग मास्टर कारागीर",
    sector: "Handicrafts & Traditional Artisans",
    sectorHi: "हस्तशिल्प एवं पारंपरिक कारीगर",
    sectorMr: "हस्तकला व पारंपरिक कारागीर",
    nsqfLevel: 4,
    durationWeeks: 6,
    stipend: "₹3,500 / month",
    certification: "Handicrafts and Carpet Sector Skill Council (HCSSC)"
  }
];

const TRAINING_CENTERS = [
  {
    id: "kendra-sehore-01",
    name: "Krishi Vigyan Kendra (KVK) - Sehore",
    nameHi: "कृषि विज्ञान केंद्र (केवीके) - सीहोर",
    district: "Sehore",
    type: "KVK Skilling Hub",
    seatsAvailable: 35,
    contact: "+91 7562 224411"
  },
  {
    id: "kendra-bhopal-01",
    name: "Pradhan Mantri Kaushal Kendra (PMKK) - Bhopal",
    nameHi: "प्रधानमंत्री कौशल केंद्र (PMKK) - भोपाल",
    district: "Bhopal",
    type: "PMKK Center",
    seatsAvailable: 42,
    contact: "+91 755 2748899"
  },
  {
    id: "kendra-vidisha-01",
    name: "Rural Self Employment Training Institute (RSETI) - Vidisha",
    nameHi: "ग्रामीण स्वरोजगार प्रशिक्षण संस्थान (RSETI) - विदिशा",
    district: "Vidisha",
    type: "RSETI Center",
    seatsAvailable: 28,
    contact: "+91 7592 233122"
  }
];

function matchCoursesAndCenters(query) {
  const q = (query || '').toLowerCase();
  let matchedCourses = [];
  let matchedCenters = TRAINING_CENTERS.slice(0, 2);

  if (q.includes('drone') || q.includes('ड्रोन') || q.includes('हवा')) {
    matchedCourses = [NSQF_COURSES[1]];
    matchedCenters = [TRAINING_CENTERS[1], TRAINING_CENTERS[0]];
  } else if (q.includes('solar') || q.includes('सोलर') || q.includes('bijli') || q.includes('बिजली') || q.includes('ऊर्जा')) {
    matchedCourses = [NSQF_COURSES[2]];
    matchedCenters = [TRAINING_CENTERS[0], TRAINING_CENTERS[2]];
  } else if (q.includes('kheti') || q.includes('kisan') || q.includes('जैविक') || q.includes('खेती') || q.includes('organic') || q.includes('शेती')) {
    matchedCourses = [NSQF_COURSES[0], NSQF_COURSES[1]];
    matchedCenters = [TRAINING_CENTERS[0], TRAINING_CENTERS[1]];
  } else if (q.includes('dairy') || q.includes('dudh') || q.includes('milk') || q.includes('डेयरी') || q.includes('पशु') || q.includes('गाई')) {
    matchedCourses = [NSQF_COURSES[3]];
    matchedCenters = [TRAINING_CENTERS[0], TRAINING_CENTERS[2]];
  } else if (q.includes('food') || q.includes('millet') || q.includes('खाद्य') || q.includes('मिलेट्स') || q.includes('अचार') || q.includes('बचत')) {
    matchedCourses = [NSQF_COURSES[4]];
    matchedCenters = [TRAINING_CENTERS[2], TRAINING_CENTERS[1]];
  } else if (q.includes('craft') || q.includes('karigar') || q.includes('कारीगर') || q.includes('विश्वकर्मा') || q.includes('हस्तशिल्प')) {
    matchedCourses = [NSQF_COURSES[5]];
    matchedCenters = [TRAINING_CENTERS[2], TRAINING_CENTERS[0]];
  } else {
    matchedCourses = [NSQF_COURSES[0], NSQF_COURSES[2]];
    matchedCenters = [TRAINING_CENTERS[0], TRAINING_CENTERS[1]];
  }

  return { matchedCourses, matchedCenters };
}

function getFallbackReply(query, language = 'hi') {
  const q = (query || '').toLowerCase();
  const isHi = language === 'hi';
  const isMr = language === 'mr';
  const isBn = language === 'bn';
  const isTe = language === 'te';

  if (q.includes('drone') || q.includes('ड्रोन')) {
    if (isMr) return "किसान ड्रोन ऑपरेटर (NSQF स्तर ५) हा ८ आठवड्यांचा प्रशिक्षण अभ्यासक्रम डीजीसीए प्रमाणित केंद्रांवर उपलब्ध आहे. यात दरमहा ₹४,५०० विद्यावेतन दिले जाते.";
    if (isBn) return "কিসান ড্রোন অপারেটর (NSQF লেভেল ৫) ৮ সপ্তাহের প্রশিক্ষণ ডিজিসিএ অনুমোদিত কেন্দ্রে উন্মুক্ত। এতে মাসিক ₹৪,৫০০ স্টাইপেন্ড প্রদান করা হয়।";
    if (isTe) return "కిసాన్ డ్రోన్ ఆపరేటర్ (NSQF లెవల్ 5) 8 వారాల శిక్షణ డిజిసిఎ సర్టిఫైడ్ కేంద్రాలలో లభిస్తుంది. నెలకు ₹4,500 స్టైపెండ్ ఇవ్వబడుతుంది.";
    if (isHi) return "किसान ड्रोन ऑपरेटर (NSQF स्तर 5) का 8 सप्ताह का प्रशिक्षण डीजीसीए मान्यता प्राप्त केंद्रों पर उपलब्ध है। इसमें ₹4,500 मासिक स्टाइपेंड मिलता है।";
    return "Kisan Drone Operator (NSQF Level 5) 8-week training is open at DGCA-certified centers with ₹4,500 monthly stipend.";
  }

  if (q.includes('solar') || q.includes('सोलर') || q.includes('बिजली')) {
    if (isMr) return "सूर्य मित्र सोलर पंप व मायक्रोग्रिड कोर्स (NSQF स्तर ४) पीएम-कुसुम योजनेअंतर्गत १००% मोफत आणि प्रात्यक्षिक प्रशिक्षण देतो.";
    if (isBn) return "সূর্য মিত্র সোলার পাম্প ও মাইক্রোগ্রিড কোর্স (NSQF লেভেল ৪) পিএম-কুসুম যোজনার আওতায় ১০০% বিনামূল্যে ব্যবহারিক প্রশিক্ষণ প্রদান করে।";
    if (isTe) return "సూర్య మిత్ర సోలార్ పంప్ & మైక్రోగ్రిడ్ కోర్సు (NSQF లెవల్ 4) పిఎం-కుసుమ్ పథకం కింద 100% ఉచిత ఆచరణాత్మక శిక్షణను అందిస్తుంది.";
    if (isHi) return "सूर्य मित्र सोलर पंप एवं माइक्रोग्रिड कोर्स (NSQF स्तर 4) पीएम-कुसुम योजना के तहत 100% निःशुल्क और प्रायोगिक प्रशिक्षण देता है।";
    return "Surya Mitra Solar Pump & Micro-grid course (NSQF Level 4) offers 100% free hands-on training under PM-KUSUM.";
  }

  if (q.includes('kheti') || q.includes('kisan') || q.includes('खेती') || q.includes('जैविक') || q.includes('organic') || q.includes('शेती')) {
    if (isMr) return "सेंद्रिय शेती व पीक उत्पादक (NSQF स्तर ४) अभ्यासक्रमात नैसर्गिक खत आणि ई-नाम थेट बाजारपेठ जोडणी शिकवली जाते. ₹३,५०० विद्यावेतन उपलब्ध आहे.";
    if (isBn) return "জৈব চাষ ও ফসল চাষি (NSQF লেভেল ৪) কোর্সে প্রাকৃতিক সার এবং ই-নাম বাজার সংযোগ শেখানো হয়। ₹৩,৫०० স্টাইপেন্ড উপলব্ধ।";
    if (isTe) return "సేంద్రీయ వ్యవసాయం మరియు పంట సాగుదారు (NSQF లెవల్ 4) కోర్సులో సహజ ఎరువులు మరియు ఇ-నామ్ మార్కెట్ లింకేజీ నేర్పుతారు. ₹3,500 స్టైపెండ్ ఉంటుంది.";
    if (isHi) return "कृषि एवं जैविक खेती के लिए 'जैविक किसान एवं फसल उत्पादक (NSQF स्तर 4)' कोर्स सर्वोत्तम है। इसमें ₹3,500 मासिक स्टाइपेंड और निःशुल्क प्रशिक्षण मिलता है।";
    return "For agriculture, 'Organic Farmer (NSQF Level 4)' is best with natural fertilizer training and ₹3,500 monthly stipend.";
  }

  if (q.includes('dairy') || q.includes('पशु') || q.includes('दूध') || q.includes('डेयरी') || q.includes('dudh')) {
    if (isMr) return "दुग्ध व्यवसाय आणि पशुपालनासाठी 'डेअरी फार्म पर्यवेक्षक (NSQF स्तर ५)' कोर्स उपलब्ध आहे. यात बँक कर्ज व आधुनिक दुग्ध प्रक्रिया मार्गदर्शन मिळते.";
    if (isBn) return "দুগ্ধ খামার তত্ত্বাবধায়ক (NSQF লেভেল ৫) কোর্সটি ব্যাংক ঋণ ও আধুনিক দুধ প্রক্রিয়াকরণের সুযোগ প্রদান করে।";
    if (isTe) return "డైరీ ఫార్మ్ సూపర్వైజర్ (NSQF లెవల్ 5) కోర్సు బ్యాంక్ రుణాలు మరియు ఆధునిక పాల ప్రాసెసింగ్ మార్గదర్శకత్వాన్ని అందిస్తుంది.";
    if (isHi) return "पशुपालन व दुग्ध प्रसंस्करण के लिए 'डेयरी फार्म पर्यवेक्षक (NSQF स्तर 5)' कोर्स उपलब्ध है। इसमें आधुनिक नस्ल सुधार और बैंक लोन सहायता दी जाती है।";
    return "For dairy and livestock, 'Dairy Farm Supervisor (NSQF Level 5)' provides training in automated milking and credit linkage.";
  }

  // General default welcome
  if (isMr) return "ग्राम सक्षम मध्ये आपले स्वागत आहे! मी आपला व्हॉइस सहाय्यक 'सक्षम साथी' आहे. आपण सेंद्रिय शेती, सोलर पंप, किसान ड्रोन, डेअरी किंवा हस्तकला यांसारख्या एनएसक्यूएफ अभ्यासक्रमांबद्दल विचारू शकता.";
  if (isBn) return "গ্রাম সক্ষমে স্বাগতম! আমি আপনার ভয়েস সহকারী 'সক্ষম সাথী'। আপনি জৈব চাষ, সোলার পাম্প, কিসান ড্রোন বা ডেইরি সম্পর্কিত প্রশিক্ষণ সম্পর্কে জানতে চাইতে পারেন।";
  if (isTe) return "గ్రామ సక్షమ్‌కు స్వాగతం! నేను మీ వాయిస్ సహాయకుడు 'సక్షమ్ సాథీ'. సేంద్రీయ వ్యవసాయం, సోలార్ పంపులు, కిసాన్ డ్రోన్‌లు లేదా డెయిరీ కోర్సుల గురించి నన్ను అడగవచ్చు.";
  if (isHi) return "नमस्ते! ग्राम सक्षम के 'सक्षम साथी' में आपका स्वागत है। आप मुझसे जैविक खेती, सोलर पंप, किसान ड्रोन, डेयरी फार्मिंग या हस्तशिल्प प्रशिक्षण के बारे में पूछ सकते हैं।";
  return "Welcome to GramSaksham! I am 'Saksham Sathi', your Voice AI companion. You can ask about NSQF courses in Organic Farming, Solar Energy, Kisan Drones, Dairy, or Handicrafts.";
}

export default async function handler(req, res) {
  // 1. Enable full CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({
      status: 'active',
      service: 'GramSaksham Vercel Serverless AI Function',
      usage: 'Send POST with { message, language, history }'
    });
  }

  try {
    const { message, language = 'hi', history = [] } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid message string is required.' });
    }

    const { matchedCourses, matchedCenters } = matchCoursesAndCenters(message);
    const apiKey = process.env.GEMINI_API_KEY;

    // 2. If GEMINI_API_KEY is configured on Vercel environment variables, use Google Gemini
    if (apiKey && apiKey.trim().length > 10) {
      const langDescriptions = {
        hi: 'polite, clear spoken Hindi in Devanagari script (हिंदी)',
        mr: 'polite, clear spoken Marathi in Devanagari script (मराठी)',
        bn: 'polite, clear spoken Bengali in Bengali script (বাংলা)',
        te: 'polite, clear spoken Telugu in Telugu script (తెలుగు)',
        en: 'concise, accessible Indian English'
      };

      const targetLangDesc = langDescriptions[language] || langDescriptions.hi;

      const systemPrompt = `You are 'Saksham Sathi' (सक्षम साथी), the official AI Voice Assistant for the Government of India's Smart India Hackathon 2026 project 'GramSaksham' (Problem Statement 26097: AI-Driven Multilingual Voice Assistant for Livelihood & NSQF Skilling).
Your role:
- Guide rural citizens, farmers, youths, women self-help groups (SHGs), and artisans to NSQF skilling courses, government stipends, and livelihood opportunities.
- Always respond in ${targetLangDesc}.
- Keep replies concise (around 3 to 4 complete sentences) for instant, natural speech playback.
- Maintain context across user queries (courses, duration, eligibility, stipend, or nearest training centers).
- Mention PMKVY 4.0, Surya Mitra, Kisan Drone Didi, PM Vishwakarma, or stipend amounts when relevant.`;

      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        const contextHistory = history.slice(1).slice(-6);
        for (const msg of contextHistory) {
          if (msg && msg.text && msg.text.trim()) {
            contents.push({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
            });
          }
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      // Google Generative AI Production Models
      const CANDIDATE_MODELS = [
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-2.5-flash'
      ];

      for (const model of CANDIDATE_MODELS) {
        const endpoints = [
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`,
          `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey.trim()}`
        ];

        for (const geminiUrl of endpoints) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6500);

            const geminiRes = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal,
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: systemPrompt }]
                },
                contents,
                generationConfig: {
                  temperature: 0.6,
                  maxOutputTokens: 512,
                }
              })
            });

            clearTimeout(timeoutId);

            if (geminiRes.ok) {
              const geminiData = await geminiRes.json();
              const replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (replyText && replyText.trim()) {
                return res.status(200).json({
                  reply: replyText.trim(),
                  matchedCourses,
                  matchedCenters,
                  source: `gemini-${model}`
                });
              }
            }
          } catch (e) {
            // Try next model/endpoint
          }
        }
      }
    }

    // 3. Fallback to resilient rural intelligence engine (Guaranteed 200 OK without errors)
    const fallbackReply = getFallbackReply(message, language);

    return res.status(200).json({
      reply: fallbackReply,
      matchedCourses,
      matchedCenters,
      source: 'serverless-rural-ai'
    });
  } catch (error) {
    // Never crash on Vercel: return safe 200 with default assistance
    const safeFallback = getFallbackReply('namaste', 'hi');
    const { matchedCourses, matchedCenters } = matchCoursesAndCenters('kheti');

    return res.status(200).json({
      reply: safeFallback,
      matchedCourses,
      matchedCenters,
      source: 'resilient-safeguard'
    });
  }
}
