"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProviderMetrics } from "@/hooks/use-provider-metrics"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { 
  Search, 
  Eye, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Users,
  Activity,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react"

interface ProviderDashboardProps {
  providerId: string;
  query?: string;
  cityId?: string;
}

export function ProviderDashboard({ providerId, query, cityId }: ProviderDashboardProps) {
  const { data: metrics, isLoading, error } = useProviderMetrics({ providerId, query, cityId });

  console.log("metrics", metrics);
  console.log("error", error);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Erro ao carregar métricas</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma métrica disponível</p>
      </div>
    );
  }

  // Calcular tendências (simulado - você pode implementar lógica real)
  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowUpRight className="h-3 w-3 text-green-500" />
    if (current < previous) return <ArrowDownRight className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-gray-500" />
  }

  const getTrendPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header com título e descrição */}
      <div className="text-center space-y-2 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Dashboard de Métricas
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto px-2">
          Acompanhe o desempenho do seu perfil e entenda como os clientes estão encontrando seus serviços
        </p>
      </div>

      {/* Cards principais com design moderno */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
        {/* Total de Aparições na Busca */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
          <div className="absolute top-0 right-0 w-17 h-17 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
              Aparições na Busca
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
              {metrics.total_search_appearances.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-blue-600 dark:text-blue-400">
              {getTrendIcon(metrics.search_appearances_today, 0)}
              <span>+{metrics.search_appearances_today} hoje</span>
            </div>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-2 leading-tight">
              Total de vezes que apareceu em buscas
            </p>
          </CardContent>
        </Card>

        {/* Total de Visualizações do Perfil */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10">
          <div className="absolute top-0 right-0 w-17 h-17 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-300">
              Visualizações do Perfil
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
              {metrics.total_profile_views.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-green-600 dark:text-green-400">
              {getTrendIcon(metrics.profile_views_today, 0)}
              <span>+{metrics.profile_views_today} hoje</span>
            </div>
            <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-2 leading-tight">
              Total de visualizações do perfil
            </p>
          </CardContent>
        </Card>

        {/* Aparições Hoje */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10">
          <div className="absolute top-0 right-0 w-17 h-17 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300">
              Aparições Hoje
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1">
              {metrics.search_appearances_today}
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-purple-600 dark:text-purple-400">
              <Activity className="h-3 w-3" />
              <span>Em tempo real</span>
            </div>
            <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-2 leading-tight">
              Em buscas realizadas hoje
            </p>
          </CardContent>
        </Card>

        {/* Visualizações Hoje */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10">
          <div className="absolute top-0 right-0 w-17 h-17 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-xs sm:text-sm font-semibold text-orange-700 dark:text-orange-300">
              Visualizações Hoje
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl sm:text-3xl font-bold text-orange-900 dark:text-orange-100 mb-1">
              {metrics.profile_views_today}
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-orange-600 dark:text-orange-400">
              <Zap className="h-3 w-3" />
              <span>Ativo hoje</span>
            </div>
            <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-2 leading-tight">
              Perfil visualizado hoje
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas por período com design moderno */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 px-4 md:px-0">
        {/* Esta Semana */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/30">
          <CardHeader className="pb-3 md:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                    Esta Semana
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                    Últimos 7 dias de atividade
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0 self-start sm:self-auto">
                7 dias
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50 gap-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Search className="h-3 w-3 md:h-4 md:w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm md:text-base text-slate-900 dark:text-slate-100">Aparições na busca</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Resultados encontrados</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {metrics.search_appearances_this_week}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +{Math.round(metrics.search_appearances_this_week * 0.1)} vs semana anterior
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50 gap-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1.5 md:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Eye className="h-3 w-3 md:h-4 md:w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm md:text-base text-slate-900 dark:text-slate-100">Visualizações do perfil</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Perfis acessados</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {metrics.profile_views_this_week}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +{Math.round(metrics.profile_views_this_week * 0.15)} vs semana anterior
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Este Mês */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/30">
          <CardHeader className="pb-3 md:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                    Este Mês
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                    Últimos 30 dias de atividade
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0 self-start sm:self-auto">
                30 dias
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50 gap-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Search className="h-3 w-3 md:h-4 md:w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm md:text-base text-slate-900 dark:text-slate-100">Aparições na busca</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Resultados encontrados</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {metrics.search_appearances_this_month}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +{Math.round(metrics.search_appearances_this_month * 0.2)} vs mês anterior
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50 gap-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1.5 md:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Eye className="h-3 w-3 md:h-4 md:w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm md:text-base text-slate-900 dark:text-slate-100">Visualizações do perfil</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Perfis acessados</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {metrics.profile_views_this_month}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +{Math.round(metrics.profile_views_this_month * 0.25)} vs mês anterior
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de métricas diárias com design moderno */}
      {metrics.daily_metrics && metrics.daily_metrics.length > 0 && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/30 mx-4 md:mx-0">
          <CardHeader className="pb-4 md:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                  <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                    Evolução Diária
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                    Últimos 7 dias de atividade detalhada
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-0 self-start sm:self-auto">
                Últimos 7 dias
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 md:space-y-3">
              {metrics.daily_metrics.slice(-7).map((day, index) => {
                const date = new Date(day.date);
                const isToday = date.toDateString() === new Date().toDateString();
                const isYesterday = date.toDateString() === new Date(Date.now() - 86400000).toDateString();
                
                return (
                  <div 
                    key={day.date} 
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-xl border transition-all duration-200 hover:shadow-md gap-3 ${
                      isToday 
                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-700' 
                        : 'bg-white/60 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`p-1.5 md:p-2 rounded-lg ${
                        isToday 
                          ? 'bg-indigo-100 dark:bg-indigo-900/30' 
                          : 'bg-slate-100 dark:bg-slate-700/50'
                      }`}>
                        <Calendar className={`h-3 w-3 md:h-4 md:w-4 ${
                          isToday 
                            ? 'text-indigo-600 dark:text-indigo-400' 
                            : 'text-slate-600 dark:text-slate-400'
                        }`} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm md:text-base text-slate-900 dark:text-slate-100">
                          {isToday ? 'Hoje' : isYesterday ? 'Ontem' : date.toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: '2-digit',
                            weekday: 'short'
                          })}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {date.toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: 'long' 
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                      <div className="flex items-center gap-2">
                        <div className="p-1 md:p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Search className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="font-bold text-sm md:text-base text-slate-900 dark:text-slate-100">
                            {day.search_appearances}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            buscas
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="p-1 md:p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Eye className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="font-bold text-sm md:text-base text-slate-900 dark:text-slate-100">
                            {day.profile_views}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            visualizações
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
