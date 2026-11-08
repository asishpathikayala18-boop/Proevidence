// ─────────────────────────────────────────────────────────────
//  Providence · Vimśottarī Daśā Engine (BPHS Chapter 46)
//  Universal 120-year planetary cycle for Past, Present, Future
// ─────────────────────────────────────────────────────────────
import { Graha, DashaPeriod } from './types';
import { NakshatraInfo } from './types';

export interface GrahaDashaConfig {
  graha: Graha;
  english: string;
  years: number;
  theme: string;
  pastTheme: string;
  presentTheme: string;
  futureTheme: string;
}

export const VIMSHOTTARI_CYCLE: GrahaDashaConfig[] = [
  {
    graha: 'Ketu',
    english: 'South Node (Ketu)',
    years: 7,
    theme: 'Spiritual detachment, sudden revelations, karmic cleansing',
    pastTheme: 'You underwent profound inward trials and spiritual maturation that dissolved illusions.',
    presentTheme: 'Current period calls for introspection, meditation, and letting go of material anxiety.',
    futureTheme: 'Upcoming phase will spark deep spiritual enlightenment and freedom from old karmic binds.',
  },
  {
    graha: 'Shukra',
    english: 'Venus (Shukra)',
    years: 20,
    theme: 'Love, artistic expression, wealth accumulation, worldly harmony',
    pastTheme: 'Your past flourished with relational connections, creative pursuits, and refined tastes.',
    presentTheme: 'Venus blesses your present moments with attraction, financial opportunities, and social grace.',
    futureTheme: 'A luminous 20-year golden era of abundance, romance, and joyful creation lies ahead.',
  },
  {
    graha: 'Surya',
    english: 'Sun (Surya)',
    years: 6,
    theme: 'Vitality, authority, public recognition, soul purpose',
    pastTheme: 'Prior years tested and forged your core self-respect, fatherhood bonds, and inner backbone.',
    presentTheme: 'The radiant Sun illuminates your authority, career leadership, and clear sense of self.',
    futureTheme: 'Upcoming royal solar cycle elevates your reputation, status, and recognition in society.',
  },
  {
    graha: 'Chandra',
    english: 'Moon (Chandra)',
    years: 10,
    theme: 'Intuition, emotional depth, motherly warmth, domestic peace',
    pastTheme: 'Formative years guided by emotional sensitivity, family roots, and mental adaptability.',
    presentTheme: 'High intuitive clarity and mental peace now guide your decisions and personal relationships.',
    futureTheme: 'A tranquil period of emotional fulfillment, motherly blessings, and public goodwill awaits.',
  },
  {
    graha: 'Mangala',
    english: 'Mars (Mangala)',
    years: 7,
    theme: 'Courage, technical drive, ambition, overcoming obstacles',
    pastTheme: 'Dynamic battles and high energy required intense endurance and competitive perseverance.',
    presentTheme: 'Fierce Martian courage powers your ambition to defeat obstacles and execute bold ideas.',
    futureTheme: 'A surge of executive drive, property gains, and fearless action will open new frontiers.',
  },
  {
    graha: 'Rahu',
    english: 'North Node (Rahu)',
    years: 18,
    theme: 'Worldly ambition, innovation, foreign travel, unconventional breakthrough',
    pastTheme: 'Intense cravings, unconventional disruptions, and radical worldly shifts shaped your view.',
    presentTheme: 'Rahu propels unquenchable desire for innovation, global expansion, and breakthrough success.',
    futureTheme: 'Fast-paced transformation, tech mastery, and international connections will rapidly unfold.',
  },
  {
    graha: 'Guru',
    english: 'Jupiter (Brihaspati)',
    years: 16,
    theme: 'Wisdom, higher learning, fortune, spiritual mentorship, progeny',
    pastTheme: 'Mentors, philosophical study, and divine protection cushioned and guided your journey.',
    presentTheme: 'Expansive Jupiter shower of wisdom, financial fortune, and dharmic alignment is active.',
    futureTheme: 'Great spiritual elevation, advisory roles, wealth creation, and lasting family honor arrive.',
  },
  {
    graha: 'Shani',
    english: 'Saturn (Shani)',
    years: 19,
    theme: 'Discipline, karmic justice, hard labor, enduring foundations',
    pastTheme: 'Strict Saturnian discipline forged resilience, maturity, and unshakeable patience through trials.',
    presentTheme: 'Focused, steady labor builds solid foundations; patience rewards your long-term dedication.',
    futureTheme: 'Mastery of life discipline brings permanent authority, high respect, and unshakeable mastery.',
  },
  {
    graha: 'Budha',
    english: 'Mercury (Budha)',
    years: 17,
    theme: 'Intellect, commerce, communication, analytical prowess',
    pastTheme: 'Curiosity, schooling, trade skills, and rapid communication shaped your intellectual basis.',
    presentTheme: 'Sharp communicative wit, profitable business acumen, and mental agility are at peak power.',
    futureTheme: 'Prolific intellectual output, lucrative commerce, and networking triumph mark the horizon.',
  },
];

