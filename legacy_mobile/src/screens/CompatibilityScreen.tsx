// ─────────────────────────────────────────────
//  Providence · 36-Guna Compatibility Matchmaker Screen
//  Vedic Ashta Koota Love & Marriage Alignment (Bilingual EN/TE)
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Spacing, Radius, Shadows, FontSize } from '../theme';
import { computeAshtaKoota, CompatibilityAnalysis } from '../engine/compatibility';
import { computeNatalChart } from '../engine/ephemeris';
import { useLanguage } from '../localization';

const { width } = Dimensions.get('window');

const CompatibilityScreen = ({ navigation }: any) => {
  const { language, setLanguage, t } = useLanguage();

  const [name1, setName1] = useState('Partner 1');
  const [name2, setName2] = useState('Partner 2');

  const [dob1, setDob1] = useState<Date>(new Date(1995, 4, 15));
  const [dob2, setDob2] = useState<Date>(new Date(1996, 7, 22));

  const [showPicker1, setShowPicker1] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);

  // Compute charts to extract real Moon Rashi and Nakshatra for both partners
  const chart1 = computeNatalChart(dob1);
  const chart2 = computeNatalChart(dob2);

  const result: CompatibilityAnalysis = computeAshtaKoota(
    chart1.moon.rashiIndex,
    chart1.moon.nakshatraIndex,
    chart2.moon.rashiIndex,
    chart2.moon.nakshatraIndex
  );

  const scoreColor =
    result.totalScore >= 28 ? '#34D399' :
    result.totalScore >= 21 ? '#38BDF8' :
    result.totalScore >= 18 ? '#F5B842' : '#F87171';

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../../image/moving stars.jpg')}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.bgOverlay} />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Top Bar with Back & Language Toggle */}
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
          <Text style={styles.screenTitle}>
            {language === 'te' ? '36 గుణాల దాంపత్య పొంతన' : '36-GUNA COMPATIBILITY'}
          </Text>
          <Text style={styles.screenSub}>
            {language === 'te'
              ? 'ప్రాచీన అష్టకూట వివాహ & ప్రేమ అనుకూలత విశ్లేషణ'
              : 'Vedic Ashta Koota Love & Marriage Alignment'}
          </Text>

          {/* ── Partners Input Cards Row ── */}
          <View style={styles.inputGrid}>
            {/* Partner 1 */}
            <View style={styles.partnerCard}>
              <Text style={styles.partnerLabel}>
                {language === 'te' ? 'మొదటి వ్యక్తి' : 'PARTNER 1'}
              </Text>
              <TextInput
                style={styles.partnerInput}
                value={name1}
                onChangeText={setName1}
                placeholder="Name"
                placeholderTextColor={Colors.text.muted}
              />
              <TouchableOpacity style={styles.dateBtn} onPress={() => setShowPicker1(true)}>
                <Text style={styles.dateBtnText}>
                  🗓 {dob1.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Text>
              </TouchableOpacity>
              <Text style={styles.partnerMoonText}>
                🌙 {chart1.moon.rashiName.slice(0, 8)} · {chart1.moon.nakshatraName}
              </Text>

              {showPicker1 && (
                <DateTimePicker
                  value={dob1}
                  mode="date"
                  display="spinner"
                  onChange={(_, d) => {
                    setShowPicker1(Platform.OS === 'ios');
                    if (d) setDob1(d);
                  }}
                  maximumDate={new Date()}
                  themeVariant="dark"
                />
              )}
            </View>

            {/* Heart in Center */}
            <View style={styles.heartBox}>
              <Text style={styles.heartIcon}>💖</Text>
            </View>

            {/* Partner 2 */}
            <View style={styles.partnerCard}>
              <Text style={styles.partnerLabel}>
                {language === 'te' ? 'రెండవ వ్యక్తి' : 'PARTNER 2'}
              </Text>
              <TextInput
                style={styles.partnerInput}
                value={name2}
                onChangeText={setName2}
                placeholder="Name"
                placeholderTextColor={Colors.text.muted}
              />
              <TouchableOpacity style={styles.dateBtn} onPress={() => setShowPicker2(true)}>
                <Text style={styles.dateBtnText}>
                  🗓 {dob2.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Text>
              </TouchableOpacity>
              <Text style={styles.partnerMoonText}>
                🌙 {chart2.moon.rashiName.slice(0, 8)} · {chart2.moon.nakshatraName}
              </Text>

              {showPicker2 && (
                <DateTimePicker
                  value={dob2}
                  mode="date"
                  display="spinner"
                  onChange={(_, d) => {
                    setShowPicker2(Platform.OS === 'ios');
                    if (d) setDob2(d);
                  }}
                  maximumDate={new Date()}
                  themeVariant="dark"
                />
              )}
            </View>
          </View>

          {/* ── Grand Match Score Banner ── */}
          <View style={[styles.scoreBanner, { borderColor: scoreColor + '88' }]}>
            <Text style={styles.scoreBannerLabel}>
              {language === 'te' ? 'మొత్తం గుణాల ఫలితం' : 'TOTAL MATCH SCORE'}
            </Text>
            <View style={styles.scoreCircle}>
              <Text style={[styles.scoreBigNum, { color: scoreColor }]}>
                {result.totalScore}
              </Text>
              <Text style={styles.scoreOutOf}>/ 36</Text>
            </View>
            <Text style={[styles.ratingTitle, { color: scoreColor }]}>
              {language === 'te' ? result.ratingTe : result.ratingEn}
            </Text>
            <Text style={styles.recommendationText}>
              "{language === 'te' ? result.recommendationTe : result.recommendationEn}"
            </Text>
          </View>

          {/* ── Dosha & Remedy Banner ── */}
          <View style={styles.doshaCard}>
            <View style={styles.doshaRow}>
              <Text style={styles.doshaIcon}>
                {result.doshas.nadiDosha ? '⚠️' : '🛡️'}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.doshaTitle, { color: result.doshas.nadiDosha ? '#F59E0B' : '#34D399' }]}>
                  {language === 'te'
                    ? (result.doshas.nadiDosha ? 'నాడీ దోషం: ఉంది (పరిహారాలు శ్రేయస్కరం)' : 'నాడీ దోషం: లేదు (సంపూర్ణ క్లియర్)')
                    : (result.doshas.nadiDosha ? 'Nadi Status: Active (Remedies Advised)' : 'Nadi Status: Clear (0% Dosha)')}
                </Text>
                <Text style={styles.doshaDesc}>
                  {result.doshas.nadiDosha
                    ? (language === 'te' ? 'రెండు నక్షత్ర పాదాలు లేదా అధిపతులు వేరుగా ఉంటే దోష ప్రభావం చాలా వరకు తగ్గిపోతుంది.' : 'Different Nakshatra Padas naturally neutralize physiological friction.')
                    : (language === 'te' ? 'వంశాభివృద్ధి, ఆరోగ్యానికి ఉత్తమమైన గ్రహ సంకేతం.' : 'Excellent genetic and vitality resonance for a joyful future.')}
                </Text>
              </View>
            </View>
          </View>

          {/* ── 8 Kootas Detailed Breakdown ── */}
          <Text style={styles.sectionTitle}>
            {language === 'te' ? '⬡ అష్టకూట గుణాల సమగ్ర వివరాలు ⬡' : '⬡ 8 KOOTAS COMPATIBILITY BREAKDOWN ⬡'}
          </Text>

          {result.kootas.map((koota, idx) => {
            const kColor =
              koota.status === 'excellent' ? '#34D399' :
              koota.status === 'good' ? '#38BDF8' :
              koota.status === 'average' ? '#F5B842' : '#F87171';
            const kName = language === 'te' ? koota.nameTe : koota.name;
            const kMeaning = language === 'te' ? koota.meaningTe : koota.meaningEn;

            return (
              <View key={idx} style={[styles.kootaCard, { borderColor: kColor + '44' }]}>
                <View style={styles.kootaHeader}>
                  <Text style={styles.kootaName}>{kName}</Text>
                  <View style={[styles.kootaBadge, { borderColor: kColor }]}>
                    <Text style={[styles.kootaScoreText, { color: kColor }]}>
                      {koota.obtainedPoints} / {koota.maxPoints}
                    </Text>
                  </View>
                </View>

                {/* Bar */}
                <View style={styles.kootaBarBg}>
                  <View
                    style={[
                      styles.kootaBarFill,
                      {
                        width: `${(koota.obtainedPoints / koota.maxPoints) * 100}%`,
                        backgroundColor: kColor,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.kootaMeaningText}>{kMeaning}</Text>
              </View>
            );
          })}

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
    letterSpacing: 2, fontWeight: 'bold', textAlign: 'center',
  },
  screenSub: {
    color: Colors.gold[400], fontSize: FontSize.xs,
    letterSpacing: 0.5, textAlign: 'center', marginBottom: Spacing.lg,
  },

  // Input Grid
  inputGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  partnerCard: {
    flex: 1,
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(155,126,255,0.25)',
    alignItems: 'center',
  },
  partnerLabel: {
    color: Colors.gold[400],
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  partnerInput: {
    color: Colors.text.primary,
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 2,
    marginBottom: 6,
    width: '100%',
  },
  dateBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: Radius.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  dateBtnText: {
    color: Colors.text.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  partnerMoonText: {
    color: Colors.text.secondary,
    fontSize: 9,
    marginTop: 2,
  },
  heartBox: {
    paddingHorizontal: 6,
  },
  heartIcon: {
    fontSize: 22,
  },

  // Score Banner
  scoreBanner: {
    backgroundColor: 'rgba(25, 20, 55, 0.9)',
    borderRadius: Radius['2xl'],
    padding: Spacing.xl,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.gold,
  },
  scoreBannerLabel: {
    color: Colors.gold[400],
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  scoreBigNum: {
    fontSize: 54,
    fontWeight: 'bold',
  },
  scoreOutOf: {
    color: Colors.text.muted,
    fontSize: FontSize.lg,
    marginLeft: 4,
  },
  ratingTitle: {
    fontSize: FontSize.base,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  recommendationText: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Dosha Card
  doshaCard: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: Spacing.lg,
  },
  doshaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doshaIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  doshaTitle: {
    fontSize: FontSize.xs,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  doshaDesc: {
    color: Colors.text.secondary,
    fontSize: 10,
    lineHeight: 14,
  },

  // Section Title
  sectionTitle: {
    color: Colors.gold[400],
    fontSize: FontSize.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  // Koota Card
  kootaCard: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  kootaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  kootaName: {
    color: Colors.text.primary,
    fontSize: FontSize.sm,
    fontWeight: 'bold',
  },
  kootaBadge: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
  kootaScoreText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  kootaBarBg: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  kootaBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  kootaMeaningText: {
    color: Colors.text.secondary,
    fontSize: 10,
    lineHeight: 14,
  },
});

export default CompatibilityScreen;
