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
  Users
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

  return (
    <div className="space-y-6">
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Aparições na Busca */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aparições na Busca
            </CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total_search_appearances}</div>
            <p className="text-xs text-muted-foreground">
              Total de vezes que apareceu em buscas
            </p>
          </CardContent>
        </Card>

        {/* Total de Visualizações do Perfil */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Visualizações do Perfil
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total_profile_views}</div>
            <p className="text-xs text-muted-foreground">
              Total de visualizações do perfil
            </p>
          </CardContent>
        </Card>

        {/* Aparições Hoje */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aparições Hoje
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.search_appearances_today}</div>
            <p className="text-xs text-muted-foreground">
              Em buscas realizadas hoje
            </p>
          </CardContent>
        </Card>

        {/* Visualizações Hoje */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Visualizações Hoje
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.profile_views_today}</div>
            <p className="text-xs text-muted-foreground">
              Perfil visualizado hoje
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas por período */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Esta Semana */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Esta Semana
            </CardTitle>
            <CardDescription>
              Métricas dos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Aparições na busca</span>
              </div>
              <Badge variant="secondary">
                {metrics.search_appearances_this_week}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-sm">Visualizações do perfil</span>
              </div>
              <Badge variant="secondary">
                {metrics.profile_views_this_week}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Este Mês */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Este Mês
            </CardTitle>
            <CardDescription>
              Métricas dos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Aparições na busca</span>
              </div>
              <Badge variant="secondary">
                {metrics.search_appearances_this_month}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-sm">Visualizações do perfil</span>
              </div>
              <Badge variant="secondary">
                {metrics.profile_views_this_month}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de métricas diárias */}
      {metrics.daily_metrics && metrics.daily_metrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Métricas Diárias (Últimos 30 dias)</CardTitle>
            <CardDescription>
              Evolução das métricas ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.daily_metrics.slice(-7).map((day, index) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">
                      {new Date(day.date).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: '2-digit' 
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{day.search_appearances}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{day.profile_views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
