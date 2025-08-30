"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useProviders } from "@/hooks/use-providers"
import { Search, MapPin, Star, MessageCircle } from "lucide-react"

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedService, setSelectedService] = useState("all")

  const { providers, loading, error, fetchProviders } = useProviders({
    autoFetch: false,
  })

  // Mock data for demonstration
  const mockProviders = [
    {
      id: "1",
      name: "João Silva",
      service: "Eletricista",
      city: "São Paulo",
      description: "Eletricista com 10 anos de experiência em instalações residenciais e comerciais.",
      phone: "(11) 99999-9999",
      photo: "/professional-electrician.png",
      rating: 4.8,
      reviewCount: 24,
      approved: true,
    },
    {
      id: "2",
      name: "Maria Santos",
      service: "Designer",
      city: "Rio de Janeiro",
      description: "Designer gráfica especializada em identidade visual e marketing digital.",
      phone: "(21) 88888-8888",
      photo: "/professional-designer-woman.png",
      rating: 4.9,
      reviewCount: 31,
      approved: true,
    },
    {
      id: "3",
      name: "Carlos Oliveira",
      service: "Fotógrafo",
      city: "Belo Horizonte",
      description: "Fotógrafo profissional especializado em eventos e retratos corporativos.",
      phone: "(31) 77777-7777",
      photo: "/professional-photographer.png",
      rating: 4.7,
      reviewCount: 18,
      approved: true,
    },
  ]

  const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasília", "Salvador"]
  const services = ["Eletricista", "Designer", "Fotógrafo", "Encanador", "Pintor", "Marceneiro"]

  const filteredProviders = mockProviders.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCity = selectedCity === "all" || provider.city === selectedCity
    const matchesService = selectedService === "all" || provider.service === selectedService

    return matchesSearch && matchesCity && matchesService
  })

  const handleWhatsAppContact = (phone: string, providerName: string) => {
    const message = encodeURIComponent(
      `Olá ${providerName}, encontrei seu perfil no ServiceConnect e gostaria de saber mais sobre seus serviços.`,
    )
    window.open(`https://wa.me/55${phone.replace(/\D/g, "")}?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Search and Filters */}
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
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as cidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os serviços" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os serviços</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">{filteredProviders.length} prestador(es) encontrado(s)</div>
        </div>

        {/* Providers Grid */}
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={provider.photo || "/placeholder.svg"} alt={provider.name} />
                      <AvatarFallback>
                        {provider.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      <Badge variant="secondary" className="mb-2">
                        {provider.service}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {provider.city}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="mb-4 line-clamp-2">{provider.description}</CardDescription>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{provider.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({provider.reviewCount} avaliações)</span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/providers/${provider.id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        Ver Perfil
                      </Button>
                    </Link>
                    <Button onClick={() => handleWhatsAppContact(provider.phone, provider.name)} className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProviders.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">Nenhum prestador encontrado com os filtros selecionados.</div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCity("all")
                setSelectedService("all")
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
