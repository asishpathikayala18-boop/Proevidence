// ─────────────────────────────────────────────
//  Providence · Navigation + App Entry
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

import SplashScreen        from './screens/SplashScreen';
import WelcomeScreen       from './screens/WelcomeScreen';
import HomeScreen          from './screens/HomeScreen';
import ZodiacDetailScreen  from './screens/ZodiacDetailScreen';
import TeluguCalendarScreen from './screens/TeluguCalendarScreen';
import JathakamScreen       from './screens/JathakamScreen';
import LuckyNumberScreen   from './screens/LuckyNumberScreen';
import CompatibilityScreen from './screens/CompatibilityScreen';
import { LanguageProvider } from './localization';
import { Colors } from './theme';

export type RootStackParamList = {
  Welcome:        undefined;
  Home:           undefined;
  Jathakam:       {
    sign?: any;
    dob?: Date;
    name?: string;
    birthTime?: { hour: number; minute: number } | null;
    userRasi?: string;
    userNakshatra?: string;
    accuracy?: number;
  };
  ZodiacDetail:   {
    sign: any;
    dob?: Date;
    name?: string;
    birthTime?: { hour: number; minute: number } | null;
    userRasi?: string;
    userNakshatra?: string;
    accuracy?: number;
  };
  TeluguCalendar: undefined;
  LuckyNumber:    { sign: any; dob?: Date; name?: string };
  Compatibility:  undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return (
      <LanguageProvider>
        <StatusBar barStyle="light-content" backgroundColor="#080A12" />
        <SplashScreen onFinish={() => setSplashDone(true)} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <StatusBar barStyle="light-content" backgroundColor="#080A12" translucent />
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary:      Colors.vedic.pasupu,
            background:   '#080A12',
            card:         '#121626',
            text:         Colors.vedic.shubhWhite,
            border:       'rgba(230,202,101,0.2)',
            notification: Colors.vedic.kunkuma,
          },
        }}
      >
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#080A12' },
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Jathakam" component={JathakamScreen} />
          <Stack.Screen name="ZodiacDetail" component={ZodiacDetailScreen} />
          <Stack.Screen name="TeluguCalendar" component={TeluguCalendarScreen} />
          <Stack.Screen name="Compatibility" component={CompatibilityScreen} />
          <Stack.Screen name="LuckyNumber" component={LuckyNumberScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
};

export default App;
