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

    ;(async () => {
      try {
        console.log('[auth] init: calling getUser...')
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()
        console.log('[auth] init: getUser result', { user: !!user, error })
        if (user) {
          const { agreed, role } = await get().checkAgreement(user.id)
          console.log('[auth] init: checkAgreement done', { agreed, role })
          set({
            user,
            role,
            isNewUser: !agreed,
            loading: false,
          })
        } else {
          set({ loading: false })
        }
      } catch (err) {
        console.error('[auth] init: caught error', err)
        set({ loading: false })
      }
    })()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('[auth] onAuthStateChange:', _event, { user: !!session?.user })
      if (session?.user) {
        const { agreed, role } = await get().checkAgreement(session.user.id)
        set({ user: session.user, role, isNewUser: !agreed, loading: false })
      } else {
        set({ user: null, role: null, isNewUser: false, loading: false })
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
