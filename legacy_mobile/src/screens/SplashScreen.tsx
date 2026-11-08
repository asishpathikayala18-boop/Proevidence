// ─────────────────────────────────────────────
//  Providence · Splash Screen
//  Cosmic intro animation with Buddha + planets
// ─────────────────────────────────────────────
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Colors, Typography, FontSize, Spacing } from '../theme';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const bgOpacity  = useRef(new Animated.Value(0)).current;
  const logoScale  = useRef(new Animated.Value(0.4)).current;
  const logoOpacity= useRef(new Animated.Value(0)).current;
  const titleY     = useRef(new Animated.Value(40)).current;
  const titleOp    = useRef(new Animated.Value(0)).current;
  const subtitleOp = useRef(new Animated.Value(0)).current;
  const glowPulse  = useRef(new Animated.Value(0.6)).current;

  // Orbiting stars
  const star1Rotate = useRef(new Animated.Value(0)).current;
  const star2Rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#000000');

    // Glow pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1,   duration: 1800, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.6, duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    // Orbiting rings
    Animated.loop(
      Animated.timing(star1Rotate, { toValue: 1, duration: 12000, useNativeDriver: true })
    ).start();
    Animated.loop(
      Animated.timing(star2Rotate, { toValue: 1, duration: 8000, useNativeDriver: true })
    ).start();

    // Entrance sequence
    Animated.sequence([
      Animated.timing(bgOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(logoScale,  { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.timing(logoOpacity,{ toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(titleY,  { toValue: 0, duration: 700, useNativeDriver: true }),
        Animated.timing(titleOp, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
      Animated.timing(subtitleOp, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(onFinish, 1800);
    });
  }, []);

  const spin1 = star1Rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spin2 = star2Rotate.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });

  return (
    <View style={styles.container}>
      {/* Starfield background */}
      <Image
        source={require('../../image/moving stars.jpg')}
        style={styles.starsBg}
        resizeMode="cover"
        blurRadius={1}
      />

      {/* Deep overlay gradient */}
      <View style={styles.overlay} />

      <Animated.View style={[styles.content, { opacity: bgOpacity }]}>

        {/* Orbit ring 1 */}
        <Animated.View style={[styles.orbitRing1, { transform: [{ rotate: spin1 }] }]}>
          <View style={styles.orbitDot} />
        </Animated.View>

        {/* Orbit ring 2 */}
        <Animated.View style={[styles.orbitRing2, { transform: [{ rotate: spin2 }] }]}>
          <View style={[styles.orbitDot, { backgroundColor: Colors.gold[400] }]} />
        </Animated.View>

        {/* Cosmic glow behind logo */}
        <Animated.View style={[styles.glow, { opacity: glowPulse }]} />

        {/* Main logo — Buddha with planets */}
        <Animated.View style={[
          styles.logoWrap,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] }
        ]}>
          <Image
            source={require('../../image/Milky Way.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* App Name */}
        <Animated.Text style={[
          styles.appName,
          { opacity: titleOp, transform: [{ translateY: titleY }] }
        ]}>
          PROVIDENCE
        </Animated.Text>

        {/* Decorative line */}
        <Animated.View style={[styles.dividerWrap, { opacity: titleOp }]}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerGlyph}>✦</Text>
          <View style={styles.dividerLine} />
        </Animated.View>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: subtitleOp }]}>
          The Stars Know Your Path
        </Animated.Text>

        {/* Small planets row */}
        <Animated.View style={[styles.planetsRow, { opacity: subtitleOp }]}>
          {[
            require('../../image/planets/Mercury.jpg'),
            require('../../image/planets/venus.jpg'),
            require('../../image/planets/Mars.jpg'),
            require('../../image/planets/Jupiter .jpg'),
            require('../../image/planets/saturn.jpg'),
          ].map((src, i) => (
            <Image key={i} source={src} style={styles.miniPlanet} resizeMode="contain" />
          ))}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const LOGO_SIZE = width * 0.72;
const RING1 = LOGO_SIZE + 40;
const RING2 = LOGO_SIZE + 90;
const DOT_SIZE = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.void,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsBg: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,5,20,0.72)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Orbit rings
  orbitRing1: {
    position: 'absolute',
    width: RING1,
    height: RING1,
    borderRadius: RING1 / 2,
    borderWidth: 1,
    borderColor: 'rgba(155,126,255,0.25)',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  orbitRing2: {
    position: 'absolute',
    width: RING2,
    height: RING2,
    borderRadius: RING2 / 2,
    borderWidth: 1,
    borderColor: 'rgba(232,160,32,0.18)',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  orbitDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: Colors.primary[300],
    marginRight: -DOT_SIZE / 2,
  },

  // Glow
  glow: {
    position: 'absolute',
    width: LOGO_SIZE * 1.1,
    height: LOGO_SIZE * 1.1,
    borderRadius: (LOGO_SIZE * 1.1) / 2,
    backgroundColor: Colors.glow.purple,
    // On iOS shadowColor, Android elevation doesn't create ring glow — use opacity pulse
  },

  // Logo
  logoWrap: {
    width: LOGO_SIZE,
    height: LOGO_SIZE * 1.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    width: '100%',
    height: '100%',
  },

  // Text
  appName: {
    fontSize: FontSize['4xl'],
    letterSpacing: 12,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  // Divider
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(232,160,32,0.4)',
  },
  dividerGlyph: {
    color: Colors.gold[400],
    fontSize: FontSize.sm,
    marginHorizontal: Spacing.sm,
  },

  tagline: {
    fontSize: FontSize.base,
    letterSpacing: 3,
    color: Colors.text.muted,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: Spacing['2xl'],
  },

  // Mini planets
  planetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  miniPlanet: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});

export default SplashScreen;
