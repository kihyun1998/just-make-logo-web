'use client'

import { useRef, useCallback, useState } from 'react'

interface ResizableDividerProps {
  direction: 'horizontal' | 'vertical'
  onResize: (fraction: number) => void
  min: number
  max: number
}

export function ResizableDivider({ direction, onResize, min, max }: ResizableDividerProps) {
  const dragging = useRef(false)
  const dividerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [hovered, setHovered] = useState(false)

  const getContainerRect = useCallback(() => {
    const el = dividerRef.current?.parentElement
    return el?.getBoundingClientRect() ?? null
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true
    setActive(true)
    dividerRef.current?.setPointerCapture(e.pointerId)
    e.preventDefault()
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const rect = getContainerRect()
    if (!rect) return

    let fraction: number
    if (direction === 'vertical') {
      fraction = (e.clientY - rect.top) / rect.height
    } else {
      fraction = (e.clientX - rect.left) / rect.width
    }

    fraction = Math.min(max, Math.max(min, fraction))
    onResize(fraction)
  }, [direction, min, max, onResize, getContainerRect])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false
    setActive(false)
    dividerRef.current?.releasePointerCapture(e.pointerId)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = 0.02
    const isVertical = direction === 'vertical'
    const rect = getContainerRect()
    if (!rect) return

    const size = isVertical ? rect.height : rect.width
    const current = isVertical
      ? (dividerRef.current?.getBoundingClientRect().top ?? 0) - rect.top
      : (dividerRef.current?.getBoundingClientRect().left ?? 0) - rect.left
    const fraction = current / size

    let next = fraction
    if ((isVertical && e.key === 'ArrowUp') || (!isVertical && e.key === 'ArrowLeft')) {
      next = Math.max(min, fraction - step)
    } else if ((isVertical && e.key === 'ArrowDown') || (!isVertical && e.key === 'ArrowRight')) {
      next = Math.min(max, fraction + step)
    } else {
      return
    }
    e.preventDefault()
    onResize(next)
  }, [direction, min, max, onResize, getContainerRect])

  const isVertical = direction === 'vertical'

  return (
    <div
      ref={dividerRef}
      role="separator"
      aria-orientation={isVertical ? 'horizontal' : 'vertical'}
      aria-label="Resize panel"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onKeyDown={handleKeyDown}
      className={`relative z-10 flex shrink-0 items-center justify-center touch-none select-none ${
        isVertical
          ? 'h-3 w-full cursor-row-resize'
          : 'h-full w-3 cursor-col-resize'
      }`}
    >
      <div
        className={`rounded-full transition-colors ${
          isVertical ? 'h-1 w-12' : 'h-12 w-1'
        } ${
          active
            ? 'bg-primary'
            : hovered
              ? 'bg-muted-foreground/50'
              : 'bg-border'
        }`}
      />
    </div>
  )
}
