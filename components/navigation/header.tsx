"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { User, Settings, LogOut, Shield, Search, Home, Menu, X, MessageCircle } from "lucide-react"
import { UserRole } from "@/lib/types"
import { WorkerIcon } from "@/lib/icons/worker"

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isActive = (path: string) => pathname === path

  const navigationItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/providers", label: "Buscar", icon: Search },
  ]

  const userNavigationItems = user
    ? [
      ...(user.role === UserRole.PROVIDER ? [{ href: "/dashboard", label: "Dashboard" }] : []),
      ...(user.role === UserRole.ADMIN ? [{ href: "/admin", label: "Admin" }] : []),
    ]
    : []

  return (
    <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm"><WorkerIcon /></span>
            </div>
            <span className="text-xl font-bold text-primary">Listão</span>
            {user?.role === UserRole.ADMIN && (
              <Badge variant="secondary" className="ml-2">
                Admin
              </Badge>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive(item.href) ? "text-primary" : "text-muted-foreground"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}

            {userNavigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(item.href) ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {user.role === UserRole.CLIENT && (
                    <DropdownMenuItem asChild>
                      <Link href="/my-requests">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Minhas Solicitações
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === UserRole.PROVIDER && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === UserRole.ADMIN && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Painel Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link href="/login">
                  <Button variant="outline">Entrar</Button>
                </Link>
                <Link href="/register-provider">
                  <Button>Cadastrar-se</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive(item.href) ? "text-primary" : "text-muted-foreground"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}

              {userNavigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive(item.href) ? "text-primary" : "text-muted-foreground"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {!user && (
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full bg-transparent">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/register-provider" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Cadastrar-se</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