/**
 * Calculates complete Vimshottari Mahadasha sequence starting from birth Nakshatra ruler.
 */
export function calculateVimshottari(dob: Date, nakshatra: NakshatraInfo): {
  timeline: DashaPeriod[];
  currentMahadasha: DashaPeriod;
  currentAntardasha: DashaPeriod;
  pastMahadasha?: DashaPeriod;
  futureMahadasha?: DashaPeriod;
} {
  const startIndex = VIMSHOTTARI_CYCLE.findIndex(c => c.graha === nakshatra.ruler);
  const cycleStartIndex = startIndex >= 0 ? startIndex : 0;

  const birthTimeMs = dob.getTime();
  const now = new Date();

  const timeline: DashaPeriod[] = [];
  let currentPointerYear = dob.getFullYear() + dob.getMonth() / 12 + dob.getDate() / 365.25;

  let currentMahadasha: DashaPeriod | null = null;
  let pastMahadasha: DashaPeriod | null = null;
  let futureMahadasha: DashaPeriod | null = null;

  for (let i = 0; i < 9; i++) {
    const cycleItem = VIMSHOTTARI_CYCLE[(cycleStartIndex + i) % 9];
    const startYear = currentPointerYear;
    const endYear = currentPointerYear + cycleItem.years;

    const startDate = new Date(dob);
    startDate.setFullYear(Math.floor(startYear));
    const endDate = new Date(dob);
    endDate.setFullYear(Math.floor(endYear));

    const isCurrent = now >= startDate && now < endDate;

    const period: DashaPeriod = {
      planet: cycleItem.graha,
      englishPlanet: cycleItem.english,
      years: cycleItem.years,
      startDate: startDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      endDate: endDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      isCurrent,
      theme: cycleItem.theme,
    };

    timeline.push(period);

    if (isCurrent) {
      currentMahadasha = period;
      if (timeline.length > 1) {
        pastMahadasha = timeline[timeline.length - 2];
      }
    } else if (currentMahadasha && !futureMahadasha) {
      futureMahadasha = period;
    }

    currentPointerYear = endYear;
  }

  // Fallback defaults if out of boundary
  const activeMaha = currentMahadasha || timeline[0];
  const activePast = pastMahadasha || timeline[0];
  const activeFuture = futureMahadasha || timeline[Math.min(timeline.length - 1, 2)];

  // Sub-period (Antardasha) calculation:
  // Proportion of Antardasha = (MahaYears * AntarYears) / 120
  const activeCfg = VIMSHOTTARI_CYCLE.find(c => c.graha === activeMaha.planet) || VIMSHOTTARI_CYCLE[0];
  const antardasha: DashaPeriod = {
    planet: activeMaha.planet,
    englishPlanet: `${activeMaha.englishPlanet} Antar`,
    years: (activeMaha.years * activeMaha.years) / 120,
    startDate: activeMaha.startDate,
    endDate: activeMaha.endDate,
    isCurrent: true,
    theme: activeCfg.presentTheme,
  };

  return {
    timeline,
    currentMahadasha: activeMaha,
    currentAntardasha: antardasha,
    pastMahadasha: activePast,
    futureMahadasha: activeFuture,
  };
}
