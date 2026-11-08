/**
 * Providence Engine Live Test — August 15, 1990 (Leo)
 * Run with: npx ts-node src/engine/test.ts
 */
import { computeNatalChart } from './ephemeris';
import { NAKSHATRAS } from './nakshatras';
import { calculateVimshottari } from './vimshottari';
import { analyzeTransits } from './transits';
import { computeNumerology } from './numerology';

const dob = new Date('1990-08-15T12:00:00Z');
const chart = computeNatalChart(dob);

console.log('\n====== NATAL CHART (Vedic/Sidereal — Lahiri) ======');
console.log(`Sun    : ${chart.sun.rashiName}  ${chart.sun.rashiDegrees.toFixed(2)}°  Nakshatra: ${chart.sun.nakshatraName}`);
console.log(`Moon   : ${chart.moon.rashiName}  ${chart.moon.rashiDegrees.toFixed(2)}°  Nakshatra: ${chart.moon.nakshatraName}  Pada: ${chart.moon.pada}`);
console.log(`Mars   : ${chart.mars.rashiName}  Retro: ${chart.mars.isRetrograde}  Str: ${chart.mars.strength}`);
console.log(`Mercury: ${chart.mercury.rashiName}  Retro: ${chart.mercury.isRetrograde}  Str: ${chart.mercury.strength}`);
console.log(`Jupiter: ${chart.jupiter.rashiName}  Exalted: ${chart.jupiter.isExalted}  Str: ${chart.jupiter.strength}`);
console.log(`Venus  : ${chart.venus.rashiName}  OwnSign: ${chart.venus.isOwnSign}  Str: ${chart.venus.strength}`);
console.log(`Saturn : ${chart.saturn.rashiName}  Debit: ${chart.saturn.isDebilitated}  Str: ${chart.saturn.strength}`);
console.log(`Rahu   : ${chart.rahu.rashiName}   Ketu: ${chart.ketu.rashiName}`);
console.log(`Ayanamsha (Lahiri): ${chart.ayanamsha.toFixed(4)}°`);

const nakshatra = NAKSHATRAS[chart.moon.nakshatraIndex];
console.log(`\nBirth Nakshatra: ${nakshatra.name} (${nakshatra.sanskrit})`);
console.log(`  Ruler: ${nakshatra.ruler}  |  Deity: ${nakshatra.deity}`);

const dasha = calculateVimshottari(dob, nakshatra);
console.log('\n====== VIMSHOTTARI DASHA ======');
dasha.timeline.forEach(d => {
  const marker = d.isCurrent ? ' <-- CURRENT' : '';
  console.log(`  ${d.englishPlanet.padEnd(22)} ${d.startDate} → ${d.endDate}${marker}`);
});
console.log(`Current Mahadasha: ${dasha.currentMahadasha.englishPlanet}`);

const transits = analyzeTransits(chart);
console.log('\n====== TODAY TRANSIT ANALYSIS ======');
transits.transits.forEach(t => {
  const status = t.isAuspicious ? 'GOOD' : t.vedhaBlocked ? 'BLOCKED' : 'INAUSPICIOUS';
  console.log(`  ${t.planet.padEnd(10)} House ${t.transitHouseFromMoon} → [${status}] ${t.effect}`);
});
console.log(`Overall Score: ${transits.overallScore}/100`);
console.log(`Cosmic Weather: ${transits.currentWeather}`);
console.log(`Sade-Sati: ${transits.sadeSati.phase} | Active: ${transits.sadeSati.isActive}`);

const num = computeNumerology(dob, 'Asish Kumar');
console.log('\n====== DUAL NUMEROLOGY ======');
console.log(`Life Path    : ${num.lifePath}  — ${num.lifePathMeaning}`);
console.log(`Personal Year: ${num.personalYear} — ${num.personalYearMeaning}`);
console.log(`Chaldean     : ${num.chaldeanBirth} | Compound: ${num.chaldeanCompound}`);
console.log(`Cross-Confidence: ${num.crossConfidence}%`);
console.log(`Lucky Numbers: ${num.luckyNumbers.join(', ')}`);
console.log(`Power Number : ${num.powerNumber}`);
