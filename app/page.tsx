import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Search, Users, Shield, Star } from "lucide-react"
import { ServicesLanding } from "@/components/services-landing"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="py-20 px-4 bg-primary/15">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Conecte-se com os melhores
            <span> prestadores de serviços</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 text-pretty max-w-2xl mx-auto">
            A Biko conecta você aos profissionais mais qualificados da sua região com segurança e praticidade
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/providers">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                <Search className="mr-2 h-5 w-5" />
                 Buscar Profissionais
              </Button>
            </Link>
            <Link href="/provider-landing">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
              >
                <Users className="mr-2 h-5 w-5" />
                Sou Prestador
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">500+</div>
              <div className="text-muted-foreground">Prestadores ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">1000+</div>
              <div className="text-muted-foreground">Clientes satisfeitos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">50+</div>
              <div className="text-muted-foreground">Tipos de serviços</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Por que escolher a Biko?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nossa plataforma oferece segurança, praticidade e qualidade para conectar clientes e prestadores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center border-0 shadow-sm">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Segurança garantida</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Todos os prestadores passam por verificação e os pagamentos são protegidos
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Busca inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Encontre o profissional ideal usando filtros por localização, serviço e avaliações
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Avaliações reais</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sistema de avaliações transparente para garantir a qualidade dos serviços
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Serviços mais procurados</h2>
            <p className="text-muted-foreground text-lg">
              Encontre profissionais especializados nas áreas mais demandadas
            </p>
          </div>

          <ServicesLanding />
        </div>
      </section>

      <Footer />
    </div>
  )
}
