'use client'

import { useState, useEffect } from 'react'
import { LogoCanvas } from '@/components/editor/logo-canvas'
import { ControlPanel } from '@/components/editor/control-panel'
import { ResizableDivider } from '@/components/editor/resizable-divider'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

const MIN = 0.2
const MAX = 0.8
const DEFAULT_DESKTOP = 0.7  // preview 70%
const DEFAULT_MOBILE = 0.44  // preview ~4:5

export function EditorView() {
  useKeyboardShortcuts()
  const [fraction, setFraction] = useState(DEFAULT_DESKTOP)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= 700
      setIsDesktop(desktop)
      setFraction(desktop ? DEFAULT_DESKTOP : DEFAULT_MOBILE)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const direction = isDesktop ? 'horizontal' : 'vertical'
  const previewStyle = isDesktop
    ? { width: `${fraction * 100}%` }
    : { height: `${fraction * 100}%` }
  const panelStyle = isDesktop
    ? { width: `${(1 - fraction) * 100}%` }
    : { height: `${(1 - fraction) * 100}%` }

  return (
    <div className={`flex min-h-0 flex-1 ${isDesktop ? 'flex-row' : 'flex-col'}`}>
      {/* Preview area */}
      <div
        style={previewStyle}
        className="flex shrink-0 items-center justify-center overflow-hidden bg-muted/30 p-3 min-[700px]:p-6"
      >
        <LogoCanvas />
      </div>

      {/* Resizable divider */}
      <ResizableDivider
        direction={direction}
        onResize={setFraction}
        min={MIN}
        max={MAX}
      />

      {/* Control panel */}
      <div
        style={panelStyle}
        className="min-h-0 shrink-0 overflow-y-auto border-t border-border min-[700px]:border-l min-[700px]:border-t-0"
      >
        <ControlPanel />
      </div>
    </div>
  )
}
