"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogIn, UserPlus, MessageCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface LoginRequiredModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  providerId: string
}

export function LoginRequiredModal({ isOpen, onOpenChange, providerId }: LoginRequiredModalProps) {
  const router = useRouter()
  const { setRouterBeforeLogin } = useAuth()

  const handleLogin = () => {
    onOpenChange(false)
    //setRouterBeforeLogin(`/providers/${providerId}?isModalOpen=true`)
    setRouterBeforeLogin(`/providers/${providerId}?isModalOpen=true`)
    router.push("/login")
  }

  const handleRegister = () => {
    onOpenChange(false)
    router.push("/register-client")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 bg-primary/30 rounded-full mx-auto mb-4">
            <MessageCircle className="h-6 w-6 text-secondary" />
          </div>
          <DialogTitle className="text-center text-xl">
            Faça login para continuar
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Para solicitar um orçamento e entrar em contato com este profissional, 
            você precisa estar logado em sua conta.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-primary/50 border border-primary/20 rounded-lg p-4 mb-4">
            <h4 className="font-medium">Por que preciso fazer login?</h4>
            <ul className="text-sm space-y-1">
              <li>• Acessar o sistema de mensagens da plataforma</li>
              <li>• Receber notificações sobre suas solicitações</li>
              <li>• Acompanhar o histórico de orçamentos</li>
              <li>• Avaliar profissionais após o serviço</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between w-full gap-2">
          <Button 
            variant="outline" 
            onClick={handleRegister}
            className="w-full sm:w-auto"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Criar conta
          </Button>

          <Button 
            onClick={handleLogin}
            className="w-full sm:w-auto"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Fazer login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
