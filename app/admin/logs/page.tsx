"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { useAuth } from "@/hooks/use-auth"
import { useRequireRole } from "@/hooks/use-auth-redirect"
import { useAdmin } from "@/hooks/use-admin"

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
import { 
  FileText,
  Search,
  Filter,
  ArrowLeft,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Server,
  Globe,
  RefreshCw,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

export default function AdminLogsPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  // Proteger a rota - requer role de admin
  useRequireRole("ADMIN", "/")

  const [selectedLog, setSelectedLog] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const { 
    logs, 
    logStats: stats, 
    logsLoading: loading, 
    logsError: error, 
    logTotalPages: totalPages,
    logCurrentPage: currentPage,
    logTotal: total,
    fetchLogs: refetch,
    updateLogFilters: setFilters 
  } = useAdmin()

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 10: // DEBUG
        return <Badge variant="outline" className="text-gray-600">DEBUG</Badge>
      case 20: // INFO
        return <Badge variant="default" className="text-blue-600">INFO</Badge>
      case 30: // WARN
        return <Badge variant="secondary" className="text-yellow-600">WARN</Badge>
      case 40: // ERROR
        return <Badge variant="destructive">ERROR</Badge>
      case 50: // FATAL
        return <Badge variant="destructive" className="bg-red-800">FATAL</Badge>
      default:
        return <Badge variant="outline">LOG</Badge>
    }
  }

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 10: return <Info className="h-4 w-4" />
      case 20: return <CheckCircle className="h-4 w-4" />
      case 30: return <AlertTriangle className="h-4 w-4" />
      case 40: return <XCircle className="h-4 w-4" />
      case 50: return <XCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getStatusCodeBadge = (statusCode?: number) => {
    if (!statusCode) return null
    
    if (statusCode >= 200 && statusCode < 300) {
      return <Badge variant="default" className="text-green-600">{statusCode}</Badge>
    } else if (statusCode >= 300 && statusCode < 400) {
      return <Badge variant="secondary" className="text-blue-600">{statusCode}</Badge>
    } else if (statusCode >= 400 && statusCode < 500) {
      return <Badge variant="secondary" className="text-yellow-600">{statusCode}</Badge>
    } else {
      return <Badge variant="destructive">{statusCode}</Badge>
    }
  }

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const filteredLogs = logs.filter(log =>
    log.msg.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.req?.method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.req?.url?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePageChange = (page: number) => {
    setFilters({ page })
  }

  const handleLevelFilter = (level: string) => {
    if (level === 'all') {
      setFilters({ level: undefined })
    } else {
      setFilters({ level: parseInt(level) })
    }
  }

  const handleMethodFilter = (method: string) => {
    if (method === 'all') {
      setFilters({ method: undefined })
    } else {
      setFilters({ method })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando logs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar logs</h2>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2">Logs do Sistema</h1>
              <p className="text-muted-foreground">
                Visualize e monitore todos os logs da aplicação
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Logs</p>
                    <p className="text-2xl font-bold">{stats?.total?.toLocaleString()}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Erros</p>
                    <p className="text-2xl font-bold text-red-600">{stats?.errors?.toLocaleString()}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats?.warnings?.toLocaleString()}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Info</p>
                    <p className="text-2xl font-bold text-green-600">{stats?.info?.toLocaleString()}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nível</label>
                  <Select onValueChange={handleLevelFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os níveis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="10">DEBUG</SelectItem>
                      <SelectItem value="20">INFO</SelectItem>
                      <SelectItem value="30">WARN</SelectItem>
                      <SelectItem value="40">ERROR</SelectItem>
                      <SelectItem value="50">FATAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Método HTTP</label>
                  <Select onValueChange={handleMethodFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os métodos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Data Início</label>
                  <Input
                    type="datetime-local"
                    onChange={(e) => setFilters({ startTime: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Data Fim</label>
                  <Input
                    type="datetime-local"
                    onChange={(e) => setFilters({ endTime: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar logs por mensagem, método ou URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Logs List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logs List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Logs ({filteredLogs?.length} de {total})
                </CardTitle>
                <CardDescription>
                  Últimas entradas de log do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredLogs.map((log, index) => (
                    <div
                      key={`${log.time}-${index}`}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedLog(log)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getLevelIcon(log.level)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getLevelBadge(log.level)}
                          {getStatusCodeBadge(log.res?.statusCode)}
                          {log.req?.method && (
                            <Badge variant="outline">{log.req.method}</Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium mb-1">{log.msg}</p>
                        {log.req?.url && (
                          <p className="text-xs text-muted-foreground mb-1">
                            <Globe className="h-3 w-3 inline mr-1" />
                            {log.req.url}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(log.time)}
                          </span>
                          {log.responseTime && (
                            <span>{log.responseTime}ms</span>
                          )}
                          {log.requestId && (
                            <span>ID: {log.requestId}</span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Página {currentPage} de {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
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

          {/* Log Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Log</CardTitle>
                <CardDescription>
                  {selectedLog ? 'Informações completas' : 'Selecione um log para ver os detalhes'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedLog ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Informações Básicas</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Nível:</span> {getLevelBadge(selectedLog.level)}
                        </div>
                        <div>
                          <span className="font-medium">Mensagem:</span> {selectedLog.msg}
                        </div>
                        <div>
                          <span className="font-medium">Timestamp:</span> {formatDate(selectedLog.time)}
                        </div>
                        <div>
                          <span className="font-medium">PID:</span> {selectedLog.pid}
                        </div>
                        <div>
                          <span className="font-medium">Hostname:</span> {selectedLog.hostname}
                        </div>
                      </div>
                    </div>

                    {selectedLog.req && (
                      <div>
                        <h3 className="font-semibold mb-2">Requisição</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Método:</span> {selectedLog.req?.method}
                          </div>
                          <div>
                            <span className="font-medium">URL:</span> {selectedLog.req?.url}
                          </div>
                          <div>
                            <span className="font-medium">BODY:</span> 
                            <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(selectedLog.req?.body, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedLog.res && (
                      <div>
                        <h3 className="font-semibold mb-2">Resposta</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Status Code:</span> {getStatusCodeBadge(selectedLog.res.statusCode)}
                          </div>
                          {selectedLog.responseTime && (
                            <div>
                              <span className="font-medium">Tempo de Resposta:</span> {selectedLog.responseTime}ms
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedLog.err && (
                      <div>
                        <h3 className="font-semibold mb-2 text-red-600">Erro</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Tipo:</span> {selectedLog.err.type}
                          </div>
                          <div>
                            <span className="font-medium">Mensagem:</span> {selectedLog.err.message}
                          </div>
                          {selectedLog.err.stack && (
                            <div>
                              <span className="font-medium">Stack:</span>
                              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                                {selectedLog.err.stack}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Selecione um log da lista para ver os detalhes
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
