'use client'

import { useShared } from '@/hooks/use-shared'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'

interface CitiesSelectorProps {
  onCitySelect?: (cityId: string) => void
  placeholder?: string
  defaultCityId?: string
  classNameInput?: string
}

export function CitiesSelector({ onCitySelect, classNameInput, placeholder = "Selecione uma cidade", defaultCityId }: CitiesSelectorProps) {
  const { cities, isLoadingCities } = useShared()

  return (
    <Select onValueChange={onCitySelect} value={defaultCityId}>
      <SelectTrigger className={cn("w-full border-border/80 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200", classNameInput)}>
        <div className='flex items-center gap-2'>
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder={placeholder} className='ml-[-100px]'/>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas as cidades</SelectItem>
        {isLoadingCities ? (
          <SelectItem value="loading"><LoadingSpinner /> carregando cidades...</SelectItem>
        ) : (
          <>
            {cities?.map((city) => (
              <SelectItem key={city?.id} value={city?.id}>
                {city?.name} - {city?.state?.initials}
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select >
  )
}
