import type { GradientStop, GradientType, GradientDirection, ImageFit, FontWeight } from './logo'

// ── Platform & Category ──

export type AssetPlatform = 'googlePlay' | 'appStore' | 'general'
export type AssetCategory = 'marketing' | 'screenshot'

// ── Store Asset Spec (fixed size requirements from stores) ──

export interface StoreAssetSpec {
  id: string
  platform: AssetPlatform
  category: AssetCategory
  name: string
  nameKey: string // i18n key
  width: number
  height: number
  required: boolean
  description: string
}

// ── Template Building Blocks ──

export type TextRole = 'title' | 'subtitle' | 'badge'

export interface TemplateTextBlock {
  id: string
  role: TextRole
  defaultTextKey: string // i18n key
  /** Relative rect (0–1) within canvas */
  x: number
  y: number
  width: number
  height: number
  fontWeight: FontWeight
  color: string
  align: CanvasTextAlign
  maxLines: number
}

export interface TemplateImageSlot {
  id: string
  role: 'screenshot' | 'logo' | 'background'
  /** Relative rect (0–1) within canvas */
  x: number
  y: number
  width: number
  height: number
  fit: ImageFit
  /** Device frame ID (Step 5-3) – null means no frame */
  deviceFrame?: string
}

// ── Template Definition ──

export interface AssetTemplate {
  id: string
  name: string
  nameKey: string // i18n key
  compatibleCategories: AssetCategory[]
  backgroundColor: string
  useGradient: boolean
  gradientType: GradientType
  gradientDirection: GradientDirection
  gradientStops: GradientStop[]
  textBlocks: TemplateTextBlock[]
  imageSlots: TemplateImageSlot[]
}

// ── Per-block style override ──

export interface TextStyleOverride {
  fontFamily?: string
  fontWeight?: FontWeight
  color?: string
}

// ── Export format for asset ──

export type AssetExportFormat = 'png' | 'jpg'

// ── Editor Runtime State ──

export interface AssetEditorState {
  selectedSpecId: string | null
  selectedTemplateId: string | null

  // Text overrides keyed by TemplateTextBlock.id
  textOverrides: Record<string, string>

  // Per-block style overrides keyed by TemplateTextBlock.id
  textStyleOverrides: Record<string, TextStyleOverride>

  // Image data URLs keyed by TemplateImageSlot.id
  imageOverrides: Record<string, string | null>

  // Background overrides
  backgroundColor: string
  useGradient: boolean
  gradientType: GradientType
  gradientDirection: GradientDirection
  gradientStops: GradientStop[]

  // Export
  exportFormat: AssetExportFormat
}
