# Hook useShared com React Query

Este hook foi atualizado para usar o `@tanstack/react-query` para buscar cidades da API de forma eficiente e com cache.

## Instalação

O React Query já foi instalado no projeto:

```bash
npm install @tanstack/react-query --legacy-peer-deps
```

## Configuração

O `QueryProvider` foi adicionado ao layout principal da aplicação para fornecer o contexto do React Query.

## Uso Básico

```tsx
import { useShared } from '@/hooks/use-shared'

function MyComponent() {
  const { cities, isLoadingCities, errorCities, refetchCities } = useShared()

  if (isLoadingCities) {
    return <div>Carregando cidades...</div>
  }

  if (errorCities) {
    return <div>Erro: {errorCities.message}</div>
  }

  return (
    <div>
      {cities.map(city => (
        <div key={city.id}>
          {city.name} - {city.state}
        </div>
      ))}
    </div>
  )
}
```

## Propriedades Retornadas

- `cities`: Array de cidades da API
- `isLoadingCities`: Boolean indicando se está carregando
- `errorCities`: Objeto de erro, se houver
- `refetchCities`: Função para recarregar os dados

## Configurações do React Query

- **staleTime**: 5 minutos (dados considerados frescos por 5 minutos)
- **retry**: 2 tentativas em caso de erro
- **queryKey**: `['cities']` para identificação única

## Estrutura da API

O hook espera que a API retorne um array de objetos com a seguinte estrutura:

```typescript
interface City {
  id: string
  name: string
  state: string
  country?: string
  createdAt?: string
  updatedAt?: string
}
```

## Endpoint da API

O hook faz uma requisição GET para `/cities` usando o cliente API configurado.

## Tratamento de Erros

Em caso de erro na API, o hook retorna um array vazio para `cities` e registra o erro no console.

## Componente de Exemplo

Foi criado um componente `CitiesSelector` que demonstra o uso do hook:

```tsx
import { CitiesSelector } from '@/components/cities-selector'

<CitiesSelector 
  onCitySelect={(cityId) => console.log(cityId)}
  placeholder="Selecione uma cidade"
/>
```

## Benefícios do React Query

- **Cache automático**: Dados são armazenados em cache
- **Sincronização**: Múltiplos componentes compartilham os mesmos dados
- **Revalidação**: Dados podem ser recarregados automaticamente
- **Gerenciamento de estado**: Loading, error e success states são gerenciados automaticamente
- **Otimizações**: Evita requisições desnecessárias
