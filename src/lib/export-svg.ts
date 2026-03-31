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
        const cx = ((state.gradientCenterX ?? 0.5) * 100).toFixed(1)
        const cy = ((state.gradientCenterY ?? 0.5) * 100).toFixed(1)
        const r = ((state.gradientRadius ?? 0.5) * 100).toFixed(1)
        const stops = state.gradientStops.map(s => `<stop offset="${s.position * 100}%" stop-color="${esc(s.color)}"/>`).join('')
        defs.push(`<radialGradient id="${gradId}" cx="${cx}%" cy="${cy}%" r="${r}%">${stops}</radialGradient>`)
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
  const padX = (w * state.canvasPadding) / 100
  const padY = (h * state.canvasPadding) / 100
  const contentW = w - padX * 2
  const contentH = h - padY * 2

  if (state.mode === 'svgOnly' && state.svgContent) {
    if (contentW > 0 && contentH > 0) {
      contentElements = `<g transform="translate(${padX},${padY})">`
      contentElements += `<svg width="${contentW}" height="${contentH}" viewBox="0 0 ${contentW} ${contentH}">${state.svgContent}</svg>`
      contentElements += `</g>`
    }
  }

  if (state.mode === 'imageOnly' && state.imageDataUrl) {
    // M1 fix: embed image as base64 in SVG
    if (contentW > 0 && contentH > 0) {
      contentElements += `<image href="${state.imageDataUrl}" x="${padX}" y="${padY}" width="${contentW}" height="${contentH}" preserveAspectRatio="xMidYMid ${state.imageFit === 'fill' ? 'none' : state.imageFit === 'cover' ? 'slice' : 'meet'}"/>`
    }
  }

  if (state.mode === 'textImage') {
    // M1 fix: embed image + text for textImage mode
    if (contentW > 0 && contentH > 0) {
      const pos = state.imagePosition
      const isHorizontal = pos === 'left' || pos === 'right'
      const gap = state.imageGap
      const ratio = state.imageFlex / 100

      const layout = calcTextImageLayout(padX, padY, contentW, contentH, pos, isHorizontal, ratio, gap)

      if (state.imageDataUrl && layout.imgW > 0 && layout.imgH > 0) {
        const preserve = state.imageFit === 'fill' ? 'none' : state.imageFit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet'
        contentElements += `<image href="${state.imageDataUrl}" x="${layout.imgX}" y="${layout.imgY}" width="${layout.imgW}" height="${layout.imgH}" preserveAspectRatio="${preserve}"/>`
      }
      if (layout.textW > 0 && layout.textH > 0) {
        contentElements += generateTextSvg(state, w, h, defs, { x: layout.textX, y: layout.textY, w: layout.textW, h: layout.textH })
      }
    }
  }

  if (state.mode === 'textOnly') {
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

function generateTextSvg(
  state: LogoState, w: number, h: number, defs: string[],
  textBounds?: { x: number; y: number; w: number; h: number },
): string {
  // When textBounds provided (textImage mode), use those instead of full canvas
  let padStartY: number, areaW: number, areaH: number
  let textCenterX: number

  if (textBounds) {
    const textPadX = (textBounds.w * state.textPadding) / 100
    const textPadY = (textBounds.h * state.textPadding) / 100
    textCenterX = textBounds.x + textBounds.w / 2
    padStartY = textBounds.y + textPadY
    areaW = textBounds.w - textPadX * 2
    areaH = textBounds.h - textPadY * 2
  } else {
    const padX = (w * state.canvasPadding) / 100
    const padY = (h * state.canvasPadding) / 100
    const aW = w - padX * 2
    const aH = h - padY * 2
    const textPadX = (aW * state.textPadding) / 100
    const textPadY = (aH * state.textPadding) / 100
    textCenterX = w / 2
    padStartY = padY + textPadY
    areaW = aW - textPadX * 2
    areaH = aH - textPadY * 2
  }

  if (areaW <= 0 || areaH <= 0) return ''

  const lines = getTextLines(state)
  if (lines.length === 0) return ''
  const displayLines = state.uppercase ? lines.map(l => l.toUpperCase()) : lines

  // M2 fix: reduce main text area when subText is active (match Canvas rendering)
  const sub = state.subText
  let mainAreaH = areaH
  let subFontSize = 0
  if (sub.enabled && sub.text) {
    subFontSize = Math.max(8, areaH * 0.15)
    mainAreaH = areaH - subFontSize * 1.5
  }

  const fontSize = fitTextForSvg(displayLines, areaW, mainAreaH, state)

  const fontStyle = state.italic ? ' font-style="italic"' : ''
  const textDecoration = state.underline ? ' text-decoration="underline"' : ''
  const centerX = textCenterX
  const lineStep = fontSize * state.lineHeight
  const totalH = lines.length === 1 ? fontSize : fontSize + lineStep * (lines.length - 1)

  let startY: number
  if (sub.enabled && sub.text) {
    const totalBlock = totalH + subFontSize * 1.5
    const blockStartY = padStartY + (areaH - totalBlock) / 2
    startY = sub.position === 'above' ? blockStartY + subFontSize * 1.5 : blockStartY
  } else {
    startY = padStartY + (mainAreaH - totalH) / 2
  }

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
    const rotCy = padStartY + areaH / 2
    groupOpen = `<g transform="rotate(${state.rotation}, ${centerX}, ${rotCy})">`
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
  if (sub.enabled && sub.text && subFontSize > 0) {
    let subY: number
    if (sub.position === 'below') {
      subY = startY + totalH + subFontSize * 0.4 + subFontSize * 0.8
    } else {
      const totalBlock = totalH + subFontSize * 1.5
      const blockStartY = padStartY + (areaH - totalBlock) / 2
      subY = blockStartY + subFontSize * 0.8
    }
    elements += `<text x="${centerX}" y="${subY}" text-anchor="middle" font-family="${esc(sub.fontFamily)}" ` +
      `font-weight="${sub.fontWeight}" font-size="${subFontSize}" fill="${esc(sub.color)}">${esc(sub.text)}</text>`
  }

  elements += groupClose
  return elements
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

/**
 * Use an offscreen canvas to binary-search the exact font size,
 * matching the Canvas preview rendering.
 */
function calcTextImageLayout(
  padX: number, padY: number, contentW: number, contentH: number,
  pos: string, isHorizontal: boolean, ratio: number, gap: number,
) {
  const imgW = isHorizontal ? Math.max(0, contentW * ratio - gap / 2) : contentW
  const imgH = isHorizontal ? contentH : Math.max(0, contentH * ratio - gap / 2)
  const textW = isHorizontal ? Math.max(0, contentW * (1 - ratio) - gap / 2) : contentW
  const textH = isHorizontal ? contentH : Math.max(0, contentH * (1 - ratio) - gap / 2)
  const textX = isHorizontal && pos === 'left' ? padX + imgW + gap : padX
  const textY = !isHorizontal && pos === 'top' ? padY + imgH + gap : padY
  const imgX = isHorizontal ? (pos === 'left' ? padX : padX + textW + gap) : padX
  const imgY = !isHorizontal ? (pos === 'top' ? padY : padY + textH + gap) : padY
  return { imgW, imgH, imgX, imgY, textW, textH, textX, textY }
}

function fitTextForSvg(
  displayLines: string[],
  areaW: number,
  areaH: number,
  state: LogoState,
): number {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return Math.max(8, Math.floor(areaH / (displayLines.length * state.lineHeight)))

  const fontStyle = state.italic ? 'italic ' : ''
  let lo = 1, hi = Math.ceil(areaH), best = 1

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    ctx.font = `${fontStyle}${state.fontWeight} ${mid}px "${state.fontFamily}"`

    let maxWidth = 0
    for (const line of displayLines) {
      let measured: number
      if (state.letterSpacing !== 0) {
        measured = 0
        for (let i = 0; i < line.length; i++) {
          measured += ctx.measureText(line[i]).width
          if (i < line.length - 1) measured += state.letterSpacing
        }
      } else {
        measured = ctx.measureText(line).width
      }
      if (measured > maxWidth) maxWidth = measured
    }

    const totalH = displayLines.length === 1 ? mid : mid + mid * state.lineHeight * (displayLines.length - 1)
    if (maxWidth <= areaW && totalH <= areaH) { best = mid; lo = mid + 1 } else { hi = mid - 1 }
  }

  return best
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
