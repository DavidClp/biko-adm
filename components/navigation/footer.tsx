import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SC</span>
              </div>
              <span className="text-xl font-bold text-primary">ServiceConnect</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Conectando pessoas e transformando negócios através de serviços de qualidade.
            </p>
          </div>

          {/* Para Clientes */}
          <div className="space-y-4">
            <h3 className="font-semibold">Para Clientes</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/providers" className="text-muted-foreground hover:text-primary transition-colors">
                  Buscar Prestadores
                </Link>
              </li>
              <li>
                <Link href="/register-client" className="text-muted-foreground hover:text-primary transition-colors">
                  Criar Conta
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Fazer Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Para Prestadores */}
          <div className="space-y-4">
            <h3 className="font-semibold">Para Prestadores</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/register-provider" className="text-muted-foreground hover:text-primary transition-colors">
                  Cadastrar-se
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Fazer Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div className="space-y-4">
            <h3 className="font-semibold">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ServiceConnect. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
