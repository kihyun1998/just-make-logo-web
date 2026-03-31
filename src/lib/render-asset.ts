import type { AssetTemplate, AssetEditorState, TemplateTextBlock, TextStyleOverride } from '@/types/asset'
import type { DeviceFrameDefinition } from '@/data/device-frames'
import { getDeviceFrame } from '@/data/device-frames'
import {
  drawCheckerboard,
  buildCanvasGradient,
  fitText,
  drawImageFit,
  drawRoundedRect,
} from './canvas-utils'

export interface AssetRenderOptions {
  checkerboard?: boolean
  /** Loaded images keyed by slot id */
  images?: Record<string, HTMLImageElement>
  /** Pre-loaded device frame images keyed by frame ID */
  frameSvgs?: Record<string, HTMLImageElement>
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

    const sx = slot.x * width
    const sy = slot.y * height
    const sw = slot.width * width
    const sh = slot.height * height

    // Resolve device frame
    const frameOverride = editorState.deviceFrameOverrides?.[slot.id]
    const frameId = frameOverride?.frameId ?? slot.deviceFrame ?? null
    const frameDef = frameId ? getDeviceFrame(frameId) : null
    const frameImg = frameId ? options.frameSvgs?.[frameId] : null

    if (frameDef && frameImg) {
      drawDeviceMockup(ctx, img ?? null, frameDef, frameImg, sx, sy, sw, sh)
    } else if (img) {
      drawImageFit(ctx, img, sx, sy, sw, sh, slot.fit)
    }
  }

  // Text blocks
  for (const block of template.textBlocks) {
    const text = editorState.textOverrides[block.id] || getDefaultText(block)
    if (!text) continue

    const bx = block.x * width
    const by = block.y * height
    const bw = block.width * width
    const bh = block.height * height

    const styleOverride = editorState.textStyleOverrides?.[block.id]
    drawTemplateText(ctx, block, text, bx, by, bw, bh, styleOverride)
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

// ── Device mockup compositing ──

function drawDeviceMockup(
  ctx: CanvasRenderingContext2D,
  screenshotImg: HTMLImageElement | null,
  frameDef: DeviceFrameDefinition,
  frameImg: HTMLImageElement,
  slotX: number,
  slotY: number,
  slotW: number,
  slotH: number,
) {
  // Contain-fit the frame within the slot rect
  const frameAspect = frameDef.viewBoxWidth / frameDef.viewBoxHeight
  const slotAspect = slotW / slotH
  let drawW: number, drawH: number

  if (frameAspect > slotAspect) {
    drawW = slotW
    drawH = slotW / frameAspect
  } else {
    drawH = slotH
    drawW = slotH * frameAspect
  }
  const drawX = slotX + (slotW - drawW) / 2
  const drawY = slotY + (slotH - drawH) / 2

  // Scale factor from viewBox to drawn size
  const scaleX = drawW / frameDef.viewBoxWidth
  const scaleY = drawH / frameDef.viewBoxHeight

  // Screen area in canvas coordinates
  const screenX = drawX + frameDef.screen.x * scaleX
  const screenY = drawY + frameDef.screen.y * scaleY
  const screenW = frameDef.screen.width * scaleX
  const screenH = frameDef.screen.height * scaleY
  const screenR = frameDef.screenRadius * Math.min(scaleX, scaleY)

  // 1. Draw screenshot into screen area (clipped with rounded corners)
  if (screenshotImg) {
    ctx.save()
    if (screenR > 0) {
      drawRoundedRect(ctx, screenX, screenY, screenW, screenH, screenR)
      ctx.clip()
    } else {
      ctx.beginPath()
      ctx.rect(screenX, screenY, screenW, screenH)
      ctx.clip()
    }
    drawImageFit(ctx, screenshotImg, screenX, screenY, screenW, screenH, 'cover')
    ctx.restore()
  }

  // 2. Draw device frame on top
  ctx.drawImage(frameImg, drawX, drawY, drawW, drawH)
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
  styleOverride?: TextStyleOverride,
) {
  if (w <= 0 || h <= 0) return

  const lines = splitTextLines(text, block.maxLines)
  if (lines.length === 0) return

  const fontFamily = styleOverride?.fontFamily || 'Inter'
  const fontWeight = styleOverride?.fontWeight || block.fontWeight
  const color = styleOverride?.color || block.color
  const lineHeight = 1.3
  const fontSize = fitText(ctx, lines, w, h, '', fontWeight, fontFamily, 0, lineHeight)
  if (fontSize <= 0) return

  ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}"`
  ctx.fillStyle = color
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
