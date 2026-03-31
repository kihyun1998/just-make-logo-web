'use client'

import { useAssetStore } from '@/store/asset-store'
import { Slider } from '@/components/ui/slider'
import { ToggleSwitch } from '@/components/ui/toggle-switch'
import { ColorPickerField } from '@/components/editor/color-picker-field'
import { QUICK_COLORS, GRADIENT_PRESETS } from '@/data/presets'
import type { GradientDirection, GradientType } from '@/types/logo'

const DIRECTIONS: { value: GradientDirection; label: string }[] = [
  { value: 'topToBottom', label: '\u2193' },
  { value: 'bottomToTop', label: '\u2191' },
  { value: 'leftToRight', label: '\u2192' },
  { value: 'rightToLeft', label: '\u2190' },
  { value: 'topLeftToBottomRight', label: '\u2198' },
  { value: 'topRightToBottomLeft', label: '\u2199' },
  { value: 'bottomLeftToTopRight', label: '\u2197' },
  { value: 'bottomRightToTopLeft', label: '\u2196' },
]

export function AssetBackgroundPanel() {
  const backgroundColor = useAssetStore((s) => s.backgroundColor)
  const useGradient = useAssetStore((s) => s.useGradient)
  const gradientType = useAssetStore((s) => s.gradientType)
  const gradientDirection = useAssetStore((s) => s.gradientDirection)
  const gradientStops = useAssetStore((s) => s.gradientStops)
  const set = useAssetStore((s) => s.set)

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Background
      </h3>

      {/* Quick preset colors */}
      <div className="flex gap-1.5">
        {QUICK_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => set({ backgroundColor: c })}
            className={`h-7 w-7 rounded-md border-2 transition-transform hover:scale-110 ${
              backgroundColor.toUpperCase() === c.toUpperCase()
                ? 'border-primary'
                : 'border-border'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <ColorPickerField
        label="Color"
        color={backgroundColor}
        onChange={(c) => set({ backgroundColor: c })}
      />

      {/* Gradient toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Gradient</span>
        <ToggleSwitch checked={useGradient} onChange={(v) => set({ useGradient: v })} />
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
                  className={`rounded-md p-1.5 text-sm transition-colors ${
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

          {/* Color stops */}
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

          {/* Add/remove stops */}
          {gradientStops.length < 3 && (
            <button
              onClick={() => set({ gradientStops: [...gradientStops, { color: '#888888', position: 0.5 }] })}
              className="rounded-md border border-dashed border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted/50"
            >
              + Add Color Stop
            </button>
          )}
          {gradientStops.length > 2 && (
            <button
              onClick={() => set({ gradientStops: gradientStops.slice(0, -1) })}
              className="rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
            >
              Remove Last Stop
            </button>
          )}

          {/* Preview bar */}
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
                  className="h-7 rounded-md border border-border transition-transform hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${p.stops.map(s => `${s.color} ${s.position * 100}%`).join(', ')})`,
                  }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

function buildCssGradient(
  type: GradientType,
  direction: GradientDirection,
  stops: { color: string; position: number }[],
): string {
  const colorStops = stops.map((s) => `${s.color} ${s.position * 100}%`).join(', ')
  if (type === 'radial') return `radial-gradient(circle, ${colorStops})`
  const angleMap: Record<GradientDirection, number> = {
    topToBottom: 180, bottomToTop: 0, leftToRight: 90, rightToLeft: 270,
    topLeftToBottomRight: 135, topRightToBottomLeft: 225,
    bottomLeftToTopRight: 45, bottomRightToTopLeft: 315,
  }
  return `linear-gradient(${angleMap[direction]}deg, ${colorStops})`
}
