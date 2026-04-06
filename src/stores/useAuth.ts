'use client'

import { create } from 'zustand'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type Role = 'admin' | 'user' | null

const supabase = createClient()

interface AuthStore {
  user: User | null
  role: Role
  isNewUser: boolean
  loading: boolean
  initialized: boolean
  init: () => (() => void) | void
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  checkAgreement: (userId: string) => Promise<{ agreed: boolean; role: Role }>
  setIsNewUser: (v: boolean) => void
}

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  role: null,
  isNewUser: false,
  loading: true,
  initialized: false,

  init: () => {
    if (get().initialized) return
    set({ initialized: true })

    console.log('[auth] init: subscribing onAuthStateChange')
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('[auth] event:', _event, 'user:', !!session?.user)
      try {
        if (session?.user) {
          console.log('[auth] calling checkAgreement...')
          const { agreed, role } = await get().checkAgreement(session.user.id)
          console.log('[auth] checkAgreement done:', { agreed, role })
          set({ user: session.user, role, isNewUser: !agreed, loading: false })
          console.log('[auth] state set, loading: false')
        } else {
          set({ user: null, role: null, isNewUser: false, loading: false })
          console.log('[auth] no user, loading: false')
        }
      } catch (err) {
        console.error('[auth] error:', err)
        set({ user: session?.user ?? null, role: null, isNewUser: false, loading: false })
      }
    })

    return () => subscription.unsubscribe()
  },

  signInWithGoogle: async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, role: null, isNewUser: false })
  },

  checkAgreement: async (userId: string) => {
    const { data } = await supabase
      .from('user_agreements')
      .select('id, role')
      .eq('user_id', userId)
      .single()
    return {
      agreed: !!data,
      role: (data?.role as Role) ?? null,
    }
  },

  setIsNewUser: (v: boolean) => set({ isNewUser: v }),
}))

export { supabase }
