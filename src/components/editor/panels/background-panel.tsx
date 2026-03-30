'use client'

import { useLogoStore } from '@/store/logo-store'
import { Slider } from '@/components/ui/slider'
import { ColorPickerField } from '../color-picker-field'
import { QUICK_COLORS } from '@/data/presets'
import type { BackgroundShape } from '@/types/logo'

export function BackgroundPanel() {
  const backgroundShape = useLogoStore((s) => s.backgroundShape)
  const isTransparent = useLogoStore((s) => s.isTransparent)
  const backgroundColor = useLogoStore((s) => s.backgroundColor)
  const canvasPadding = useLogoStore((s) => s.canvasPadding)
  const borderRadius = useLogoStore((s) => s.borderRadius)
  const set = useLogoStore((s) => s.set)

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Background
      </h3>

      {/* Shape */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground w-12 shrink-0">Shape</label>
        <div className="flex gap-1">
          {([
            { value: 'rectangle' as BackgroundShape, label: 'Rect' },
            { value: 'circle' as BackgroundShape, label: 'Circle' },
          ]).map((s) => (
            <button
              key={s.value}
              onClick={() => set({ backgroundShape: s.value })}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                backgroundShape === s.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transparent toggle */}
      <div className="flex items-center justify-between">
        <label className="text-xs text-muted-foreground">Transparent</label>
        <button
          onClick={() => set({ isTransparent: !isTransparent })}
          className={`relative h-5 w-9 rounded-full transition-colors ${
            isTransparent ? 'bg-primary' : 'bg-input'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
              isTransparent ? 'translate-x-4' : ''
            }`}
          />
        </button>
      </div>

      {/* Background color (hidden when transparent) */}
      {!isTransparent && (
        <>
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
        </>
      )}

      {/* Canvas padding */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">Canvas Padding</label>
          <span className="text-xs text-muted-foreground">{canvasPadding}%</span>
        </div>
        <Slider
          min={0}
          max={90}
          step={1}
          value={[canvasPadding]}
          onValueChange={([v]) => set({ canvasPadding: v })}
        />
      </div>

      {/* Border radius (only for rectangle) */}
      {backgroundShape === 'rectangle' && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground">Border Radius</label>
            <span className="text-xs text-muted-foreground">{borderRadius}px</span>
          </div>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[borderRadius]}
            onValueChange={([v]) => set({ borderRadius: v })}
          />
        </div>
      )}
    </div>
  )
}
