"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "./use-auth"
import { useEffect } from "react"

/**
 * Hook para gerenciar redirecionamentos baseados em autenticação
 * 
 * @param redirectTo - Rota para redirecionar se não autenticado (padrão: "/login")
 * @param requireAuth - Se deve redirecionar quando não autenticado (padrão: true)
 * @param requireRole - Role específica necessária (opcional)
 */
export function useAuthRedirect(
  redirectTo: string = "/login",
  requireAuth: boolean = true,
  requireRole?: string
) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Não fazer nada se ainda está carregando
    if (loading) return

    // Se não requer autenticação, não fazer nada
    if (!requireAuth) return

    // Se não está autenticado, redirecionar
    if (!user) {
      router.push(redirectTo)
      return
    }

    // Se requer role específica e usuário não tem essa role
    if (requireRole && user.role !== requireRole) {
      router.push("/")
      return
    }
  }, [user, loading, requireAuth, requireRole, redirectTo, router])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    hasRequiredRole: requireRole ? user?.role === requireRole : true,
  }
}

/**
 * Hook para proteger rotas que requerem autenticação
 * Redireciona automaticamente para login se não autenticado
 */
export function useRequireAuth(redirectTo: string = "/login") {
  return useAuthRedirect(redirectTo, true)
}

/**
 * Hook para proteger rotas que requerem role específica
 * Redireciona automaticamente se não tiver a role necessária
 */
export function useRequireRole(role: string, redirectTo: string = "/") {
  return useAuthRedirect(redirectTo, true, role)
}

/**
 * Hook para redirecionar usuários autenticados
 * Útil para páginas de login/registro
 */
export function useRedirectIfAuthenticated(redirectTo: string = "/dashboard") {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo)
    }
  }, [user, loading, redirectTo, router])

  return { user, loading, isAuthenticated: !!user }
}
