// ─────────────────────────────────────────────
//  Providence · Bilingual Localization (English & Telugu)
//  Simple words for easy understanding
// ─────────────────────────────────────────────
import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'te';

interface Translations {
  // Common & Header
  appTitle: string;
  appSub: string;
  selectLanguage: string;
  yourName: string;
  namePlaceholder: string;
  yourDob: string;
  selectDob: string;
  readDestiny: string;
  twelveSigns: string;
  planetaryRulers: string;
  back: string;

  // Confidence & Engine
  accuracy: string;
  sevenLayerTitle: string;
  sevenLayerSub: string;

  // Dasha & Timeline
  activeDasha: string;
  mahadasha: string;
  antardasha: string;
  activeSpan: string;
  past: string;
  present: string;
  future: string;

  // Nakshatra & Transits
  birthNakshatra: string;
  pada: string;
  governedBy: string;
  deity: string;
  realtimeGochara: string;
  sadeSatiClear: string;
  sadeSatiActive: string;
  favorableTransits: string;
  obstructedTransits: string;

  // Domains
  domainsTitle: string;
  domainCareer: string;
  domainWealth: string;
  domainLove: string;
  domainHealth: string;
  domainSpiritual: string;
  domainFamily: string;

  // Lucky & Remedies
  cosmicLuck: string;
  luckyNumbers: string;
  luckyColors: string;
  luckyDays: string;
  gemstone: string;
  metal: string;
  direction: string;
  mantraTitle: string;
  mantraInstruction: string;
  seeNumerology: string;

  // Numerology screen
  numerologyTitle: string;
  numerologySub: string;
  lifePathTitle: string;
  lifePathSub: string;
  powerNumber: string;
  karmaNumber: string;
  chaldeanTitle: string;
  personalCycles: string;
  personalYear: string;
  personalMonth: string;
  personalDay: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appTitle: 'PROVIDENCE',
    appSub: 'Unlock the Secrets of Your Cosmos',
    selectLanguage: 'Language',
    yourName: 'YOUR FULL NAME (OPTIONAL)',
    namePlaceholder: 'Enter your name for name vibration',
    yourDob: 'YOUR DATE OF BIRTH',
    selectDob: 'Select your birth date',
    readDestiny: '✦ Read My 7-Layer Destiny ✦',
    twelveSigns: '⬡ THE TWELVE SIGNS ⬡',
    planetaryRulers: '⬡ PLANETARY RULERS ⬡',
    back: '← Back',

    accuracy: 'ACCURACY',
    sevenLayerTitle: '✦ 7-LAYER VEDIC SYNTHESIS',
    sevenLayerSub: 'Real Ephemeris · Nakshatra · Vimshottari · Transits · Numerology',

    activeDasha: '⏳ CURRENT PLANETARY PERIOD (DAŚĀ)',
    mahadasha: 'Main Period',
    antardasha: 'Sub-Period',
    activeSpan: 'Active Span',
    past: 'Past',
    present: 'Present',
    future: 'Future',

    birthNakshatra: '✦ BIRTH STAR (NAKṢATRA) & PĀDA',
    pada: 'Quarter (Pada)',
    governedBy: 'Governed by',
    deity: 'Presiding Deity',
    realtimeGochara: '⬡ TODAY\'S PLANET TRANSITS & SADE-SATI ⬡',
    sadeSatiClear: 'SĀḌHE-SĀTĪ: INACTIVE · PATH CLEAR (0% Trouble)',
    sadeSatiActive: 'SĀḌHE-SĀTĪ ACTIVE (Patience & Remedy Advised)',
    favorableTransits: 'Helpful Transits',
    obstructedTransits: 'Challenging Transits',

    domainsTitle: '⬡ 6 LIFE DOMAINS FORECAST ⬡',
    domainCareer: 'Career & Work',
    domainWealth: 'Money & Wealth',
    domainLove: 'Love & Marriage',
    domainHealth: 'Health & Energy',
    domainSpiritual: 'Spiritual Peace',
    domainFamily: 'Family & Home',

