"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
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
import { ArrowLeft, MapPin, Star, MessageCircle, Instagram, Facebook, Linkedin, Send } from "lucide-react"

export default function ProviderProfilePage() {
  const params = useParams()
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(0)
  const [contactForm, setContactForm] = useState({
    serviceType: "",
    description: "",
    urgency: "normal",
    budget: "",
    location: "",
  })
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isContactSent, setIsContactSent] = useState(false)

  const provider = {
    id: params.id,
    name: "João Silva",
    service: "Eletricista",
    city: "São Paulo",
    description:
      "Eletricista com mais de 10 anos de experiência em instalações residenciais e comerciais. Especializado em sistemas elétricos modernos, automação residencial e manutenção preventiva. Atendo toda a região metropolitana de São Paulo com agilidade e qualidade garantida.",
    phone: "(11) 99999-9999",
    photo: "/professional-electrician.png",
    socialMedia: {
      instagram: "@joaoeletricista",
      facebook: "facebook.com/joaoeletricista",
      linkedin: "linkedin.com/in/joaosilva",
    },
    rating: 4.8,
    reviewCount: 24,
    approved: true,
    reviews: [
      {
        id: "1",
        clientName: "Maria Oliveira",
        rating: 5,
        comment: "Excelente profissional! Resolveu o problema elétrico da minha casa rapidamente e com muito cuidado.",
        date: "2024-01-15",
      },
      {
        id: "2",
        clientName: "Carlos Santos",
        rating: 4,
        comment: "Muito pontual e competente. Recomendo!",
        date: "2024-01-10",
      },
      {
        id: "3",
        clientName: "Ana Costa",
        rating: 5,
        comment:
          "Trabalho impecável na instalação do sistema elétrico do meu escritório. Voltarei a contratar com certeza.",
        date: "2024-01-05",
      },
    ],
  }

  const handleSendContact = () => {
    console.log("Contact request sent:", contactForm)
    setIsContactSent(true)
    setTimeout(() => {
      setIsContactModalOpen(false)
      setIsContactSent(false)
      setContactForm({
        serviceType: "",
        description: "",
        urgency: "normal",
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
            className={`h-5 w-5 ${
              star <= currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onStarClick?.(star)}
          />
        ))}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Provider Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={provider.photo || "/placeholder.svg"} alt={provider.name} />
                    <AvatarFallback className="text-2xl">
                      {provider.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{provider.name}</CardTitle>
                    <Badge variant="secondary" className="mb-3 text-sm">
                      {provider.service}
                    </Badge>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{provider.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(provider.rating)}
                        <span className="font-medium">{provider.rating}</span>
                        <span className="text-muted-foreground">({provider.reviewCount} avaliações)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-3">Sobre o profissional</h3>
                <p className="text-muted-foreground leading-relaxed">{provider.description}</p>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Avaliações dos clientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{review.clientName}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">{renderStars(review.rating)}</div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Add Review */}
            <Card>
              <CardHeader>
                <CardTitle>Deixe sua avaliação</CardTitle>
                <CardDescription>Já contratou este profissional? Compartilhe sua experiência</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">Sua avaliação</Label>
                  {renderStars(rating, true, setRating)}
                </div>
                <div>
                  <Label htmlFor="review">Comentário (opcional)</Label>
                  <Textarea
                    id="review"
                    placeholder="Conte como foi sua experiência..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleSubmitReview} disabled={rating === 0}>
                  Enviar avaliação
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Solicitar Orçamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Solicitar Orçamento</DialogTitle>
                      <DialogDescription>
                        Descreva o serviço que você precisa e {provider.name} entrará em contato com você.
                      </DialogDescription>
                    </DialogHeader>

                    {!isContactSent ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="serviceType">Tipo de serviço</Label>
                          <Input
                            id="serviceType"
                            placeholder="Ex: Instalação elétrica, reparo..."
                            value={contactForm.serviceType}
                            onChange={(e) => setContactForm({ ...contactForm, serviceType: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Descrição detalhada</Label>
                          <Textarea
                            id="description"
                            placeholder="Descreva o que você precisa fazer..."
                            rows={3}
                            value={contactForm.description}
                            onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="urgency">Urgência</Label>
                            <select
                              id="urgency"
                              className="w-full p-2 border rounded-md"
                              value={contactForm.urgency}
                              onChange={(e) => setContactForm({ ...contactForm, urgency: e.target.value })}
                            >
                              <option value="normal">Normal</option>
                              <option value="urgent">Urgente</option>
                              <option value="flexible">Flexível</option>
                            </select>
                          </div>

                          <div>
                            <Label htmlFor="budget">Orçamento estimado</Label>
                            <Input
                              id="budget"
                              placeholder="R$ 0,00"
                              value={contactForm.budget}
                              onChange={(e) => setContactForm({ ...contactForm, budget: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="location">Localização</Label>
                          <Input
                            id="location"
                            placeholder="Endereço ou região"
                            value={contactForm.location}
                            onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                          />
                        </div>

                        <Button
                          onClick={handleSendContact}
                          className="w-full"
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
                    Todas as conversas acontecem dentro da plataforma ListUp
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            {provider.socialMedia && (
              <Card>
                <CardHeader>
                  <CardTitle>Redes sociais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {provider.socialMedia.instagram && (
                    <a
                      href={`https://instagram.com/${provider.socialMedia.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                      <span>{provider.socialMedia.instagram}</span>
                    </a>
                  )}
                  {provider.socialMedia.facebook && (
                    <a
                      href={`https://${provider.socialMedia.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                      <span>Facebook</span>
                    </a>
                  )}
                  {provider.socialMedia.linkedin && (
                    <a
                      href={`https://${provider.socialMedia.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span>LinkedIn</span>
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
