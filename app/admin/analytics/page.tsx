"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { useAuth } from "@/hooks/use-auth"
import { useRequireRole } from "@/hooks/use-auth-redirect"
import { useAdmin } from "@/hooks/use-admin"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  UserCheck,
  DollarSign,
  Calendar,
  MapPin,
  Activity,
  CreditCard,
  AlertCircle
} from "lucide-react"

export default function AdminAnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  // Proteger a rota - requer role de admin
  useRequireRole("ADMIN", "/")
  
  const [selectedPeriod, setSelectedPeriod] = useState("6m")
  
  // Usar hook personalizado para gerenciar analytics
  const { analytics, analyticsLoading: loading, analyticsError: error, fetchAnalytics: refetch } = useAdmin()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return 0
    return Number(((current - previous) / previous * 100).toFixed(1))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar analytics</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => refetch(selectedPeriod)}>Tentar novamente</Button>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics & Relatórios</h1>
              <p className="text-muted-foreground">
                Métricas detalhadas e insights da plataforma
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={selectedPeriod === "3m" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("3m")}
              >
                3M
              </Button>
              <Button 
                variant={selectedPeriod === "6m" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("6m")}
              >
                6M
              </Button>
              <Button 
                variant={selectedPeriod === "1y" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("1y")}
              >
                1A
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="ml-4"
              >
                Voltar
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.systemMetrics.activeUsers}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                +12% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {analytics.systemMetrics.successRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.systemMetrics.totalRequests.toLocaleString()} requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.systemMetrics.averageResponseTime}ms</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-green-600" />
                -5% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(analytics.revenue[analytics.revenue.length - 1]?.revenue || 0)}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                +8.5% vs mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Crescimento de Usuários
              </CardTitle>
              <CardDescription>
                Evolução do número de usuários cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.userGrowth.map((data, index) => {
                  const prevData = analytics.userGrowth[index - 1]
                  const userGrowth = prevData ? getGrowthPercentage(data.users, prevData.users) : 0
                  
                  return (
                    <div key={data.month} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{data.month}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{data.users}</div>
                          <div className="text-xs text-muted-foreground">
                            {data.providers} provedores, {data.clients} clientes
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs flex items-center gap-1 ${userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {userGrowth >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {userGrowth}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Receita e Assinaturas
              </CardTitle>
              <CardDescription>
                Evolução da receita mensal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.revenue.map((data, index) => {
                  const prevData = analytics.revenue[index - 1]
                  const revenueGrowth = prevData ? getGrowthPercentage(data.revenue, prevData.revenue) : 0
                  
                  return (
                    <div key={data.month} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{data.month}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{formatCurrency(data.revenue)}</div>
                          <div className="text-xs text-muted-foreground">
                            Receita mensal
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs flex items-center gap-1 ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {revenueGrowth >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {revenueGrowth}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Serviços Mais Procurados
              </CardTitle>
              <CardDescription>
                Categorias com maior número de provedores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{service.service}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{service.count} provedores</div>
                        <div className="text-xs text-muted-foreground">
                          Serviço popular
                        </div>
                      </div>
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ 
                            width: `${(service.count / Math.max(...analytics.topServices.map(s => s.count)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Distribuição Geográfica
              </CardTitle>
              <CardDescription>
                Provedores por estado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.geographicDistribution.map((state, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{state.state}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{state.providers} provedores</div>
                        <div className="text-xs text-muted-foreground">
                          Distribuição regional
                        </div>
                      </div>
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ 
                            width: `${(state.providers / Math.max(...analytics.geographicDistribution.map(s => s.providers)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Taxas de Conversão
            </CardTitle>
            <CardDescription>
              Indicadores de performance da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {analytics.conversionRates.signupToProvider}%
                </div>
                <p className="text-sm text-muted-foreground">Cadastro → Provedor</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Taxa de conversão de cadastros em provedores
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {analytics.conversionRates.providerToSubscription}%
                </div>
                <p className="text-sm text-muted-foreground">Provedor → Assinatura</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Taxa de conversão em assinaturas
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {analytics.conversionRates.subscriptionToActive}%
                </div>
                <p className="text-sm text-muted-foreground">Assinatura → Ativo</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Taxa de retenção de assinaturas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
