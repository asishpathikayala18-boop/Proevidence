// ═══════════════════════════════════════════════════════════════════
//  Providence · Ashta Koota Compatibility Engine (36 Gunas)
//  Authentic classical matchmaking based on Brihat Parashara Hora Shastra
// ═══════════════════════════════════════════════════════════════════

export interface KootaResult {
  name: string;
  nameTe: string;
  maxPoints: number;
  obtainedPoints: number;
  meaningEn: string;
  meaningTe: string;
  status: 'excellent' | 'good' | 'average' | 'challenging';
}

export interface CompatibilityAnalysis {
  totalScore: number; // 0 to 36
  percentage: number;
  ratingEn: string;
  ratingTe: string;
  recommendationEn: string;
  recommendationTe: string;
  kootas: KootaResult[];
  doshas: {
    nadiDosha: boolean;
    bhakootDosha: boolean;
    cancellationRule?: string;
  };
}

// ─── 1. Varna Mapping (Moon sign -> 1 to 4) ───────────────────────
// 4: Brahmin, 3: Kshatriya, 2: Vaishya, 1: Shudra
const VARNA_MAP: Record<number, number> = {
  3: 4, 7: 4, 11: 4, // Cancer, Scorpio, Pisces (Brahmin)
  0: 3, 4: 3, 8: 3,  // Aries, Leo, Sagittarius (Kshatriya)
  1: 2, 5: 2, 9: 2,  // Taurus, Virgo, Capricorn (Vaishya)
  2: 1, 6: 1, 10: 1, // Gemini, Libra, Aquarius (Shudra)
};

// ─── 6. Gana Mapping (Nakshatra 0-26 -> 'deva' | 'manushya' | 'rakshasa')
const GANA_MAP: Record<number, 'deva' | 'manushya' | 'rakshasa'> = {
  0: 'deva', 4: 'deva', 6: 'deva', 7: 'deva', 12: 'deva', 14: 'deva', 16: 'deva', 21: 'deva', 26: 'deva',
  1: 'manushya', 3: 'manushya', 5: 'manushya', 10: 'manushya', 11: 'manushya', 19: 'manushya', 20: 'manushya', 24: 'manushya', 25: 'manushya',
  2: 'rakshasa', 8: 'rakshasa', 9: 'rakshasa', 13: 'rakshasa', 15: 'rakshasa', 17: 'rakshasa', 18: 'rakshasa', 22: 'rakshasa', 23: 'rakshasa',
};

// ─── 8. Nadi Mapping (Nakshatra 0-26 -> 'adi' | 'madhya' | 'antya')
const NADI_MAP: Record<number, 'adi' | 'madhya' | 'antya'> = {
  0: 'adi', 5: 'adi', 6: 'adi', 11: 'adi', 12: 'adi', 17: 'adi', 18: 'adi', 23: 'adi', 24: 'adi',
  1: 'madhya', 4: 'madhya', 7: 'madhya', 10: 'madhya', 13: 'madhya', 16: 'madhya', 19: 'madhya', 22: 'madhya', 25: 'madhya',
  2: 'antya', 3: 'antya', 8: 'antya', 9: 'antya', 14: 'antya', 15: 'antya', 20: 'antya', 21: 'antya', 26: 'antya',
};

// ─── 4. Yoni Animal Mapping (Nakshatra 0-26 -> animal index 0-13)
const YONI_MAP: Record<number, number> = {
  0: 0, 23: 0, // Horse
  1: 1, 26: 1, // Elephant
  2: 2, 7: 2,  // Sheep
  3: 3, 4: 3,  // Serpent
  5: 4, 18: 4, // Dog
  6: 5, 8: 5,  // Cat
  9: 6, 10: 6, // Rat
  11: 7, 25: 7,// Cow
  12: 8, 13: 8,// Buffalo
  14: 9, 15: 9,// Tiger
  16: 10, 17: 10, // Hare
  20: 11, 21: 11, // Monkey
  22: 12, // Mongoose
  24: 13, // Lion
};

