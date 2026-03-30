// Logo mode
export type LogoMode = 'textOnly' | 'imageOnly' | 'textImage' | 'svgOnly'

// Background shape
export type BackgroundShape = 'rectangle' | 'circle'

// Gradient direction (linear)
export type GradientDirection =
  | 'topToBottom' | 'bottomToTop'
  | 'leftToRight' | 'rightToLeft'
  | 'topLeftToBottomRight' | 'topRightToBottomLeft'
  | 'bottomLeftToTopRight' | 'bottomRightToTopLeft'

// Gradient type
export type GradientType = 'linear' | 'radial'

// Gradient stop
export interface GradientStop {
  color: string
  position: number // 0~1
}

// Image fit mode
export type ImageFit = 'contain' | 'cover' | 'fill'

// Image position
export type ImagePosition = 'top' | 'bottom' | 'left' | 'right'

// Font weight
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

// Export format
export type ExportFormat = 'png' | 'jpg' | 'svg' | 'ico'

// Export scale
export type ExportScale = 1 | 2 | 3 | 4

// Text shadow
export interface TextShadow {
  enabled: boolean
  color: string
  offsetX: number
  offsetY: number
  blur: number
}

// Text stroke
export interface TextStroke {
  enabled: boolean
  color: string
  width: number
}

// Sub text
export interface SubText {
  enabled: boolean
  text: string
  fontFamily: string
  fontWeight: FontWeight
  color: string
  position: 'above' | 'below'
}

// Logo state
export interface LogoState {
  schemaVersion: number

  // Mode
  mode: LogoMode

  // Text
  text1: string
  text2: string
  text3: string
  textLines: 1 | 2 | 3
  fontFamily: string
  fontWeight: FontWeight
  textColor: string
  textPadding: number // 0~90, step 5 (%)
  italic: boolean
  uppercase: boolean
  underline: boolean
  rotation: number // 0~360
  letterSpacing: number // px
  lineHeight: number // multiplier

  // Text effects
  shadow: TextShadow
  stroke: TextStroke

  // Sub text
  subText: SubText

  // Background
  backgroundColor: string
  backgroundShape: BackgroundShape
  isTransparent: boolean
  canvasPadding: number // 0~90, step 5 (%)
  borderRadius: number // 0~100 (px)

  // Gradient
  useGradient: boolean
  gradientType: GradientType
  gradientDirection: GradientDirection
  gradientStops: GradientStop[]

  // Radial advanced (후순위)
  gradientCenterX?: number
  gradientCenterY?: number
  gradientRadius?: number
  gradientFocalX?: number
  gradientFocalY?: number

  // Image
  imagePosition: ImagePosition
  imageFlex: number // 10~90
  imageGap: number // 0~50
  imageFit: ImageFit

  // Canvas size
  canvasWidth: number
  canvasHeight: number

  // Export
  exportFormat: ExportFormat
  exportScale: ExportScale
}

// Size preset
export interface SizePreset {
  name: string
  width: number
  height: number
}

// Device group
export interface DeviceGroup {
  platform: string
  sizes: SizePreset[]
}

// Color preset
export interface ColorPreset {
  name: string
  backgroundColor: string
  textColor: string
}
