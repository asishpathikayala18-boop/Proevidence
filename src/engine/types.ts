// ─────────────────────────────────────────────────────────────
//  Providence · Vedic Astrological Engine Types (BPHS & Saravali)
// ─────────────────────────────────────────────────────────────

export type Graha =
  | 'Surya'     // Sun
  | 'Chandra'   // Moon
  | 'Mangala'   // Mars
  | 'Budha'     // Mercury
  | 'Guru'      // Jupiter
  | 'Shukra'    // Venus
  | 'Shani'     // Saturn
  | 'Rahu'      // North Lunar Node
  | 'Ketu';     // South Lunar Node

export interface NakshatraInfo {
  index: number;         // 1 to 27
  name: string;
  sanskrit: string;
  ruler: Graha;
  deity: string;
  degreesStart: number;  // 0 to 360
  degreesEnd: number;
}

export interface DashaPeriod {
  planet: Graha;
  englishPlanet: string;
  years: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  theme: string;
}

export interface YogaResult {
  name: string;
  sanskritName: string;
  type: 'Raja' | 'Dhana' | 'Mahapurusha' | 'Solar' | 'Auspicious';
  description: string;
  blessing: string;
  isActive: boolean;
}

export interface VedicReading {
  rashi: {
    name: string;
    sanskritName: string;
    symbol: string;
    ruler: Graha;
    englishRuler: string;
    element: string;
  };
  nakshatra: NakshatraInfo;
  currentDasha: {
    mahadasha: DashaPeriod;
    antardasha: DashaPeriod;
  };
  dashaTimeline: DashaPeriod[];
  yogas: YogaResult[];
  predictions: {
    past: {
      title: string;
      theme: string;
      description: string;
      rulingGraha: Graha;
    };
    present: {
      title: string;
      theme: string;
      description: string;
      rulingGraha: Graha;
    };
    future: {
      title: string;
      theme: string;
      description: string;
      rulingGraha: Graha;
    };
  };
}
