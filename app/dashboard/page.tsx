"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { useAuth } from "@/hooks/use-auth"
import { useRequireAuth } from "@/hooks/use-auth-redirect"
import { useProvider } from "@/hooks/use-provider"
import { useToast } from "@/hooks/use-toast"
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
  UserRoundPen,
  Camera,
} from "lucide-react"
import { ProfileTab } from "./components/profile-tab"
import { RequestsTab } from "./components/requests-tab"
import { SubscriptionsTab } from "./components/subscriptions-tab"
import { LuMessageCircleMore } from "react-icons/lu";
import { SettingsTab } from "./components/settings-tab"
import { PhotoManagement } from "@/components/photo-management"
import { useSubscriptions } from "@/hooks/use-subscriptions"

export default function DashboardPage() {
  const { user } = useAuth();
  const { subscription } = useSubscriptions();

  const searchParams = useSearchParams()

  useRequireAuth("/login")

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

  // Estado para controlar qual aba está ativa
  const [activeTab, setActiveTab] = useState("requests")

  useEffect(() => {
    // Verifica se há parâmetro 'tab' na URL
    const tabParam = searchParams.get('tab')

    if (tabParam === 'subscriptions') {
      setActiveTab('subscriptions')
    } else if (tabParam === 'profile') {
      setActiveTab('profile')
    } else if (tabParam === 'photos') {
      setActiveTab('photos')
    } else if (tabParam === 'settings') {
      setActiveTab('settings')
    } else {
      setActiveTab('requests')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-4 md:mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel do Prestador</h1>
          <p className="text-muted-foreground">Gerencie seu perfil, pedidos e assinatura</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <LuMessageCircleMore className="h-7 w-7" />
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserRoundPen className="h-7 w-7" />
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera className="h-7 w-7" />
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Star className="h-7 w-7" />
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            <RequestsTab />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <ProfileTab userId={user?.id!} providerId={user?.provider?.id!} />
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <PhotoManagement 
              providerId={user?.provider?.id!} 
              maxPhotos={subscription?.plans?.name?.toUpperCase()?.includes('PRESTADOR') ? 5 : subscription?.plans?.name?.toUpperCase()?.includes('PROFISSIONAL+') ? 10 : 1}
              planName={subscription?.plans?.name || 'GRATIS'}
            />
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <SubscriptionsTab />
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
                        <Lock />
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
                        <Lock />
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
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}