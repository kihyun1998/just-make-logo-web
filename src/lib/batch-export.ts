import JSZip from 'jszip'
import type { LogoState, DeviceGroup, ExportFormat } from '@/types/logo'
import { renderLogo } from './render-logo'
import { generateSvg } from './export-svg'

export interface BatchExportItem {
  platform: string
  sizeName: string
  width: number
  height: number
}

export interface BatchProgress {
  current: number
  total: number
  currentLabel: string
}

/**
 * Flatten selected device groups into a list of export items.
 */
export function flattenGroups(
  groups: DeviceGroup[],
  selectedPlatforms: Set<string>,
): BatchExportItem[] {
  const items: BatchExportItem[] = []
  for (const group of groups) {
    if (!selectedPlatforms.has(group.platform)) continue
    for (const size of group.sizes) {
      items.push({
        platform: group.platform,
        sizeName: size.name,
        width: size.width,
        height: size.height,
      })
    }
  }
  return items
}

/**
 * Load the image element needed for raster export (if any).
 */
async function loadImageForExport(state: LogoState): Promise<HTMLImageElement | null> {
  const imgSrc =
    state.mode === 'svgOnly' && state.svgContent
      ? URL.createObjectURL(new Blob([state.svgContent], { type: 'image/svg+xml' }))
      : state.mode === 'imageOnly' || state.mode === 'textImage'
        ? state.imageDataUrl
        : null

  if (!imgSrc) return null

  const image = await new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = imgSrc
  })

  if (state.mode === 'svgOnly') URL.revokeObjectURL(imgSrc)
  return image
}

/**
 * Render a single item to a Blob (PNG format, 1x scale for batch).
 */
function renderItemToBlob(
  state: LogoState,
  width: number,
  height: number,
  format: ExportFormat,
  image: HTMLImageElement | null,
): Promise<Blob | null> {
  if (format === 'svg') {
    const svgString = generateSvg({ ...state, canvasWidth: width, canvasHeight: height })
    return Promise.resolve(new Blob([svgString], { type: 'image/svg+xml' }))
  }

  const offscreen = document.createElement('canvas')
  offscreen.width = width
  offscreen.height = height
  const ctx = offscreen.getContext('2d')
  if (!ctx) return Promise.resolve(null)

  const isJpg = format === 'jpg'
  renderLogo(ctx, { ...state, canvasWidth: width, canvasHeight: height }, width, height, {
    checkerboard: false,
    jpgBackground: isJpg && state.isTransparent,
    image,
  })

  const mimeType = isJpg ? 'image/jpeg' : 'image/png'
  const quality = isJpg ? 0.95 : undefined

  return new Promise((resolve) => {
    offscreen.toBlob(
      (blob) => {
        // Free pixel buffer immediately
        offscreen.width = 0
        offscreen.height = 0
        resolve(blob)
      },
      mimeType,
      quality,
    )
  })
}

/**
 * Batch export selected device groups as a ZIP file.
 * Calls onProgress for each item rendered.
 * Returns the number of successfully exported items.
 */
export async function batchExport(
  state: LogoState,
  items: BatchExportItem[],
  format: ExportFormat,
  onProgress: (progress: BatchProgress) => void,
): Promise<{ zip: Blob; successCount: number }> {
  // Ensure fonts are loaded
  const fontStyle = state.italic ? 'italic ' : ''
  await document.fonts.load(`${fontStyle}${state.fontWeight} 48px "${state.fontFamily}"`)
  if (state.subText.enabled) {
    await document.fonts.load(`${state.subText.fontWeight} 48px "${state.subText.fontFamily}"`)
  }

  const image = await loadImageForExport(state)

  const zip = new JSZip()
  let successCount = 0
  const ext = format === 'jpg' ? 'jpg' : format === 'svg' ? 'svg' : 'png'

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const blob = await renderItemToBlob(state, item.width, item.height, format, image)

    onProgress({
      current: i + 1,
      total: items.length,
      currentLabel: `${item.platform}/${item.sizeName}`,
    })

    if (blob) {
      const fileName = `${item.platform}/${item.sizeName}_${item.width}x${item.height}.${ext}`
      zip.file(fileName, blob)
      successCount++
    }
  }

  onProgress({
    current: items.length,
    total: items.length,
    currentLabel: 'Compressing ZIP...',
  })

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  return { zip: zipBlob, successCount }
}
