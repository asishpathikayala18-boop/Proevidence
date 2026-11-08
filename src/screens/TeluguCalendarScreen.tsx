// ─────────────────────────────────────────────
//  Providence · Telugu Calendar & Festivals Screen
//  Classical Panchangam & Telugu Hindu Festivals
//  Auspicious Kunkuma, Pasupu, Haritha & Shubh White palette
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

const { width } = Dimensions.get('window');

interface FestivalItem {
  id: string;
  monthKey: string;
  nameTe: string;
  nameEn: string;
  tithi: string;
  dateNum: string;
  dateMonth: string;
  accent: 'kunkuma' | 'pasupu' | 'haritha';
  desc: string;
}

const TELUGU_FESTIVALS: FestivalItem[] = [
  {
    id: 'ugadi',
    monthKey: 'chaitra',
    nameTe: 'ఉగాది (Ugadi)',
    nameEn: 'Telugu New Year',
    tithi: 'చైత్ర శుద్ధ పాడ్యమి (Chaitra Shukla Padyami)',
    dateNum: '20',
    dateMonth: 'Mar',
    accent: 'haritha',
    desc: 'తెలుగు వారి నూతన సంవత్సరాది. షడ్రుచుల ఉగాది పచ్చడి ఆస్వాదించి, పంచాంగ శ్రవణం జరిపే అత్యంత పవిత్ర దినం. సర్వ శుభకార్యాలకు, నూతన సంకల్పాలకు శ్రేష్టం.',
  },
  {
    id: 'ram_navami',
    monthKey: 'chaitra',
    nameTe: 'శ్రీరామ నవమి (Sri Rama Navami)',
    nameEn: 'Celebration of Lord Rama',
    tithi: 'చైత్ర శుద్ధ నవమి (Chaitra Shukla Navami)',
    dateNum: '28',
    dateMonth: 'Mar',
    accent: 'kunkuma',
    desc: 'మర్యాదా పురుషోత్తముడు శ్రీరామచంద్రుని జన్మదినం మరియు సీతారాముల దివ్య కల్యాణ మహోత్సవ దినం. భద్రాచల రామయ్య కల్యాణం, వడపప్పు-పానకం ప్రసాద సమర్పణ విశేషం.',
  },
  {
    id: 'guru_purnima',
    monthKey: 'ashadha',
    nameTe: 'గురు పౌర్ణమి / వ్యాస పౌర్ణమి',
    nameEn: 'Guru Purnima (Vyasa Purnima)',
    tithi: 'ఆషాఢ శుద్ధ పౌర్ణమి (Ashadha Purnima)',
    dateNum: '10',
    dateMonth: 'Jul',
    accent: 'pasupu',
    desc: 'సర్వ గురువుల ఆదిగురువు వేదవ్యాస మహర్షి జయంతి. జీవితానికి సన్మార్గం చూపించే సద్గురువులను పూజించి ఆశీర్వాదం పొందే పరమ పవిత్ర దినం.',
  },
  {
    id: 'vinayaka_chavithi',
    monthKey: 'bhadrapada',
    nameTe: 'వినాయక చవితి (Vinayaka Chavithi)',
    nameEn: 'Ganesh Chaturthi',
    tithi: 'భాద్రపద శుద్ధ చవితి (Bhadrapada Shukla Chavithi)',
    dateNum: '14',
    dateMonth: 'Sep',
    accent: 'pasupu',
    desc: 'విఘ్నహర్త శ్రీ మహాగణపతి ఆవిర్భావ దినం. 21 పత్రాలతో ఏకవింశతి పూజ, ఉండ్రాళ్ళు, కుడుముల నైవేద్యంతో సర్వ కార్యసిద్ధికి ఆరాధన.',
  },
  {
    id: 'dasara',
    monthKey: 'ashwayuja',
    nameTe: 'విజయదశమి / దసరా (Vijaya Dasami)',
    nameEn: 'Dasara Festival',
    tithi: 'ఆశ్వయుజ శుద్ధ దశమి (Ashwayuja Shukla Dashami)',
    dateNum: '20',
    dateMonth: 'Oct',
    accent: 'kunkuma',
    desc: 'మహిషాసుర మర్దిని దుర్గాదేవి విజయం. శమీ పూజ (జమ్మి చెట్టు పూజ), ఆయుధ పూజ, పాలపిట్ట దర్శనం శుభకరం. సకల విజయాలకు నాంది.',
  },
  {
    id: 'deepavali',
    monthKey: 'kartika',
    nameTe: 'దీపావళి (Deepavali)',
    nameEn: 'Festival of Divine Lights',
    tithi: 'ఆశ్వయుజ బహుళ అమావాస్య (Kartika Welcoming)',
    dateNum: '08',
    dateMonth: 'Nov',
    accent: 'pasupu',
    desc: 'చీకటిని పారద్రోలి వెలుగును నింపే మహోత్సవం. శ్రీ మహాలక్ష్మి పూజ, దీపాల అలంకరణ, కేదారేశ్వర వ్రతం సకల దారిద్ర్య నివారణకు ప్రసిద్ధి.',
  },
  {
    id: 'kartika_purnima',
    monthKey: 'kartika',
    nameTe: 'కార్తీక పౌర్ణమి (Kartika Purnima)',
    nameEn: 'Holy Shiva-Vishnu Deepam',
    tithi: 'కార్తీక శుద్ధ పౌర్ణమి (Kartika Purnima)',
    dateNum: '23',
    dateMonth: 'Nov',
    accent: 'haritha',
    desc: 'శివాలయాలలో 365 వత్తుల దీపారాధన, జ్వాలాతోరణ దర్శనం. ఉసిరి దీపాలు వెలిగించి నదీ స్నానాలు ఆచరించే పరమ పావన దినం.',
  },
  {
    id: 'sankranti',
    monthKey: 'pushya',
    nameTe: 'మకర సంక్రాంతి (Makara Sankranti)',
    nameEn: 'Pedda Panduga / Harvest Festival',
    tithi: 'సూర్యుడు మకర రాశి ప్రవేశం (Surya Makara Pravesham)',
    dateNum: '14',
    dateMonth: 'Jan',
    accent: 'pasupu',
    desc: 'భోగి, సంక్రాంతి, కనుమలతో కూడిన మూడ్రోజుల పెద్ద పండుగ. ముంగిట ముగ్గులు, గొబ్బెమ్మలు, హరిదాసు కీర్తనలు, గంగిరెద్దుల విన్యాసాలు మరియు ధాన్య లక్ష్మి పూజ.',
  },
  {
    id: 'shivaratri',
    monthKey: 'magha',
    nameTe: 'మహా శివరాత్రి (Maha Shivaratri)',
    nameEn: 'The Great Night of Lord Shiva',
    tithi: 'మాఘ బహుళ చతుర్దశి (Magha Bahula Chaturdashi)',
    dateNum: '06',
    dateMonth: 'Mar',
    accent: 'kunkuma',
    desc: 'జాగరణ, ఉపవాస దీక్షలతో లయకారుడైన పరమశివునికి లింగోద్భవ కాలంలో అభిషేకం. పంచాక్షరీ మంత్ర జపంతో సకల పాపక్షయం మరియు మోక్ష ప్రాప్తి.',
  },
];

