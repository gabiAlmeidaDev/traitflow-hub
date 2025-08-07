import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth'
import { useTenantStore } from '@/stores/tenant'

export function useAuth() {
  const { 
    user, 
    profile, 
    loading, 
    initialize, 
    signIn, 
    signUp, 
    signOut, 
    resetPassword 
  } = useAuthStore()
  
  const { loadUserTenants } = useTenantStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (user && !loading) {
      loadUserTenants(user.id)
    }
  }, [user, loading, loadUserTenants])

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user
  }
}
