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
    services: string[]
    location: string
    description: string
    experience: string
    portfolio?: string
    website?: string
    instagram?: string
    facebook?: string
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          // Simulate API call to verify token and get user data
          const userData = await api.get<User>("/auth/me")
          setUser(userData)
        }
      } catch (error) {
        localStorage.removeItem("token")
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
      localStorage.setItem("token", response.token)
      setUser(response.user)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
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
    services: string[]
    location: string
    description: string
    experience: string
    portfolio?: string
    website?: string
    instagram?: string
    facebook?: string
  }) => {
    setLoading(true)
    try {
      const response = await api.post<RegisterResponse>("/auth/register/provider", data)
      localStorage.setItem("token", response.token)
      setUser(response.user)
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
