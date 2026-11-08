// ─────────────────────────────────────────────
//  Providence · Zodiac Detail Screen v2.1
//  Bilingual Telugu & Simple English + Vedic Kundali Chart (SVG)
// ─────────────────────────────────────────────
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  ImageBackground,
} from 'react-native';
import { Colors, Spacing, Radius, Shadows, FontSize } from '../theme';
import { ZodiacSign } from '../theme/zodiac';
import { computeFullReading, FullProvidentReading } from '../engine/synthesizer';
import { KundaliChart } from '../components/KundaliChart';
import { useLanguage, TELUGU_RASHIS } from '../localization';

const { width } = Dimensions.get('window');

type TimeFrame = 'past' | 'present' | 'future';

const FRAME_CONFIG: { key: TimeFrame; labelEn: string; labelTe: string; icon: string; color: string }[] = [
  { key: 'past',    labelEn: 'Past',    labelTe: 'గతం',     icon: '🌑', color: '#8B6CF6' },
  { key: 'present', labelEn: 'Present', labelTe: 'వర్తమానం', icon: '🌕', color: '#F5B842' },
  { key: 'future',  labelEn: 'Future',  labelTe: 'భవిష్యత్తు',icon: '🌟', color: '#38BDF8' },
];

const DOMAIN_TRANSLATIONS: Record<string, { en: string; te: string }> = {
  Career:    { en: 'Career & Stardom',    te: 'కెరీర్ & ఉద్యోగ విజయాలు' },
  Wealth:    { en: 'Money & Wealth',      te: 'ధనం & ఆస్తిపాస్తులు' },
  Love:      { en: 'Love & Marriage',     te: 'ప్రేమ & దాంపత్య జీవితం' },
  Health:    { en: 'Health & Energy',     te: 'ఆరోగ్యం & శారీరక బలం' },
  Spiritual: { en: 'Spiritual Peace',     te: 'ఆధ్యాత్మికం & మనశ్శాంతి' },
  Family:    { en: 'Family & Legacy',     te: 'కుటుంబం & వంశ గౌరవం' },
};

const GRADE_TRANSLATIONS: Record<string, { en: string; te: string }> = {
  Excellent:   { en: 'Peak ⭐⭐⭐',    te: 'అత్యుత్తమం' },
  Good:        { en: 'Favorable ⭐⭐', te: 'చాలా అనుకూలం' },
  Moderate:    { en: 'Balanced ⭐',    te: 'మధ్యస్థం' },
  Challenging: { en: 'Needs Care ⚠️', te: 'జాగ్రత్త అవసరం' },
};

