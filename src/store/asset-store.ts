'use client'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { temporal } from 'zundo'
import type { AssetEditorState, TextStyleOverride } from '@/types/asset'
import { ASSET_TEMPLATES } from '@/data/asset-templates'

export const DEFAULT_ASSET_STATE: AssetEditorState = {
  selectedSpecId: null,
  selectedTemplateId: null,

  textOverrides: {},
  textStyleOverrides: {},
  imageOverrides: {},
  deviceFrameOverrides: {},

  backgroundColor: '#667EEA',
  useGradient: true,
  gradientType: 'linear',
  gradientDirection: 'topLeftToBottomRight',
  gradientStops: [
    { color: '#667EEA', position: 0 },
    { color: '#764BA2', position: 1 },
  ],

  exportFormat: 'png',
}

interface AssetActions {
  set: (partial: Partial<AssetEditorState>) => void
  setTextOverride: (blockId: string, value: string) => void
  setTextStyleOverride: (blockId: string, style: Partial<TextStyleOverride>) => void
  setImageOverride: (slotId: string, dataUrl: string | null) => void
  setDeviceFrame: (slotId: string, frameId: string | null) => void
  setDeviceFrameColor: (slotId: string, color: string) => void
  applyTemplateDefaults: (templateId: string) => void
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

      setTextStyleOverride: (blockId, style) =>
        set((state) => {
          state.textStyleOverrides[blockId] = {
            ...state.textStyleOverrides[blockId],
            ...style,
          }
        }),

      setImageOverride: (slotId, dataUrl) =>
        set((state) => {
          state.imageOverrides[slotId] = dataUrl
        }),

      setDeviceFrame: (slotId, frameId) =>
        set((state) => {
          const existing = state.deviceFrameOverrides[slotId]
          state.deviceFrameOverrides[slotId] = {
            frameId,
            frameColor: existing?.frameColor || '#1A1A1A',
          }
        }),

      setDeviceFrameColor: (slotId, color) =>
        set((state) => {
          if (!state.deviceFrameOverrides[slotId]) {
            state.deviceFrameOverrides[slotId] = { frameId: null, frameColor: color }
          } else {
            state.deviceFrameOverrides[slotId].frameColor = color
          }
        }),

      applyTemplateDefaults: (templateId) =>
        set((state) => {
          const tmpl = ASSET_TEMPLATES.find((t) => t.id === templateId)
          if (!tmpl) return
          state.selectedTemplateId = templateId
          state.backgroundColor = tmpl.backgroundColor
          state.useGradient = tmpl.useGradient
          state.gradientType = tmpl.gradientType
          state.gradientDirection = tmpl.gradientDirection
          state.gradientStops = tmpl.gradientStops
          state.textOverrides = {}
          state.textStyleOverrides = {}
          state.imageOverrides = {}
          state.deviceFrameOverrides = {}
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
