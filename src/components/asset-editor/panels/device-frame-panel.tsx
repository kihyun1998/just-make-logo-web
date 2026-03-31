'use client'

import { useAssetStore } from '@/store/asset-store'
import { FRAME_COLOR_PRESETS, getCompatibleFrames, type DeviceFrameDefinition } from '@/data/device-frames'
import { STORE_ASSET_SPECS } from '@/data/asset-specs'
import { ColorPickerField } from '@/components/editor/color-picker-field'
import { Smartphone, Tablet, X } from 'lucide-react'

interface DeviceFramePanelProps {
  slotId: string
  defaultFrameId?: string
}

export function DeviceFramePanel({ slotId, defaultFrameId }: DeviceFramePanelProps) {
  const selectedSpecId = useAssetStore((s) => s.selectedSpecId)
  const deviceFrameOverrides = useAssetStore((s) => s.deviceFrameOverrides)
  const setDeviceFrame = useAssetStore((s) => s.setDeviceFrame)
  const setDeviceFrameColor = useAssetStore((s) => s.setDeviceFrameColor)

  const override = deviceFrameOverrides[slotId]
  const activeFrameId = override?.frameId ?? defaultFrameId ?? null
  const activeColor = override?.frameColor || '#1A1A1A'

  // Determine compatible frame type from selected spec
  const spec = STORE_ASSET_SPECS.find((s) => s.id === selectedSpecId)
  const isTablet = spec ? spec.width > 1500 || spec.name.toLowerCase().includes('ipad') || spec.name.toLowerCase().includes('tablet') : false
  const compatibleFrames = getCompatibleFrames(isTablet ? 'tablet' : 'phone')

  return (
    <div className="flex flex-col gap-2 rounded-md border border-dashed border-border p-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-muted-foreground uppercase">Device Frame</span>
        {activeFrameId && (
          <button
            onClick={() => setDeviceFrame(slotId, null)}
            className="rounded p-0.5 text-muted-foreground hover:bg-muted"
            title="Remove frame"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Frame selector grid */}
      <div className="grid grid-cols-5 gap-1">
        {compatibleFrames.map((frame) => (
          <FrameButton
            key={frame.id}
            frame={frame}
            isSelected={activeFrameId === frame.id}
            onClick={() => setDeviceFrame(slotId, frame.id)}
          />
        ))}
      </div>

      {/* Color picker (only when a frame is selected) */}
      {activeFrameId && (
        <>
          <div className="flex gap-1">
            {FRAME_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.color}
                title={preset.name}
                onClick={() => setDeviceFrameColor(slotId, preset.color)}
                className={`h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 ${
                  activeColor.toUpperCase() === preset.color.toUpperCase()
                    ? 'border-primary'
                    : 'border-border'
                }`}
                style={{ backgroundColor: preset.color }}
              />
            ))}
          </div>
          <ColorPickerField
            label="Frame Color"
            color={activeColor}
            onChange={(c) => setDeviceFrameColor(slotId, c)}
          />
        </>
      )}
    </div>
  )
}

function FrameButton({ frame, isSelected, onClick }: {
  frame: DeviceFrameDefinition
  isSelected: boolean
  onClick: () => void
}) {
  const Icon = frame.compatibleType === 'tablet' ? Tablet : Smartphone

  return (
    <button
      onClick={onClick}
      title={frame.name}
      className={`flex flex-col items-center gap-0.5 rounded-md border p-1.5 transition-colors ${
        isSelected
          ? 'border-primary bg-primary/10'
          : 'border-border hover:bg-muted'
      }`}
    >
      <Icon className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
      <span className={`text-[8px] leading-tight ${isSelected ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
        {frame.name.split(' ')[0]}
      </span>
    </button>
  )
}
