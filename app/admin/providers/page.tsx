"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { useAuth } from "@/hooks/use-auth"
import { useRequireRole } from "@/hooks/use-auth-redirect"
import { useAdmin } from "@/hooks/use-admin"

interface Provider {
  id: string
  name: string
  business_name?: string | null
  description?: string | null
  phone?: string | null
  photoUrl?: string | null
  is_listed: boolean
  status: string
  createdAt: string
  user: {
    id: string
    email: string
    role: string
  }
  city?: {
    id: string
    name?: string | null
    state: {
      id: string
      name?: string | null
      initials?: string | null
    }
  } | null
  services: {
    service: {
      id: string
      name: string
    }
  }[]
  subscription?: {
    id: string
    status: string
    value: number
    card_flag: string
    card_mask: string
    next_execution?: string
    next_expire_at?: string
    plans: {
      id: string
      name: string
      description: string
      value: number
      frequency: number
    }
  } | null
  transactions: {
    id: string
    value: number
    status: string
    type: string
    method: string
    createdAt: string
  }[]
}
import { 
  Search, 
  Eye, 
  EyeOff, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  CreditCard,
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle
} from "lucide-react"

export default function AdminProvidersPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  // Proteger a rota - requer role de admin
  useRequireRole("ADMIN", "/")
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  
  // Usar hook personalizado para gerenciar dados dos provedores
  const {
    providers,
    providersLoading: loading,
    providersError: error,
    fetchProviders: refetch,
    toggleProviderListed: toggleListed
  } = useAdmin()

  const toggleProviderListed = async (providerId: string, currentStatus: boolean) => {
    try {
      await toggleListed(providerId, currentStatus)
      
      // Se o modal está aberto, atualizar o provedor selecionado
      if (selectedProvider?.id === providerId) {
        setSelectedProvider(prev => 
          prev ? { ...prev, is_listed: !currentStatus } : null
        )
      }
    } catch (error) {
      console.error("Erro ao alterar status do provedor:", error)
    }
  }

  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.city?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Rejeitado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getSubscriptionStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Cancelada</Badge>
      case "SUSPENDED":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Suspensa</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando provedores...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar dados</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refetch}>Tentar novamente</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gestão de Provedores</h1>
              <p className="text-muted-foreground">Visualize e gerencie provedores de serviços</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.back()}
            >
              Voltar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Provedores</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{providers.length}</div>
              <p className="text-xs text-muted-foreground">Cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Listados</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {providers.filter(p => p.is_listed).length}
              </div>
              <p className="text-xs text-muted-foreground">Visíveis na plataforma</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Assinatura</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {providers.filter(p => p.subscriptions).length}
              </div>
              <p className="text-xs text-muted-foreground">Plano ativo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  providers
                    .filter(p => p.subscriptions)
                    .reduce((sum, p) => sum + (p.subscriptions?.value || 0), 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground">Mensal</p>
            </CardContent>
          </Card>
        </div>

        {/* Providers Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Provedores de Serviços</CardTitle>
                <CardDescription>Lista completa de provedores cadastrados</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar provedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provedor</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assinatura</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Visibilidade</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={provider.photoUrl} alt={provider.name} />
                          <AvatarFallback>
                            {provider.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{provider.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {provider.business_name || provider.user.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {provider.service_provider?.map(sp => sp.service.name).join(", ")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {provider.city ? 
                            `${provider.city.name}, ${provider.city.state.initials}` : 
                            "Não informado"
                          }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(provider.status)}</TableCell>
                    <TableCell>
                      {provider.subscriptions ? (
                        <div>
                          <div className="font-medium text-sm">
                            {provider.subscriptions.plans.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(provider.subscriptions.value)}
                          </div>
                        </div>
                      ) : (
                        <Badge variant="outline">Sem assinatura</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{formatDate(provider.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleProviderListed(provider.id, provider.is_listed)}
                        className={provider.is_listed ? "text-green-600" : "text-gray-400"}
                      >
                        {provider.is_listed ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedProvider(provider)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Provedor</DialogTitle>
                            <DialogDescription>
                              Informações completas e histórico de transações
                            </DialogDescription>
                          </DialogHeader>
                          {selectedProvider && (
                            <div className="space-y-6">
                              {/* Informações Básicas */}
                              <div className="flex items-start gap-4">
                                <Avatar className="h-20 w-20">
                                  <AvatarImage src={selectedProvider.photoUrl} alt={selectedProvider.name} />
                                  <AvatarFallback className="text-lg">
                                    {selectedProvider.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h3 className="text-xl font-semibold">{selectedProvider.name}</h3>
                                  {selectedProvider.business_name && (
                                    <p className="text-muted-foreground">{selectedProvider.business_name}</p>
                                  )}
                                  <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                      <Mail className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm">{selectedProvider.user.email}</span>
                                    </div>
                                    {selectedProvider.phone && (
                                      <div className="flex items-center gap-1">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{selectedProvider.phone}</span>
                                      </div>
                                    )}
                                  </div>
                                  {selectedProvider.description && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                      {selectedProvider.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Status e Visibilidade */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <div className="mt-1">{getStatusBadge(selectedProvider.status)}</div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Visibilidade</label>
                                  <div className="mt-1 flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleProviderListed(selectedProvider.id, selectedProvider.is_listed)}
                                      className={selectedProvider.is_listed ? "text-green-600" : "text-gray-400"}
                                    >
                                      {selectedProvider.is_listed ? (
                                        <>
                                          <Eye className="h-4 w-4 mr-1" />
                                          Visível
                                        </>
                                      ) : (
                                        <>
                                          <EyeOff className="h-4 w-4 mr-1" />
                                          Oculto
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {/* Assinatura */}
                              {selectedProvider.subscriptions && (
                                <div className="space-y-3">
                                  <h4 className="font-semibold flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Assinatura Ativa
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                                    <div>
                                      <label className="text-sm font-medium">Plano</label>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedProvider.subscriptions.plans.name}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Valor</label>
                                      <p className="text-sm text-muted-foreground">
                                        {formatCurrency(selectedProvider.subscriptions.value)}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Status</label>
                                      <div className="mt-1">
                                        {getSubscriptionStatusBadge(selectedProvider.subscriptions.status)}
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Próxima Cobrança</label>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedProvider.subscriptions.next_execution ? 
                                          formatDate(selectedProvider.subscriptions.next_execution) : 
                                          "N/A"
                                        }
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Transações */}
                              {selectedProvider.transactions && selectedProvider.transactions.length > 0 && (
                                <div className="space-y-3">
                                  <h4 className="font-semibold flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    Histórico de Transações
                                  </h4>
                                  <div className="space-y-2">
                                    {selectedProvider.transactions.slice(0, 10).map((transaction) => (
                                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <div>
                                          <p className="font-medium text-sm">{transaction.description}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {formatDate(transaction.createdAt)} • {transaction.type}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-medium text-sm">
                                            {formatCurrency(transaction.value)}
                                          </p>
                                          <Badge 
                                            variant={transaction.status === "CONFIRMED" ? "default" : "secondary"}
                                            className="text-xs"
                                          >
                                            {transaction.status}
                                          </Badge>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
