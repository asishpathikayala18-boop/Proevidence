// ═══════════════════════════════════════════════════════════════════
//  Providence · MASTER PREDICTION SYNTHESIZER v2.0
//  All 7 layers combined → one rich, multi-domain reading
//  Layers: Ephemeris · Nakshatra · Vimshottari · Antardasha
//          · Transits · Yogas · Dual Numerology · Confidence Scoring
// ═══════════════════════════════════════════════════════════════════
import { computeNatalChart, getTodayChart, NatalChart } from './ephemeris';
import { NAKSHATRAS, estimateNakshatra } from './nakshatras';
import { calculateVimshottari, VIMSHOTTARI_CYCLE, GrahaDashaConfig } from './vimshottari';
import { detectYogas } from './yogas';
import { analyzeTransits } from './transits';
import { computeNumerology } from './numerology';
import { computeConfidence, PredictionConfidence, DomainScore } from './scorer';
import { Graha, VedicReading, YogaResult } from './types';

export interface FullProvidentReading {
  // Core identity
  rashi: { name: string; sanskritName: string; symbol: string; ruler: Graha; englishRuler: string; element: string };
  nakshatra: ReturnType<typeof estimateNakshatra>;

  // Natal chart (real astronomical positions)
  natalChart: NatalChart;

  // Dasha timing
  currentDasha: { mahadasha: any; antardasha: any };
  dashaTimeline: any[];

  // Yogas
  yogas: YogaResult[];

  // Real-time transits
  transitAnalysis: ReturnType<typeof analyzeTransits>;

  // Numerology
  numerology: ReturnType<typeof computeNumerology>;

  // 7-layer confidence scores
  confidence: PredictionConfidence;

  // Narrative predictions (Past · Present · Future)
  predictions: {
    past: { title: string; theme: string; description: string; rulingGraha: Graha; dashaYears: string };
    present: { title: string; theme: string; description: string; rulingGraha: Graha; dashaYears: string; subPeriod: string };
    future: { title: string; theme: string; description: string; rulingGraha: Graha; dashaYears: string };
  };

  // Life domain scores (summary)
  domainScores: DomainScore[];

  // Lucky data (combined from all systems)
  cosmicLuck: {
    luckyNumbers: number[];
    luckyColors: string[];
    luckyDays: string[];
    luckyGemstone: string;
    luckyMetal: string;
    mantra: string;
    bestCity: string;
    bestDirection: string;
  };
}

// ─── Rashi meta-data ────────────────────────────────────────────
const RASHI_META: Record<string, {
  sanskrit: string; graha: Graha; englishGraha: string;
  luckyColors: string[]; metal: string; mantra: string;
  bestDirection: string; bestCity: string; gemstone: string;
}> = {
  aries:       { sanskrit:'मेष (Mesha)',         graha:'Mangala', englishGraha:'Mars',    luckyColors:['Red','Crimson'],          metal:'Iron',   mantra:'Om Mangalaya Namah',         bestDirection:'East',      bestCity:'Mumbai',  gemstone:'Coral' },
  taurus:      { sanskrit:'वृषभ (Vrishabha)',    graha:'Shukra',  englishGraha:'Venus',   luckyColors:['White','Pink'],           metal:'Silver', mantra:'Om Shukraya Namah',          bestDirection:'South',     bestCity:'Pune',    gemstone:'Diamond' },
  gemini:      { sanskrit:'मिथुन (Mithuna)',      graha:'Budha',   englishGraha:'Mercury', luckyColors:['Green','Yellow'],         metal:'Bronze', mantra:'Om Budhaya Namah',           bestDirection:'West',      bestCity:'Delhi',   gemstone:'Emerald' },
  cancer:      { sanskrit:'कर्क (Karka)',         graha:'Chandra', englishGraha:'Moon',    luckyColors:['Silver','White'],         metal:'Silver', mantra:'Om Chandraya Namah',         bestDirection:'North',     bestCity:'Kolkata', gemstone:'Pearl' },
  leo:         { sanskrit:'सिंह (Simha)',         graha:'Surya',   englishGraha:'Sun',     luckyColors:['Gold','Orange'],          metal:'Gold',   mantra:'Om Suryaya Namah',           bestDirection:'East',      bestCity:'Jaipur',  gemstone:'Ruby' },
  virgo:       { sanskrit:'कन्या (Kanya)',        graha:'Budha',   englishGraha:'Mercury', luckyColors:['Green','Brown'],          metal:'Bronze', mantra:'Om Budhaya Namah',           bestDirection:'South',     bestCity:'Bengaluru',gemstone:'Emerald' },
  libra:       { sanskrit:'तुला (Tula)',          graha:'Shukra',  englishGraha:'Venus',   luckyColors:['Blue','Pink'],            metal:'Silver', mantra:'Om Shukraya Namah',          bestDirection:'West',      bestCity:'Hyderabad',gemstone:'Diamond' },
  scorpio:     { sanskrit:'वृश्चिक (Vrishchika)', graha:'Mangala', englishGraha:'Mars',    luckyColors:['Dark Red','Maroon'],      metal:'Iron',   mantra:'Om Mangalaya Namah',         bestDirection:'North',     bestCity:'Chennai', gemstone:'Red Coral' },
  sagittarius: { sanskrit:'धनु (Dhanu)',          graha:'Guru',    englishGraha:'Jupiter', luckyColors:['Yellow','Gold'],          metal:'Gold',   mantra:'Om Guruve Namah',            bestDirection:'Northeast', bestCity:'Varanasi',gemstone:'Yellow Sapphire' },
  capricorn:   { sanskrit:'मकर (Makara)',         graha:'Shani',   englishGraha:'Saturn',  luckyColors:['Black','Dark Blue'],      metal:'Iron',   mantra:'Om Shanaye Namah',           bestDirection:'West',      bestCity:'Ahmedabad',gemstone:'Blue Sapphire' },
  aquarius:    { sanskrit:'कुम्भ (Kumbha)',       graha:'Shani',   englishGraha:'Saturn',  luckyColors:['Blue','Grey'],            metal:'Iron',   mantra:'Om Shanaye Namah',           bestDirection:'Northwest', bestCity:'Surat',   gemstone:'Blue Sapphire' },
  pisces:      { sanskrit:'मीन (Meena)',          graha:'Guru',    englishGraha:'Jupiter', luckyColors:['Sea Green','Purple'],     metal:'Gold',   mantra:'Om Guruve Namah',            bestDirection:'Northeast', bestCity:'Rishikesh',gemstone:'Yellow Sapphire' },
};

