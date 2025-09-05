"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/lib/api"
import { User, LoginResponse, RegisterResponse, ApiResponse } from "@/lib/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  logoutAndRedirect: () => void
  registerClient: (data: {
    name: string
    email: string
    password: string
    phone: string
  }) => Promise<void>
  registerProvider: (data: {
    name: string
    email: string
    password: string
    phone: string
    service: string
    city: string
    description: string
  }) => Promise<void>
  routerBeforeLogin: string | null
  setRouterBeforeLogin: (router: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true);
  const [routerBeforeLogin, setRouterBeforeLogin] = useState<string | null>(null)

  const setRouterBeforeLoginWithPersistence = (router: string) => {
    setRouterBeforeLogin(router)
    localStorage.setItem("routerBeforeLogin", router)
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        /* const savedRouter = localStorage.getItem("routerBeforeLogin")
        if (savedRouter) {
          setRouterBeforeLogin(savedRouter)
        }
 */
        const token = localStorage.getItem("token")
       
        if (token) {
          const userData = localStorage.getItem("userData")
          if (userData) {
            try {
              const parsedUser = JSON.parse(userData)
              setUser(parsedUser)
            } catch (e) {
              console.error("Erro ao parsear dados do usuário:", e)
              localStorage.removeItem("userData")
              localStorage.removeItem("token")
            }
          } else {
            localStorage.removeItem("token")
          }
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("userData")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data } = await api.post<LoginResponse>("/auth/login", { email, password })

      if (data?.token !== undefined) {
        localStorage.setItem("token", data.token)

        if (data && typeof data === 'object') {
          delete (data as any).token
        }

        if (data.user) {
          localStorage.setItem("userData", JSON.stringify(data.user))
        }

        setUser(data.user || null)
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    localStorage.removeItem("routerBeforeLogin")
    setUser(null)
  }

  const logoutAndRedirect = () => {
    logout()
    // Redirecionar para a home
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }

  const registerClient = async (params: {
    name: string
    email: string
    password: string
    phone: string
  }) => {
    setLoading(true)
    try {
      const { data } = await api.post<RegisterResponse>("/clients", params)

      localStorage.setItem("token", data.token)

      if (data.user) {
        localStorage.setItem("userData", JSON.stringify(data.user))
      }

      setUser(data.user)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const registerProvider = async (params: {
    name: string
    email: string
    password: string
    phone: string
    service: string
    description: string
    city: string
  }) => {
    setLoading(true)

    try {
      const { data } = await api.post<RegisterResponse>("/providers", params)

      if (data?.token !== undefined) {
        localStorage.setItem("token", data.token)

        if (data && typeof data === 'object') {
          delete (data as any).token
        }

        // Salvar dados do usuário no localStorage
        if (data.user) {
          localStorage.setItem("userData", JSON.stringify(data.user))
        }

        setUser(data.user || null)
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    logoutAndRedirect,
    registerClient,
    registerProvider,
    routerBeforeLogin,
    setRouterBeforeLogin: setRouterBeforeLoginWithPersistence,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
