'use client'

import { create } from 'zustand'
import type { ColorPreset } from '@/types/logo'

const STORAGE_KEY = 'color-presets'
const MAX_PRESETS = 50

interface StoredPreset extends ColorPreset {
  id: string
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function loadFromStorage(): StoredPreset[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(presets: StoredPreset[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

interface ColorPresetsStore {
  presets: StoredPreset[]
  add: (preset: ColorPreset) => boolean
  remove: (id: string) => void
  rename: (id: string, newName: string) => boolean
}

export const useColorPresetsStore = create<ColorPresetsStore>((set, get) => ({
  presets: loadFromStorage(),

  add: (preset) => {
    const current = get().presets
    if (current.length >= MAX_PRESETS) return false
    if (current.some((p) => p.name === preset.name)) return false
    const next = [...current, { ...preset, id: generateId() }]
    saveToStorage(next)
    set({ presets: next })
    return true
  },

  remove: (id) => {
    const next = get().presets.filter((p) => p.id !== id)
    saveToStorage(next)
    set({ presets: next })
  },

  rename: (id, newName) => {
    const current = get().presets
    const trimmed = newName.trim()
    if (!trimmed) return false
    if (current.some((p) => p.id !== id && p.name === trimmed)) return false
    const next = current.map((p) => p.id === id ? { ...p, name: trimmed } : p)
    saveToStorage(next)
    set({ presets: next })
    return true
  },
}))
