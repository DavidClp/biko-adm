"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import {
  Loader2,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Briefcase,
  MapPin,
  Phone,
  FileText,
} from "lucide-react"
import { ServicesMultiSelect } from "@/components/services-multi-select"
import { CitiesSelector } from "@/components/cities-selector"

export default function RegisterProviderPage() {

  // refatorar um dia para usar react hook form nele também
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  console.log('selectedServisadsdsdsdsdsces', selectedServices)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    services: selectedServices,
    city: "",
    description: "",
    phone: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  })
  const [error, setError] = useState("")
  const { registerProvider, loading } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    console.log(e.target.name, e.target.value)
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    try {
      await registerProvider({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        services: formData.services,
        city: formData.city,
        description: formData.description,
        phone: formData.phone,
      })

      router.push("/dashboard")
    } catch (err) {
      setError("Erro ao criar conta. Verifique os dados e tente novamente.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/20 to-accent/5">
      <div className="pl-6 pt-6">
        <Link href="/">
          <Button variant="ghost" className="hover:bg-accent/10 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <Card className="w-full max-w-2xl shadow-xl border-0 bg-card/80 backdrop-blur-sm gap-4">
          <CardHeader className="text-center pb-3 pt-3">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">Cadastro de Prestador</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Crie seu perfil profissional e comece a receber clientes
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Dados pessoais</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      Nome completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      Confirmar senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Digite a senha novamente"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Dados profissionais</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <Label htmlFor="service" className="text-sm font-medium text-foreground">
                      Serviços oferecidos
                    </Label>
                    <div className="relative">
                      <ServicesMultiSelect
                        selectedServices={selectedServices}
                        onServicesChange={setSelectedServices}
                        classNameInput="min-h-12 border-border/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="city" className="text-sm font-medium text-foreground">
                      Cidade
                    </Label>
                    <div>
                      <CitiesSelector
                        classNameInput="min-h-12 border-border/50"
                        onCitySelect={(cityId) => setFormData(prev => ({ ...prev, city: cityId }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                    WhatsApp
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description" className="text-sm font-medium text-foreground">
                    Descrição dos serviços
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Descreva seus serviços, experiência e diferenciais..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      rows={4}
                      className="pl-10 pt-3 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/*   <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <Instagram className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Redes sociais <span className="text-sm font-normal text-muted-foreground">(opcional)</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-3">
                    <Label htmlFor="instagram" className="text-sm font-medium text-foreground">
                      Instagram
                    </Label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="instagram"
                        name="instagram"
                        type="text"
                        placeholder="@seuusuario"
                        value={formData.instagram}
                        onChange={handleChange}
                        disabled={loading}
                        className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="facebook" className="text-sm font-medium text-foreground">
                      Facebook
                    </Label>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="facebook"
                        name="facebook"
                        type="text"
                        placeholder="facebook.com/seuperfil"
                        value={formData.facebook}
                        onChange={handleChange}
                        disabled={loading}
                        className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="linkedin" className="text-sm font-medium text-foreground">
                      LinkedIn
                    </Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="linkedin"
                        name="linkedin"
                        type="text"
                        placeholder="linkedin.com/in/seuperfil"
                        value={formData.linkedin}
                        onChange={handleChange}
                        disabled={loading}
                        className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div> */}

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando perfil...
                  </>
                ) : (
                  "Criar perfil profissional"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border/30 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
