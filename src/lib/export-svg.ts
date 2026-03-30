import type { LogoState, GradientDirection } from '@/types/logo'
import { getTextLines } from './text-utils'

/**
 * Generate a standalone SVG string from the logo state.
 */
export function generateSvg(state: LogoState): string {
  const { canvasWidth: w, canvasHeight: h } = state
  const defs: string[] = []
  let bgFill = 'none'

  // --- Background fill ---
  if (!state.isTransparent) {
    if (state.useGradient && state.gradientStops.length >= 2) {
      const gradId = 'bg-grad'
      if (state.gradientType === 'radial') {
        const stops = state.gradientStops.map(s => `<stop offset="${s.position * 100}%" stop-color="${esc(s.color)}"/>`).join('')
        defs.push(`<radialGradient id="${gradId}" cx="50%" cy="50%" r="50%">${stops}</radialGradient>`)
      } else {
        const { x1, y1, x2, y2 } = directionToSvgCoords(state.gradientDirection)
        const stops = state.gradientStops.map(s => `<stop offset="${s.position * 100}%" stop-color="${esc(s.color)}"/>`).join('')
        defs.push(`<linearGradient id="${gradId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops}</linearGradient>`)
      }
      bgFill = `url(#${gradId})`
    } else {
      bgFill = esc(state.backgroundColor)
    }
  }

  // --- Clip path ---
  let clipAttr = ''
  if (state.backgroundShape === 'circle') {
    defs.push(`<clipPath id="shape-clip"><ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2}" ry="${h / 2}"/></clipPath>`)
    clipAttr = ' clip-path="url(#shape-clip)"'
  } else if (state.borderRadius > 0) {
    defs.push(`<clipPath id="shape-clip"><rect width="${w}" height="${h}" rx="${state.borderRadius}"/></clipPath>`)
    clipAttr = ' clip-path="url(#shape-clip)"'
  }

  // --- Background shape ---
  let bgShape = ''
  if (!state.isTransparent) {
    if (state.backgroundShape === 'circle') {
      bgShape = `<ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2}" ry="${h / 2}" fill="${bgFill}"/>`
    } else if (state.borderRadius > 0) {
      bgShape = `<rect width="${w}" height="${h}" rx="${state.borderRadius}" fill="${bgFill}"/>`
    } else {
      bgShape = `<rect width="${w}" height="${h}" fill="${bgFill}"/>`
    }
  }

  // --- Content ---
  let contentElements = ''

  if (state.mode === 'svgOnly' && state.svgContent) {
    // Wrap uploaded SVG inside the background
    const padX = (w * state.canvasPadding) / 100
    const padY = (h * state.canvasPadding) / 100
    const cw = w - padX * 2, ch = h - padY * 2
    if (cw > 0 && ch > 0) {
      contentElements = `<g transform="translate(${padX},${padY})">`
      contentElements += `<svg width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}">${state.svgContent}</svg>`
      contentElements += `</g>`
    }
  }

  if (state.mode === 'textOnly' || state.mode === 'textImage') {
    contentElements += generateTextSvg(state, w, h, defs)
  }

  // --- Font imports ---
  const fontWeightMap = new Map<string, Set<number>>()
  fontWeightMap.set(state.fontFamily, new Set([state.fontWeight]))
  if (state.subText.enabled) {
    const existing = fontWeightMap.get(state.subText.fontFamily) ?? new Set()
    existing.add(state.subText.fontWeight)
    fontWeightMap.set(state.subText.fontFamily, existing)
  }
  const fontImports = Array.from(fontWeightMap.entries())
    .map(([family, weights]) => {
      const wStr = Array.from(weights).sort((a, b) => a - b).join(';')
      return `@import url('https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${wStr}&amp;display=swap');`
    }).join('')
  const styleEl = fontImports ? `<style>${fontImports}</style>` : ''

  const defsEl = defs.length > 0 ? `<defs>${defs.join('')}</defs>` : ''

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"${clipAttr}>`,
    defsEl, styleEl, bgShape, contentElements,
    '</svg>',
  ].join('\n')
}

