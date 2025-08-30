"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"

export interface Provider {
  id: string
  name: string
  email: string
  phone: string
  services: string[]
  location: string
  description: string
  experience: string
  rating: number
  reviewCount: number
  avatar?: string
  portfolio?: string
  website?: string
  instagram?: string
  facebook?: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

interface UseProvidersReturn {
  providers: Provider[]
  loading: boolean
  error: string | null
  searchProviders: (
    query: string,
    filters?: {
      services?: string[]
      location?: string
      minRating?: number
    },
  ) => void
  getProvider: (id: string) => Provider | undefined
  refreshProviders: () => void
}

export function useProviders(): UseProvidersReturn {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProviders = async (query?: string, filters?: any) => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const params = new URLSearchParams()
      if (query) params.append("q", query)
      if (filters?.services?.length) params.append("services", filters.services.join(","))
      if (filters?.location) params.append("location", filters.location)
      if (filters?.minRating) params.append("minRating", filters.minRating.toString())

      const queryString = params.toString()
      const endpoint = `/providers${queryString ? `?${queryString}` : ""}`

      const data = await api.get<Provider[]>(endpoint)
      setProviders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch providers")
      // Fallback to mock data for development
      setProviders(getMockProviders())
    } finally {
      setLoading(false)
    }
  }

  const searchProviders = (
    query: string,
    filters?: {
      services?: string[]
      location?: string
      minRating?: number
    },
  ) => {
    fetchProviders(query, filters)
  }

  const getProvider = (id: string) => {
    return providers.find((provider) => provider.id === id)
  }

  const refreshProviders = () => {
    fetchProviders()
  }

  useEffect(() => {
    fetchProviders()
  }, [])

  return {
    providers,
    loading,
    error,
    searchProviders,
    getProvider,
    refreshProviders,
  }
}

// Mock data for development
function getMockProviders(): Provider[] {
  return [
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      phone: "(11) 99999-9999",
      services: ["Elétrica", "Instalação"],
      location: "São Paulo, SP",
      description: "Eletricista com 10 anos de experiência em instalações residenciais e comerciais.",
      experience: "10 anos",
      rating: 4.8,
      reviewCount: 127,
      avatar: "/professional-electrician.png",
      status: "approved",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "(11) 88888-8888",
      services: ["Design", "Consultoria"],
      location: "Rio de Janeiro, RJ",
      description: "Designer de interiores especializada em projetos residenciais modernos.",
      experience: "8 anos",
      rating: 4.9,
      reviewCount: 89,
      avatar: "/professional-designer-woman.png",
      status: "approved",
      createdAt: "2024-01-20T14:30:00Z",
    },
    {
      id: "3",
      name: "Carlos Oliveira",
      email: "carlos@email.com",
      phone: "(11) 77777-7777",
      services: ["Fotografia", "Eventos"],
      location: "Belo Horizonte, MG",
      description: "Fotógrafo profissional especializado em eventos corporativos e sociais.",
      experience: "12 anos",
      rating: 4.7,
      reviewCount: 203,
      avatar: "/professional-photographer.png",
      status: "approved",
      createdAt: "2024-01-25T09:15:00Z",
    },
  ]
}
