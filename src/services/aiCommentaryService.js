// AI Commentary Service for CricPuls
// Strictly supports 2 languages: English and Hindi (हिंदी)
// Language preference is driven by the App Language Selection.
// Written commentary and Voice synthesis both dynamically adapt based on selection.

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', name: 'English', langTag: 'en-IN', flag: '🌐' },
  { code: 'hi', label: 'हिंदी', name: 'Hindi', langTag: 'hi-IN', flag: '🇮🇳' },
];

export const COMMENTARY_PERSONAS = [
  { id: 'hype', label: '🎙️ Desi Hype', desc: 'High-octane excitement & celebratory punchlines' },
  { id: 'tactical', label: '🧠 Tactical Analyst', desc: 'Fielding placements, length analysis & match situations' },
  { id: 'classic', label: '📻 Classic Radio', desc: 'Crisp, descriptive ball-by-ball rhythm' },
];

// Rich Commentary Templates for English and Hindi
const REGIONAL_TEMPLATES = {
  // ----------------------------------------------------
  // ENGLISH
  // ----------------------------------------------------
  en: {
    '6': {
      hype: [
        {
          native: "SIX! That is colossal! {batsman} clears the front leg and launches {bowler} high into the stands!",
          phonetic: "",
          analysis: "Tremendous bat speed and clean contact right out of the middle."
        },
        {
          native: "MAXIMUM! Picked up like a tracer bullet! The crowd is on its feet as {batsman} goes all the way!",
          phonetic: "",
          analysis: "Length slightly over-pitched and punished with ruthless authority."
        }
      ],
      tactical: [
        {
          native: "SIX! Targeted the shorter boundary! Calculated risk that paid off magnificently.",
          phonetic: "",
          analysis: "The bowler missed the wide yorker mark by mere inches."
        }
      ],
      classic: [
        {
          native: "Six runs! Lofted delightfully over extra cover with sublime elegance.",
          phonetic: "",
          analysis: "A pure cricketing stroke adding 6 crucial runs to the board."
        }
      ]
    },
    '4': {
      hype: [
        {
          native: "FOUR! Blistered through extra cover! That made a resounding crack off the willow!",
          phonetic: "",
          analysis: "Pierced the gap with surgical precision; deep cover was purely a spectator."
        },
        {
          native: "FOUR! Pulled away with ferocious power! {batsman} finds the fence in style!",
          phonetic: "",
          analysis: "Seized upon the short delivery in a flash."
        }
      ],
      tactical: [
        {
          native: "FOUR! Uppercut over the slip cordon! Exploiting the field restriction brilliantly.",
          phonetic: "",
          analysis: "Used the bowler's pace to ramp it down to the third man fence."
        }
      ],
      classic: [
        {
          native: "Four runs! Leaning into the drive, head still, bat coming down straight as a pendulum.",
          phonetic: "",
          analysis: "Textbook execution of an orthodox cricket shot."
        }
      ]
    },
    'W': {
      hype: [
        {
          native: "OUT! CASTLED! {bowler} bowls an absolute peach of an in-swinging yorker! Timber shattered!",
          phonetic: "",
          analysis: "Massive turning point! The key partnership has been decisively broken."
        },
        {
          native: "WICKET! In the air... and taken! Sensational diving catch on the boundary ropes!",
          phonetic: "",
          analysis: "The fielding unit erupts; sustained pressure yields a huge breakthrough."
        }
      ],
      tactical: [
        {
          native: "OUT! Plumb in front! Late reverse swing catches {batsman} completely on the crease.",
          phonetic: "",
          analysis: "Hitting middle and off halfway up. Umpire raised the finger immediately."
        }
      ],
      classic: [
        {
          native: "Wicket falls! Thin outside edge carries cleanly through to the wicketkeeper.",
          phonetic: "",
          analysis: "A patient test of temperament won by the bowler."
        }
      ]
    },
    '0': {
      hype: [
        {
          native: "Dot ball! Zipping past the outside edge! {bowler} is bowling with serious venom!",
          phonetic: "",
          analysis: "Building the pressure cooker environment ball after ball."
        }
      ],
      tactical: [
        {
          native: "Dot ball. Good tight length in the channel of uncertainty, left alone.",
          phonetic: "",
          analysis: "Dots are gold dust at this juncture of the match."
        }
      ],
      classic: [
        {
          native: "No run. Defended solidly back down the pitch to the bowler.",
          phonetic: "",
          analysis: "Disciplined bowling rewarded with a tidy delivery."
        }
      ]
    },
    '1': {
      hype: [
        {
          native: "Single taken! Quick scamper between the wickets, turning the strike over.",
          phonetic: "",
          analysis: "Proactive running keeps the fielders under pressure."
        }
      ],
      tactical: [
        {
          native: "Single. Soft hands towards deep point, ensuring steady run-rate momentum.",
          phonetic: "",
          analysis: "Smart cricket to keep the scoreboard ticking continuously."
        }
      ],
      classic: [
        {
          native: "One run. Pushed into the gap for an easy, sensible single.",
          phonetic: "",
          analysis: "Good calling and understanding between the pair."
        }
      ]
    },
    'extras': {
      hype: [
        {
          native: "Wide ball! Strays down the leg side, gift-wrapped extra run for the batting side!",
          phonetic: "",
          analysis: "Bowler needs to quickly reset their release point."
        }
      ],
      tactical: [
        {
          native: "Extra run. Slips beyond the tramline, umpire signals wide immediately.",
          phonetic: "",
          analysis: "Free runs that release the pressure built during the over."
        }
      ],
      classic: [
        {
          native: "Wide called by the umpire. One run added to the extras column.",
          phonetic: "",
          analysis: "Bowler will have to reload and re-bowl this delivery."
        }
      ]
    }
  },

  // ----------------------------------------------------
  // HINDI (हिंदी)
  // ----------------------------------------------------
  hi: {
    '6': {
      hype: [
        {
          native: "छक्का! गेंद गई दर्शकों के बीच! क्या अविश्वसनीय टाइमिंग और प्रचंड प्रहार {batsman} द्वारा!",
          phonetic: "Chhakka! Gend gayi darshakon ke beech! Kya avishvasneeya timing aur prachand prahaar {batsman} dwara!",
          analysis: "गेंदबाज़ की लेंथ थोड़ी सी छोटी रही और बल्लेबाज़ ने बैकफुट पर जाकर पूरा फायदा उठाया।"
        },
        {
          native: "गगनचुंबी छक्का! {batsman} ने {bowler} की गेंद को स्टेडियम के पार भेज दिया! दर्शक झूम उठे!",
          phonetic: "Gaganchumbi chhakka! {batsman} ne {bowler} ki gend ko stadium ke paar bhej diya! Darshak jhoom uthe!",
          analysis: "मिड-ऑन का फील्डर सिर्फ दर्शक बनकर गेंद को हवा में निहारता रह गया।"
        }
      ],
      tactical: [
        {
          native: "शानदार छक्का! स्लॉट में गेंद, सीधा बल्ले का फेस खोला और गेंद लॉन्ग-ऑन बाउंड्री के पार।",
          phonetic: "Shaandaar chhakka! Slot mein gend, seedha bat ka face khola aur gend long-on boundary ke paar.",
          analysis: "गेंदबाज़ को यॉर्कर लेंथ ढूंढ़नी होगी, फुल लेंथ पर बल्लेबाज़ का स्विंग बहुत तेज़ है।"
        }
      ],
      classic: [
        {
          native: "सिक्स! क्रीज़ से बाहर निकलकर गेंद को पूरे अधिकार के साथ सीमा रेखा से 15 मीटर दूर भेजा।",
          phonetic: "Six! Crease se baahar nikalkar gend ko poore adhikaar ke saath seema rekha se 15 meter door bheja.",
          analysis: "स्कोरबोर्ड में 6 बहुमूल्य रन और जुड़ते हुए।"
        }
      ]
    },
    '4': {
      hype: [
        {
          native: "चौका! नज़ाकत भरा कवर ड्राइव! गेंद गोली की रफ्तार से बाउंड्री लाइन पार कर गई!",
          phonetic: "Chauka! Nazaakat bhara cover drive! Gend goli ki raftaar se boundary line paar kar gayi!",
          analysis: "गैप इतना सटीक था कि डीप कवर फील्डर के पास गोता लगाने का भी मौका नहीं मिला।"
        },
        {
          native: "बाउंड्री! शॉर्ट गेंद को बेरहमी से पुल किया और चार रन बटोरे {batsman} ने!",
          phonetic: "Boundary! Short gend ko berahmi se pull kiya aur chaar run batore {batsman} ne!",
          analysis: "फील्ड में गैप की पहचान और तुरंत एग्जीक्यूशन।"
        }
      ],
      tactical: [
        {
          native: "खूबसूरत चौका! शरीर के पास से कट किया, थर्ड मैन की दिशा में गेंद चार रनों के लिए रवाना।",
          phonetic: "Khoobsurat chauka! Shareer ke paas se cut kiya, third man ki disha mein gend chaar ranon ke liye ravana.",
          analysis: "पेस का बेहतरीन इस्तेमाल। फील्डर 30-यार्ड सर्कल के अंदर होने का पूरा लाभ।"
        }
      ],
      classic: [
        {
          native: "चार रन! फ्रंट फुट पर आकर खूबसूरत स्ट्रेट ड्राइव, गेंद सीधे बाउंड्री पार।",
          phonetic: "Chaar run! Front foot par aakar khoobsurat straight drive, gend seedhe boundary paar.",
          analysis: "क्रिकेट की पाठ्यपुस्तक से निकला क्लासिक शॉट।"
        }
      ]
    },
    'W': {
      hype: [
        {
          native: "आउट! क्लीन बोल्ड! {bowler} की तूफानी यॉर्कर ने स्टंप्स की गिल्लियां बिखेर दीं!",
          phonetic: "OUT! Clean bowled! {bowler} ki toofaani yorker ne stumps ki gilliyan bikher deen!",
          analysis: "145 किमी/घंटे की गति और सीधे लेग स्टंप का निचला हिस्सा उड़ा दिया। बहुत बड़ा झटका!"
        },
        {
          native: "विकेट! बड़ा शॉट खेलने के चक्कर में हवा में गेंद और डीप में शानदार कैच! {batsman} वापस पवेलियन!",
          phonetic: "Wicket! Bada shot khelne ke chakkar mein hawa mein gend aur deep mein shaandaar catch! {batsman} waapas pavilion!",
          analysis: "गेंदबाज़ ने गति में बदलाव किया, बल्लेबाज़ समय से पहले शॉट खेल बैठे।"
        }
      ],
      tactical: [
        {
          native: "आउट! एलबीडबल्यू! अंदर आती हुई गेंद पैड से टकराई, अंपायर की उंगली तुरंत हवा में!",
          phonetic: "OUT! LBW! Andar aati hui gend pad se takraayi, umpire ki ungli turant hawa mein!",
          analysis: "रिवर्स स्विंग का बेहतरीन मुजाहिरा। गेंद सीधे मिडिल स्टंप को हिट कर रही थी।"
        }
      ],
      classic: [
        {
          native: "विकेट गिरा! बाहरी किनारा लिया और विकेटकीपर ने कोई गलती नहीं की। सन्नाटा छा गया।",
          phonetic: "Wicket gira! Baahari kinara liya aur wicketkeeper ne koi galti nahi ki. Sannaata chha gaya.",
          analysis: "लगातार चौथी गेंद ऑफ स्टंप की लाइन पर और बल्लेबाज़ को खेलने पर मजबूर किया।"
        }
      ]
    },
    '0': {
      hype: [
        {
          native: "डॉट बॉल! {bowler} की धारदार गेंद, बल्लेबाज़ को पूरी तरह से बीट किया!",
          phonetic: "Dot ball! {bowler} ki dhaardaar gend, batsman ko poori tarah se beat kiya!",
          analysis: "गेंदबाज़ का दबाव लगातार बढ़ रहा है।"
        }
      ],
      tactical: [
        {
          native: "अच्छी लेंथ, ऑफ स्टंप से बाहर, बल्लेबाज़ ने सम्मान दिया और गेंद को जाने दिया।",
          phonetic: "Achhi length, off stump se baahar, batsman ne sammaan diya aur gend ko jaane diya.",
          analysis: "दबाव बनाने के लिए डॉट बॉल सबसे बड़ा हथियार।"
        }
      ],
      classic: [
        {
          native: "कोई रन नहीं। रक्षात्मक ढंग से खेला, गेंद सीधे पॉइंट फील्डर के हाथों में।",
          phonetic: "Koi run nahi. Rakshaatmak dhang se khela, gend seedhe point fielder ke haathon mein.",
          analysis: "अनुशासित गेंदबाजी।"
        }
      ]
    },
    '1': {
      hype: [
        {
          native: "एक रन! कलाई के सहारे मिड-विकेट की तरफ मोड़कर तेजी से स्ट्राइक रोटेट की।",
          phonetic: "Ek run! Kalaai ke sahaare mid-wicket ki taraf modkar tezi se strike rotate ki.",
          analysis: "स्ट्राइक रोटेशन से गेंदबाज़ की लय पर असर पड़ता है।"
        }
      ],
      tactical: [
        {
          native: "सिंगल। गेंद को हल्के हाथों से पुश किया और रन पूरा किया।",
          phonetic: "Single. Gend ko halke haathon se push kiya aur run poora kiya.",
          analysis: "स्ट्राइक बदली, दबाव हटा।"
        }
      ],
      classic: [
        {
          native: "एक रन। गैप में खेला, सुरक्षित सिंगल मिला।",
          phonetic: "Ek run. Gap mein khela, surakshit single mila.",
          analysis: "सतर्क बल्लेबाज़ी।"
        }
      ]
    },
    'extras': {
      hype: [
        {
          native: "अतिरिक्त रन! दिशा से भटके {bowler}, अंपायर ने हाथ फैलाए।",
          phonetic: "Atirikt run! Disha se bhatke {bowler}, umpire ne haath phailaye.",
          analysis: "अतिरिक्त रन अक्सर मैच का रुख तय कर देते हैं।"
        }
      ],
      tactical: [
        {
          native: "वाइड गेंद। लेग स्टंप से काफी बाहर, गेंदबाज़ को अपनी लाइन ठीक करनी होगी।",
          phonetic: "Wide gend. Leg stump se kaafi baahar, bowler ko apni line theek karni hogi.",
          analysis: "अनावश्यक दबाव खुद पर।"
        }
      ],
      classic: [
        {
          native: "एक्स्ट्रा! अंपायर का इशारा वाइड का। स्कोर में एक रन का इजाफा।",
          phonetic: "Extra! Umpire ka ishaara wide ka. Score mein ek run ka izaafa.",
          analysis: "पुनः गेंदबाज़ी होगी।"
        }
      ]
    }
  }
};

