'use client'

import { useRef, useEffect } from 'react'
import { useLogoStore } from '@/store/logo-store'
import { renderLogo } from '@/lib/render-logo'

// Select only fields that affect rendering (exclude export-only fields)
const useRenderState = () =>
  useLogoStore((s) => ({
    canvasWidth: s.canvasWidth,
    canvasHeight: s.canvasHeight,
    mode: s.mode,
    text1: s.text1,
    text2: s.text2,
    text3: s.text3,
    textLines: s.textLines,
    fontFamily: s.fontFamily,
    fontWeight: s.fontWeight,
    textColor: s.textColor,
    textPadding: s.textPadding,
    italic: s.italic,
    uppercase: s.uppercase,
    underline: s.underline,
    rotation: s.rotation,
    letterSpacing: s.letterSpacing,
    lineHeight: s.lineHeight,
    shadow: s.shadow,
    stroke: s.stroke,
    subText: s.subText,
    backgroundColor: s.backgroundColor,
    backgroundShape: s.backgroundShape,
    isTransparent: s.isTransparent,
    canvasPadding: s.canvasPadding,
    borderRadius: s.borderRadius,
    useGradient: s.useGradient,
    gradientType: s.gradientType,
    gradientDirection: s.gradientDirection,
    gradientStops: s.gradientStops,
    schemaVersion: s.schemaVersion,
    imagePosition: s.imagePosition,
    imageFlex: s.imageFlex,
    imageGap: s.imageGap,
    imageFit: s.imageFit,
    exportFormat: s.exportFormat,
    exportScale: s.exportScale,
  }))

export function LogoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useRenderState()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { canvasWidth, canvasHeight, fontFamily, fontWeight } = state

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Explicitly load the required font before rendering
    const fontStyle = state.italic ? 'italic ' : ''
    const fontSpec = `${fontStyle}${fontWeight} 48px "${fontFamily}"`

    document.fonts.load(fontSpec).then(() => {
      renderLogo(ctx, state, canvasWidth, canvasHeight, { checkerboard: true })
    })
  }, [state])

  const { canvasWidth, canvasHeight } = state

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative rounded-lg border border-border shadow-md">
        <canvas
          ref={canvasRef}
          data-logo-canvas
          style={{
            maxWidth: '100%',
            maxHeight: 'calc(100vh - 12rem)',
            width: 'auto',
            height: 'auto',
            aspectRatio: `${canvasWidth}/${canvasHeight}`,
          }}
          className="rounded-lg"
        />
      </div>
      <span className="text-xs text-muted-foreground">
        {canvasWidth} x {canvasHeight}
      </span>
    </div>
  )
}
