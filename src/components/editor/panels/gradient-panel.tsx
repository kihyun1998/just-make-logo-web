'use client'

import { useLogoStore } from '@/store/logo-store'
import { Slider } from '@/components/ui/slider'
import { ToggleSwitch } from '@/components/ui/toggle-switch'
import { ColorPickerField } from '../color-picker-field'
import { GRADIENT_PRESETS } from '@/data/presets'
import type { GradientDirection, GradientType } from '@/types/logo'

const DIRECTIONS: { value: GradientDirection; label: string }[] = [
  { value: 'topToBottom', label: '↓' },
  { value: 'bottomToTop', label: '↑' },
  { value: 'leftToRight', label: '→' },
  { value: 'rightToLeft', label: '←' },
  { value: 'topLeftToBottomRight', label: '↘' },
  { value: 'topRightToBottomLeft', label: '↙' },
  { value: 'bottomLeftToTopRight', label: '↗' },
  { value: 'bottomRightToTopLeft', label: '↖' },
]

export function GradientPanel() {
  const useGradient = useLogoStore((s) => s.useGradient)
  const gradientType = useLogoStore((s) => s.gradientType)
  const gradientDirection = useLogoStore((s) => s.gradientDirection)
  const gradientStops = useLogoStore((s) => s.gradientStops)
  const set = useLogoStore((s) => s.set)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Gradient
        </h3>
        <ToggleSwitch checked={useGradient} onChange={(v) => set({ useGradient: v })} aria-label="Toggle gradient" />
      </div>

      {useGradient && (
        <>
          {/* Type */}
          <div className="flex gap-1">
            {(['linear', 'radial'] as GradientType[]).map((t) => (
              <button
                key={t}
                onClick={() => set({ gradientType: t })}
                className={`flex-1 rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors ${
                  gradientType === t
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Direction (linear only) */}
          {gradientType === 'linear' && (
            <div className="grid grid-cols-4 gap-1">
              {DIRECTIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => set({ gradientDirection: d.value })}
                  aria-label={`Gradient direction: ${d.value}`}
                  className={`rounded-md p-2 text-sm transition-colors ${
                    gradientDirection === d.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          )}

          {/* Color stops with position */}
          {gradientStops.map((stop, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <ColorPickerField
                label={`Color ${i + 1}`}
                color={stop.color}
                onChange={(c) => {
                  const newStops = [...gradientStops]
                  newStops[i] = { ...stop, color: c }
                  set({ gradientStops: newStops })
                }}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-8">Pos</span>
                <Slider
                  min={0} max={100} step={1}
                  value={[Math.round(stop.position * 100)]}
                  onValueChange={([v]) => {
                    const newStops = [...gradientStops]
                    newStops[i] = { ...stop, position: v / 100 }
                    set({ gradientStops: newStops })
                  }}
                />
                <span className="text-xs text-muted-foreground w-8">{Math.round(stop.position * 100)}%</span>
              </div>
            </div>
          ))}

          {/* Add stop (max 3) */}
          {gradientStops.length < 3 && (
            <button
              onClick={() =>
                set({
                  gradientStops: [
                    ...gradientStops,
                    { color: '#888888', position: 0.5 },
                  ],
                })
              }
              className="rounded-md border border-dashed border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted/50"
            >
              + Add Color Stop
            </button>
          )}

          {/* Remove stop (min 2) */}
          {gradientStops.length > 2 && (
            <button
              onClick={() =>
                set({ gradientStops: gradientStops.slice(0, -1) })
              }
              className="rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
            >
              Remove Last Stop
            </button>
          )}

          {/* Gradient preview bar */}
          <div
            className="h-6 w-full rounded-md border border-border"
            style={{
              background: buildCssGradient(gradientType, gradientDirection, gradientStops),
            }}
          />

          {/* Presets */}
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">Presets</label>
            <div className="grid grid-cols-5 gap-1.5">
              {GRADIENT_PRESETS.map((p) => (
                <button
                  key={p.name}
                  title={p.name}
                  onClick={() => set({ gradientStops: p.stops, useGradient: true })}
                  aria-label={`Gradient preset: ${p.name}`}
                  className="h-8 rounded-md border border-border transition-transform hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${p.stops.map(s => `${s.color} ${s.position * 100}%`).join(', ')})`,
                  }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function buildCssGradient(
  type: GradientType,
  direction: GradientDirection,
  stops: { color: string; position: number }[],
): string {
  const colorStops = stops.map((s) => `${s.color} ${s.position * 100}%`).join(', ')
  if (type === 'radial') {
    return `radial-gradient(circle, ${colorStops})`
  }
  const angle = directionToAngle(direction)
  return `linear-gradient(${angle}deg, ${colorStops})`
}

function directionToAngle(dir: GradientDirection): number {
  const map: Record<GradientDirection, number> = {
    topToBottom: 180,
    bottomToTop: 0,
    leftToRight: 90,
    rightToLeft: 270,
    topLeftToBottomRight: 135,
    topRightToBottomLeft: 225,
    bottomLeftToTopRight: 45,
    bottomRightToTopLeft: 315,
  }
  return map[dir]
}
