import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth";
import { Check, Copy, MessageSquare, Share2 } from "lucide-react"
import { useCallback, useState } from "react";

export const CardNotRequests = () => {
  const { user } = useAuth();
  
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyProfileLink = useCallback(async () => {
    try {
      const profileLink = `${window.location.origin}/providers/${user?.provider?.id}`;
      await navigator.clipboard.writeText(profileLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  }, [user?.provider?.id]);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
    <div className="mb-6">
      <MessageSquare className="h-16 w-16 mx-auto text-secondary mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Nenhuma solicitação de orçamento ainda
      </h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">
        Ainda não recebemos solicitações de clientes para seus serviços. 
        Compartilhe seu perfil para aumentar suas chances de receber orçamentos!
      </p>
    </div>
    
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 max-w-md">
      <div className="flex items-start gap-3">
        <Share2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-left">
          <h4 className="text-sm font-medium text-blue-900 mb-1">
            Compartilhe seu perfil
          </h4>
          <p className="text-xs text-blue-700 mb-3">
            Envie o link do seu perfil para clientes em potencial através de redes sociais, WhatsApp ou email.
          </p>
          <Button
            onClick={handleCopyProfileLink}
            size="sm"
            variant="outline"
            className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            {linkCopied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Link copiado!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copiar link do perfil
              </>
            )}
          </Button>
        </div>
      </div>
    </div>

    <div className="text-xs text-muted-foreground">
      <p>💡 <strong>Dica:</strong> Quanto mais você compartilhar, mais clientes conhecerão seus serviços!</p>
    </div>
  </div>
  )
}