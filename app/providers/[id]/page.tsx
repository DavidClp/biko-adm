"use client"

import { useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { ArrowLeft, MapPin, Star, MessageCircle, Instagram, Facebook, Linkedin, Send, Briefcase, FileText, Clock, DollarSign, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProvider } from "@/hooks/use-provider"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function ProviderProfilePage() {
  const params = useParams()
  const providerId = params.id as string
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(0)
  const [contactForm, setContactForm] = useState({
    serviceType: "",
    description: "",
    urgency: "urgent",
    budget: "",
    location: "",
  })
  const searchParams = useSearchParams()
  const [isContactModalOpen, setIsContactModalOpen] = useState(searchParams.get("isContactModalOpen") === "true")
  const [isContactSent, setIsContactSent] = useState(false)

  // Usar o hook useProvider para buscar os dados
  const { data: provider, isLoading, error, refetch } = useProvider(providerId)

  const urgencyOptions = [
    { value: "urgent", label: "Urgente" },
    { value: "next_7_days", label: "Proximos 7 dias" },
    { value: "next_15_days", label: "Proximos 15 dias" },
    { value: "next_30_days", label: "Proximos 30 dias" },
    { value: "no_date_defined", label: "Não tenho data definida" },
  ]

  const handleSendContact = () => {
    console.log("Contact request sent:", contactForm)
    setIsContactSent(true)
    setTimeout(() => {
      setIsContactModalOpen(false)
      setIsContactSent(false)
      setContactForm({
        serviceType: "",
        description: "",
        urgency: "urgent",
        budget: "",
        location: "",
      })
    }, 2000)
  }

  const handleSubmitReview = () => {
    console.log("Review submitted:", { rating, comment: review })
    setReview("")
    setRating(0)
  }

  const renderStars = (currentRating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${star <= currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onStarClick?.(star)}
          />
        ))}
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <LoadingSpinner className="mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando perfil do profissional...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">!</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Erro ao carregar perfil</h2>
              <p className="text-muted-foreground mb-4">
                Não foi possível carregar o perfil do profissional.
              </p>
              <div className="space-x-2">
                <Button onClick={() => refetch()} variant="outline">
                  Tentar novamente
                </Button>
                <Link href="/providers">
                  <Button variant="default">
                    Voltar para busca
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Se não há provider, mostrar erro
  if (!provider) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-600 text-2xl">?</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Profissional não encontrado</h2>
              <p className="text-muted-foreground mb-4">
                O profissional que você está procurando não foi encontrado.
              </p>
              <Link href="/providers">
                <Button variant="default">
                  Voltar para busca
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6">
          <Link href="/providers">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para busca
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Provider Info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto sm:mx-0">
                    <AvatarImage src={provider.photoUrl || "/placeholder.svg"} alt={provider.name} />
                    <AvatarFallback className="text-xl sm:text-2xl">
                      {provider.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <CardTitle className="text-xl sm:text-2xl mb-2">{provider.name}</CardTitle>
                    <Badge variant="secondary" className="mb-3 text-sm">
                      {provider.services?.join(", ") || "Serviços"}
                    </Badge>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                      <div className="flex items-center justify-center sm:justify-start gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground text-sm sm:text-base">{provider.location}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        {renderStars(provider.rating || 0)}
                        <span className="font-medium text-sm sm:text-base">{provider.rating || 0}</span>
                        <span className="text-muted-foreground text-sm">({provider.reviews || 0} avaliações)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <h3 className="font-semibold mb-3 text-base sm:text-lg">Sobre o profissional</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{provider.description}</p>
              </CardContent>
            </Card>

            {/* Reviews - Placeholder para quando implementar reviews */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Avaliações dos clientes</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground">
                    Este profissional ainda não possui avaliações. Seja o primeiro a avaliar!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Add Review */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Deixe sua avaliação</CardTitle>
                <CardDescription className="text-sm sm:text-base">Já contratou este profissional? Compartilhe sua experiência</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                <div>
                  <Label className="mb-2 block text-sm sm:text-base">Sua avaliação</Label>
                  <div className="flex justify-center sm:justify-start">
                    {renderStars(rating, true, setRating)}
                  </div>
                </div>
                <div>
                  <Label htmlFor="review" className="text-sm sm:text-base">Comentário (opcional)</Label>
                  <Textarea
                    id="review"
                    placeholder="Conte como foi sua experiência..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={3}
                    className="text-sm sm:text-base"
                  />
                </div>
                <Button onClick={handleSubmitReview} disabled={rating === 0} className="w-full sm:w-auto">
                  Enviar avaliação
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Contato</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Solicitar Orçamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="text-center pb-4 sm:pb-6">
                      <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                          <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                        </div>
                      </div>
                      <DialogTitle className="text-xl sm:text-2xl font-bold text-primary">Solicitar Orçamento</DialogTitle>
                      <DialogDescription className="text-sm sm:text-base text-muted-foreground px-2">
                        Descreva o serviço que você precisa e {provider.name} entrará em contato com você.
                      </DialogDescription>
                    </DialogHeader>

                    {!isContactSent ? (
                      <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-2 sm:space-y-3">
                          <Label htmlFor="serviceType" className="text-sm font-medium text-foreground">
                            Tipo de serviço
                          </Label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="serviceType"
                              placeholder="Ex: Instalação elétrica, reparo..."
                              value={contactForm.serviceType}
                              onChange={(e) => setContactForm({ ...contactForm, serviceType: e.target.value })}
                              className="pl-10 h-11 sm:h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 text-sm sm:text-base"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                          <Label htmlFor="description" className="text-sm font-medium text-foreground">
                            Descrição detalhada
                          </Label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea
                              id="description"
                              placeholder="Descreva o que você precisa fazer..."
                              rows={3}
                              value={contactForm.description}
                              onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                              className="pl-10 pt-3 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 resize-none text-sm sm:text-base"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor="urgency" className="text-sm font-medium text-foreground">
                              Urgência
                            </Label>
                            <Select
                              value={contactForm.urgency}
                              onValueChange={(value) => setContactForm({ ...contactForm, urgency: value })}
                            >
                              <SelectTrigger  style={{height: '48px'}} className="w-full border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200">
                                <SelectValue placeholder="Selecione a urgência" />
                              </SelectTrigger>
                              <SelectContent>
                                {urgencyOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.value === "urgent" && <Clock className="h-4 w-4 mr-2 text-red-500" />}
                                    {option.value === "next_7_days" && <Clock className="h-4 w-4 mr-2 text-orange-500" />}
                                    {option.value === "next_15_days" && <Clock className="h-4 w-4 mr-2 text-yellow-500" />}
                                    {option.value === "next_30_days" && <Clock className="h-4 w-4 mr-2 text-blue-500" />}
                                    {option.value === "no_date_defined" && <Clock className="h-4 w-4 mr-2 text-gray-500" />}
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor="budget" className="text-sm font-medium text-foreground">
                              Orçamento estimado
                            </Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="budget"
                                placeholder="R$ 0,00"
                                value={contactForm.budget}
                                onChange={(e) => setContactForm({ ...contactForm, budget: e.target.value })}
                                className="pl-10 h-11 sm:h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 text-sm sm:text-base"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                          <Label htmlFor="location" className="text-sm font-medium text-foreground">
                            Localização
                          </Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="location"
                              placeholder="Endereço ou região"
                              value={contactForm.location}
                              onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                              className="pl-10 h-11 sm:h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 text-sm sm:text-base"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={handleSendContact}
                          className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium mt-4"
                          disabled={!contactForm.serviceType || !contactForm.description}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Solicitação
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-green-600 text-2xl">✓</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Solicitação enviada!</h3>
                        <p className="text-muted-foreground">
                          {provider.name} recebeu sua solicitação e entrará em contato em breve.
                        </p>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Todas as conversas acontecem dentro da plataforma Listão
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            {(provider.instagram || provider.facebook) && (
              <Card>
                <CardHeader>
                  <CardTitle>Redes sociais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {provider.instagram && (
                    <a
                      href={`https://instagram.com/${provider.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                      <span>{provider.instagram}</span>
                    </a>
                  )}
                  {provider.facebook && (
                    <a
                      href={`https://${provider.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                      <span>Facebook</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Trust Badge */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <div className="font-medium text-green-600 mb-1">Perfil Verificado</div>
                  <div className="text-sm text-muted-foreground">Este prestador foi verificado pela nossa equipe</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