// ─── Build rich narrative from Dasha config ─────────────────────
function buildPastNarrative(cfg: GrahaDashaConfig, period: any): string {
  return (
    `According to Bṛhat Parāśara Horāśāstra, your prior life chapter was governed by ` +
    `${cfg.english} Mahādaśā (${period?.startDate || 'Earlier years'} – ${period?.endDate || 'Recent past'}). ` +
    `${cfg.pastTheme} ` +
    `This planetary lord illuminated the domains of "${cfg.theme}" with both blessings and lessons. ` +
    `The experiences of this period — whether trials or triumphs — were precisely calibrated by cosmic law ` +
    `to prepare your soul for the current phase of existence.`
  );
}

function buildPresentNarrative(cfg: GrahaDashaConfig, period: any, antardasha: any, transitWeather: string): string {
  return (
    `Right now, your life is governed by ${cfg.english} Mahādaśā ` +
    `(${period?.startDate} – ${period?.endDate}). ` +
    `BPHS states: "The Daśānātha eclipses the mind of the native." ` +
    `Your dominant cosmic theme is: "${cfg.theme}." ` +
    `${cfg.presentTheme} ` +
    `Within this Mahādaśā, the sub-period (Antardaśā) of ${antardasha?.englishPlanet} ` +
    `focuses this energy even further. ` +
    `Today's cosmic weather: ${transitWeather}`
  );
}

