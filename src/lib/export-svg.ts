import type { LogoState, GradientDirection } from '@/types/logo'

/**
 * Generate a standalone SVG string from the logo state.
 * Uses <text> elements for true vector text (not rasterized).
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
        const stops = state.gradientStops
          .map((s) => `<stop offset="${s.position * 100}%" stop-color="${esc(s.color)}"/>`)
          .join('')
        defs.push(`<radialGradient id="${gradId}" cx="50%" cy="50%" r="50%">${stops}</radialGradient>`)
      } else {
        const { x1, y1, x2, y2 } = directionToSvgCoords(state.gradientDirection)
        const stops = state.gradientStops
          .map((s) => `<stop offset="${s.position * 100}%" stop-color="${esc(s.color)}"/>`)
          .join('')
        defs.push(`<linearGradient id="${gradId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops}</linearGradient>`)
      }
      bgFill = `url(#${gradId})`
    } else {
      bgFill = esc(state.backgroundColor)
    }
  }

  // --- Clip path for circle ---
  let clipAttr = ''
  if (state.backgroundShape === 'circle') {
    defs.push(`<clipPath id="circle-clip"><ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2}" ry="${h / 2}"/></clipPath>`)
    clipAttr = ' clip-path="url(#circle-clip)"'
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

  // --- Text ---
  const padX = (w * state.canvasPadding) / 100
  const padY = (h * state.canvasPadding) / 100
  const textPadX = ((w - padX * 2) * state.textPadding) / 100
  const textPadY = ((h - padY * 2) * state.textPadding) / 100
  const areaW = w - (padX + textPadX) * 2
  const areaH = h - (padY + textPadY) * 2

  let textElements = ''
  if ((state.mode === 'textOnly' || state.mode === 'textImage') && areaW > 0 && areaH > 0) {
    const lines = getTextLines(state)
    if (lines.length > 0) {
      const displayLines = state.uppercase ? lines.map((l) => l.toUpperCase()) : lines
      // Approximate font size (use ~70% of area width / max line length)
      const approxFontSize = Math.min(areaH / (lines.length * state.lineHeight), areaW / 4)
      const fontSize = Math.max(8, Math.floor(approxFontSize))

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

      for (let i = 0; i < displayLines.length; i++) {
        const y = (i === 0 ? startY : startY + i * lineStep) + fontSize * 0.8
        let strokeEl = ''
        if (state.stroke.enabled) {
          strokeEl = `<text x="${centerX}" y="${y}" text-anchor="middle" font-family="${esc(state.fontFamily)}" ` +
            `font-weight="${state.fontWeight}" font-size="${fontSize}"${fontStyle}${textDecoration} ` +
            `fill="none" stroke="${esc(state.stroke.color)}" stroke-width="${state.stroke.width}" stroke-linejoin="round" ` +
            `letter-spacing="${state.letterSpacing}">${esc(displayLines[i])}</text>`
        }
        const fillEl = `<text x="${centerX}" y="${y}" text-anchor="middle" font-family="${esc(state.fontFamily)}" ` +
          `font-weight="${state.fontWeight}" font-size="${fontSize}"${fontStyle}${textDecoration} ` +
          `fill="${esc(state.textColor)}" letter-spacing="${state.letterSpacing}"${filterAttr}>${esc(displayLines[i])}</text>`

        textElements += strokeEl + fillEl
      }

      // Sub text
      if (state.subText.enabled && state.subText.text) {
        const subSize = Math.max(8, fontSize * 0.4)
        const subY = state.subText.position === 'below'
          ? startY + totalH + subSize
          : startY - subSize * 0.5
        textElements += `<text x="${centerX}" y="${subY}" text-anchor="middle" font-family="${esc(state.subText.fontFamily)}" ` +
          `font-weight="${state.subText.fontWeight}" font-size="${subSize}" fill="${esc(state.subText.color)}">${esc(state.subText.text)}</text>`
      }
    }
  }

  // --- Font import ---
  const fontFamilies = new Set([state.fontFamily])
  if (state.subText.enabled) fontFamilies.add(state.subText.fontFamily)
  const fontImports = Array.from(fontFamilies)
    .map((f) => `@import url('https://fonts.googleapis.com/css2?family=${f.replace(/ /g, '+')}:wght@${state.fontWeight}&display=swap');`)
    .join('')
  const styleEl = fontImports ? `<style>${fontImports}</style>` : ''

  // --- Assemble SVG ---
  const defsEl = defs.length > 0 ? `<defs>${defs.join('')}</defs>` : ''

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"${clipAttr}>`,
    defsEl,
    styleEl,
    bgShape,
    textElements,
    '</svg>',
  ].join('\n')
}

// --- Helpers ---

function getTextLines(state: { text1: string; text2: string; text3: string; textLines: 1 | 2 | 3 }): string[] {
  const lines: string[] = []
  if (state.text1 || state.textLines >= 1) lines.push(state.text1 || 'LOGO')
  if (state.textLines >= 2) lines.push(state.text2 || '')
  if (state.textLines >= 3) lines.push(state.text3 || '')
  return lines.filter((l) => l.length > 0)
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
