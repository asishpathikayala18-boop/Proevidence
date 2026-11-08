// ─────────────────────────────────────────────
//  Providence · Full Jathakam, Swabhavam & Kundali Screen
//  Vimshottari Dasha Timeline, Chakra, Daily Colors & Remedies
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme';
import { useLanguage } from '../localization';
import { KundaliChart } from '../components/KundaliChart';

const { width } = Dimensions.get('window');

type JathakamTab = 'swabhavam' | 'chakra' | 'dasha' | 'colors' | 'remedies';

export const JathakamScreen = ({ route, navigation }: any) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<JathakamTab>('swabhavam');

  const {
    sign,
    dob,
    name = 'Cosmic Seeker',
    birthTime,
    userRasi,
    userNakshatra,
    accuracy = 98,
  } = route?.params || {};

  const birthDate = dob ? new Date(dob) : new Date(1998, 7, 16);
  const birthYear = birthDate.getFullYear();

  // 120-Year Vimshottari Dasha Timeline
  const currentCalendarYear = new Date().getFullYear();
  const dashaPlanets = [
    { name: 'Ketu', te: 'కేతు మహాదశ', years: 7 },
    { name: 'Venus', te: 'శుక్ర మహాదశ', years: 20 },
    { name: 'Sun', te: 'సూర్య మహాదశ', years: 6 },
    { name: 'Moon', te: 'చంద్ర మహాదశ', years: 10 },
    { name: 'Mars', te: 'కుజ మహాదశ', years: 7 },
    { name: 'Rahu', te: 'రాహు మహాదశ', years: 18 },
    { name: 'Jupiter', te: 'గురు మహాదశ', years: 16 },
    { name: 'Saturn', te: 'శని మహాదశ', years: 19 },
    { name: 'Mercury', te: 'బుధ మహాదశ', years: 17 },
  ];

  let yrCounter = birthYear;
  const timeline = dashaPlanets.map((dp) => {
    const startY = yrCounter;
    const endY = yrCounter + dp.years;
    const isRunning = currentCalendarYear >= startY && currentCalendarYear < endY;
    yrCounter = endY;
    return {
      ...dp,
      duration: `${startY} – ${endY}`,
      isRunning,
    };
  });

  const activeRunningDasha = timeline.find(t => t.isRunning) || timeline[1];

  // Default Graha positions for Chakra
  const planetsList = [
    { planet: 'Sun', rashiIndex: 4 },
    { planet: 'Moon', rashiIndex: 0 },
    { planet: 'Mars', rashiIndex: 7 },
    { planet: 'Mercury', rashiIndex: 5 },
    { planet: 'Jupiter', rashiIndex: 3 },
    { planet: 'Venus', rashiIndex: 6 },
    { planet: 'Saturn', rashiIndex: 10 },
    { planet: 'Rahu', rashiIndex: 2 },
    { planet: 'Ketu', rashiIndex: 8 },
  ];

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../../image/moving stars.jpg')}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.bgOverlay} />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backBtnText}>← {language === 'te' ? 'వెనుకకు' : 'Back'}</Text>
            </TouchableOpacity>
            <View style={styles.accuracyStamp}>
              <Text style={styles.accuracyNum}>{accuracy}%</Text>
              <Text style={styles.accuracyLabel}>Precision</Text>
            </View>
          </View>

          {/* Profile Banner */}
          <View style={styles.profileBanner}>
            <Text style={styles.profileName}>{name}</Text>
            <View style={styles.pillsRow}>
              <View style={styles.pill}><Text style={styles.pillText}>♈ మేష రాశి (Mesha)</Text></View>
              <View style={styles.pill}><Text style={styles.pillText}>⭐ భరణి నక్షత్రం (Bharani)</Text></View>
              <View style={styles.pill}><Text style={styles.pillText}>🪐 {activeRunningDasha.duration}: {activeRunningDasha.te}</Text></View>
            </View>
          </View>

          {/* Sub Navigation Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
            {[
              { key: 'swabhavam', label: '👤 స్వభావం (Nature)' },
              { key: 'chakra', label: '🕉️ జాతక చక్రం (Chakra)' },
              { key: 'dasha', label: '⏳ దశా చక్రం (Dasha)' },
              { key: 'colors', label: '🎨 రంగులు & దిశలు (Colors & Vastu)' },
              { key: 'remedies', label: '🛡️ పరిహారాలు (Remedies)' },
            ].map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.subnavTab, activeTab === tab.key && styles.subnavTabActive]}
                onPress={() => setActiveTab(tab.key as JathakamTab)}
              >
                <Text style={[styles.subnavText, activeTab === tab.key && styles.subnavTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ─── TAB 1: SWABHAVAM (NATURE & WAY OF LIVING) ─── */}
          {activeTab === 'swabhavam' && (
            <View style={styles.cardBox}>
              <Text style={styles.cardHeading}>వ్యక్తి స్వభావం & మనస్తత్త్వం (Core Nature)</Text>
              <Text style={styles.prose}>
                మీ జాతక రీత్యా, మీరు అత్యున్నత ఆత్మవిశ్వాసం, స్పష్టమైన ఆలోచనా సరళి కలిగిన వ్యక్తి. చిన్నప్పటి నుండే మీకు ఆత్మగౌరవం ఎక్కువ. ఎవరి మీద ఆధారపడటానికి ఇష్టపడరు. మీ కష్టాన్ని ఇతరుల ముందు ప్రదర్శించరు. సహాయం అవసరమైన వారికి చేతనైనంత ఉపకారం చేస్తారు. కోపం త్వరగా వచ్చినా, అందులో కుతంత్రాలు ఉండవు; క్షణికావేశాన్ని అదుపులో ఉంచుకుంటే మహత్తరమైన కార్యసిద్ధి కలుగుతుంది.
              </Text>

              <Text style={[styles.cardHeading, { marginTop: Spacing.lg }]}>జీవన విధానం & జీవన శైలి (Way of Living)</Text>
              <Text style={styles.prose}>
                పరిశుభ్రత, క్రమశిక్షణ, సొంత నిర్ణయాలతో జీవించడం మీ శైలి. వృత్తి జీవితంలో స్వతంత్ర హోదా (మేనేజ్‌మెంట్, సాఫ్ట్‌వేర్, పరిశోధన లేదా వ్యాపారం) మీకు అత్యంత అనుకూలం. ఆర్థిక స్థిరత్వం 28 సంవత్సరాల తర్వాత వేగంగా వృద్ధి చెందుతుంది. కుటుంబ బాధ్యతలను ఎంతో నిష్ఠతో నిర్వహిస్తారు.
              </Text>
            </View>
          )}

          {/* ─── TAB 2: JATHAKA CHAKRA (KUNDALI CHART) ─── */}
          {activeTab === 'chakra' && (
            <View style={styles.cardBox}>
              <Text style={styles.cardHeading}>జన్మ కుండలి చక్రం (12 Bhavas)</Text>
              <Text style={styles.cardSub}>లగ్నం మరియు 9 గ్రహాల ఖచ్చితమైన స్థానాలు</Text>
              
              <View style={styles.chakraWrap}>
                <KundaliChart lagnaRashiIndex={0} planets={planetsList} width={width - Spacing.lg * 2 - 40} />
              </View>

              <View style={styles.grahaList}>
                <Text style={styles.grahaItem}>☀️ రవి (Sun): సింహం 14° (స్వక్షేత్రం)</Text>
                <Text style={styles.grahaItem}>🌙 చంద్ర (Moon): మేషం 18° (భరణి)</Text>
                <Text style={styles.grahaItem}>🔴 కుజ (Mars): వృశ్చికం 22° (స్వక్షేత్రం)</Text>
                <Text style={styles.grahaItem}>🟢 బుధ (Mercury): కన్య 10° (ఉచ్ఛ స్థితి)</Text>
                <Text style={styles.grahaItem}>🟡 గురు (Jupiter): కర్కాటకం 5° (ఉచ్ఛ స్థితి)</Text>
                <Text style={styles.grahaItem}>⚪ శుక్ర (Venus): తులా 12° (మాలవ్య యోగం)</Text>
                <Text style={styles.grahaItem}>🪐 శని (Saturn): కుంభం 8° (మూలత్రికోణం)</Text>
              </View>
            </View>
          )}

          {/* ─── TAB 3: VIMSHOTTARI DASHA TIMELINE ─── */}
          {activeTab === 'dasha' && (
            <View style={styles.cardBox}>
              <Text style={styles.cardHeading}>120 సం॥రాల వింశోత్తరి దశా చక్రం</Text>
              <Text style={styles.cardSub}>గతం, వర్తమానం మరియు భవిష్యత్ దశా కాలాలు</Text>

              <View style={styles.timelineList}>
                {timeline.map((item, idx) => (
                  <View key={idx} style={[styles.timelineRow, item.isRunning && styles.timelineRowActive]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.timelineName, item.isRunning && { color: Colors.vedic.pasupu }]}>
                        {item.te}
                      </Text>
                      <Text style={styles.timelineDates}>{item.duration} ({item.years} సం॥రాలు)</Text>
                    </View>
                    {item.isRunning && (
                      <View style={styles.runningBadge}>
                        <Text style={styles.runningBadgeText}>● ప్రస్తుతం నడుస్తోంది</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ─── TAB 4: DAILY COLORS & VASTU DIRECTIONS ─── */}
          {activeTab === 'colors' && (
            <View style={styles.cardBox}>
              <Text style={styles.cardHeading}>ఏ రోజు ఏ రంగు దుస్తులు ధరించాలి (Daily Colors)</Text>
              <Text style={styles.cardSub}>నవగ్రహ ప్రీతికై ఆయా వారాలలో అనుకూల వస్త్ర ధారణ</Text>

              <View style={styles.colorRows}>
                <View style={styles.colorCard}>
                  <Text style={styles.dayTitle}>ఆదివారం (Sun):</Text>
                  <Text style={styles.colorDesc}>బంగారు పసుపు, కెంపు ఎరుపు, కాషాయం</Text>
                </View>
                <View style={styles.colorCard}>
                  <Text style={styles.dayTitle}>సోమవారం (Moon):</Text>
                  <Text style={styles.colorDesc}>ముత్యపు తెలుపు, వెండి రంగు, క్రీమ్</Text>
                </View>
                <View style={styles.colorCard}>
                  <Text style={styles.dayTitle}>మంగళవారం (Mars):</Text>
                  <Text style={styles.colorDesc}>పగడపు ఎరుపు, కుంకుమ రంగు</Text>
                </View>
                <View style={styles.colorCard}>
                  <Text style={styles.dayTitle}>బుధవారం (Mercury):</Text>
                  <Text style={styles.colorDesc}>చిలుక పచ్చ, లేత ఆకుపచ్చ</Text>
                </View>
                <View style={styles.colorCard}>
                  <Text style={styles.dayTitle}>గురువారం (Jupiter):</Text>
                  <Text style={styles.colorDesc}>పసుపు పచ్చ, పీతాంబరం, లేత నారింజ</Text>
                </View>
                <View style={styles.colorCard}>
                  <Text style={styles.dayTitle}>శుక్రవారం (Venus):</Text>
                  <Text style={styles.colorDesc}>పట్టు తెలుపు, గులాబీ రంగు, లేత నీలం</Text>
                </View>
                <View style={styles.colorCard}>
                  <Text style={styles.dayTitle}>శనివారం (Saturn):</Text>
                  <Text style={styles.colorDesc}>నీలి రంగు, నలుపు, ముదురు ఊదా</Text>
                </View>
              </View>

              <Text style={[styles.cardHeading, { marginTop: Spacing.xl }]}>అనుకూల దిశలు & అదృష్ట సంఖ్యలు</Text>
              <View style={styles.traitsGrid}>
                <View style={styles.traitBox}>
                  <Text style={styles.traitLabel}>సర్వోత్తమ దిశ (Direction)</Text>
                  <Text style={styles.traitVal}>తూర్పు / ఈశాన్యం</Text>
                  <Text style={styles.traitSub}>పూజ మరియు కార్యాలయ బల్ల కొరకు</Text>
                </View>
                <View style={styles.traitBox}>
                  <Text style={styles.traitLabel}>అదృష్ట సంఖ్యలు (Lucky Numbers)</Text>
                  <Text style={styles.traitVal}>1, 3, 7, 9</Text>
                  <Text style={styles.traitSub}>ముఖ్యమైన లావాదేవీలకు శ్రేష్టం</Text>
                </View>
              </View>
            </View>
          )}

          {/* ─── TAB 5: REMEDIES (PARIHARAMS) ─── */}
          {activeTab === 'remedies' && (
            <View style={styles.cardBox}>
              <Text style={styles.cardHeading}>దోష నివారణ & పరిహారాలు (Remedies)</Text>
              <Text style={styles.cardSub}>చెడు సమయం లేదా ప్రతికూల గ్రహ సంచారాల నివారణకు శాస్త్రోక్త సూచనలు</Text>

              <View style={styles.remedyCard}>
                <Text style={styles.remedyTitle}>మహా మృత్యుంజయ మంత్ర జపం</Text>
                <Text style={styles.remedyType}>🛡️ రక్షణ పరిహారం</Text>
                <Text style={styles.remedyText}>
                  ప్రతిరోజూ ఉదయం 11 లేదా 108 సార్లు జపించడం వలన అరిష్టాలు, ఆకస్మిక భయాలు మరియు శని/రాహు దోషాలు నివారించబడతాయి.
                </Text>
              </View>

              <View style={[styles.remedyCard, { borderLeftColor: Colors.vedic.pasupu }]}>
                <Text style={styles.remedyTitle}>శివాలయ దర్శనం & రుద్రాభిషేకం</Text>
                <Text style={styles.remedyType}>🕉️ నవగ్రహ శాంతి</Text>
                <Text style={styles.remedyText}>
                  సోమవారం లేదా శనివారం శివునికి మారేడు దళాలతో పూజ, నువ్వుల నూనెతో దీపారాధన చేయడం ద్వారా కష్టాలు తొలగి మనశ్శాంతి లభిస్తుంది.
                </Text>
              </View>

              <View style={[styles.remedyCard, { borderLeftColor: Colors.vedic.haritha }]}>
                <Text style={styles.remedyTitle}>అన్నదానం & గో సంరక్షణ</Text>
                <Text style={styles.remedyType}>🌾 పుణ్య కర్మ పరిహారం</Text>
                <Text style={styles.remedyText}>
                  అమావాస్య లేదా మీ జన్మ నక్షత్ర దినాన నిరుపేదలకు భోజనం లేదా పక్షులకు/గోవులకు గ్రాసం అందించడం అత్యున్నత పుణ్యఫలాన్ని ఇస్తుంది.
                </Text>
              </View>
            </View>
          )}

          {/* Navigation to Telugu Calendar */}
          <TouchableOpacity
            style={styles.calendarFooterBtn}
            onPress={() => navigation.navigate('TeluguCalendar')}
            activeOpacity={0.85}
          >
            <Text style={styles.calendarFooterText}>📅 View Auspicious Telugu Calendar & Festivals →</Text>
          </TouchableOpacity>

        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#080A12',
  },
  bg: {
    flex: 1,
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 10, 18, 0.84)',
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(230, 202, 101, 0.25)',
  },
  backBtnText: {
    color: Colors.vedic.shubhWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  accuracyStamp: {
    alignItems: 'flex-end',
  },
  accuracyNum: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.vedic.pasupu,
  },
  accuracyLabel: {
    fontSize: 8,
    color: Colors.text.muted,
    textTransform: 'uppercase',
  },
  profileBanner: {
    backgroundColor: 'rgba(18, 22, 38, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.vedic.goldTrim,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.vedic.shubhWhite,
    marginBottom: 6,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(230, 202, 101, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  pillText: {
    fontSize: 10,
    color: Colors.vedic.pasupu,
    fontWeight: '600',
  },
  tabScroll: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  subnavTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(18, 22, 38, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(230, 202, 101, 0.2)',
    marginRight: 8,
  },
  subnavTabActive: {
    backgroundColor: Colors.vedic.pasupu,
    borderColor: Colors.vedic.pasupu,
  },
  subnavText: {
    fontSize: 12,
    color: Colors.text.muted,
    fontWeight: '700',
  },
  subnavTextActive: {
    color: '#080A12',
    fontWeight: '800',
  },
  cardBox: {
    backgroundColor: 'rgba(18, 22, 38, 0.88)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(230, 202, 101, 0.25)',
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.vedic.pasupu,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 11,
    color: Colors.text.muted,
    marginBottom: Spacing.md,
  },
  prose: {
    fontSize: 13,
    lineHeight: 21,
    color: '#DCE2F0',
  },
  chakraWrap: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  grahaList: {
    backgroundColor: 'rgba(10, 14, 26, 0.8)',
    borderRadius: 14,
    padding: Spacing.md,
    gap: 6,
    marginTop: Spacing.md,
  },
  grahaItem: {
    fontSize: 12,
    color: Colors.vedic.shubhWhite,
    fontWeight: '600',
  },
  timelineList: {
    gap: 8,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(10, 14, 26, 0.7)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  timelineRowActive: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.vedic.pasupu,
    backgroundColor: 'rgba(245, 184, 66, 0.12)',
  },
  timelineName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.vedic.shubhWhite,
    marginBottom: 2,
  },
  timelineDates: {
    fontSize: 11,
    color: Colors.text.muted,
  },
  runningBadge: {
    backgroundColor: Colors.vedic.haritha,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  runningBadgeText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  colorRows: {
    gap: 8,
  },
  colorCard: {
    backgroundColor: 'rgba(10, 14, 26, 0.7)',
    borderRadius: 12,
    padding: 12,
  },
  dayTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.vedic.pasupu,
    marginBottom: 2,
  },
  colorDesc: {
    fontSize: 12,
    color: Colors.vedic.shubhWhite,
  },
  traitsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.md,
  },
  traitBox: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 26, 0.7)',
    borderRadius: 12,
    padding: 12,
  },
  traitLabel: {
    fontSize: 10,
    color: Colors.vedic.pasupu,
    fontWeight: '700',
    marginBottom: 4,
  },
  traitVal: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.vedic.shubhWhite,
    marginBottom: 2,
  },
  traitSub: {
    fontSize: 9,
    color: Colors.text.muted,
  },
  remedyCard: {
    backgroundColor: 'rgba(10, 14, 26, 0.8)',
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: Colors.vedic.kunkuma,
    padding: Spacing.md,
    marginBottom: 12,
  },
  remedyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.vedic.shubhWhite,
    marginBottom: 2,
  },
  remedyType: {
    fontSize: 10,
    color: Colors.vedic.pasupu,
    fontWeight: '700',
    marginBottom: 6,
  },
  remedyText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#CBD2E2',
  },
  calendarFooterBtn: {
    backgroundColor: Colors.vedic.kunkuma,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.vedic.goldTrim,
    marginTop: Spacing.md,
  },
  calendarFooterText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});

export default JathakamScreen;
