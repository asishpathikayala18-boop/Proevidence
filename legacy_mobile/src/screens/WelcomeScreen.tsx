// ─────────────────────────────────────────────
//  Providence · Welcome & Cosmic Orbit Screen
//  Middle Logo surrounded by all planets
//  Spiritual Guidance Disclaimer Modal
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Modal,
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme';
import { useLanguage } from '../localization';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen = ({ navigation }: any) => {
  const { language } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const handleStart = () => {
    setModalVisible(true);
  };

  const handleAcceptDisclaimer = () => {
    setModalVisible(false);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../../image/moving stars.jpg')}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.bgOverlay} />

        {/* Orbiting / Placed Planets All Around Screen */}
        <View style={styles.planetsContainer} pointerEvents="box-none">
          {/* Surya (Sun) - Top Left */}
          <View style={[styles.planetNode, { top: '10%', left: '8%' }]}>
            <Image source={require('../../image/sun.jpg')} style={styles.planetImg} />
            <Text style={styles.planetLabel}>Surya · సూర్యుడు</Text>
          </View>

          {/* Chandra (Moon) - Top Right */}
          <View style={[styles.planetNode, { top: '12%', right: '8%' }]}>
            <Image source={require('../../image/Moon.jpg')} style={styles.planetImg} />
            <Text style={styles.planetLabel}>Chandra · చంద్రుడు</Text>
          </View>

          {/* Guru (Jupiter) - Mid Left */}
          <View style={[styles.planetNode, { top: '38%', left: '4%' }]}>
            <Image source={require('../../image/planets/Jupiter .jpg')} style={styles.planetImg} />
            <Text style={styles.planetLabel}>Guru · బృహస్పతి</Text>
          </View>

          {/* Shukra (Venus) - Mid Right */}
          <View style={[styles.planetNode, { top: '36%', right: '4%' }]}>
            <Image source={require('../../image/planets/venus.jpg')} style={styles.planetImg} />
            <Text style={styles.planetLabel}>Shukra · శుక్రుడు</Text>
          </View>

          {/* Kuja (Mars) - Bottom Left */}
          <View style={[styles.planetNode, { bottom: '18%', left: '8%' }]}>
            <Image source={require('../../image/planets/Mars.jpg')} style={styles.planetImg} />
            <Text style={styles.planetLabel}>Kuja · అంగారకుడు</Text>
          </View>

          {/* Shani (Saturn) - Bottom Right */}
          <View style={[styles.planetNode, { bottom: '16%', right: '8%' }]}>
            <Image source={require('../../image/planets/saturn.jpg')} style={styles.planetImg} />
            <Text style={styles.planetLabel}>Shani · శని</Text>
          </View>

          {/* Budha (Mercury) - Top Center */}
          <View style={[styles.planetNode, { top: '4%', alignSelf: 'center' }]}>
            <Image source={require('../../image/planets/Mercury.jpg')} style={styles.planetImgSmall} />
            <Text style={styles.planetLabel}>Budha · బుధుడు</Text>
          </View>

          {/* Bhoomi (Earth) - Bottom Center */}
          <View style={[styles.planetNode, { bottom: '5%', alignSelf: 'center' }]}>
            <Image source={require('../../image/planets/earth.jpg')} style={styles.planetImgSmall} />
            <Text style={styles.planetLabel}>Bhoomi · భూమి</Text>
          </View>
        </View>

        {/* Central Logo Box */}
        <View style={styles.centerContainer}>
          <View style={styles.centralLogoCard}>
            <View style={styles.sriChakraPill}>
              <Text style={styles.sriChakraIcon}>☸</Text>
            </View>
            <Text style={styles.brandTitle}>PROVIDENCE</Text>
            <Text style={styles.brandSubtitle}>ప్రావిడెన్స్ జ్యోతిష విజ్ఞానం</Text>
            <Text style={styles.brandDesc}>
              Classical Vedic Sidereal Astrology, 27 Nakshatras & Sacred Dual Numerology.
            </Text>

            <TouchableOpacity style={styles.exploreBtn} onPress={handleStart} activeOpacity={0.85}>
              <Text style={styles.exploreBtnText}>✦ Explore Your Destiny</Text>
              <Text style={styles.exploreBtnArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.calendarNavBtn}
              onPress={() => navigation.navigate('TeluguCalendar')}
              activeOpacity={0.8}
            >
              <Text style={styles.calendarNavText}>📅 Telugu Calendar & Festivals</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spiritual Guidance Disclaimer Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.warningIconCircle}>
                <Text style={styles.warningIcon}>⚠️</Text>
              </View>

              <Text style={styles.modalTitle}>Spiritual Guidance Disclaimer</Text>
              <Text style={styles.modalTeluguTitle}>గమనిక & ఆధ్యాత్మిక సూచన</Text>

              <View style={styles.warningBox}>
                <Text style={styles.warningPoint}>
                  ⚜️ <Text style={{ fontWeight: '700', color: Colors.vedic.pasupu }}>For Guidance Only:</Text> Vedic astrology reveals cosmic weather, karmic tendencies, and favorable timings.
                </Text>
                <Text style={styles.warningPoint}>
                  🛡️ <Text style={{ fontWeight: '700', color: '#FF7088' }}>Do Not Follow Blindly:</Text> Do not make fatalistic decisions or succumb to superstition based on predictive readings.
                </Text>
                <Text style={styles.warningPoint}>
                  ☀️ <Text style={{ fontWeight: '700', color: Colors.vedic.goldTrim }}>Purushartha (Self-Effort):</Text> Sincere conscious action and moral free will always transcend planetary constraints.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleAcceptDisclaimer}
                activeOpacity={0.85}
              >
                <Text style={styles.modalConfirmText}>✓ I Understand & Agree — Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
    backgroundColor: 'rgba(8, 10, 18, 0.78)',
  },
  planetsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  planetNode: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
  },
  planetImg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 184, 66, 0.5)',
  },
  planetImgSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(230, 202, 101, 0.4)',
  },
  planetLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.vedic.goldTrim,
    backgroundColor: 'rgba(8, 10, 18, 0.85)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  centralLogoCard: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: 'rgba(14, 18, 34, 0.88)',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.vedic.goldTrim,
    padding: Spacing.xl,
    alignItems: 'center',
    shadowColor: Colors.vedic.pasupu,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  sriChakraPill: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.vedic.kunkuma,
    borderWidth: 2,
    borderColor: Colors.vedic.pasupu,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  sriChakraIcon: {
    fontSize: 34,
    color: '#FFFFFF',
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 3,
    color: Colors.vedic.shubhWhite,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 14,
    color: Colors.vedic.pasupu,
    fontWeight: '700',
    marginBottom: 12,
  },
  brandDesc: {
    fontSize: 12,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.xl,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.vedic.kunkuma,
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.vedic.goldTrim,
    gap: 8,
    marginBottom: 12,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  exploreBtnArrow: {
    color: Colors.vedic.pasupu,
    fontWeight: '900',
    fontSize: 16,
  },
  calendarNavBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  calendarNavText: {
    color: Colors.vedic.pasupu,
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 6, 12, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#121626',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.vedic.kunkuma,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  warningIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(179, 29, 52, 0.2)',
    borderWidth: 1.5,
    borderColor: Colors.vedic.kunkuma,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  warningIcon: {
    fontSize: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.vedic.shubhWhite,
    textAlign: 'center',
    marginBottom: 2,
  },
  modalTeluguTitle: {
    fontSize: 13,
    color: Colors.vedic.pasupu,
    fontWeight: '700',
    marginBottom: 16,
  },
  warningBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12,
    marginBottom: Spacing.xl,
  },
  warningPoint: {
    fontSize: 12,
    lineHeight: 18,
    color: '#D8DEEC',
  },
  modalConfirmBtn: {
    width: '100%',
    backgroundColor: Colors.vedic.haritha,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});

export default WelcomeScreen;
