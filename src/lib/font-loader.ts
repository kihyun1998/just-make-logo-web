import { buildAllFontsUrl } from '@/data/fonts'

let loaded = false

export function loadAllFonts() {
  if (loaded) return
  if (typeof document === 'undefined') return
  loaded = true

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = buildAllFontsUrl()
  document.head.appendChild(link)
}
