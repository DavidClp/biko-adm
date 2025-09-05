'use client'

import { useShared } from '@/hooks/use-shared'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface CitiesSelectorProps {
  onCitySelect?: (cityId: string) => void
  placeholder?: string
  defaultCityId?: string
}

export function CitiesSelector({ onCitySelect, placeholder = "Selecione uma cidade", defaultCityId }: CitiesSelectorProps) {
  const { cities, isLoadingCities } = useShared()

  return (
    <Select onValueChange={onCitySelect} value={defaultCityId}>
      <SelectTrigger className="w-full border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200">
        <SelectValue placeholder={placeholder} />
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
