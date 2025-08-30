"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/lib/api"
import { User, LoginResponse, RegisterResponse, ApiResponse } from "@/lib/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
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
      const response = await api.post<LoginResponse>("/auth/login", { email, password })

      if (response?.token !== undefined) {
        localStorage.setItem("token", response.token)

        if (response && typeof response === 'object') {
          delete (response as any).token
        }

        if (response.user) {
          localStorage.setItem("userData", JSON.stringify(response.user))
        }

        setUser(response.user || null)
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
    setUser(null)
  }

  const registerClient = async (data: {
    name: string
    email: string
    password: string
    phone: string
  }) => {
    setLoading(true)
    try {
      const response = await api.post<RegisterResponse>("/clients", data)

      localStorage.setItem("token", response.token)

      if (response.user) {
        localStorage.setItem("userData", JSON.stringify(response.user))
      }

      setUser(response.user)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const registerProvider = async (data: {
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
      const response = await api.post<ApiResponse<RegisterResponse>>("/providers", data)

      if (response?.data?.token !== undefined) {
        localStorage.setItem("token", response.data.token)

        if (response.data && typeof response.data === 'object') {
          delete (response.data as any).token
        }

        // Salvar dados do usuário no localStorage
        if (response.data.user) {
          localStorage.setItem("userData", JSON.stringify(response.data.user))
        }

        setUser(response.data.user || null)
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
    registerClient,
    registerProvider,
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
