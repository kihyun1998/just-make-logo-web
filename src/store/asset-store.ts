'use client'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { temporal } from 'zundo'
import type { AssetEditorState, TextStyleOverride } from '@/types/asset'
import { ASSET_TEMPLATES } from '@/data/asset-templates'
import { STORE_ASSET_SPECS } from '@/data/asset-specs'
import { DEVICE_FRAMES } from '@/data/device-frames'

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
  gradientCenterX: 0.5,
  gradientCenterY: 0.5,
  gradientRadius: 0.5,

  exportFormat: 'png',
}

/** Resolve the default frame ID for a spec based on device type */
function getDefaultFrameForSpec(specId: string | null): string | null {
  if (!specId) return null
  const spec = STORE_ASSET_SPECS.find((s) => s.id === specId)
  if (!spec || spec.category !== 'screenshot') return null
  const isTablet = spec.width > 1500 || spec.name.toLowerCase().includes('ipad') || spec.name.toLowerCase().includes('tablet')
  const type = isTablet ? 'tablet' : 'phone'
  return DEVICE_FRAMES.find((f) => f.compatibleType === type)?.id ?? null
}

interface AssetActions {
  set: (partial: Partial<AssetEditorState>) => void
  selectSpec: (specId: string) => void
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

      selectSpec: (specId) =>
        set((state) => {
          state.selectedSpecId = specId
          const spec = STORE_ASSET_SPECS.find((s) => s.id === specId)
          if (!spec) return

          // Auto-select compatible template if needed
          const currentTemplate = ASSET_TEMPLATES.find((t) => t.id === state.selectedTemplateId)
          if (!currentTemplate || !currentTemplate.compatibleCategories.includes(spec.category)) {
            const first = ASSET_TEMPLATES.find((t) => t.compatibleCategories.includes(spec.category))
            if (first) {
              state.selectedTemplateId = first.id
              state.backgroundColor = first.backgroundColor
              state.useGradient = first.useGradient
              state.gradientType = first.gradientType
              state.gradientDirection = first.gradientDirection
              state.gradientStops = first.gradientStops
              state.gradientCenterX = 0.5
              state.gradientCenterY = 0.5
              state.gradientRadius = 0.5
              state.textOverrides = {}
              state.textStyleOverrides = {}
              state.imageOverrides = {}
            }
          }

          // Auto-assign compatible default frames for screenshot slots
          const tmpl = ASSET_TEMPLATES.find((t) => t.id === state.selectedTemplateId)
          if (tmpl) {
            const defaultFrameId = getDefaultFrameForSpec(specId)
            const newOverrides: typeof state.deviceFrameOverrides = {}
            for (const slot of tmpl.imageSlots) {
              if (slot.role === 'screenshot' && defaultFrameId) {
                const existing = state.deviceFrameOverrides[slot.id]
                newOverrides[slot.id] = {
                  frameId: defaultFrameId,
                  frameColor: existing?.frameColor || '#1A1A1A',
                }
              }
            }
            state.deviceFrameOverrides = newOverrides
          }
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
          state.gradientCenterX = 0.5
          state.gradientCenterY = 0.5
          state.gradientRadius = 0.5
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