export const TeluguCalendarScreen = ({ navigation }: any) => {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? TELUGU_FESTIVALS
    : TELUGU_FESTIVALS.filter(f => f.monthKey === activeFilter);

  const getAccentColor = (accent: string) => {
    switch (accent) {
      case 'kunkuma': return Colors.vedic.kunkuma;
      case 'haritha': return Colors.vedic.haritha;
      default: return Colors.vedic.pasupu;
    }
  };

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
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backBtnText}>← {language === 'te' ? 'వెనుకకు' : 'Back'}</Text>
            </TouchableOpacity>

            <View style={styles.heroBox}>
              <Text style={styles.heroTelugu}>తెలుగు పంచాంగం & పవిత్ర పండుగలు</Text>
              <Text style={styles.heroSub}>Auspicious Telugu Vedic Calendar & Festivities</Text>
              <View style={styles.samvatsaraPill}>
                <Text style={styles.samvatsaraText}>
                  🕉️ శ్రీ క్రోధి నామ సంవత్సరం (Krodhi Nama Samvatsaram)
                </Text>
              </View>
            </View>
          </View>

          {/* Daily 5 Panchangam Limbs */}
          <Text style={styles.sectionHeader}>✦ నేటి పంచాంగ విశేషాలు (Today's Limbs)</Text>
          <View style={styles.panchangGrid}>
            <View style={styles.panchangCard}>
              <Text style={styles.panchangLabel}>తిథి (Tithi)</Text>
              <Text style={styles.panchangValTe}>త్రయోదశి</Text>
              <Text style={styles.panchangValEn}>Trayodashi (Shukla)</Text>
            </View>

            <View style={styles.panchangCard}>
              <Text style={styles.panchangLabel}>వారం (Vaara)</Text>
              <Text style={styles.panchangValTe}>మంగళవారం</Text>
              <Text style={styles.panchangValEn}>Mangalavaram</Text>
            </View>

            <View style={styles.panchangCard}>
              <Text style={styles.panchangLabel}>నక్షత్రం (Nakshatra)</Text>
              <Text style={styles.panchangValTe}>భరణి</Text>
              <Text style={styles.panchangValEn}>Bharani (Venus)</Text>
            </View>

            <View style={styles.panchangCard}>
              <Text style={styles.panchangLabel}>యోగం (Yoga)</Text>
              <Text style={styles.panchangValTe}>సిద్ధి</Text>
              <Text style={styles.panchangValEn}>Siddhi Yoga</Text>
            </View>
          </View>

          {/* Month Filter Chips */}
          <Text style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>
            🌺 ప్రముఖ హిందూ & తెలుగు పండుగలు (Major Festivals)
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {[
              { key: 'all', label: 'అన్నీ (All)' },
              { key: 'chaitra', label: 'చైత్రం (Ugadi)' },
              { key: 'bhadrapada', label: 'భాద్రపదం (Vinayaka)' },
              { key: 'ashwayuja', label: 'ఆశ్వయుజం (Dasara)' },
              { key: 'kartika', label: 'కార్తీకం (Deepavali)' },
              { key: 'pushya', label: 'పుష్యం (Sankranti)' },
              { key: 'magha', label: 'మాఘం (Shivaratri)' },
            ].map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterChip,
                  activeFilter === tab.key && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(tab.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    activeFilter === tab.key && styles.filterChipTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Festival Cards List */}
          <View style={styles.festivalsList}>
            {filtered.map(fest => {
              const accentColor = getAccentColor(fest.accent);
              return (
                <View key={fest.id} style={[styles.festCard, { borderLeftColor: accentColor }]}>
                  <View style={styles.festDateBox}>
                    <Text style={[styles.festDateNum, { color: accentColor }]}>{fest.dateNum}</Text>
                    <Text style={styles.festDateMonth}>{fest.dateMonth}</Text>
                  </View>

                  <View style={styles.festDetails}>
                    <Text style={styles.festNameTe}>{fest.nameTe}</Text>
                    <Text style={styles.festNameEn}>{fest.nameEn}</Text>
                    <View style={styles.tithiBadge}>
                      <Text style={styles.tithiBadgeText}>📅 {fest.tithi}</Text>
                    </View>
                    <Text style={styles.festDesc}>{fest.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
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
    backgroundColor: 'rgba(8, 10, 18, 0.82)',
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(230, 202, 101, 0.25)',
    marginBottom: Spacing.md,
  },
  backBtnText: {
    color: Colors.vedic.shubhWhite,
    fontSize: 13,
    fontWeight: '600',
  },
  heroBox: {
    backgroundColor: 'rgba(18, 22, 38, 0.85)',
    borderWidth: 2,
    borderColor: Colors.vedic.pasupu,
    borderRadius: 22,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  heroTelugu: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.vedic.pasupu,
    textAlign: 'center',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 12,
    color: Colors.vedic.shubhWhite,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  samvatsaraPill: {
    backgroundColor: 'rgba(10, 14, 26, 0.8)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(230, 202, 101, 0.3)',
  },
  samvatsaraText: {
    fontSize: 12,
    color: Colors.vedic.goldTrim,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.vedic.pasupu,
    marginBottom: Spacing.md,
  },
  panchangGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  panchangCard: {
    width: (width - Spacing.lg * 2 - 10) / 2,
    backgroundColor: 'rgba(18, 22, 38, 0.8)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(230, 202, 101, 0.2)',
    alignItems: 'center',
  },
  panchangLabel: {
    fontSize: 11,
    color: Colors.vedic.pasupu,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  panchangValTe: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.vedic.shubhWhite,
    marginBottom: 2,
  },
  panchangValEn: {
    fontSize: 11,
    color: Colors.text.muted,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(230, 202, 101, 0.2)',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.vedic.kunkuma,
    borderColor: Colors.vedic.kunkuma,
  },
  filterChipText: {
    fontSize: 12,
    color: Colors.vedic.shubhWhite,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  festivalsList: {
    gap: 14,
  },
  festCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(18, 22, 38, 0.85)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderLeftWidth: 5,
    gap: 14,
  },
  festDateBox: {
    width: 62,
    height: 62,
    borderRadius: 14,
    backgroundColor: 'rgba(10, 14, 26, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(230, 202, 101, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  festDateNum: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 22,
  },
  festDateMonth: {
    fontSize: 10,
    color: Colors.text.muted,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  festDetails: {
    flex: 1,
  },
  festNameTe: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.vedic.shubhWhite,
    marginBottom: 2,
  },
  festNameEn: {
    fontSize: 12,
    color: Colors.vedic.pasupu,
    fontWeight: '600',
    marginBottom: 6,
  },
  tithiBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  tithiBadgeText: {
    fontSize: 10,
    color: Colors.vedic.goldTrim,
  },
  festDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: '#C4CADB',
  },
});

export default TeluguCalendarScreen;
