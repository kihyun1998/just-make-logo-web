'use client'

import { useState } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ColorPickerFieldProps {
  label: string
  color: string
  onChange: (color: string) => void
}

export function ColorPickerField({ label, color, onChange }: ColorPickerFieldProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <label className="text-xs text-muted-foreground">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="flex items-center gap-2 rounded-md border border-input px-2 py-1"
            type="button"
          >
            <div
              className="h-5 w-5 rounded-sm border border-border"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-mono">{color.toUpperCase()}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="end">
          <div className="flex flex-col gap-3">
            <HexColorPicker color={color} onChange={onChange} />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">#</span>
              <HexColorInput
                color={color}
                onChange={onChange}
                className="h-7 w-full rounded-md border border-input bg-transparent px-2 text-xs font-mono"
                prefixed={false}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
