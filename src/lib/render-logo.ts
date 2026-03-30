import type { LogoState, GradientDirection } from '@/types/logo'

export interface RenderOptions {
  checkerboard?: boolean
  jpgBackground?: boolean
  image?: HTMLImageElement | null
}

/**
 * Render logo onto a canvas context.
 * Used by both preview (with checkerboard) and export (without).
 */
export function renderLogo(
  ctx: CanvasRenderingContext2D,
  state: LogoState,
  width: number,
  height: number,
  options: RenderOptions = {},
) {
  ctx.clearRect(0, 0, width, height)

  if (options.jpgBackground) {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)
  }

  if (options.checkerboard && state.isTransparent) {
    drawCheckerboard(ctx, width, height)
  }

  drawBackground(ctx, state, width, height)

  const padX = (width * state.canvasPadding) / 100
  const padY = (height * state.canvasPadding) / 100
  const contentX = padX
  const contentY = padY
  const contentW = width - padX * 2
  const contentH = height - padY * 2

  if (contentW <= 0 || contentH <= 0) {
    drawWarning(ctx, width, height, 'Too much padding')
    return
  }

  switch (state.mode) {
    case 'textOnly':
      renderTextBlock(ctx, state, contentX, contentY, contentW, contentH, width)
      break
    case 'imageOnly':
      if (options.image) {
        drawImageFit(ctx, options.image, contentX, contentY, contentW, contentH, state.imageFit)
      } else {
        drawWarning(ctx, width, height, 'No image')
      }
      break
    case 'textImage':
      renderTextImage(ctx, state, options.image ?? null, contentX, contentY, contentW, contentH, width)
      break
    case 'svgOnly':
      if (options.image) {
        drawImageFit(ctx, options.image, contentX, contentY, contentW, contentH, 'contain')
      } else {
        drawWarning(ctx, width, height, 'No SVG')
      }
      break
  }
}

// ============================================================
// Background
// ============================================================

function drawBackground(ctx: CanvasRenderingContext2D, state: LogoState, w: number, h: number) {
  if (state.isTransparent) return

  if (state.useGradient && state.gradientStops.length >= 2) {
    ctx.fillStyle = buildCanvasGradient(ctx, state, w, h)
  } else {
    ctx.fillStyle = state.backgroundColor
  }

  if (state.backgroundShape === 'circle') {
    ctx.beginPath()
    ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
    ctx.fill()
  } else if (state.borderRadius > 0) {
    drawRoundedRect(ctx, 0, 0, w, h, state.borderRadius)
    ctx.fill()
  } else {
    ctx.fillRect(0, 0, w, h)
  }
}

function buildCanvasGradient(ctx: CanvasRenderingContext2D, state: LogoState, w: number, h: number): CanvasGradient {
  let gradient: CanvasGradient
  if (state.gradientType === 'radial') {
    const cx = w / 2, cy = h / 2, r = Math.max(w, h) / 2
    gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  } else {
    const { x0, y0, x1, y1 } = directionToCoords(state.gradientDirection, w, h)
    gradient = ctx.createLinearGradient(x0, y0, x1, y1)
  }
  for (const stop of state.gradientStops) {
    gradient.addColorStop(stop.position, stop.color)
  }
  return gradient
}

function directionToCoords(dir: GradientDirection, w: number, h: number) {
  const map: Record<GradientDirection, { x0: number; y0: number; x1: number; y1: number }> = {
    topToBottom:          { x0: 0, y0: 0, x1: 0, y1: h },
    bottomToTop:          { x0: 0, y0: h, x1: 0, y1: 0 },
    leftToRight:          { x0: 0, y0: 0, x1: w, y1: 0 },
    rightToLeft:          { x0: w, y0: 0, x1: 0, y1: 0 },
    topLeftToBottomRight: { x0: 0, y0: 0, x1: w, y1: h },
    topRightToBottomLeft: { x0: w, y0: 0, x1: 0, y1: h },
    bottomLeftToTopRight: { x0: 0, y0: h, x1: w, y1: 0 },
    bottomRightToTopLeft: { x0: w, y0: h, x1: 0, y1: 0 },
  }
  return map[dir]
}

// ============================================================
// Text rendering
// ============================================================

