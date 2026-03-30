import type { SizePreset, DeviceGroup } from '@/types/logo'

// Quick color presets
export const QUICK_COLORS = [
  '#FFFFFF', // white
  '#000000', // black
  '#EF4444', // red
  '#3B82F6', // blue
  '#EAB308', // yellow
  '#22C55E', // green
]

// Gradient presets
export const GRADIENT_PRESETS = [
  { name: 'Sunset', stops: [{ color: '#FF512F', position: 0 }, { color: '#F09819', position: 1 }] },
  { name: 'Ocean', stops: [{ color: '#2193B0', position: 0 }, { color: '#6DD5ED', position: 1 }] },
  { name: 'Mint', stops: [{ color: '#00B09B', position: 0 }, { color: '#96C93D', position: 1 }] },
  { name: 'Peach', stops: [{ color: '#ED4264', position: 0 }, { color: '#FFEDBC', position: 1 }] },
  { name: 'Night', stops: [{ color: '#232526', position: 0 }, { color: '#414345', position: 1 }] },
  { name: 'Berry', stops: [{ color: '#8E2DE2', position: 0 }, { color: '#4A00E0', position: 1 }] },
  { name: 'Fire', stops: [{ color: '#FF416C', position: 0 }, { color: '#FF4B2B', position: 1 }] },
  { name: 'Sky', stops: [{ color: '#56CCF2', position: 0 }, { color: '#2F80ED', position: 1 }] },
  { name: 'Lime', stops: [{ color: '#B2FF59', position: 0 }, { color: '#69F0AE', position: 1 }] },
  { name: 'Royal', stops: [{ color: '#141E30', position: 0 }, { color: '#243B55', position: 1 }] },
]

// General size presets
export const SIZE_PRESETS: SizePreset[] = [
  { name: '16x16', width: 16, height: 16 },
  { name: '32x32', width: 32, height: 32 },
  { name: '48x48', width: 48, height: 48 },
  { name: '96x96', width: 96, height: 96 },
  { name: '128x128', width: 128, height: 128 },
  { name: '192x192', width: 192, height: 192 },
  { name: '256x256', width: 256, height: 256 },
  { name: '512x512', width: 512, height: 512 },
  { name: '1024x1024', width: 1024, height: 1024 },
  { name: '1280x720', width: 1280, height: 720 },
  { name: '1920x1080', width: 1920, height: 1080 },
]

// Device group presets
export const DEVICE_GROUPS: DeviceGroup[] = [
  {
    platform: 'Android',
    sizes: [
      { name: 'mdpi', width: 48, height: 48 },
      { name: 'hdpi', width: 72, height: 72 },
      { name: 'xhdpi', width: 96, height: 96 },
      { name: 'xxhdpi', width: 144, height: 144 },
      { name: 'xxxhdpi', width: 192, height: 192 },
      { name: 'playstore', width: 512, height: 512 },
    ],
  },
  {
    platform: 'iOS',
    sizes: [
      { name: '20pt', width: 20, height: 20 },
      { name: '20pt @2x', width: 40, height: 40 },
      { name: '20pt @3x', width: 60, height: 60 },
      { name: '29pt', width: 29, height: 29 },
      { name: '29pt @2x', width: 58, height: 58 },
      { name: '29pt @3x', width: 87, height: 87 },
      { name: '40pt', width: 40, height: 40 },
      { name: '40pt @2x', width: 80, height: 80 },
      { name: '40pt @3x', width: 120, height: 120 },
      { name: '60pt @2x', width: 120, height: 120 },
      { name: '60pt @3x', width: 180, height: 180 },
      { name: '76pt', width: 76, height: 76 },
      { name: '76pt @2x', width: 152, height: 152 },
      { name: '83.5pt @2x', width: 167, height: 167 },
      { name: '512pt', width: 512, height: 512 },
      { name: '512pt @2x', width: 1024, height: 1024 },
      { name: 'App Store', width: 1024, height: 1024 },
    ],
  },
  {
    platform: 'Web',
    sizes: [
      { name: 'favicon', width: 16, height: 16 },
      { name: 'favicon-32', width: 32, height: 32 },
      { name: 'apple-touch', width: 180, height: 180 },
      { name: 'android-chrome-192', width: 192, height: 192 },
      { name: 'android-chrome-512', width: 512, height: 512 },
      { name: 'og-image', width: 1200, height: 630 },
    ],
  },
  {
    platform: 'macOS',
    sizes: [
      { name: '16pt', width: 16, height: 16 },
      { name: '32pt', width: 32, height: 32 },
      { name: '64pt', width: 64, height: 64 },
      { name: '128pt', width: 128, height: 128 },
      { name: '256pt', width: 256, height: 256 },
      { name: '512pt', width: 512, height: 512 },
      { name: '1024pt', width: 1024, height: 1024 },
    ],
  },
  {
    platform: 'Windows',
    sizes: [
      { name: '16pt', width: 16, height: 16 },
      { name: '24pt', width: 24, height: 24 },
      { name: '32pt', width: 32, height: 32 },
      { name: '48pt', width: 48, height: 48 },
      { name: '64pt', width: 64, height: 64 },
      { name: '256pt', width: 256, height: 256 },
    ],
  },
]
