'use client'

import { useEffect } from 'react'
import { useLogoStore } from '@/store/logo-store'
import { loadAllFonts } from '@/lib/font-loader'
import { TextPanel } from './panels/text-panel'
import { StylePanel } from './panels/style-panel'
import { SubTextPanel } from './panels/subtext-panel'
import { ImagePanel } from './panels/image-panel'
import { SvgPanel } from './panels/svg-panel'
import { BackgroundPanel } from './panels/background-panel'
import { GradientPanel } from './panels/gradient-panel'
import { ColorPresetsPanel } from './panels/color-presets-panel'
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

  const showText = mode === 'textOnly' || mode === 'textImage'

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
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  mode === m.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
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

      {/* Text panel (text modes) */}
      {showText && <TextPanel />}
      {showText && <hr className="border-border" />}

      {/* Style panel (text modes) */}
      {showText && <StylePanel />}
      {showText && <hr className="border-border" />}

      {/* Sub text panel (text modes) */}
      {showText && <SubTextPanel />}
      {showText && <hr className="border-border" />}

      {/* Image panel (image modes) */}
      <ImagePanel />
      {(mode === 'imageOnly' || mode === 'textImage') && <hr className="border-border" />}

      {/* SVG panel */}
      <SvgPanel />
      {mode === 'svgOnly' && <hr className="border-border" />}

      {/* Background panel */}
      <BackgroundPanel />

      <hr className="border-border" />

      {/* Gradient panel */}
      <GradientPanel />

      <hr className="border-border" />

      {/* Color presets */}
      <ColorPresetsPanel />

      <hr className="border-border" />

      {/* Export panel */}
      <ExportPanel />
    </div>
  )
}
