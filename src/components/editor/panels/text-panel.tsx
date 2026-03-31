'use client'

import { useLogoStore } from '@/store/logo-store'
import { FONTS, getFontData } from '@/data/fonts'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ColorPickerField } from '../color-picker-field'
import type { FontWeight } from '@/types/logo'

export function TextPanel() {
  const text1 = useLogoStore((s) => s.text1)
  const text2 = useLogoStore((s) => s.text2)
  const text3 = useLogoStore((s) => s.text3)
  const textLines = useLogoStore((s) => s.textLines)
  const fontFamily = useLogoStore((s) => s.fontFamily)
  const fontWeight = useLogoStore((s) => s.fontWeight)
  const textColor = useLogoStore((s) => s.textColor)
  const textPadding = useLogoStore((s) => s.textPadding)
  const set = useLogoStore((s) => s.set)

  const fontData = getFontData(fontFamily)
  const availableWeights = fontData?.weights ?? [400]

  const handleFontChange = (family: string) => {
    const newFontData = getFontData(family)
    const newWeights = newFontData?.weights ?? [400]
    const weight = newWeights.includes(fontWeight)
      ? fontWeight
      : newWeights[0]
    set({ fontFamily: family, fontWeight: weight as FontWeight })
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Text
      </h3>

      {/* Text lines selector */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground w-12 shrink-0">Lines</label>
        <div className="flex gap-1">
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              onClick={() => set({ textLines: n })}
              aria-pressed={textLines === n}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                textLines === n
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Text inputs */}
      <div className="flex flex-col gap-2">
        <Input
          value={text1}
          onChange={(e) => set({ text1: e.target.value })}
          placeholder="Line 1"
          className="h-8 text-sm"
        />
        {textLines >= 2 && (
          <Input
            value={text2}
            onChange={(e) => set({ text2: e.target.value })}
            placeholder="Line 2"
            className="h-8 text-sm"
          />
        )}
        {textLines >= 3 && (
          <Input
            value={text3}
            onChange={(e) => set({ text3: e.target.value })}
            placeholder="Line 3"
            className="h-8 text-sm"
          />
        )}
      </div>

      {/* Font family */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground">Font</label>
        <Select value={fontFamily} onValueChange={handleFontChange}>
          <SelectTrigger className="h-8 w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {FONTS.map((f) => (
              <SelectItem key={f.family} value={f.family}>
                <span style={{ fontFamily: `"${f.family}", sans-serif` }}>
                  {f.family}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font weight */}
      {availableWeights.length > 1 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">
            Weight — {fontWeight}
          </label>
          <Select
            value={String(fontWeight)}
            onValueChange={(v) => set({ fontWeight: Number(v) as FontWeight })}
          >
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableWeights.map((w) => (
                <SelectItem key={w} value={String(w)}>
                  {w} — {weightLabel(w)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Text color */}
      <ColorPickerField
        label="Text Color"
        color={textColor}
        onChange={(c) => set({ textColor: c })}
      />

      {/* Text padding */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">Text Padding</label>
          <span className="text-xs text-muted-foreground">{textPadding}%</span>
        </div>
        <Slider
          min={0}
          max={90}
          step={1}
          value={[textPadding]}
          onValueChange={([v]) => set({ textPadding: v })}
        />
      </div>
    </div>
  )
}

function weightLabel(w: number): string {
  const labels: Record<number, string> = {
    100: 'Thin',
    200: 'ExtraLight',
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'SemiBold',
    700: 'Bold',
    800: 'ExtraBold',
    900: 'Black',
  }
  return labels[w] ?? ''
}
