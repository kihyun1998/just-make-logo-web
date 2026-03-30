import type { LogoState } from '@/types/logo'

/**
 * Render logo onto a canvas context.
 * Used by both preview (with checkerboard) and export (without).
 */
export function renderLogo(
  ctx: CanvasRenderingContext2D,
  state: LogoState,
  width: number,
  height: number,
  options: { checkerboard?: boolean; jpgBackground?: boolean } = {},
) {
  ctx.clearRect(0, 0, width, height)

  // JPG needs white background when transparent
  if (options.jpgBackground) {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)
  }

  // Checkerboard for preview transparency
  if (options.checkerboard && state.isTransparent) {
    drawCheckerboard(ctx, width, height)
  }

  // Draw background
  if (!state.isTransparent) {
    ctx.fillStyle = state.backgroundColor
    if (state.backgroundShape === 'circle') {
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, Math.PI * 2)
      ctx.fill()
    } else {
      if (state.borderRadius > 0) {
        drawRoundedRect(ctx, 0, 0, width, height, state.borderRadius)
        ctx.fill()
      } else {
        ctx.fillRect(0, 0, width, height)
      }
    }
  }

  // Calculate padding area
  const padX = (width * state.canvasPadding) / 100
  const padY = (height * state.canvasPadding) / 100
  const textPadX = (width * state.textPadding) / 100
  const textPadY = (height * state.textPadding) / 100
  const areaX = padX + textPadX
  const areaY = padY + textPadY
  const areaW = width - areaX * 2
  const areaH = height - areaY * 2

  if (areaW <= 0 || areaH <= 0) {
    // Show feedback when padding is too large
    ctx.fillStyle = '#999999'
    ctx.font = `${Math.max(12, width * 0.03)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Too much padding', width / 2, height / 2)
    return
  }

  // Get text lines
  const lines = getTextLines(state)
  if (lines.length === 0) return

  // Apply uppercase for measurement
  const displayLines = state.uppercase ? lines.map(l => l.toUpperCase()) : lines

  // FittedBox: find the max font size that fits
  const fontStyle = state.italic ? 'italic ' : ''
  const fontSize = fitText(ctx, displayLines, areaW, areaH, fontStyle, state.fontWeight, state.fontFamily, state.letterSpacing, state.lineHeight)

  if (fontSize <= 0) return

  // Calculate text block height and starting Y
  const lineStep = fontSize * state.lineHeight
  const totalTextHeight = lines.length === 1
    ? fontSize
    : fontSize + lineStep * (lines.length - 1)
  const startY = areaY + (areaH - totalTextHeight) / 2

  ctx.font = `${fontStyle}${state.fontWeight} ${fontSize}px "${state.fontFamily}"`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  for (let i = 0; i < displayLines.length; i++) {
    const text = displayLines[i]
    const y = i === 0 ? startY : startY + i * lineStep
    const x = width / 2

    // Shadow — apply once then draw all, disable before next line
    if (state.shadow.enabled) {
      ctx.shadowColor = state.shadow.color
      ctx.shadowOffsetX = state.shadow.offsetX
      ctx.shadowOffsetY = state.shadow.offsetY
      ctx.shadowBlur = state.shadow.blur
    }

    // Stroke (draw before fill so fill is on top)
    if (state.stroke.enabled) {
      // Disable shadow for stroke to avoid double shadow
      const savedShadow = ctx.shadowColor
      ctx.shadowColor = 'transparent'
      ctx.strokeStyle = state.stroke.color
      ctx.lineWidth = state.stroke.width
      ctx.lineJoin = 'round'
      if (state.letterSpacing !== 0) {
        drawTextWithSpacing(ctx, text, x, y, state.letterSpacing, 'stroke')
      } else {
        ctx.strokeText(text, x, y)
      }
      ctx.shadowColor = savedShadow
    }

    // Fill
    ctx.fillStyle = state.textColor
    if (state.letterSpacing !== 0) {
      // Disable shadow per-char to avoid per-character shadow duplication
      if (state.shadow.enabled) {
        // Draw shadow layer first as a single operation
        ctx.globalAlpha = 0
        ctx.fillText(text, x, y) // trigger shadow
        ctx.globalAlpha = 1
        ctx.shadowColor = 'transparent'
      }
      drawTextWithSpacing(ctx, text, x, y, state.letterSpacing, 'fill')
    } else {
      ctx.fillText(text, x, y)
    }

    // Underline
    if (state.underline) {
      const metrics = ctx.measureText(text)
      const textWidth = state.letterSpacing !== 0
        ? measureTextWithSpacing(ctx, text, state.letterSpacing)
        : metrics.width
      const underlineY = y + fontSize * 0.9
      const underlineThickness = Math.max(1, fontSize / 20)
      ctx.save()
      ctx.shadowColor = 'transparent'
      ctx.strokeStyle = state.textColor
      ctx.lineWidth = underlineThickness
      ctx.beginPath()
      ctx.moveTo(x - textWidth / 2, underlineY)
      ctx.lineTo(x + textWidth / 2, underlineY)
      ctx.stroke()
      ctx.restore()
    }

    // Reset shadow for next line
    ctx.shadowColor = 'transparent'
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.shadowBlur = 0
  }
}

// --- Helper functions ---

function getTextLines(state: { text1: string; text2: string; text3: string; textLines: 1 | 2 | 3 }): string[] {
  const lines: string[] = []
  if (state.text1 || state.textLines >= 1) lines.push(state.text1 || 'LOGO')
  if (state.textLines >= 2) lines.push(state.text2 || '')
  if (state.textLines >= 3) lines.push(state.text3 || '')
  return lines.filter(l => l.length > 0)
}

function fitText(
  ctx: CanvasRenderingContext2D,
  displayLines: string[],
  areaW: number,
  areaH: number,
  fontStyle: string,
  fontWeight: number,
  fontFamily: string,
  letterSpacing: number,
  lineHeight: number,
): number {
  let lo = 1
  let hi = Math.ceil(areaH)
  let best = 1

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    ctx.font = `${fontStyle}${fontWeight} ${mid}px "${fontFamily}"`

    let maxWidth = 0
    for (const line of displayLines) {
      const measured = letterSpacing !== 0
        ? measureTextWithSpacing(ctx, line, letterSpacing)
        : ctx.measureText(line).width
      if (measured > maxWidth) maxWidth = measured
    }

    const totalHeight = displayLines.length === 1
      ? mid
      : mid + mid * lineHeight * (displayLines.length - 1)

    if (maxWidth <= areaW && totalHeight <= areaH) {
      best = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }

  return best
}

function measureTextWithSpacing(ctx: CanvasRenderingContext2D, text: string, spacing: number): number {
  let totalWidth = 0
  for (let i = 0; i < text.length; i++) {
    totalWidth += ctx.measureText(text[i]).width
    if (i < text.length - 1) totalWidth += spacing
  }
  return totalWidth
}

function drawCheckerboard(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const size = 8
  for (let y = 0; y < h; y += size) {
    for (let x = 0; x < w; x += size) {
      ctx.fillStyle = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0 ? '#ffffff' : '#e0e0e0'
      ctx.fillRect(x, y, size, size)
    }
  }
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + radius, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function drawTextWithSpacing(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  spacing: number,
  mode: 'fill' | 'stroke',
) {
  const totalWidth = measureTextWithSpacing(ctx, text, spacing)

  let x = centerX - totalWidth / 2
  const savedAlign = ctx.textAlign
  ctx.textAlign = 'left'
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const charWidth = ctx.measureText(char).width
    if (mode === 'fill') {
      ctx.fillText(char, x, y)
    } else {
      ctx.strokeText(char, x, y)
    }
    x += charWidth + spacing
  }
  ctx.textAlign = savedAlign
}
