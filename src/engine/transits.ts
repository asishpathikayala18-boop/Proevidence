// ═══════════════════════════════════════════════════════════════════
//  Providence · Layer 5 — Transit Engine (Gochara Analysis)
//  BPHS Chapter 47 + Saravali Chapter 36
//  Compares today's sky against natal Moon sign => predicts current events
// ═══════════════════════════════════════════════════════════════════
import { NatalChart, getTodayChart } from './ephemeris';

export interface TransitResult {
  planet: string;
  planetEmoji: string;
  natalMoonRashi: number;
  transitHouseFromMoon: number;
  isAuspicious: boolean;
  vedhaBlocked: boolean;
  strength: number;
  effect: string;
  domains: string[];
}

export interface SadeSatiInfo {
  isActive: boolean;
  phase: 'rising' | 'peak' | 'setting' | 'none';
  saturnHouseFromMoon: number;
  description: string;
}

// ─── Reusable rule type ────────────────────────────────────────────
type HouseRule = { good: boolean; effect: string; domains: string[] };

// ─── Sun transit from BPHS Ch.47 ──────────────────────────────────
const SUN_TRANSIT: Record<string, HouseRule> = {
  '1':  { good: false, effect: 'Physical stress, government friction, ego conflicts', domains: ['Health'] },
  '2':  { good: false, effect: 'Financial outflows, family disputes', domains: ['Wealth'] },
  '3':  { good: true,  effect: 'Courage rises, siblings prosper, short journeys', domains: ['Career'] },
  '4':  { good: false, effect: 'Domestic unrest, mother health concern', domains: ['Health', 'Family'] },
  '5':  { good: false, effect: 'Children need attention, creative blocks', domains: ['Family'] },
  '6':  { good: true,  effect: 'Victory over enemies, recovery from illness', domains: ['Health', 'Career'] },
  '7':  { good: false, effect: 'Partnership tensions, travel difficulties', domains: ['Love'] },
  '8':  { good: false, effect: 'Hidden obstacles, health challenges', domains: ['Health'] },
  '9':  { good: false, effect: 'Spiritual tests, father health', domains: ['Spiritual'] },
  '10': { good: true,  effect: 'Career recognition, authority, public success', domains: ['Career'] },
  '11': { good: true,  effect: 'Financial gains, social expansion, wish fulfillment', domains: ['Wealth', 'Career'] },
  '12': { good: false, effect: 'Expenditures, travel abroad, sleep disturbances', domains: ['Wealth'] },
};

const MOON_TRANSIT: Record<string, HouseRule> = {
  '1':  { good: true,  effect: 'Mental clarity, emotional peace, public popularity', domains: ['Love', 'Health'] },
  '2':  { good: true,  effect: 'Family harmony, financial inflows', domains: ['Wealth', 'Family'] },
  '3':  { good: false, effect: 'Sibling issues, restlessness', domains: ['Family'] },
  '4':  { good: true,  effect: 'Domestic bliss, mother wellbeing, comfort', domains: ['Family', 'Health'] },
  '5':  { good: false, effect: 'Emotional sensitivity, creative anxiety', domains: ['Love'] },
  '6':  { good: false, effect: 'Health fluctuations, emotional conflicts', domains: ['Health'] },
  '7':  { good: true,  effect: 'Romantic harmony, partnership success', domains: ['Love'] },
  '8':  { good: false, effect: 'Mental gloom, hidden fears', domains: ['Health', 'Spiritual'] },
  '9':  { good: true,  effect: 'Spiritual uplift, good fortune, divine grace', domains: ['Spiritual', 'Wealth'] },
  '10': { good: false, effect: 'Career pressure, public scrutiny', domains: ['Career'] },
  '11': { good: true,  effect: 'Wish fulfillment, financial luck, social gains', domains: ['Wealth', 'Love'] },
  '12': { good: false, effect: 'Expenditure, isolation, rest needed', domains: ['Health', 'Spiritual'] },
};

const JUPITER_TRANSIT: Record<string, HouseRule> = {
  '1':  { good: false, effect: 'Self-renewal but physical strain', domains: ['Health'] },
  '2':  { good: true,  effect: 'Family prosperity, wealth gains, eloquence', domains: ['Wealth', 'Family'] },
  '3':  { good: false, effect: 'Sibling friction, courage tested', domains: ['Family'] },
  '4':  { good: false, effect: 'Domestic changes, property challenges', domains: ['Family'] },
  '5':  { good: true,  effect: 'Children joy, creative flourishing, good counsel', domains: ['Family', 'Spiritual'] },
  '6':  { good: false, effect: 'Health issues from overcrowding, enemy activity', domains: ['Health'] },
  '7':  { good: true,  effect: 'Marital harmony, business partnerships, legal wins', domains: ['Love', 'Career'] },
  '8':  { good: false, effect: 'Transformation forced, hidden expenditure', domains: ['Wealth'] },
  '9':  { good: true,  effect: 'Divine fortune, pilgrimage, guru blessings, dharma', domains: ['Spiritual', 'Wealth'] },
  '10': { good: false, effect: 'Career progress but with obstacles', domains: ['Career'] },
  '11': { good: true,  effect: 'Supreme gains, all wishes granted, abundance peak', domains: ['Wealth', 'Career', 'Love'] },
  '12': { good: false, effect: 'Spiritual retreat, expenditure on good causes', domains: ['Spiritual'] },
};