// Categorize ball outcome
export function categorizeBallEvent(eventStr = '', textStr = '') {
  const combined = `${eventStr} ${textStr}`.toLowerCase();
  if (combined.includes('wicket') || combined.includes('out') || combined.includes('bowled') || combined.includes('caught') || combined.includes('lbw') || eventStr === 'W') {
    return 'W';
  }
  if (combined.includes('6') || combined.includes('six') || combined.includes('maximum')) {
    return '6';
  }
  if (combined.includes('4') || combined.includes('four') || combined.includes('boundary')) {
    return '4';
  }
  if (combined.includes('wide') || combined.includes('wd') || combined.includes('no ball') || combined.includes('nb')) {
    return 'extras';
  }
  if (combined.includes('1') || combined.includes('single') || combined.includes('1 run')) {
    return '1';
  }
  if (combined.includes('2') || combined.includes('two') || combined.includes('double')) {
    return '1';
  }
  return '0';
}

// Generate commentary based strictly on English or Hindi selection
export function generateRegionalBallCommentary(rawBall, languageCode = 'en', persona = 'hype', matchContext = {}) {
  const langKey = languageCode === 'hi' ? 'hi' : 'en';
  const category = categorizeBallEvent(rawBall.event || '', rawBall.text || '');
  
  const langData = REGIONAL_TEMPLATES[langKey] || REGIONAL_TEMPLATES['en'];
  const catData = langData[category] || langData['0'] || REGIONAL_TEMPLATES['en']['0'];
  const personaPool = catData[persona] || catData['hype'] || Object.values(catData)[0] || [];
  
  const hashKey = (rawBall.ball || '0.1').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const template = personaPool[hashKey % personaPool.length] || personaPool[0];

  const batsman = matchContext?.batting?.striker?.name || 'Batsman';
  const bowler = matchContext?.bowling?.active?.name || 'Bowler';

  const native = (template?.native || rawBall.text || '')
    .replace(/{batsman}/g, batsman)
    .replace(/{bowler}/g, bowler);

  const phonetic = (template?.phonetic || '')
    .replace(/{batsman}/g, batsman)
    .replace(/{bowler}/g, bowler);

  const analysis = (template?.analysis || 'Match momentum hanging in balance.')
    .replace(/{batsman}/g, batsman)
    .replace(/{bowler}/g, bowler);

  return {
    ball: rawBall.ball || '0.0',
    event: rawBall.event || 'Ball',
    category,
    originalText: rawBall.text || '',
    nativeText: native,
    phoneticText: phonetic,
    tacticalInsight: analysis,
    langCode: langKey,
    persona
  };
}

