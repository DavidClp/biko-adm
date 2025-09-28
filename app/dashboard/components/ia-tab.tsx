import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Loader2, Lock, Wand2 } from "lucide-react";
import { useProvider } from "@/hooks/use-provider";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function IATab() {
    // AI Tools state
    const [aiPrompt, setAiPrompt] = useState("")
    const [generatedText, setGeneratedText] = useState("")
    const [generatedImage, setGeneratedImage] = useState("")
    const [aiLoading, setAiLoading] = useState(false)
  
    const handleGenerateText = async () => {
      if (!aiPrompt.trim()) return
  
      setAiLoading(true)
      try {
        // Simulate AI text generation
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const mockResponse = `🔌 Transforme sua casa com instalações elétricas seguras e modernas! 
  
  ✨ Mais de 10 anos de experiência
  ⚡ Atendimento rápido e confiável  
  🏠 Especialista em automação residencial
  📞 Orçamento gratuito: TESTE
  
  #eletricista #saopaulo #automacao #seguranca #qualidade`
  
        setGeneratedText(mockResponse)
      } catch (error) {
        console.error("Error generating text:", error)
      } finally {
        setAiLoading(false)
      }
    }
  
    const handleGenerateImage = async () => {
      setAiLoading(true)
      try {
        // Simulate AI image generation
        await new Promise((resolve) => setTimeout(resolve, 3000))
        setGeneratedImage("/professional-electrician-working.png")
      } catch (error) {
        console.error("Error generating image:", error)
      } finally {
        setAiLoading(false)
      }
    }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Gerador de Legendas
            </CardTitle>
            <CardDescription>Crie legendas profissionais para suas redes sociais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-prompt">Descreva o que você quer promover</Label>
              <Textarea
                id="ai-prompt"
                placeholder="Ex: Promoção de instalação elétrica residencial, destaque para segurança e qualidade..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={3}
              />
            </div>
            <Button disabled={true} onClick={handleGenerateText} /* disabled={aiLoading || !aiPrompt.trim()} */ className="w-full">
              {aiLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  {/*        <Wand2 className="mr-2 h-4 w-4" /> */}
                  <Lock />
                  Gerar Legenda
                </>
              )}
            </Button>

            {generatedText && (
              <div className="space-y-2">
                <Label>Legenda gerada</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{generatedText}</pre>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(generatedText)}>
                  Copiar texto
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Gerador de Imagens
            </CardTitle>
            <CardDescription>Crie imagens profissionais para seu marketing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleGenerateImage} disabled={true} /* disabled={aiLoading} */ className="w-full">
              {aiLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  {/* <ImageIcon className="mr-2 h-4 w-4" /> */}
                  <Lock />
                  Gerar Imagem Profissional
                </>
              )}
            </Button>

            {generatedImage && (
              <div className="space-y-2">
                <Label>Imagem gerada</Label>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={generatedImage || "/placeholder.svg"}
                    alt="Imagem gerada por IA"
                    className="w-full h-auto"
                  />
                </div>
                <Button variant="outline" size="sm">
                  Baixar imagem
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dicas de uso</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use o gerador de legendas para criar posts promocionais regulares</li>
            <li>• As imagens geradas são ideais para stories e posts no Instagram</li>
            <li>• Personalize sempre o conteúdo gerado com sua identidade visual</li>
            <li>• Mantenha consistência na comunicação da sua marca</li>
          </ul>
        </CardContent>
      </Card>
    </>
  )
}