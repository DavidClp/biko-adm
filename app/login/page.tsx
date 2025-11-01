"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { useRedirectIfAuthenticated } from "@/hooks/use-auth-redirect"
import { Loader2, ArrowLeft, Mail, Lock } from "lucide-react"
import { UserRole } from "@/lib/types"
import { api } from "@/lib/api"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false)
  const [forgotPasswordError, setForgotPasswordError] = useState("")
  const { login, loading, user, routerBeforeLogin, setRouterBeforeLogin } = useAuth()
  const router = useRouter()

  // Redirecionar se já estiver autenticado
  useRedirectIfAuthenticated("/dashboard")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(email, password)

    } catch (err) {
      setError("Email ou senha incorretos. Tente novamente.")
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotPasswordError("")
    setForgotPasswordSuccess(false)
    setForgotPasswordLoading(true)

    try {
      await api.post("/password-recovery/request", {
        email: forgotPasswordEmail,
      })
      setForgotPasswordSuccess(true)
      setForgotPasswordEmail("")
    } catch (err: any) {
      setForgotPasswordError(
        err?.response?.data?.error || "Erro ao enviar email. Tente novamente."
      )
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === UserRole.PROVIDER) {
      router.push("/dashboard")
    } else if (user?.role === UserRole.CLIENT) {
      if (routerBeforeLogin) {
        router.push(routerBeforeLogin)
      } else {
        router.push("/providers")
      }
    } else if (user?.role === UserRole.ADMIN) {
      router.push("/admin")
    }
  }, [user?.role, routerBeforeLogin, setRouterBeforeLogin])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/20 to-accent/5">
      <div className="p-0 sm:p-6">
        <Link href="/">
          <Button variant="ghost" className="hover:bg-accent/10 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4 pt-4">
            <div className="mx-auto w-16 h-16 flex items-center justify-center">
              <div className="w-15 h-15 flex items-center justify-center mb-4">
                <Image src="/logo.svg" alt="Biko" width={50} height={50} style={{ width: "auto", height: "auto" }} className="max-w-full max-h-full" />
              </div>
            </div>

            <CardDescription className="text-base text-muted-foreground">
              Entre na sua conta para acessar a plataforma
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Senha
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/30">
              <p className="text-sm text-muted-foreground mt-[-10px] text-center mb-4">Não tem uma conta?</p>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/register-client" className="block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-10 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all duration-200 bg-transparent"
                  >
                    Sou Cliente
                  </Button>
                </Link>
                <Link href="/register-provider" className="block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-10 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all duration-200 bg-transparent"
                  >
                    Sou Prestador
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de recuperação de senha */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recuperar Senha</DialogTitle>
            <DialogDescription>
              Digite seu email para receber um link de recuperação de senha.
            </DialogDescription>
          </DialogHeader>

          {forgotPasswordSuccess ? (
            <div className="space-y-4">
              <Alert className="border-green-500/20 bg-green-500/5">
                <AlertDescription className="text-sm text-green-600 dark:text-green-400">
                  Email enviado com sucesso! Verifique sua caixa de entrada.
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => {
                  setShowForgotPassword(false)
                  setForgotPasswordSuccess(false)
                }}
                className="w-full"
              >
                Fechar
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {forgotPasswordError && (
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                  <AlertDescription className="text-sm">
                    {forgotPasswordError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                    disabled={forgotPasswordLoading}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForgotPassword(false)}
                  disabled={forgotPasswordLoading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="flex-1"
                >
                  {forgotPasswordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
