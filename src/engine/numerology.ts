// ═══════════════════════════════════════════════════════════════════
//  Providence · Layer 7 — Dual Numerology Engine
//  System A: Pythagoras (Western, 1–9)
//  System B: Chaldean (Ancient Babylonian, 1–8 sacred)
//  Cross-validates both systems for maximum confidence
// ═══════════════════════════════════════════════════════════════════

export interface NumerologyProfile {
  // Pythagoras
  lifePath: number;
  lifePathMeaning: string;
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  // Chaldean
  chaldeanBirth: number;
  chaldeanCompound: number;
  // Time-based
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  personalYearMeaning: string;
  personalYearDomains: string[];
  // Cross-validation
  crossConfidence: number;   // 0–100: how much both systems agree
  masterNumber: boolean;     // true if Life Path is 11, 22, or 33
  // Lucky
  luckyNumbers: number[];
  powerNumber: number;
  karmaNumber: number;
}

// ─── Pythagoras letter → number table ────────────────────────────
const PYTHAGOREAN: Record<string, number> = {
  a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
  j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
  s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8,
};

// ─── Chaldean letter → number table ─────────────────────────────
// Chaldean: 9 is divine/sacred — letters only go 1–8
const CHALDEAN: Record<string, number> = {
  a:1,b:2,c:3,d:4,e:5,f:8,g:3,h:5,i:1,
  j:1,k:2,l:3,m:4,n:5,o:7,p:8,q:1,r:2,
  s:3,t:4,u:6,v:6,w:6,x:5,y:1,z:7,
};

// ─── Reduce to single digit (preserve 11, 22, 33) ────────────────
function reduce(n: number, preserveMasters = true): number {
  if (preserveMasters && (n === 11 || n === 22 || n === 33)) return n;
  if (n <= 9) return n;
  const sum = String(n).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  return reduce(sum, preserveMasters);
}

function sumLetters(name: string, table: Record<string, number>): number {
  return name.toLowerCase().replace(/[^a-z]/g, '').split('')
    .reduce((sum, ch) => sum + (table[ch] || 0), 0);
}

// ─── Personal Year / Month / Day ────────────────────────────────
function getPersonalYear(dob: Date, targetYear = new Date().getFullYear()): number {
  const sum = dob.getDate() + (dob.getMonth() + 1) + targetYear;
  return reduce(sum);
}

function getPersonalMonth(dob: Date): number {
  const py = getPersonalYear(dob);
  const cm = new Date().getMonth() + 1;
  return reduce(py + cm);
}

function getPersonalDay(dob: Date): number {
  const pm = getPersonalMonth(dob);
  const cd = new Date().getDate();
  return reduce(pm + cd);
}

// ─── Life Path Meanings ──────────────────────────────────────────
const LIFE_PATH_THEMES: Record<number, { meaning: string; domains: string[] }> = {
  1:  { meaning: 'The Pioneer — independent leadership, original innovation, bold initiative', domains: ['Career', 'Creative'] },
  2:  { meaning: 'The Diplomat — cooperation, intuition, peacemaking, emotional sensitivity', domains: ['Love', 'Spiritual'] },
  3:  { meaning: 'The Creator — artistic expression, joy, communication, social magnetism', domains: ['Career', 'Love'] },
  4:  { meaning: 'The Builder — disciplined construction, loyalty, methodical achievement', domains: ['Career', 'Wealth'] },
  5:  { meaning: 'The Adventurer — freedom, adaptability, sensory experience, change', domains: ['Travel', 'Love'] },
  6:  { meaning: 'The Nurturer — love, responsibility, healing, beauty, family devotion', domains: ['Family', 'Love'] },
  7:  { meaning: 'The Seeker — analytical wisdom, spiritual quest, introspection, truth', domains: ['Spiritual', 'Career'] },
  8:  { meaning: 'The Achiever — material mastery, authority, abundance, executive power', domains: ['Wealth', 'Career'] },
  9:  { meaning: 'The Sage — universal compassion, completion, global humanitarianism', domains: ['Spiritual', 'Career'] },
  11: { meaning: 'Master Intuitive — elevated spiritual vision, inspiration, psychic sensitivity', domains: ['Spiritual', 'Creative'] },
  22: { meaning: 'Master Builder — manifesting grand visions into earthly reality', domains: ['Career', 'Wealth'] },
  33: { meaning: 'Master Teacher — selfless cosmic service and unconditional love', domains: ['Spiritual', 'Family'] },
};

