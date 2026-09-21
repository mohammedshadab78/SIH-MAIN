// Vercel Serverless Function: /api/ivr-action
// GramSaksham IVR Menu Handler — Processes DTMF digit input from callers
// Called by Twilio after user presses a key in /api/ivr
// Returns relevant TwiML response with course/scheme/center info

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const body = req.body || {};
  const query = req.query || {};
  const digit = body.Digits || query.digit || '';
  const lang = query.lang || body.lang || 'hi';
  const callSid = query.callSid || body.CallSid || 'TEST';
  const baseUrl = getBaseUrl(req);

  const voice = getVoice(lang);
  let twiml = '';

  switch (digit) {
    case '1':
      twiml = buildCoursesMenu(lang, voice, baseUrl, callSid);
      break;
    case '2':
      twiml = buildSchemesInfo(lang, voice, baseUrl, callSid);
      break;
    case '3':
      twiml = buildCentersInfo(lang, voice, baseUrl, callSid);
      break;
    case '4':
      twiml = buildDroneInfo(lang, voice, baseUrl, callSid);
      break;
    case '5':
      twiml = buildSolarInfo(lang, voice, baseUrl, callSid);
      break;
    case '6':
      // Switch to Hindi
      twiml = buildRedirect(`${baseUrl}/api/ivr?lang=hi`);
      break;
    case '7':
      // Switch to Marathi or English
      twiml = buildRedirect(lang === 'hi'
        ? `${baseUrl}/api/ivr?lang=mr`
        : `${baseUrl}/api/ivr?lang=en`);
      break;
    case '*':
      // Repeat main menu
      twiml = buildRedirect(`${baseUrl}/api/ivr?lang=${lang}`);
      break;
    case '#':
      twiml = buildGoodbye(lang, voice);
      break;
    default:
      // Invalid input — replay menu
      twiml = buildInvalidInput(lang, voice, baseUrl, callSid);
  }

  return res.status(200).send(twiml);
}

// ─── IVR Response Builders ──────────────────────────────────────────────────

function buildCoursesMenu(lang, voice, baseUrl, callSid) {
  const text = {
    hi: {
      intro: 'एनएसक्यूएफ कौशल पाठ्यक्रम। निम्नलिखित सरकारी कोर्स उपलब्ध हैं।',
      menu: `जैविक खेती और फसल उत्पादक के लिए एक दबाएं।
             किसान ड्रोन ऑपरेटर के लिए दो दबाएं।
             सूर्य मित्र सोलर पंप तकनीशियन के लिए तीन दबाएं।
             डेयरी फार्म पर्यवेक्षक के लिए चार दबाएं।
             खाद्य प्रसंस्करण कारीगर के लिए पाँच दबाएं।
             मुख्य मेनू पर वापस जाने के लिए स्टार दबाएं।`
    },
    en: {
      intro: 'NSQF Skill Courses. The following government certified courses are available.',
      menu: `For Organic Farmer and Crop Cultivator, press 1.
             For Kisan Drone Operator, press 2.
             For Surya Mitra Solar Pump Technician, press 3.
             For Dairy Farm Supervisor, press 4.
             For Food Processing Artisan, press 5.
             To return to main menu, press star.`
    },
    mr: {
      intro: 'एनएसक्यूएफ कौशल्य अभ्यासक्रम. पुढील सरकारी अभ्यासक्रम उपलब्ध आहेत.',
      menu: `सेंद्रिय शेतकरी अभ्यासक्रमासाठी एक दाबा.
             किसान ड्रोन ऑपरेटरसाठी दोन दाबा.
             सूर्य मित्र सोलर पंप तंत्रज्ञासाठी तीन दाबा.
             डेअरी फार्म पर्यवेक्षकासाठी चार दाबा.
             अन्न प्रक्रिया कारागिरासाठी पाच दाबा.
             मुख्य मेनूवर जाण्यासाठी स्टार दाबा.`
    }
  };
  const t = text[lang] || text.hi;
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice.v}" language="${voice.l}">${t.intro}</Say>
  <Gather numDigits="1" action="${baseUrl}/api/ivr-course?lang=${lang}&amp;callSid=${callSid}" method="POST" timeout="8" finishOnKey="">
    <Say voice="${voice.v}" language="${voice.l}">${t.menu}</Say>
  </Gather>
  <Redirect>${baseUrl}/api/ivr?lang=${lang}</Redirect>
