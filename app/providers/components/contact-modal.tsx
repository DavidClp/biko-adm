"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Send, Briefcase, FileText, Clock, MapPin } from "lucide-react"
import { Provider } from "@/lib/types"
import { useRequestService } from "@/hooks/use-requests-services"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface ContactFormData {
  service_type: string
  description: string
  urgency: string
  address: string
}

interface ContactModalProps {
  provider: Provider
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onContactSent?: () => void
}

const urgencyOptions = [
  { value: "urgent", label: "Urgente" },
  { value: "next_7_days", label: "Próximos 7 dias" },
  { value: "next_15_days", label: "Próximos 15 dias" },
  { value: "next_30_days", label: "Próximos 30 dias" },
  { value: "no_date_defined", label: "Não tenho data definida" },
]

export function ContactModal({ provider, isOpen, onOpenChange, onContactSent }: ContactModalProps) {
  const [isContactSent, setIsContactSent] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({
    defaultValues: {
      service_type: "",
      description: "",
      urgency: "urgent",
      address: "",
    }
  })

  const { sendContactRequest, isSending, isSuccess, reset: resetMutation } = useRequestService();
  const { user } = useAuth();

  const onSubmit = async (data: ContactFormData) => {
    if (!provider?.id) {
      console.error("Provider ID não encontrado")
      return
    }

    const requestData = {
      ...data,
      providerId: provider.id,
      clientId: user?.client?.id!,
    }

    sendContactRequest(requestData)
    router.push(`/my-requests?providerId=${provider.id}`)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && !isContactSent) {
      reset()
    }
    onOpenChange(open)
  }

  const watchedValues = watch()
  const isFormValid = watchedValues.service_type && watchedValues.description

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4 sm:pb-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-primary">
            Solicitar Orçamento
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground px-2">
            Descreva o serviço que você precisa e {provider?.name} entrará em contato com você.
          </DialogDescription>
        </DialogHeader>

        {!isContactSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="space-y-1">
              <Label htmlFor="service_type" className="text-sm font-medium text-foreground">
                Tipo de serviço <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="service_type"
                  placeholder="Ex: Instalação elétrica, reparo..."
                  {...register("service_type", { 
                    required: "Tipo de serviço é obrigatório",
                    minLength: {
                      value: 3,
                      message: "Mínimo de 3 caracteres"
                    }
                  })}
                  className="pl-10 h-11 sm:h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 text-sm sm:text-base"
                />
              </div>
              {errors.service_type && (
                <p className="text-sm text-destructive">{errors.service_type.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Descrição detalhada <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="description"
                  placeholder="Descreva o que você precisa fazer..."
                  rows={3}
                  {...register("description", { 
                    required: "Descrição é obrigatória",
                    minLength: {
                      value: 10,
                      message: "Mínimo de 10 caracteres"
                    }
                  })}
                  className="pl-10 pt-3 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 overflow-y-auto whitespace-pre-wrap break-all  resize-none text-sm sm:text-base"
                />
              </div>
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="urgency" className="text-sm font-medium text-foreground">
                Urgência <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("urgency")}
                onValueChange={(value) => setValue("urgency", value)}
              >
                <SelectTrigger 
                  style={{ height: '48px' }} 
                  className="w-full border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                >
                  <SelectValue placeholder="Selecione a urgência" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.value === "urgent" && <Clock className="h-4 w-4 mr-2 text-red-500" />}
                      {option.value === "next_7_days" && <Clock className="h-4 w-4 mr-2 text-orange-500" />}
                      {option.value === "next_15_days" && <Clock className="h-4 w-4 mr-2 text-yellow-500" />}
                      {option.value === "next_30_days" && <Clock className="h-4 w-4 mr-2 text-blue-500" />}
                      {option.value === "no_date_defined" && <Clock className="h-4 w-4 mr-2 text-gray-500" />}
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="address" className="text-sm font-medium text-foreground">
                Endereço <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder="Endereço ou região"
                  {...register("address")}
                  className="pl-10 h-11 sm:h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 text-sm sm:text-base"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium mt-4"
              disabled={!isFormValid || isSending}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSending ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Solicitação enviada!</h3>
            <p className="text-muted-foreground">
              {provider?.name} recebeu sua solicitação e entrará em contato em breve.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
