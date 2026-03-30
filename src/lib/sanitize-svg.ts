/**
 * Sanitize SVG string by removing dangerous elements and attributes.
 * Strips <script>, <foreignObject>, event handlers (on*), etc.
 */
export function sanitizeSvg(raw: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(raw, 'image/svg+xml')

  // Remove dangerous elements
  const dangerous = ['script', 'foreignObject', 'iframe', 'object', 'embed', 'use']
  for (const tag of dangerous) {
    const els = doc.querySelectorAll(tag)
    els.forEach(el => el.remove())
  }

  // Remove event handler attributes (on*)
  const all = doc.querySelectorAll('*')
  all.forEach(el => {
    const attrs = Array.from(el.attributes)
    for (const attr of attrs) {
      if (attr.name.startsWith('on') || attr.value.startsWith('javascript:')) {
        el.removeAttribute(attr.name)
      }
    }
    // Remove href with javascript:
    const href = el.getAttribute('href') || el.getAttributeNS('http://www.w3.org/1999/xlink', 'href')
    if (href?.startsWith('javascript:')) {
      el.removeAttribute('href')
      el.removeAttributeNS('http://www.w3.org/1999/xlink', 'href')
    }
  })

  const serializer = new XMLSerializer()
  const svgEl = doc.documentElement
  return serializer.serializeToString(svgEl)
}