    cosmicLuck: '⟡ COSMIC LUCK & SIMPLE REMEDIES',
    luckyNumbers: 'Lucky Numbers',
    luckyColors: 'Lucky Colors',
    luckyDays: 'Lucky Days',
    gemstone: 'Power Gemstone',
    metal: 'Lucky Metal',
    direction: 'Best Direction',
    mantraTitle: '✦ SACRED DAILY MANTRA',
    mantraInstruction: 'Chant 108 times at sunrise for positive energy and fortune.',
    seeNumerology: '✦ See My Full Numerology Blueprint ✦',

    numerologyTitle: 'COSMIC NUMEROLOGY',
    numerologySub: 'Easy Pythagorean & Chaldean Blueprint',
    lifePathTitle: 'LIFE PATH NUMBER',
    lifePathSub: 'Your core nature and soul mission in this life',
    powerNumber: 'POWER NUMBER',
    karmaNumber: 'KARMA NUMBER',
    chaldeanTitle: '✦ ANCIENT CHALDEAN NAME VIBRATION',
    personalCycles: '⬡ YOUR ACTIVE PERSONAL CYCLES ⬡',
    personalYear: 'Personal Year',
    personalMonth: 'Personal Month',
    personalDay: 'Personal Day',
  },

  te: {
    appTitle: 'ప్రావిడెన్స్ (PROVIDENCE)',
    appSub: 'మీ రాశిఫలాలు & అదృష్ట రహస్యాలు తెలుసుకోండి',
    selectLanguage: 'భాష',
    yourName: 'మీ పూర్తి పేరు (ఐచ్ఛికం)',
    namePlaceholder: 'మీ పేరు నమోదు చేయండి (న్యూమరాలజీ కోసం)',
    yourDob: 'మీ పుట్టిన తేదీ (DOB)',
    selectDob: 'పుట్టిన తేదీని ఎంచుకోండి',
    readDestiny: '✦ నా జాతకం & భవిష్యత్తు తెలుసుకోండి ✦',
    twelveSigns: '⬡ ద్వాదశ రాశులు (12 SIGNS) ⬡',
    planetaryRulers: '⬡ నవగ్రహాలు (PLANETS) ⬡',
    back: '← వెనుకకు',

    accuracy: 'ఖచ్చితత్వం',
    sevenLayerTitle: '✦ 7 రకాల శాస్త్రీయ జ్యోతిష్య విశ్లేషణ',
    sevenLayerSub: 'లాహిరి పంచాంగం · నక్షత్ర పాదం · వింశోత్తరి దశ · గోచారం · న్యూమరాలజీ',

    activeDasha: '⏳ ప్రస్తుతం నడుస్తున్న గ్రహ దశ (దశా కాలం)',
    mahadasha: 'ప్రధాన దశ',
    antardasha: 'అంతర్దశ',
    activeSpan: 'ప్రస్తుత సమయం',
    past: 'గతం',
    present: 'వర్తమానం',
    future: 'భవిష్యత్తు',

    birthNakshatra: '✦ జన్మ నక్షత్రం & పాదం (BIRTH STAR)',
    pada: 'పాదం',
    governedBy: 'నక్షత్రాధిపతి',
    deity: 'అధిదేవత',
    realtimeGochara: '⬡ నేటి గ్రహ సంచారం & ఏలినాటి శని వివరాలు ⬡',
    sadeSatiClear: 'ఏలినాటి శని లేదు · సమయం చాలా అనుకూలంగా ఉంది (Safe)',
    sadeSatiActive: 'ఏలినాటి శని ప్రభావం ఉంది (ఓపిక & పరిహారాలు అవసరం)',
    favorableTransits: 'అనుకూల గ్రహాలు',
    obstructedTransits: 'ప్రతికూల గ్రహాలు',

    domainsTitle: '⬡ జీవితంలోని 6 ముఖ్య రంగాలు ⬡',
    domainCareer: 'కెరీర్ & ఉద్యోగం',
    domainWealth: 'ధనం & సంపద',
    domainLove: 'ప్రేమ & దాంపత్యం',
    domainHealth: 'ఆరోగ్యం & శారీరక బలం',
    domainSpiritual: 'ఆధ్యాత్మికం & మనశ్శాంతి',
    domainFamily: 'కుటుంబం & సుఖసంతోషాలు',

    cosmicLuck: '⟡ అదృష్టాలు & సులువైన పరిహారాలు',
    luckyNumbers: 'లక్కీ నంబర్లు',
    luckyColors: 'లక్కీ రంగులు',
    luckyDays: 'లక్కీ వారాలు',
    gemstone: 'అదృష్ట రత్నం',
    metal: 'లక్కీ లోహం',
    direction: 'అనుకూల దిక్కు',
    mantraTitle: '✦ పవిత్రమైన బీజాక్షర మంత్రం',
    mantraInstruction: 'శుభ ఫలితాల కోసం ఉదయం పూట ఈ మంత్రాన్ని 108 సార్లు జపించండి.',
    seeNumerology: '✦ నా పూర్తి సంఖ్యాశాస్త్రం (న్యూమరాలజీ) చూడండి ✦',

    numerologyTitle: 'సంఖ్యాశాస్త్ర విశ్లేషణ (NUMEROLOGY)',
    numerologySub: 'పైథాగరస్ & చాల్డియన్ అదృష్ట సంఖ్యల రహస్యం',
    lifePathTitle: 'జీవిత గమ్య సంఖ్య (LIFE PATH)',
    lifePathSub: 'మీ వ్యక్తిత్వం, ప్రవర్తన మరియు విజయ రహస్యం',
    powerNumber: 'పవర్ నంబర్',
    karmaNumber: 'కర్మ నంబర్',
    chaldeanTitle: '✦ ప్రాచీన చాల్డియన్ నామ సంఖ్యా బలం',
    personalCycles: '⬡ ఈ సంవత్సరం & ఈ నెల మీ అదృష్ట చక్రం ⬡',
    personalYear: 'ఈ ఏడాది సంఖ్య',
    personalMonth: 'ఈ నెల సంఖ్య',
    personalDay: 'నేటి సంఖ్య',
  },
};

