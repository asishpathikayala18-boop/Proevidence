// ═══════════════════════════════════════════════════════════════════
//  Providence · Daily Muhūrtha & Cosmic Weather Engine
//  Rāhu Kāla, Yamagaṇḍa, Gulika, and Choghadiya Calculations
// ═══════════════════════════════════════════════════════════════════

export interface TimeWindow {
  name: string;
  nameTe: string;
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
  quality: 'auspicious' | 'neutral' | 'inauspicious';
  meaningEn: string;
  meaningTe: string;
  isCurrent?: boolean;
}

export interface DailyMuhurthaData {
  dateStr: string;
  dayOfWeek: string;
  dayOfWeekTe: string;
  cosmicEnergyScore: number; // 0 to 100
  rahuKaal: { start: string; end: string; adviceEn: string; adviceTe: string };
  yamagandam: { start: string; end: string };
  gulika: { start: string; end: string };
  choghadiyas: TimeWindow[];
  activePeriod: TimeWindow;
  dailyAdviceEn: string;
  dailyAdviceTe: string;
}

// ─── Standard Rahu Kaal fractions (1/8th of daylight from 06:00 to 18:00) ───
// Sun=8th, Mon=2nd, Tue=7th, Wed=5th, Thu=6th, Fri=4th, Sat=3rd
const RAHU_KAAL_INTERVALS: Record<number, [number, number]> = {
  0: [16.5, 18.0], // Sunday: 16:30 - 18:00
  1: [7.5, 9.0],   // Monday: 07:30 - 09:00
  2: [15.0, 16.5], // Tuesday: 15:00 - 16:30
  3: [12.0, 13.5], // Wednesday: 12:00 - 13:30
  4: [13.5, 15.0], // Thursday: 13:30 - 15:00
  5: [10.5, 12.0], // Friday: 10:30 - 12:00
  6: [9.0, 10.5],  // Saturday: 09:00 - 10:30
};

const YAMAGANDAM_INTERVALS: Record<number, [number, number]> = {
  0: [12.0, 13.5], // Sun
  1: [10.5, 12.0], // Mon
  2: [9.0, 10.5],  // Tue
  3: [7.5, 9.0],   // Wed
  4: [6.0, 7.5],   // Thu
  5: [15.0, 16.5], // Fri
  6: [13.5, 15.0], // Sat
};

const GULIKA_INTERVALS: Record<number, [number, number]> = {
  0: [15.0, 16.5], // Sun
  1: [13.5, 15.0], // Mon
  2: [12.0, 13.5], // Tue
  3: [10.5, 12.0], // Wed
  4: [9.0, 10.5],  // Thu
  5: [7.5, 9.0],   // Fri
  6: [6.0, 7.5],   // Sat
};

const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES_TE = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];

// ─── Day Choghadiya sequences by Day Lord ───
// Amrit=Auspicious, Shubh=Auspicious, Labh=Gains, Char=Neutral, Rog=Bad, Udveg=Bad, Kaal=Bad
type ChogType = 'Amrit' | 'Shubh' | 'Labh' | 'Char' | 'Rog' | 'Udveg' | 'Kaal';

const CHOG_DETAILS: Record<ChogType, { nameTe: string; quality: 'auspicious' | 'neutral' | 'inauspicious'; en: string; te: string }> = {
  Amrit: { nameTe: 'అమృతం', quality: 'auspicious', en: 'Best time for all golden endeavors & success', te: 'సకల కార్య విజయాలకు అత్యుత్తమ అమృత ఘడియలు' },
  Shubh: { nameTe: 'శుభం', quality: 'auspicious', en: 'Auspicious for ceremonies, journeys & investments', te: 'శుభకార్యాలు, నూతన ప్రారంభాలకు ఎంతో అనుకూలం' },
  Labh:  { nameTe: 'లాభం', quality: 'auspicious', en: 'Ideal for financial gains, business & career negotiations', te: 'ధనలాభం, వ్యాపార విస్తరణ మరియు కొత్త ఒప్పందాలకు శ్రేష్టం' },
  Char:  { nameTe: 'చరం', quality: 'neutral', en: 'Good for travel, dynamic movements & communications', te: 'ప్రయాణాలు, సమాచార మార్పిడికి మంచి సమయం' },
  Rog:   { nameTe: 'రోగం', quality: 'inauspicious', en: 'Delays possible. Focus on routine work and rest', te: 'ముఖ్యమైన పనులను వాయిదా వేయడం మంచిది' },
  Udveg: { nameTe: 'ఉద్వేగం', quality: 'inauspicious', en: 'Tense mental vibrations; avoid arguments or signing', te: 'ఆందోళనకర సమయం; వాదనలకు దూరంగా ఉండండి' },
  Kaal:  { nameTe: 'కాలం', quality: 'inauspicious', en: 'Challenging Saturnian energy; postpone critical decisions', te: 'ప్రతికూల సమయం; ముఖ్య నిర్ణయాలు తీసుకోకండి' },
};

