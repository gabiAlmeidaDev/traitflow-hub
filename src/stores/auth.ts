import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  
  // Initialize
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    // Fetch user profile
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      set({ 
        user: data.user,
        session: data.session,
        profile: profile || null
      })
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })
    
    if (error) throw error
    
    set({
      user: data.user,
      session: data.session
    })
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    set({
      user: null,
      session: null,
      profile: null
    })
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { user } = get()
    if (!user) throw new Error('No user logged in')
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    
    if (error) throw error
    
    set({ profile: data })
  },

  initialize: async () => {
    set({ loading: true })
    
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      set({
        user: session.user,
        session,
        profile: profile || null,
        loading: false
      })
    } else {
      set({ loading: false })
    }
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        set({
          user: session.user,
          session,
          profile: profile || null
        })
      } else if (event === 'SIGNED_OUT') {
        set({
          user: null,
          session: null,
          profile: null
        })
      }
    })
  }
}))
