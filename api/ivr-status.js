// Vercel Serverless Function: /api/ivr-status
// GramSaksham IVR Health Check + Configuration Info
// Useful for verifying the IVR is live, and showing Twilio setup instructions

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const baseUrl = getBaseUrl(req);
  const hasTwilioToken = !!(process.env.TWILIO_AUTH_TOKEN);
  const hasTwilioSid = !!(process.env.TWILIO_ACCOUNT_SID);
  const hasIvrNumber = !!(process.env.TWILIO_IVR_PHONE_NUMBER);

  return res.status(200).json({
    status: 'active',
    service: 'GramSaksham IVR Telephony System',
    version: '1.0.0',
    project: 'SIH 2026 - Problem Statement 26097',
    ivrEndpoints: {
      mainEntry: `${baseUrl}/api/ivr`,
      mainEntryHindi: `${baseUrl}/api/ivr?lang=hi`,
      mainEntryEnglish: `${baseUrl}/api/ivr?lang=en`,
      mainEntryMarathi: `${baseUrl}/api/ivr?lang=mr`,
      menuAction: `${baseUrl}/api/ivr-action`,
      courseSubMenu: `${baseUrl}/api/ivr-course`,
      healthCheck: `${baseUrl}/api/ivr-status`
    },
    environment: {
      twilioAccountSidConfigured: hasTwilioSid,
      twilioAuthTokenConfigured: hasTwilioToken,
      twilioPhoneNumberConfigured: hasIvrNumber,
      ivrPhoneNumber: hasIvrNumber ? process.env.TWILIO_IVR_PHONE_NUMBER : 'Not configured — set TWILIO_IVR_PHONE_NUMBER in Vercel env vars'
    },
    ivrFlow: {
      '1': 'NSQF Courses Sub-Menu',
      '2': 'Government Schemes Info',
      '3': 'Nearest Training Centers',
      '4': 'Kisan Drone Operator details',
      '5': 'Surya Mitra Solar Pump details',
      '6': 'Switch to Hindi',
      '7': 'Switch to Marathi / English',
      '*': 'Repeat main menu',
      '#': 'End call (Goodbye)'
    },
    supportedLanguages: {
      hi: 'Hindi — Voice: Polly.Aditi (hi-IN) — Primary language',
      en: 'English — Voice: Polly.Raveena (en-IN)',
      mr: 'Marathi — Voice: Polly.Aditi (mr-IN)'
    },
    setupInstructions: {
      step1: 'Create a Twilio account at https://www.twilio.com',
      step2: 'Buy an Indian phone number (or use Twilio trial number)',
      step3: `Set Incoming Call Webhook URL to: ${baseUrl}/api/ivr`,
      step4: 'Set Webhook HTTP Method to: POST',
      step5: 'Add Vercel environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_IVR_PHONE_NUMBER',
      step6: 'Callers can now dial your Twilio number and hear the IVR in Hindi/English/Marathi'
    }
  });
}

function getBaseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
  return `${proto}://${host}`;
}
