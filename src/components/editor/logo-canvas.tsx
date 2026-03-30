'use client'

import { useRef, useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { useLogoStore } from '@/store/logo-store'
import { renderLogo } from '@/lib/render-logo'
import type { LogoState } from '@/types/logo'

// Select only LogoState fields (exclude actions)
const stateSelector = (s: LogoState & { set: unknown; reset: unknown }): LogoState => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { set: _, reset: __, ...state } = s
  return state as LogoState
}

export function LogoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useLogoStore(useShallow(stateSelector))
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null)
  const [svgImage, setSvgImage] = useState<HTMLImageElement | null>(null)

  // Load image when imageDataUrl changes
  useEffect(() => {
    if (!state.imageDataUrl) { setLoadedImage(null); return }
    const img = new Image()
    img.onload = () => setLoadedImage(img)
    img.src = state.imageDataUrl
  }, [state.imageDataUrl])

  // Load SVG as image when svgContent changes
  useEffect(() => {
    if (!state.svgContent) { setSvgImage(null); return }
    const blob = new Blob([state.svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => { setSvgImage(img); URL.revokeObjectURL(url) }
    img.onerror = () => URL.revokeObjectURL(url)
    img.src = url
  }, [state.svgContent])

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

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
      const imageForRender = state.mode === 'svgOnly' ? svgImage : loadedImage
      renderLogo(ctx, state, canvasWidth, canvasHeight, {
        checkerboard: true,
        image: imageForRender,
      })
    })
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
