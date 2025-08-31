import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Check, Star, Zap, Users, TrendingUp, Megaphone, Crown, Sparkles } from "lucide-react"

export default function ProviderLandingPage() {
  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Ideal para começar",
      features: [
        "Listagem básica na plataforma",
        "Perfil público simples",
        "Recebimento de contatos",
        "Suporte por email",
      ],
      icon: Users,
      popular: false,
      cta: "Começar Grátis",
    },
    {
      name: "Essencial",
      price: "R$ 29",
      period: "/mês",
      description: "Para profissionais ativos",
      features: [
        "Destaque nos resultados de busca",
        "Acesso parcial à IA de marketing",
        "Até 3 fotos no perfil",
        "Estatísticas básicas",
        "Suporte prioritário",
      ],
      icon: Star,
      popular: true,
      cta: "Escolher Essencial",
    },
    {
      name: "Profissional",
      price: "R$ 79",
      period: "/mês",
      description: "Para quem quer crescer",
      features: [
        "Acesso avançado à IA de marketing",
        "Página personalizada completa",
        "Galeria de trabalhos ilimitada",
        "Relatórios detalhados",
        "Badge de verificado",
      ],
      icon: TrendingUp,
      popular: false,
      cta: "Escolher Profissional",
    },
    {
      name: "Premium",
      price: "R$ 149",
      period: "/mês",
      description: "Solução completa",
      features: [
        "IA ilimitada + consultoria personalizada",
        "Anúncios internos na plataforma",
        "Posição premium nos resultados",
        "Gerente de conta dedicado",
        "Análises avançadas de mercado",
      ],
      icon: Crown,
      popular: false,
      cta: "Escolher Premium",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-primary/10 from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/30 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Plataforma #1 para Prestadores de Serviços
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Transforme seu negócio com
            <span className="text-primary"> tecnologia e IA</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 text-pretty max-w-2xl mx-auto">
            Conecte-se com milhares de clientes, use IA para marketing e cresça seu negócio com nossa plataforma
            completa
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/register-provider">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                <Zap className="mr-2 h-5 w-5" />
                Começar Agora - Grátis
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 bg-transparent">
              Ver Demonstração
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Prestadores ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Taxa de satisfação</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">3x</div>
              <div className="text-muted-foreground">Mais clientes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Por que escolher nossa plataforma?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Oferecemos as ferramentas mais avançadas para impulsionar seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>IA de Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gere conteúdo para redes sociais, descrições de serviços e campanhas automaticamente
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Mais Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Apareça para milhares de clientes que procuram seus serviços diariamente
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Crescimento Garantido</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Ferramentas de análise e otimização para aumentar suas vendas continuamente
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Destaque Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Apareça em posições privilegiadas nos resultados de busca</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Megaphone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Marketing Automático</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Campanhas inteligentes que promovem seus serviços automaticamente</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Suporte Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Consultoria personalizada para otimizar seu perfil e aumentar conversões
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Escolha o plano ideal para você</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comece grátis e evolua conforme seu negócio cresce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan) => {
              const IconComponent = plan.icon
              return (
                <Card
                  key={plan.name}
                  className={`relative ${plan.popular ? "border-primary border-2 shadow-lg scale-105" : "border-border"}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1">Mais Popular</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-primary">
                      {plan.price}
                      <span className="text-sm text-muted-foreground font-normal">{plan.period}</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/register-provider" className="block">
                      <Button
                        className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Todos os planos incluem período de teste gratuito de 14 dias</p>
            <Link href="/register-provider">
              <Button size="lg" className="text-lg px-8 py-6">
                <Zap className="mr-2 h-5 w-5" />
                Começar Teste Gratuito
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para transformar seu negócio?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Junte-se a centenas de prestadores que já estão crescendo conosco
          </p>
          <Link href="/register-provider">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Users className="mr-2 h-5 w-5" />
              Cadastrar-se Agora
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
