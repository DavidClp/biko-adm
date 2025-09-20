'use client'

import { useState } from 'react'
import { useShared } from '@/hooks/use-shared'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Briefcase, Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Service {
  id: string
  name: string
}

interface ServicesMultiSelectProps {
  selectedServices?: string[]
  onServicesChange?: (serviceIds: string[]) => void
  placeholder?: string
  maxSelections?: number
  className?: string
  classNameInput?: string
  onServiceSelect?: (serviceId: string) => void
  height?: string
}

export function ServicesMultiSelect({
  selectedServices = [],
  onServicesChange,
  placeholder = "Selecione serviços",
  maxSelections = 10,
  className,
  classNameInput,
  onServiceSelect,
}: ServicesMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const { servicesQuery } = useShared()
  const { data: services, isLoading: isLoadingServices } = servicesQuery

  const handleSelect = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      onServicesChange?.(selectedServices.filter(id => id !== serviceId))
    } else {
      if (!maxSelections || selectedServices.length < maxSelections) {
        onServicesChange?.([...selectedServices, serviceId])
      }
    }
  }

  const handleRemove = (serviceId: string) => {
    onServicesChange?.(selectedServices.filter(id => id !== serviceId))
  }

  const getSelectedServices = () => {
    if (!services) return []
    return services.filter(service => selectedServices.includes(service.id))
  }

  const selectedServicesData = getSelectedServices()

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between min-h-[40px] h-auto", classNameInput)}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedServicesData.length === 0 ? (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 mt-0 text-muted-foreground" />
                  <span className="text-muted-foreground">{placeholder}</span>
                </div>
              ) : (
                selectedServicesData.map((service) => (
                  <Badge
                    key={service.id}
                    variant="secondary"
                    className="mr-1 mb-1"
                  >
                    {service.name}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(service.id)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={() => handleRemove(service.id)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar serviços..." />
            <CommandList>
              <CommandEmpty>
                {isLoadingServices ? (
                  <div className="flex items-center justify-center py-6">
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Carregando serviços...
                  </div>
                ) : (
                  "Nenhum serviço encontrado."
                )}
              </CommandEmpty>
              <CommandGroup>
                {services?.map((service) => (
                  <CommandItem
                    key={service.id}
                    value={service.name}
                    onSelect={() => handleSelect(service.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedServices.includes(service.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {service.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {maxSelections && (
        <p className="text-xs text-muted-foreground">
          {selectedServices.length}/{maxSelections} selecionados
        </p>
      )}
    </div>
  )
}
