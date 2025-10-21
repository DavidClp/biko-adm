"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { useRecommendations } from "@/hooks/use-recommendations"
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
  Building2,
  Gift,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { ServicesMultiSelect } from "@/components/services-multi-select"
import { CitiesSelector } from "@/components/cities-selector"

const registerProviderSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  business_name: z.string().optional(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
  services: z.array(z.string()).min(1, "Selecione pelo menos um serviço"),
  city: z.string().min(1, "Selecione uma cidade"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 caracteres"),
  recommendationCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type RegisterProviderFormData = z.infer<typeof registerProviderSchema>

export default function RegisterProviderPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [error, setError] = useState("")
  const [recommendationCode, setRecommendationCode] = useState("")
  const [recommendationUser, setRecommendationUser] = useState<any>(null)
  const [isValidatingCode, setIsValidatingCode] = useState(false)
  const { registerProvider, loading } = useAuth()
  const { getUserByRecommendationCode } = useRecommendations()
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterProviderFormData>({
    resolver: zodResolver(registerProviderSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      services: [],
      city: "",
      business_name: "",
      description: "",
      phone: "",
      recommendationCode: "",
    },
  })

  useEffect(() => {
    setValue("services", selectedServices)
  }, [selectedServices, setValue])

  // Captura o código de recomendação da URL
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      setRecommendationCode(code)
      setValue("recommendationCode", code)
      validateRecommendationCode(code)
    }
  }, [searchParams, setValue])

  const validateRecommendationCode = async (code: string) => {
    if (!code.trim()) return

    setIsValidatingCode(true)
    try {
      const user = await getUserByRecommendationCode(code)
      if (user) {
        setRecommendationUser(user)
      }
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setIsValidatingCode(false)
    }
  }

  const onSubmit = async (data: RegisterProviderFormData) => {
    setError("")

    try {
      await registerProvider({
        name: data.name,
        email: data.email,
        password: data.password,
        services: data.services,
        city: data.city,
        description: data.description,
        phone: data.phone,
        business_name: data.business_name || "",
        recommendationCode: data.recommendationCode || "",
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                        type="text"
                        placeholder="Seu nome completo"
                        disabled={loading}
                        className={`pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 ${errors.name ? "border-destructive" : ""
                          }`}
                        {...register("name")}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

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
                        disabled={loading}
                        className={`pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 ${errors.email ? "border-destructive" : ""
                          }`}
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
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
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        disabled={loading}
                        className={`pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 ${errors.password ? "border-destructive" : ""
                          }`}
                        {...register("password")}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      Confirmar senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Digite a senha novamente"
                        disabled={loading}
                        className={`pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 ${errors.confirmPassword ? "border-destructive" : ""
                          }`}
                        {...register("confirmPassword")}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Seção de Código de Recomendação */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <Gift className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Código de Recomendação <span className="text-sm font-normal text-muted-foreground">(opcional)</span>
                  </h3>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="recommendationCode" className="text-sm font-medium text-foreground">
                    Código de recomendação
                  </Label>
                  <div className="relative">
                    <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="recommendationCode"
                      type="text"
                      placeholder="Digite o código de recomendação"
                      disabled={loading || isValidatingCode}
                      value={recommendationCode}
                      onChange={(e) => {
                        setRecommendationCode(e.target.value)
                        setValue("recommendationCode", e.target.value)
                        if (e.target.value.trim()) {
                          validateRecommendationCode(e.target.value)
                        } else {
                          setRecommendationUser(null)
                        }
                      }}
                      className={`pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 ${errors.recommendationCode ? "border-destructive" : ""
                        }`}
                    />
                    {isValidatingCode && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  {errors.recommendationCode && (
                    <p className="text-sm text-destructive">{errors.recommendationCode.message}</p>
                  )}

                  {/* Feedback do código de recomendação */}
                  {recommendationCode && !isValidatingCode && (
                    <div className="mt-2">
                      {recommendationUser ? (
                        <Alert className="border-green-200 bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            <strong>Código válido!</strong> Você foi recomendado por: {recommendationUser.email}
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert variant="destructive" className="border-red-200 bg-red-50">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            Código de recomendação inválido ou não encontrado.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Dados profissionais</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      Nome da empresa/fantasia
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Nome fantasia"
                        disabled={loading}
                        className={`pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 ${errors.name ? "border-destructive" : ""
                          }`}
                        {...register("business_name")}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      WhatsApp
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        disabled={loading}
                        className={`pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 ${errors.phone ? "border-destructive" : ""
                          }`}
                        {...register("phone")}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
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
                        classNameInput={`min-h-12 border-border/50 ${errors.services ? "border-destructive" : ""
                          }`}
                      />
                    </div>
                    {errors.services && (
                      <p className="text-sm text-destructive">{errors.services.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="city" className="text-sm font-medium text-foreground">
                      Cidade
                    </Label>
                    <div>
                      <CitiesSelector
                        classNameInput={`min-h-12 border-border/50 ${errors.city ? "border-destructive" : ""
                          }`}
                        onCitySelect={(cityId) => setValue("city", cityId)}
                      />
                    </div>
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
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
                      placeholder="Descreva seus serviços, experiência e diferenciais..."
                      disabled={loading}
                      rows={4}
                      className={`pl-10 pt-3 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 resize-none ${errors.description ? "border-destructive" : ""
                        }`}
                      {...register("description")}
                    />
                  </div>
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
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