const SATURN_TRANSIT: Record<string, HouseRule> = {
  '1':  { good: false, effect: 'Major life restructuring, physical demands — Sade-Sati peak', domains: ['Health', 'Career'] },
  '2':  { good: false, effect: 'Financial discipline enforced, family strain — Sade-Sati setting', domains: ['Wealth'] },
  '3':  { good: true,  effect: 'Courage rewarded, determined effort succeeds', domains: ['Career'] },
  '4':  { good: false, effect: 'Domestic hardship, property decisions', domains: ['Family'] },
  '5':  { good: false, effect: 'Children issues, creative restrictions', domains: ['Family'] },
  '6':  { good: true,  effect: 'Victory over illness and enemies through patience', domains: ['Health', 'Career'] },
  '7':  { good: false, effect: 'Partnership strain, separation possible', domains: ['Love'] },
  '8':  { good: false, effect: 'Hidden dangers, chronic health concern', domains: ['Health'] },
  '9':  { good: false, effect: 'Father health, spiritual discipline required', domains: ['Spiritual', 'Family'] },
  '10': { good: false, effect: 'Career stress, authority conflicts, heavy responsibility', domains: ['Career'] },
  '11': { good: true,  effect: 'Long-term gains realized, networks strengthened', domains: ['Wealth', 'Career'] },
  '12': { good: false, effect: 'Expenditure, seclusion, spiritual preparation — Sade-Sati rising', domains: ['Wealth', 'Spiritual'] },
};

const VENUS_TRANSIT: Record<string, HouseRule> = {
  '1':  { good: true,  effect: 'Personal charm peaks, good appearance, wellbeing', domains: ['Love', 'Health'] },
  '2':  { good: true,  effect: 'Wealth inflows, sweet speech, family harmony', domains: ['Wealth', 'Family'] },
  '3':  { good: true,  effect: 'Creative courage, artistic success', domains: ['Career'] },
  '4':  { good: true,  effect: 'Domestic happiness, vehicles, real estate luck', domains: ['Family', 'Wealth'] },
  '5':  { good: true,  effect: 'Romantic joy, children happiness, creative peak', domains: ['Love', 'Family'] },
  '6':  { good: false, effect: 'Relationship friction, health of loved ones', domains: ['Love', 'Health'] },
  '7':  { good: true,  effect: 'Romantic peak, marriage prospects, business harmony', domains: ['Love'] },
  '8':  { good: false, effect: 'Unexpected expenses, hidden relationship issues', domains: ['Wealth', 'Love'] },
  '9':  { good: true,  effect: 'Spiritual devotion, foreign gains, fortune', domains: ['Spiritual', 'Wealth'] },
  '10': { good: false, effect: 'Career strain despite efforts', domains: ['Career'] },
  '11': { good: true,  effect: 'Financial gains, social circles, romantic fulfillment', domains: ['Wealth', 'Love'] },
  '12': { good: false, effect: 'Hidden expenses, secretive relationships', domains: ['Wealth'] },
};

const MARS_TRANSIT: Record<string, HouseRule> = {
  '1':  { good: false, effect: 'Physical aggression, accident risk, rashness', domains: ['Health'] },
  '2':  { good: false, effect: 'Harsh speech, family arguments, financial rashness', domains: ['Family', 'Wealth'] },
  '3':  { good: true,  effect: 'Courage spikes, sports success, ambition activated', domains: ['Career'] },
  '4':  { good: false, effect: 'Domestic conflict, property disputes', domains: ['Family'] },
  '5':  { good: false, effect: 'Children conflicts, rash decisions', domains: ['Family'] },
  '6':  { good: true,  effect: 'Enemies defeated, competitive victory, energy peak', domains: ['Career', 'Health'] },
  '7':  { good: false, effect: 'Marital tension, partner conflicts, legal issues', domains: ['Love'] },
  '8':  { good: false, effect: 'Accident risk, surgery possible', domains: ['Health'] },
  '9':  { good: false, effect: 'Father conflicts, rashness in dharma', domains: ['Spiritual'] },
  '10': { good: false, effect: 'Career aggression, workplace conflicts', domains: ['Career'] },
  '11': { good: true,  effect: 'Profit through action, competitive gains', domains: ['Wealth', 'Career'] },
  '12': { good: false, effect: 'Hidden enemies active, expenditure on conflict', domains: ['Wealth'] },
};

// ─── Vedha (obstruction) pairs — BPHS ────────────────────────────
const VEDHA_PAIRS: [number, number][] = [
  [2, 12], [3, 9], [4, 5], [6, 8], [7, 2], [10, 4], [11, 6],
];

