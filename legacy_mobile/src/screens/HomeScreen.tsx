// ─────────────────────────────────────────────
//  Providence · Home Dashboard & Input Screen
//  Vedic credentials input + accuracy meter + Telugu calendar link
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
  Platform,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Spacing, Radius } from '../theme';
import { ZODIAC_SIGNS, ZodiacData } from '../theme/zodiac';
import { useLanguage, TELUGU_RASHIS } from '../localization';
import { DailyMuhurthaCard } from '../components/DailyMuhurthaCard';

const { width } = Dimensions.get('window');

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const HomeScreen = ({ navigation }: any) => {
  const { language, setLanguage, t } = useLanguage();
  const [name, setName] = useState('');
  const [dob, setDob] = useState<Date | null>(new Date(1998, 7, 16));
  const [birthTime, setBirthTime] = useState<{ hour: number; minute: number } | null>({ hour: 10, minute: 30 });
  const [selectedRasi, setSelectedRasi] = useState<string>('');
  const [selectedNakshatra, setSelectedNakshatra] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Dynamic Accuracy Probability Multiplier
  let accuracyScore = 50;
  if (dob) accuracyScore += 18; // 68%
  if (birthTime) accuracyScore += 16; // 84%
  if (selectedRasi) accuracyScore += 6; // 90%
  if (selectedNakshatra) accuracyScore += 8; // 98%
  if (accuracyScore > 98) accuracyScore = 98;

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const handleTimeChange = (_: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setBirthTime({
        hour: selectedDate.getHours(),
        minute: selectedDate.getMinutes(),
      });
    }
  };

  const detectedSign = dob
    ? ZodiacData.getByDate(dob.getMonth() + 1, dob.getDate())
    : ZODIAC_SIGNS[0];

  const handleNavigateToPrediction = () => {
    navigation.navigate('Jathakam', {
      sign: detectedSign,
      dob: dob || new Date(),
      name: name.trim() || 'Cosmic Seeker',
      birthTime,
      userRasi: selectedRasi,
      userNakshatra: selectedNakshatra,
      accuracy: accuracyScore,
    });
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
          {/* Top Bar: Language & Telugu Calendar Button */}
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.calPillBtn}
              onPress={() => navigation.navigate('TeluguCalendar')}
              activeOpacity={0.8}
            >
              <Text style={styles.calPillText}>📅 {language === 'te' ? 'తెలుగు క్యాలెండర్' : 'Telugu Calendar'}</Text>
            </TouchableOpacity>

            <View style={styles.langSwitchRow}>
              <TouchableOpacity
                style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
                onPress={() => setLanguage('en')}
              >
                <Text style={[styles.langBtnText, language === 'en' && styles.langBtnTextActive]}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langBtn, language === 'te' && styles.langBtnActive]}
                onPress={() => setLanguage('te')}
              >
                <Text style={[styles.langBtnText, language === 'te' && styles.langBtnTextActive]}>తె</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Header Branding */}
          <View style={styles.header}>
            <Image source={require('../../image/sun.jpg')} style={styles.headerIcon} resizeMode="contain" />
            <View style={styles.headerText}>
              <Text style={styles.greeting}>✦ {language === 'te' ? 'శుభోదయం' : 'Welcome to'}</Text>
              <Text style={styles.appTitle}>PROVIDENCE</Text>
              <Text style={styles.appSub}>
                {language === 'te' ? 'ప్రావిడెన్స్ వైదిక జ్యోతిష విజ్ఞానం' : 'Vedic Destiny & Panchangam'}
              </Text>
            </View>
            <Image source={require('../../image/Moon.jpg')} style={styles.headerIcon} resizeMode="contain" />
          </View>

          {/* Daily Muhurtha Card */}
          <DailyMuhurthaCard />

          {/* ─── CREDENTIAL & BIRTH DETAIL CARD ─── */}
          <View style={styles.cardBox}>
            <Text style={styles.cardHeaderTitle}>
              {language === 'te' ? 'జన్మ వివరాలు (Birth Credentials)' : 'Birth Details & Calibration'}
            </Text>
            <Text style={styles.cardHeaderSub}>
              {language === 'te'
                ? 'ఎక్కువ వివరాలు ఇస్తే మరింత ఖచ్చితమైన భవిష్యత్ ఫలితాలు లభిస్తాయి'
                : 'Complete details elevate sidereal calculation precision'}
            </Text>

            {/* Dynamic Accuracy Multiplier Gauge */}
            <View style={styles.accuracyWrap}>
              <View style={styles.accuracyCircle}>
                <Text style={styles.accuracyNumber}>{accuracyScore}%</Text>
                <Text style={styles.accuracyUnit}>Precision</Text>
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={styles.accuracyTitle}>
                  {accuracyScore >= 95
                    ? (language === 'te' ? 'ఉన్నత ఖచ్చితత్వం (Peak Precision)' : 'Peak Vedic Synthesis')
                    : (language === 'te' ? 'ప్రామాణిక గణన (Standard Mode)' : 'Standard Sidereal Mode')}
                </Text>
                <Text style={styles.accuracyExplain}>
                  {language === 'te'
                    ? 'DOB తప్పనిసరి. సమయం, రాశి, నక్షత్రం ఇవ్వడం ద్వారా 108 నక్షత్ర పాదాల ఫలితం వస్తుంది.'
                    : 'DOB is mandatory. Time & Nakshatra lock your exact 108 Pada and Vimshottari Mahadasha.'}
                </Text>
              </View>
            </View>

            {/* Full Name */}
            <Text style={styles.inputLabel}>{language === 'te' ? 'పూర్తి పేరు' : 'Full Name'} *</Text>
            <TextInput
              style={styles.textInput}
              placeholder={language === 'te' ? 'మీ పేరు రాయండి' : 'Enter your name'}
              placeholderTextColor={Colors.text.muted}
              value={name}
              onChangeText={setName}
            />

            {/* Date of Birth (Mandatory) */}
            <Text style={[styles.inputLabel, { marginTop: Spacing.md }]}>
              {language === 'te' ? 'పుట్టిన తేదీ (DOB)' : 'Date of Birth'} *
            </Text>
            <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerIcon}>🗓</Text>
              <Text style={styles.datePickerText}>
                {dob ? dob.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Select Date of Birth'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dob || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                themeVariant="dark"
              />
            )}

            {/* Birth Time (Optional) */}
            <Text style={[styles.inputLabel, { marginTop: Spacing.md }]}>
              {language === 'te' ? 'పుట్టిన సమయం (Birth Time)' : 'Birth Time'} (Optional)
            </Text>
            <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.datePickerIcon}>⏰</Text>
              <Text style={styles.datePickerText}>
                {birthTime
                  ? `${String(birthTime.hour).padStart(2, '0')}:${String(birthTime.minute).padStart(2, '0')} (Exact Lagna)`
                  : 'Tap to add birth time (Optional)'}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                themeVariant="dark"
              />
            )}

            {/* Calculate Button */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleNavigateToPrediction}
              activeOpacity={0.85}
            >
              <Text style={styles.actionBtnText}>
                {language === 'te' ? '🔮 భవిష్యత్ ఫలితాలు చూడండి' : '🔮 Synthesize Vedic Reading'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 36-Gunas Matchmaking Button */}
          <TouchableOpacity
            style={styles.matchmakerCard}
            onPress={() => navigation.navigate('Compatibility')}
            activeOpacity={0.8}
          >
            <View style={styles.matchmakerIconCircle}>
              <Text style={styles.matchmakerIcon}>💑</Text>
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <Text style={styles.matchmakerTitle}>
                {language === 'te' ? '36 గుణాల దాంపత్య పొంతన' : '36-GUNA COMPATIBILITY'}
              </Text>
              <Text style={styles.matchmakerSub}>
                {language === 'te' ? 'వివాహ & ప్రేమ అనుకూలత గణన' : 'Vedic Ashta Koota Love Matchmaker'}
              </Text>
            </View>
            <Text style={styles.matchmakerArrow}>→</Text>
          </TouchableOpacity>

          {/* 12 Signs Section */}
          <Text style={styles.sectionTitle}>
            {language === 'te' ? '12 రాశుల వైదిక దర్శనం' : 'Twelve Zodiac Rashis'}
          </Text>

          <View style={styles.zodiacGrid}>
            {ZODIAC_SIGNS.map(sign => (
              <TouchableOpacity
                key={sign.id}
                style={styles.zodiacCard}
                onPress={() => navigation.navigate('ZodiacDetail', { sign, dob, name })}
                activeOpacity={0.8}
              >
                <Text style={styles.zodiacSymbol}>{sign.symbol}</Text>
                <Text style={[styles.zodiacName, { color: sign.color }]}>
                  {language === 'te' && TELUGU_RASHIS[sign.id]
                    ? TELUGU_RASHIS[sign.id].teluguName
                    : sign.name}
                </Text>
                <Text style={styles.zodiacElement}>{sign.element}</Text>
              </TouchableOpacity>
            ))}
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
    backgroundColor: 'rgba(8, 10, 18, 0.8)',
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  calPillBtn: {
    backgroundColor: Colors.vedic.kunkuma,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.vedic.goldTrim,
  },
  calPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  langSwitchRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 3,
  },
  langBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  langBtnActive: {
    backgroundColor: Colors.vedic.pasupu,
  },
  langBtnText: {
    fontSize: 11,
    color: Colors.vedic.shubhWhite,
    fontWeight: '600',
  },
  langBtnTextActive: {
    color: '#080A12',
    fontWeight: '800',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  headerText: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 11,
    color: Colors.vedic.pasupu,
    fontWeight: '700',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.vedic.shubhWhite,
    letterSpacing: 2,
  },
  appSub: {
    fontSize: 11,
    color: Colors.text.muted,
  },
  cardBox: {
    backgroundColor: 'rgba(18, 22, 38, 0.88)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(230, 202, 101, 0.25)',
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.vedic.shubhWhite,
    marginBottom: 2,
  },
  cardHeaderSub: {
    fontSize: 11,
    color: Colors.text.muted,
    marginBottom: Spacing.md,
  },
  accuracyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 126, 69, 0.15)',
    borderWidth: 1,
    borderColor: Colors.vedic.haritha,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  accuracyCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(8, 10, 18, 0.9)',
    borderWidth: 2,
    borderColor: Colors.vedic.haritha,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accuracyNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.vedic.pasupu,
  },
  accuracyUnit: {
    fontSize: 8,
    color: Colors.text.muted,
    textTransform: 'uppercase',
  },
  accuracyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.vedic.pasupu,
    marginBottom: 2,
  },
  accuracyExplain: {
    fontSize: 10,
    color: Colors.vedic.shubhWhite,
    lineHeight: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.vedic.shubhWhite,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: 'rgba(8, 10, 18, 0.85)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 10, 18, 0.85)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  datePickerIcon: {
    fontSize: 16,
  },
  datePickerText: {
    fontSize: 13,
    color: Colors.vedic.shubhWhite,
    fontWeight: '600',
  },
  actionBtn: {
    backgroundColor: Colors.vedic.pasupu,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  actionBtnText: {
    color: '#080A12',
    fontWeight: '900',
    fontSize: 14,
  },
  matchmakerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(179, 29, 52, 0.22)',
    borderWidth: 1,
    borderColor: Colors.vedic.kunkuma,
    borderRadius: 18,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  matchmakerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(8, 10, 18, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchmakerIcon: {
    fontSize: 20,
  },
  matchmakerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.vedic.pasupu,
  },
  matchmakerSub: {
    fontSize: 10,
    color: Colors.vedic.shubhWhite,
  },
  matchmakerArrow: {
    fontSize: 18,
    color: Colors.vedic.pasupu,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.vedic.goldTrim,
    marginBottom: Spacing.md,
  },
  zodiacGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  zodiacCard: {
    width: (width - Spacing.lg * 2 - 20) / 3,
    backgroundColor: 'rgba(18, 22, 38, 0.8)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: Spacing.sm,
    alignItems: 'center',
  },
  zodiacSymbol: {
    fontSize: 22,
    marginBottom: 4,
  },
  zodiacName: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  zodiacElement: {
    fontSize: 9,
    color: Colors.text.muted,
  },
});

export default HomeScreen;
