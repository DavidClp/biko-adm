"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useRecommendations } from "@/hooks/use-recommendations"
import { useAuth } from "@/hooks/use-auth"
import {
  Copy,
  Users,
  Gift,
  CheckCircle,
  Loader2,
  ExternalLink
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Recommendation {
  id: string;
  giverId: string;
  receiverId: string;
  createdAt: string;
  giver: {
    id: string;
    email: string;
    role: string;
    recommendation_code: string | null;
  };
  receiver: {
    id: string;
    email: string;
    role: string;
    recommendation_code: string | null;
  };
}

export function ProviderRecommendationsTab() {
  const { user, refreshUser } = useAuth()
  const {
    isLoading,
    generateRecommendationCode,
    getUserRecommendations
  } = useRecommendations()

  const [cpf, setCpf] = useState("")
  const [pixKey, setPixKey] = useState("")
  const [recommendationCode, setRecommendationCode] = useState<string | null>(null)
  const [myRecommendations, setMyRecommendations] = useState<Recommendation[]>([])
  const [activeTab, setActiveTab] = useState<'generate' | 'my-recommendations'>('generate')

  useEffect(() => {
    // Atualiza os dados do usuário para garantir que temos as informações mais recentes
    const loadUserData = async () => {
      await refreshUser()
    }

    loadUserData()
  }, [])

  useEffect(() => {
    // Carrega o código existente do usuário após refreshUser
    if ((user as any)?.recommendation_code) {
      setRecommendationCode((user as any).recommendation_code)
    }
    if ((user as any)?.cpf) {
      setCpf((user as any).cpf)
    }
    if ((user as any)?.pix_key) {
      setPixKey((user as any).pix_key)
    }

    // Carrega as recomendações
    loadRecommendations()
  }, [user])

  const loadRecommendations = async () => {
    const myRecs = await getUserRecommendations()
    setMyRecommendations(myRecs)
  }

  const handleGenerateCode = async () => {
    // Verifica se já existe um código
    if ((user as any)?.recommendation_code) {
      toast({
        title: "Código já existe",
        description: "Você já possui um código de recomendação. Não é possível gerar um novo.",
        variant: "destructive"
      })
      return
    }

    if (!cpf.trim() || !pixKey.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "CPF e chave PIX são obrigatórios",
        variant: "destructive"
      })
      return
    }

    try {
      const result = await generateRecommendationCode({
        cpf: cpf.replace(/\D/g, ''),
        pixKey: pixKey.trim()
      })

      setRecommendationCode(result.recommendation_code)
      setCpf(result.cpf)
      setPixKey(result.pix_key)

      // Atualiza os dados do usuário após gerar o código
      await refreshUser()

      toast({
        title: "Sucesso!",
        description: "Código de recomendação gerado com sucesso"
      })
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const handleCopyCode = () => {
    if (recommendationCode) {
      navigator.clipboard.writeText(recommendationCode)
      toast({
        title: "Copiado!",
        description: "Código copiado para a área de transferência"
      })
    }
  }

  const handleCopyLink = () => {
    if (recommendationCode) {
      const link = `${window.location.origin}/register-provider?code=${recommendationCode}`
      navigator.clipboard.writeText(link)
      toast({
        title: "Link copiado!",
        description: "Link de recomendação copiado para a área de transferência"
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRecommendationLink = (code: string) => {
    return `${window.location.origin}/register-provider?code=${code}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Gift className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Sistema de Recomendações</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant={activeTab === 'generate' ? 'default' : 'outline'}
          onClick={() => setActiveTab('generate')}
          className="flex items-center gap-2"
        >
          <Gift className="h-4 w-4" />
          Gerar Código
        </Button>
        <Button
          variant={activeTab === 'my-recommendations' ? 'default' : 'outline'}
          onClick={() => setActiveTab('my-recommendations')}
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Minhas Recomendações ({myRecommendations.length})
        </Button>
      </div>

      {/* Tab: Gerar Código */}
      {activeTab === 'generate' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Gerar Código de Recomendação
              </CardTitle>
              <CardDescription>
                Gere seu código único para recomendar novos prestadores e ganhe benefícios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              {!(user as any)?.recommendation_code && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        disabled={!!(user as any)?.recommendation_code}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pixKey">Chave PIX *</Label>
                      <Input
                        id="pixKey"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        placeholder="usuario@email.com"
                        disabled={!!(user as any)?.recommendation_code}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateCode}
                    disabled={isLoading || !cpf.trim() || !pixKey.trim() || !!(user as any)?.recommendation_code}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (user as any)?.recommendation_code ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Código já gerado
                      </>
                    ) : (
                      <>
                        <Gift className="h-4 w-4 mr-2" />
                        Gerar Código
                      </>
                    )}
                  </Button>
                </>
              )}

              {(user as any)?.recommendation_code && (
                <Alert className="border-blue-200 bg-blue-50">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Código já gerado!</strong> Você já possui um código de recomendação. Use o código abaixo para compartilhar.
                  </AlertDescription>
                </Alert>
              )}

              {recommendationCode && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <div>
                        <strong>Seu código de recomendação:</strong>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="font-mono text-lg">
                            {recommendationCode}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={handleCopyCode}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <strong>Link para compartilhar:</strong>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm bg-muted px-2 py-1 rounded flex-1">
                            {getRecommendationLink(recommendationCode)}
                          </code>
                          <Button size="sm" variant="outline" onClick={handleCopyLink}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(getRecommendationLink(recommendationCode), '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Minhas Recomendações */}
      {activeTab === 'my-recommendations' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Prestadores que você recomendou
              </CardTitle>
              <CardDescription>
                Lista de prestadores que se cadastraram usando seu código
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myRecommendations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Você ainda não recomendou nenhum prestador</p>
                  <p className="text-sm">Compartilhe seu código para começar a recomendar!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRecommendations.map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{rec.receiver.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Recomendado em {formatDate(rec.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ativo
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
