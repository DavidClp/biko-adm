"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Eye, ArrowRight, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProviderNotListedCardProps {
  onNavigateToSettings?: () => void
}

export function ProviderNotListedCard({ onNavigateToSettings }: ProviderNotListedCardProps) {
  const router = useRouter()

  const handleGoToSettings = () => {
    if (onNavigateToSettings) {
      onNavigateToSettings()
    } else {
      router.push('/dashboard?tab=settings')
    }
  }

  return (
    <div className="flex items-center justify-center mb-4">
      <Card className="w-full max-w-md border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            {/* Ícone principal */}
            <div className="relative">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="h-3 w-3 text-white" />
              </div>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Seu perfil não está listado
              </h3>
              <p className="text-sm text-gray-600">
                Para receber solicitações de clientes, você precisa ativar seu perfil nas configurações
              </p>
            </div>

            {/* Alert com informações */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-800">
                <div className="space-y-2">
                  <p className="font-medium">Como ser encontrado pelos clientes:</p>
                  <ul className="text-left space-y-1 text-xs">
                    <li>• Ative seu perfil nas configurações</li>
                    <li>• Mantenha suas informações atualizadas</li>
                    <li>• Defina seus serviços e áreas de atuação</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            {/* Botão de ação */}
            <Button
              onClick={handleGoToSettings}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Settings className="mr-2 h-4 w-4" />
              Ir para Configurações
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
