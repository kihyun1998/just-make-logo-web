'use client'

import { useRef } from 'react'
import { useLogoStore } from '@/store/logo-store'
import { renderLogo } from '@/lib/render-logo'
import { SIZE_PRESETS } from '@/data/presets'
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
              <SelectItem value="svg" disabled>SVG (Phase 2)</SelectItem>
              <SelectItem value="ico" disabled>ICO (Phase 2)</SelectItem>
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
    </div>
  )
}

function ExportButton() {
  const exportFormat = useLogoStore((s) => s.exportFormat)
  const exportingRef = useRef(false)

  const handleExport = () => {
    if (exportingRef.current) return
    exportingRef.current = true

    // Get full state snapshot for rendering
    const state = useLogoStore.getState()
    const { canvasWidth, canvasHeight, exportScale } = state
    const w = canvasWidth * exportScale
    const h = canvasHeight * exportScale

    // Create offscreen canvas and render from scratch (no checkerboard)
    const offscreen = document.createElement('canvas')
    offscreen.width = w
    offscreen.height = h
    const ctx = offscreen.getContext('2d')
    if (!ctx) {
      exportingRef.current = false
      return
    }

    // Scale context so renderLogo draws at export resolution
    ctx.scale(exportScale, exportScale)

    const isJpg = state.exportFormat === 'jpg'
    renderLogo(ctx, state, canvasWidth, canvasHeight, {
      checkerboard: false,
      jpgBackground: isJpg && state.isTransparent,
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
