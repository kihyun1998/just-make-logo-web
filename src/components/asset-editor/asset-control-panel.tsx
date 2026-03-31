'use client'

import { useAssetStore } from '@/store/asset-store'
import { SpecSelectorPanel } from './panels/spec-selector-panel'
import { TemplateSelectorPanel } from './panels/template-selector-panel'
import { TextBlocksPanel } from './panels/text-blocks-panel'
import { ImageSlotsPanel } from './panels/image-slots-panel'
import { AssetBackgroundPanel } from './panels/asset-background-panel'
import { AssetExportPanel } from './panels/asset-export-panel'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AssetControlPanel() {
  const reset = useAssetStore((s) => s.reset)

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header + Reset */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Asset Editor</span>
        <Button variant="ghost" size="icon-sm" onClick={reset} aria-label="Reset all settings" title="Reset all settings">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      <SpecSelectorPanel />

      <hr className="border-border" />

      <TemplateSelectorPanel />

      <hr className="border-border" />

      <TextBlocksPanel />

      <hr className="border-border" />

      <ImageSlotsPanel />

      <hr className="border-border" />

      <AssetBackgroundPanel />

      <hr className="border-border" />

      <AssetExportPanel />
    </div>
  )
}