// Generate AI Tactical Over Summary in English or Hindi
export function generateAIOverSummary(match, languageCode = 'en') {
  if (!match) return null;
  const striker = match.batting?.striker?.name || 'Striker';
  const bowler = match.bowling?.active?.name || 'Bowler';
  const winProb = match.winProbability ?? 50;

  const summaries = {
    en: {
      title: "🤖 AI Match & Tactical Pulse Overview",
      content: `${striker} is holding the crease with calm composure while ${bowler} is probing the corridors. Win probability stands calculated at ${winProb}%. Maintaining boundary discipline will dictate the next phase.`,
      tip: "Tactical Advisory: Nailing the blockhole deliveries will be paramount during the death overs."
    },
    hi: {
      title: "🤖 एआई मैच व ओवर पल्स विश्लेषण",
      content: `${striker} बेहतरीन क्रीज़ संतुलन दिखा रहे हैं जबकि ${bowler} वेरिएशन से दबाव बनाने की कोशिश कर रहे हैं। वर्तमान परिस्थितियों में जीत की संभावना ${winProb}% आंकी गई है। रन-रेट नियंत्रण में रखना ही दोनों टीमों की मुख्य रणनीति होगी।`,
      tip: "टैक्टिकल टिप: अंतिम ओवरों में यॉर्कर और धीमी गति की कटर सबसे कारगर साबित होंगी।"
    }
  };

  return summaries[languageCode === 'hi' ? 'hi' : 'en'];
}

