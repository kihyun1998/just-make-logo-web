'use client'

import { useRef } from 'react'
import { useLogoStore } from '@/store/logo-store'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Upload, X } from 'lucide-react'
import type { ImagePosition, ImageFit } from '@/types/logo'

export function ImagePanel() {
  const mode = useLogoStore((s) => s.mode)
  const imageDataUrl = useLogoStore((s) => s.imageDataUrl)
  const imagePosition = useLogoStore((s) => s.imagePosition)
  const imageFlex = useLogoStore((s) => s.imageFlex)
  const imageGap = useLogoStore((s) => s.imageGap)
  const imageFit = useLogoStore((s) => s.imageFit)
  const set = useLogoStore((s) => s.set)
  const fileRef = useRef<HTMLInputElement>(null)

  const showImage = mode === 'imageOnly' || mode === 'textImage'
  if (!showImage) return null

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      set({ imageDataUrl: e.target?.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Image
      </h3>

      {/* Upload area */}
      {!imageDataUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary hover:bg-muted/50"
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Click or drag image here
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUrl}
              alt="Logo image"
              className="h-20 w-full rounded-md border border-border object-contain"
            />
            <button
              onClick={() => set({ imageDataUrl: null })}
              className="absolute top-1 right-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            className="text-xs"
          >
            Change Image
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

      {/* Text+Image layout options */}
      {mode === 'textImage' && imageDataUrl && (
        <>
          {/* Position */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Image Position</label>
            <div className="flex gap-1">
              {(['top', 'bottom', 'left', 'right'] as ImagePosition[]).map((pos) => (
                <button
                  key={pos}
                  onClick={() => set({ imagePosition: pos })}
                  className={`flex-1 rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors ${
                    imagePosition === pos
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Image flex ratio */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Image Ratio</label>
              <span className="text-xs text-muted-foreground">{imageFlex}%</span>
            </div>
            <Slider
              min={10} max={90} step={5}
              value={[imageFlex]}
              onValueChange={([v]) => set({ imageFlex: v })}
            />
          </div>

          {/* Gap */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Gap</label>
              <span className="text-xs text-muted-foreground">{imageGap}px</span>
            </div>
            <Slider
              min={0} max={50} step={1}
              value={[imageGap]}
              onValueChange={([v]) => set({ imageGap: v })}
            />
          </div>

          {/* Fit mode */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Fit</label>
            <Select value={imageFit} onValueChange={(v) => set({ imageFit: v as ImageFit })}>
              <SelectTrigger className="h-8 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="fill">Fill</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  )
}
