import type { FontWeight } from '@/types/logo'

export interface FontData {
  family: string
  weights: FontWeight[]
}

export const FONTS: FontData[] = [
  { family: 'Workbench', weights: [400] },
  { family: 'Jersey 20', weights: [400] },
  { family: 'Noto Serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Bebas Neue', weights: [400] },
  { family: 'Pacifico', weights: [400] },
  { family: 'Lobster', weights: [400] },
  { family: 'Raleway', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Permanent Marker', weights: [400] },
  { family: 'Black Han Sans', weights: [400] },
  { family: 'Noto Sans KR', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Montserrat', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Poppins', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Inter', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Space Grotesk', weights: [300, 400, 500, 600, 700] },
  { family: 'Rubik', weights: [300, 400, 500, 600, 700, 800, 900] },
  { family: 'Outfit', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Oswald', weights: [200, 300, 400, 500, 600, 700] },
  { family: 'Anton', weights: [400] },
  { family: 'Righteous', weights: [400] },
  { family: 'Russo One', weights: [400] },
  { family: 'Orbitron', weights: [400, 500, 600, 700, 800, 900] },
  { family: 'Audiowide', weights: [400] },
  { family: 'Bungee', weights: [400] },
  { family: 'Fredoka', weights: [300, 400, 500, 600, 700] },
  { family: 'Lexend', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Nunito', weights: [200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Quicksand', weights: [300, 400, 500, 600, 700] },
  { family: 'Comfortaa', weights: [300, 400, 500, 600, 700] },
  { family: 'Rajdhani', weights: [300, 400, 500, 600, 700] },
  { family: 'Chakra Petch', weights: [300, 400, 500, 600, 700] },
  { family: 'Michroma', weights: [400] },
  { family: 'Teko', weights: [300, 400, 500, 600, 700] },
  { family: 'Electrolize', weights: [400] },
  { family: 'Exo 2', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Megrim', weights: [400] },
  { family: 'Poiret One', weights: [400] },
  { family: 'Gruppo', weights: [400] },
  { family: 'Syncopate', weights: [400, 700] },
  { family: 'Zen Dots', weights: [400] },
]

// Build Google Fonts CSS URL for a specific font + weights
export function buildGoogleFontUrl(family: string, weights: FontWeight[]): string {
  const encoded = family.replace(/ /g, '+')
  const wghtRange = weights.length === 1
    ? `wght@${weights[0]}`
    : `wght@${weights.join(';')}`
  return `https://fonts.googleapis.com/css2?family=${encoded}:${wghtRange}&display=swap`
}

// Build URL for all 39 fonts
export function buildAllFontsUrl(): string {
  const families = FONTS.map(f => {
    const encoded = f.family.replace(/ /g, '+')
    const weights = f.weights.length === 1
      ? `wght@${f.weights[0]}`
      : `wght@${f.weights.join(';')}`
    return `family=${encoded}:${weights}`
  })
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
}

// Get FontData by family name
export function getFontData(family: string): FontData | undefined {
  return FONTS.find(f => f.family === family)
}
