/**
 * Sanitize SVG string by removing dangerous elements and attributes.
 */
export function sanitizeSvg(raw: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(raw, 'image/svg+xml')

  // Remove dangerous elements (keep <use> — only strip external refs)
  const dangerous = ['script', 'foreignObject', 'iframe', 'object', 'embed']
  for (const tag of dangerous) {
    doc.querySelectorAll(tag).forEach(el => el.remove())
  }

  // Strip <use> with external references only
  doc.querySelectorAll('use').forEach(el => {
    const href = el.getAttribute('href') || el.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || ''
    if (href.startsWith('http:') || href.startsWith('https:') || href.startsWith('//')) {
      el.remove()
    }
  })

  // Remove event handler attributes and dangerous URIs
  doc.querySelectorAll('*').forEach(el => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase()
      const val = attr.value.trim().toLowerCase()

      // Remove on* event handlers
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name)
        continue
      }

      // Remove dangerous URI schemes in any attribute
      if (val.startsWith('javascript:') || val.startsWith('data:text/html')) {
        el.removeAttribute(attr.name)
      }
    }

    // Double-check href/xlink:href
    for (const hrefAttr of [
      el.getAttribute('href'),
      el.getAttributeNS('http://www.w3.org/1999/xlink', 'href'),
    ]) {
      if (!hrefAttr) continue
      const v = hrefAttr.trim().toLowerCase()
      if (v.startsWith('javascript:') || v.startsWith('data:text/html')) {
        el.removeAttribute('href')
        el.removeAttributeNS('http://www.w3.org/1999/xlink', 'href')
      }
    }
  })

  return new XMLSerializer().serializeToString(doc.documentElement)
}
