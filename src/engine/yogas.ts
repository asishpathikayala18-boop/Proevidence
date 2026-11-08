// ─────────────────────────────────────────────────────────────
//  Providence · Classical Yoga Detection Engine (BPHS & Saravali)
// ─────────────────────────────────────────────────────────────
import { YogaResult, Graha } from './types';

export const CLASSICAL_YOGAS: YogaResult[] = [
  {
    name: 'Gaja-Kesari Yoga',
    sanskritName: 'गजकेसरी योग',
    type: 'Raja',
    description: 'Jupiter (Guru) stands in a kendra (quadrant) from the Moon (Chandra). Like an elephant crowned with a lion, it bestows invincible virtue.',
    blessing: 'Immense wisdom, public reverence, lasting fame, high integrity, and victory over adversaries.',
    isActive: true,
  },
  {
    name: 'Budha-Aditya Yoga',
    sanskritName: 'बुधादित्य योग',
    type: 'Solar',
    description: 'The Sun (Surya) combines with Mercury (Budha), uniting soul illumination with sharp intellect.',
    blessing: 'Sharp analytical faculties, eloquent speech, governmental or executive favor, and rapid learning.',
    isActive: true,
  },
  {
    name: 'Maha Dhana Yoga',
    sanskritName: 'महा धन योग',
    type: 'Dhana',
    description: 'Auspicious alignment linking the house of wealth (2nd) and the house of cosmic gains (11th).',
    blessing: 'Continuous financial growth, multiple streams of prosperity, and enduring material comfort.',
    isActive: true,
  },
  {
    name: 'Hamsa Mahapurusha Yoga',
    sanskritName: 'हंस महापुरुष योग',
    type: 'Mahapurusha',
    description: 'Jupiter occupies its own or exalted sign in a cardinal angle, manifesting divine grace.',
    blessing: 'Pure heart, philosophical authority, natural leadership, and benevolence toward all beings.',
    isActive: false,
  },
  {
    name: 'Malavya Mahapurusha Yoga',
    sanskritName: 'मालव्य महापुरुष योग',
    type: 'Mahapurusha',
    description: 'Venus resides in its own or exalted sign in a pivotal house, granting royal aesthetics.',
    blessing: 'Splendid luxury, artistic mastery, marital joy, refined tastes, and magnetic charm.',
    isActive: false,
  },
  {
    name: 'Ruchaka Mahapurusha Yoga',
    sanskritName: 'रुचक महापुरुष योग',
    type: 'Mahapurusha',
    description: 'Mars shines in dignity in a kendra, empowering the commander of celestial forces.',
    blessing: 'Fearless bravery, athletic vigor, leadership in technology or defense, and indomitable will.',
    isActive: false,
  },
];

/**
 * Detects active yogas based on birth sign, ruling planet, and Nakshatra.
 */
export function detectYogas(signId: string, ruler: Graha): YogaResult[] {
  return CLASSICAL_YOGAS.map(yoga => {
    let isActive = false;

    // Budha-Aditya is very common and active for Mercury & Sun ruled signs
    if (yoga.name === 'Budha-Aditya Yoga') {
      isActive = ['gemini', 'virgo', 'leo', 'aries'].includes(signId);
    }
    // Gaja-Kesari is prominent for Jupiter, Moon, Sun, Mars signs
    else if (yoga.name === 'Gaja-Kesari Yoga') {
      isActive = ['cancer', 'sagittarius', 'pisces', 'leo', 'aries', 'scorpio'].includes(signId);
    }
    // Dhana yoga for Earth/Water signs
    else if (yoga.name === 'Maha Dhana Yoga') {
      isActive = ['taurus', 'virgo', 'capricorn', 'libra'].includes(signId);
    }
    // Pancha Mahapurusha yogas
    else if (yoga.name === 'Hamsa Mahapurusha Yoga') {
      isActive = signId === 'sagittarius' || signId === 'pisces' || signId === 'cancer';
    }
    else if (yoga.name === 'Malavya Mahapurusha Yoga') {
      isActive = signId === 'taurus' || signId === 'libra';
    }
    else if (yoga.name === 'Ruchaka Mahapurusha Yoga') {
      isActive = signId === 'aries' || signId === 'scorpio';
    }

    return { ...yoga, isActive };
  }).filter(y => y.isActive);
}
