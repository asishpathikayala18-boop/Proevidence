// ─────────────────────────────────────────────
//  Providence · Classical North Indian Kundali (SVG)
//  12 House Diamond Chart with Real Graha Placements
// ─────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Polygon, Line, Text as SvgText, G } from 'react-native-svg';
import { Colors, FontSize, Radius, Spacing } from '../theme';

interface PlanetInfo {
  graha: string;
  short: string;
  house: number; // 1 to 12
  isRetro?: boolean;
}

interface KundaliChartProps {
  lagnaRashiIndex: number; // 0 = Aries, 1 = Taurus ... 11 = Pisces
  planets: {
    planet: string;
    rashiIndex: number;
    isRetrograde?: boolean;
  }[];
  width?: number;
}

const GRAHA_SHORT: Record<string, string> = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke',
};

// House coordinate centers inside a 300x300 square
const HOUSE_POSITIONS: Record<number, { x: number; y: number; numX: number; numY: number }> = {
  1:  { x: 150, y: 70,  numX: 150, numY: 42 },  // 1st House (Top diamond)
  2:  { x: 75,  y: 35,  numX: 75,  numY: 20 },  // 2nd House (Top left triangle)
  3:  { x: 35,  y: 75,  numX: 20,  numY: 75 },  // 3rd House (Upper left triangle)
  4:  { x: 70,  y: 150, numX: 42,  numY: 150 }, // 4th House (Left diamond)
  5:  { x: 35,  y: 225, numX: 20,  numY: 225 }, // 5th House (Lower left triangle)
  6:  { x: 75,  y: 265, numX: 75,  numY: 280 }, // 6th House (Bottom left triangle)
  7:  { x: 150, y: 230, numX: 150, numY: 258 }, // 7th House (Bottom diamond)
  8:  { x: 225, y: 265, numX: 225, numY: 280 }, // 8th House (Bottom right triangle)
  9:  { x: 265, y: 225, numX: 280, numY: 225 }, // 9th House (Lower right triangle)
  10: { x: 230, y: 150, numX: 258, numY: 150 }, // 10th House (Right diamond)
  11: { x: 265, y: 75,  numX: 280, numY: 75 },  // 11th House (Upper right triangle)
  12: { x: 225, y: 35,  numX: 225, numY: 20 },  // 12th House (Top right triangle)
};

export const KundaliChart: React.FC<KundaliChartProps> = ({
  lagnaRashiIndex,
  planets,
  width = 300,
}) => {
  const size = width;
  const scale = size / 300;

  // Group planets by house (1 to 12)
  // House number of a planet = ((planetRashiIndex - lagnaRashiIndex + 12) % 12) + 1
  const housePlanets: Record<number, string[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []
  };

  planets.forEach(p => {
    const house = ((p.rashiIndex - lagnaRashiIndex + 12) % 12) + 1;
    const short = GRAHA_SHORT[p.planet] || p.planet.slice(0, 2);
    const label = p.isRetrograde ? `${short}℞` : short;
    if (housePlanets[house]) {
      housePlanets[house].push(label);
    }
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 300 300">
        {/* Background */}
        <Rect x="2" y="2" width="296" height="296" fill="rgba(15, 12, 35, 0.95)" rx="12" />

        {/* Outer Border */}
        <Rect
          x="4"
          y="4"
          width="292"
          height="292"
          fill="none"
          stroke="#E8A020"
          strokeWidth="1.5"
          opacity="0.8"
        />

        {/* Major Diagonals */}
        <Line x1="4" y1="4" x2="296" y2="296" stroke="#9B7EFF" strokeWidth="1" opacity="0.4" />
        <Line x1="4" y1="296" x2="296" y2="4" stroke="#9B7EFF" strokeWidth="1" opacity="0.4" />

        {/* Inner Diamond (connect midpoints: (150,4) -> (296,150) -> (150,296) -> (4,150)) */}
        <Polygon
          points="150,4 296,150 150,296 4,150"
          fill="none"
          stroke="#E8A020"
          strokeWidth="1.5"
          opacity="0.75"
        />

        {/* 12 Houses content */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => {
          const pos = HOUSE_POSITIONS[h];
          // Sign number in this house (1-based: 1 = Aries, 12 = Pisces)
          const signNum = ((lagnaRashiIndex + (h - 1)) % 12) + 1;
          const plist = housePlanets[h] || [];

          return (
            <G key={h}>
              {/* House Rashi sign number */}
              <SvgText
                x={pos.numX}
                y={pos.numY}
                fill="rgba(232, 160, 32, 0.65)"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {signNum}
              </SvgText>

              {/* Planets inside this house */}
              {plist.map((p, idx) => {
                const offsetY = (idx - (plist.length - 1) / 2) * 12;
                return (
                  <SvgText
                    key={idx}
                    x={pos.x}
                    y={pos.y + offsetY}
                    fill={p.includes('℞') ? '#F87171' : '#F5B842'}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {p}
                  </SvgText>
                );
              })}
            </G>
          );
        })}
      </Svg>

      {/* Legend below Kundali */}
      <View style={styles.legendRow}>
        <Text style={styles.legendText}>
          <Text style={{ color: '#F5B842' }}>Su</Text>:Sun  ·  
          <Text style={{ color: '#F5B842' }}>Mo</Text>:Moon  ·  
          <Text style={{ color: '#F5B842' }}>Ma</Text>:Mars  ·  
          <Text style={{ color: '#F5B842' }}>Me</Text>:Mercury  ·  
          <Text style={{ color: '#F5B842' }}>Ju</Text>:Jupiter  ·  
          <Text style={{ color: '#F5B842' }}>Ve</Text>:Venus  ·  
          <Text style={{ color: '#F5B842' }}>Sa</Text>:Saturn
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  legendRow: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  legendText: {
    color: Colors.text.muted,
    fontSize: 9,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
