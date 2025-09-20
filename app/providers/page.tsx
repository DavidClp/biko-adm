"use client"

import { useCallback, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Search, Star, ArrowRight, Lock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, useSearchParams } from "next/navigation"
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
  const searchParams = useSearchParams()

  useEffect(() => {
    const serviceParam = searchParams.get('service')
    if (serviceParam) {
      setSelectedServices([serviceParam])
    }
  }, [searchParams])

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
  }, [user, router])

  const handleClearFilters = useCallback(() => {
    setSearchTerm("")
    setSelectedCity("all")
    setSelectedServices([])
    refetch()
    
    const url = new URL(window.location.href)
    url.searchParams.delete('service')
    router.replace(url.pathname + url.search)
  }, [refetch, router])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Encontre prestadores de serviços</h1>

          {/* Banner de aviso para prestadores sem assinatura */}
          {user?.provider?.id && user.provider.subscription_situation !== 'active' && user.provider.subscription_situation !== 'paid' && (
            <div className="mb-6">
              <Alert className="bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30">
                <AlertDescription className="flex items-center gap-5 md:gap-1 justify-between flex-col md:flex-row">
                  <div className="flex-1 ">
                    <p className="font-semibold text-secondary mb-1">
            {/*     <Star className="h-5 w-5" color="#db9d01"/> */}
                      🚀 Seu perfil não está aparecendo nas buscas!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Para aparecer nesta lista e receber mais clientes, você precisa de uma assinatura ativa. 
                      <span className="font-medium text-secondary ml-1">Assine agora e aumente sua visibilidade!</span>
                    </p>
                  </div>
                  <Button 
                    onClick={() => router.push('/dashboard?tab=subscriptions')}
                    className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="sm"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Ver Planos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          )}

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
            {/* {error && (
              <span className="text-destructive ml-2">
                (Erro ao carregar dados, mostrando dados de exemplo)
              </span>
            )} */}
          </div>
        </div>
        <ProvidersList
          providers={providers}
          loading={loading}
          onRequestContact={handleRequestContact}
          onClearFilters={handleClearFilters}
        />

      </div>
      <Footer />
    </div>
  )
}