const ZodiacDetailScreen = ({ route, navigation }: any) => {
  const { sign, dob, name }: {
    sign: ZodiacSign;
    dob?: Date;
    name?: string;
  } = route.params;

  const { language, setLanguage, t } = useLanguage();
  const [activeFrame, setActiveFrame] = useState<TimeFrame>('present');
  const [showEphemeris, setShowEphemeris] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const birthDate = dob ? new Date(dob) : new Date(1995, 0, 1);

  // Compute 7-Layer Vedic reading
  const reading: FullProvidentReading = computeFullReading(
    birthDate,
    sign.id,
    sign.name,
    sign.element,
    sign.symbol,
    sign.lucky.days,
    sign.lucky.numbers,
    sign.lucky.colors,
    name || ''
  );

  const switchFrame = (frame: TimeFrame) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
    setActiveFrame(frame);
  };

  const activeCfg = FRAME_CONFIG.find(f => f.key === activeFrame)!;
  const currentPrediction = reading.predictions[activeFrame];

  const favorableCount = reading.transitAnalysis.transits.filter(t => t.isAuspicious && !t.vedhaBlocked).length;
  const vedhaBlockedCount = reading.transitAnalysis.transits.filter(t => t.vedhaBlocked).length;

  const planetsList = [
    reading.natalChart.sun,
    reading.natalChart.moon,
    reading.natalChart.mars,
    reading.natalChart.mercury,
    reading.natalChart.jupiter,
    reading.natalChart.venus,
    reading.natalChart.saturn,
    reading.natalChart.rahu,
    reading.natalChart.ketu,
  ];

  const lagnaIndex = reading.natalChart.ascendant?.rashiIndex ?? reading.natalChart.moon.rashiIndex;

  const teluguRashi = TELUGU_RASHIS[sign.id];
  const displaySignName = language === 'te' && teluguRashi ? teluguRashi.teluguName : sign.name.toUpperCase();

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../../image/moving stars.jpg')}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.bgOverlay} />

        {/* ── Hero Header ── */}
        <View style={[styles.hero, { borderBottomColor: sign.color + '55' }]}>
          <Image source={sign.rulingPlanetImage} style={styles.planetHero} resizeMode="contain" />
          <View style={[styles.planetGlow, { backgroundColor: sign.color + '35' }]} />

          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {/* Language toggle pill in Hero */}
          <View style={styles.heroLangWrap}>
            <TouchableOpacity
              style={[styles.heroLangBtn, language === 'en' && styles.heroLangBtnActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.heroLangText, language === 'en' && styles.heroLangTextActive]}>EN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.heroLangBtn, language === 'te' && styles.heroLangBtnActive]}
              onPress={() => setLanguage('te')}
            >
              <Text style={[styles.heroLangText, language === 'te' && styles.heroLangTextActive]}>తె</Text>
            </TouchableOpacity>
          </View>

          {/* Sign symbol + name */}
          <View style={styles.heroTextWrap}>
            <Text style={[styles.heroSymbol, { color: sign.color }]}>{sign.symbol}</Text>
            <Text style={styles.heroName}>{displaySignName}</Text>
            <Text style={styles.heroSanskrit}>
              {language === 'te' ? reading.rashi.name : reading.rashi.sanskritName}
            </Text>
            <Text style={styles.heroDates}>{sign.dateRange}</Text>

            {/* Element + modality + nakshatra pills */}
            <View style={styles.pillsRow}>
              <View style={[styles.pill, { borderColor: Colors.element[sign.element] }]}>
                <Text style={[styles.pillText, { color: Colors.element[sign.element] }]}>
                  {language === 'te' && teluguRashi ? teluguRashi.element : sign.element.toUpperCase()}
                </Text>
              </View>
              <View style={[styles.pill, { borderColor: sign.color }]}>
                <Text style={[styles.pillText, { color: sign.color }]}>
                  ♃ {language === 'te' && teluguRashi ? teluguRashi.lord : `${sign.rulingPlanet} (${reading.rashi.englishRuler})`}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── 7-Layer Accuracy Confidence Banner ── */}
          <View style={styles.confidenceBanner}>
            <View style={styles.confidenceRow}>
              <View style={styles.confScoreBadge}>
                <Text style={styles.confScoreNum}>{reading.confidence.overall}%</Text>
                <Text style={styles.confScoreLabel}>{t.accuracy}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={styles.confBadgeTitle}>
                  {t.sevenLayerTitle}
                </Text>
                <Text style={styles.confBadgeSub}>
                  {t.sevenLayerSub}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Active Vimshottari Mahadasha & Antardasha Banner ── */}
          <View style={[styles.dashaBanner, { borderColor: activeCfg.color + '77' }]}>
            <Text style={styles.dashaHeaderLabel}>{t.activeDasha}</Text>
            <Text style={[styles.dashaTitle, { color: activeCfg.color }]}>
              {reading.currentDasha.mahadasha.englishPlanet} {t.mahadasha}
            </Text>
            <Text style={styles.dashaSubPeriod}>
              {t.antardasha}: {reading.currentDasha.antardasha.englishPlanet}
            </Text>
            <Text style={styles.dashaDateSpan}>
              {reading.currentDasha.mahadasha.startDate} – {reading.currentDasha.mahadasha.endDate}
            </Text>
            <Text style={styles.dashaThemeText}>
              "{reading.currentDasha.mahadasha.theme}"
            </Text>
          </View>

          {/* ── Interactive Kundali Chart (North Indian SVG) ── */}
          <Text style={styles.sectionTitle}>
            {language === 'te' ? '⬡ మీ జన్మ కుండలి (VEDIC BIRTH CHART) ⬡' : '⬡ VEDIC KUNDALI BIRTH CHART ⬡'}
          </Text>
          <View style={styles.kundaliCard}>
            <KundaliChart
              lagnaRashiIndex={lagnaIndex}
              planets={planetsList.map(p => ({
                planet: p.planet,
                rashiIndex: p.rashiIndex,
                isRetrograde: p.isRetrograde,
              }))}
              width={width - Spacing.base * 2 - Spacing.md * 2}
            />
            <Text style={styles.kundaliHint}>
              {language === 'te'
                ? '✦ పసుపు రంగులో నవగ్రహాలు మరియు సంఖ్యలు మీ రాశి చక్ర స్థానాలు'
                : '✦ Numbers represent Rashi signs (1=Aries ... 12=Pisces). Center top is Chandra Lagna.'}
            </Text>
          </View>

          {/* ── Nakshatra & Pada Card ── */}
          <View style={styles.nakshatraCard}>
            <Text style={styles.nakshatraLabel}>{t.birthNakshatra}</Text>
            <Text style={styles.nakshatraName}>
              {reading.nakshatra.name} ({reading.nakshatra.sanskrit}) · {t.pada} {reading.natalChart.moon.pada}
            </Text>
            <Text style={styles.nakshatraMeta}>
              {t.governedBy} {reading.nakshatra.ruler} · {t.deity}: {reading.nakshatra.deity}
            </Text>
          </View>

          {/* ── Real-Time Transits & Sade-Sati Monitor ── */}
          <Text style={styles.sectionTitle}>{t.realtimeGochara}</Text>
          <View style={[
            styles.sadeSatiCard,
            reading.transitAnalysis.sadeSati.isActive
              ? { borderColor: '#F59E0B' }
              : { borderColor: 'rgba(52,211,153,0.4)' }
          ]}>
            <View style={styles.sadeSatiHeader}>
              <Text style={styles.sadeSatiIcon}>
                {reading.transitAnalysis.sadeSati.isActive ? '⚠️' : '🛡️'}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={[
                  styles.sadeSatiTitle,
                  { color: reading.transitAnalysis.sadeSati.isActive ? '#F59E0B' : '#34D399' }
                ]}>
                  {reading.transitAnalysis.sadeSati.isActive
                    ? t.sadeSatiActive
                    : t.sadeSatiClear}
                </Text>
                <Text style={styles.sadeSatiSub}>
                  {reading.transitAnalysis.sadeSati.description}
                </Text>
              </View>
            </View>
            {reading.transitAnalysis.sadeSati.isActive && (
              <View style={styles.sadeSatiRemedyBox}>
                <Text style={styles.sadeSatiRemedyText}>
                  ✦ {language === 'te' ? 'శని పరిహారం: శనివారం నూనె దీపం & "ఓం శం శనైశ్చరాయ నమః" జపించండి.' : 'Remedy: Chant "Om Sham Shanicharaya Namah" & light a sesame lamp on Saturdays.'}
                </Text>
              </View>
            )}
            <View style={styles.transitStatsRow}>
              <Text style={styles.transitStatItem}>
                ✦ {t.favorableTransits}: <Text style={{ color: '#34D399', fontWeight: 'bold' }}>{favorableCount}</Text>
              </Text>
              <Text style={styles.transitStatItem}>
                ✦ {t.obstructedTransits}: <Text style={{ color: '#F87171', fontWeight: 'bold' }}>{vedhaBlockedCount}</Text>
              </Text>
            </View>
          </View>

          {/* ── 6 Life Domain Confidence Scores ── */}
          <Text style={styles.sectionTitle}>{t.domainsTitle}</Text>
          <View style={styles.domainCard}>
            {reading.domainScores.map(d => {
              const trans = DOMAIN_TRANSLATIONS[d.domain];
              const domainLabel = language === 'te' && trans ? trans.te : (trans ? trans.en : d.domain);
              const gradeTrans = GRADE_TRANSLATIONS[d.grade];
              const gradeLabel = language === 'te' && gradeTrans ? gradeTrans.te : (gradeTrans ? gradeTrans.en : d.grade);

              return (
                <View key={d.domain} style={styles.domainRow}>
                  <View style={styles.domainInfo}>
                    <Text style={styles.domainName}>{d.emoji} {domainLabel}</Text>
                    <View style={[styles.domainBadge, { borderColor: d.color }]}>
                      <Text style={[styles.domainBadgeText, { color: d.color }]}>{gradeLabel}</Text>
                    </View>
                  </View>
                  <View style={styles.domainBarWrapper}>
                    <View style={styles.domainBarBg}>
                      <View style={[styles.domainBarFill, { width: `${d.score}%`, backgroundColor: d.color }]} />
                    </View>
                    <Text style={[styles.domainScoreText, { color: d.color }]}>{d.score}%</Text>
                  </View>
                  <Text style={styles.domainInsightText}>{d.insight}</Text>
                </View>
              );
            })}
          </View>

          {/* ── Time Frame Switcher ── */}
          <Text style={styles.sectionTitle}>
            {language === 'te' ? '⟳ కాల చక్రం (గతం · వర్తమానం · భవిష్యత్తు)' : '⟳ TIMELINE (PAST · PRESENT · FUTURE)'}
          </Text>
          <View style={styles.frameSwitcher}>
            {FRAME_CONFIG.map(cfg => (
              <TouchableOpacity
                key={cfg.key}
                style={[
                  styles.frameTab,
                  activeFrame === cfg.key && { backgroundColor: cfg.color + '30', borderColor: cfg.color },
                ]}
                onPress={() => switchFrame(cfg.key)}
              >
                <Text style={styles.frameIcon}>{cfg.icon}</Text>
                <Text style={[styles.frameLabel, activeFrame === cfg.key && { color: cfg.color }]}>
                  {language === 'te' ? cfg.labelTe : cfg.labelEn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Reading Card (Powered by 7-layer synthesis) ── */}
          <Animated.View style={[styles.readingCard, { opacity: fadeAnim, borderColor: activeCfg.color + '55' }]}>
            <Text style={[styles.readingFrameTitle, { color: activeCfg.color }]}>
              {activeCfg.icon} {currentPrediction.title}
            </Text>
            <View style={[styles.readingDivider, { backgroundColor: activeCfg.color }]} />
            <Text style={styles.readingTheme}>
              ✦ {language === 'te' ? 'ప్రధాన విషయం' : 'Central Theme'}: {currentPrediction.theme}
            </Text>
            <Text style={styles.readingText}>{currentPrediction.description}</Text>
          </Animated.View>

          {/* ── Classical Yogas ── */}
          {reading.yogas.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>
                {language === 'te' ? '⬡ మీ జాతకంలో ఏర్పడిన రాజయోగాలు ⬡' : '⬡ ACTIVE CLASSICAL YOGAS ⬡'}
              </Text>
              {reading.yogas.map((yoga, idx) => (
                <View key={idx} style={[styles.yogaCard, { borderColor: sign.color + '44' }]}>
                  <View style={styles.yogaHeaderRow}>
                    <Text style={[styles.yogaName, { color: sign.color }]}>
                      {yoga.name} · {yoga.sanskritName}
                    </Text>
                    <View style={styles.yogaTypeBadge}>
                      <Text style={styles.yogaTypeBadgeText}>{yoga.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.yogaDesc}>{yoga.description}</Text>
                  <Text style={styles.yogaBlessing}>✦ {language === 'te' ? 'ఫలితం' : 'Blessing'}: {yoga.blessing}</Text>
                </View>
              ))}
            </>
          )}

          {/* ── Astronomical Ephemeris Toggle ── */}
          <TouchableOpacity
            style={styles.ephemerisToggle}
            onPress={() => setShowEphemeris(!showEphemeris)}
          >
            <Text style={styles.ephemerisToggleText}>
              {showEphemeris
                ? (language === 'te' ? '▼ గ్రహ స్థానాల పట్టికను దాచండి' : '▼ Hide Astronomical Planetary Positions')
                : (language === 'te' ? '▶ ఖచ్చితమైన గ్రహాల డిగ్రీలు చూడండి (లాహిరి పంచాంగం)' : '▶ View Real Astronomical Planetary Positions (Lahiri)')}
            </Text>
          </TouchableOpacity>

          {showEphemeris && (
            <View style={styles.ephemerisCard}>
              <Text style={styles.ephemerisHeader}>
                ✦ SIDEREAL EPHEMERIS POSITIONS (LAHIRI: {reading.natalChart.ayanamsha.toFixed(2)}°)
              </Text>
              {planetsList.map(p => {
                const dignity = p.isExalted ? 'Exalted' : p.isDebilitated ? 'Debilitated' : p.isOwnSign ? 'Own Sign' : 'Neutral';
                return (
                  <View key={p.planet} style={styles.planetRow}>
                    <View style={styles.planetColMain}>
                      <Text style={styles.planetGrahaText}>{p.planet}</Text>
                      <Text style={styles.planetRashiText}>{p.rashiName} ({p.rashiDegrees.toFixed(1)}°)</Text>
                    </View>
                    <View style={styles.planetColSub}>
                      <Text style={styles.planetNakText}>{p.nakshatraName} ({t.pada} {p.pada})</Text>
                      <View style={styles.planetBadgesRow}>
                        {p.isRetrograde && (
                          <View style={styles.retroBadge}>
                            <Text style={styles.retroText}>℞ Retro</Text>
                          </View>
                        )}
                        <View style={[
                          styles.dignityBadge,
                          p.isExalted ? { backgroundColor: 'rgba(52,211,153,0.2)', borderColor: '#34D399' } :
                          p.isDebilitated ? { backgroundColor: 'rgba(248,113,113,0.2)', borderColor: '#F87171' } :
                          { backgroundColor: 'rgba(155,126,255,0.2)', borderColor: '#9B7EFF' }
                        ]}>
                          <Text style={styles.dignityText}>{dignity.toUpperCase()}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* ── Lucky Details ── */}
          <Text style={styles.sectionTitle}>{t.cosmicLuck}</Text>
          <View style={styles.luckyGrid}>
            <LuckyCard label={t.luckyNumbers} value={reading.cosmicLuck.luckyNumbers.join(' · ')} icon="🔢" color={sign.color} />
            <LuckyCard label={t.luckyColors}  value={reading.cosmicLuck.luckyColors.join(' & ')} icon="🎨" color={sign.color} />
            <LuckyCard label={t.luckyDays}    value={reading.cosmicLuck.luckyDays.join(', ')} icon="📅" color={sign.color} />
            <LuckyCard label={t.gemstone}     value={reading.cosmicLuck.luckyGemstone} icon="💎" color={sign.color} />
            <LuckyCard label={t.metal}        value={reading.cosmicLuck.luckyMetal} icon="🪙" color={sign.color} />
            <LuckyCard label={t.direction}    value={reading.cosmicLuck.bestDirection} icon="🧭" color={sign.color} />
          </View>

          {/* ── Sacred Mantra Card ── */}
          <View style={[styles.mantraCard, { borderColor: sign.color + '55' }]}>
            <Text style={styles.mantraLabel}>{t.mantraTitle}</Text>
            <Text style={[styles.mantraText, { color: sign.color }]}>
              "{reading.cosmicLuck.mantra}"
            </Text>
            <Text style={styles.mantraSub}>{t.mantraInstruction}</Text>
          </View>

          {/* ── Ruling planet full image ── */}
          <Text style={styles.sectionTitle}>⟡ {language === 'te' ? 'అధిపతి గ్రహం' : 'RULING PLANET'}</Text>
          <View style={styles.planetFullWrap}>
            <Image source={sign.rulingPlanetImage} style={styles.planetFull} resizeMode="contain" />
            <Text style={[styles.planetName, { color: sign.color }]}>{sign.rulingPlanet}</Text>
          </View>

          {/* ── CTA ── */}
          <TouchableOpacity
            style={[styles.luckyBtn, { backgroundColor: sign.color }]}
            onPress={() => navigation.navigate('LuckyNumber', { sign, dob, name })}
          >
            <Text style={styles.luckyBtnText}>{t.seeNumerology}</Text>
          </TouchableOpacity>

          <View style={{ height: Spacing['4xl'] }} />
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const LuckyCard = ({ label, value, icon, color }: any) => (
  <View style={[lStyles.card, { borderColor: color + '44' }]}>
    <Text style={lStyles.icon}>{icon}</Text>
    <Text style={lStyles.label}>{label}</Text>
    <Text style={[lStyles.value, { color }]}>{value}</Text>
  </View>
);

const lStyles = StyleSheet.create({
  card: {
    width: (width - Spacing.base * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl, borderWidth: 1,
    padding: Spacing.md, alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon:  { fontSize: 22, marginBottom: 4 },
  label: { color: Colors.text.muted, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center', marginBottom: 4 },
  value: { fontSize: FontSize.base, fontWeight: '700', textAlign: 'center' },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg.void },
  bg:   { flex: 1 },
  bgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5,5,20,0.85)' },
  scroll: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md },

  hero: {
    height: 260, alignItems: 'center', justifyContent: 'flex-end',
    borderBottomWidth: 1, paddingBottom: Spacing.lg,
    position: 'relative',
  },
  planetHero: {
    position: 'absolute', top: 10, right: -20,
    width: 140, height: 140, opacity: 0.55,
  },
  planetGlow: {
    position: 'absolute', top: 20, right: 10,
    width: 100, height: 100, borderRadius: 50,
  },
  backBtn: {
    position: 'absolute', top: 12, left: Spacing.base,
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.full, width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(155,126,255,0.3)',
  },
  backIcon: { color: Colors.text.primary, fontSize: FontSize.xl },

  heroLangWrap: {
    position: 'absolute', top: 14, right: Spacing.base,
    flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: Radius.full, padding: 2, borderWidth: 1, borderColor: 'rgba(232,160,32,0.4)',
  },
  heroLangBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  heroLangBtnActive: { backgroundColor: Colors.gold[500] },
  heroLangText: { color: Colors.text.muted, fontSize: 10, fontWeight: 'bold' },
  heroLangTextActive: { color: Colors.bg.void },

  heroTextWrap: { alignItems: 'center' },
  heroSymbol: { fontSize: 52, marginBottom: 4 },
  heroName:   { color: Colors.text.primary, fontSize: FontSize['2xl'], letterSpacing: 4 },
  heroSanskrit: { color: Colors.gold[400], fontSize: FontSize.sm, letterSpacing: 2, marginBottom: 2 },
  heroDates:  { color: Colors.text.muted, fontSize: FontSize.xs, letterSpacing: 2, marginBottom: Spacing.sm },
  pillsRow:   { flexDirection: 'row', gap: Spacing.sm },
  pill: {
    borderWidth: 1, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
  },
  pillText: { fontSize: 9, letterSpacing: 1 },

  // Confidence Banner
  confidenceBanner: {
    backgroundColor: 'rgba(30, 25, 60, 0.9)',
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(232,160,32,0.4)',
    marginVertical: Spacing.sm,
    ...Shadows.gold,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confScoreBadge: {
    backgroundColor: 'rgba(232,160,32,0.15)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.gold[500],
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  confScoreNum: {
    color: Colors.gold[300],
    fontSize: FontSize.xl,
    fontWeight: 'bold',
  },
  confScoreLabel: {
    color: Colors.gold[400],
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  confBadgeTitle: {
    color: Colors.gold[400],
    fontSize: FontSize.xs,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  confBadgeSub: {
    color: Colors.text.secondary,
    fontSize: 10,
    lineHeight: 14,
  },

  // Dasha Banner
  dashaBanner: {
    backgroundColor: 'rgba(25, 20, 55, 0.85)',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    marginVertical: Spacing.sm,
    alignItems: 'center',
    ...Shadows.gold,
  },
  dashaHeaderLabel: {
    color: Colors.gold[400],
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dashaTitle: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  dashaSubPeriod: {
    color: Colors.gold[300],
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginBottom: 4,
  },
  dashaDateSpan: {
    color: Colors.text.secondary,
    fontSize: 11,
    marginBottom: 6,
    textAlign: 'center',
  },
  dashaThemeText: {
    color: Colors.text.primary,
    fontSize: FontSize.sm,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Kundali Card
  kundaliCard: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(232,160,32,0.3)',
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.gold,
  },
  kundaliHint: {
    color: Colors.gold[300],
    fontSize: 9.5,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 14,
  },

  // Nakshatra Card
  nakshatraCard: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(155,126,255,0.25)',
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  nakshatraLabel: {
    color: Colors.text.muted,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  nakshatraName: {
    color: Colors.text.primary,
    fontSize: FontSize.base,
    fontWeight: '700',
    letterSpacing: 1,
  },
  nakshatraMeta: {
    color: Colors.gold[400],
    fontSize: FontSize.xs,
    marginTop: 2,
  },

  // Sade-Sati Card
  sadeSatiCard: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sadeSatiHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sadeSatiIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  sadeSatiTitle: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  sadeSatiSub: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
    lineHeight: 18,
  },
  sadeSatiRemedyBox: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
  },
  sadeSatiRemedyText: {
    color: '#F59E0B',
    fontSize: FontSize.xs,
    fontStyle: 'italic',
  },
  transitStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  transitStatItem: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
  },

  // 6 Life Domains
  domainCard: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(155,126,255,0.25)',
    marginBottom: Spacing.md,
  },
  domainRow: {
    marginBottom: Spacing.md,
  },
  domainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  domainName: {
    color: Colors.text.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  domainBadge: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
  domainBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  domainBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  domainBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  domainBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  domainScoreText: {
    fontSize: FontSize.xs,
    fontWeight: 'bold',
    width: 32,
    textAlign: 'right',
  },
  domainInsightText: {
    color: Colors.text.secondary,
    fontSize: 10,
    lineHeight: 14,
  },

  // Classical Yoga Cards
  yogaCard: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  yogaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  yogaName: {
    fontSize: FontSize.base,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    flex: 1,
  },
  yogaTypeBadge: {
    backgroundColor: 'rgba(232,160,32,0.2)',
    borderColor: Colors.gold[500],
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  yogaTypeBadgeText: {
    color: Colors.gold[400],
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  yogaDesc: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
    lineHeight: 18,
    marginBottom: 4,
  },
  yogaBlessing: {
    color: Colors.text.primary,
    fontSize: FontSize.xs,
    fontStyle: 'italic',
    fontWeight: '600',
  },

  // Ephemeris Section
  ephemerisToggle: {
    backgroundColor: 'rgba(30,25,60,0.7)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(155,126,255,0.3)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  ephemerisToggleText: {
    color: Colors.gold[400],
    fontSize: FontSize.xs,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  ephemerisCard: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(155,126,255,0.25)',
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  ephemerisHeader: {
    color: Colors.gold[400],
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  planetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  planetColMain: {
    flex: 1,
  },
  planetGrahaText: {
    color: Colors.text.primary,
    fontSize: FontSize.sm,
    fontWeight: 'bold',
  },
  planetRashiText: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
  },
  planetColSub: {
    alignItems: 'flex-end',
  },
  planetNakText: {
    color: Colors.gold[400],
    fontSize: FontSize.xs,
    marginBottom: 2,
  },
  planetBadgesRow: {
    flexDirection: 'row',
    gap: 4,
  },
  retroBadge: {
    backgroundColor: 'rgba(248,113,113,0.2)',
    borderColor: '#F87171',
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  retroText: {
    color: '#F87171',
    fontSize: 8,
    fontWeight: 'bold',
  },
  dignityBadge: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  dignityText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },

  // Sacred Mantra
  mantraCard: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  mantraLabel: {
    color: Colors.gold[400],
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  mantraText: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 4,
  },
  mantraSub: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    textAlign: 'center',
  },

  readingTheme: {
    color: Colors.gold[400],
    fontSize: FontSize.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },

  sectionTitle: {
    color: Colors.gold[400], fontSize: FontSize.xs, letterSpacing: 2.5,
    textTransform: 'uppercase', textAlign: 'center',
    marginVertical: Spacing.lg,
  },

  frameSwitcher: {
    flexDirection: 'row', gap: Spacing.sm,
    justifyContent: 'center', marginBottom: Spacing.lg,
  },
  frameTab: {
    flex: 1, alignItems: 'center', paddingVertical: Spacing.md,
    borderRadius: Radius.xl, borderWidth: 1,
    borderColor: 'rgba(155,126,255,0.2)',
    backgroundColor: Colors.bg.glass,
  },
  frameIcon:  { fontSize: 22, marginBottom: 4 },
  frameLabel: { color: Colors.text.muted, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },

  readingCard: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius['2xl'], padding: Spacing.xl,
    borderWidth: 1, marginBottom: Spacing.lg,
    ...Shadows.gold,
  },
  readingFrameTitle: { fontSize: FontSize.lg, letterSpacing: 1.5, fontWeight: '700', textAlign: 'center', marginBottom: Spacing.sm },
  readingDivider: { height: 1.5, borderRadius: 2, marginBottom: Spacing.md, opacity: 0.4 },
  readingText: { color: Colors.text.secondary, fontSize: FontSize.base, lineHeight: 24, textAlign: 'center' },

  luckyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center', marginBottom: Spacing.md },

  planetFullWrap: { alignItems: 'center', marginBottom: Spacing.xl },
  planetFull: { width: 140, height: 140 },
  planetName: { fontSize: FontSize.xl, letterSpacing: 3, marginTop: Spacing.sm },

  luckyBtn: {
    borderRadius: Radius.full, paddingVertical: Spacing.md,
    alignItems: 'center', marginBottom: Spacing.lg,
    ...Shadows.gold,
  },
  luckyBtnText: { color: Colors.white, fontSize: FontSize.base, letterSpacing: 1.5, fontWeight: 'bold' },
});

export default ZodiacDetailScreen;
