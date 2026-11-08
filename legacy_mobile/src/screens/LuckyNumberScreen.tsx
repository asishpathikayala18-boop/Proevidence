// ─────────────────────────────────────────────
//  Providence · Lucky Number Screen v2.1
//  Dual Numerology + Bilingual Telugu & Simple English
// ─────────────────────────────────────────────
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Colors, Spacing, Radius, Shadows, FontSize } from '../theme';
import { ZodiacSign } from '../theme/zodiac';
import { computeNumerology, NumerologyProfile } from '../engine/numerology';
import { useLanguage } from '../localization';

const { width } = Dimensions.get('window');

const LIFE_PATH_TITLES: Record<number, { titleEn: string; titleTe: string; keywordEn: string; keywordTe: string }> = {
  1:  { titleEn: 'The Leader', titleTe: 'సహజ నాయకుడు (Leader)', keywordEn: 'INDEPENDENCE', keywordTe: 'స్వతంత్ర నాయకత్వం' },
  2:  { titleEn: 'The Peacemaker', titleTe: 'శాంతికాముకుడు (Peacemaker)', keywordEn: 'HARMONY', keywordTe: 'స్నేహం & సామరస్యం' },
  3:  { titleEn: 'The Creative Muse', titleTe: 'సృజనాత్మక ప్రతిభావంతుడు', keywordEn: 'EXPRESSION', keywordTe: 'కళా నైపుణ్యం' },
  4:  { titleEn: 'The Master Builder', titleTe: 'నిర్మాత & క్రమశిక్షణాపరుడు', keywordEn: 'STABILITY', keywordTe: 'స్థిరత్వం & పట్టుదల' },
  5:  { titleEn: 'The Free Spirit', titleTe: 'ఆకర్షణీయ ధైర్యశాలి (Maverick)', keywordEn: 'FREEDOM', keywordTe: 'స్వేచ్ఛ & బహుముఖ ప్రజ్ఞ' },
  6:  { titleEn: 'The Cosmic Nurturer', titleTe: 'ప్రేమాభిమానాల నిధి', keywordEn: 'COMPASSION', keywordTe: 'కుటుంబ రక్షకుడు' },
  7:  { titleEn: 'The Mystic Seeker', titleTe: 'జ్ఞాని & ఆధ్యాత్మిక అన్వేషకుడు', keywordEn: 'TRUTH', keywordTe: 'సత్య శోధన & వివేకం' },
  8:  { titleEn: 'The Authority of Wealth', titleTe: 'సంపద & అధికార శక్తి', keywordEn: 'ABUNDANCE', keywordTe: 'విజయం & పరిపాలన' },
  9:  { titleEn: 'The Universal Sage', titleTe: 'విశ్వ హితైషి (Universal Sage)', keywordEn: 'TRANSCENDENCE', keywordTe: 'విశ్వ ప్రేమ & త్యాగం' },
  11: { titleEn: 'Master Illuminator', titleTe: 'మాస్టర్ నంబర్ 11: జ్ఞానజ్యోతి', keywordEn: 'SPIRITUAL LIGHT', keywordTe: 'దైవ ప్రకాశం' },
  22: { titleEn: 'Master Architect', titleTe: 'మాస్టర్ నంబర్ 22: యుగ నిర్మాత', keywordEn: 'LEGACY & EMPIRE', keywordTe: 'సామ్రాజ్య నిర్మాణం' },
  33: { titleEn: 'Master Healer', titleTe: 'మాస్టర్ నంబర్ 33: పరమ గురువు', keywordEn: 'DIVINE BLESSING', keywordTe: 'దైవిక ఆశీస్సులు' },
};

const LUCKY_DAY_VIBES_TE: Record<string, string> = {
  Sunday:    'సూర్య భగవానుడి అనుగ్రహం — ఆత్మవిశ్వాసం, ధైర్యంతో కూడిన పనులు విజయవంతం అవుతాయి.',
  Monday:    'చంద్రుని కరుణ — ప్రశాంత మనస్సు, సృజనాత్మక ఆలోచనలకు చాలా అనుకూలం.',
  Tuesday:   'కుజ బలం — శౌర్యం, కఠినమైన నిర్ణయాలు తీసుకోవడానికి అత్యుత్తమ దినం.',
  Wednesday: 'బుధ బుద్ధి — వ్యాపారం, విద్య, సంభాషణలు మరియు కొత్త ప్రారంభాలకు శుభం.',
  Thursday:  'గురు అనుగ్రహం — శుభకార్యాలు, ఆధ్యాత్మిక పనులు, పెద్దల ఆశీస్సులకు విశేషం.',
  Friday:    'శుక్ర వైభవం — కళలు, విలాసం, లక్ష్మీదేవి పూజ, సంపద వృద్ధికి అనుకూలం.',
  Saturday:  'శని న్యాయం — ఏకాగ్రత, పట్టుదల, కష్టపడి పనిచేసే వారికి తిరుగులేని ఫలితాలు.',
};

