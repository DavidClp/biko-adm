"use client"

import { useMemo } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { ApiSuccess, PaginatedResponse, Provider } from "@/lib/types"

interface ProvidersFilters {
  query?: string
  service?: string
  cityId?: string
  minRating?: number
}

const fetchProviders = async (filters?: ProvidersFilters): Promise<Provider[]> => {
  const params = new URLSearchParams()

  if (filters?.query) params.append("q", filters.query)
  if (filters?.service) params.append("service", filters.service)
  if (filters?.cityId) params.append("cityId", filters.cityId)
  if (filters?.minRating) params.append("minRating", filters.minRating.toString())

  const queryString = params.toString()
  const endpoint = `/providers${queryString ? `?${queryString}` : ""}`

  const { data } = await api.get<Provider[]>(endpoint)

  return data;
}

export function useProviders(filters?: ProvidersFilters) {
  return useQuery({
    async queryFn() {
      const data = await fetchProviders(filters)
      return data
    },
    queryKey: ["providers", JSON.stringify(filters)],
    //staleTime: 5 * 60 * 1000, // 5 minutos
    //gcTime: 10 * 60 * 1000, // 10 minutos
  })
}

// Hook simplificado que aceita parâmetros individuais
export function useProvidersWithFilters(
  searchTerm?: string,
  selectedCity?: string,
  selectedService?: string
) {
  const filters = useMemo(() => {
    const queryFilters: ProvidersFilters = {}

    if (searchTerm?.trim()) {
      queryFilters.query = searchTerm.trim()
    }

    if (selectedCity && selectedCity !== "all") {
      queryFilters.cityId = selectedCity
    }

    if (selectedService && selectedService !== "all") {
      queryFilters.service = selectedService
    }

    return queryFilters
  }, [searchTerm, selectedCity, selectedService])

  return useProviders(filters) // sem async/await
}

// Hook para buscar um provider específico
export function useProvider(id: string) {
  return useQuery({
    queryKey: ["provider", id],
    queryFn: async () => {
      try {
        const data = await api.get<Provider>(`/providers/${id}`)
        return data
      } catch (error) {
        // Em caso de erro, busca nos providers já carregados
        const queryClient = useQueryClient()
        const providers = queryClient.getQueryData<Provider[]>(["providers"])
        return providers?.find(p => p.id === id)
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook para invalidar cache dos providers
export function useInvalidateProviders() {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ["providers"] }),
    invalidateProvider: (id: string) => queryClient.invalidateQueries({ queryKey: ["provider", id] }),
  }
}

// Mock data para desenvolvimento
/* function getMockProviders(): Provider[] {
  return [
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      phone: "(11) 99999-9999",
      service: "Elétrica",
      cityName: "São Paulo, SP",
      description: "Eletricista com 10 anos de experiência em instalações residenciais e comerciais.",
      experience: "10 anos",
      rating: 4.8,
      reviews: 127,
      avatar: "/professional-electrician.png",
      status: "approved",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "(11) 88888-8888",
      service: "Design",
      cityName: "Rio de Janeiro, RJ",
      description: "Designer de interiores especializada em projetos residenciais modernos.",
      experience: "8 anos",
      rating: 4.9,
      reviews: 89,
      avatar: "/professional-designer-woman.png",
      status: "approved",
      createdAt: "2024-01-20T14:30:00Z",
    },
    {
      id: "3",
      name: "Carlos Oliveira",
      email: "carlos@email.com",
      phone: "(11) 77777-7777",
      service: "Fotografia",
      cityName: "Belo Horizonte, MG",
      description: "Fotógrafo profissional especializado em eventos corporativos e sociais.",
      experience: "12 anos",
      rating: 4.7,
      reviewCount: 203,
      avatar: "/professional-photographer.png",
      status: "approved",
      createdAt: "2024-01-25T09:15:00Z",
    },
  ]
} */
