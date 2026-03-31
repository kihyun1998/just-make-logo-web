export interface DeviceFrameDefinition {
  id: string
  name: string
  /** Path to SVG file in public/device-frames/ */
  svgPath: string
  /** Canonical viewBox dimensions */
  viewBoxWidth: number
  viewBoxHeight: number
  /** Screen area within the viewBox (absolute px in viewBox coords) */
  screen: { x: number; y: number; width: number; height: number }
  /** Screen corner radius within the frame */
  screenRadius: number
  /** Default bezel color */
  defaultColor: string
  /** Compatible device type */
  compatibleType: 'phone' | 'tablet'
}

export const DEVICE_FRAMES: DeviceFrameDefinition[] = [
  {
    id: 'frame-iphone-15',
    name: 'iPhone 15 Pro',
    svgPath: '/device-frames/frame-iphone-15.svg',
    viewBoxWidth: 380,
    viewBoxHeight: 780,
    screen: { x: 18, y: 18, width: 344, height: 744 },
    screenRadius: 40,
    defaultColor: '#1A1A1A',
    compatibleType: 'phone',
  },
  {
    id: 'frame-iphone-se',
    name: 'iPhone SE',
    svgPath: '/device-frames/frame-iphone-se.svg',
    viewBoxWidth: 380,
    viewBoxHeight: 780,
    screen: { x: 22, y: 100, width: 336, height: 580 },
    screenRadius: 0,
    defaultColor: '#E0E0E0',
    compatibleType: 'phone',
  },
  {
    id: 'frame-pixel-8',
    name: 'Pixel 8',
    svgPath: '/device-frames/frame-pixel-8.svg',
    viewBoxWidth: 380,
    viewBoxHeight: 780,
    screen: { x: 16, y: 16, width: 348, height: 748 },
    screenRadius: 36,
    defaultColor: '#2A2A2A',
    compatibleType: 'phone',
  },
  {
    id: 'frame-galaxy-s24',
    name: 'Galaxy S24',
    svgPath: '/device-frames/frame-galaxy-s24.svg',
    viewBoxWidth: 380,
    viewBoxHeight: 780,
    screen: { x: 14, y: 14, width: 352, height: 752 },
    screenRadius: 34,
    defaultColor: '#1C1C1C',
    compatibleType: 'phone',
  },
  {
    id: 'frame-ipad-pro',
    name: 'iPad Pro',
    svgPath: '/device-frames/frame-ipad-pro.svg',
    viewBoxWidth: 560,
    viewBoxHeight: 780,
    screen: { x: 20, y: 20, width: 520, height: 740 },
    screenRadius: 16,
    defaultColor: '#2C2C2C',
    compatibleType: 'tablet',
  },
]

/** Frame color presets */
export const FRAME_COLOR_PRESETS = [
  { name: 'Black', color: '#1A1A1A' },
  { name: 'White', color: '#F5F5F5' },
  { name: 'Silver', color: '#C0C0C0' },
  { name: 'Gold', color: '#D4A574' },
  { name: 'Space Gray', color: '#4A4A4A' },
]

export function getDeviceFrame(id: string): DeviceFrameDefinition | undefined {
  return DEVICE_FRAMES.find((f) => f.id === id)
}

export function getCompatibleFrames(type: 'phone' | 'tablet'): DeviceFrameDefinition[] {
  return DEVICE_FRAMES.filter((f) => f.compatibleType === type)
}
