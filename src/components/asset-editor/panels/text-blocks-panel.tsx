'use client'

import { useAssetStore } from '@/store/asset-store'
import { ASSET_TEMPLATES } from '@/data/asset-templates'
import { FONTS } from '@/data/fonts'
import { ColorPickerField } from '@/components/editor/color-picker-field'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { FontWeight } from '@/types/logo'

const ROLE_LABELS: Record<string, string> = {
  title: 'Title',
  subtitle: 'Subtitle',
  badge: 'Badge',
}

export function TextBlocksPanel() {
  const selectedTemplateId = useAssetStore((s) => s.selectedTemplateId)
  const textOverrides = useAssetStore((s) => s.textOverrides)
  const textStyleOverrides = useAssetStore((s) => s.textStyleOverrides)
  const setTextOverride = useAssetStore((s) => s.setTextOverride)
  const setTextStyleOverride = useAssetStore((s) => s.setTextStyleOverride)

  const template = ASSET_TEMPLATES.find((t) => t.id === selectedTemplateId)
  if (!template) return null

  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Text
      </h3>
      <div className="flex flex-col gap-3">
        {template.textBlocks.map((block) => {
          const style = textStyleOverrides[block.id]
          const currentFont = style?.fontFamily || 'Inter'
          const fontData = FONTS.find((f) => f.family === currentFont)
          const currentWeight = style?.fontWeight || block.fontWeight
          const currentColor = style?.color || block.color

          return (
            <div key={block.id} className="flex flex-col gap-2 rounded-md border border-border p-2.5">
              <label className="text-xs font-medium text-foreground">
                {ROLE_LABELS[block.role] ?? block.role}
              </label>

              {/* Text input */}
              {block.maxLines > 1 ? (
                <textarea
                  value={textOverrides[block.id] ?? ''}
                  placeholder={block.defaultTextKey}
                  rows={block.maxLines}
                  onChange={(e) => setTextOverride(block.id, e.target.value)}
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                />
              ) : (
                <input
                  type="text"
                  value={textOverrides[block.id] ?? ''}
                  placeholder={block.defaultTextKey}
                  onChange={(e) => setTextOverride(block.id, e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                />
              )}

              {/* Font + Weight */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    value={currentFont}
                    onValueChange={(v) => setTextStyleOverride(block.id, { fontFamily: v })}
                  >
                    <SelectTrigger className="h-7 w-full text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONTS.map((f) => (
                        <SelectItem key={f.family} value={f.family}>
                          <span style={{ fontFamily: f.family }}>{f.family}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-20">
                  <Select
                    value={String(currentWeight)}
                    onValueChange={(v) => setTextStyleOverride(block.id, { fontWeight: Number(v) as FontWeight })}
                  >
                    <SelectTrigger className="h-7 w-full text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(fontData?.weights ?? [100, 200, 300, 400, 500, 600, 700, 800, 900]).map((w) => (
                        <SelectItem key={w} value={String(w)}>
                          {w}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Color */}
              <ColorPickerField
                label="Color"
                color={currentColor}
                onChange={(c) => setTextStyleOverride(block.id, { color: c })}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
