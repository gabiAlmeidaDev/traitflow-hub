import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Tenant = Database['public']['Tables']['tenants']['Row']

interface TenantState {
  currentTenant: Tenant | null
  userTenants: Tenant[]
  loading: boolean
  
  // Actions
  loadUserTenants: (userId: string) => Promise<void>
  switchTenant: (tenantId: string) => Promise<void>
  createTenant: (name: string, plan?: string) => Promise<Tenant>
  updateTenant: (id: string, updates: Partial<Tenant>) => Promise<void>
}

export const useTenantStore = create<TenantState>((set, get) => ({
  currentTenant: null,
  userTenants: [],
  loading: false,

  loadUserTenants: async (userId: string) => {
    set({ loading: true })
    
    // Get user profile to find tenant_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', userId)
      .single()
    
    if (profile?.tenant_id) {
      // Get tenant details
      const { data: tenant } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', profile.tenant_id)
        .single()
      
      if (tenant) {
        set({
          currentTenant: tenant,
          userTenants: [tenant],
          loading: false
        })
      }
    } else {
      set({ loading: false })
    }
  },

  switchTenant: async (tenantId: string) => {
    const { userTenants } = get()
    const tenant = userTenants.find(t => t.id === tenantId)
    
    if (tenant) {
      set({ currentTenant: tenant })
    }
  },

  createTenant: async (name: string, plan = 'starter') => {
    const { data, error } = await supabase
      .from('tenants')
      .insert({
        name,
        plan: plan as any
      })
      .select()
      .single()
    
    if (error) throw error
    
    set(state => ({
      userTenants: [...state.userTenants, data],
      currentTenant: data
    }))
    
    return data
  },

  updateTenant: async (id: string, updates: Partial<Tenant>) => {
    const { data, error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    set(state => ({
      userTenants: state.userTenants.map(t => t.id === id ? data : t),
      currentTenant: state.currentTenant?.id === id ? data : state.currentTenant
    }))
  }
}))
