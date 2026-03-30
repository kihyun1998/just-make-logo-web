'use client'

import { useState } from 'react'
import { useLogoStore } from '@/store/logo-store'
import { useColorPresetsStore } from '@/store/color-presets-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'

export function ColorPresetsPanel() {
  const backgroundColor = useLogoStore((s) => s.backgroundColor)
  const textColor = useLogoStore((s) => s.textColor)
  const set = useLogoStore((s) => s.set)

  const { presets, add, remove, rename } = useColorPresetsStore()
  const [newName, setNewName] = useState('')
  const [editingName, setEditingName] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleAdd = () => {
    const name = newName.trim() || `Preset ${presets.length + 1}`
    if (presets.some((p) => p.name === name)) {
      alert('Name already exists.')
      return
    }
    add({ name, backgroundColor, textColor })
    setNewName('')
  }

  const handleApply = (preset: { backgroundColor: string; textColor: string }) => {
    set({ backgroundColor: preset.backgroundColor, textColor: preset.textColor, isTransparent: false })
  }

  const handleStartRename = (name: string) => {
    setEditingName(name)
    setEditValue(name)
  }

  const handleConfirmRename = () => {
    if (!editingName) return
    const trimmed = editValue.trim()
    if (!trimmed || (trimmed !== editingName && presets.some((p) => p.name === trimmed))) {
      setEditingName(null)
      return
    }
    rename(editingName, trimmed)
    setEditingName(null)
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Color Presets
      </h3>

      {/* Save current */}
      <div className="flex gap-1.5">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Preset name"
          className="h-8 flex-1 text-xs"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button variant="outline" size="sm" onClick={handleAdd} className="h-8 px-2">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Preview of current colors */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Current:</span>
        <HalfCirclePreview bg={backgroundColor} fg={textColor} />
      </div>

      {/* Preset list */}
      {presets.length === 0 ? (
        <p className="text-xs text-muted-foreground">No saved presets.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {presets.map((preset) => (
            <div
              key={preset.name}
              className="flex items-center gap-2 rounded-md border border-border p-1.5"
            >
              {/* Half-circle preview */}
              <button
                onClick={() => handleApply(preset)}
                title="Apply preset"
                className="shrink-0"
              >
                <HalfCirclePreview bg={preset.backgroundColor} fg={preset.textColor} />
              </button>

              {/* Name (editable) */}
              {editingName === preset.name ? (
                <div className="flex flex-1 items-center gap-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-6 flex-1 text-xs"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConfirmRename()
                      if (e.key === 'Escape') setEditingName(null)
                    }}
                  />
                  <button onClick={handleConfirmRename}>
                    <Check className="h-3 w-3 text-primary" />
                  </button>
                  <button onClick={() => setEditingName(null)}>
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleApply(preset)}
                  className="flex-1 truncate text-left text-xs"
                >
                  {preset.name}
                </button>
              )}

              {/* Actions */}
              {editingName !== preset.name && (
                <div className="flex shrink-0 gap-0.5">
                  <button
                    onClick={() => handleStartRename(preset.name)}
                    title="Rename"
                    className="rounded p-1 hover:bg-muted"
                  >
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => remove(preset.name)}
                    title="Delete"
                    className="rounded p-1 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/** Half-circle preview: left = background, right = text color */
function HalfCirclePreview({ bg, fg }: { bg: string; fg: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0">
      <path d="M12 2 A10 10 0 0 0 12 22 Z" fill={bg} stroke="currentColor" strokeWidth="0.5" opacity="0.8" />
      <path d="M12 2 A10 10 0 0 1 12 22 Z" fill={fg} stroke="currentColor" strokeWidth="0.5" opacity="0.8" />
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  )
}
