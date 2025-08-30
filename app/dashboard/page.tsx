"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { useAuth } from "@/hooks/use-auth"
import {
  User,
  Settings,
  MessageSquare,
  Wand2,
  ImageIcon,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Profile editing state
  const [profileData, setProfileData] = useState({
    name: "João Silva",
    service: "Eletricista",
    city: "São Paulo",
    description:
      "Eletricista com mais de 10 anos de experiência em instalações residenciais e comerciais. Especializado em sistemas elétricos modernos, automação residencial e manutenção preventiva.",
    phone: "(11) 99999-9999",
    instagram: "@joaoeletricista",
    facebook: "facebook.com/joaoeletricista",
    linkedin: "linkedin.com/in/joaosilva",
  })

  // AI Tools state
  const [aiPrompt, setAiPrompt] = useState("")
  const [generatedText, setGeneratedText] = useState("")
  const [generatedImage, setGeneratedImage] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  // Loading states
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  // Messaging state for internal chat system
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, any[]>>({
    "1": [
      {
        id: "1",
        sender: "client",
        senderName: "Maria Santos",
        message:
          "Olá! Preciso instalar pontos de energia em uma sala comercial de 50m². Quando você poderia fazer uma visita técnica?",
        timestamp: "2024-01-20 14:30",
        type: "text",
      },
      {
        id: "2",
        sender: "provider",
        senderName: "João Silva",
        message: "Olá Maria! Posso fazer a visita técnica amanhã pela manhã. Qual o endereço?",
        timestamp: "2024-01-20 15:45",
        type: "text",
      },
    ],
    "2": [
      {
        id: "3",
        sender: "client",
        senderName: "Carlos Oliveira",
        message: "Urgente! O disjuntor principal está desarmando constantemente. Preciso de reparo hoje se possível.",
        timestamp: "2024-01-18 09:15",
        type: "text",
      },
    ],
  })
  const [newMessage, setNewMessage] = useState("")

  // Mock orders data
  const orders = [
    {
      id: "1",
      clientName: "Maria Santos",
      service: "Instalação elétrica",
      description: "Preciso instalar pontos de energia em uma sala comercial",
      status: "pending",
      date: "2024-01-20",
      budget: "R$ 800,00",
    },
    {
      id: "2",
      clientName: "Carlos Oliveira",
      service: "Manutenção elétrica",
      description: "Problema no disjuntor principal, precisa de reparo urgente",
      status: "accepted",
      date: "2024-01-18",
      budget: "R$ 350,00",
    },
    {
      id: "3",
      clientName: "Ana Costa",
      service: "Automação residencial",
      description: "Instalação de sistema de automação para iluminação",
      status: "completed",
      date: "2024-01-15",
      budget: "R$ 1.200,00",
    },
  ]

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleGenerateText = async () => {
    if (!aiPrompt.trim()) return

    setAiLoading(true)
    try {
      // Simulate AI text generation
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const mockResponse = `🔌 Transforme sua casa com instalações elétricas seguras e modernas! 

✨ Mais de 10 anos de experiência
⚡ Atendimento rápido e confiável  
🏠 Especialista em automação residencial
📞 Orçamento gratuito: ${profileData.phone}

#eletricista #saopaulo #automacao #seguranca #qualidade`

      setGeneratedText(mockResponse)
    } catch (error) {
      console.error("Error generating text:", error)
    } finally {
      setAiLoading(false)
    }
  }

  const handleGenerateImage = async () => {
    setAiLoading(true)
    try {
      // Simulate AI image generation
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setGeneratedImage("/professional-electrician-working.png")
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setAiLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aceito
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Star className="h-3 w-3 mr-1" />
            Concluído
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Function to handle sending messages in internal chat
  const handleSendMessage = (orderId: string) => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      sender: "provider",
      senderName: profileData.name,
      message: newMessage,
      timestamp: new Date().toLocaleString("pt-BR"),
      type: "text",
    }

    setMessages((prev) => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), message],
    }))
    setNewMessage("")
  }

  // Function to handle order status changes
  const handleOrderAction = (orderId: string, action: "accept" | "reject") => {
    // Simulate API call to update order status
    console.log(`Order ${orderId} ${action}ed`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel do Prestador</h1>
          <p className="text-muted-foreground">Gerencie seu perfil, pedidos e ferramentas de marketing</p>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Mensagens
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="ai-tools" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              IA Tools
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Orders List */}
              <Card>
                <CardHeader>
                  <CardTitle>Solicitações de Orçamento</CardTitle>
                  <CardDescription>Clique em uma solicitação para ver a conversa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <Card
                        key={order.id}
                        className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedOrder === order.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setSelectedOrder(order.id)}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-sm">{order.clientName}</h3>
                              <p className="text-xs text-muted-foreground">{order.service}</p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(order.status)}
                              <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{order.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-primary">{order.budget}</span>
                            {messages[order.id] && (
                              <Badge variant="secondary" className="text-xs">
                                {messages[order.id].length} mensagens
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chat Interface */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>
                    {selectedOrder
                      ? `Conversa com ${orders.find((o) => o.id === selectedOrder)?.clientName}`
                      : "Selecione uma solicitação"}
                  </CardTitle>
                  {selectedOrder && (
                    <CardDescription>
                      {orders.find((o) => o.id === selectedOrder)?.service} -{" "}
                      {orders.find((o) => o.id === selectedOrder)?.budget}
                    </CardDescription>
                  )}
                </CardHeader>

                {selectedOrder ? (
                  <>
                    <CardContent className="flex-1 max-h-96 overflow-y-auto">
                      <div className="space-y-4">
                        {messages[selectedOrder]?.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === "provider" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.sender === "provider" ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.message}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.sender === "provider" ? "text-primary-foreground/70" : "text-muted-foreground"
                                }`}
                              >
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <div className="p-4 border-t">
                      {orders.find((o) => o.id === selectedOrder)?.status === "pending" && (
                        <div className="flex gap-2 mb-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOrderAction(selectedOrder, "reject")}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Recusar
                          </Button>
                          <Button size="sm" onClick={() => handleOrderAction(selectedOrder, "accept")}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aceitar
                          </Button>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage(selectedOrder)}
                        />
                        <Button onClick={() => handleSendMessage(selectedOrder)}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <CardContent className="flex-1 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Selecione uma solicitação para iniciar a conversa</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Editar perfil</CardTitle>
                <CardDescription>Mantenha suas informações sempre atualizadas</CardDescription>
              </CardHeader>
              <CardContent>
                {profileSuccess && (
                  <Alert className="mb-6 bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">Perfil atualizado com sucesso!</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={profileLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Serviço</Label>
                      <Input
                        id="service"
                        value={profileData.service}
                        onChange={(e) => setProfileData({ ...profileData, service: e.target.value })}
                        disabled={profileLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        disabled={profileLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">WhatsApp</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={profileLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição dos serviços</Label>
                    <Textarea
                      id="description"
                      value={profileData.description}
                      onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                      disabled={profileLoading}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Redes sociais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          value={profileData.instagram}
                          onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                          disabled={profileLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          value={profileData.facebook}
                          onChange={(e) => setProfileData({ ...profileData, facebook: e.target.value })}
                          disabled={profileLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={profileData.linkedin}
                          onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                          disabled={profileLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={profileLoading}>
                    {profileLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar alterações"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tools Tab */}
          <TabsContent value="ai-tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Text Generation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    Gerador de Legendas
                  </CardTitle>
                  <CardDescription>Crie legendas profissionais para suas redes sociais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-prompt">Descreva o que você quer promover</Label>
                    <Textarea
                      id="ai-prompt"
                      placeholder="Ex: Promoção de instalação elétrica residencial, destaque para segurança e qualidade..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleGenerateText} disabled={aiLoading || !aiPrompt.trim()} className="w-full">
                    {aiLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Gerar Legenda
                      </>
                    )}
                  </Button>

                  {generatedText && (
                    <div className="space-y-2">
                      <Label>Legenda gerada</Label>
                      <div className="p-4 bg-muted rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm">{generatedText}</pre>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(generatedText)}>
                        Copiar texto
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Image Generation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Gerador de Imagens
                  </CardTitle>
                  <CardDescription>Crie imagens profissionais para seu marketing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleGenerateImage} disabled={aiLoading} className="w-full">
                    {aiLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Gerar Imagem Profissional
                      </>
                    )}
                  </Button>

                  {generatedImage && (
                    <div className="space-y-2">
                      <Label>Imagem gerada</Label>
                      <div className="border rounded-lg overflow-hidden">
                        <img
                          src={generatedImage || "/placeholder.svg"}
                          alt="Imagem gerada por IA"
                          className="w-full h-auto"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        Baixar imagem
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dicas de uso</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use o gerador de legendas para criar posts promocionais regulares</li>
                  <li>• As imagens geradas são ideais para stories e posts no Instagram</li>
                  <li>• Personalize sempre o conteúdo gerado com sua identidade visual</li>
                  <li>• Mantenha consistência na comunicação da sua marca</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da conta</CardTitle>
                <CardDescription>Gerencie suas preferências e configurações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notificações</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Novos pedidos</p>
                        <p className="text-sm text-muted-foreground">Receba notificações de novos pedidos</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ativado
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Avaliações</p>
                        <p className="text-sm text-muted-foreground">Notificações de novas avaliações</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ativado
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Privacidade</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Perfil público</p>
                        <p className="text-sm text-muted-foreground">Seu perfil aparece nas buscas</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ativado
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button variant="destructive">Excluir conta</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
