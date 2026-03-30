'use client'

import { useRef, useEffect, useState } from 'react'
import { useLogoStore } from '@/store/logo-store'
import { renderLogo } from '@/lib/render-logo'

export function LogoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useLogoStore()
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null)

  // Load image when imageDataUrl changes
  useEffect(() => {
    if (!state.imageDataUrl) {
      setLoadedImage(null)
      return
    }
    const img = new Image()
    img.onload = () => setLoadedImage(img)
    img.src = state.imageDataUrl
  }, [state.imageDataUrl])

  // Load SVG as image when svgContent changes
  const [svgImage, setSvgImage] = useState<HTMLImageElement | null>(null)
  useEffect(() => {
    if (!state.svgContent) {
      setSvgImage(null)
      return
    }
    const blob = new Blob([state.svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      setSvgImage(img)
      URL.revokeObjectURL(url)
    }
    img.onerror = () => URL.revokeObjectURL(url)
    img.src = url
  }, [state.svgContent])

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

    // Also load subtext font if enabled
    const subFontSpec = state.subText.enabled
      ? `${state.subText.fontWeight} 48px "${state.subText.fontFamily}"`
      : null

    const fontPromises = [document.fonts.load(fontSpec)]
    if (subFontSpec) fontPromises.push(document.fonts.load(subFontSpec))

    Promise.all(fontPromises).then(() => {
      // For SVG mode, pass svgImage; for image modes, pass loadedImage
      const imageForRender = state.mode === 'svgOnly' ? svgImage : loadedImage
      renderLogo(ctx, state, canvasWidth, canvasHeight, {
        checkerboard: true,
        image: imageForRender,
      })
    })
  }, [state, loadedImage, svgImage])

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
