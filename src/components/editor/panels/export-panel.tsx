'use client'

import { useRef, useState } from 'react'
import { useLogoStore } from '@/store/logo-store'
import { renderLogo } from '@/lib/render-logo'
import { generateSvg } from '@/lib/export-svg'
import { SIZE_PRESETS, DEVICE_GROUPS } from '@/data/presets'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download } from 'lucide-react'
import type { ExportFormat, ExportScale } from '@/types/logo'

export function ExportPanel() {
  const canvasWidth = useLogoStore((s) => s.canvasWidth)
  const canvasHeight = useLogoStore((s) => s.canvasHeight)
  const exportFormat = useLogoStore((s) => s.exportFormat)
  const exportScale = useLogoStore((s) => s.exportScale)
  const set = useLogoStore((s) => s.set)

  const currentPreset = SIZE_PRESETS.find(
    (p) => p.width === canvasWidth && p.height === canvasHeight
  )

  const handleSizePreset = (value: string) => {
    if (value === 'custom') return
    const preset = SIZE_PRESETS.find((p) => p.name === value)
    if (preset) {
      set({ canvasWidth: preset.width, canvasHeight: preset.height })
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Size & Export
      </h3>

      {/* Size preset */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground">Size Preset</label>
        <Select
          value={currentPreset?.name ?? 'custom'}
          onValueChange={handleSizePreset}
        >
          <SelectTrigger className="h-8 w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SIZE_PRESETS.map((p) => (
              <SelectItem key={p.name} value={p.name}>
                {p.name}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom size inputs */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">W</label>
          <Input
            type="number"
            min={1}
            max={4096}
            value={canvasWidth}
            onChange={(e) => set({ canvasWidth: Math.max(1, Number(e.target.value) || 1) })}
            className="h-8 w-full text-xs"
          />
        </div>
        <span className="mt-5 text-xs text-muted-foreground">x</span>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">H</label>
          <Input
            type="number"
            min={1}
            max={4096}
            value={canvasHeight}
            onChange={(e) => set({ canvasHeight: Math.max(1, Number(e.target.value) || 1) })}
            className="h-8 w-full text-xs"
          />
        </div>
      </div>

      {/* Export format */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs text-muted-foreground">Format</label>
          <Select
            value={exportFormat}
            onValueChange={(v) => set({ exportFormat: v as ExportFormat })}
          >
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="svg">SVG</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs text-muted-foreground">Scale</label>
          <Select
            value={String(exportScale)}
            onValueChange={(v) => set({ exportScale: Number(v) as ExportScale })}
          >
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="3">3x</SelectItem>
              <SelectItem value="4">4x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Final size display */}
      <p className="text-xs text-muted-foreground">
        Output: {canvasWidth * exportScale} x {canvasHeight * exportScale} px
      </p>

      {/* Export button */}
      <ExportButton />

      {/* Device presets */}
      <DevicePresets />
    </div>
  )
}

function DevicePresets() {
  const set = useLogoStore((s) => s.set)
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-muted-foreground">Device Presets</label>
      {DEVICE_GROUPS.map((group) => (
        <div key={group.platform}>
          <button
            onClick={() => setOpen(open === group.platform ? null : group.platform)}
            className="flex w-full items-center justify-between rounded-md bg-secondary px-2 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-accent"
          >
            {group.platform}
            <span className="text-muted-foreground">{open === group.platform ? '−' : '+'}</span>
          </button>
          {open === group.platform && (
            <div className="mt-1 grid grid-cols-2 gap-1">
              {group.sizes.map((size) => (
                <button
                  key={size.name}
                  onClick={() => set({ canvasWidth: size.width, canvasHeight: size.height })}
                  className="rounded-md border border-border px-2 py-1 text-left text-xs hover:bg-muted/50"
                >
                  <span className="font-medium">{size.name}</span>
                  <br />
                  <span className="text-muted-foreground">{size.width}x{size.height}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ExportButton() {
  const exportFormat = useLogoStore((s) => s.exportFormat)
  const exportingRef = useRef(false)

  const handleExport = async () => {
    if (exportingRef.current) return
    exportingRef.current = true

    const state = useLogoStore.getState()

    // SVG export — direct string generation
    if (state.exportFormat === 'svg') {
      const svgString = generateSvg(state)
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `logo_${state.canvasWidth}x${state.canvasHeight}.svg`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 3000)
      exportingRef.current = false
      return
    }

    // Raster export (PNG/JPG)
    const { canvasWidth, canvasHeight, exportScale } = state

    // Load image if needed for raster export
    let image: HTMLImageElement | null = null
    const imgSrc = state.mode === 'svgOnly' && state.svgContent
      ? URL.createObjectURL(new Blob([state.svgContent], { type: 'image/svg+xml' }))
      : (state.mode === 'imageOnly' || state.mode === 'textImage') ? state.imageDataUrl : null

    if (imgSrc) {
      image = await new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => resolve(null)
        img.src = imgSrc
      })
      if (state.mode === 'svgOnly') URL.revokeObjectURL(imgSrc)
    }

    const w = canvasWidth * exportScale
    const h = canvasHeight * exportScale

    const offscreen = document.createElement('canvas')
    offscreen.width = w
    offscreen.height = h
    const ctx = offscreen.getContext('2d')
    if (!ctx) {
      exportingRef.current = false
      return
    }

    ctx.scale(exportScale, exportScale)

    const isJpg = state.exportFormat === 'jpg'
    renderLogo(ctx, state, canvasWidth, canvasHeight, {
      checkerboard: false,
      jpgBackground: isJpg && state.isTransparent,
      image,
    })

    const mimeType = isJpg ? 'image/jpeg' : 'image/png'
    const quality = isJpg ? 0.95 : undefined
    const ext = isJpg ? 'jpg' : 'png'
    const scaleSuffix = exportScale > 1 ? `@${exportScale}x` : ''
    const fileName = `logo_${canvasWidth}x${canvasHeight}${scaleSuffix}.${ext}`

    offscreen.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = fileName
          a.click()
          // Delay revoke to ensure download starts
          setTimeout(() => URL.revokeObjectURL(url), 3000)
        }
        exportingRef.current = false
      },
      mimeType,
      quality,
    )
  }

  return (
    <Button onClick={handleExport} className="w-full gap-2">
      <Download className="h-4 w-4" />
      Export {exportFormat.toUpperCase()}
    </Button>
  )
}
