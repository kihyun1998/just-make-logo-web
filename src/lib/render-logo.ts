import type { LogoState, GradientDirection } from '@/types/logo'

export interface RenderOptions {
  checkerboard?: boolean
  jpgBackground?: boolean
  /** Pre-loaded HTMLImageElement for image modes */
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

  // JPG needs white background when transparent
  if (options.jpgBackground) {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)
  }

  // Checkerboard for preview transparency
  if (options.checkerboard && state.isTransparent) {
    drawCheckerboard(ctx, width, height)
  }

  // --- Background ---
  drawBackground(ctx, state, width, height)

  // --- Content area ---
  const padX = (width * state.canvasPadding) / 100
  const padY = (height * state.canvasPadding) / 100
  const contentX = padX
  const contentY = padY
  const contentW = width - padX * 2
  const contentH = height - padY * 2

  if (contentW <= 0 || contentH <= 0) {
    drawPaddingWarning(ctx, width, height)
    return
  }

  // --- Render based on mode ---
  switch (state.mode) {
    case 'textOnly':
      renderTextBlock(ctx, state, contentX, contentY, contentW, contentH, width)
      break
    case 'imageOnly':
      renderImage(ctx, state, options.image ?? null, contentX, contentY, contentW, contentH)
      break
    case 'textImage':
      renderTextImage(ctx, state, options.image ?? null, contentX, contentY, contentW, contentH, width)
      break
    case 'svgOnly':
      renderSvgContent(ctx, state, contentX, contentY, contentW, contentH)
      break
  }
}

// ============================================================
// Background
// ============================================================

function drawBackground(ctx: CanvasRenderingContext2D, state: LogoState, w: number, h: number) {
  if (state.isTransparent) return

  // Determine fill style (solid or gradient)
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

function buildCanvasGradient(
  ctx: CanvasRenderingContext2D,
  state: LogoState,
  w: number,
  h: number,
): CanvasGradient {
  let gradient: CanvasGradient
  if (state.gradientType === 'radial') {
    const cx = w / 2, cy = h / 2
    const r = Math.max(w, h) / 2
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
    drawPaddingWarning(ctx, canvasWidth, areaY + areaH / 2)
    return
  }

  // Sub text reserve space
  let mainH = tH
  let subFontSize = 0
  const sub = state.subText
  if (sub.enabled && sub.text) {
    // Reserve ~25% for subtext
    subFontSize = Math.max(8, tH * 0.15)
    mainH = tH - subFontSize * 1.5
    if (sub.position === 'above') {
      // subtext on top
    }
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

  // Calculate Y positions
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

  // Draw main text lines
  ctx.font = `${fontStyle}${state.fontWeight} ${fontSize}px "${state.fontFamily}"`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  for (let i = 0; i < displayLines.length; i++) {
    const text = displayLines[i]
    const y = i === 0 ? mainStartY : mainStartY + i * lineStep
    drawStyledText(ctx, state, text, centerX, y, fontSize)
  }

  // Draw sub text
  if (sub.enabled && sub.text && subY !== null) {
    const subStyle = ''
    ctx.font = `${subStyle}${sub.fontWeight} ${subFontSize}px "${sub.fontFamily}"`
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

  // Stroke
  if (state.stroke.enabled) {
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
    if (state.shadow.enabled) {
      ctx.globalAlpha = 0
      ctx.fillText(text, x, y)
      ctx.globalAlpha = 1
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

function renderImage(
  ctx: CanvasRenderingContext2D,
  state: LogoState,
  img: HTMLImageElement | null,
  x: number, y: number, w: number, h: number,
) {
  if (!img) {
    drawPlaceholder(ctx, x, y, w, h, 'No image')
    return
  }
  drawImageFit(ctx, img, x, y, w, h, state.imageFit)
}

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
    imgW = areaW * ratio - gap / 2
    textW = areaW * (1 - ratio) - gap / 2
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
    imgH = areaH * ratio - gap / 2
    textH = areaH * (1 - ratio) - gap / 2
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

  // Draw image
  if (img) {
    drawImageFit(ctx, img, imgX, imgY, imgW, imgH, state.imageFit)
  } else {
    drawPlaceholder(ctx, imgX, imgY, imgW, imgH, 'No image')
  }

  // Draw text
  renderTextBlock(ctx, state, textX, textY, textW, textH, canvasWidth)
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
    if (imgRatio > boxRatio) {
      dh = h; dw = h * imgRatio
    } else {
      dw = w; dh = w / imgRatio
    }
    dx = x + (w - dw) / 2
    dy = y + (h - dh) / 2
  } else {
    // contain
    if (imgRatio > boxRatio) {
      dw = w; dh = w / imgRatio
    } else {
      dh = h; dw = h * imgRatio
    }
    dx = x + (w - dw) / 2
    dy = y + (h - dh) / 2
  }

  ctx.drawImage(img, dx, dy, dw, dh)
  ctx.restore()
}

// ============================================================
// SVG rendering
// ============================================================

function renderSvgContent(
  ctx: CanvasRenderingContext2D,
  state: LogoState,
  x: number, y: number, w: number, h: number,
) {
  if (!state.svgContent) {
    drawPlaceholder(ctx, x, y, w, h, 'No SVG')
    return
  }

  // Render SVG via Image element (synchronous if already cached)
  const blob = new Blob([state.svgContent], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const img = new Image()
  img.src = url

  // Since this is synchronous in preview (image may not be loaded yet),
  // we draw a placeholder. The canvas component handles async loading.
  if (img.complete && img.naturalWidth > 0) {
    drawImageFit(ctx, img, x, y, w, h, 'contain')
    URL.revokeObjectURL(url)
  } else {
    drawPlaceholder(ctx, x, y, w, h, 'Loading SVG...')
    URL.revokeObjectURL(url)
  }
}

// ============================================================
// Helpers
// ============================================================

function drawPlaceholder(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, text: string) {
  ctx.save()
  ctx.fillStyle = '#999999'
  ctx.font = `${Math.max(10, Math.min(w, h) * 0.08)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x + w / 2, y + h / 2)
  ctx.restore()
}

function drawPaddingWarning(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#999999'
  ctx.font = `${Math.max(12, w * 0.03)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Too much padding', w / 2, typeof h === 'number' ? h : w / 2)
}

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
