import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

// Interfaces para dados
interface DashboardStats {
  totalUsers: number
  totalProviders: number
  totalClients: number
  listedProviders: number
  providersWithSubscription: number
  monthlyRevenue: number
  pendingProviders: number
  thisMonthSignups: number
  topCities: { city: string; state: string; count: number }[]
  recentProviders: { 
    id: string; 
    name: string; 
    business_name?: string | null; 
    createdAt: string; 
    city?: { name: string; state: { initials: string } } | null;
    is_listed: boolean 
  }[]
}

interface AnalyticsData {
  userGrowth: { month: string; users: number; providers: number; clients: number }[]
  revenue: { month: string; revenue: number }[]
  topServices: { service: string; count: number }[]
  geographicDistribution: { state: string; providers: number }[]
  conversionRates: {
    signupToProvider: number
    providerToSubscription: number
    subscriptionToActive: number
  }
  systemMetrics: {
    activeUsers: number
    successRate: number
    totalRequests: number
    averageResponseTime: number
  }
}

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

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'CLIENT' | 'PROVIDER'
  createdAt: string
  client?: {
    id: string
  } | null
  provider?: {
    id: string
    name: string
    is_listed: boolean
  } | null
}

interface LogEntry {
  level: number
  time: string
  pid: number
  hostname: string
  req?: {
    method: string
    url: string
  }
  requestId?: string
  res?: {
    statusCode: number
  }
  responseTime?: number
  msg: string
  err?: {
    type: string
    message: string
    stack: string
  }
}

interface LogStats {
  total: number
  errors: number
  warnings: number
  info: number
  methods: { [key: string]: number }
  statusCodes: { [key: string]: number }
}