</Response>`;
}

function buildSchemesInfo(lang, voice, baseUrl, callSid) {
  const text = {
    hi: `सरकारी योजनाएं। निम्नलिखित योजनाएं उपलब्ध हैं:
    एक। प्रधानमंत्री कौशल विकास योजना 4.0। PMKVY 4.0 के तहत 100 प्रतिशत निःशुल्क प्रशिक्षण और 3500 से 4500 रुपये प्रति माह स्टाइपेंड।
    दो। नमो ड्रोन दीदी योजना। महिला स्वयं सहायता समूहों के लिए डीजीसीए मान्यता प्राप्त ड्रोन प्रशिक्षण।
    तीन। पीएम-कुसुम योजना। 60 प्रतिशत सब्सिडी पर सोलर पंप लगाएं।
    चार। पीएम विश्वकर्मा योजना। 15000 रुपये का टूलकिट वाउचर और 3 लाख तक का गारंटी-मुक्त ऋण।
    मुख्य मेनू के लिए स्टार दबाएं।`,
    en: `Government Schemes. The following schemes are available:
    One. Pradhan Mantri Kaushal Vikas Yojana 4.0. PMKVY 4.0 provides 100 percent free training with 3500 to 4500 rupees monthly stipend.
    Two. Namo Drone Didi Scheme. DGCA approved drone training for women self help groups.
    Three. PM KUSUM Scheme. Up to 60 percent subsidy on solar water pumps.
    Four. PM Vishwakarma Yojana. Fifteen thousand rupee toolkit voucher and collateral free loan up to 3 lakhs.
    Press star for main menu.`,
    mr: `शासकीय योजना. पुढील योजना उपलब्ध आहेत:
    एक. प्रधानमंत्री कौशल्य विकास योजना 4.0. PMKVY 4.0 अंतर्गत 100 टक्के मोफत प्रशिक्षण आणि दरमहा 3500 ते 4500 रुपये विद्यावेतन.
    दोन. नमो ड्रोन दीदी योजना. महिला बचत गटांसाठी डीजीसीए मान्यताप्राप्त ड्रोन प्रशिक्षण.
    तीन. पीएम-कुसुम योजना. सोलर पंपावर 60 टक्के अनुदान.
    चार. पीएम विश्वकर्मा योजना. 15000 रुपयांचे टूलकिट व्हाऊचर आणि 3 लाखांपर्यंत विनातारण कर्ज.
    मुख्य मेनूसाठी स्टार दाबा.`
  };
  const t = text[lang] || text.hi;
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="${baseUrl}/api/ivr-action?lang=${lang}&amp;callSid=${callSid}" method="POST" timeout="10" finishOnKey="">
    <Say voice="${voice.v}" language="${voice.l}">${t}</Say>
  </Gather>
  <Redirect>${baseUrl}/api/ivr?lang=${lang}</Redirect>
</Response>`;
}

