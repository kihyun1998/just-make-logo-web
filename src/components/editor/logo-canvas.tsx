'use client'

import { useRef, useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { useLogoStore } from '@/store/logo-store'
import { renderLogo } from '@/lib/render-logo'
import type { LogoState } from '@/types/logo'

const stateKeys: (keyof LogoState)[] = [
  'schemaVersion', 'mode', 'text1', 'text2', 'text3', 'textLines',
  'fontFamily', 'fontWeight', 'textColor', 'textPadding', 'italic',
  'uppercase', 'underline', 'rotation', 'letterSpacing', 'lineHeight',
  'shadow', 'stroke', 'subText', 'backgroundColor', 'backgroundShape',
  'isTransparent', 'canvasPadding', 'borderRadius', 'useGradient',
  'gradientType', 'gradientDirection', 'gradientStops', 'imageDataUrl',
  'imagePosition', 'imageFlex', 'imageGap', 'imageFit', 'svgContent',
  'canvasWidth', 'canvasHeight', 'exportFormat', 'exportScale',
]

const stateSelector = (s: Record<string, unknown>): LogoState => {
  const result: Record<string, unknown> = {}
  for (const key of stateKeys) result[key] = s[key]
  return result as LogoState
}

export function LogoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useLogoStore(useShallow(stateSelector))
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null)
  const [svgImage, setSvgImage] = useState<HTMLImageElement | null>(null)

  // M4 fix: cancelled flag for image loading race condition
  useEffect(() => {
    if (!state.imageDataUrl) { setLoadedImage(null); return }
    let cancelled = false
    const img = new Image()
    img.onload = () => { if (!cancelled) setLoadedImage(img) }
    img.src = state.imageDataUrl
    return () => { cancelled = true }
  }, [state.imageDataUrl])

  // M4 fix: cancelled flag for SVG image loading race condition
  useEffect(() => {
    if (!state.svgContent) { setSvgImage(null); return }
    let cancelled = false
    const blob = new Blob([state.svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      if (!cancelled) setSvgImage(img)
      URL.revokeObjectURL(url)
    }
    img.onerror = () => URL.revokeObjectURL(url)
    img.src = url
    return () => { cancelled = true; URL.revokeObjectURL(url) }
  }, [state.svgContent])

  // M5 fix: cancelled flag for font load + render to prevent stale closure
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let cancelled = false
    const { canvasWidth, canvasHeight, fontFamily, fontWeight } = state
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    const fontStyle = state.italic ? 'italic ' : ''
    const fontSpec = `${fontStyle}${fontWeight} 48px "${fontFamily}"`
    const fontPromises = [document.fonts.load(fontSpec)]
    if (state.subText.enabled) {
      fontPromises.push(document.fonts.load(`${state.subText.fontWeight} 48px "${state.subText.fontFamily}"`))
    }

    Promise.all(fontPromises).then(() => {
      if (cancelled) return
      const imageForRender = state.mode === 'svgOnly' ? svgImage : loadedImage
      renderLogo(ctx, state, canvasWidth, canvasHeight, {
        checkerboard: true,
        image: imageForRender,
      })
    })

    return () => { cancelled = true }
  }, [state, loadedImage, svgImage])

  const { canvasWidth, canvasHeight } = state

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="relative max-h-[calc(100%-2rem)] max-w-full rounded-lg border border-border shadow-md">
        <canvas
          ref={canvasRef}
          data-logo-canvas
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            aspectRatio: `${canvasWidth}/${canvasHeight}`,
          }}
          className="block rounded-lg"
        />
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">
        {canvasWidth} x {canvasHeight}
      </span>
    </div>
  )
}
