/** Extract display text lines from logo state */
export function getTextLines(state: { text1: string; text2: string; text3: string; textLines: 1 | 2 | 3 }): string[] {
  const lines: string[] = []
  if (state.text1 || state.textLines >= 1) lines.push(state.text1 || 'LOGO')
  if (state.textLines >= 2) lines.push(state.text2 || '')
  if (state.textLines >= 3) lines.push(state.text3 || '')
  return lines.filter(l => l.length > 0)
}
