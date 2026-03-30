'use client'

import { LogoCanvas } from '@/components/editor/logo-canvas'
import { ControlPanel } from '@/components/editor/control-panel'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

export function EditorView() {
  useKeyboardShortcuts()

  return (
    <div className="flex min-h-0 flex-1 flex-col min-[700px]:flex-row">
      {/* Preview area */}
      <div className="flex flex-[3] items-center justify-center overflow-hidden bg-muted/30 p-4 min-[700px]:p-8">
        <LogoCanvas />
      </div>

      {/* Control panel — only this area scrolls */}
      <div className="min-h-0 flex-[2] overflow-y-auto border-t border-border min-[700px]:flex-[1] min-[700px]:border-l min-[700px]:border-t-0">
        <ControlPanel />
      </div>
    </div>
  )
}