function buildFutureNarrative(cfg: GrahaDashaConfig, period: any, numerologyYear: number, pyMeaning: string): string {
  return (
    `The celestial clock is turning toward your next Mahādaśā under ${cfg.english} ` +
    `(${period?.startDate || 'Approaching'} – ${period?.endDate || 'Future'}). ` +
    `${cfg.futureTheme} ` +
    `Your Personal Year ${numerologyYear} theme — "${pyMeaning}" — perfectly mirrors ` +
    `the incoming planetary energy, creating a powerful numerological confirmation of this trajectory. ` +
    `Prepare now by strengthening the domains that ${cfg.english} governs: "${cfg.theme}." ` +
    `Classical Sārāvalī teaches that understanding your future Dasha cycle ` +
    `is the most powerful form of spiritual preparation available to a human being.`
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MASTER COMPUTE FUNCTION
// ═══════════════════════════════════════════════════════════════════
export function computeFullReading(
  dob: Date,
  signId: string,
  signName: string,
  element: string,
  symbol: string,
  luckyDays: string[],
  luckyNumbers: number[],
  natalLuckyColors: string[],
  fullName = '',
): FullProvidentReading {
  const sid = signId.toLowerCase();
  const meta = RASHI_META[sid] || RASHI_META['aries'];

  // ── Layer 1: Real Natal Chart (Ephemeris) ──
  const natalChart = computeNatalChart(dob);

  // ── Layer 2: Nakshatra from real Moon position ──
  // Use real Moon Nakshatra from natal chart if available
  const nakshatraFromChart = NAKSHATRAS[natalChart.moon.nakshatraIndex] || estimateNakshatra(dob);
  const nakshatra = nakshatraFromChart;

  // ── Layer 3 & 4: Vimshottari Dasha ──
  const dashaData = calculateVimshottari(dob, nakshatra);

  // ── Layer 6: Yoga Detection ──
  const yogas = detectYogas(sid, meta.graha);

  // ── Layer 5: Transit Analysis (Gochara) ──
  const transitAnalysis = analyzeTransits(natalChart);

  // ── Layer 7: Dual Numerology ──
  const numerology = computeNumerology(dob, fullName);

  // ── Collect Dasha configs for scorer ──
  const presentConfig = VIMSHOTTARI_CYCLE.find(c => c.graha === dashaData.currentMahadasha.planet) || VIMSHOTTARI_CYCLE[1];
  const pastConfig    = VIMSHOTTARI_CYCLE.find(c => c.graha === dashaData.pastMahadasha?.planet)    || VIMSHOTTARI_CYCLE[0];
  const futureConfig  = VIMSHOTTARI_CYCLE.find(c => c.graha === dashaData.futureMahadasha?.planet)  || VIMSHOTTARI_CYCLE[2];

  // ── Confidence Scorer (synthesizes all 7 layers) ──
  const confidence = computeConfidence(
    natalChart,
    presentConfig,
    pastConfig,
    futureConfig,
    transitAnalysis.transits,
    transitAnalysis.sadeSati,
    transitAnalysis.overallScore,
    yogas,
    numerology,
    nakshatra.deity,
  );

  // ── Build rich narrative predictions ──
  const predictions = {
    past: {
      title: `${pastConfig.english} Mahādaśā — Your Formative Chapter`,
      theme: pastConfig.theme,
      description: buildPastNarrative(pastConfig, dashaData.pastMahadasha),
      rulingGraha: pastConfig.graha,
      dashaYears: `${dashaData.pastMahadasha?.startDate || 'Earlier'} – ${dashaData.pastMahadasha?.endDate || 'Recent'}`,
    },
    present: {
      title: `${presentConfig.english} Active Mahādaśā`,
      theme: presentConfig.theme,
      description: buildPresentNarrative(
        presentConfig,
        dashaData.currentMahadasha,
        dashaData.currentAntardasha,
        transitAnalysis.currentWeather,
      ),
      rulingGraha: presentConfig.graha,
      dashaYears: `${dashaData.currentMahadasha.startDate} – ${dashaData.currentMahadasha.endDate}`,
      subPeriod: dashaData.currentAntardasha.englishPlanet,
    },
    future: {
      title: `Upcoming ${futureConfig.english} Mahādaśā`,
      theme: futureConfig.theme,
      description: buildFutureNarrative(futureConfig, dashaData.futureMahadasha, numerology.personalYear, numerology.personalYearMeaning),
      rulingGraha: futureConfig.graha,
      dashaYears: `${dashaData.futureMahadasha?.startDate || 'Approaching'} – ${dashaData.futureMahadasha?.endDate || 'Future'}`,
    },
  };

  // ── Cosmic Luck (combined from all systems) ──
  const allLuckyNumbers = [
    ...new Set([...luckyNumbers, ...numerology.luckyNumbers, numerology.powerNumber])
  ].slice(0, 5);

  const cosmicLuck = {
    luckyNumbers: allLuckyNumbers,
    luckyColors: [...new Set([...meta.luckyColors, ...natalLuckyColors])].slice(0, 4),
    luckyDays,
    luckyGemstone: meta.gemstone,
    luckyMetal: meta.metal,
    mantra: meta.mantra,
    bestCity: meta.bestCity,
    bestDirection: meta.bestDirection,
  };

  return {
    rashi: {
      name: signName,
      sanskritName: meta.sanskrit,
      symbol,
      ruler: meta.graha,
      englishRuler: meta.englishGraha,
      element,
    },
    nakshatra,
    natalChart,
    currentDasha: {
      mahadasha: dashaData.currentMahadasha,
      antardasha: dashaData.currentAntardasha,
    },
    dashaTimeline: dashaData.timeline,
    yogas,
    transitAnalysis,
    numerology,
    confidence,
    predictions,
    domainScores: confidence.domains,
    cosmicLuck,
  };
}
