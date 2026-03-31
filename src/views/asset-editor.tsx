'use client'

import { useState, useEffect, useRef } from 'react'
import { AssetCanvas } from '@/components/asset-editor/asset-canvas'
import { AssetControlPanel } from '@/components/asset-editor/asset-control-panel'
import { ResizableDivider } from '@/components/editor/resizable-divider'

const MIN = 0.2
const MAX = 0.8
const DEFAULT_DESKTOP = 0.65
const DEFAULT_MOBILE = 0.44

export function AssetEditorView() {
  const getInitialDesktop = () => typeof window !== 'undefined' ? window.innerWidth >= 700 : true
  const [isDesktop, setIsDesktop] = useState(getInitialDesktop)
  const [fraction, setFraction] = useState(() => getInitialDesktop() ? DEFAULT_DESKTOP : DEFAULT_MOBILE)
  const wasDesktop = useRef(getInitialDesktop())

  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= 700
      setIsDesktop(desktop)
      if (desktop !== wasDesktop.current) {
        setFraction(desktop ? DEFAULT_DESKTOP : DEFAULT_MOBILE)
        wasDesktop.current = desktop
      }
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
      <div
        style={previewStyle}
        className="flex shrink-0 items-center justify-center overflow-hidden bg-muted/30 p-3 min-[700px]:p-6"
      >
        <AssetCanvas />
      </div>

      <ResizableDivider
        direction={direction}
        onResize={setFraction}
        min={MIN}
        max={MAX}
      />

      <div
        style={panelStyle}
        className="min-h-0 shrink-0 overflow-y-auto border-t border-border min-[700px]:border-l min-[700px]:border-t-0"
      >
        <AssetControlPanel />
      </div>
    </div>
  )
}