// ----------------------------------------------------
// Speech Synthesis Engine (100% Free Browser Native Web Speech API)
// ----------------------------------------------------
let activeUtterance = null;

export function stopSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function isSpeechActive() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  return window.speechSynthesis.speaking;
}

export function speakRegionalCommentary({
  text,
  phoneticText,
  langCode = 'en',
  rate = 1.0,
  pitch = 1.0,
  onStart,
  onEnd,
  onError
}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onError) onError(new Error('SpeechSynthesis not supported on this platform'));
    return;
  }

  stopSpeech();

  const isHindi = langCode === 'hi';
  const langTag = isHindi ? 'hi-IN' : 'en-IN';

  // Query browser speech voices
  const allVoices = window.speechSynthesis.getVoices();
  
  let selectedVoice = allVoices.find(v => 
    v.lang.toLowerCase().replace('_', '-') === langTag.toLowerCase() ||
    v.lang.toLowerCase().startsWith(isHindi ? 'hi' : 'en')
  );

  let textToSpeak = text;

  // Fallback for Hindi if system lacks native Hindi voice
  if (isHindi && !selectedVoice) {
    selectedVoice = allVoices.find(v => v.lang.toLowerCase().includes('in') || v.lang.toLowerCase().startsWith('en'));
    if (phoneticText) {
      textToSpeak = phoneticText;
    }
  }

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
  } else {
    utterance.lang = langTag;
  }

  utterance.rate = rate;
  utterance.pitch = pitch;

  utterance.onstart = () => {
    activeUtterance = utterance;
    if (onStart) onStart();
  };

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    activeUtterance = null;
    if (onError) onError(e);
  };

  window.speechSynthesis.speak(utterance);
}
