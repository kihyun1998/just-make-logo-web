'use client'

import { create } from 'zustand'
import type { ColorPreset } from '@/types/logo'

const STORAGE_KEY = 'color-presets'

function loadFromStorage(): ColorPreset[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(presets: ColorPreset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
}

interface ColorPresetsStore {
  presets: ColorPreset[]
  add: (preset: ColorPreset) => void
  remove: (name: string) => void
  rename: (oldName: string, newName: string) => void
}

export const useColorPresetsStore = create<ColorPresetsStore>((set, get) => ({
  presets: loadFromStorage(),

  add: (preset) => {
    const next = [...get().presets, preset]
    saveToStorage(next)
    set({ presets: next })
  },

  remove: (name) => {
    const next = get().presets.filter((p) => p.name !== name)
    saveToStorage(next)
    set({ presets: next })
  },

  rename: (oldName, newName) => {
    const next = get().presets.map((p) =>
      p.name === oldName ? { ...p, name: newName } : p
    )
    saveToStorage(next)
    set({ presets: next })
  },
}))