function renderTextBlock(
  ctx: CanvasRenderingContext2D,
  state: LogoState,
  areaX: number,
  areaY: number,
  areaW: number,
  areaH: number,
  canvasWidth: number,
) {
  const textPadX = (areaW * state.textPadding) / 100
  const textPadY = (areaH * state.textPadding) / 100
  const tY = areaY + textPadY
  const tW = areaW - textPadX * 2
  const tH = areaH - textPadY * 2

  if (tW <= 0 || tH <= 0) {
    drawWarning(ctx, canvasWidth, areaY + areaH, 'Too much padding')
    return
  }

  const sub = state.subText
  let mainH = tH
  let subFontSize = 0
  if (sub.enabled && sub.text) {
    subFontSize = Math.max(8, tH * 0.15)
    mainH = tH - subFontSize * 1.5
  }

  const lines = getTextLines(state)
  if (lines.length === 0) return
  const displayLines = state.uppercase ? lines.map(l => l.toUpperCase()) : lines

  const fontStyle = state.italic ? 'italic ' : ''
  const mainAreaH = sub.enabled && sub.text ? mainH : tH
  const fontSize = fitText(ctx, displayLines, tW, mainAreaH, fontStyle, state.fontWeight, state.fontFamily, state.letterSpacing, state.lineHeight)
  if (fontSize <= 0) return

  const lineStep = fontSize * state.lineHeight
  const totalMainH = displayLines.length === 1 ? fontSize : fontSize + lineStep * (displayLines.length - 1)

  let mainStartY: number
  let subY: number | null = null

  if (sub.enabled && sub.text) {
    const totalBlock = totalMainH + subFontSize * 1.5
    const blockStartY = tY + (tH - totalBlock) / 2
    if (sub.position === 'above') {
      subY = blockStartY
      mainStartY = blockStartY + subFontSize * 1.5
    } else {
      mainStartY = blockStartY
      subY = blockStartY + totalMainH + subFontSize * 0.4
    }
  } else {
    mainStartY = tY + (mainAreaH - totalMainH) / 2
  }

  const centerX = areaX + areaW / 2

  // Rotation
  if (state.rotation !== 0) {
    ctx.save()
    ctx.translate(centerX, tY + tH / 2)
    ctx.rotate((state.rotation * Math.PI) / 180)
    ctx.translate(-centerX, -(tY + tH / 2))
  }

  ctx.font = `${fontStyle}${state.fontWeight} ${fontSize}px "${state.fontFamily}"`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  for (let i = 0; i < displayLines.length; i++) {
    const text = displayLines[i]
    const y = i === 0 ? mainStartY : mainStartY + i * lineStep
    drawStyledText(ctx, state, text, centerX, y, fontSize)
  }

  // Sub text
  if (sub.enabled && sub.text && subY !== null) {
    ctx.font = `${sub.fontWeight} ${subFontSize}px "${sub.fontFamily}"`
    ctx.fillStyle = sub.color
    ctx.shadowColor = 'transparent'
    ctx.fillText(sub.text, centerX, subY)
  }

  if (state.rotation !== 0) {
    ctx.restore()
  }
}

function drawStyledText(
  ctx: CanvasRenderingContext2D,
  state: LogoState,
  text: string,
  x: number,
  y: number,
  fontSize: number,
) {
  // Shadow
  if (state.shadow.enabled) {
    ctx.shadowColor = state.shadow.color
    ctx.shadowOffsetX = state.shadow.offsetX
    ctx.shadowOffsetY = state.shadow.offsetY
    ctx.shadowBlur = state.shadow.blur
  }

  // Stroke (before fill, shadow disabled for stroke)
  if (state.stroke.enabled) {
    const saved = ctx.shadowColor
    ctx.shadowColor = 'transparent'
    ctx.strokeStyle = state.stroke.color
    ctx.lineWidth = state.stroke.width
    ctx.lineJoin = 'round'
    if (state.letterSpacing !== 0) {
      drawTextWithSpacing(ctx, text, x, y, state.letterSpacing, 'stroke')
    } else {
      ctx.strokeText(text, x, y)
    }
    ctx.shadowColor = saved
  }

  // Fill — for letterSpacing, draw whole text first (for shadow), then per-char
  ctx.fillStyle = state.textColor
  if (state.letterSpacing !== 0) {
    // Draw full text for shadow (shadow applies to this call)
    if (state.shadow.enabled) {
      ctx.fillText(text, x, y) // shadow renders from this
      // Now disable shadow and draw per-character on top
      ctx.shadowColor = 'transparent'
    }
    drawTextWithSpacing(ctx, text, x, y, state.letterSpacing, 'fill')
  } else {
    ctx.fillText(text, x, y)
  }

  // Underline
  if (state.underline) {
    const textWidth = state.letterSpacing !== 0
      ? measureTextWithSpacing(ctx, text, state.letterSpacing)
      : ctx.measureText(text).width
    const underlineY = y + fontSize * 0.9
    const thickness = Math.max(1, fontSize / 20)
    ctx.save()
    ctx.shadowColor = 'transparent'
    ctx.strokeStyle = state.textColor
    ctx.lineWidth = thickness
    ctx.beginPath()
    ctx.moveTo(x - textWidth / 2, underlineY)
    ctx.lineTo(x + textWidth / 2, underlineY)
    ctx.stroke()
    ctx.restore()
  }

  // Reset shadow
  ctx.shadowColor = 'transparent'
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur = 0
}

// ============================================================
// Image rendering
// ============================================================

