"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  const { user } = useAuth()

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
        <Card key={provider?.id} className="hover:shadow-lg transition-shadow">
          <CardHeader >
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={provider.avatar} alt={provider.name} />
                <AvatarFallback>
                  {provider?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg">{provider?.name}</CardTitle>
                <div className="flex flex-wrap gap-1 mb-2">
                  {provider?.services?.slice(0, 2)?.map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {provider?.services?.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{provider?.services?.length - 2}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {provider?.cityName}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <CardDescription className="mb-4 line-clamp-2">
              {provider?.description}
            </CardDescription>

            {provider?.rating && provider?.reviews && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{provider.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({provider?.reviews || 0} avaliações)
                </span>
              </div>
            )}

            <div className="flex gap-2">
              <Link href={`/providers/${provider.id}`} className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Perfil
                </Button>
              </Link>
              {user?.role === UserRole.CLIENT && (
              <Button onClick={() => onRequestContact(provider.id)} className="flex-1">
                <MessageCircle className="h-4 w-4" />
                Solicitar Orçamento
              </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}