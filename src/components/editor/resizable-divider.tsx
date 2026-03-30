'use client'

import { useRef, useCallback, useState } from 'react'

interface ResizableDividerProps {
  direction: 'horizontal' | 'vertical'
  onResize: (fraction: number) => void
  min: number // 0~1
  max: number // 0~1
}

export function ResizableDivider({ direction, onResize, min, max }: ResizableDividerProps) {
  const dragging = useRef(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true
    setActive(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    e.preventDefault()
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const parent = (e.target as HTMLElement).parentElement
    if (!parent) return

    let fraction: number
    if (direction === 'vertical') {
      fraction = e.clientY / parent.getBoundingClientRect().height
    } else {
      fraction = e.clientX / parent.getBoundingClientRect().width
    }

    fraction = Math.min(max, Math.max(min, fraction))
    onResize(fraction)
  }, [direction, min, max, onResize])

  const handlePointerUp = useCallback(() => {
    dragging.current = false
    setActive(false)
  }, [])

  const isVertical = direction === 'vertical'

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => { setHovered(false); if (!dragging.current) setActive(false) }}
      className={`relative z-10 flex items-center justify-center touch-none select-none ${
        isVertical
          ? 'h-2 w-full cursor-row-resize'
          : 'h-full w-2 cursor-col-resize'
      }`}
    >
      {/* Visual bar */}
      <div
        className={`rounded-full transition-all ${
          isVertical ? 'h-1 w-10' : 'h-10 w-1'
        } ${
          active
            ? 'bg-primary scale-110'
            : hovered
              ? 'bg-muted-foreground/50'
              : 'bg-border'
        }`}
      />
    </div>
  )
}
