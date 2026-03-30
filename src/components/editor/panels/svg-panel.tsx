'use client'

import { useRef } from 'react'
import { useLogoStore } from '@/store/logo-store'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'

export function SvgPanel() {
  const mode = useLogoStore((s) => s.mode)
  const svgContent = useLogoStore((s) => s.svgContent)
  const set = useLogoStore((s) => s.set)
  const fileRef = useRef<HTMLInputElement>(null)

  if (mode !== 'svgOnly') return null

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      set({ svgContent: e.target?.result as string })
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.svg')) handleFile(file)
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        SVG
      </h3>

      {!svgContent ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary hover:bg-muted/50"
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Click or drag .svg file here
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div
            className="flex h-20 items-center justify-center rounded-md border border-border bg-white p-2"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
              className="flex-1 text-xs"
            >
              Change
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => set({ svgContent: null })}
              className="text-xs"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".svg"
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
