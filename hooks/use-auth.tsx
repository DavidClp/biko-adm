"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api, setClearAuthCallback } from "@/lib/api"
import { User, LoginResponse, RegisterResponse, ApiResponse } from "@/lib/types"
import { socket } from "@/lib/socket"

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
    services: string[]
    business_name: string
    city: string
    description: string
    recommendationCode?: string
  }) => Promise<void>
  deleteAccount: () => Promise<void>
  setUser: (user: User | null) => void
  refreshUser: () => Promise<void>
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

    // Registrar callback para ser chamado quando token expira
    setClearAuthCallback(() => {
      setUser(null)
      setLoading(false)
    })
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
    services: string[]
    description: string
    business_name: string
    city: string
    recommendationCode?: string
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

  const deleteAccount = async () => {
    setLoading(true)
    try {
      await api.delete(`/providers/${user?.provider?.id}`)

      logout()

      if (typeof window !== "undefined") {
        window.location.href = "/"
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    if (!user?.id) return

    try {
      const { data } = await api.get<User>(`/users/${user.id}`)
      if (data) {
        setUser(data)
        localStorage.setItem("userData", JSON.stringify(data))
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error)
    }
  }

  useEffect(() => {
    if (!user?.id) return

    const providerId = user?.provider?.id
    const clientId = user?.client?.id

    console.log("🔌 Conectando WebSocket para usuário:", user.id)
    socket.auth = { userId: user.id }
    socket.connect()

    const onConnect = () => {
      console.log("✅ WebSocket conectado")
      socket.emit("user:online")
      if (providerId) {
        console.log("📡 Inscrevendo provider em notificações:", providerId)
        socket.emit("request:subscribe-provider", { providerId })
      }
      if (clientId) {
        console.log("📡 Inscrevendo cliente em notificações:", clientId)
        socket.emit("request:subscribe-client", { clientId })
      }
    }

    const onDisconnect = () => {
      console.log("❌ WebSocket desconectado")
    }

    const onConnectError = (error: Error) => {
      console.error("❌ Erro de conexão WebSocket:", error)
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("connect_error", onConnectError)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("connect_error", onConnectError)
      if (socket.connected) {
        console.log("🔌 Desconectando WebSocket")
        socket.emit("user:offline")
        if (providerId) {
          socket.emit("request:unsubscribe-provider", { providerId })
        }
        socket.disconnect()
      }
    }
  }, [user?.id, user?.provider?.id, user?.client?.id])

  const value = {
    user,
    loading,
    login,
    logout,
    logoutAndRedirect,
    registerClient,
    registerProvider,
    deleteAccount,
    routerBeforeLogin,
    setUser,
    refreshUser,
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
