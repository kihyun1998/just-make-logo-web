'use client'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { temporal } from 'zundo'
import type { LogoState } from '@/types/logo'

export const DEFAULT_LOGO_STATE: LogoState = {
  schemaVersion: 1,
  mode: 'textOnly',

  text1: 'LOGO',
  text2: '',
  text3: '',
  textLines: 1,
  fontFamily: 'Inter',
  fontWeight: 700,
  textColor: '#000000',
  textPadding: 0,
  italic: false,
  uppercase: false,
  underline: false,
  rotation: 0,
  letterSpacing: 0,
  lineHeight: 1.2,

  shadow: { enabled: false, color: '#000000', offsetX: 2, offsetY: 2, blur: 4 },
  stroke: { enabled: false, color: '#000000', width: 2 },

  subText: {
    enabled: false,
    text: '',
    fontFamily: 'Inter',
    fontWeight: 400,
    color: '#666666',
    position: 'below',
  },

  backgroundColor: '#FFFFFF',
  backgroundShape: 'rectangle',
  isTransparent: false,
  canvasPadding: 10,
  borderRadius: 0,

  useGradient: false,
  gradientType: 'linear',
  gradientDirection: 'topLeftToBottomRight',
  gradientStops: [
    { color: '#FF512F', position: 0 },
    { color: '#F09819', position: 1 },
  ],

  imagePosition: 'top',
  imageFlex: 50,
  imageGap: 10,
  imageFit: 'contain',

  canvasWidth: 512,
  canvasHeight: 512,

  exportFormat: 'png',
  exportScale: 1,
}

interface LogoActions {
  set: (partial: Partial<LogoState>) => void
  reset: () => void
}

export type LogoStore = LogoState & LogoActions

export const useLogoStore = create<LogoStore>()(
  temporal(
    immer((set) => ({
      ...DEFAULT_LOGO_STATE,

      set: (partial) =>
        set((state) => {
          Object.assign(state, partial)
        }),

      reset: () =>
        set((state) => {
          Object.assign(state, DEFAULT_LOGO_STATE)
        }),
    })),
    {
      limit: 50,
      // Throttle history tracking — only record after 300ms of inactivity
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
  )
)
