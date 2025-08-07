import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'super_admin' | 'admin_empresa' | 'gestor_rh' | 'gestor_area' | 'funcionario'
          tenant_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'super_admin' | 'admin_empresa' | 'gestor_rh' | 'gestor_area' | 'funcionario'
          tenant_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'super_admin' | 'admin_empresa' | 'gestor_rh' | 'gestor_area' | 'funcionario'
          tenant_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tenants: {
        Row: {
          id: string
          name: string
          domain: string | null
          plan: 'starter' | 'professional' | 'enterprise' | 'enterprise_plus'
          settings: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          plan?: 'starter' | 'professional' | 'enterprise' | 'enterprise_plus'
          settings?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          plan?: 'starter' | 'professional' | 'enterprise' | 'enterprise_plus'
          settings?: any | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