function renderTextImage(
  ctx: CanvasRenderingContext2D,
  state: LogoState,
  img: HTMLImageElement | null,
  areaX: number, areaY: number, areaW: number, areaH: number,
  canvasWidth: number,
) {
  const pos = state.imagePosition
  const isHorizontal = pos === 'left' || pos === 'right'
  const gap = state.imageGap
  const ratio = state.imageFlex / 100

  let imgX: number, imgY: number, imgW: number, imgH: number
  let textX: number, textY: number, textW: number, textH: number

  if (isHorizontal) {
    imgW = Math.max(0, areaW * ratio - gap / 2)
    textW = Math.max(0, areaW * (1 - ratio) - gap / 2)
    imgH = areaH
    textH = areaH
    imgY = areaY
    textY = areaY
    if (pos === 'left') {
      imgX = areaX
      textX = areaX + imgW + gap
    } else {
      textX = areaX
      imgX = areaX + textW + gap
    }
  } else {
    imgH = Math.max(0, areaH * ratio - gap / 2)
    textH = Math.max(0, areaH * (1 - ratio) - gap / 2)
    imgW = areaW
    textW = areaW
    imgX = areaX
    textX = areaX
    if (pos === 'top') {
      imgY = areaY
      textY = areaY + imgH + gap
    } else {
      textY = areaY
      imgY = areaY + textH + gap
    }
  }

  if (img && imgW > 0 && imgH > 0) {
    drawImageFit(ctx, img, imgX, imgY, imgW, imgH, state.imageFit)
  }

  if (textW > 0 && textH > 0) {
    renderTextBlock(ctx, state, textX, textY, textW, textH, canvasWidth)
  }
}

function drawImageFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number,
  fit: string,
) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()

  const imgRatio = img.naturalWidth / img.naturalHeight
  const boxRatio = w / h
  let dw: number, dh: number, dx: number, dy: number

  if (fit === 'fill') {
    dw = w; dh = h; dx = x; dy = y
  } else if (fit === 'cover') {
    if (imgRatio > boxRatio) { dh = h; dw = h * imgRatio } else { dw = w; dh = w / imgRatio }
    dx = x + (w - dw) / 2; dy = y + (h - dh) / 2
  } else {
    if (imgRatio > boxRatio) { dw = w; dh = w / imgRatio } else { dh = h; dw = h * imgRatio }
    dx = x + (w - dw) / 2; dy = y + (h - dh) / 2
  }

  ctx.drawImage(img, dx, dy, dw, dh)
  ctx.restore()
}

// ============================================================
// Helpers
// ============================================================

function drawWarning(ctx: CanvasRenderingContext2D, w: number, h: number, text: string) {
  ctx.fillStyle = '#999999'
  ctx.font = `${Math.max(12, w * 0.03)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, h / 2)
}

function getTextLines(state: { text1: string; text2: string; text3: string; textLines: 1 | 2 | 3 }): string[] {
  const lines: string[] = []
  if (state.text1 || state.textLines >= 1) lines.push(state.text1 || 'LOGO')
  if (state.textLines >= 2) lines.push(state.text2 || '')
  if (state.textLines >= 3) lines.push(state.text3 || '')
  return lines.filter(l => l.length > 0)
}

function fitText(
  ctx: CanvasRenderingContext2D, displayLines: string[],
  areaW: number, areaH: number, fontStyle: string,
  fontWeight: number, fontFamily: string, letterSpacing: number, lineHeight: number,
): number {
  let lo = 1, hi = Math.ceil(areaH), best = 1
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    ctx.font = `${fontStyle}${fontWeight} ${mid}px "${fontFamily}"`
    let maxWidth = 0
    for (const line of displayLines) {
      const measured = letterSpacing !== 0 ? measureTextWithSpacing(ctx, line, letterSpacing) : ctx.measureText(line).width
      if (measured > maxWidth) maxWidth = measured
    }
    const totalHeight = displayLines.length === 1 ? mid : mid + mid * lineHeight * (displayLines.length - 1)
    if (maxWidth <= areaW && totalHeight <= areaH) { best = mid; lo = mid + 1 } else { hi = mid - 1 }
  }
  return best
}

function measureTextWithSpacing(ctx: CanvasRenderingContext2D, text: string, spacing: number): number {
  let w = 0
  for (let i = 0; i < text.length; i++) {
    w += ctx.measureText(text[i]).width
    if (i < text.length - 1) w += spacing
  }
  return w
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
  ctx: CanvasRenderingContext2D, text: string, centerX: number, y: number,
  spacing: number, mode: 'fill' | 'stroke',
) {
  const totalWidth = measureTextWithSpacing(ctx, text, spacing)
  let x = centerX - totalWidth / 2
  const savedAlign = ctx.textAlign
  ctx.textAlign = 'left'
  for (let i = 0; i < text.length; i++) {
    const charW = ctx.measureText(text[i]).width
    if (mode === 'fill') ctx.fillText(text[i], x, y)
    else ctx.strokeText(text[i], x, y)
    x += charW + spacing
  }
  ctx.textAlign = savedAlign
}
