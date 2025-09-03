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
  Lock,
} from "lucide-react"
import { ProfileTab } from "./components/profile-tab"
import { RequestsTab } from "./components/requests-tab"

export default function DashboardPage() {
  const { user } = useAuth()


  // AI Tools state
  const [aiPrompt, setAiPrompt] = useState("")
  const [generatedText, setGeneratedText] = useState("")
  const [generatedImage, setGeneratedImage] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

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
📞 Orçamento gratuito: TESTE

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel do Prestador</h1>
          <p className="text-muted-foreground">Gerencie seu perfil, pedidos e ferramentas de marketing</p>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests" className="flex items-center gap-2">
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

          <TabsContent value="requests" className="space-y-6">
            <RequestsTab />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <ProfileTab userId={user?.id!} providerId={user?.provider?.id!} />
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
                  <Button disabled={true} onClick={handleGenerateText} /* disabled={aiLoading || !aiPrompt.trim()} */ className="w-full">
                    {aiLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                 {/*        <Wand2 className="mr-2 h-4 w-4" /> */}
                        <Lock/>
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
                  <Button onClick={handleGenerateImage} disabled={true} /* disabled={aiLoading} */ className="w-full">
                    {aiLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        {/* <ImageIcon className="mr-2 h-4 w-4" /> */}
                        <Lock/>
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

  // Mock orders data
 /*  const orders = [
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
  ] */


  /*   {
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
    } */