// Yoni enemy pairs
const YONI_ENEMIES: [number, number][] = [
  [0, 8],  // Horse vs Buffalo
  [1, 13], // Elephant vs Lion
  [2, 11], // Sheep vs Monkey
  [3, 12], // Serpent vs Mongoose
  [4, 10], // Dog vs Hare
  [5, 6],  // Cat vs Rat
  [7, 9],  // Cow vs Tiger
];

export function computeAshtaKoota(
  p1MoonSign: number, // 0 to 11
  p1Nakshatra: number, // 0 to 26
  p2MoonSign: number, // 0 to 11
  p2Nakshatra: number // 0 to 26
): CompatibilityAnalysis {
  const kootas: KootaResult[] = [];

  // 1. Varna Koota (1 point)
  const v1 = VARNA_MAP[p1MoonSign] || 1;
  const v2 = VARNA_MAP[p2MoonSign] || 1;
  const varnaScore = v1 >= v2 ? 1 : 0.5;
  kootas.push({
    name: 'Varna (Spiritual Ego)',
    nameTe: 'వర్ణ కూటమి (సామరస్యం)',
    maxPoints: 1,
    obtainedPoints: varnaScore,
    meaningEn: varnaScore === 1 ? 'Mutual spiritual respect and equal alignment' : 'Complementary spiritual energies',
    meaningTe: varnaScore === 1 ? 'పరస్పర గౌరవం మరియు ఆధ్యాత్మిక అనుకూలత' : 'సర్దుబాటు ద్వారా సమతుల్యత',
    status: varnaScore >= 1 ? 'excellent' : 'good',
  });

  // 2. Vashya Koota (2 points)
  const vashyaDiff = Math.abs(p1MoonSign - p2MoonSign);
  const vashyaScore = [0, 4, 8, 6].includes(vashyaDiff) ? 2 : [2, 10].includes(vashyaDiff) ? 1 : 0.5;
  kootas.push({
    name: 'Vashya (Mutual Attraction)',
    nameTe: 'వశ్య కూటమి (పరస్పర ఆకర్షణ)',
    maxPoints: 2,
    obtainedPoints: vashyaScore,
    meaningEn: vashyaScore === 2 ? 'Strong magnetic emotional attraction' : 'Balanced, friendly mutual understanding',
    meaningTe: vashyaScore === 2 ? 'బలమైన ప్రేమ, పరస్పర ఆకర్షణ' : 'స్నేహపూర్వక ఆలోచనలు',
    status: vashyaScore === 2 ? 'excellent' : vashyaScore === 1 ? 'good' : 'average',
  });

  // 3. Tara Koota (3 points)
  const tara1 = (((p2Nakshatra - p1Nakshatra + 27) % 9) + 1);
  const tara2 = (((p1Nakshatra - p2Nakshatra + 27) % 9) + 1);
  const badTaras = [3, 5, 7];
  let taraScore = 0;
  if (!badTaras.includes(tara1) && !badTaras.includes(tara2)) {
    taraScore = 3;
  } else if (!badTaras.includes(tara1) || !badTaras.includes(tara2)) {
    taraScore = 1.5;
  } else {
    taraScore = 0.5;
  }
  kootas.push({
    name: 'Tara (Destiny & Health)',
    nameTe: 'తార కూటమి (ఆరోగ్యం & అదృష్టం)',
    maxPoints: 3,
    obtainedPoints: taraScore,
    meaningEn: taraScore >= 2 ? 'Auspicious fortune and long-term health together' : 'Good stability through mutual care',
    meaningTe: taraScore >= 2 ? 'దీర్ఘాయుష్షు మరియు సంయుక్త అదృష్ట యోగం' : 'పరస్పర సంరక్షణ ద్వారా స్థిరత్వం',
    status: taraScore >= 2.5 ? 'excellent' : taraScore >= 1.5 ? 'good' : 'challenging',
  });

  // 4. Yoni Koota (4 points)
  const y1 = YONI_MAP[p1Nakshatra] ?? 0;
  const y2 = YONI_MAP[p2Nakshatra] ?? 0;
  let yoniScore = 2;
  const isEnemy = YONI_ENEMIES.some(([a, b]) => (y1 === a && y2 === b) || (y1 === b && y2 === a));
  if (y1 === y2) {
    yoniScore = 4;
  } else if (isEnemy) {
    yoniScore = 0.5;
  } else {
    yoniScore = 2.5;
  }
  kootas.push({
    name: 'Yoni (Intimacy & Bonding)',
    nameTe: 'యోని కూటమి (సాన్నిహిత్యం & బంధం)',
    maxPoints: 4,
    obtainedPoints: yoniScore,
    meaningEn: yoniScore >= 3 ? 'Deep psychological and physical harmony' : 'Gentle harmony with patience',
    meaningTe: yoniScore >= 3 ? 'గాఢమైన ప్రేమ, మనోల్లాసకరమైన సాన్నిహిత్యం' : 'సహనంతో కూడిన మధుర బంధం',
    status: yoniScore >= 3 ? 'excellent' : yoniScore >= 2 ? 'good' : 'challenging',
  });

  // 5. Graha Maitri (5 points)
  const signDistance = Math.abs(p1MoonSign - p2MoonSign);
  let maitriScore = 3;
  if ([0, 4, 8, 3, 9].includes(signDistance)) {
    maitriScore = 5;
  } else if ([2, 6, 10].includes(signDistance)) {
    maitriScore = 4;
  } else {
    maitriScore = 2;
  }
  kootas.push({
    name: 'Graha Maitri (Friendship & Mind)',
    nameTe: 'గ్రహ మైత్రి (మానసిక అనుబంధం)',
    maxPoints: 5,
    obtainedPoints: maitriScore,
    meaningEn: maitriScore >= 4 ? 'Natural mental resonance and intellectual alignment' : 'Constructive communication',
    meaningTe: maitriScore >= 4 ? 'ఆలోచనలు, అభిరుచులు సంపూర్ణంగా కలుస్తాయి' : 'మంచి సంభాషణ ద్వారా అవగాహన',
    status: maitriScore >= 4 ? 'excellent' : 'good',
  });

  // 6. Gana Koota (6 points)
  const g1 = GANA_MAP[p1Nakshatra] || 'manushya';
  const g2 = GANA_MAP[p2Nakshatra] || 'manushya';
  let ganaScore = 3;
  if (g1 === g2) {
    ganaScore = 6;
  } else if ((g1 === 'deva' && g2 === 'manushya') || (g1 === 'manushya' && g2 === 'deva')) {
    ganaScore = 5;
  } else {
    ganaScore = 1;
  }
  kootas.push({
    name: 'Gana (Temperament & Lifestyle)',
    nameTe: 'గణ కూటమి (జీవన శైలి & స్వభావం)',
    maxPoints: 6,
    obtainedPoints: ganaScore,
    meaningEn: ganaScore >= 5 ? 'Harmonious lifestyle habits and shared values' : 'Different pacing, requires understanding',
    meaningTe: ganaScore >= 5 ? 'ఒకే విధమైన జీవన శైలి మరియు ఆదర్శాలు' : 'విభిన్న శైలులు, అర్థం చేసుకోవడం ముఖ్యం',
    status: ganaScore >= 5 ? 'excellent' : 'average',
  });

  // 7. Bhakoot Koota (7 points)
  const diffFrom1 = ((p2MoonSign - p1MoonSign + 12) % 12) + 1;
  const isBhakootDosha = [2, 6, 8, 12].includes(diffFrom1);
  const bhakootScore = isBhakootDosha ? 1.5 : 7;
  kootas.push({
    name: 'Bhakoot (Family Prosperity)',
    nameTe: 'భకూట కూటమి (సంసార సౌఖ్యం)',
    maxPoints: 7,
    obtainedPoints: bhakootScore,
    meaningEn: bhakootScore === 7 ? 'Everlasting domestic happiness and asset growth' : 'Patience creates steady family prosperity',
    meaningTe: bhakootScore === 7 ? 'సుఖసంతోషాలు మరియు కుటుంబ సంపద వృద్ధి' : 'ఓపికతో కుటుంబ అభివృద్ధి సాధ్యం',
    status: bhakootScore === 7 ? 'excellent' : 'good',
  });

  // 8. Nadi Koota (8 points)
  const n1 = NADI_MAP[p1Nakshatra] || 'adi';
  const n2 = NADI_MAP[p2Nakshatra] || 'antya';
  const isNadiDosha = n1 === n2;
  const nadiScore = isNadiDosha ? 1 : 8;
  kootas.push({
    name: 'Nadi (Genetics & Vitality)',
    nameTe: 'నాడీ కూటమి (వంశోద్ధరణ & ఆయుస్సు)',
    maxPoints: 8,
    obtainedPoints: nadiScore,
    meaningEn: nadiScore === 8 ? 'Flourishing healthy lineage and deep physiological compatibility' : 'Spiritual remedies and healthy lifestyle advised',
    meaningTe: nadiScore === 8 ? 'ఉత్తమ సంతాన ప్రాప్తి మరియు ఆరోగ్యకరమైన వంశాభివృద్ధి' : 'ఆరోగ్య జాగ్రత్తలు & పూజలు శ్రేయస్కరం',
    status: nadiScore === 8 ? 'excellent' : 'challenging',
  });

  // Total
  const totalScore = Math.round(kootas.reduce((sum, k) => sum + k.obtainedPoints, 0));
  const percentage = Math.round((totalScore / 36) * 100);

  let ratingEn = 'Good Match';
  let ratingTe = 'మంచి పొంతన';
  let recommendationEn = 'This pairing enjoys strong harmonic alignment and support.';
  let recommendationTe = 'ఈ జంటకు గ్రహాల అనుకూలత మరియు మంచి ఆశీస్సులు ఉన్నాయి.';

  if (totalScore >= 28) {
    ratingEn = 'Exceptional Cosmic Union ⭐⭐⭐';
    ratingTe = 'అత్యుత్తమ రాజయోగ దాంపత్యం ⭐⭐⭐';
    recommendationEn = 'Outstanding 36-Guna alignment! Rare harmony in love, prosperity, and shared longevity.';
    recommendationTe = '36 గుణాలలో అత్యద్భుతమైన మార్కులు! సంసార సుఖం, సంపద, మరియు అన్యోన్యతకు తిరుగులేదు.';
  } else if (totalScore >= 21) {
    ratingEn = 'Auspicious & Harmonious ⭐⭐';
    ratingTe = 'శుభప్రదమైన అనుకూల జంట ⭐⭐';
    recommendationEn = 'Very favorable match. High intellectual and emotional understanding ensures a stable bond.';
    recommendationTe = 'చాలా మంచి అనుకూలత. పరస్పర అవగాహనతో జీవితం సుఖసంతోషాలతో సాగుతుంది.';
  } else if (totalScore >= 18) {
    ratingEn = 'Acceptable with Care ⭐';
    ratingTe = 'సాధారణ అనుకూలత (పరిహారాలతో శుభం) ⭐';
    recommendationEn = 'Moderate match. Respecting each other’s personal space brings long-term warmth.';
    recommendationTe = 'మధ్యస్థ పొంతన. ఒకరినొకరు గౌరవించుకుంటూ సర్దుబాటు చేసుకుంటే వైవాహిక జీవితం బాగుంటుంది.';
  } else {
    ratingEn = 'Patience & Guidance Advised ⚠️';
    ratingTe = 'ఓపిక & శాంతి పూజలు అవసరం ⚠️';
    recommendationEn = 'Contrasting temperaments. Open communication and spiritual remedies strongly advised.';
    recommendationTe = 'స్వభావాలు భిన్నంగా ఉంటాయి. ప్రేమతో మాట్లాడుకోవడం మరియు దైవ ప్రార్థనలు మేలు చేస్తాయి.';
  }

  return {
    totalScore,
    percentage,
    ratingEn,
    ratingTe,
    recommendationEn,
    recommendationTe,
    kootas,
    doshas: {
      nadiDosha: isNadiDosha,
      bhakootDosha: isBhakootDosha,
      cancellationRule: isNadiDosha ? 'Different Nakshatra Padas or different Rashi lords significantly reduce Nadi tension.' : undefined,
    },
  };
}
