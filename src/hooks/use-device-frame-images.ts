'use client'

import { useState, useEffect } from 'react'
import { DEVICE_FRAMES } from '@/data/device-frames'

/** Module-level cache: raw SVG strings keyed by frame ID */
const svgCache = new Map<string, string>()

/**
 * Hook that loads device frame SVGs and applies color tinting.
 * Returns a Record<frameId, HTMLImageElement> ready for Canvas rendering.
 */
export function useDeviceFrameImages(
  neededFrameIds: string[],
  colorOverrides: Record<string, string>,
): Record<string, HTMLImageElement> {
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({})

  // Stable dependency keys
  const frameIdsKey = neededFrameIds.join(',')
  const colorsKey = JSON.stringify(colorOverrides)

  useEffect(() => {
    if (neededFrameIds.length === 0) {
      setImages({})
      return
    }

    let cancelled = false

    async function loadAll() {
      const result: Record<string, HTMLImageElement> = {}

      for (const frameId of neededFrameIds) {
        const def = DEVICE_FRAMES.find((f) => f.id === frameId)
        if (!def) continue

        // Fetch SVG string (cached)
        let rawSvg = svgCache.get(frameId)
        if (!rawSvg) {
          try {
            const resp = await fetch(def.svgPath)
            if (!resp.ok) continue
            rawSvg = await resp.text()
            svgCache.set(frameId, rawSvg)
          } catch {
            continue
          }
        }

        if (cancelled) return

        // Apply color tinting
        const color = colorOverrides[frameId] || def.defaultColor
        const tintedSvg = rawSvg.replace(/currentColor/g, color)

        // Convert to HTMLImageElement
        const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(tintedSvg)
        const img = await new Promise<HTMLImageElement | null>((resolve) => {
          const el = new Image()
          el.onload = () => resolve(el)
          el.onerror = () => resolve(null)
          el.src = dataUrl
        })

        if (cancelled) return
        if (img) result[frameId] = img
      }

      if (!cancelled) setImages(result)
    }

    loadAll()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameIdsKey, colorsKey])

  return images
}