// Sequences starting at 06:00 (1.5 hr slots until 18:00)
const DAY_CHOG_ORDERS: Record<number, ChogType[]> = {
  0: ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'], // Sun
  1: ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'], // Mon
  2: ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],   // Tue
  3: ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'],  // Wed
  4: ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'],  // Thu
  5: ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'],  // Fri
  6: ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal'],  // Sat
};

function formatHours(h: number): string {
  const hr = Math.floor(h);
  const min = Math.round((h - hr) * 60);
  const period = hr >= 12 ? 'PM' : 'AM';
  const displayHr = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
  const padMin = min < 10 ? `0${min}` : `${min}`;
  return `${displayHr}:${padMin} ${period}`;
}

export function computeDailyMuhurtha(date: Date = new Date()): DailyMuhurthaData {
  const dayIdx = date.getDay();
  const currentHour = date.getHours() + date.getMinutes() / 60;

  // Rahu Kaal
  const [rStart, rEnd] = RAHU_KAAL_INTERVALS[dayIdx];
  const [yStart, yEnd] = YAMAGANDAM_INTERVALS[dayIdx];
  const [gStart, gEnd] = GULIKA_INTERVALS[dayIdx];

  const rahuKaal = {
    start: formatHours(rStart),
    end: formatHours(rEnd),
    adviceEn: 'Avoid starting high-stakes deals, contracts, or signing papers during Rahu Kaal.',
    adviceTe: 'రాహు కాలంలో నూతన ప్రారంభాలు, పెద్ద ఒప్పందాలు మరియు ప్రయాణాలు నివారించండి.',
  };

  const yamagandam = {
    start: formatHours(yStart),
    end: formatHours(yEnd),
  };

  const gulika = {
    start: formatHours(gStart),
    end: formatHours(gEnd),
  };

  // Build 8 Choghadiya daylight windows (06:00 to 18:00)
  const order = DAY_CHOG_ORDERS[dayIdx];
  const choghadiyas: TimeWindow[] = [];
  let activePeriod: TimeWindow | null = null;

  for (let i = 0; i < 8; i++) {
    const slotStart = 6.0 + i * 1.5;
    const slotEnd = 6.0 + (i + 1) * 1.5;
    const chog = order[i];
    const details = CHOG_DETAILS[chog];
    const isCurrent = currentHour >= slotStart && currentHour < slotEnd;

    const window: TimeWindow = {
      name: `${chog} Muhūrtha`,
      nameTe: `${details.nameTe} ముహూర్తం`,
      start: formatHours(slotStart),
      end: formatHours(slotEnd),
      quality: details.quality,
      meaningEn: details.en,
      meaningTe: details.te,
      isCurrent,
    };

    choghadiyas.push(window);
    if (isCurrent) {
      activePeriod = window;
    }
  }

  // If outside daytime (18:00 - 06:00), fallback to default night window
  if (!activePeriod) {
    activePeriod = {
      name: 'Night Śubha Time',
      nameTe: 'రాత్రి శుభ సమయం',
      start: '06:00 PM',
      end: '06:00 AM',
      quality: 'neutral',
      meaningEn: 'Peaceful planetary hours suitable for reflection, rest, and planning',
      meaningTe: 'విశ్రాంతి, ప్రార్థనలు మరియు రేపటి ప్రణాళికలకు అనుకూలం',
      isCurrent: true,
    };
  }

  // Daily cosmic energy score calculation (0 to 100)
  const isAuspiciousNow = activePeriod.quality === 'auspicious';
  const isRahuNow = currentHour >= rStart && currentHour <= rEnd;
  const cosmicEnergyScore = isRahuNow ? 42 : isAuspiciousNow ? 92 : 74;

  const dailyAdviceEn = isRahuNow
    ? 'Rāhu Kāla is currently active. Pause major commitments until this period concludes.'
    : isAuspiciousNow
    ? 'Supreme cosmic alignment right now! Auspicious for meetings, deals, and key calls.'
    : 'Steady cosmic rhythm. Favorable for organized preparation and steady progress.';

  const dailyAdviceTe = isRahuNow
    ? 'ప్రస్తుతం రాహు కాలం నడుస్తోంది. ముఖ్యమైన పనులను కాసేపు వాయిదా వేయండి.'
    : isAuspiciousNow
    ? 'ప్రస్తుతం అమృత/శుభ ఘడియలు నడుస్తున్నాయి! కీలక పనులను ప్రారంభించడానికి అత్యుత్తమ సమయం.'
    : 'సాధారణ అనుకూల సమయం. మీ దినచర్య పనులను సాఫీగా పూర్తి చేసుకోవచ్చు.';

  return {
    dateStr: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    dayOfWeek: DAY_NAMES_EN[dayIdx],
    dayOfWeekTe: DAY_NAMES_TE[dayIdx],
    cosmicEnergyScore,
    rahuKaal,
    yamagandam,
    gulika,
    choghadiyas,
    activePeriod,
    dailyAdviceEn,
    dailyAdviceTe,
  };
}