const PERSONAL_YEAR_THEMES: Record<number, { meaning: string; domains: string[] }> = {
  1: { meaning: 'New beginnings, planting seeds, bold fresh starts, initiation', domains: ['Career'] },
  2: { meaning: 'Cooperation, patience, relationships deepening, inner work', domains: ['Love', 'Spiritual'] },
  3: { meaning: 'Creativity peaks, social expansion, joy, self-expression', domains: ['Career', 'Love'] },
  4: { meaning: 'Hard work, building foundations, discipline, structure', domains: ['Career', 'Wealth'] },
  5: { meaning: 'Change, freedom, travel, unexpected opportunities', domains: ['Travel', 'Career'] },
  6: { meaning: 'Family, love, responsibility, healing, home refinements', domains: ['Family', 'Love'] },
  7: { meaning: 'Reflection, spiritual study, solitude, inner wisdom', domains: ['Spiritual'] },
  8: { meaning: 'Financial power, business authority, harvest of effort', domains: ['Wealth', 'Career'] },
  9: { meaning: 'Completion, releasing the old, humanitarian giving, endings before new cycle', domains: ['Spiritual'] },
};

// ─── MASTER FUNCTION ─────────────────────────────────────────────
export function computeNumerology(dob: Date, fullName = ''): NumerologyProfile {
  // Pythagoras Life Path
  const dateSum = dob.getDate() + (dob.getMonth() + 1) + dob.getFullYear();
  const lifePath = reduce(dateSum);

  // Expression (full name sum)
  const expressionRaw = fullName ? sumLetters(fullName, PYTHAGOREAN) : dateSum;
  const expressionNumber = reduce(expressionRaw);

  // Soul Urge (vowels only)
  const vowels = fullName.toLowerCase().replace(/[^aeiou]/g, '');
  const soulUrgeRaw = vowels.split('').reduce((s, c) => s + (PYTHAGOREAN[c] || 0), 0);
  const soulUrgeNumber = reduce(soulUrgeRaw || dob.getDate());

  // Personality (consonants only)
  const consonants = fullName.toLowerCase().replace(/[^bcdfghjklmnpqrstvwxyz]/g, '');
  const personalityRaw = consonants.split('').reduce((s, c) => s + (PYTHAGOREAN[c] || 0), 0);
  const personalityNumber = reduce(personalityRaw || (dob.getMonth() + 1));

  // Chaldean
  const chaldeanBirth = reduce(dob.getDate(), false);
  const chaldeanFull = fullName ? sumLetters(fullName, CHALDEAN) : dob.getDate() + (dob.getMonth() + 1);
  const chaldeanCompound = reduce(chaldeanFull, false);

  // Time numbers
  const personalYear = getPersonalYear(dob);
  const personalMonth = getPersonalMonth(dob);
  const personalDay = getPersonalDay(dob);

  // Cross-validation confidence
  const pyReduce = reduce(lifePath, false);
  const chalReduce = reduce(chaldeanCompound, false);
  const crossConfidence = pyReduce === chalReduce ? 95
    : Math.abs(pyReduce - chalReduce) === 1 ? 75
    : 50;

  // Lucky numbers (unique combination)
  const lucky = new Set<number>([lifePath, chaldeanBirth, personalYear, expressionNumber]);
  const luckyNumbers = Array.from(lucky).slice(0, 4);

  // Power number = Life Path × Birth Day reduced
  const powerNumber = reduce(lifePath + dob.getDate());

  // Karma number = missing numbers from DOB digits
  const dobDigits = new Set(String(dob.getDate() + (dob.getMonth()+1) + dob.getFullYear()).split('').map(Number));
  const missing = [1,2,3,4,5,6,7,8,9].filter(n => !dobDigits.has(n));
  const karmaNumber = missing[0] || 0;

  const lpTheme = LIFE_PATH_THEMES[lifePath] || LIFE_PATH_THEMES[1];
  const pyTheme = PERSONAL_YEAR_THEMES[personalYear] || PERSONAL_YEAR_THEMES[1];

  return {
    lifePath,
    lifePathMeaning: lpTheme.meaning,
    expressionNumber,
    soulUrgeNumber,
    personalityNumber,
    chaldeanBirth,
    chaldeanCompound,
    personalYear,
    personalMonth,
    personalDay,
    personalYearMeaning: pyTheme.meaning,
    personalYearDomains: pyTheme.domains,
    crossConfidence,
    masterNumber: [11, 22, 33].includes(lifePath),
    luckyNumbers,
    powerNumber,
    karmaNumber,
  };
}
