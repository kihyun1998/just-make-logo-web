'use client'

import { useRef, useState } from 'react'
import { useAssetStore } from '@/store/asset-store'
import { STORE_ASSET_SPECS } from '@/data/asset-specs'
import { ASSET_TEMPLATES } from '@/data/asset-templates'
import { DEVICE_FRAMES } from '@/data/device-frames'
import { renderAsset } from '@/lib/render-asset'
import { generateIco } from '@/lib/export-ico'
import { downloadBlob } from '@/lib/download'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Download, Copy, Check } from 'lucide-react'
import type { AssetExportFormat } from '@/types/asset'

export function AssetExportPanel() {
  const exportFormat = useAssetStore((s) => s.exportFormat)
  const selectedSpecId = useAssetStore((s) => s.selectedSpecId)
  const set = useAssetStore((s) => s.set)

  const spec = STORE_ASSET_SPECS.find((s) => s.id === selectedSpecId)

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Export
      </h3>

      {/* Format */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Format</label>
        <Select
          value={exportFormat}
          onValueChange={(v) => set({ exportFormat: v as AssetExportFormat })}
        >
          <SelectTrigger className="h-8 w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpg">JPG</SelectItem>
            <SelectItem value="ico">ICO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Output info */}
      {spec && (
        <p className="text-xs text-muted-foreground">
          {exportFormat === 'ico'
            ? 'Output: 16x16, 32x32, 48x48, 256x256 (multi-size)'
            : `Output: ${spec.width} x ${spec.height} px`}
        </p>
      )}

      {/* Export + Copy */}
      <div className="flex gap-2">
        <ExportButton />
        <CopyButton />
      </div>
    </section>
  )
}

/**
 * Render asset to an offscreen canvas. Shared by renderAssetToBlob and ICO export.
 */
async function renderAssetToCanvas(): Promise<HTMLCanvasElement | null> {
  const state = useAssetStore.getState()
  const spec = STORE_ASSET_SPECS.find((s) => s.id === state.selectedSpecId)
  const template = ASSET_TEMPLATES.find((t) => t.id === state.selectedTemplateId)
  if (!spec || !template) return null

  const w = spec.width
  const h = spec.height

  // Load fonts used by text blocks
  const fontPromises: Promise<FontFace[]>[] = []
  for (const block of template.textBlocks) {
    const family = state.textStyleOverrides[block.id]?.fontFamily || 'Inter'
    const weight = state.textStyleOverrides[block.id]?.fontWeight || block.fontWeight
    fontPromises.push(document.fonts.load(`${weight} 48px "${family}"`))
  }
  await Promise.all(fontPromises)

  // Load images
  const images: Record<string, HTMLImageElement> = {}
  for (const slot of template.imageSlots) {
    const dataUrl = state.imageOverrides[slot.id]
    if (!dataUrl) continue
    const img = await new Promise<HTMLImageElement | null>((resolve) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => resolve(null)
      el.src = dataUrl
    })
    if (img) images[slot.id] = img
  }

  // Load device frame SVGs
  const frameSvgs: Record<string, HTMLImageElement> = {}
  for (const slot of template.imageSlots) {
    const override = state.deviceFrameOverrides[slot.id]
    const frameId = override?.frameId ?? slot.deviceFrame ?? null
    if (!frameId) continue
    const def = DEVICE_FRAMES.find((f) => f.id === frameId)
    if (!def) continue
    try {
      const resp = await fetch(def.svgPath)
      let svgText = await resp.text()
      const color = override?.frameColor || def.defaultColor
      svgText = svgText.replace(/currentColor/g, color)
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText)
      const img = await new Promise<HTMLImageElement | null>((resolve) => {
        const el = new Image()
        el.onload = () => resolve(el)
        el.onerror = () => resolve(null)
        el.src = dataUrl
      })
      if (img) frameSvgs[frameId] = img
    } catch { /* skip frame on error */ }
  }

  const offscreen = document.createElement('canvas')
  offscreen.width = w
  offscreen.height = h
  const ctx = offscreen.getContext('2d')
  if (!ctx) return null

  renderAsset(ctx, template, state, w, h, { checkerboard: false, images, frameSvgs })

  return offscreen
}

async function renderAssetToBlob(
  mimeType?: string,
  quality?: number,
): Promise<Blob | null> {
  const canvas = await renderAssetToCanvas()
  if (!canvas) return null

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        canvas.width = 0
        canvas.height = 0
        resolve(blob)
      },
      mimeType ?? 'image/png',
      quality,
    )
  })
}

function ExportButton() {
  const exportFormat = useAssetStore((s) => s.exportFormat)
  const selectedSpecId = useAssetStore((s) => s.selectedSpecId)
  const exportingRef = useRef(false)

  const handleExport = async () => {
    if (exportingRef.current || !selectedSpecId) return
    exportingRef.current = true

    try {
      const spec = STORE_ASSET_SPECS.find((s) => s.id === selectedSpecId)
      if (!spec) return

      // ICO export
      if (exportFormat === 'ico') {
        const canvas = await renderAssetToCanvas()
        if (canvas) {
          const blob = await generateIco(canvas)
          canvas.width = 0
          canvas.height = 0
          downloadBlob(blob, `${spec.id}.ico`)
        }
        return
      }

      const isJpg = exportFormat === 'jpg'
      const blob = await renderAssetToBlob(
        isJpg ? 'image/jpeg' : 'image/png',
        isJpg ? 0.95 : undefined,
      )

      if (blob && spec) {
        const ext = isJpg ? 'jpg' : 'png'
        downloadBlob(blob, `${spec.id}_${spec.width}x${spec.height}.${ext}`)
      }
    } finally {
      exportingRef.current = false
    }
  }

  return (
    <Button onClick={handleExport} disabled={!selectedSpecId} className="flex-1 gap-2">
      <Download className="h-4 w-4" />
      {exportFormat.toUpperCase()}
    </Button>
  )
}

function CopyButton() {
  const selectedSpecId = useAssetStore((s) => s.selectedSpecId)
  const copyingRef = useRef(false)
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  const handleCopy = async () => {
    if (copyingRef.current || !selectedSpecId) return
    copyingRef.current = true

    try {
      const blob = await renderAssetToBlob()
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        setStatus('copied')
        setTimeout(() => setStatus('idle'), 2000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    } finally {
      copyingRef.current = false
    }
  }

  return (
    <Button
      onClick={handleCopy}
      disabled={!selectedSpecId}
      variant="outline"
      size="icon"
      className="shrink-0"
      aria-label="Copy to clipboard"
    >
      {status === 'copied' ? (
        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}
