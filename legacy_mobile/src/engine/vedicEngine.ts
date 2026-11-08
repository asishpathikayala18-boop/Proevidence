// ─────────────────────────────────────────────────────────────
//  Providence · Master Vedic Astrological Engine (BPHS & Saravali)
//  Synthesizes Natal Rashi, Nakshatra, Vimshottari Dasha, & Yogas
// ─────────────────────────────────────────────────────────────
import { Graha, VedicReading } from './types';
import { estimateNakshatra } from './nakshatras';
import { calculateVimshottari, VIMSHOTTARI_CYCLE } from './vimshottari';
import { detectYogas } from './yogas';

const RASHI_SANSKRIT_MAP: Record<string, { sanskrit: string; graha: Graha; englishGraha: string }> = {
  aries:       { sanskrit: 'मेष (Mesha)',         graha: 'Mangala', englishGraha: 'Mars' },
  taurus:      { sanskrit: 'वृषभ (Vrishabha)',    graha: 'Shukra',  englishGraha: 'Venus' },
  gemini:      { sanskrit: 'मिथुन (Mithuna)',      graha: 'Budha',   englishGraha: 'Mercury' },
  cancer:      { sanskrit: 'कर्क (Karka)',         graha: 'Chandra', englishGraha: 'Moon' },
  leo:         { sanskrit: 'सिंह (Simha)',         graha: 'Surya',   englishGraha: 'Sun' },
  virgo:       { sanskrit: 'कन्या (Kanya)',        graha: 'Budha',   englishGraha: 'Mercury' },
  libra:       { sanskrit: 'तुला (Tula)',          graha: 'Shukra',  englishGraha: 'Venus' },
  scorpio:     { sanskrit: 'वृश्चिक (Vrishchika)', graha: 'Mangala', englishGraha: 'Mars' },
  sagittarius: { sanskrit: 'धनु (Dhanu)',          graha: 'Guru',    englishGraha: 'Jupiter' },
  capricorn:   { sanskrit: 'मकर (Makara)',         graha: 'Shani',   englishGraha: 'Saturn' },
  aquarius:    { sanskrit: 'कुम्भ (Kumbha)',       graha: 'Shani',   englishGraha: 'Saturn' },
  pisces:      { sanskrit: 'मीन (Meena)',          graha: 'Guru',    englishGraha: 'Jupiter' },
};

/**
 * Computes an authentic Vedic Astrological Reading based on DOB & Zodiac sign
 * strictly honoring the BPHS (Brihat Parashara Hora Shastra) framework.
 */
export function computeVedicReading(dob: Date, signId: string, signName: string, element: string, symbol: string): VedicReading {
  const rashiMeta = RASHI_SANSKRIT_MAP[signId.toLowerCase()] || {
    sanskrit: signName,
    graha: 'Surya' as Graha,
    englishGraha: 'Sun',
  };

  // 1. Lunar Nakshatra determination
  const nakshatra = estimateNakshatra(dob);

  // 2. Vimshottari 120-Year Dasha sequence
  const dashaData = calculateVimshottari(dob, nakshatra);

  // 3. Classical Yoga scan
  const yogas = detectYogas(signId.toLowerCase(), rashiMeta.graha);

  // 4. Synthesize Classical Past / Present / Future predictions based on Dasha Lord
  const pastConfig = VIMSHOTTARI_CYCLE.find(c => c.graha === dashaData.pastMahadasha?.planet) || VIMSHOTTARI_CYCLE[0];
  const presentConfig = VIMSHOTTARI_CYCLE.find(c => c.graha === dashaData.currentMahadasha.planet) || VIMSHOTTARI_CYCLE[1];
  const futureConfig = VIMSHOTTARI_CYCLE.find(c => c.graha === dashaData.futureMahadasha?.planet) || VIMSHOTTARI_CYCLE[2];

  const predictions = {
    past: {
      title: `${pastConfig.english} Period (${dashaData.pastMahadasha?.startDate || 'Youth'} – ${dashaData.pastMahadasha?.endDate || 'Recent'})`,
      theme: pastConfig.theme,
      description:
        `According to Saravali, during the prior ${pastConfig.english} Mahādaśā, your soul was governed by ` +
        `the cosmic lessons of ${pastConfig.graha}. ${pastConfig.pastTheme} ` +
        `The challenges endured during this period have hardened your resilience and established the core wisdom you now rely upon.`,
      rulingGraha: pastConfig.graha,
    },
    present: {
      title: `${presentConfig.english} Active Mahādaśā (${dashaData.currentMahadasha.startDate} – ${dashaData.currentMahadasha.endDate})`,
      theme: presentConfig.theme,
      description:
        `Bṛhat Parāśara Horāśāstra states: "The ruling planet (Daśānātha) eclipses the mind of the person." ` +
        `Right now, ${presentConfig.english} dominates your cosmic sky. ${presentConfig.presentTheme} ` +
        `Your active Sub-period (${dashaData.currentAntardasha.englishPlanet}) concentrates this energy into decisive moments in career, relationships, and dharma.`,
      rulingGraha: presentConfig.graha,
    },
    future: {
      title: `Upcoming ${futureConfig.english} Mahādaśā (${dashaData.futureMahadasha?.startDate || 'Next Phase'} – ${dashaData.futureMahadasha?.endDate || 'Future'})`,
      theme: futureConfig.theme,
      description:
        `As the celestial clock turns to your next Mahādaśā under ${futureConfig.english}, a profound cosmic shift takes place. ` +
        `${futureConfig.futureTheme} ` +
        `Classical texts predict this transition will bring high expansion, elevation in status, and karmic harvest for all efforts planted today.`,
      rulingGraha: futureConfig.graha,
    },
  };

  return {
    rashi: {
      name: signName,
      sanskritName: rashiMeta.sanskrit,
      symbol,
      ruler: rashiMeta.graha,
      englishRuler: rashiMeta.englishGraha,
      element,
    },
    nakshatra,
    currentDasha: {
      mahadasha: dashaData.currentMahadasha,
      antardasha: dashaData.currentAntardasha,
    },
    dashaTimeline: dashaData.timeline,
    yogas,
    predictions,
  };
}
