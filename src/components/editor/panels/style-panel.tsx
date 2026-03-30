'use client'

import { useLogoStore } from '@/store/logo-store'
import { Slider } from '@/components/ui/slider'
import { ColorPickerField } from '../color-picker-field'
import { Italic, CaseSensitive, Underline } from 'lucide-react'
import type { TextShadow, TextStroke } from '@/types/logo'

export function StylePanel() {
  const italic = useLogoStore((s) => s.italic)
  const uppercase = useLogoStore((s) => s.uppercase)
  const underline = useLogoStore((s) => s.underline)
  const letterSpacing = useLogoStore((s) => s.letterSpacing)
  const lineHeight = useLogoStore((s) => s.lineHeight)
  const textLines = useLogoStore((s) => s.textLines)
  const shadow = useLogoStore((s) => s.shadow)
  const stroke = useLogoStore((s) => s.stroke)
  const set = useLogoStore((s) => s.set)

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Style
      </h3>

      {/* Text style toggles */}
      <div className="flex gap-1">
        {([
          { key: 'italic' as const, value: italic, icon: Italic, label: 'Italic' },
          { key: 'uppercase' as const, value: uppercase, icon: CaseSensitive, label: 'Uppercase' },
          { key: 'underline' as const, value: underline, icon: Underline, label: 'Underline' },
        ]).map(({ key, value, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => set({ [key]: !value })}
            title={label}
            className={`rounded-md p-2 transition-colors ${
              value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      {/* Letter spacing */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">Letter Spacing</label>
          <span className="text-xs text-muted-foreground">{letterSpacing}px</span>
        </div>
        <Slider
          min={-10}
          max={50}
          step={1}
          value={[letterSpacing]}
          onValueChange={([v]) => set({ letterSpacing: v })}
        />
      </div>

      {/* Line height (only when multiline) */}
      {textLines > 1 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground">Line Height</label>
            <span className="text-xs text-muted-foreground">{lineHeight.toFixed(1)}</span>
          </div>
          <Slider
            min={0.5}
            max={3}
            step={0.1}
            value={[lineHeight]}
            onValueChange={([v]) => set({ lineHeight: v })}
          />
        </div>
      )}

      {/* Shadow */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">Shadow</label>
          <ToggleSwitch
            checked={shadow.enabled}
            onChange={(v) => set({ shadow: { ...shadow, enabled: v } })}
          />
        </div>
        {shadow.enabled && (
          <div className="flex flex-col gap-2 rounded-md border border-border p-2">
            <ColorPickerField
              label="Color"
              color={shadow.color}
              onChange={(c) => set({ shadow: { ...shadow, color: c } })}
            />
            <SliderRow
              label="Offset X" value={shadow.offsetX} min={-20} max={20} unit="px"
              onChange={(v) => set({ shadow: { ...shadow, offsetX: v } as TextShadow })}
            />
            <SliderRow
              label="Offset Y" value={shadow.offsetY} min={-20} max={20} unit="px"
              onChange={(v) => set({ shadow: { ...shadow, offsetY: v } as TextShadow })}
            />
            <SliderRow
              label="Blur" value={shadow.blur} min={0} max={30} unit="px"
              onChange={(v) => set({ shadow: { ...shadow, blur: v } as TextShadow })}
            />
          </div>
        )}
      </div>

      {/* Stroke */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">Stroke</label>
          <ToggleSwitch
            checked={stroke.enabled}
            onChange={(v) => set({ stroke: { ...stroke, enabled: v } })}
          />
        </div>
        {stroke.enabled && (
          <div className="flex flex-col gap-2 rounded-md border border-border p-2">
            <ColorPickerField
              label="Color"
              color={stroke.color}
              onChange={(c) => set({ stroke: { ...stroke, color: c } })}
            />
            <SliderRow
              label="Width" value={stroke.width} min={1} max={20} unit="px"
              onChange={(v) => set({ stroke: { ...stroke, width: v } as TextStroke })}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-input'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-4' : ''
        }`}
      />
    </button>
  )
}

function SliderRow({
  label, value, min, max, onChange, unit, step = 1,
}: {
  label: string; value: number; min: number; max: number
  onChange: (v: number) => void; unit: string; step?: number
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-xs text-muted-foreground">{label}</label>
        <span className="text-xs text-muted-foreground">{value}{unit}</span>
      </div>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={([v]) => onChange(v)} />
    </div>
  )
}
