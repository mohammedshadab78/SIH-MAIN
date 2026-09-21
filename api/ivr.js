// Vercel Serverless Function: /api/ivr
// GramSaksham IVR Entry Point — Twilio-compatible TwiML Webhook
// This function handles ALL incoming calls and renders the IVR menu.
// It supports Hindi (primary), English, and Marathi via URL param ?lang=hi|en|mr
//
// SETUP:
//  1. Create a Twilio account at https://www.twilio.com
//  2. Buy an Indian phone number (or use trial number)
//  3. Set webhook URL to: https://<your-vercel-domain>/api/ivr
//  4. Set TWILIO_AUTH_TOKEN in Vercel environment variables (for production security)

export default async function handler(req, res) {
  // Allow Twilio webhook POST + CORS for testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Accept lang param from URL query or Twilio webhook body
  const body = req.body || {};
  const query = req.query || {};
  const lang = query.lang || body.lang || 'hi';
  const callSid = body.CallSid || 'TEST';
  const callerNumber = body.From || 'Unknown';
  const baseUrl = getBaseUrl(req);

  const voices = getVoiceConfig(lang);

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Pause length="1"/>
  <Say voice="${voices.voice}" language="${voices.lang}">
    ${voices.welcome}
  </Say>
  <Pause length="1"/>
  <Gather numDigits="1" action="${baseUrl}/api/ivr-action?lang=${lang}&amp;callSid=${callSid}" method="POST" timeout="8" finishOnKey="">
    <Say voice="${voices.voice}" language="${voices.lang}">
      ${voices.menu}
    </Say>
  </Gather>
  <Say voice="${voices.voice}" language="${voices.lang}">${voices.noInput}</Say>
  <Redirect>${baseUrl}/api/ivr?lang=${lang}</Redirect>
</Response>`;

  return res.status(200).send(twiml);
}

function getBaseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
  return `${proto}://${host}`;
}

function getVoiceConfig(lang) {
  const configs = {
    hi: {
      voice: 'Polly.Aditi',
      lang: 'hi-IN',
      welcome: 'नमस्ते! ग्राम सक्षम हेल्पलाइन पर आपका स्वागत है। मैं सक्षम साथी हूँ, आपका एआई कौशल सहायक।',
      menu: `कृपया अपना विकल्प चुनें:
        एनएसक्यूएफ कौशल पाठ्यक्रम की जानकारी के लिए, एक दबाएं।
        सरकारी योजनाओं की जानकारी के लिए, दो दबाएं।
        नजदीकी प्रशिक्षण केंद्र के लिए, तीन दबाएं।
        किसान ड्रोन जानकारी के लिए, चार दबाएं।
        सोलर पंप कोर्स के लिए, पाँच दबाएं।
        अंग्रेजी में सुनने के लिए, छह दबाएं।
        मराठी में सुनने के लिए, सात दबाएं।
        मेनू दोबारा सुनने के लिए, स्टार दबाएं।
        कॉल समाप्त करने के लिए, हैश दबाएं।`,
      noInput: 'हमें कोई उत्तर नहीं मिला। कृपया दोबारा कोशिश करें।'
    },
    en: {
      voice: 'Polly.Raveena',
      lang: 'en-IN',
      welcome: 'Welcome to GramSaksham Helpline. I am Saksham Sathi, your AI Skilling Companion.',
      menu: `Please press a key for your choice.
        For NSQF skill courses information, press 1.
        For government schemes information, press 2.
        For nearest training center, press 3.
        For Kisan Drone course information, press 4.
        For Solar Pump course information, press 5.
        To listen in Hindi, press 6.
        To listen in Marathi, press 7.
        To repeat this menu, press star.
        To end the call, press hash.`,
      noInput: 'We did not receive any input. Please try again.'
    },
    mr: {
      voice: 'Polly.Aditi',
      lang: 'mr-IN',
      welcome: 'नमस्कार! ग्राम सक्षम हेल्पलाइनवर आपले स्वागत आहे. मी सक्षम साथी आहे, आपला एआई कौशल्य सहाय्यक.',
      menu: `कृपया आपला पर्याय निवडा:
        एनएसक्यूएफ कौशल्य अभ्यासक्रमांसाठी एक दाबा.
        शासकीय योजनांसाठी दोन दाबा.
        जवळच्या प्रशिक्षण केंद्रासाठी तीन दाबा.
        किसान ड्रोन माहितीसाठी चार दाबा.
        सोलर पंप कोर्ससाठी पाच दाबा.
        हिंदीत ऐकण्यासाठी सहा दाबा.
        इंग्रजीत ऐकण्यासाठी सात दाबा.
        मेनू पुन्हा ऐकण्यासाठी स्टार दाबा.
        कॉल संपवण्यासाठी हॅश दाबा.`,
      noInput: 'आम्हाला कोणतेही उत्तर मिळाले नाही. कृपया पुन्हा प्रयत्न करा.'
    }
  };
  return configs[lang] || configs.hi;
}