const LuckyNumberScreen = ({ route, navigation }: any) => {
  const { sign, dob, name }: { sign: ZodiacSign; dob?: Date | string; name?: string } = route.params;
  const { language, setLanguage, t } = useLanguage();

  const dobDate = dob ? new Date(dob) : new Date(1995, 0, 1);

  // Compute dual numerology
  const numerology: NumerologyProfile = computeNumerology(dobDate, name || '');

  const lpMeta = LIFE_PATH_TITLES[numerology.lifePath] || LIFE_PATH_TITLES[1];

  // Animated number reveal
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim  = useRef(new Animated.Value(0.5)).current;
  const [displayNum, setDisplayNum] = useState(0);

  useEffect(() => {
    let frame = 0;
    const target = numerology.lifePath;
    const interval = setInterval(() => {
      frame++;
      setDisplayNum(Math.floor(Math.random() * 9) + 1);
      if (frame >= 18) {
        clearInterval(interval);
        setDisplayNum(target);
        Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }).start();
      }
    }, 70);

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    return () => clearInterval(interval);
  }, [numerology.lifePath]);

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../../image/moving stars.jpg')}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.bgOverlay} />

        {/* Decorative planets */}
        <Image source={require('../../image/planets/Jupiter .jpg')} style={styles.decoPlanet1} resizeMode="contain" />
        <Image source={require('../../image/planets/uranus.jpg')} style={styles.decoPlanet2} resizeMode="contain" />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Back & Language Row */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>{t.back}</Text>
            </TouchableOpacity>

            <View style={styles.langPillWrap}>
              <TouchableOpacity
                style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
                onPress={() => setLanguage('en')}
              >
                <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langBtn, language === 'te' && styles.langBtnActive]}
                onPress={() => setLanguage('te')}
              >
                <Text style={[styles.langText, language === 'te' && styles.langTextActive]}>తె</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.screenTitle}>{t.numerologyTitle}</Text>
          <Text style={styles.screenSub}>{t.numerologySub}</Text>

          {/* ── Cross-Validation Agreement Banner ── */}
          <View style={styles.crossBanner}>
            <View style={styles.crossScoreBadge}>
              <Text style={styles.crossScoreNum}>{numerology.crossConfidence}%</Text>
              <Text style={styles.crossScoreLabel}>{language === 'te' ? 'పొందిక' : 'HARMONY'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <Text style={styles.crossTitle}>
                {language === 'te' ? '✦ రెండు పద్ధతుల సంపూర్ణ ఏకీభావం' : '✦ DUAL SYSTEM ALIGNMENT'}
              </Text>
              <Text style={styles.crossSub}>
                {language === 'te'
                  ? `పైథాగరస్ సంఖ్య (${numerology.lifePath}) మరియు చాల్డియన్ నామ సంఖ్య (${numerology.chaldeanCompound}) పరస్పరం సరిపోయాయి.`
                  : `Pythagoras (${numerology.lifePath}) cross-checked with Ancient Chaldean (${numerology.chaldeanCompound})`}
              </Text>
            </View>
          </View>

          {/* ── Master Number Banner if present ── */}
          {numerology.masterNumber && (
            <View style={styles.masterAlertBanner}>
              <Text style={styles.masterAlertIcon}>👑</Text>
              <Text style={styles.masterAlertText}>
                {language === 'te'
                  ? `అరుదైన మాస్టర్ నంబర్ ${numerology.lifePath}! ఇది దైవిక శక్తి, సమాజానికి మార్గదర్శనం చేసే ఉన్నతమైన విధిని సూచిస్తుంది.`
                  : `MASTER NUMBER ${numerology.lifePath} ACTIVE · Rare spiritual destiny and higher dimensional frequency.`}
              </Text>
            </View>
          )}

          {/* ── Life Path Number (Pythagorean) ── */}
          <View style={[styles.mainCard, { borderColor: sign.color + '66' }]}>
            <Text style={styles.mainCardLabel}>{t.lifePathTitle}</Text>

            <Animated.View style={[styles.numCircleOuter, { opacity: glowAnim, borderColor: sign.color + 'AA' }]}>
              <View style={[styles.numCircleInner, { backgroundColor: sign.color + '25' }]}>
                <Animated.Text style={[styles.numDisplay, { color: sign.color, transform: [{ scale: scaleAnim }] }]}>
                  {displayNum}
                </Animated.Text>
              </View>
            </Animated.View>

            <Text style={[styles.pathTitle, { color: sign.color }]}>
              {language === 'te' ? lpMeta.titleTe : lpMeta.titleEn}
            </Text>
            <Text style={styles.pathKeyword}>
              ✦ {language === 'te' ? lpMeta.keywordTe : lpMeta.keywordEn} ✦
            </Text>
            <Text style={styles.pathMeaning}>{numerology.lifePathMeaning}</Text>

            <View style={styles.powerMetaRow}>
              <View style={styles.powerPill}>
                <Text style={styles.powerPillLabel}>{t.powerNumber}</Text>
                <Text style={[styles.powerPillNum, { color: sign.color }]}>{numerology.powerNumber}</Text>
              </View>
              <View style={styles.powerPill}>
                <Text style={styles.powerPillLabel}>{t.karmaNumber}</Text>
                <Text style={[styles.powerPillNum, { color: Colors.gold[400] }]}>{numerology.karmaNumber}</Text>
              </View>
            </View>
          </View>

          {/* ── Chaldean Sacred Compound Vibration ── */}
          <View style={styles.chaldeanCard}>
            <Text style={styles.chaldeanHeader}>{t.chaldeanTitle}</Text>
            <View style={styles.chaldeanRow}>
              <View style={styles.chaldeanNumBox}>
                <Text style={styles.chaldeanCompoundNum}>{numerology.chaldeanCompound}</Text>
                <Text style={styles.chaldeanSingleNum}>
                  {language === 'te' ? 'జన్మ:' : 'Birth:'} {numerology.chaldeanBirth}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={styles.chaldeanNameText}>
                  {name ? `"${name}"` : (language === 'te' ? 'నామ సంఖ్యా బలం' : 'Cosmic Signature')}
                </Text>
                <Text style={styles.chaldeanVibrationText}>
                  {language === 'te'
                    ? `బాబిలోనియన్ సంఖ్యా బలం: స్థాయి ${numerology.chaldeanCompound}`
                    : `Ancient Babylonian Vibration: Level ${numerology.chaldeanCompound}`}
                </Text>
              </View>
            </View>
            <Text style={styles.chaldeanDesc}>
              {language === 'te'
                ? `చాల్డియన్ సంఖ్యాశాస్త్రంలో ${numerology.chaldeanCompound} సంఖ్య మీ సంపద, పేరుప్రతిష్టలు, గౌరవాన్ని నియంత్రించే గుప్త శక్తిని సూచిస్తుంది.`
                : `In sacred Chaldean numerology, compound number ${numerology.chaldeanCompound} unlocks the unseen karmic forces governing material prosperity and leadership.`}
            </Text>
          </View>

          {/* ── Personal Cycles (Year · Month · Day) ── */}
          <Text style={styles.sectionTitle}>{t.personalCycles}</Text>
          <View style={styles.cycleGrid}>
            <View style={[styles.cycleCard, { borderColor: sign.color + '55' }]}>
              <Text style={styles.cycleLabel}>{t.personalYear}</Text>
              <Text style={[styles.cycleNum, { color: sign.color }]}>{numerology.personalYear}</Text>
              <Text style={styles.cycleTheme}>{numerology.personalYearMeaning}</Text>
            </View>
            <View style={[styles.cycleCard, { borderColor: sign.color + '55' }]}>
              <Text style={styles.cycleLabel}>{t.personalMonth}</Text>
              <Text style={[styles.cycleNum, { color: sign.color }]}>{numerology.personalMonth}</Text>
              <Text style={styles.cycleTheme}>
                {language === 'te' ? 'ఈ నెల అభివృద్ధి' : 'Monthly Focus Cycle'}
              </Text>
            </View>
            <View style={[styles.cycleCard, { borderColor: sign.color + '55' }]}>
              <Text style={styles.cycleLabel}>{t.personalDay}</Text>
              <Text style={[styles.cycleNum, { color: sign.color }]}>{numerology.personalDay}</Text>
              <Text style={styles.cycleTheme}>
                {language === 'te' ? 'నేటి అనుకూలత' : 'Daily Cosmic Rhythm'}
              </Text>
            </View>
          </View>

          {/* ── Resonant Numbers ── */}
          <Text style={styles.sectionTitle}>⟡ {language === 'te' ? 'మీ అదృష్ట సంఖ్యలు' : 'HARMONIC RESONANT NUMBERS'}</Text>
          <View style={styles.luckyNumRow}>
            {numerology.luckyNumbers.map((num) => (
              <View
                key={num}
                style={[styles.luckyNumBall, { borderColor: sign.color, backgroundColor: sign.color + '20' }]}
              >
                <Text style={[styles.luckyNumText, { color: sign.color }]}>{num}</Text>
              </View>
            ))}
          </View>

          {/* ── Lucky Day ── */}
          <Text style={styles.sectionTitle}>⟡ {language === 'te' ? 'అత్యుత్తమ వారం & బలం' : 'POWER DAY & VIBRATION'}</Text>
          <View style={[styles.luckyDayCard, { borderColor: sign.color + '55' }]}>
            <Text style={styles.luckyDayEmoji}>📅</Text>
            <Text style={[styles.luckyDayName, { color: sign.color }]}>{sign.lucky.days[0]}</Text>
            <Text style={styles.luckyDayVibe}>
              {language === 'te'
                ? (LUCKY_DAY_VIBES_TE[sign.lucky.days[0]] || 'ఈ రోజు మీ గ్రహ బలం అత్యున్నతంగా ఉంటుంది.')
                : 'A day of supreme cosmic alignment and auspicious focus.'}
            </Text>
          </View>

          {/* ── Gemstone & Color Harmony ── */}
          <Text style={styles.sectionTitle}>⟡ {language === 'te' ? 'రత్నం & రంగుల అనుకూలత' : 'POWER GEMSTONE & COLORS'}</Text>
          <View style={[styles.gemCard, { borderColor: sign.color + '55' }]}>
            <Text style={styles.gemIcon}>💎</Text>
            <Text style={[styles.gemName, { color: sign.color }]}>{sign.lucky.gemstone}</Text>
            <Text style={styles.gemDesc}>
              {language === 'te'
                ? `${sign.lucky.gemstone} రత్నాన్ని ధరించడం వల్ల మీ ఆరా శుద్ధి అయి, మీ జీవిత గమ్య సంఖ్య ${numerology.lifePath} కి తగిన అదృష్ట శక్తి ఆకర్షింపబడుతుంది.`
                : `Carrying or wearing ${sign.lucky.gemstone} aligns your electromagnetic aura with your Life Path vibration ${numerology.lifePath}.`}
            </Text>
          </View>

          <View style={styles.colorRow}>
            {sign.lucky.colors.map(c => (
              <View key={c} style={[styles.colorChip, { borderColor: sign.color + '55' }]}>
                <Text style={[styles.colorChipText, { color: sign.color }]}>{c}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: Spacing['4xl'] }} />
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg.void },
  bg:   { flex: 1 },
  bgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5,5,20,0.85)' },
  scroll: { paddingHorizontal: Spacing.base, paddingTop: Spacing['2xl'] },

  decoPlanet1: { position: 'absolute', top: 40, right: -40, width: 140, height: 140, opacity: 0.25 },
  decoPlanet2: { position: 'absolute', bottom: 100, left: -40, width: 130, height: 130, opacity: 0.2 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backBtn: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(155,126,255,0.3)',
  },
  backText: { color: Colors.text.primary, fontSize: FontSize.sm },

  langPillWrap: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: Radius.full,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(232,160,32,0.4)',
  },
  langBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  langBtnActive: { backgroundColor: Colors.gold[500] },
  langText: { color: Colors.text.muted, fontSize: 10, fontWeight: 'bold' },
  langTextActive: { color: Colors.bg.void },

  screenTitle: {
    color: Colors.text.primary, fontSize: FontSize['2xl'],
    letterSpacing: 3, fontWeight: 'bold', textAlign: 'center',
  },
  screenSub: {
    color: Colors.gold[400], fontSize: FontSize.xs,
    letterSpacing: 1, textAlign: 'center', marginBottom: Spacing.lg,
  },

  crossBanner: {
    backgroundColor: 'rgba(30, 25, 60, 0.9)',
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(232,160,32,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.gold,
  },
  crossScoreBadge: {
    backgroundColor: 'rgba(232,160,32,0.15)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.gold[500],
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  crossScoreNum: {
    color: Colors.gold[300],
    fontSize: FontSize.xl,
    fontWeight: 'bold',
  },
  crossScoreLabel: {
    color: Colors.gold[400],
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  crossTitle: {
    color: Colors.gold[400],
    fontSize: FontSize.xs,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 2,
  },
  crossSub: {
    color: Colors.text.secondary,
    fontSize: 10,
    lineHeight: 14,
  },

  masterAlertBanner: {
    backgroundColor: 'rgba(232,160,32,0.18)',
    borderWidth: 1,
    borderColor: Colors.gold[500],
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  masterAlertIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  masterAlertText: {
    color: Colors.gold[300],
    fontSize: FontSize.xs,
    fontWeight: 'bold',
    flex: 1,
    lineHeight: 18,
  },

  mainCard: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius['2xl'],
    borderWidth: 1.5,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.gold,
  },
  mainCardLabel: {
    color: Colors.gold[400], fontSize: FontSize.xs,
    letterSpacing: 2, textTransform: 'uppercase', marginBottom: Spacing.md,
  },
  numCircleOuter: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  numCircleInner: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center',
  },
  numDisplay: { fontSize: 52, fontWeight: 'bold' },

  pathTitle: { fontSize: FontSize.xl, fontWeight: 'bold', letterSpacing: 1, marginBottom: 2, textAlign: 'center' },
  pathKeyword: { color: Colors.gold[400], fontSize: FontSize.xs, letterSpacing: 2, marginBottom: Spacing.sm },
  pathMeaning: { color: Colors.text.secondary, fontSize: FontSize.sm, lineHeight: 22, textAlign: 'center' },

  powerMetaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  powerPill: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  powerPillLabel: {
    color: Colors.text.muted,
    fontSize: 8,
    letterSpacing: 1,
    marginBottom: 2,
  },
  powerPillNum: {
    fontSize: FontSize.base,
    fontWeight: 'bold',
  },

  // Chaldean Card
  chaldeanCard: {
    backgroundColor: 'rgba(30,22,60,0.85)',
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(232,160,32,0.4)',
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.gold,
  },
  chaldeanHeader: {
    color: Colors.gold[400],
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  chaldeanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  chaldeanNumBox: {
    backgroundColor: 'rgba(232,160,32,0.15)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.gold[500],
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  chaldeanCompoundNum: {
    color: Colors.gold[300],
    fontSize: FontSize.xl,
    fontWeight: 'bold',
  },
  chaldeanSingleNum: {
    color: Colors.gold[400],
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  chaldeanNameText: {
    color: Colors.text.primary,
    fontSize: FontSize.base,
    fontWeight: 'bold',
  },
  chaldeanVibrationText: {
    color: Colors.gold[400],
    fontSize: FontSize.xs,
    fontStyle: 'italic',
  },
  chaldeanDesc: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
    lineHeight: 18,
  },

  // Cycles
  cycleGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  cycleCard: {
    flex: 1,
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.md,
    alignItems: 'center',
  },
  cycleLabel: {
    color: Colors.text.muted,
    fontSize: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 4,
  },
  cycleNum: {
    fontSize: FontSize['2xl'],
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cycleTheme: {
    color: Colors.text.primary,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 14,
  },

  sectionTitle: {
    color: Colors.gold[400], fontSize: FontSize.xs, letterSpacing: 2.5,
    textTransform: 'uppercase', textAlign: 'center',
    marginBottom: Spacing.md, marginTop: Spacing.sm,
  },
  luckyNumRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  luckyNumBall: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
    ...Shadows.gold,
  },
  luckyNumText: { fontSize: FontSize.lg, fontWeight: 'bold' },

  luckyDayCard: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl, borderWidth: 1,
    padding: Spacing.lg, alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  luckyDayEmoji: { fontSize: 32, marginBottom: 4 },
  luckyDayName:  { fontSize: FontSize.xl, fontWeight: 'bold', letterSpacing: 2, marginBottom: 4 },
  luckyDayVibe:  { color: Colors.text.secondary, fontSize: FontSize.xs, textAlign: 'center' },

  gemCard: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl, borderWidth: 1,
    padding: Spacing.lg, alignItems: 'center',
    marginBottom: Spacing.md,
  },
  gemIcon: { fontSize: 32, marginBottom: 4 },
  gemName: { fontSize: FontSize.lg, fontWeight: 'bold', letterSpacing: 2, marginBottom: 4 },
  gemDesc: { color: Colors.text.secondary, fontSize: FontSize.xs, textAlign: 'center', lineHeight: 18 },

  colorRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  colorChip: {
    borderRadius: Radius.full, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: 6,
    backgroundColor: Colors.bg.glass,
  },
  colorChipText: { fontSize: FontSize.xs, letterSpacing: 1 },
});

export default LuckyNumberScreen;
