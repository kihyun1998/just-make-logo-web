'use client'

import { useEffect } from 'react'
import { useLogoStore } from '@/store/logo-store'
import { loadAllFonts } from '@/lib/font-loader'
import { TextPanel } from './panels/text-panel'
import { StylePanel } from './panels/style-panel'
import { BackgroundPanel } from './panels/background-panel'
import { ExportPanel } from './panels/export-panel'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LogoMode } from '@/types/logo'

const MODES: { value: LogoMode; label: string }[] = [
  { value: 'textOnly', label: 'Text' },
  { value: 'imageOnly', label: 'Image' },
  { value: 'textImage', label: 'Text + Image' },
  { value: 'svgOnly', label: 'SVG' },
]

export function ControlPanel() {
  const mode = useLogoStore((s) => s.mode)
  const set = useLogoStore((s) => s.set)
  const reset = useLogoStore((s) => s.reset)

  useEffect(() => {
    loadAllFonts()
  }, [])

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Mode selector + Reset */}
      <div className="flex items-start justify-between">
        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground">Mode</label>
          <div className="flex flex-wrap gap-1.5">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => set({ mode: m.value })}
                disabled={m.value !== 'textOnly'}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  mode === m.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={reset} title="Reset all settings">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      <hr className="border-border" />

      {/* Text panel */}
      <TextPanel />

      <hr className="border-border" />

      {/* Style panel */}
      <StylePanel />

      <hr className="border-border" />

      {/* Background panel */}
      <BackgroundPanel />

      <hr className="border-border" />

      {/* Export panel */}
      <ExportPanel />
    </div>
  )
}
