"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { MapPin, Star, MessageCircle } from "lucide-react"
import { Provider, UserRole } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"

interface ProvidersListProps {
  providers: Provider[]
  loading: boolean
  onRequestContact: (providerId: string) => void
  onClearFilters?: () => void
}

export function ProvidersList({ providers, loading, onRequestContact, onClearFilters }: ProvidersListProps) {
  const { user } = useAuth();

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          Nenhum prestador encontrado com os filtros selecionados.
        </div>
        {onClearFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map((provider) => (
        <Card key={provider?.id} className="border border-gray-100/80 group hover:shadow-xl gap-0 hover:shadow-primary/5 transition-all duration-300 shadow-md bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
          {/* Header com foto e informações principais */}
          <CardHeader className="pb-0">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Avatar com efeito de destaque */}
              <div className="relative">
                <Avatar className="h-18 w-18 ring-4 ring-white shadow-lg group-hover:ring-primary/20 transition-all duration-300">
                  <AvatarImage src={provider?.photoUrl} alt={provider?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-secondary font-semibold text-xl">
                    {provider?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Indicador de status online */}
                {/* <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div> */}
              </div>

              {/* Nome e empresa */}
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {provider?.name}
                </CardTitle>
                <p className="text-sm font-medium text-gray-600">
                  {provider?.business_name}
                </p>
              </div>

              {/* Localização */}
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{provider?.cityName}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4  h-full">
            {/* Serviços oferecidos */}
            <div className="space-y-2 pt-3">
              <h4 className="text-sm font-semibold text-gray-700">Serviços</h4>
              <div className="flex flex-wrap gap-1.5">
                {provider?.servicesNames?.slice(0, 3)?.map((service, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-primary/10 text-secondary border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {service}
                  </Badge>
                ))}
                {provider?.servicesNames?.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                  >
                    +{provider?.servicesNames?.length - 3} mais
                  </Badge>
                )}
              </div>
            </div>

            {/* Descrição */}
            {provider?.description && (
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-700">Sobre</h4>
                <CardDescription className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {provider?.description}
                </CardDescription>
              </div>
            )}

            {/* Avaliações */}
            {provider?.rating && provider?.reviews && (
              <div className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">{provider?.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    ({provider?.reviews} avaliações)
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  ⭐ Excelente
                </div>
              </div>
            )}
          </CardContent>

          {/* Footer com ações */}
          <CardFooter className="pt-4 mt-4 border-t border-gray-100">
            <div className="flex gap-2 w-full">
              <Link href={`/providers/${provider.id}`} className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full bg-white hover:bg-gray-50 border-gray-200 hover:border-primary/30 text-gray-700 hover:text-primary transition-all duration-200"
                >
                  Ver Perfil
                </Button>
              </Link>
              {(!user?.role || user?.role === UserRole.CLIENT) && (
                <Button 
                  onClick={() => onRequestContact(provider.id)} 
                  className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contatar
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}