function buildCentersInfo(lang, voice, baseUrl, callSid) {
  const text = {
    hi: `नजदीकी प्रशिक्षण केंद्र। मध्य प्रदेश के प्रमुख केंद्र:
    एक। सीहोर: आईसीएआर कृषि विज्ञान केंद्र, फोन: 07562-226450. 35 सीटें उपलब्ध।
    दो। आष्टा, सीहोर: प्रधानमंत्री कौशल केंद्र, फोन: 07560-242210. 40 सीटें।
    तीन। भोपाल: प्रधानमंत्री कौशल केंद्र, फोन: 755-2748899. 42 सीटें।
    चार। इंदौर: सूर्य मित्र ग्रीन एनर्जी हब, फोन: info@suryamitra-mp.org.
    ऑनलाइन नामांकन के लिए हमारी वेबसाइट gram-saksham पर जाएं। 
    मुख्य मेनू के लिए स्टार दबाएं।`,
    en: `Nearest Training Centers in Madhya Pradesh:
    One. Sehore: ICAR Krishi Vigyan Kendra. Phone: 07562-226450. 35 seats available.
    Two. Ashta, Sehore: Pradhan Mantri Kaushal Kendra. Phone: 07560-242210. 40 seats.
    Three. Bhopal: Pradhan Mantri Kaushal Kendra. Phone: 755-2748899. 42 seats.
    Four. Indore: Surya Mitra Green Energy Hub. Email: info@suryamitra-mp.org.
    For online enrollment, visit our website gram-saksham.
    Press star for main menu.`,
    mr: `जवळच्या प्रशिक्षण केंद्रे मध्य प्रदेश:
    एक. सीहोर: आयसीएआर कृषी विज्ञान केंद्र. फोन: 07562-226450. 35 जागा उपलब्ध.
    दोन. आष्टा, सीहोर: प्रधानमंत्री कौशल्य केंद्र. फोन: 07560-242210. 40 जागा.
    तीन. भोपाल: प्रधानमंत्री कौशल्य केंद्र. फोन: 755-2748899. 42 जागा.
    चार. इंदूर: सूर्य मित्र हरित ऊर्जा केंद्र. ईमेल: info@suryamitra-mp.org.
    ऑनलाइन नोंदणीसाठी आमची वेबसाइट ग्राम-सक्षम ला भेट द्या.
    मुख्य मेनूसाठी स्टार दाबा.`
  };
  const t = text[lang] || text.hi;
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="${baseUrl}/api/ivr-action?lang=${lang}&amp;callSid=${callSid}" method="POST" timeout="12" finishOnKey="">
    <Say voice="${voice.v}" language="${voice.l}">${t}</Say>
  </Gather>
  <Redirect>${baseUrl}/api/ivr?lang=${lang}</Redirect>
</Response>`;
}

function buildDroneInfo(lang, voice, baseUrl, callSid) {
  const text = {
    hi: `किसान ड्रोन ऑपरेटर कोर्स। एनएसक्यूएफ स्तर 5।
    यह 8 सप्ताह का डीजीसीए मान्यता प्राप्त प्रशिक्षण कार्यक्रम है।
    पात्रता: 10वीं कक्षा उत्तीर्ण।
    स्टाइपेंड: 4500 रुपये प्रति माह।
    संभावित आय: 25000 से 45000 रुपये प्रति माह।
    प्रमाणन: डीजीसीए एवं एयरोस्पेस कौशल परिषद।
    नमो ड्रोन दीदी योजना के तहत महिला समूहों को विशेष प्रशिक्षण।
    नामांकन के लिए स्थानीय कृषि विज्ञान केंद्र या gram-saksham वेबसाइट पर जाएं।
    मुख्य मेनू के लिए स्टार दबाएं।`,
    en: `Kisan Drone Operator Course. NSQF Level 5.
    This is an 8 week DGCA approved training programme.
    Eligibility: 10th class pass.
    Stipend: 4500 rupees per month.
    Potential income: 25000 to 45000 rupees per month.
    Certification: DGCA and Aerospace Sector Skill Council.
    Special training for women SHGs under Namo Drone Didi Scheme.
    For enrollment, visit your nearest KVK or gram-saksham website.
    Press star for main menu.`,
    mr: `किसान ड्रोन ऑपरेटर कोर्स. एनएसक्यूएफ स्तर 5.
    हा 8 आठवड्यांचा डीजीसीए मान्यताप्राप्त प्रशिक्षण कार्यक्रम आहे.
    पात्रता: 10 वी उत्तीर्ण.
    विद्यावेतन: दरमहा 4500 रुपये.
    संभाव्य उत्पन्न: दरमहा 25000 ते 45000 रुपये.
    प्रमाणन: डीजीसीए आणि एयरोस्पेस कौशल्य परिषद.
    नमो ड्रोन दीदी योजनेअंतर्गत महिला बचत गटांसाठी विशेष प्रशिक्षण.
    नोंदणीसाठी जवळच्या केव्हीके किंवा gram-saksham वेबसाइटला भेट द्या.
    मुख्य मेनूसाठी स्टार दाबा.`
  };
  const t = text[lang] || text.hi;
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="${baseUrl}/api/ivr-action?lang=${lang}&amp;callSid=${callSid}" method="POST" timeout="12" finishOnKey="">
    <Say voice="${voice.v}" language="${voice.l}">${t}</Say>
  </Gather>
  <Redirect>${baseUrl}/api/ivr?lang=${lang}</Redirect>
</Response>`;
}

