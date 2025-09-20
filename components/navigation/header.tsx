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
import { User, Settings, LogOut, Shield, Search, Home, Menu, X, MessageCircle, ChevronRight } from "lucide-react"
import { UserRole } from "@/lib/types"
import { WorkerIcon } from "@/lib/icons/worker"
import { cn } from "@/lib/utils"

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
    setSidebarOpen(false)
  }

  const isActive = (path: string) => pathname === path

  const navigationItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/providers", label: "Buscar", icon: Search },
  ]

  const userNavigationItems = user
    ? [
      ...(user.role === UserRole.PROVIDER ? [{ href: "/dashboard", label: "Dashboard", icon: User }] : []),
      ...(user.role === UserRole.ADMIN ? [{ href: "/admin", label: "Admin", icon: Shield }] : []),
      ...(user.role === UserRole.CLIENT ? [{ href: "/my-requests", label: "Minhas Solicitações", icon: MessageCircle }] : []),
    ]
    : []

  return (
    <>
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">
                  <WorkerIcon size={28} />
                </span>
              </div>
              <span className="text-xl font-bold text-primary">Biko</span>
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
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive(item.href) ? "text-primary" : "text-muted-foreground"
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
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.provider?.name?.charAt(0) || user.client?.name?.charAt(0) || user.name?.charAt(0)}
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
                    {userNavigationItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href}>
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
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
                <div className="flex gap-2">
                  <Link href="/login">
                    <Button variant="outline">Entrar</Button>
                  </Link>
                  <Link href="/register-provider">
                    <Button>Cadastrar-se</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              className="md:hidden" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 bg-card border-l shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden",
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">
                  <WorkerIcon size={20} />
                </span>
              </div>
              <span className="text-lg font-bold text-primary">Biko</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Profile Section */}
          {user && (
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">
                    {user.provider?.name?.charAt(0) || user.client?.name?.charAt(0) || user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  {user.role === UserRole.ADMIN && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {/* Main Navigation */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Navegação
                </p>
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href) 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>

              {/* User Navigation */}
              {userNavigationItems.length > 0 && (
                <div className="space-y-1 mt-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Minha Conta
                  </p>
                  {userNavigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href) 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              {!user && (
                <div className="space-y-1 mt-6 ">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Conta
                  </p>
                  <Link href="/login" onClick={() => setSidebarOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-3 mb-3">
                      <User className="h-4 w-4" />
                      Entrar
                    </Button>
                  </Link>

                  <Link href="/register-provider" onClick={() => setSidebarOpen(false)}>
                    <Button className="w-full justify-start gap-3">
                      <ChevronRight className="h-4 w-4" />
                      Cadastrar-se
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>

          {/* Sidebar Footer */}
          {user && (
            <div className="p-4 border-t">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <Settings className="h-4 w-4" />
                  Configurações
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
