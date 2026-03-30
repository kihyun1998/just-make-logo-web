'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { User, SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

type Role = 'admin' | 'user' | null

interface AuthContextType {
  user: User | null
  role: Role
  isNewUser: boolean
  loading: boolean
  supabase: SupabaseClient
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  setIsNewUser: (v: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function checkAgreement(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ agreed: boolean; role: Role }> {
  const { data } = await supabase
    .from('user_agreements')
    .select('id, role')
    .eq('user_id', userId)
    .single()
  return {
    agreed: !!data,
    role: (data?.role as Role) ?? null,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role>(null)
  const [isNewUser, setIsNewUser] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const result = await checkAgreement(supabase, session.user.id)
          setUser(session.user)
          setRole(result.role)
          setIsNewUser(!result.agreed)
        }
      } finally {
        setLoading(false)
      }
    })()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        if (event === 'SIGNED_IN') {
          const result = await checkAgreement(supabase, session.user.id)
          setRole(result.role)
          setIsNewUser(!result.agreed)
        }
      } else {
        setUser(null)
        setRole(null)
        setIsNewUser(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    setIsNewUser(false)
  }, [supabase])

  const value = useMemo(
    () => ({ user, role, isNewUser, loading, supabase, signInWithGoogle, signOut, setIsNewUser }),
    [user, role, isNewUser, loading, supabase, signInWithGoogle, signOut, setIsNewUser],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
