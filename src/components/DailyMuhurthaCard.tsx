// ─────────────────────────────────────────────
//  Providence · Daily Muhūrtha & Cosmic Weather Card
//  Live Choghadiya, Rāhu Kāla & Real-time Energy Score
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, Radius, Shadows, FontSize } from '../theme';
import { computeDailyMuhurtha, DailyMuhurthaData } from '../engine/muhurtha';
import { useLanguage } from '../localization';

export const DailyMuhurthaCard: React.FC = () => {
  const { language } = useLanguage();
  const [showAllSlots, setShowAllSlots] = useState(false);

  const data: DailyMuhurthaData = computeDailyMuhurtha(new Date());

  const activeColor =
    data.activePeriod.quality === 'auspicious' ? '#34D399' :
    data.activePeriod.quality === 'neutral' ? '#38BDF8' : '#F87171';

  return (
    <View style={styles.card}>
      {/* Top Header: Day & Real-Time Cosmic Energy */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.dateText}>{data.dateStr}</Text>
          <Text style={styles.dayText}>
            {language === 'te' ? data.dayOfWeekTe : data.dayOfWeek}
          </Text>
        </View>

        <View style={styles.energyBadge}>
          <Text style={styles.energyNum}>{data.cosmicEnergyScore}%</Text>
          <Text style={styles.energyLabel}>
            {language === 'te' ? 'నేటి గ్రహ బలం' : 'COSMIC POWER'}
          </Text>
        </View>
      </View>

      {/* ── Active Time Window Banner ── */}
      <View style={[styles.activeWindowBox, { borderColor: activeColor + '88' }]}>
        <View style={styles.activeHeaderRow}>
          <View style={styles.liveDotWrap}>
            <View style={[styles.liveDot, { backgroundColor: activeColor }]} />
            <Text style={[styles.activeTag, { color: activeColor }]}>
              {language === 'te' ? 'ప్రస్తుత ముహూర్తం (LIVE)' : 'RIGHT NOW (ACTIVE)'}
            </Text>
          </View>
          <Text style={styles.activeTimeSpan}>
            {data.activePeriod.start} – {data.activePeriod.end}
          </Text>
        </View>

        <Text style={[styles.activeName, { color: activeColor }]}>
          {language === 'te' ? data.activePeriod.nameTe : data.activePeriod.name}
        </Text>
        <Text style={styles.activeMeaning}>
          {language === 'te' ? data.activePeriod.meaningTe : data.activePeriod.meaningEn}
        </Text>
      </View>

      {/* ── Rāhu Kāla Caution Bar ── */}
      <View style={styles.rahuBar}>
        <Text style={styles.rahuIcon}>⚠️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.rahuTitle}>
            {language === 'te' ? 'రాహు కాలం (నివారించాల్సిన సమయం)' : 'Rāhu Kāla (Avoid New Starts)'}
            : <Text style={{ color: '#F87171', fontWeight: 'bold' }}>{data.rahuKaal.start} – {data.rahuKaal.end}</Text>
          </Text>
          <Text style={styles.rahuAdvice}>
            {language === 'te' ? data.rahuKaal.adviceTe : data.rahuKaal.adviceEn}
          </Text>
        </View>
      </View>

      {/* ── Choghadiya Slots Toggle ── */}
      <TouchableOpacity
        style={styles.toggleBtn}
        onPress={() => setShowAllSlots(!showAllSlots)}
        activeOpacity={0.8}
      >
        <Text style={styles.toggleBtnText}>
          {showAllSlots
            ? (language === 'te' ? '▲ చోఘడియా పట్టికను తగ్గించండి' : '▲ Hide Today\'s Choghadiya Timeline')
            : (language === 'te' ? '▼ నేటి పూర్తి చోఘడియా ముహూర్తాలు చూడండి' : '▼ View Today\'s Full Choghadiya Schedule')}
        </Text>
      </TouchableOpacity>

      {/* ── Expandable Schedule ── */}
      {showAllSlots && (
        <View style={styles.slotsWrapper}>
          {data.choghadiyas.map((slot, idx) => {
            const slotColor =
              slot.quality === 'auspicious' ? '#34D399' :
              slot.quality === 'neutral' ? '#38BDF8' : '#F87171';

            return (
              <View
                key={idx}
                style={[
                  styles.slotRow,
                  slot.isCurrent && { backgroundColor: 'rgba(232, 160, 32, 0.12)', borderColor: Colors.gold[500], borderWidth: 1 }
                ]}
              >
                <View style={styles.slotTimeCol}>
                  <Text style={styles.slotTimeText}>{slot.start}</Text>
                  <Text style={styles.slotTimeSub}>{slot.end}</Text>
                </View>

                <View style={styles.slotInfoCol}>
                  <View style={styles.slotNameBadgeRow}>
                    <Text style={[styles.slotNameText, { color: slotColor }]}>
                      {language === 'te' ? slot.nameTe : slot.name}
                    </Text>
                    {slot.isCurrent && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>
                          {language === 'te' ? 'ఇప్పుడు' : 'NOW'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.slotMeaningText} numberOfLines={1}>
                    {language === 'te' ? slot.meaningTe : slot.meaningEn}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(20, 16, 45, 0.92)',
    borderRadius: Radius['2xl'],
    borderWidth: 1.5,
    borderColor: 'rgba(232, 160, 32, 0.4)',
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.gold,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dateText: {
    color: Colors.text.primary,
    fontSize: FontSize.base,
    fontWeight: 'bold',
  },
  dayText: {
    color: Colors.gold[400],
    fontSize: FontSize.xs,
    letterSpacing: 1,
    fontWeight: '600',
    marginTop: 1,
  },
  energyBadge: {
    backgroundColor: 'rgba(232, 160, 32, 0.15)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.gold[500],
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  energyNum: {
    color: Colors.gold[300],
    fontSize: FontSize.lg,
    fontWeight: 'bold',
  },
  energyLabel: {
    color: Colors.gold[400],
    fontSize: 7.5,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Active Window Box
  activeWindowBox: {
    backgroundColor: Colors.bg.glass,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  activeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveDotWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  activeTag: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  activeTimeSpan: {
    color: Colors.text.muted,
    fontSize: 10,
    fontWeight: 'bold',
  },
  activeName: {
    fontSize: FontSize.base,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  activeMeaning: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
    lineHeight: 18,
  },

  // Rahu Bar
  rahuBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.25)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    marginBottom: Spacing.sm,
  },
  rahuIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  rahuTitle: {
    color: Colors.text.primary,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  rahuAdvice: {
    color: Colors.text.muted,
    fontSize: 9,
    lineHeight: 13,
    marginTop: 2,
  },

  // Toggle button
  toggleBtn: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  toggleBtnText: {
    color: Colors.gold[400],
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Slots wrapper
  slotsWrapper: {
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: Spacing.xs,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    marginBottom: 4,
  },
  slotTimeCol: {
    width: 65,
  },
  slotTimeText: {
    color: Colors.text.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  slotTimeSub: {
    color: Colors.text.muted,
    fontSize: 8,
  },
  slotInfoCol: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  slotNameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slotNameText: {
    fontSize: FontSize.xs,
    fontWeight: 'bold',
    marginRight: 6,
  },
  currentBadge: {
    backgroundColor: Colors.gold[500],
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  currentBadgeText: {
    color: Colors.bg.void,
    fontSize: 8,
    fontWeight: 'bold',
  },
  slotMeaningText: {
    color: Colors.text.secondary,
    fontSize: 8.5,
  },
});
