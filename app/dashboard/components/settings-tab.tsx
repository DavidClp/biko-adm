import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";
import { useProvider } from "@/hooks/use-provider";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function SettingsTab() {
  const { toast } = useToast()

  const { user, deleteAccount, loading, setUser } = useAuth()

  const { updateListedStatus, isUpdatingListedStatus } = useProvider({
    providerId: user?.provider?.id
  })

  const handleToggleListedStatus = () => {
    if (user?.provider) {
      if (user?.provider.subscription_situation !== 'active' && user?.provider.subscription_situation !== 'paid') {
        toast({
          title: "🔒 Assinatura necessária",
          description: "Para ativar seu perfil público e aparecer nas buscas, você precisa de uma assinatura ativa. Acesse a aba 'Planos' para escolher o melhor plano para você!",
          variant: "default",
          duration: 6000,
        })
        return
      }

      updateListedStatus(!user?.provider.is_listed)

      setUser({
        ...user,
        provider: {
          ...user?.provider,
          is_listed: !user?.provider.is_listed
        }
      })
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount()
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir conta",
        description: "Ocorreu um erro ao excluir sua conta. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da conta</CardTitle>
        <CardDescription>Gerencie suas preferências e configurações</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/*  <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notificações</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Novos pedidos</p>
              <p className="text-sm text-muted-foreground">Receba notificações de novos pedidos</p>
            </div>
            <Button variant="outline" size="sm">
              Ativado
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Avaliações</p>
              <p className="text-sm text-muted-foreground">Notificações de novas avaliações</p>
            </div>
            <Button variant="outline" size="sm">
              Ativado
            </Button>
          </div>
        </div>
      </div> */}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Privacidade</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Perfil público</p>
                <p className="text-sm text-muted-foreground">Seu perfil aparece nas buscas</p>
              </div>
              <Button
                variant={user?.provider?.is_listed ? "default" : "outline"}
                size="sm"
                onClick={handleToggleListedStatus}
                disabled={isUpdatingListedStatus}
              >
                {isUpdatingListedStatus ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : user?.provider?.is_listed ? (
                  "Ativado"
                ) : user?.provider?.subscription_situation !== 'active' && user?.provider?.subscription_situation !== 'paid' ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Assinar para ativar
                  </>
                ) : (
                  "Desativado"
                )}
              </Button>
            </div>
            {(user?.provider?.subscription_situation !== 'active' && user?.provider?.subscription_situation !== 'paid') && (
              <div className="mt-2">
                <Alert className="bg-primary/25">
                  <Lock className="h-4 w-4" color="#db9d01" />
                  <AlertDescription className="text-sm text-secondary font-medium">
                    Para aparecer nas buscas, você precisa de uma assinatura ativa.
                    {/*   <span className="font-medium text-blue-600 cursor-pointer hover:underline ml-1" 
                        onClick={() => {
                          // Aqui você pode adicionar lógica para navegar para a aba de assinaturas
                          const subscriptionsTab = document.querySelector('[value="subscriptions"]') as HTMLElement;
                          if (subscriptionsTab) {
                            subscriptionsTab.click();
                          }
                        }}>
                    Ver planos disponíveis →
                  </span> */}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  "Excluir conta"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir conta</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
                  e removerá todos os dados associados do nosso servidor.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Excluir conta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}