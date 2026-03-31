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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleAdd = () => {
    // Auto-generate unique name if empty
    let name = newName.trim()
    if (!name) {
      let counter = presets.length + 1
      while (presets.some((p) => p.name === `Preset ${counter}`)) counter++
      name = `Preset ${counter}`
    }
    const ok = add({ name, backgroundColor, textColor })
    if (!ok) {
      alert('Name already exists or max presets reached (50).')
      return
    }
    setNewName('')
  }

  const handleApply = (preset: { backgroundColor: string; textColor: string }) => {
    set({ backgroundColor: preset.backgroundColor, textColor: preset.textColor, isTransparent: false })
  }

  const handleStartRename = (id: string, currentName: string) => {
    setEditingId(id)
    setEditValue(currentName)
  }

  const handleConfirmRename = () => {
    if (!editingId) return
    const ok = rename(editingId, editValue)
    if (!ok) {
      // name empty or duplicate — just cancel
    }
    setEditingId(null)
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    remove(id)
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
          aria-label="New preset name"
        />
        <Button variant="outline" size="sm" onClick={handleAdd} className="h-8 px-2" aria-label="Save color preset">
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
              key={preset.id}
              className="flex items-center gap-2 rounded-md border border-border p-1.5"
            >
              {/* Half-circle preview */}
              <button
                onClick={() => handleApply(preset)}
                aria-label={`Apply preset ${preset.name}`}
                className="shrink-0"
              >
                <HalfCirclePreview bg={preset.backgroundColor} fg={preset.textColor} />
              </button>

              {/* Name (editable) */}
              {editingId === preset.id ? (
                <div className="flex flex-1 items-center gap-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-6 flex-1 text-xs"
                    autoFocus
                    aria-label="Rename preset"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConfirmRename()
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                  />
                  <button onClick={handleConfirmRename} aria-label="Confirm rename" className="rounded p-1.5 hover:bg-muted">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </button>
                  <button onClick={() => setEditingId(null)} aria-label="Cancel rename" className="rounded p-1.5 hover:bg-muted">
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleApply(preset)}
                  className="flex-1 truncate text-left text-xs"
                  aria-label={`Apply preset ${preset.name}`}
                >
                  {preset.name}
                </button>
              )}

              {/* Actions */}
              {editingId !== preset.id && (
                <div className="flex shrink-0 gap-0.5">
                  <button
                    onClick={() => handleStartRename(preset.id, preset.name)}
                    aria-label={`Rename ${preset.name}`}
                    className="rounded p-1.5 hover:bg-muted"
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(preset.id, preset.name)}
                    aria-label={`Delete ${preset.name}`}
                    className="rounded p-1.5 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
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

function HalfCirclePreview({ bg, fg }: { bg: string; fg: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
      <path d="M12 2 A10 10 0 0 0 12 22 Z" fill={bg} stroke="currentColor" strokeWidth="0.5" opacity="0.8" />
      <path d="M12 2 A10 10 0 0 1 12 22 Z" fill={fg} stroke="currentColor" strokeWidth="0.5" opacity="0.8" />
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  )
}
