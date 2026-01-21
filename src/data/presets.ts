/**
 * Preset comparisons for educational demonstrations
 *
 * Each preset highlights a surprising fact about Mercator distortion
 */

export interface Preset {
  id: string
  name: string
  description: string
  emoji: string
  countries: string[] // ISO A3 codes
  targetLatitude: number
  facts: string[]
}

export const PRESETS: Preset[] = [
  {
    id: 'greenland-reality',
    name: 'Greenland Reality Check',
    description: 'Greenland looks huge, but is it really?',
    emoji: '🇬🇱',
    countries: ['GRL'], // Greenland
    targetLatitude: 0,
    facts: [
      'Greenland appears 14× larger than its true size on Mercator maps',
      'At true size, Greenland is smaller than Algeria',
      'Africa is actually 14× larger than Greenland',
    ],
  },
  {
    id: 'alaska-brazil',
    name: 'Alaska vs Brazil',
    description: 'They look similar in size, but are they?',
    emoji: '🇺🇸',
    countries: ['USA'], // Will select Alaska (whole USA for now)
    targetLatitude: -10,
    facts: [
      'Alaska appears as large as Brazil on Mercator maps',
      'Brazil is actually 5× larger than Alaska',
      'Brazil is larger than the contiguous 48 US states',
    ],
  },
  {
    id: 'russia-stretch',
    name: 'Russia at the Equator',
    description: 'The largest country... or is it?',
    emoji: '🇷🇺',
    countries: ['RUS'], // Russia
    targetLatitude: 0,
    facts: [
      'Russia spans 11 time zones but appears even larger on Mercator',
      'At the equator, Russia would appear 40% smaller',
      'Russia is still the largest country, but not by as much as maps suggest',
    ],
  },
  {
    id: 'africa-massive',
    name: 'Africa is Massive',
    description: 'The second-largest continent is often underestimated',
    emoji: '🌍',
    countries: ['GRL', 'USA', 'CHN', 'IND'], // Countries to compare
    targetLatitude: 5, // Near equator where Africa is
    facts: [
      'Africa can fit USA, China, India, and Europe combined',
      'Africa is 3× the size of Europe',
      'Africa contains 54 countries',
    ],
  },
  {
    id: 'scandinavia-truth',
    name: 'Scandinavian Surprise',
    description: 'Northern countries appear larger than they are',
    emoji: '🇳🇴',
    countries: ['NOR', 'SWE', 'FIN'], // Norway, Sweden, Finland
    targetLatitude: 0,
    facts: [
      'Scandinavia appears twice as large as it is on Mercator',
      'Combined, all Nordic countries are smaller than India',
      'Norway has more coastline than the entire African continent',
    ],
  },
  {
    id: 'australia-fit',
    name: 'Things That Fit in Australia',
    description: 'Australia is bigger than you think',
    emoji: '🇦🇺',
    countries: ['FRA', 'DEU', 'ESP'], // France, Germany, Spain
    targetLatitude: -25, // Australia's latitude
    facts: [
      'Australia is the 6th largest country in the world',
      'Western Europe fits inside Australia',
      'Australia is wider than the Moon',
    ],
  },
  {
    id: 'canada-stretch',
    name: 'Canada Reality',
    description: 'The second-largest country... adjusted',
    emoji: '🇨🇦',
    countries: ['CAN'], // Canada
    targetLatitude: 0,
    facts: [
      'Canada spans 6 time zones',
      'At the equator, Canada appears about 40% smaller',
      'Canada has more lakes than the rest of the world combined',
    ],
  },
  {
    id: 'antarctica-extreme',
    name: 'Antarctica Distortion',
    description: 'Extreme polar distortion example',
    emoji: '🐧',
    countries: ['ATA'], // Antarctica (may not be in dataset)
    targetLatitude: -30,
    facts: [
      'Antarctica appears enormous on Mercator but is 5th largest continent',
      'Antarctica is smaller than Russia',
      'Antarctica contains 90% of Earth\'s ice',
    ],
  },
]

/**
 * Get a preset by ID
 */
export function getPresetById(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id)
}

/**
 * Get random preset
 */
export function getRandomPreset(): Preset {
  return PRESETS[Math.floor(Math.random() * PRESETS.length)]
}

/**
 * Get presets that include a specific country
 */
export function getPresetsForCountry(countryCode: string): Preset[] {
  return PRESETS.filter((p) => p.countries.includes(countryCode))
}
