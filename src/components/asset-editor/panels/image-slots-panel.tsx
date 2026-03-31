'use client'

import { useRef } from 'react'
import { useAssetStore } from '@/store/asset-store'
import { ASSET_TEMPLATES } from '@/data/asset-templates'
import { Button } from '@/components/ui/button'
import { Upload, X, Camera, ImageIcon, Layers } from 'lucide-react'
import Image from 'next/image'
import { DeviceFramePanel } from './device-frame-panel'

const ROLE_ICONS: Record<string, typeof Camera> = {
  screenshot: Camera,
  logo: ImageIcon,
  background: Layers,
}

const ROLE_LABELS: Record<string, string> = {
  screenshot: 'Screenshot',
  logo: 'Logo',
  background: 'Background',
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function ImageSlotsPanel() {
  const selectedTemplateId = useAssetStore((s) => s.selectedTemplateId)
  const imageOverrides = useAssetStore((s) => s.imageOverrides)
  const setImageOverride = useAssetStore((s) => s.setImageOverride)

  const template = ASSET_TEMPLATES.find((t) => t.id === selectedTemplateId)
  if (!template || template.imageSlots.length === 0) return null

  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Images
      </h3>
      <div className="flex flex-col gap-2.5">
        {template.imageSlots.map((slot) => (
          <div key={slot.id} className="flex flex-col gap-1.5">
            <ImageSlot
              slotId={slot.id}
              role={slot.role}
              dataUrl={imageOverrides[slot.id] ?? null}
              onUpload={(url) => setImageOverride(slot.id, url)}
              onRemove={() => setImageOverride(slot.id, null)}
            />
            {slot.role === 'screenshot' && (
              <DeviceFramePanel slotId={slot.id} defaultFrameId={slot.deviceFrame} />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function ImageSlot({
  slotId,
  role,
  dataUrl,
  onUpload,
  onRemove,
}: {
  slotId: string
  role: string
  dataUrl: string | null
  onUpload: (url: string) => void
  onRemove: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const Icon = ROLE_ICONS[role] ?? ImageIcon
  const label = ROLE_LABELS[role] ?? role

  const handleFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      alert('Image too large. Max 5MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      onUpload(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <label className="text-xs font-medium text-foreground">{label}</label>
        <span className="text-xs text-muted-foreground">({slotId})</span>
      </div>

      {!dataUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="flex cursor-pointer flex-col items-center gap-1.5 rounded-md border-2 border-dashed border-border p-4 text-center transition-colors hover:border-primary hover:bg-muted/50"
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Click or drag image
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="relative">
            <Image
              src={dataUrl}
              alt={label}
              width={200}
              height={80}
              unoptimized
              className="h-16 w-full rounded-md border border-border object-contain bg-muted/30"
            />
            <button
              onClick={onRemove}
              aria-label={`Remove ${label} image`}
              className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-destructive-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            className="text-xs h-7"
          >
            Change
          </Button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