function generateTextSvg(state: LogoState, w: number, h: number, defs: string[]): string {
  const padX = (w * state.canvasPadding) / 100
  const padY = (h * state.canvasPadding) / 100
  const aW = w - padX * 2
  const aH = h - padY * 2
  const textPadX = (aW * state.textPadding) / 100
  const textPadY = (aH * state.textPadding) / 100
  const areaW = aW - textPadX * 2
  const areaH = aH - textPadY * 2

  if (areaW <= 0 || areaH <= 0) return ''

  const lines = getTextLines(state)
  if (lines.length === 0) return ''
  const displayLines = state.uppercase ? lines.map(l => l.toUpperCase()) : lines

  // Use binary search-like sizing: approximate based on area
  const maxLineLen = Math.max(...displayLines.map(l => l.length))
  const byWidth = maxLineLen > 0 ? areaW / (maxLineLen * 0.6) : areaH
  const byHeight = areaH / (lines.length * state.lineHeight)
  const fontSize = Math.max(8, Math.floor(Math.min(byWidth, byHeight)))

  const fontStyle = state.italic ? ' font-style="italic"' : ''
  const textDecoration = state.underline ? ' text-decoration="underline"' : ''
  const centerX = w / 2
  const lineStep = fontSize * state.lineHeight
  const totalH = lines.length === 1 ? fontSize : fontSize + lineStep * (lines.length - 1)
  const startY = padY + textPadY + (areaH - totalH) / 2

  // Shadow filter
  if (state.shadow.enabled) {
    defs.push(
      `<filter id="shadow"><feDropShadow dx="${state.shadow.offsetX}" dy="${state.shadow.offsetY}" ` +
      `stdDeviation="${state.shadow.blur / 2}" flood-color="${esc(state.shadow.color)}"/></filter>`
    )
  }
  const filterAttr = state.shadow.enabled ? ' filter="url(#shadow)"' : ''

  // Rotation
  let groupOpen = '', groupClose = ''
  if (state.rotation !== 0) {
    const cy = padY + textPadY + areaH / 2
    groupOpen = `<g transform="rotate(${state.rotation}, ${centerX}, ${cy})">`
    groupClose = '</g>'
  }

  let elements = groupOpen

  for (let i = 0; i < displayLines.length; i++) {
    const y = (i === 0 ? startY : startY + i * lineStep) + fontSize * 0.8
    if (state.stroke.enabled) {
      elements += `<text x="${centerX}" y="${y}" text-anchor="middle" font-family="${esc(state.fontFamily)}" ` +
        `font-weight="${state.fontWeight}" font-size="${fontSize}"${fontStyle}${textDecoration} ` +
        `fill="none" stroke="${esc(state.stroke.color)}" stroke-width="${state.stroke.width}" stroke-linejoin="round" ` +
        `letter-spacing="${state.letterSpacing}">${esc(displayLines[i])}</text>`
    }
    elements += `<text x="${centerX}" y="${y}" text-anchor="middle" font-family="${esc(state.fontFamily)}" ` +
      `font-weight="${state.fontWeight}" font-size="${fontSize}"${fontStyle}${textDecoration} ` +
      `fill="${esc(state.textColor)}" letter-spacing="${state.letterSpacing}"${filterAttr}>${esc(displayLines[i])}</text>`
  }

  // Sub text
  if (state.subText.enabled && state.subText.text) {
    const subSize = Math.max(8, fontSize * 0.4)
    const subY = state.subText.position === 'below'
      ? startY + totalH + subSize
      : startY - subSize * 0.5
    elements += `<text x="${centerX}" y="${subY}" text-anchor="middle" font-family="${esc(state.subText.fontFamily)}" ` +
      `font-weight="${state.subText.fontWeight}" font-size="${subSize}" fill="${esc(state.subText.color)}">${esc(state.subText.text)}</text>`
  }

  elements += groupClose
  return elements
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function directionToSvgCoords(dir: GradientDirection) {
  const map: Record<GradientDirection, { x1: string; y1: string; x2: string; y2: string }> = {
    topToBottom:          { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
    bottomToTop:          { x1: '0%', y1: '100%', x2: '0%', y2: '0%' },
    leftToRight:          { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
    rightToLeft:          { x1: '100%', y1: '0%', x2: '0%', y2: '0%' },
    topLeftToBottomRight: { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
    topRightToBottomLeft: { x1: '100%', y1: '0%', x2: '0%', y2: '100%' },
    bottomLeftToTopRight: { x1: '0%', y1: '100%', x2: '100%', y2: '0%' },
    bottomRightToTopLeft: { x1: '100%', y1: '100%', x2: '0%', y2: '0%' },
  }
  return map[dir]
}
