"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Users, UserCheck, Search, CheckCircle, XCircle, Eye, BarChart3, Clock } from "lucide-react"

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<any>(null)

  // Mock data for demonstration
  const metrics = {
    totalUsers: 1247,
    totalProviders: 523,
    totalClients: 724,
    pendingProviders: 18,
    approvedProviders: 505,
    thisMonthSignups: 89,
  }

  const users = [
    {
      id: "1",
      name: "Maria Santos",
      email: "maria@email.com",
      role: "client",
      createdAt: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "João Silva",
      email: "joao@email.com",
      role: "provider",
      createdAt: "2024-01-10",
      status: "active",
    },
    {
      id: "3",
      name: "Carlos Oliveira",
      email: "carlos@email.com",
      role: "client",
      createdAt: "2024-01-08",
      status: "active",
    },
    {
      id: "4",
      name: "Ana Costa",
      email: "ana@email.com",
      role: "provider",
      createdAt: "2024-01-05",
      status: "pending",
    },
  ]

  const providers = [
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      service: "Eletricista",
      city: "São Paulo",
      phone: "(11) 99999-9999",
      description: "Eletricista com 10 anos de experiência",
      approved: true,
      createdAt: "2024-01-10",
      photo: "/professional-electrician.png",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria.designer@email.com",
      service: "Designer",
      city: "Rio de Janeiro",
      phone: "(21) 88888-8888",
      description: "Designer gráfica especializada em identidade visual",
      approved: false,
      createdAt: "2024-01-18",
      photo: "/professional-designer-woman.png",
    },
    {
      id: "3",
      name: "Carlos Oliveira",
      email: "carlos.foto@email.com",
      service: "Fotógrafo",
      city: "Belo Horizonte",
      phone: "(31) 77777-7777",
      description: "Fotógrafo profissional especializado em eventos",
      approved: false,
      createdAt: "2024-01-20",
      photo: "/professional-photographer.png",
    },
    {
      id: "4",
      name: "Pedro Santos",
      email: "pedro@email.com",
      service: "Encanador",
      city: "Brasília",
      phone: "(61) 66666-6666",
      description: "Encanador com experiência em residencial e comercial",
      approved: true,
      createdAt: "2024-01-12",
    },
  ]

  const handleApproveProvider = async (providerId: string, approved: boolean) => {
    try {
      // Simulate API call
      console.log(`${approved ? "Approving" : "Rejecting"} provider ${providerId}`)
      // In real app: await adminApi.approveProvider(providerId, approved)

      // Update local state (in real app, refetch data)
      // setProviders(prev => prev.map(p => p.id === providerId ? {...p, approved} : p))

      // Show success message
    } catch (error) {
      console.error("Error updating provider status:", error)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "client":
        return <Badge variant="secondary">Cliente</Badge>
      case "provider":
        return <Badge variant="outline">Prestador</Badge>
      case "admin":
        return <Badge>Admin</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getStatusBadge = (approved: boolean) => {
    return approved ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Aprovado
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        <Clock className="h-3 w-3 mr-1" />
        Pendente
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie usuários, prestadores e monitore métricas da plataforma</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{metrics.thisMonthSignups} este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prestadores</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalProviders}</div>
              <p className="text-xs text-muted-foreground">{metrics.approvedProviders} aprovados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalClients}</div>
              <p className="text-xs text-muted-foreground">Usuários ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{metrics.pendingProviders}</div>
              <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="providers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Prestadores
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestão de Prestadores</CardTitle>
                    <CardDescription>Aprove ou rejeite novos prestadores de serviços</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar prestadores..."
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
                      <TableHead>Prestador</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProviders.map((provider) => (
                      <TableRow key={provider.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={provider.photo || "/placeholder.svg"} alt={provider.name} />
                              <AvatarFallback>
                                {provider.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{provider.name}</div>
                              <div className="text-sm text-muted-foreground">{provider.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{provider.service}</TableCell>
                        <TableCell>{provider.city}</TableCell>
                        <TableCell>{getStatusBadge(provider.approved)}</TableCell>
                        <TableCell>{new Date(provider.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedProvider(provider)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Detalhes do Prestador</DialogTitle>
                                  <DialogDescription>Informações completas do prestador de serviços</DialogDescription>
                                </DialogHeader>
                                {selectedProvider && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                      <Avatar className="h-16 w-16">
                                        <AvatarImage
                                          src={selectedProvider.photo || "/placeholder.svg"}
                                          alt={selectedProvider.name}
                                        />
                                        <AvatarFallback>
                                          {selectedProvider.name
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h3 className="text-lg font-semibold">{selectedProvider.name}</h3>
                                        <p className="text-muted-foreground">{selectedProvider.service}</p>
                                        <p className="text-sm text-muted-foreground">{selectedProvider.city}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <p className="text-sm text-muted-foreground">{selectedProvider.email}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Telefone</label>
                                        <p className="text-sm text-muted-foreground">{selectedProvider.phone}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Descrição</label>
                                      <p className="text-sm text-muted-foreground">{selectedProvider.description}</p>
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  {selectedProvider && !selectedProvider.approved && (
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => handleApproveProvider(selectedProvider.id, false)}
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Rejeitar
                                      </Button>
                                      <Button onClick={() => handleApproveProvider(selectedProvider.id, true)}>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Aprovar
                                      </Button>
                                    </div>
                                  )}
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            {!provider.approved && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApproveProvider(provider.id, false)}
                                >
                                  <XCircle className="h-4 w-4 text-red-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApproveProvider(provider.id, true)}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Usuários Cadastrados</CardTitle>
                    <CardDescription>Lista de todos os usuários da plataforma</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar usuários..."
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
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crescimento de Usuários</CardTitle>
                  <CardDescription>Novos cadastros nos últimos meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Janeiro 2024</span>
                      <span className="font-medium">89 novos usuários</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dezembro 2023</span>
                      <span className="font-medium">76 novos usuários</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Novembro 2023</span>
                      <span className="font-medium">92 novos usuários</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Tipo</CardTitle>
                  <CardDescription>Proporção de clientes vs prestadores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Clientes</span>
                      <span className="font-medium">{metrics.totalClients} (58%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Prestadores</span>
                      <span className="font-medium">{metrics.totalProviders} (42%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Serviços Mais Procurados</CardTitle>
                  <CardDescription>Categorias com mais prestadores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Eletricista</span>
                      <span className="font-medium">89 prestadores</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Designer</span>
                      <span className="font-medium">76 prestadores</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fotógrafo</span>
                      <span className="font-medium">64 prestadores</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status da Plataforma</CardTitle>
                  <CardDescription>Indicadores de saúde do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Taxa de aprovação</span>
                      <span className="font-medium text-green-600">96.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tempo médio de aprovação</span>
                      <span className="font-medium">2.3 dias</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Satisfação média</span>
                      <span className="font-medium">4.7/5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
