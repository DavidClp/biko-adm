"use client"

import { useMemo } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { ApiSuccess, PaginatedResponse, Provider } from "@/lib/types"

interface ProvidersFilters {
  query?: string
  services?: string[]
  cityId?: string
  minRating?: number
}

const fetchProviders = async (filters?: ProvidersFilters): Promise<Provider[]> => {
  const params = new URLSearchParams()

  if (filters?.query) params.append("q", filters.query)
  if (filters?.services) params.append("services", filters.services.join(","))
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
  selectedServices?: string[]
) {
  const filters = useMemo(() => {
    const queryFilters: ProvidersFilters = {}

    if (searchTerm?.trim()) {
      queryFilters.query = searchTerm.trim()
    }

    if (selectedCity && selectedCity !== "all") {
      queryFilters.cityId = selectedCity
    }

    if (selectedServices && selectedServices.length > 0) {
      queryFilters.services = selectedServices
    }

    return queryFilters
  }, [searchTerm, selectedCity, selectedServices])

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
