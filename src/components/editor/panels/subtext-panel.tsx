'use client'

import { useLogoStore } from '@/store/logo-store'
import { ToggleSwitch } from '@/components/ui/toggle-switch'
import { FONTS, getFontData } from '@/data/fonts'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ColorPickerField } from '../color-picker-field'
import type { FontWeight } from '@/types/logo'

export function SubTextPanel() {
  const mode = useLogoStore((s) => s.mode)
  const subText = useLogoStore((s) => s.subText)
  const set = useLogoStore((s) => s.set)

  if (mode !== 'textOnly' && mode !== 'textImage') return null

  const fontData = getFontData(subText.fontFamily)
  const availableWeights = fontData?.weights ?? [400]

  const update = (partial: Partial<typeof subText>) => {
    set({ subText: { ...subText, ...partial } })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sub Text
        </h3>
        <ToggleSwitch checked={subText.enabled} onChange={(v) => update({ enabled: v })} aria-label="Toggle sub text" />
      </div>

      {subText.enabled && (
        <>
          <Input
            value={subText.text}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="Slogan text"
            className="h-8 text-sm"
          />

          {/* Position */}
          <div className="flex gap-1">
            {(['above', 'below'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => update({ position: pos })}
                className={`flex-1 rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors ${
                  subText.position === pos
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>

          {/* Font */}
          <Select value={subText.fontFamily} onValueChange={(f) => {
            const newWeights = getFontData(f)?.weights ?? [400]
            const weight = newWeights.includes(subText.fontWeight)
              ? subText.fontWeight : newWeights[0]
            update({ fontFamily: f, fontWeight: weight as FontWeight })
          }}>
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

          {/* Weight */}
          {availableWeights.length > 1 && (
            <Select
              value={String(subText.fontWeight)}
              onValueChange={(v) => update({ fontWeight: Number(v) as FontWeight })}
            >
              <SelectTrigger className="h-8 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableWeights.map((w) => (
                  <SelectItem key={w} value={String(w)}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Color */}
          <ColorPickerField
            label="Color"
            color={subText.color}
            onChange={(c) => update({ color: c })}
          />
        </>
      )}
    </div>
  )
}
