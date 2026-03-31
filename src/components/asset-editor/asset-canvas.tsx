'use client'

import { useRef, useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { useAssetStore, type AssetStore } from '@/store/asset-store'
import { STORE_ASSET_SPECS } from '@/data/asset-specs'
import { ASSET_TEMPLATES } from '@/data/asset-templates'
import { renderAsset } from '@/lib/render-asset'
import type { AssetEditorState } from '@/types/asset'

function stateSelector(s: AssetStore): AssetEditorState {
  return {
    selectedSpecId: s.selectedSpecId,
    selectedTemplateId: s.selectedTemplateId,
    textOverrides: s.textOverrides,
    textStyleOverrides: s.textStyleOverrides,
    imageOverrides: s.imageOverrides,
    backgroundColor: s.backgroundColor,
    useGradient: s.useGradient,
    gradientType: s.gradientType,
    gradientDirection: s.gradientDirection,
    gradientStops: s.gradientStops,
    exportFormat: s.exportFormat,
  }
}

export function AssetCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useAssetStore(useShallow(stateSelector))
  const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>({})

  // Load images from imageOverrides — incrementally per slot
  useEffect(() => {
    let cancelled = false
    const entries = Object.entries(state.imageOverrides).filter(
      (entry): entry is [string, string] => entry[1] !== null,
    )

    if (entries.length === 0) {
      setLoadedImages({})
      return
    }

    for (const [slotId, dataUrl] of entries) {
      const img = new Image()
      img.onload = () => {
        if (cancelled) return
        setLoadedImages((prev) => ({ ...prev, [slotId]: img }))
      }
      img.src = dataUrl
    }

    return () => { cancelled = true }
  }, [state.imageOverrides])

  // Render with font loading
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const spec = STORE_ASSET_SPECS.find((s) => s.id === state.selectedSpecId)
    const template = ASSET_TEMPLATES.find((t) => t.id === state.selectedTemplateId)

    const w = spec?.width ?? 1024
    const h = spec?.height ?? 500
    canvas.width = w
    canvas.height = h

    if (!template) {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = state.backgroundColor
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#999'
      ctx.font = `${Math.max(14, w * 0.025)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Select a template', w / 2, h / 2)
      return
    }

    // Load all fonts used by text blocks before rendering
    let cancelled = false
    const fontPromises: Promise<FontFace[]>[] = []
    for (const block of template.textBlocks) {
      const family = state.textStyleOverrides?.[block.id]?.fontFamily || 'Inter'
      const weight = state.textStyleOverrides?.[block.id]?.fontWeight || block.fontWeight
      fontPromises.push(document.fonts.load(`${weight} 48px "${family}"`))
    }

    Promise.all(fontPromises).then(() => {
      if (cancelled) return
      renderAsset(ctx, template, state, w, h, {
        checkerboard: true,
        images: loadedImages,
      })
    })

    return () => { cancelled = true }
  }, [state, loadedImages])

  const spec = STORE_ASSET_SPECS.find((s) => s.id === state.selectedSpecId)
  const w = spec?.width ?? 1024
  const h = spec?.height ?? 500

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="relative max-h-[calc(100%-2rem)] max-w-full rounded-lg border border-border shadow-md">
        <canvas
          ref={canvasRef}
          data-asset-canvas
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            aspectRatio: `${w}/${h}`,
          }}
          className="block rounded-lg"
        />
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">
        {w} x {h}
        {spec ? ` \u2014 ${spec.name}` : ''}
      </span>
    </div>
  )
}
