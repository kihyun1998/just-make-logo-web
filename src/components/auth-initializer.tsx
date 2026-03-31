'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

export function AuthInitializer() {
  const init = useAuth((s) => s.init)

  useEffect(() => {
    const cleanup = init()
    return () => {
      if (typeof cleanup === 'function') cleanup()
    }
  }, [init])

  return null
}
