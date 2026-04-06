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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // DB 쿼리를 콜백 밖에서 실행 (콜백 안에서 하면 세션 처리 중 deadlock)
        setTimeout(async () => {
          try {
            const { agreed, role } = await get().checkAgreement(session.user.id)
            set({ user: session.user, role, isNewUser: !agreed, loading: false })
          } catch {
            set({ user: session.user, role: null, isNewUser: false, loading: false })
          }
        }, 0)
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
