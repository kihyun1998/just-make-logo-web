'use client'

import { LogoCanvas } from '@/components/editor/logo-canvas'
import { ControlPanel } from '@/components/editor/control-panel'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

export function EditorView() {
  useKeyboardShortcuts()

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col min-[700px]:flex-row">
      {/* Preview area - 3/4 on desktop, 3/5 on mobile */}
      <div className="flex flex-[3] items-center justify-center bg-muted/30 p-4 min-[700px]:p-8">
        <LogoCanvas />
      </div>

      {/* Control panel - 1/4 on desktop, 2/5 on mobile */}
      <div className="flex-[2] overflow-y-auto border-t border-border min-[700px]:flex-[1] min-[700px]:border-l min-[700px]:border-t-0">
        <ControlPanel />
      </div>
    </div>
  )
}