function buildSolarInfo(lang, voice, baseUrl, callSid) {
  const text = {
    hi: `सूर्य मित्र सोलर पंप और माइक्रोग्रिड तकनीशियन कोर्स। एनएसक्यूएफ स्तर 4।
    7 सप्ताह का पूर्ण प्रायोगिक प्रशिक्षण।
    पात्रता: 8वीं या 10वीं उत्तीर्ण अथवा आईटीआई।
    स्टाइपेंड: 4000 रुपये प्रति माह।
    संभावित आय: 20000 से 35000 रुपये प्रति माह।
    पीएम-कुसुम योजना के तहत 60 प्रतिशत सरकारी सब्सिडी पर सोलर पंप लगाने का प्रशिक्षण।
    प्रमाणन: स्किल काउंसिल फॉर ग्रीन जॉब्स।
    मुख्य मेनू के लिए स्टार दबाएं।`,
    en: `Surya Mitra Solar Pump and Micro Grid Technician Course. NSQF Level 4.
    7 week fully hands on practical training.
    Eligibility: 8th or 10th pass or ITI.
    Stipend: 4000 rupees per month.
    Potential income: 20000 to 35000 rupees per month.
    Training for solar pump installation under PM KUSUM scheme with 60 percent government subsidy.
    Certification: Skill Council for Green Jobs.
    Press star for main menu.`,
    mr: `सूर्य मित्र सोलर पंप आणि मायक्रोग्रिड तंत्रज्ञ कोर्स. एनएसक्यूएफ स्तर 4.
    7 आठवड्यांचे पूर्णपणे प्रात्यक्षिक प्रशिक्षण.
    पात्रता: 8 वी किंवा 10 वी उत्तीर्ण किंवा आयटीआय.
    विद्यावेतन: दरमहा 4000 रुपये.
    संभाव्य उत्पन्न: दरमहा 20000 ते 35000 रुपये.
    पीएम-कुसुम योजनेअंतर्गत 60 टक्के सरकारी अनुदानावर सोलर पंप बसवण्याचे प्रशिक्षण.
    प्रमाणन: स्किल काऊन्सिल फॉर ग्रीन जॉब्स.
    मुख्य मेनूसाठी स्टार दाबा.`
  };
  const t = text[lang] || text.hi;
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="${baseUrl}/api/ivr-action?lang=${lang}&amp;callSid=${callSid}" method="POST" timeout="12" finishOnKey="">
    <Say voice="${voice.v}" language="${voice.l}">${t}</Say>
  </Gather>
  <Redirect>${baseUrl}/api/ivr?lang=${lang}</Redirect>
</Response>`;
}

function buildGoodbye(lang, voice) {
  const text = {
    hi: 'धन्यवाद! ग्राम सक्षम हेल्पलाइन से कॉल करने के लिए आभार। आपकी प्रगति शुभ हो। जय हिंद!',
    en: 'Thank you for calling GramSaksham Helpline. Wishing you success in your skilling journey. Jai Hind!',
    mr: 'धन्यवाद! ग्राम सक्षम हेल्पलाइनवर कॉल केल्याबद्दल आभार. आपल्या कौशल्य प्रवासाला शुभेच्छा. जय हिंद!'
  };
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice.v}" language="${voice.l}">${text[lang] || text.hi}</Say>
  <Hangup/>
</Response>`;
}

function buildInvalidInput(lang, voice, baseUrl, callSid) {
  const text = {
    hi: 'आपने गलत विकल्प दबाया। कृपया दोबारा कोशिश करें।',
    en: 'You pressed an invalid option. Please try again.',
    mr: 'आपण चुकीचा पर्याय दाबला. कृपया पुन्हा प्रयत्न करा.'
  };
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice.v}" language="${voice.l}">${text[lang] || text.hi}</Say>
  <Redirect>${baseUrl}/api/ivr?lang=${lang}</Redirect>
</Response>`;
}

function buildRedirect(url) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Redirect>${url}</Redirect>
</Response>`;
}

function getVoice(lang) {
  const voices = {
    hi: { v: 'Polly.Aditi', l: 'hi-IN' },
    en: { v: 'Polly.Raveena', l: 'en-IN' },
    mr: { v: 'Polly.Aditi', l: 'mr-IN' }
  };
  return voices[lang] || voices.hi;
}

function getBaseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
  return `${proto}://${host}`;
}
