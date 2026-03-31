import type { GradientStop, GradientDirection, GradientType } from '@/types/logo'

// ── Checkerboard (transparency preview) ──

export function drawCheckerboard(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const size = 8
  for (let y = 0; y < h; y += size) {
    for (let x = 0; x < w; x += size) {
      ctx.fillStyle = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0 ? '#ffffff' : '#e0e0e0'
      ctx.fillRect(x, y, size, size)
    }
  }
}

// ── Rounded rect path ──

export function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

// ── Gradient building ──

export interface GradientConfig {
  gradientType: GradientType
  gradientDirection: GradientDirection
  gradientStops: GradientStop[]
}

export function buildCanvasGradient(ctx: CanvasRenderingContext2D, config: GradientConfig, w: number, h: number): CanvasGradient {
  let gradient: CanvasGradient
  if (config.gradientType === 'radial') {
    const cx = w / 2, cy = h / 2, r = Math.max(w, h) / 2
    gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  } else {
    const { x0, y0, x1, y1 } = directionToCoords(config.gradientDirection, w, h)
    gradient = ctx.createLinearGradient(x0, y0, x1, y1)
  }
  for (const stop of config.gradientStops) {
    gradient.addColorStop(stop.position, stop.color)
  }
  return gradient
}

export function directionToCoords(dir: GradientDirection, w: number, h: number) {
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

// ── Text measurement & fitting ──

export function measureTextWithSpacing(ctx: CanvasRenderingContext2D, text: string, spacing: number): number {
  let w = 0
  for (let i = 0; i < text.length; i++) {
    w += ctx.measureText(text[i]).width
    if (i < text.length - 1) w += spacing
  }
  return w
}

export function fitText(
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

// ── Image fit drawing ──

export function drawImageFit(
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

// ── Warning text ──

export function drawWarning(ctx: CanvasRenderingContext2D, w: number, h: number, text: string) {
  ctx.fillStyle = '#999999'
  ctx.font = `${Math.max(12, w * 0.03)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, h / 2)
}
