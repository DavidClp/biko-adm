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
import { useAuth } from "@/hooks/use-auth"
import { Loader2, ArrowLeft, Mail, Lock } from "lucide-react"
import { UserRole } from "@/lib/types"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, loading, user, routerBeforeLogin, setRouterBeforeLogin } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(email, password)

    } catch (err) {
      setError("Email ou senha incorretos. Tente novamente.")
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
      <div className="p-6">
        <Link href="/">
          <Button variant="ghost" className="hover:bg-accent/10 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">L</span>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-primary mb-2">Biko</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Entre na sua conta para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
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

              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Senha
                </Label>
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

            <div className="mt-8 pt-6 border-t border-border/30">
              <p className="text-sm text-muted-foreground text-center mb-4">Não tem uma conta?</p>
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
    </div>
  )
}
