'use client'

import { useCallback, useRef, useState } from 'react'
import { useLogoStore } from '@/store/logo-store'
import { renderLogo } from '@/lib/render-logo'
import { generateSvg } from '@/lib/export-svg'
import { flattenGroups, batchExport, type BatchProgress } from '@/lib/batch-export'
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
import { Download, Archive, Check, Copy } from 'lucide-react'
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

      {/* Export + Copy buttons */}
      <div className="flex gap-2">
        <ExportButton />
        <CopyButton />
      </div>

      {/* Device presets */}
      <DevicePresets />
    </div>
  )
}

function DevicePresets() {
  const set = useLogoStore((s) => s.set)
  const [open, setOpen] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const exportingRef = useRef(false)
  const [batchState, setBatchState] = useState<
    | { status: 'idle' }
    | { status: 'exporting'; progress: BatchProgress }
    | { status: 'done'; successCount: number; total: number }
    | { status: 'error' }
  >({ status: 'idle' })

  const togglePlatform = useCallback((platform: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(platform)) next.delete(platform)
      else next.add(platform)
      return next
    })
  }, [])

  const handleBatchExport = useCallback(async () => {
    if (selected.size === 0 || exportingRef.current) return
    exportingRef.current = true

    const state = useLogoStore.getState()
    const items = flattenGroups(DEVICE_GROUPS, selected)

    setBatchState({ status: 'exporting', progress: { current: 0, total: items.length, currentLabel: '' } })

    try {
      const { zip, successCount } = await batchExport(
        state,
        items,
        state.exportFormat,
        (progress) => setBatchState({ status: 'exporting', progress }),
      )

      // Download ZIP
      const url = URL.createObjectURL(zip)
      const a = document.createElement('a')
      a.href = url
      a.download = `logo_batch_${[...selected].join('-').toLowerCase()}.zip`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 3000)

      setBatchState({ status: 'done', successCount, total: items.length })
      setTimeout(() => setBatchState({ status: 'idle' }), 3000)
    } catch {
      setBatchState({ status: 'error' })
      setTimeout(() => setBatchState({ status: 'idle' }), 3000)
    } finally {
      exportingRef.current = false
    }
  }, [selected])

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-muted-foreground">Device Presets</label>
      {DEVICE_GROUPS.map((group) => (
        <div key={group.platform}>
          <div className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={selected.has(group.platform)}
              onChange={() => togglePlatform(group.platform)}
              className="h-3.5 w-3.5 rounded border-border accent-primary"
            />
            <button
              onClick={() => setOpen(open === group.platform ? null : group.platform)}
              className="flex flex-1 items-center justify-between rounded-md bg-secondary px-2 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-accent"
            >
              <span>
                {group.platform}
                <span className="ml-1 text-muted-foreground">({group.sizes.length})</span>
              </span>
              <span className="text-muted-foreground">{open === group.platform ? '−' : '+'}</span>
            </button>
          </div>
          {open === group.platform && (
            <div className="ml-5 mt-1 grid grid-cols-2 gap-1">
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

      {/* Batch export */}
      {selected.size > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          {batchState.status === 'exporting' && (
            <div className="flex flex-col gap-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-200"
                  style={{
                    width: `${Math.round((batchState.progress.current / batchState.progress.total) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {batchState.progress.current}/{batchState.progress.total} — {batchState.progress.currentLabel}
              </p>
            </div>
          )}

          {batchState.status === 'done' && (
            <p className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <Check className="h-3 w-3" />
              {batchState.successCount}/{batchState.total} exported
            </p>
          )}

          {batchState.status === 'error' && (
            <p className="text-xs text-destructive">
              Export failed. Please try again.
            </p>
          )}

          <Button
            onClick={handleBatchExport}
            disabled={batchState.status === 'exporting'}
            variant="outline"
            className="w-full gap-2"
          >
            <Archive className="h-4 w-4" />
            {batchState.status === 'exporting'
              ? 'Exporting...'
              : `Batch Export ZIP (${selected.size} group${selected.size > 1 ? 's' : ''})`}
          </Button>
        </div>
      )}
    </div>
  )
}

function ExportButton() {
  const exportFormat = useLogoStore((s) => s.exportFormat)
  const exportingRef = useRef(false)

  const handleExport = async () => {
    if (exportingRef.current) return
    exportingRef.current = true

    try {
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
        return
      }

      // Raster export (PNG/JPG) — ensure fonts are loaded first
      const fontStyle = state.italic ? 'italic ' : ''
      await document.fonts.load(`${fontStyle}${state.fontWeight} 48px "${state.fontFamily}"`)
      if (state.subText.enabled) {
        await document.fonts.load(`${state.subText.fontWeight} 48px "${state.subText.fontFamily}"`)
      }

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
      if (!ctx) return

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

      await new Promise<void>((resolve) => {
        offscreen.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = fileName
              a.click()
              setTimeout(() => URL.revokeObjectURL(url), 3000)
            }
            // Free pixel buffer
            offscreen.width = 0
            offscreen.height = 0
            resolve()
          },
          mimeType,
          quality,
        )
      })
    } finally {
      exportingRef.current = false
    }
  }

  return (
    <Button onClick={handleExport} className="flex-1 gap-2">
      <Download className="h-4 w-4" />
      {exportFormat.toUpperCase()}
    </Button>
  )
}

function CopyButton() {
  const copyingRef = useRef(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (copyingRef.current) return
    copyingRef.current = true

    try {
      const state = useLogoStore.getState()
      const { canvasWidth, canvasHeight, exportScale } = state

      // Ensure fonts are loaded
      const fontStyle = state.italic ? 'italic ' : ''
      await document.fonts.load(`${fontStyle}${state.fontWeight} 48px "${state.fontFamily}"`)
      if (state.subText.enabled) {
        await document.fonts.load(`${state.subText.fontWeight} 48px "${state.subText.fontFamily}"`)
      }

      // Load image if needed
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
      if (!ctx) return

      ctx.scale(exportScale, exportScale)

      renderLogo(ctx, state, canvasWidth, canvasHeight, {
        checkerboard: false,
        jpgBackground: false,
        image,
      })

      const blob = await new Promise<Blob | null>((resolve) => {
        offscreen.toBlob((b) => {
          offscreen.width = 0
          offscreen.height = 0
          resolve(b)
        }, 'image/png')
      })

      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } finally {
      copyingRef.current = false
    }
  }

  return (
    <Button onClick={handleCopy} variant="outline" size="icon" className="shrink-0" title="Copy to clipboard">
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}
