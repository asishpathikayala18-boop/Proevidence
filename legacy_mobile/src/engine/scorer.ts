// ═══════════════════════════════════════════════════════════════════
//  Providence · Confidence Scorer
//  Weighted cross-validation of all 7 prediction layers
//  Produces domain-specific scores and confidence percentages
// ═══════════════════════════════════════════════════════════════════
import { NatalChart } from './ephemeris';
import { GrahaDashaConfig } from './vimshottari';
import { TransitResult, SadeSatiInfo } from './transits';
import { NumerologyProfile } from './numerology';
import { YogaResult } from './types';

export interface DomainScore {
  domain: string;
  emoji: string;
  score: number;      // 0–100
  grade: 'Excellent' | 'Good' | 'Moderate' | 'Challenging';
  insight: string;    // One-line actionable insight
  color: string;
}

export interface PredictionConfidence {
  overall: number;                  // 0–100
  tier: 'Cosmic Alignment' | 'Strong' | 'Moderate' | 'Turbulent';
  tierDescription: string;
  domains: DomainScore[];
  keyInsights: string[];            // 3–5 most important insights
  actionAdvice: string;             // What to do right now
  avoidAdvice: string;              // What to avoid
  bestDaysThisMonth: number[];      // Best calendar days this month
  bestHours: string;                // Best time of day
  chakraFocus: string;              // Which energy center to activate
}

// ─── Grade helper ────────────────────────────────────────────────
function toGrade(score: number): DomainScore['grade'] {
  if (score >= 75) return 'Excellent';
  if (score >= 55) return 'Good';
  if (score >= 35) return 'Moderate';
  return 'Challenging';
}

function gradeColor(grade: DomainScore['grade']): string {
  switch (grade) {
    case 'Excellent':   return '#4CAF50';
    case 'Good':        return '#FFB300';
    case 'Moderate':    return '#FF7043';
    case 'Challenging': return '#7B1FA2';
  }
}

// ─── Domain weights by planet ────────────────────────────────────
// Maps Dasha lord → contribution to each domain
const DASHA_DOMAIN_WEIGHTS: Record<string, Partial<Record<string, number>>> = {
  Surya:   { Career: 30, Spiritual: 25, Health: 20, Wealth: 15, Love: 10 },
  Chandra: { Love: 30, Family: 25, Health: 20, Spiritual: 15, Wealth: 10 },
  Mangala: { Career: 35, Health: 25, Wealth: 20, Family: 10, Spiritual: 10 },
  Budha:   { Career: 30, Wealth: 25, Love: 20, Spiritual: 15, Health: 10 },
  Guru:    { Wealth: 30, Spiritual: 25, Love: 20, Career: 15, Family: 10 },
  Shukra:  { Love: 35, Wealth: 25, Family: 20, Career: 10, Health: 10 },
  Shani:   { Career: 30, Wealth: 20, Health: 20, Spiritual: 20, Family: 10 },
  Rahu:    { Career: 25, Wealth: 25, Travel: 25, Spiritual: 15, Health: 10 },
  Ketu:    { Spiritual: 40, Health: 20, Career: 15, Wealth: 15, Love: 10 },
};

// ─── Nakshatra Deity → Chakra ────────────────────────────────────
const DEITY_CHAKRA: Record<string, string> = {
  'Ashvins': 'Root (Muladhara) — Ground your energy, focus on stability',
  'Yama':    'Sacral (Svadhisthana) — Release, flow, and let go',
  'Agni':    'Solar Plexus (Manipura) — Assert your will with confidence',
  'Brahma':  'Heart (Anahata) — Open to love and divine creation',
  'Soma':    'Throat (Vishuddha) — Speak your truth clearly',
  'Rudra':   'Third Eye (Ajna) — Trust your deep intuition',
  'Aditi':   'Crown (Sahasrara) — Expand into universal consciousness',
  'Brihaspati': 'Crown (Sahasrara) — Receive divine wisdom and guidance',
  'Nagas':   'Root (Muladhara) — Face subconscious fears with courage',
  'Pitris':  'Heart (Anahata) — Honor your ancestors through righteous action',
  'Vishnu':  'Crown (Sahasrara) — Align with the cosmic order and dharma',
  'Vayu':    'Throat (Vishuddha) — Channel intellect and communication',
  'Varuna':  'Third Eye (Ajna) — Observe the laws of karma with clarity',
};

