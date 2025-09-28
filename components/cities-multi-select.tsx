'use client'

import { useState } from 'react'
import { useShared } from '@/hooks/use-shared'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Briefcase, Check, ChevronsUpDown, MapPin, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface City {
  id: string
  name: string
}

interface CitiesMultiSelectProps {
  selectedCities?: string[]
  onCitiesChange?: (cityIds: string[]) => void
  placeholder?: string
  maxSelections?: number
  className?: string
  classNameInput?: string
  onCitySelect?: (cityId: string) => void
  height?: string
}

export function CitiesMultiSelect({
  selectedCities = [],
  onCitiesChange,
  placeholder = "Selecione cidades",
  maxSelections = 10,
  className,
  classNameInput,
  onCitySelect,
}: CitiesMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const { citiesQuery } = useShared()
  const { data: cities, isLoading: isLoadingCities } = citiesQuery

  const handleSelect = (cityId: string) => {
    if (selectedCities.includes(cityId)) {
      onCitiesChange?.(selectedCities.filter(id => id !== cityId))
    } else {
      if (!maxSelections || selectedCities.length < maxSelections) {
        onCitiesChange?.([...selectedCities, cityId])
      }
    }
  }

  const handleRemove = (cityId: string) => {
    onCitiesChange?.(selectedCities.filter(id => id !== cityId))
  }

  const getSelectedCities = () => {
    if (!cities) return []
    return cities.filter(city => selectedCities.includes(city?.id))
  }

  const selectedCitiesData = getSelectedCities()

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
              {selectedCitiesData.length === 0 ? (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 mt-0 text-muted-foreground" />
                  <span className="text-muted-foreground">{placeholder}</span>
                </div>
              ) : (
                selectedCitiesData.map((service) => (
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
            <CommandInput placeholder="Buscar cidades..." />
            <CommandList>
              <CommandEmpty>
                {isLoadingCities ? (
                  <div className="flex items-center justify-center py-6">
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Carregando cidades...
                  </div>
                ) : (
                  "Nenhuma cidade encontrada."
                )}
              </CommandEmpty>
              <CommandGroup>
                {cities?.map((city) => (
                  <CommandItem
                    key={city?.id}
                    value={city?.name}
                    onSelect={() => handleSelect(city?.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCities.includes(city?.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {city?.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {maxSelections && (
        <p className="text-xs text-muted-foreground">
          {selectedCities.length}/{maxSelections} selecionados
        </p>
      )}
    </div>
  )
}
