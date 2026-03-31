'use client'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { temporal } from 'zundo'
import type { AssetEditorState } from '@/types/asset'

export const DEFAULT_ASSET_STATE: AssetEditorState = {
  selectedSpecId: null,
  selectedTemplateId: null,

  textOverrides: {},
  imageOverrides: {},

  backgroundColor: '#667EEA',
  useGradient: true,
  gradientType: 'linear',
  gradientDirection: 'topLeftToBottomRight',
  gradientStops: [
    { color: '#667EEA', position: 0 },
    { color: '#764BA2', position: 1 },
  ],
}

interface AssetActions {
  set: (partial: Partial<AssetEditorState>) => void
  setTextOverride: (blockId: string, value: string) => void
  setImageOverride: (slotId: string, dataUrl: string | null) => void
  reset: () => void
}

export type AssetStore = AssetEditorState & AssetActions

export const useAssetStore = create<AssetStore>()(
  temporal(
    immer((set) => ({
      ...DEFAULT_ASSET_STATE,

      set: (partial) =>
        set((state) => {
          Object.assign(state, partial)
        }),

      setTextOverride: (blockId, value) =>
        set((state) => {
          state.textOverrides[blockId] = value
        }),

      setImageOverride: (slotId, dataUrl) =>
        set((state) => {
          state.imageOverrides[slotId] = dataUrl
        }),

      reset: () =>
        set((state) => {
          Object.assign(state, DEFAULT_ASSET_STATE)
        }),
    })),
    {
      limit: 30,
      handleSet: (handleSet) => {
        let timeout: ReturnType<typeof setTimeout> | undefined
        return (state) => {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            handleSet(state)
          }, 300)
        }
      },
    },
  ),
)