// Rashi names in Telugu
export const TELUGU_RASHIS: Record<string, { teluguName: string; element: string; lord: string }> = {
  aries:       { teluguName: 'మేష రాశి (Aries)',        element: 'అగ్ని తత్వం',  lord: 'కుజుడు (Mars)' },
  taurus:      { teluguName: 'వృషభ రాశి (Taurus)',      element: 'భూ తత్వం',    lord: 'శుక్రుడు (Venus)' },
  gemini:      { teluguName: 'మిథున రాశి (Gemini)',     element: 'వాయు తత్వం',  lord: 'బుధుడు (Mercury)' },
  cancer:      { teluguName: 'కర్కాటక రాశి (Cancer)',   element: 'జల తత్వం',    lord: 'చంద్రుడు (Moon)' },
  leo:         { teluguName: 'సింహ రాశి (Leo)',         element: 'అగ్ని తత్వం',  lord: 'సూర్యుడు (Sun)' },
  virgo:       { teluguName: 'కన్య రాశి (Virgo)',        element: 'భూ తత్వం',    lord: 'బుధుడు (Mercury)' },
  libra:       { teluguName: 'తులా రాశి (Libra)',        element: 'వాయు తత్వం',  lord: 'శుక్రుడు (Venus)' },
  scorpio:     { teluguName: 'వృశ్చిక రాశి (Scorpio)',  element: 'జల తత్వం',    lord: 'కుజుడు (Mars)' },
  sagittarius: { teluguName: 'ధనుస్సు రాశి (Sagittarius)',element: 'అగ్ని తత్వం', lord: 'గురుడు (Jupiter)' },
  capricorn:   { teluguName: 'మకర రాశి (Capricorn)',    element: 'భూ తత్వం',    lord: 'శని (Saturn)' },
  aquarius:    { teluguName: 'కుంభ రాశి (Aquarius)',     element: 'వాయు తత్వం',  lord: 'శని (Saturn)' },
  pisces:      { teluguName: 'మీన రాశి (Pisces)',        element: 'జల తత్వం',    lord: 'గురుడు (Jupiter)' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: TRANSLATIONS.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = {
    language,
    setLanguage,
    t: TRANSLATIONS[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
