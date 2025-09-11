"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const proposalSchema = z.object({
  budget: z
    .number({
      required_error: "Orçamento é obrigatório",
      invalid_type_error: "Digite um valor válido",
    })
    .refine((val) => val > 0, {
      message: "O orçamento deve ser maior que R$ 0,00",
    }),
  observation: z.string().optional(),
})

type ProposalFormData = z.infer<typeof proposalSchema>

interface SendProposalModalProps {
  isOpen: boolean
  onClose: () => void
  onSendProposal: (data: { budget: number; observation: string }) => void
}

export function SendProposalModal({
  isOpen,
  onClose,
  onSendProposal,
}: SendProposalModalProps) {
  const [inputValue, setInputValue] = useState("")
  
  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      budget: 0,
      observation: "",
    },
  })

  const formatCurrency = (value: number): string => {
    if (value === 0) return ""
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value)
  }

  const parseCurrency = (value: string): number => {
    const cleanValue = value.replace(/[^\d,]/g, '')
    
    if (!cleanValue) return 0
    
    const normalizedValue = cleanValue.replace(',', '.')
    return parseFloat(normalizedValue) || 0
  }

  const onSubmit = (data: ProposalFormData) => {
    onSendProposal({
      budget: data.budget,
      observation: data.observation || "",
    })
    
    form.reset()
    setInputValue("")
  }

  const handleClose = () => {
    form.reset()
    setInputValue("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar Proposta</DialogTitle>
          <DialogDescription>
            Envie uma proposta para o cliente, para que ele possa avaliar e aceitar ou não a proposta.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orçamento *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Digite o valor"
                      value={inputValue}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === "" || /^[\d,]*$/.test(value)) {
                          setInputValue(value)
                          const numericValue = parseCurrency(value)
                          field.onChange(numericValue)
                        }
                      }}
                      onBlur={() => {
                        const numericValue = parseCurrency(inputValue)
                        field.onChange(numericValue)
                        if (numericValue > 0) {
                          setInputValue(formatCurrency(numericValue))
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione uma observação sobre sua proposta..."
                      rows={3}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-secondary"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Enviando..." : "Enviar Proposta"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