// ─── MASTER SCORER ───────────────────────────────────────────────
export function computeConfidence(
  natalChart: NatalChart,
  presentDasha: GrahaDashaConfig,
  pastDasha: GrahaDashaConfig,
  futureDasha: GrahaDashaConfig,
  transits: TransitResult[],
  sadeSati: SadeSatiInfo,
  transitScore: number,
  yogas: YogaResult[],
  numerology: NumerologyProfile,
  nakshatraDeity: string,
): PredictionConfidence {

  // ── Base domain scores from Dasha lord ──
  const dashaWeights = DASHA_DOMAIN_WEIGHTS[presentDasha.graha] || DASHA_DOMAIN_WEIGHTS['Surya'];
  const allDomains = ['Career', 'Wealth', 'Love', 'Health', 'Spiritual', 'Family'];

  const domainBaseScores: Record<string, number> = {};
  allDomains.forEach(d => { domainBaseScores[d] = dashaWeights[d] || 15; });

  // ── Layer 2: Transit boost/penalty ──
  transits.forEach(t => {
    t.domains.forEach(d => {
      if (!domainBaseScores[d]) return;
      domainBaseScores[d] += t.isAuspicious ? 12 : -8;
    });
  });

  // ── Layer 3: Yoga boost ──
  const activeYogas = yogas.filter(y => y.isActive);
  activeYogas.forEach(yoga => {
    if (yoga.type === 'Raja')         { domainBaseScores.Career = (domainBaseScores.Career || 50) + 15; }
    if (yoga.type === 'Dhana')        { domainBaseScores.Wealth = (domainBaseScores.Wealth || 50) + 15; }
    if (yoga.type === 'Mahapurusha')  { domainBaseScores.Career = (domainBaseScores.Career || 50) + 10;
                                        domainBaseScores.Spiritual = (domainBaseScores.Spiritual || 50) + 10; }
    if (yoga.type === 'Auspicious')   { domainBaseScores.Love = (domainBaseScores.Love || 50) + 12; }
  });

  // ── Layer 4: Numerology alignment ──
  numerology.personalYearDomains.forEach(d => {
    if (domainBaseScores[d]) {
      domainBaseScores[d] += 10;
    }
  });

  // ── Layer 5: Sade-Sati penalties ──
  if (sadeSati.isActive) {
    const penalty = sadeSati.phase === 'peak' ? 20 : 10;
    domainBaseScores.Health  = (domainBaseScores.Health  || 50) - penalty;
    domainBaseScores.Career  = (domainBaseScores.Career  || 50) - penalty * 0.5;
    domainBaseScores.Wealth  = (domainBaseScores.Wealth  || 50) - penalty * 0.5;
  }

  // ── Layer 6: Natal planet strength boosts ──
  const sunStrength     = natalChart.sun.strength;
  const moonStrength    = natalChart.moon.strength;
  const jupiterStrength = natalChart.jupiter.strength;
  const venusStrength   = natalChart.venus.strength;
  const saturnStrength  = natalChart.saturn.strength;

  domainBaseScores.Career    = (domainBaseScores.Career    || 50) + sunStrength * 0.1;
  domainBaseScores.Love      = (domainBaseScores.Love      || 50) + venusStrength * 0.1;
  domainBaseScores.Wealth    = (domainBaseScores.Wealth    || 50) + jupiterStrength * 0.1;
  domainBaseScores.Spiritual = (domainBaseScores.Spiritual || 50) + moonStrength * 0.1;
  domainBaseScores.Health    = (domainBaseScores.Health    || 50) + (100 - saturnStrength) * 0.08;

  // ── Cross-validation bonus ──
  if (numerology.crossConfidence >= 90) {
    Object.keys(domainBaseScores).forEach(k => { domainBaseScores[k] += 5; });
  }

  // ── Master Number bonus ──
  if (numerology.masterNumber) {
    domainBaseScores.Spiritual = (domainBaseScores.Spiritual || 50) + 15;
  }

  // ── Clamp all scores to 0–100 ──
  allDomains.forEach(d => {
    domainBaseScores[d] = Math.min(100, Math.max(0, Math.round(domainBaseScores[d] || 50)));
  });

  // ── Build domain score objects ──
  const DOMAIN_INSIGHTS: Record<string, (score: number) => string> = {
    Career: s => s >= 75 ? 'Peak performance window — take initiative on major goals'
                : s >= 55 ? 'Steady progress — consistent action brings rewards'
                : s >= 35 ? 'Navigation required — avoid major decisions, refine skills'
                : 'Challenging phase — protect position, avoid conflicts',
    Wealth: s => s >= 75 ? 'Financial expansion — invest, negotiate, and grow assets'
                : s >= 55 ? 'Stable financial climate — save and consolidate'
                : s >= 35 ? 'Financial caution advised — avoid risky ventures'
                : 'Protect resources — avoid lending, gambling, major purchases',
    Love:   s => s >= 75 ? 'Deep romantic harmony — ideal for commitment and bonding'
                : s >= 55 ? 'Warmth in relationships — nurture existing bonds'
                : s >= 35 ? 'Communicate carefully — misunderstandings possible'
                : 'Emotional turbulence — give space, practice self-love first',
    Health: s => s >= 75 ? 'Vitality peaks — ideal for new fitness routines'
                : s >= 55 ? 'Good energy — maintain balance and regular rest'
                : s >= 35 ? 'Watch energy levels — prioritize sleep and nutrition'
                : 'Health vigilance needed — rest, hydrate, avoid overexertion',
    Spiritual: s => s >= 75 ? 'Cosmic channel open — meditation yields deep insights'
                : s >= 55 ? 'Inner guidance active — trust your intuition'
                : s >= 35 ? 'Spiritual seeking — read, reflect, seek mentors'
                : 'Spiritual testing — surrender, release control, trust the process',
    Family: s => s >= 75 ? 'Family bonds strengthen — ideal for gatherings and reconciliation'
                : s >= 55 ? 'Domestic harmony — nurture home environment'
                : s >= 35 ? 'Family patience required — listen before responding'
                : 'Family challenges — set boundaries with compassion',
  };

  const domainEmojis: Record<string, string> = {
    Career:'💼', Wealth:'💰', Love:'💖', Health:'🌿', Spiritual:'🔮', Family:'🏠',
  };

  const domains: DomainScore[] = allDomains.map(d => {
    const score = domainBaseScores[d];
    const grade = toGrade(score);
    return {
      domain: d,
      emoji: domainEmojis[d] || '✦',
      score,
      grade,
      insight: DOMAIN_INSIGHTS[d]?.(score) || '',
      color: gradeColor(grade),
    };
  });

  // ── Overall score ──
  const overall = Math.round(domains.reduce((sum, d) => sum + d.score, 0) / domains.length);

  // ── Tier ──
  const tier: PredictionConfidence['tier'] =
    overall >= 78 ? 'Cosmic Alignment'
    : overall >= 58 ? 'Strong'
    : overall >= 40 ? 'Moderate'
    : 'Turbulent';

  const tierDescriptions: Record<typeof tier, string> = {
    'Cosmic Alignment': 'All celestial forces align in your favor. Act boldly — the universe supports major moves.',
    'Strong':           'Planetary support is strong. Progress with confidence across most life domains.',
    'Moderate':         'Mixed cosmic weather. Navigate carefully, favor patience over aggression.',
    'Turbulent':        'Saturn and challenging transits test your resilience. Inner work and discipline are paramount.',
  };

  // ── Key Insights ──
  const keyInsights: string[] = [];
  if (sadeSati.isActive) keyInsights.push(`⚡ Sade-Sati ${sadeSati.phase} — ${sadeSati.description}`);
  if (activeYogas.length > 0) keyInsights.push(`⬡ Active Yoga: ${activeYogas[0].name} — ${activeYogas[0].blessing}`);
  const topDomain = domains.sort((a, b) => b.score - a.score)[0];
  keyInsights.push(`✦ Strongest domain: ${topDomain.domain} (${topDomain.score}%) — ${topDomain.insight}`);
  keyInsights.push(`✦ Personal Year ${numerology.personalYear}: ${numerology.personalYearMeaning}`);
  if (numerology.masterNumber) keyInsights.push(`✦ Master Number ${numerology.lifePath} — extraordinary potential active`);

  // ── Best days (Personal Day calculations) ──
  const bestDaysThisMonth: number[] = [];
  const today = new Date();
  for (let day = 1; day <= 28; day++) {
    const testDate = new Date(today.getFullYear(), today.getMonth(), day);
    const pd = (numerology.personalMonth + day) % 9 || 9;
    if ([1, 5, 9].includes(pd) || pd === numerology.lifePath) {
      bestDaysThisMonth.push(day);
    }
  }

  // ── Best hours (by ruling planet of the day) ──
  const weekday = new Date().getDay();
  const BEST_HOURS: Record<number, string> = {
    0: '6–8 AM (Sunrise power hour, Sun rules Sunday)',
    1: '7–9 AM (Moon morning clarity)',
    2: '5–7 AM (Mars dawn energy)',
    3: '8–10 AM (Mercury peak communication window)',
    4: '7–9 AM (Jupiter wisdom hour)',
    5: '6–8 AM (Venus grace hour) and 7–9 PM (Venus evening)',
    6: '10 AM–12 PM (Saturn disciplined labor hours)',
  };

  // ── Chakra Focus ──
  const chakraFocus = DEITY_CHAKRA[nakshatraDeity] || 'Heart (Anahata) — Connect to love, gratitude, and universal grace';

  // ── Action/Avoid Advice ──
  const actionAdvice =
    tier === 'Cosmic Alignment' ? `Launch new projects, sign agreements, expand relationships — ${presentDasha.english} Dasha supports bold moves.`
    : tier === 'Strong' ? `Build steadily on current foundations. The ${presentDasha.english} period rewards consistent, disciplined effort.`
    : tier === 'Moderate' ? `Focus on completing existing commitments. Avoid starting major new ventures until transit shifts.`
    : `Rest, reflect, and recalibrate. Prioritize health, spiritual practice, and inner alignment above external ambition.`;

  const avoidAdvice =
    sadeSati.isActive ? 'Avoid major financial risks, conflicts with authority, and sudden relationship decisions during Sade-Sati.'
    : overall < 45 ? 'Avoid confrontational negotiations, impulsive purchases, and major life decisions this period.'
    : 'Avoid complacency — this favorable period rewards proactive action more than passive waiting.';

  return {
    overall,
    tier,
    tierDescription: tierDescriptions[tier],
    domains,
    keyInsights,
    actionAdvice,
    avoidAdvice,
    bestDaysThisMonth: bestDaysThisMonth.slice(0, 6),
    bestHours: BEST_HOURS[weekday] || '6–9 AM (Universal auspicious window)',
    chakraFocus,
  };
}
