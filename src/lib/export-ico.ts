/**
 * ICO file generator — creates multi-size .ico from Canvas.
 *
 * ICO format:
 *   ICONDIR header (6 bytes)
 *   ICONDIRENTRY × N (16 bytes each)
 *   Image data (PNG chunks for each size)
 *
 * All sizes use PNG encoding (supported by all modern OS/browsers,
 * simpler than BMP, and produces smaller files).
 */

const ICO_SIZES = [16, 32, 48, 256] as const

/**
 * Render the logo at a specific size onto an offscreen canvas and return PNG data.
 */
function renderAtSize(
  sourceCanvas: HTMLCanvasElement,
  size: number,
): Promise<ArrayBuffer | null> {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.resolve(null)

  ctx.drawImage(sourceCanvas, 0, 0, size, size)

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        canvas.width = 0
        canvas.height = 0
        if (!blob) {
          resolve(null)
          return
        }
        blob.arrayBuffer().then(
          (buf) => resolve(buf),
          () => resolve(null),
        )
      },
      'image/png',
    )
  })
}

/**
 * Build ICO binary from a rendered source canvas.
 * The source canvas should contain the logo at the largest needed size.
 */
export async function generateIco(
  sourceCanvas: HTMLCanvasElement,
): Promise<Blob> {
  // Render all sizes as PNG
  const pngBuffers: ArrayBuffer[] = []
  for (const size of ICO_SIZES) {
    const buf = await renderAtSize(sourceCanvas, size)
    if (!buf) throw new Error(`Failed to render ICO at ${size}x${size}`)
    pngBuffers.push(buf)
  }

  // Calculate total file size
  const headerSize = 6
  const entrySize = 16
  const dirSize = headerSize + entrySize * ICO_SIZES.length
  const totalDataSize = pngBuffers.reduce((sum, buf) => sum + buf.byteLength, 0)
  const totalSize = dirSize + totalDataSize

  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)

  // ICONDIR header
  view.setUint16(0, 0, true)       // reserved, must be 0
  view.setUint16(2, 1, true)       // type: 1 = ICO
  view.setUint16(4, ICO_SIZES.length, true) // number of images

  // ICONDIRENTRY for each size + image data
  let dataOffset = dirSize
  for (let i = 0; i < ICO_SIZES.length; i++) {
    const size = ICO_SIZES[i]
    const pngData = pngBuffers[i]
    const entryOffset = headerSize + i * entrySize

    // Width/height: 0 means 256
    view.setUint8(entryOffset + 0, size >= 256 ? 0 : size)  // width
    view.setUint8(entryOffset + 1, size >= 256 ? 0 : size)  // height
    view.setUint8(entryOffset + 2, 0)   // color palette count
    view.setUint8(entryOffset + 3, 0)   // reserved
    view.setUint16(entryOffset + 4, 1, true)  // color planes
    view.setUint16(entryOffset + 6, 32, true) // bits per pixel
    view.setUint32(entryOffset + 8, pngData.byteLength, true)  // image data size
    view.setUint32(entryOffset + 12, dataOffset, true)         // offset to image data

    // Copy PNG data
    new Uint8Array(buffer, dataOffset, pngData.byteLength).set(
      new Uint8Array(pngData),
    )
    dataOffset += pngData.byteLength
  }

  return new Blob([buffer], { type: 'image/x-icon' })
}
