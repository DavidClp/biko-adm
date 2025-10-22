"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { useAuth } from "@/hooks/use-auth"
import { useRequireRole } from "@/hooks/use-auth-redirect"
import { useAdmin } from "@/hooks/use-admin"
import { 
  Users, 
  UserCheck, 
  BarChart3, 
  Settings,
  Shield,
  TrendingUp,
  Activity,
  Eye,
  CreditCard,
  MapPin,
  Calendar,
  AlertCircle,
  LogOut,
  Gift
} from "lucide-react"

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  // Proteger a rota - requer role de admin
  /*   useRequireRole("ADMIN", "/") */
    
    // Usar hook para buscar dados reais
  const { stats, statsLoading: loading, statsError: error, refetchAll } = useAdmin()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const adminFeatures = [
    {
      title: "Dashboard",
      description: "Visão geral do sistema e métricas principais",
      icon: TrendingUp,
      href: "/admin/dashboard",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Provedores",
      description: "Gerenciar provedores e controlar visibilidade",
      icon: UserCheck,
      href: "/admin/providers",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
/*     {
      title: "Analytics",
      description: "Relatórios detalhados e métricas avançadas",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }, */
    {
      title: "Usuários",
      description: "Visualizar e gerenciar todos os usuários",
      icon: Users,
      href: "/admin/users",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Anunciantes",
      description: "Visualizar e gerenciar todos os anunciantes",
      icon: LogOut,
      href: "/admin/advertisers",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Banners",
      description: "Gerenciar banners de publicidade",
      icon: LogOut,
      href: "/admin/banners",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Indicações",
      description: "Visualizar todas as indicações de prestadores",
      icon: Gift,
      href: "/admin/recommendations",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
  ]

  // Dados dinâmicos baseados nas estatísticas reais
  const quickStats = stats ? [
    {
      title: "Total de Usuários",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: `+${stats.thisMonthSignups} este mês`,
      changeType: "positive" as const
    },
    {
      title: "Provedores Ativos",
      value: stats.totalProviders.toString(),
      icon: UserCheck,
      change: `${stats.listedProviders} listados`,
      changeType: "positive" as const
    },
    {
      title: "Receita Mensal",
      value: formatCurrency(stats.monthlyRevenue),
      icon: CreditCard,
      change: `${stats.providersWithSubscription} assinaturas`,
      changeType: "positive" as const
    },
    {
      title: "Pendentes",
      value: stats.pendingProviders.toString(),
      icon: Activity,
      change: "Aguardando aprovação",
      changeType: "warning" as const
    }
  ] : []

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
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
          <Button onClick={refetchAll}>Tentar novamente</Button>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs flex items-center gap-1 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
                </div>

        {/* Admin Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Ferramentas Administrativas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(feature.href)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            ))}
                    </div>
                  </div>

        {/* Recent Providers */}
        {stats?.recentProviders && stats.recentProviders.length > 0 && (
              <Card>
                <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Provedores Recentes
              </CardTitle>
              <CardDescription>
                Últimos provedores cadastrados no sistema
              </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                {stats.recentProviders.slice(0, 5).map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${provider.is_listed ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <p className="font-medium text-sm">{provider.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {provider.business_name || 'Provedor'}
                          {provider.city && ` - ${provider.city.name}, ${provider.city.state.initials}`}
                        </p>
                    </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(provider.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ))}
                  </div>
                </CardContent>
              </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}
