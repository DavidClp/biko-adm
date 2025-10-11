"use client"

import { useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { ArrowLeft, MapPin, Star, Instagram, Facebook, Linkedin, Loader2, MessageCircle, LogIn } from "lucide-react"
import { useProvider } from "@/hooks/use-provider"
import { useReviews } from "@/hooks/use-reviews"
import { useProviderPhotos } from "@/hooks/use-provider-photos"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ContactModal } from "@/app/providers/components/contact-modal"
import { LoginRequiredModal } from "@/app/providers/components/login-required-modal"
import { PhotoGallery } from "@/components/photo-gallery"
import { useAuth } from "@/hooks/use-auth"
import { UserRole } from "@/lib/types"

export default function ProviderProfilePage() {
  const params = useParams()
  const providerId = params.id as string
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const searchParams = useSearchParams()
  const [isContactModalOpen, setIsContactModalOpen] = useState(searchParams.get("isContactModalOpen") === "true")
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] = useState(searchParams.get("isModalOpen") === "true")

  const { provider, isLoading, error, refetch } = useProvider({
    providerId,
    query: searchParams.get('q') || undefined,
    cityId: searchParams.get('cityId') || undefined,
    services: searchParams.get('services')?.split(',') || undefined
  });
  const { user } = useAuth();
  const router = useRouter();
  const { createReview, isCreating, getReviewsByProvider } = useReviews({
    providerId,
    page: currentPage,
    limit: 5
  });
  const { photos, uploadPhoto, deletePhoto } = useProviderPhotos({ providerId });

  const handleSubmitReview = () => {
    if (!user) {
      setIsLoginRequiredModalOpen(true)
      return
    }

    if (rating === 0) {
      return
    }

    createReview({
      provider_id: providerId,
      review: review.trim() || "Avaliação sem comentário",
      stars: rating
    }, {
      onSuccess: () => {
        setReview("")
        setRating(0)
      }
    })
  }

  const handleOpenContactModal = (open: boolean) => {
    if (!user) {
      setIsLoginRequiredModalOpen(true)
      return
    };

    setIsContactModalOpen(open)
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
            <Card className="space-y-0 gap-0">
              <CardHeader className="p-4 sm:p-6 pb-0">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto sm:mx-0">
                  {provider?.photoUrl && (
                    <Image src={provider?.photoUrl} alt={provider?.name} fill={true} objectFit="cover" />
                  )}
                    <AvatarFallback className="text-xl sm:text-2xl">
                      {provider?.name?.split(" ")?.map((n: string) => n[0])?.join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <CardTitle className="text-xl sm:text-2xl mb-2">{provider?.name}</CardTitle>
                    {provider?.servicesNames?.slice(0, 2)?.map((service, index) => (
                      <Badge key={index} variant="secondary" className="text-xs mb-3 ml-1">
                        {service}
                      </Badge>
                    ))}
                    {provider?.servicesNames?.length > 2 && (
                      <Badge variant="secondary" className="text-xs mb-3">
                        +{provider?.servicesNames?.length - 2}
                      </Badge>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                      <div className="flex items-center justify-center sm:justify-start gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground text-sm sm:text-base">{provider?.cityName}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        {renderStars(provider.rating || 0)}
                        <span className="font-medium text-sm sm:text-base">{provider?.rating?.toFixed(1) || 0}</span>
                        <span className="text-muted-foreground text-sm">({provider?.reviews || 0} avaliações)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <h3 className="font-semibold mb-3 text-base sm:text-lg">Sobre o profissional</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{provider?.description}</p>
              </CardContent>
            </Card>

            {/* Vitrine de Fotos */}
            {photos.length > 0 && (
            <PhotoGallery
              photos={photos}
              providerId={providerId}
                isOwner={user?.role === UserRole.PROVIDER && user.provider?.id === providerId}
                onPhotoDelete={deletePhoto}
              />
            )}

            {/* CONTACT MOBILE */}
            {user?.role === UserRole.CLIENT && (
              <Card className="space-y-0 gap-0 block md:hidden">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Contato</CardTitle>
                </CardHeader>

                <CardContent className="pb-4 sm:pb-6 pt-[-100px] space-y-4">
                  <Button className="w-full" size="lg" onClick={() => handleOpenContactModal(true)}>
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Solicitar Orçamento
                  </Button>

                  <ContactModal
                    provider={provider}
                    isOpen={isContactModalOpen}
                    onOpenChange={setIsContactModalOpen}
                  />

                  <LoginRequiredModal
                    isOpen={isLoginRequiredModalOpen}
                    onOpenChange={setIsLoginRequiredModalOpen}
                    providerId={providerId}
                  />

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Todas as conversas acontecem dentro da plataforma Biko
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!user && (
              <Card className="space-y-0 gap-0 block md:hidden">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Contato</CardTitle>
                </CardHeader>

                <CardContent className="pb-4 sm:pb-6 pt-[-100px] space-y-4">
                  <Button className="w-full" size="lg" onClick={() => router.push("/login")}>
                    <LogIn className="h-5 w-5 mr-2" />
                    Login
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Para solicitar um orçamento, você precisa estar logado
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {user?.role && user?.role === UserRole?.PROVIDER && (
              <Card className="space-y-0 gap-0 block md:hidden">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Contato</CardTitle>
                </CardHeader>

                <CardContent className="pb-4 sm:pb-6 pt-[-100px] space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Para solicitar um orçamento, você precisa estar logado como Cliente!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

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
                <Button onClick={handleSubmitReview} disabled={rating === 0 || isCreating} className="w-full sm:w-auto">
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar avaliação"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* CONTACT PC/NOTEBOOK */}
            {user?.role === UserRole.CLIENT && (
              <Card className="space-y-0 gap-0 hidden md:block">
                <CardHeader className="pt-4 sm:pt-6">
                  <CardTitle className="text-lg sm:text-xl">Contato</CardTitle>
                </CardHeader>

                <CardContent className="pb-4 sm:pb-6 pt-[-100px] space-y-4">
                  <Button className="w-full" size="lg" onClick={() => handleOpenContactModal(true)}>
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Solicitar Orçamento
                  </Button>

                  <ContactModal
                    provider={provider}
                    isOpen={isContactModalOpen}
                    onOpenChange={setIsContactModalOpen}
                  />

                  <LoginRequiredModal
                    isOpen={isLoginRequiredModalOpen}
                    onOpenChange={setIsLoginRequiredModalOpen}
                    providerId={providerId}
                  />

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Todas as conversas acontecem dentro da plataforma Biko
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Avaliações</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Veja o que outros clientes disseram sobre este profissional
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getReviewsByProvider.isLoading ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner />
                  </div>
                ) : getReviewsByProvider.data && getReviewsByProvider.data.data && getReviewsByProvider.data.data.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {getReviewsByProvider.data.data.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.stars
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                    }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-sm">{review.review}</p>
                        </div>
                      ))}
                    </div>

                    {/* Paginação */}
                    {getReviewsByProvider.data.pagination && getReviewsByProvider.data.pagination.totalPages > 1 && (
                      <div className="mt-6">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                href="#"
                                size="default"
                                onClick={(e) => {
                                  e.preventDefault()
                                  if (currentPage > 1) {
                                    setCurrentPage(currentPage - 1)
                                  }
                                }}
                                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>

                            {Array.from({ length: getReviewsByProvider.data.pagination.totalPages }).map((_, i) => {
                              const page = i + 1
                              const isCurrentPage = page === currentPage

                              // Mostrar apenas algumas páginas ao redor da página atual
                              if (
                                page === 1 ||
                                page === getReviewsByProvider.data.pagination.totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                              ) {
                                return (
                                  <PaginationItem key={page}>
                                    <PaginationLink
                                      href="#"
                                      size="icon"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        setCurrentPage(page)
                                      }}
                                      isActive={isCurrentPage}
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                )
                              } else if (
                                page === currentPage - 2 ||
                                page === currentPage + 2
                              ) {
                                return (
                                  <PaginationItem key={page}>
                                    <PaginationEllipsis />
                                  </PaginationItem>
                                )
                              }
                              return null
                            })}

                            <PaginationItem>
                              <PaginationNext
                                href="#"
                                size="default"
                                onClick={(e) => {
                                  e.preventDefault()
                                  if (currentPage < getReviewsByProvider.data.pagination.totalPages) {
                                    setCurrentPage(currentPage + 1)
                                  }
                                }}
                                className={currentPage >= getReviewsByProvider.data.pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>

                        <div className="text-center text-sm text-muted-foreground mt-2">
                          Mostrando {getReviewsByProvider.data.data.length} de {getReviewsByProvider.data.pagination.total} avaliações
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Ainda não há avaliações para este profissional.
                  </p>
                )}
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

            {/* SELO DE VERICADO PARA PREMIUM */}
            {/*    <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <div className="font-medium text-green-600 mb-1">Perfil Verificado</div>
                  <div className="text-sm text-muted-foreground">Este prestador foi verificado pela nossa equipe</div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
