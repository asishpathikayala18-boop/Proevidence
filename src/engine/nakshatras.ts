// ─────────────────────────────────────────────────────────────
//  Providence · 27 Nakshatras & Planetary Lords (BPHS Chapter 3)
// ─────────────────────────────────────────────────────────────
import { NakshatraInfo, Graha } from './types';

export const NAKSHATRAS: NakshatraInfo[] = [
  { index: 1,  name: 'Ashwini',          sanskrit: 'अश्विनी',          ruler: 'Ketu',    deity: 'Ashvins',       degreesStart: 0,      degreesEnd: 13.333 },
  { index: 2,  name: 'Bharani',          sanskrit: 'भरणी',           ruler: 'Shukra',  deity: 'Yama',          degreesStart: 13.333, degreesEnd: 26.666 },
  { index: 3,  name: 'Krittika',         sanskrit: 'कृत्तिका',         ruler: 'Surya',   deity: 'Agni',          degreesStart: 26.666, degreesEnd: 40.0 },
  { index: 4,  name: 'Rohini',           sanskrit: 'रोहिणी',          ruler: 'Chandra', deity: 'Brahma',        degreesStart: 40.0,   degreesEnd: 53.333 },
  { index: 5,  name: 'Mrigashirsha',     sanskrit: 'मृगशिरा',         ruler: 'Mangala', deity: 'Soma',          degreesStart: 53.333, degreesEnd: 66.666 },
  { index: 6,  name: 'Ardra',            sanskrit: 'आर्द्रा',          ruler: 'Rahu',    deity: 'Rudra',         degreesStart: 66.666, degreesEnd: 80.0 },
  { index: 7,  name: 'Punarvasu',        sanskrit: 'पुनर्वसु',         ruler: 'Guru',    deity: 'Aditi',         degreesStart: 80.0,   degreesEnd: 93.333 },
  { index: 8,  name: 'Pushya',           sanskrit: 'पुष्य',           ruler: 'Shani',   deity: 'Brihaspati',    degreesStart: 93.333, degreesEnd: 106.666 },
  { index: 9,  name: 'Ashlesha',         sanskrit: 'आश्लेषा',         ruler: 'Budha',   deity: 'Nagas',         degreesStart: 106.666,degreesEnd: 120.0 },
  { index: 10, name: 'Magha',            sanskrit: 'मघा',            ruler: 'Ketu',    deity: 'Pitris',        degreesStart: 120.0,  degreesEnd: 133.333 },
  { index: 11, name: 'Purva Phalguni',   sanskrit: 'पूर्वाफाल्गुनी',    ruler: 'Shukra',  deity: 'Bhaga',         degreesStart: 133.333,degreesEnd: 146.666 },
  { index: 12, name: 'Uttara Phalguni',  sanskrit: 'उत्तराफाल्गुनी',   ruler: 'Surya',   deity: 'Aryaman',       degreesStart: 146.666,degreesEnd: 160.0 },
  { index: 13, name: 'Hasta',            sanskrit: 'हस्त',            ruler: 'Chandra', deity: 'Savitr',        degreesStart: 160.0,  degreesEnd: 173.333 },
  { index: 14, name: 'Chitra',           sanskrit: 'चित्रा',          ruler: 'Mangala', deity: 'Tvashtar',      degreesStart: 173.333,degreesEnd: 186.666 },
  { index: 15, name: 'Swati',            sanskrit: 'स्वाति',          ruler: 'Rahu',    deity: 'Vayu',          degreesStart: 186.666,degreesEnd: 200.0 },
  { index: 16, name: 'Vishakha',         sanskrit: 'विशाखा',         ruler: 'Guru',    deity: 'Indra-Agni',    degreesStart: 200.0,  degreesEnd: 213.333 },
  { index: 17, name: 'Anuradha',         sanskrit: 'अनुराधा',         ruler: 'Shani',   deity: 'Mitra',         degreesStart: 213.333,degreesEnd: 226.666 },
  { index: 18, name: 'Jyeshtha',         sanskrit: 'ज्येष्ठा',         ruler: 'Budha',   deity: 'Indra',         degreesStart: 226.666,degreesEnd: 240.0 },
  { index: 19, name: 'Mula',             sanskrit: 'मूल',            ruler: 'Ketu',    deity: 'Nirriti',       degreesStart: 240.0,  degreesEnd: 253.333 },
  { index: 20, name: 'Purva Ashadha',    sanskrit: 'पूर्वाषाढ़ा',      ruler: 'Shukra',  deity: 'Apas',          degreesStart: 253.333,degreesEnd: 266.666 },
  { index: 21, name: 'Uttara Ashadha',   sanskrit: 'उत्तराषाढ़ा',     ruler: 'Surya',   deity: 'Vishvadevas',   degreesStart: 266.666,degreesEnd: 280.0 },
  { index: 22, name: 'Shravana',         sanskrit: 'श्रवण',           ruler: 'Chandra', deity: 'Vishnu',        degreesStart: 280.0,  degreesEnd: 293.333 },
  { index: 23, name: 'Dhanishta',        sanskrit: 'धनिष्ठा',         ruler: 'Mangala', deity: 'Vasus',         degreesStart: 293.333,degreesEnd: 306.666 },
  { index: 24, name: 'Shatabhisha',      sanskrit: 'शतभिषा',         ruler: 'Rahu',    deity: 'Varuna',        degreesStart: 306.666,degreesEnd: 320.0 },
  { index: 25, name: 'Purva Bhadrapada', sanskrit: 'पूर्वभाद्रपदा',   ruler: 'Guru',    deity: 'Aja Ekapada',   degreesStart: 320.0,  degreesEnd: 333.333 },
  { index: 26, name: 'Uttara Bhadrapada',sanskrit: 'उत्तरभाद्रपदा',  ruler: 'Shani',   deity: 'Ahir Budhnya',  degreesStart: 333.333,degreesEnd: 346.666 },
  { index: 27, name: 'Revati',           sanskrit: 'रेवती',           ruler: 'Budha',   deity: 'Pushan',        degreesStart: 346.666,degreesEnd: 360.0 },
];

/**
 * Calculates approximate birth Nakshatra based on Date of Birth.
 * Uses day-of-year orbital progression with Lunar sidereal cycle (27.32 days).
 */
export function estimateNakshatra(dob: Date): NakshatraInfo {
  // Unix timestamp to Julian day epoch offset
  const ms = dob.getTime();
  const daysSinceEpoch = ms / (1000 * 60 * 60 * 24);
  
  // Sidereal lunar month is approx 27.321661 days
  const lunarCycleDays = 27.321661;
  const cycleProgress = (daysSinceEpoch % lunarCycleDays + lunarCycleDays) % lunarCycleDays;
  const fraction = cycleProgress / lunarCycleDays;
  
  const nakshatraIndex = Math.floor(fraction * 27);
  return NAKSHATRAS[nakshatraIndex % 27];
}
