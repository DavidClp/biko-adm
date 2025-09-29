"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { useAuth } from "@/hooks/use-auth"
import { useRequireRole } from "@/hooks/use-auth-redirect"
import { useAdmin } from "@/hooks/use-admin"

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
import { 
  Users,
  Search,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Shield,
  AlertCircle,
  Eye,
  ArrowLeft
} from "lucide-react"

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

export default function AdminUsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  // Proteger a rota - requer role de admin
  useRequireRole("ADMIN", "/")

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Usar hook para buscar dados reais
  const { users, usersLoading: loading, usersError: error, fetchUsers: refetch } = useAdmin()

  const filteredUsers = users.filter(user =>
    user?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    user?.email?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    user?.role?.toLowerCase()?.includes(searchTerm.toLowerCase())
  )

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge variant="destructive" className="flex items-center gap-1"><Shield className="h-3 w-3" />Admin</Badge>
      case 'PROVIDER':
        return <Badge variant="default" className="flex items-center gap-1"><UserCheck className="h-3 w-3" />Provedor</Badge>
      case 'CLIENT':
        return <Badge variant="secondary" className="flex items-center gap-1"><Users className="h-3 w-3" />Cliente</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando usuários...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar usuários</h2>
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
              <h1 className="text-3xl font-bold mb-2">Gerenciar Usuários</h1>
              <p className="text-muted-foreground">
                Visualize e gerencie todos os usuários da plataforma
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Usuários</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Administradores</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.role === 'ADMIN').length}</p>
                </div>
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Provedores</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.role === 'PROVIDER').length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clientes</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.role === 'CLIENT').length}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar usuários por nome, email ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Usuários</CardTitle>
                <CardDescription>
                  {filteredUsers.length} usuário(s) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user?.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user?.email}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            Cadastrado em {formatDate(user?.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getRoleBadge(user.role)}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Usuário</CardTitle>
                <CardDescription>
                  {selectedUser ? 'Informações completas' : 'Selecione um usuário para ver os detalhes'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedUser ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Informações Básicas</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Nome:</span> {selectedUser.name}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {selectedUser.email}
                        </div>
                        <div>
                          <span className="font-medium">Tipo:</span> {getRoleBadge(selectedUser.role)}
                        </div>
                        <div>
                          <span className="font-medium">Cadastrado em:</span> {formatDate(selectedUser.createdAt)}
                        </div>
                      </div>
                    </div>

                    {selectedUser.provider && (
                      <div>
                        <h3 className="font-semibold mb-2">Informações de Provedor</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Nome do negócio:</span> {selectedUser.provider.name}
                          </div>
                          <div>
                            <span className="font-medium">Status:</span> 
                            <Badge variant={selectedUser.provider.is_listed ? "default" : "secondary"} className="ml-2">
                              {selectedUser.provider.is_listed ? "Listado" : "Oculto"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedUser.client && (
                      <div>
                        <h3 className="font-semibold mb-2">Informações de Cliente</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">ID do Cliente:</span> {selectedUser.client.id}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Ações</h3>
                      <div className="space-y-2">
                        {selectedUser.role === 'PROVIDER' && selectedUser.provider && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => router.push(`/admin/providers`)}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Gerenciar Provedor
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="w-full">
                          <Mail className="h-4 w-4 mr-2" />
                          Enviar Email
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Selecione um usuário da lista para ver os detalhes
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