// Hook principal
export function useAdmin() {
  // Estados para Dashboard
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsError, setStatsError] = useState<string | null>(null)

  // Estados para Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)

  // Estados para Providers
  const [providers, setProviders] = useState<Provider[]>([])
  const [providersLoading, setProvidersLoading] = useState(false)
  const [providersError, setProvidersError] = useState<string | null>(null)

  // Estados para Users
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState<string | null>(null)

  // Estados para Logs
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [logStats, setLogStats] = useState<LogStats | null>(null)
  const [logsLoading, setLogsLoading] = useState(false)
  const [logsError, setLogsError] = useState<string | null>(null)
  const [logTotalPages, setLogTotalPages] = useState(0)
  const [logCurrentPage, setLogCurrentPage] = useState(1)
  const [logTotal, setLogTotal] = useState(0)
  const [logFilters, setLogFilters] = useState({
    level: undefined as number | undefined,
    method: undefined as string | undefined,
    startTime: undefined as string | undefined,
    endTime: undefined as string | undefined,
    limit: 50,
    page: 1
  })

  // Funções para Dashboard
  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      setStatsError(null)
      const response = await api.get('/admin/dashboard/stats')
      if (response.success && response.data) {
        setStats(response.data)
      } else {
        throw new Error('Erro ao buscar estatísticas')
      }
    } catch (err: any) {
      console.error('Erro ao buscar estatísticas:', err)
      setStatsError(err.message || 'Erro ao carregar estatísticas')
    } finally {
      setStatsLoading(false)
    }
  }

  // Funções para Analytics
  const fetchAnalytics = async (period: string = '6m') => {
    try {
      setAnalyticsLoading(true)
      setAnalyticsError(null)
      const response = await api.get(`/admin/analytics?period=${period}`)
      if (response.success && response.data) {
        setAnalytics(response.data)
      } else {
        throw new Error('Erro ao buscar analytics')
      }
    } catch (err: any) {
      console.error('Erro ao buscar analytics:', err)
      setAnalyticsError(err.message || 'Erro ao carregar analytics')
    } finally {
      setAnalyticsLoading(false)
    }
  }

  // Funções para Providers
  const fetchProviders = async () => {
    try {
      setProvidersLoading(true)
      setProvidersError(null)
      const response = await api.get('/admin/providers')
      if (response.success && response.data) {
        setProviders(response.data)
      } else {
        throw new Error('Erro ao buscar provedores')
      }
    } catch (err: any) {
      console.error('Erro ao buscar provedores:', err)
      setProvidersError(err.message || 'Erro ao carregar provedores')
    } finally {
      setProvidersLoading(false)
    }
  }

  const toggleProviderListed = async (providerId: string, currentStatus: boolean) => {
    try {
      setProvidersError(null)
      const response = await api.patch(`/admin/providers/${providerId}/toggle-listed`, {
        is_listed: !currentStatus
      })
      if (response.success) {
        setProviders(prev =>
          prev.map(p =>
            p.id === providerId ? { ...p, is_listed: !currentStatus } : p
          )
        )
      } else {
        throw new Error('Erro ao alterar status do provedor')
      }
    } catch (err: any) {
      console.error('Erro ao alterar status do provedor:', err)
      setProvidersError(err.message || 'Erro ao alterar status do provedor')
      throw err
    }
  }

  // Funções para Users
  const fetchUsers = async () => {
    try {
      setUsersLoading(true)
      setUsersError(null)
      const response = await api.get('/admin/users')
      if (response.success && response.data) {
        setUsers(response.data)
      } else {
        throw new Error('Erro ao buscar usuários')
      }
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err)
      setUsersError(err.message || 'Erro ao carregar usuários')
    } finally {
      setUsersLoading(false)
    }
  }

  const getUserById = async (userId: string): Promise<User | null> => {
    try {
      setUsersError(null)
      const response = await api.get(`/admin/users/${userId}`)
      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (err: any) {
      console.error('Erro ao buscar usuário:', err)
      setUsersError(err.message || 'Erro ao buscar usuário')
      return null
    }
  }

  // Funções para Logs
  const fetchLogs = async () => {
    try {
      setLogsLoading(true)
      setLogsError(null)
      
      const params = new URLSearchParams()
      if (logFilters.level !== undefined) params.append('level', logFilters.level.toString())
      if (logFilters.method) params.append('method', logFilters.method)
      if (logFilters.startTime) params.append('startTime', logFilters.startTime)
      if (logFilters.endTime) params.append('endTime', logFilters.endTime)
      if (logFilters.limit) params.append('limit', logFilters.limit.toString())
      if (logFilters.page) params.append('page', logFilters.page.toString())

      const response = await api.get(`/logs?${params.toString()}`)
      if (response.success && response.data) {
        setLogs(response.data)
        setLogTotalPages(response.pagination?.totalPages || 0)
        setLogCurrentPage(response.pagination?.page || 1)
        setLogTotal(response.pagination?.total || 0)
      } else {
        throw new Error('Erro ao buscar logs')
      }
    } catch (err: any) {
      console.error('Erro ao buscar logs:', err)
      setLogsError(err.message || 'Erro ao carregar logs')
    } finally {
      setLogsLoading(false)
    }
  }

  const fetchLogStats = async () => {
    try {
      setLogsError(null)
      const response = await api.get('/logs/stats')
      if (response.success && response.data) {
        setLogStats(response.data)
      } else {
        throw new Error('Erro ao buscar estatísticas dos logs')
      }
    } catch (err: any) {
      console.error('Erro ao buscar estatísticas dos logs:', err)
      setLogsError(err.message || 'Erro ao carregar estatísticas')
    }
  }

  const updateLogFilters = (newFilters: Partial<typeof logFilters>) => {
    setLogFilters(prev => ({ ...prev, ...newFilters }))
  }

  // Funções utilitárias
  const refetchAll = async () => {
    await Promise.all([
      fetchStats(),
      fetchAnalytics(),
      fetchProviders(),
      fetchUsers(),
      fetchLogs(),
      fetchLogStats()
    ])
  }

  // Auto-fetch inicial
  useEffect(() => {
    fetchStats()
    fetchAnalytics()
    fetchProviders()
    fetchUsers()
    fetchLogs()
    fetchLogStats()
  }, [])

  // Auto-fetch logs quando filtros mudarem
  useEffect(() => {
    fetchLogs()
  }, [logFilters])

  return {
    // Dashboard
    stats,
    statsLoading,
    statsError,
    fetchStats,

    // Analytics
    analytics,
    analyticsLoading,
    analyticsError,
    fetchAnalytics,

    // Providers
    providers,
    providersLoading,
    providersError,
    fetchProviders,
    toggleProviderListed,

    // Users
    users,
    usersLoading,
    usersError,
    fetchUsers,
    getUserById,

    // Logs
    logs,
    logStats,
    logsLoading,
    logsError,
    logTotalPages,
    logCurrentPage,
    logTotal,
    logFilters,
    fetchLogs,
    fetchLogStats,
    updateLogFilters,

    // Utilitários
    refetchAll
  }
}
