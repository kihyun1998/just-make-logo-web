'use client'

import { useEffect } from 'react'
import { useLogoStore } from '@/store/logo-store'

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      const isCtrl = e.ctrlKey || e.metaKey

      // Ctrl+Z = Undo
      if (isCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        useLogoStore.temporal.getState().undo()
      }

      // Ctrl+Shift+Z = Redo
      if (isCtrl && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        useLogoStore.temporal.getState().redo()
      }

      // Ctrl+Y = Redo (alternative)
      if (isCtrl && e.key === 'y') {
        e.preventDefault()
        useLogoStore.temporal.getState().redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
