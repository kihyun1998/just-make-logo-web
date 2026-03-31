import type { AssetTemplate, AssetEditorState, TemplateTextBlock } from '@/types/asset'
import {
  drawCheckerboard,
  buildCanvasGradient,
  fitText,
  drawImageFit,
} from './canvas-utils'

export interface AssetRenderOptions {
  checkerboard?: boolean
  /** Loaded images keyed by slot id */
  images?: Record<string, HTMLImageElement>
}

/**
 * Render an asset onto a canvas context using template + editor state.
 */
export function renderAsset(
  ctx: CanvasRenderingContext2D,
  template: AssetTemplate,
  editorState: AssetEditorState,
  width: number,
  height: number,
  options: AssetRenderOptions = {},
) {
  ctx.clearRect(0, 0, width, height)

  if (options.checkerboard) {
    drawCheckerboard(ctx, width, height)
  }

  // Background
  drawAssetBackground(ctx, template, editorState, width, height)

  // Image slots
  for (const slot of template.imageSlots) {
    const img = options.images?.[slot.id]
    if (!img) continue

    const sx = slot.x * width
    const sy = slot.y * height
    const sw = slot.width * width
    const sh = slot.height * height

    drawImageFit(ctx, img, sx, sy, sw, sh, slot.fit)
  }

  // Text blocks
  for (const block of template.textBlocks) {
    const text = editorState.textOverrides[block.id] || getDefaultText(block)
    if (!text) continue

    const bx = block.x * width
    const by = block.y * height
    const bw = block.width * width
    const bh = block.height * height

    drawTemplateText(ctx, block, text, bx, by, bw, bh)
  }
}

// ── Background ──

function drawAssetBackground(
  ctx: CanvasRenderingContext2D,
  template: AssetTemplate,
  editorState: AssetEditorState,
  w: number,
  h: number,
) {
  const useGradient = editorState.useGradient
  const stops = editorState.gradientStops

  if (useGradient && stops.length >= 2) {
    ctx.fillStyle = buildCanvasGradient(ctx, {
      gradientType: editorState.gradientType,
      gradientDirection: editorState.gradientDirection,
      gradientStops: stops,
    }, w, h)
  } else {
    ctx.fillStyle = editorState.backgroundColor
  }

  ctx.fillRect(0, 0, w, h)
}

// ── Template text rendering ──

function drawTemplateText(
  ctx: CanvasRenderingContext2D,
  block: TemplateTextBlock,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  if (w <= 0 || h <= 0) return

  const lines = splitTextLines(text, block.maxLines)
  if (lines.length === 0) return

  const fontFamily = 'Inter'
  const lineHeight = 1.3
  const fontSize = fitText(ctx, lines, w, h, '', block.fontWeight, fontFamily, 0, lineHeight)
  if (fontSize <= 0) return

  ctx.font = `${block.fontWeight} ${fontSize}px "${fontFamily}"`
  ctx.fillStyle = block.color
  ctx.textBaseline = 'top'
  ctx.textAlign = block.align

  const lineStep = fontSize * lineHeight
  const totalH = lines.length === 1 ? fontSize : fontSize + lineStep * (lines.length - 1)
  const startY = y + (h - totalH) / 2

  let anchorX: number
  if (block.align === 'center') anchorX = x + w / 2
  else if (block.align === 'right') anchorX = x + w
  else anchorX = x

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], anchorX, startY + i * lineStep)
  }
}

// ── Helpers ──

function getDefaultText(block: TemplateTextBlock): string {
  // Fallback texts when no i18n is available at render time
  const fallbacks: Record<string, string> = {
    'asset.default.appName': 'App Name',
    'asset.default.tagline': 'Your tagline here',
    'asset.default.badge': 'Available Now',
    'asset.default.featureTitle': 'Feature Title',
    'asset.default.featureDesc': 'Description goes here',
  }
  return fallbacks[block.defaultTextKey] ?? block.defaultTextKey
}

function splitTextLines(text: string, maxLines: number): string[] {
  const lines = text.split('\n').slice(0, maxLines)
  return lines.filter((l) => l.length > 0)
}