function getHouseFromMoon(moonRashi: number, planetRashi: number): number {
  return ((planetRashi - moonRashi + 12) % 12) + 1;
}

function checkVedha(house: number, allHouses: number[]): boolean {
  for (const [h1, h2] of VEDHA_PAIRS) {
    if (house === h1 && allHouses.includes(h2)) return true;
    if (house === h2 && allHouses.includes(h1)) return true;
  }
  return false;
}

// ─── Sade-Sati Detection ─────────────────────────────────────────
export function detectSadeSati(natalMoonRashi: number, saturnRashi: number): SadeSatiInfo {
  const satHouse = getHouseFromMoon(natalMoonRashi, saturnRashi);
  if (satHouse === 12) {
    return { isActive: true, phase: 'rising', saturnHouseFromMoon: 12,
      description: 'Sade-Sati Rising: Saturn transits 12th from Moon. Expenditure, travel, isolation. Spiritually productive but materially demanding.' };
  }
  if (satHouse === 1) {
    return { isActive: true, phase: 'peak', saturnHouseFromMoon: 1,
      description: 'Sade-Sati Peak: Saturn on natal Moon. Maximum karmic pressure — restructuring of identity, health, career, and relationships. Greatest growth through discipline.' };
  }
  if (satHouse === 2) {
    return { isActive: true, phase: 'setting', saturnHouseFromMoon: 2,
      description: 'Sade-Sati Setting: Saturn in 2nd from Moon. Financial discipline and family restructuring. Relief comes as Saturn moves forward.' };
  }
  return { isActive: false, phase: 'none', saturnHouseFromMoon: satHouse, description: 'No active Sade-Sati.' };
}

// ─── MASTER TRANSIT ANALYSIS ─────────────────────────────────────
export function analyzeTransits(natalChart: NatalChart): {
  transits: TransitResult[];
  sadeSati: SadeSatiInfo;
  overallScore: number;
  dominantDomains: string[];
  currentWeather: string;
} {
  const today = getTodayChart();
  const moonRashi = natalChart.moon.rashiIndex;

  const sunH  = getHouseFromMoon(moonRashi, today.sun.rashiIndex);
  const monH  = getHouseFromMoon(moonRashi, today.moon.rashiIndex);
  const marH  = getHouseFromMoon(moonRashi, today.mars.rashiIndex);
  const jupH  = getHouseFromMoon(moonRashi, today.jupiter.rashiIndex);
  const venH  = getHouseFromMoon(moonRashi, today.venus.rashiIndex);
  const satH  = getHouseFromMoon(moonRashi, today.saturn.rashiIndex);

  const allHouses = [sunH, monH, marH, jupH, venH, satH];

  const makeResult = (
    planet: string, emoji: string, house: number,
    rulebook: Record<string, HouseRule>,
  ): TransitResult => {
    const rule = rulebook[String(house)] || { good: false, effect: 'Neutral transit', domains: [] };
    const vedhaBlocked = rule.good && checkVedha(house, allHouses.filter(h => h !== house));
    const strength = rule.good ? (vedhaBlocked ? 35 : 75) : 25;
    return {
      planet, planetEmoji: emoji,
      natalMoonRashi: moonRashi,
      transitHouseFromMoon: house,
      isAuspicious: rule.good && !vedhaBlocked,
      vedhaBlocked,
      strength,
      effect: rule.effect,
      domains: rule.domains,
    };
  };

  const transits: TransitResult[] = [
    makeResult('Sun',     'S', sunH, SUN_TRANSIT),
    makeResult('Moon',    'M', monH, MOON_TRANSIT),
    makeResult('Mars',    'Ma', marH, MARS_TRANSIT),
    makeResult('Jupiter', 'J', jupH, JUPITER_TRANSIT),
    makeResult('Venus',   'V', venH, VENUS_TRANSIT),
    makeResult('Saturn',  'Sa', satH, SATURN_TRANSIT),
  ];

  const sadeSati = detectSadeSati(moonRashi, today.saturn.rashiIndex);
  const rawScore = transits.reduce((sum, t) => sum + t.strength, 0) / transits.length;
  const overallScore = Math.round(sadeSati.isActive && sadeSati.phase === 'peak' ? rawScore * 0.75 : rawScore);

  const domainCount: Record<string, number> = {};
  transits.forEach(t => {
    if (t.isAuspicious) t.domains.forEach(d => { domainCount[d] = (domainCount[d] || 0) + 1; });
  });
  const dominantDomains = Object.entries(domainCount)
    .sort(([, a], [, b]) => b - a).slice(0, 3).map(([d]) => d);

  const auspiciousCount = transits.filter(t => t.isAuspicious).length;
  const currentWeather =
    auspiciousCount >= 4 ? 'Highly auspicious cosmic weather — major opportunities active'
    : auspiciousCount >= 2 ? 'Moderate cosmic support — progress with awareness'
    : sadeSati.isActive ? "Saturn's karmic pressure active — discipline and patience required"
    : 'Challenging transit period — retreat, rest, and inner work advised';

  return { transits, sadeSati, overallScore, dominantDomains, currentWeather };
}
