// ─────────────────────────────────────────────
//  Providence · Zodiac Sign Data
// ─────────────────────────────────────────────
import { Colors } from './colors';

export type ZodiacElement = 'fire' | 'earth' | 'air' | 'water';
export type ZodiacModality = 'cardinal' | 'fixed' | 'mutable';

export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;          // Unicode glyph
  emoji: string;
  dateRange: string;
  element: ZodiacElement;
  modality: ZodiacModality;
  rulingPlanet: string;
  rulingPlanetImage: any;  // require() image
  color: string;           // primary accent color
  gradient: string[];      // gradient stop colors
  traits: string[];
  lucky: {
    numbers: number[];
    colors: string[];
    days: string[];
    gemstone: string;
  };
  description: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 'aries',
    name: 'Aries',
    symbol: '♈',
    emoji: '🐏',
    dateRange: 'Mar 21 – Apr 19',
    element: 'fire',
    modality: 'cardinal',
    rulingPlanet: 'Mars',
    rulingPlanetImage: require('../../image/planets/Mars.jpg'),
    color: Colors.element.fire,
    gradient: ['#FF6B35', '#C0392B'],
    traits: ['Bold', 'Energetic', 'Courageous', 'Independent'],
    lucky: { numbers: [1, 8, 17], colors: ['Red', 'Orange'], days: ['Tuesday'], gemstone: 'Diamond' },
    description: 'Aries blazes like the first spark of the cosmos — fearless, pioneering, and full of raw energy.',
  },
  {
    id: 'taurus',
    name: 'Taurus',
    symbol: '♉',
    emoji: '🐂',
    dateRange: 'Apr 20 – May 20',
    element: 'earth',
    modality: 'fixed',
    rulingPlanet: 'Venus',
    rulingPlanetImage: require('../../image/planets/venus.jpg'),
    color: Colors.element.earth,
    gradient: ['#8BC34A', '#33691E'],
    traits: ['Reliable', 'Patient', 'Sensual', 'Determined'],
    lucky: { numbers: [2, 6, 24], colors: ['Green', 'Pink'], days: ['Friday'], gemstone: 'Emerald' },
    description: 'Taurus stands as the bedrock of the zodiac — grounded, luxurious, and deeply connected to the Earth.',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    symbol: '♊',
    emoji: '👯',
    dateRange: 'May 21 – Jun 20',
    element: 'air',
    modality: 'mutable',
    rulingPlanet: 'Mercury',
    rulingPlanetImage: require('../../image/planets/Mercury.jpg'),
    color: Colors.element.air,
    gradient: ['#64B5F6', '#1976D2'],
    traits: ['Versatile', 'Witty', 'Curious', 'Communicative'],
    lucky: { numbers: [3, 12, 21], colors: ['Yellow', 'Silver'], days: ['Wednesday'], gemstone: 'Agate' },
    description: 'Gemini dances between worlds like starlight — dual-natured, quick-witted, and endlessly adaptable.',
  },
  {
    id: 'cancer',
    name: 'Cancer',
    symbol: '♋',
    emoji: '🦀',
    dateRange: 'Jun 21 – Jul 22',
    element: 'water',
    modality: 'cardinal',
    rulingPlanet: 'Moon',
    rulingPlanetImage: require('../../image/Moon.jpg'),
    color: Colors.element.water,
    gradient: ['#7E57C2', '#4527A0'],
    traits: ['Intuitive', 'Nurturing', 'Protective', 'Empathetic'],
    lucky: { numbers: [2, 7, 11], colors: ['White', 'Silver'], days: ['Monday'], gemstone: 'Moonstone' },
    description: 'Cancer flows like the tides guided by the Moon — deeply emotional, intuitive, and fiercely protective.',
  },
  {
    id: 'leo',
    name: 'Leo',
    symbol: '♌',
    emoji: '🦁',
    dateRange: 'Jul 23 – Aug 22',
    element: 'fire',
    modality: 'fixed',
    rulingPlanet: 'Sun',
    rulingPlanetImage: require('../../image/sun.jpg'),
    color: '#FFB300',
    gradient: ['#FFB300', '#E65100'],
    traits: ['Charismatic', 'Creative', 'Generous', 'Regal'],
    lucky: { numbers: [1, 5, 19], colors: ['Gold', 'Orange'], days: ['Sunday'], gemstone: 'Ruby' },
    description: 'Leo shines like the Sun at the center of the solar system — radiant, powerful, and impossible to ignore.',
  },
  {
    id: 'virgo',
    name: 'Virgo',
    symbol: '♍',
    emoji: '👩‍🌾',
    dateRange: 'Aug 23 – Sep 22',
    element: 'earth',
    modality: 'mutable',
    rulingPlanet: 'Mercury',
    rulingPlanetImage: require('../../image/planets/Mercury.jpg'),
    color: '#66BB6A',
    gradient: ['#66BB6A', '#2E7D32'],
    traits: ['Analytical', 'Precise', 'Helpful', 'Diligent'],
    lucky: { numbers: [5, 14, 23], colors: ['Beige', 'Navy'], days: ['Wednesday'], gemstone: 'Sapphire' },
    description: 'Virgo maps the cosmos with precision — methodical, devoted, and extraordinarily discerning.',
  },
  {
    id: 'libra',
    name: 'Libra',
    symbol: '♎',
    emoji: '⚖️',
    dateRange: 'Sep 23 – Oct 22',
    element: 'air',
    modality: 'cardinal',
    rulingPlanet: 'Venus',
    rulingPlanetImage: require('../../image/planets/venus.jpg'),
    color: '#EC407A',
    gradient: ['#EC407A', '#880E4F'],
    traits: ['Balanced', 'Diplomatic', 'Social', 'Fair'],
    lucky: { numbers: [6, 15, 24], colors: ['Pink', 'Blue'], days: ['Friday'], gemstone: 'Opal' },
    description: 'Libra holds the cosmic scales — forever seeking beauty, justice, and perfect harmony.',
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    symbol: '♏',
    emoji: '🦂',
    dateRange: 'Oct 23 – Nov 21',
    element: 'water',
    modality: 'fixed',
    rulingPlanet: 'Mars',
    rulingPlanetImage: require('../../image/planets/Mars.jpg'),
    color: '#7B1FA2',
    gradient: ['#7B1FA2', '#1A0A2E'],
    traits: ['Intense', 'Magnetic', 'Perceptive', 'Transformative'],
    lucky: { numbers: [8, 11, 18], colors: ['Black', 'Crimson'], days: ['Tuesday'], gemstone: 'Topaz' },
    description: 'Scorpio plunges into the cosmic abyss — mysterious, transformative, and wielding immense hidden power.',
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    symbol: '♐',
    emoji: '🏹',
    dateRange: 'Nov 22 – Dec 21',
    element: 'fire',
    modality: 'mutable',
    rulingPlanet: 'Jupiter',
    rulingPlanetImage: require('../../image/planets/Jupiter .jpg'),
    color: '#FF7043',
    gradient: ['#FF7043', '#BF360C'],
    traits: ['Adventurous', 'Optimistic', 'Philosophical', 'Free-spirited'],
    lucky: { numbers: [3, 9, 27], colors: ['Purple', 'Blue'], days: ['Thursday'], gemstone: 'Turquoise' },
    description: 'Sagittarius shoots its arrow toward the stars — expansive, freedom-loving, and eternally seeking truth.',
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    symbol: '♑',
    emoji: '🐐',
    dateRange: 'Dec 22 – Jan 19',
    element: 'earth',
    modality: 'cardinal',
    rulingPlanet: 'Saturn',
    rulingPlanetImage: require('../../image/planets/saturn.jpg'),
    color: '#78909C',
    gradient: ['#78909C', '#263238'],
    traits: ['Ambitious', 'Disciplined', 'Patient', 'Responsible'],
    lucky: { numbers: [4, 8, 13], colors: ['Brown', 'Black'], days: ['Saturday'], gemstone: 'Garnet' },
    description: 'Capricorn climbs the cosmic mountain under Saturn\'s stern gaze — steadfast, strategic, and destined for greatness.',
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    symbol: '♒',
    emoji: '🏺',
    dateRange: 'Jan 20 – Feb 18',
    element: 'air',
    modality: 'fixed',
    rulingPlanet: 'Uranus',
    rulingPlanetImage: require('../../image/planets/uranus.jpg'),
    color: '#29B6F6',
    gradient: ['#29B6F6', '#0277BD'],
    traits: ['Innovative', 'Humanitarian', 'Eccentric', 'Visionary'],
    lucky: { numbers: [4, 11, 22], colors: ['Turquoise', 'Electric Blue'], days: ['Saturday'], gemstone: 'Amethyst' },
    description: 'Aquarius pours cosmic wisdom into the universe — revolutionary, unconventional, and ahead of its time.',
  },
  {
    id: 'pisces',
    name: 'Pisces',
    symbol: '♓',
    emoji: '🐟',
    dateRange: 'Feb 19 – Mar 20',
    element: 'water',
    modality: 'mutable',
    rulingPlanet: 'Neptune',
    rulingPlanetImage: require('../../image/planets/neptune.jpg'),
    color: '#5C6BC0',
    gradient: ['#5C6BC0', '#1A237E'],
    traits: ['Intuitive', 'Dreamy', 'Compassionate', 'Artistic'],
    lucky: { numbers: [3, 7, 12], colors: ['Sea Green', 'Mauve'], days: ['Thursday'], gemstone: 'Aquamarine' },
    description: 'Pisces dissolves into the cosmic ocean — boundless, compassionate, and deeply connected to the unseen.',
  },
];

