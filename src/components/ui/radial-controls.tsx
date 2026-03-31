'use client'

import { useCallback } from 'react'
import { Slider } from '@/components/ui/slider'
import type { GradientDirection, GradientType } from '@/types/logo'

export function RadialControls({
  centerX, centerY, radius, gradientStops, onChange,
}: {
  centerX: number
  centerY: number
  radius: number
  gradientStops: { color: string; position: number }[]
  onChange: (v: Partial<{ gradientCenterX: number; gradientCenterY: number; gradientRadius: number }>) => void
}) {
  const handlePointer = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const update = (ev: PointerEvent) => {
      const x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height))
      onChange({ gradientCenterX: x, gradientCenterY: y })
    }
    update(e.nativeEvent)
    const onMove = (ev: PointerEvent) => update(ev)
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [onChange])

  const cssPreview = buildCssGradient('radial', 'topToBottom', gradientStops, centerX, centerY, radius)

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-muted-foreground">Center</label>
      <div
        className="relative h-24 w-full cursor-crosshair rounded-md border border-border overflow-hidden"
        style={{ background: cssPreview, touchAction: 'none' }}
        onPointerDown={handlePointer}
      >
        <div
          className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
          style={{ left: `${centerX * 100}%`, top: `${centerY * 100}%` }}
        />
      </div>
      <div className="flex gap-2 text-xs text-muted-foreground">
        <span>X: {Math.round(centerX * 100)}%</span>
        <span>Y: {Math.round(centerY * 100)}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-12">Radius</span>
        <Slider
          min={10} max={150} step={1}
          value={[Math.round(radius * 100)]}
          onValueChange={([v]) => onChange({ gradientRadius: v / 100 })}
        />
        <span className="text-xs text-muted-foreground w-10">{Math.round(radius * 100)}%</span>
      </div>
    </div>
  )
}

const ANGLE_MAP: Record<GradientDirection, number> = {
  topToBottom: 180, bottomToTop: 0, leftToRight: 90, rightToLeft: 270,
  topLeftToBottomRight: 135, topRightToBottomLeft: 225,
  bottomLeftToTopRight: 45, bottomRightToTopLeft: 315,
}

export function buildCssGradient(
  type: GradientType,
  direction: GradientDirection,
  stops: { color: string; position: number }[],
  centerX = 0.5,
  centerY = 0.5,
  radius = 0.5,
): string {
  const colorStops = stops.map((s) => `${s.color} ${s.position * 100}%`).join(', ')
  if (type === 'radial') {
    const size = radius * 100
    return `radial-gradient(${size}% ${size}% at ${centerX * 100}% ${centerY * 100}%, ${colorStops})`
  }
  return `linear-gradient(${ANGLE_MAP[direction]}deg, ${colorStops})`
}
