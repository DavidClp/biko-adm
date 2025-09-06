"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Search } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { CitiesSelector } from "@/components/cities-selector"
import { ProvidersList } from "@/app/providers/components/providers-list"
import { useProvidersWithFilters } from "@/hooks/use-providers"
import { ServicesMultiSelect } from "@/components/services-multi-select"

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const { user } = useAuth();
  const router = useRouter()

  const { data: providers = [], isLoading: loading, error, refetch } = useProvidersWithFilters(
    searchTerm,
    selectedCity,
    selectedServices
  )

  const handleRequestContact = useCallback((providerId: string) => {
    if (!user) {
      router.push("/login")
      return
    }

    router.push(`/providers/${providerId}?isContactModalOpen=true`)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Encontre prestadores de serviços</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-border/80 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 pl-10 min-h-[40px]"
                />
              </div>
            </div>

            <CitiesSelector
              onCitySelect={setSelectedCity}
              defaultCityId={selectedCity}
              classNameInput={"min-h-[40px]"}
            />

            <ServicesMultiSelect
              selectedServices={selectedServices}
              onServicesChange={setSelectedServices}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            {providers?.length} prestador(es) encontrado(s)
            {error && (
              <span className="text-destructive ml-2">
                (Erro ao carregar dados, mostrando dados de exemplo)
              </span>
            )}
          </div>
        </div>

        <ProvidersList
          providers={providers}
          loading={loading}
          onRequestContact={handleRequestContact}
          onClearFilters={() => {
            setSearchTerm("")
            setSelectedCity("all")
            setSelectedServices([])
            refetch()
          }}
        />

      </div>
      <Footer />
    </div>
  )
}
