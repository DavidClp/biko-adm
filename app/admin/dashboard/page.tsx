"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { useAuth } from "@/hooks/use-auth"
import { useRequireRole } from "@/hooks/use-auth-redirect"
import { useAdmin } from "@/hooks/use-admin"
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  DollarSign,
  Activity,
  Calendar,
  MapPin,
  CreditCard,
  BarChart3,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  // Proteger a rota - requer role de admin
  useRequireRole("ADMIN", "/")
  
  // Usar hook personalizado para gerenciar estatísticas
  const { stats, statsLoading: loading, statsError: error, fetchStats: refetch } = useAdmin()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refetch}>Tentar novamente</Button>
        </div>
      </div>
    )
  }

  if (!stats) {
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
          <h1 className="text-3xl font-bold mb-2">
            {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel administrativo da plataforma
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button 
            variant="outline" 
            className="h-auto p-4 justify-start"
            onClick={() => router.push("/admin/providers")}
          >
            <div className="flex items-center gap-3">
              <UserCheck className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Gerenciar Provedores</div>
                <div className="text-sm text-muted-foreground">Visualizar e configurar provedores</div>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 justify-start"
            onClick={() => router.push("/admin/analytics")}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Analytics</div>
                <div className="text-sm text-muted-foreground">Relatórios e métricas</div>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 justify-start"
            onClick={() => router.push("/admin/settings")}
          >
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Configurações</div>
                <div className="text-sm text-muted-foreground">Configurações do sistema</div>
              </div>
            </div>
          </Button>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.thisMonthSignups} este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Provedores</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProviders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.listedProviders} listados
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
                {formatCurrency(stats.monthlyRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.providersWithSubscription} com assinatura
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingProviders}
              </div>
              <p className="text-xs text-muted-foreground">
                Aguardando aprovação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Cities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Cidades com Mais Provedores
              </CardTitle>
              <CardDescription>
                Distribuição geográfica dos provedores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topCities.map((city, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {city.city}, {city.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ 
                            width: `${(city.count / Math.max(...stats.topCities.map(c => c.count)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right">
                        {city.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Providers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Provedores Recentes
              </CardTitle>
              <CardDescription>
                Últimos provedores cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${provider.is_listed ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <div className="font-medium text-sm">{provider.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {provider.city ? `${provider.city.name}, ${provider.city.state.initials}` : "Não informado"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {provider.is_listed ? (
                        <Eye className="h-3 w-3 text-green-600" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-gray-400" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(provider.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Status do Sistema
            </CardTitle>
            <CardDescription>
              Indicadores de saúde da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((stats.listedProviders / stats.totalProviders) * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Taxa de Listagem</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((stats.providersWithSubscription / stats.totalProviders) * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Taxa de Assinatura</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
