import { buildAllFontsUrl } from '@/data/fonts'

const LINK_ID = 'google-fonts-all'

export function loadAllFonts() {
  if (typeof document === 'undefined') return
  // Prevent duplicate link tags (HMR safe)
  if (document.getElementById(LINK_ID)) return

  const link = document.createElement('link')
  link.id = LINK_ID
  link.rel = 'stylesheet'
  link.href = buildAllFontsUrl()
  document.head.appendChild(link)
}
