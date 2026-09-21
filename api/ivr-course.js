// Vercel Serverless Function: /api/ivr-course
// GramSaksham IVR Sub-Menu — Handles specific course digit selection
// Called from /api/ivr-action when digit=1 (NSQF Courses menu)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const body = req.body || {};
  const query = req.query || {};
  const digit = body.Digits || query.digit || '';
  const lang = query.lang || body.lang || 'hi';
  const callSid = query.callSid || body.CallSid || 'TEST';
  const baseUrl = getBaseUrl(req);
  const voice = getVoice(lang);

  const courseInfo = {
    '1': {
      hi: 'जैविक खेती और फसल उत्पादक कोर्स। एनएसक्यूएफ स्तर 4। 6 सप्ताह। पात्रता: 5वीं पास। स्टाइपेंड: 3500 रुपये प्रति माह। आय: 18000 से 28000 रुपये।',
      en: 'Organic Farmer and Crop Cultivator course. NSQF Level 4. 6 weeks. Eligibility: 5th class pass. Stipend: 3500 rupees per month. Income: 18000 to 28000 rupees.',
      mr: 'सेंद्रिय शेतकरी कोर्स. एनएसक्यूएफ स्तर 4. 6 आठवडे. पात्रता: 5 वी उत्तीर्ण. विद्यावेतन: दरमहा 3500 रुपये. उत्पन्न: 18000 ते 28000 रुपये.'
    },
    '2': {
      hi: 'किसान ड्रोन ऑपरेटर कोर्स। एनएसक्यूएफ स्तर 5। 8 सप्ताह। पात्रता: 10वीं पास। स्टाइपेंड: 4500 रुपये। आय: 25000 से 45000 रुपये। डीजीसीए लाइसेंस प्राप्त।',
      en: 'Kisan Drone Operator course. NSQF Level 5. 8 weeks. Eligibility: 10th class pass. Stipend: 4500 rupees. Income: 25000 to 45000 rupees. DGCA certified.',
      mr: 'किसान ड्रोन ऑपरेटर कोर्स. एनएसक्यूएफ स्तर 5. 8 आठवडे. पात्रता: 10 वी उत्तीर्ण. विद्यावेतन: 4500 रुपये. उत्पन्न: 25000 ते 45000 रुपये. डीजीसीए प्रमाणित.'
    },
    '3': {
      hi: 'सूर्य मित्र सोलर पंप तकनीशियन। एनएसक्यूएफ स्तर 4। 7 सप्ताह। पात्रता: 8वीं पास। स्टाइपेंड: 4000 रुपये। आय: 20000 से 35000 रुपये।',
      en: 'Surya Mitra Solar Pump Technician. NSQF Level 4. 7 weeks. Eligibility: 8th pass. Stipend: 4000 rupees. Income: 20000 to 35000 rupees.',
      mr: 'सूर्य मित्र सोलर पंप तंत्रज्ञ. एनएसक्यूएफ स्तर 4. 7 आठवडे. पात्रता: 8 वी उत्तीर्ण. विद्यावेतन: 4000 रुपये. उत्पन्न: 20000 ते 35000 रुपये.'
    },
    '4': {
      hi: 'डेयरी फार्म पर्यवेक्षक कोर्स। एनएसक्यूएफ स्तर 5। 6 सप्ताह। पात्रता: 8वीं पास। स्टाइपेंड: 3500 रुपये। आय: 20000 से 32000 रुपये।',
      en: 'Dairy Farm Supervisor course. NSQF Level 5. 6 weeks. Eligibility: 8th class pass. Stipend: 3500 rupees. Income: 20000 to 32000 rupees.',
      mr: 'डेअरी फार्म पर्यवेक्षक कोर्स. एनएसक्यूएफ स्तर 5. 6 आठवडे. पात्रता: 8 वी उत्तीर्ण. विद्यावेतन: 3500 रुपये. उत्पन्न: 20000 ते 32000 रुपये.'
    },
    '5': {
      hi: 'खाद्य प्रसंस्करण कारीगर कोर्स। एनएसक्यूएफ स्तर 3। 5 सप्ताह। पात्रता: बुनियादी साक्षरता। स्टाइपेंड: 3000 रुपये। आय: 15000 से 25000 रुपये।',
      en: 'Food Processing Artisan course. NSQF Level 3. 5 weeks. Eligibility: Basic literacy. Stipend: 3000 rupees. Income: 15000 to 25000 rupees.',
      mr: 'अन्न प्रक्रिया कारागीर कोर्स. एनएसक्यूएफ स्तर 3. 5 आठवडे. पात्रता: मूलभूत साक्षरता. विद्यावेतन: 3000 रुपये. उत्पन्न: 15000 ते 25000 रुपये.'
    }
  };

  const returnMsg = {
    hi: 'इस कोर्स में नामांकन के लिए gram-saksham वेबसाइट या नजदीकी कृषि विज्ञान केंद्र पर जाएं। मुख्य मेनू के लिए स्टार दबाएं।',
    en: 'To enroll in this course, visit gram-saksham website or your nearest KVK center. Press star for main menu.',
    mr: 'या कोर्समध्ये नोंदणीसाठी gram-saksham वेबसाइट किंवा जवळच्या केव्हीके केंद्राला भेट द्या. मुख्य मेनूसाठी स्टार दाबा.'
  };

  const info = courseInfo[digit]?.[lang] || courseInfo[digit]?.hi;
  const back = returnMsg[lang] || returnMsg.hi;

  if (!info) {
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Redirect>${baseUrl}/api/ivr-action?lang=${lang}&amp;digit=1&amp;callSid=${callSid}</Redirect>
</Response>`);
  }

  return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="${baseUrl}/api/ivr-action?lang=${lang}&amp;callSid=${callSid}" method="POST" timeout="10" finishOnKey="">
    <Say voice="${voice.v}" language="${voice.l}">${info} ${back}</Say>
  </Gather>
  <Redirect>${baseUrl}/api/ivr?lang=${lang}</Redirect>
</Response>`);
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