export const ZodiacData = {
  getByDate: (month: number, day: number): ZodiacSign | undefined => {
    const ranges: { [key: string]: [number, number, number, number] } = {
      aries:       [3, 21, 4, 19],
      taurus:      [4, 20, 5, 20],
      gemini:      [5, 21, 6, 20],
      cancer:      [6, 21, 7, 22],
      leo:         [7, 23, 8, 22],
      virgo:       [8, 23, 9, 22],
      libra:       [9, 23, 10, 22],
      scorpio:     [10, 23, 11, 21],
      sagittarius: [11, 22, 12, 21],
      capricorn:   [12, 22, 1, 19],
      aquarius:    [1, 20, 2, 18],
      pisces:      [2, 19, 3, 20],
    };

    for (const sign of ZODIAC_SIGNS) {
      const [sm, sd, em, ed] = ranges[sign.id];
      if (sm <= em) {
        if ((month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em)) {
          return sign;
        }
      } else {
        if ((month === sm && day >= sd) || (month === em && day <= ed) || month > sm || month < em) {
          return sign;
        }
      }
    }
    return undefined;
  },

  getLuckyNumber: (dob: Date): number => {
    const dateStr = `${dob.getDate()}${dob.getMonth() + 1}${dob.getFullYear()}`;
    let sum = dateStr.split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    while (sum > 9) {
      sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    }
    return sum;
  },

  getLifePathNumber: (dob: Date): number => {
    return ZodiacData.getLuckyNumber(dob);
  },
};
