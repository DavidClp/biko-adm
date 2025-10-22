"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { useAdminRecommendations } from "@/hooks/use-admin-recommendations"
import { 
  Users, 
  Calendar, 
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  MapPin,
  Building,
  CheckCircle,
  Clock,
  Gift,
  CreditCard
} from "lucide-react"

export default function AdminRecommendationsPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const { recommendations, pagination, isLoading, error } = useAdminRecommendations({
    page,
    limit,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Ativo</Badge>
      case 'PENDING':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage)
    }
  }

  const handleLimitChange = (newLimit: string) => {
    setLimit(parseInt(newLimit))
    setPage(1) // Reset to first page when changing limit
  }

  const clearFilters = () => {
    setStartDate("")
    setEndDate("")
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Gift className="h-8 w-8 text-primary" />
            Indicações de Prestadores
          </h1>
          <p className="text-muted-foreground">
            Visualize todas as indicações realizadas na plataforma
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limit">Itens por página</Label>
                <Select value={limit.toString()} onValueChange={handleLimitChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total de Indicações</p>
                  <p className="text-2xl font-bold">{pagination.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Valor Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(pagination.total * 20)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Página Atual</p>
                  <p className="text-2xl font-bold">{pagination.page} de {pagination.totalPages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Indicações</CardTitle>
            <CardDescription>
              Mostrando {recommendations.length} de {pagination.total} indicações
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando indicações...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma indicação encontrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Quem Indicou */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <h4 className="font-semibold">Quem Indicou</h4>
                        </div>
                        <div className="pl-6 space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{rec.giver.email}</span>
                          </div>
                          {rec.giver.cpf && (
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">CPF: {rec.giver.cpf}</span>
                            </div>
                          )}
                          {rec.giver.pix_key && (
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">PIX: {rec.giver.pix_key}</span>
                            </div>
                          )}
                          {rec.giver.recommendation_code && (
                            <div className="flex items-center gap-2">
                              <Gift className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-mono">{rec.giver.recommendation_code}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quem Foi Indicado */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-green-600" />
                          <h4 className="font-semibold">Prestador Indicado</h4>
                        </div>
                        <div className="pl-6 space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{rec.receiver.email}</span>
                          </div>
                          {rec.receiver.provider && (
                            <>
                              {rec.receiver.provider.business_name && (
                                <div className="flex items-center gap-2">
                                  <Building className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{rec.receiver.provider.business_name}</span>
                                </div>
                              )}
                              {rec.receiver.provider.city && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">
                                    {rec.receiver.provider.city.name}, {rec.receiver.provider.city.state.initials}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                {getStatusBadge(rec.receiver.provider.status)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer with date and reward */}
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Indicado em {formatDate(rec.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Gift className="h-3 w-3 mr-1" />
                          R$ 20,00
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} indicações
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, pagination.page - 2)) + i;
                      if (pageNum > pagination.totalPages) return null;
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === pagination.page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
