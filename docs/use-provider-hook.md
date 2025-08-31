# Hook useProvider com React Query

Este hook foi criado para buscar um provider específico usando o `@tanstack/react-query` na rota `providers/[id]`.

## Funcionalidades

- **Busca de provider por ID**: Faz uma requisição GET para `/providers/{id}`
- **Cache automático**: Dados são armazenados em cache por 5 minutos
- **Estados de loading e erro**: Gerenciados automaticamente pelo React Query
- **Retry automático**: 2 tentativas em caso de falha
- **Validação de ID**: Só executa se o ID for fornecido

## Uso Básico

```tsx
import { useProvider } from '@/hooks/use-provider'

function ProviderProfilePage() {
  const { data: provider, isLoading, error, refetch } = useProvider(providerId)

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (error) {
    return <div>Erro ao carregar provider</div>
  }

  if (!provider) {
    return <div>Provider não encontrado</div>
  }

  return (
    <div>
      <h1>{provider.name}</h1>
      <p>{provider.description}</p>
    </div>
  )
}
```

## Propriedades Retornadas

- `data`: Dados do provider (tipo `Provider`)
- `isLoading`: Boolean indicando se está carregando
- `error`: Objeto de erro, se houver
- `refetch`: Função para recarregar os dados
- `isSuccess`: Boolean indicando se a requisição foi bem-sucedida
- `isError`: Boolean indicando se houve erro

## Configurações do React Query

- **queryKey**: `['provider', id]` para identificação única
- **staleTime**: 5 minutos (dados considerados frescos por 5 minutos)
- **retry**: 2 tentativas em caso de erro
- **enabled**: Só executa se o ID existir

## Endpoint da API

O hook faz uma requisição GET para `/providers/{id}` usando o cliente API configurado.

## Estrutura Esperada da API

O hook espera que a API retorne um objeto com a estrutura `ApiResponse<Provider>`:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  statusCode?: number
}

interface Provider {
  id: string
  name: string
  email: string
  phone: string
  services: string[]
  location: string
  description: string
  photoUrl?: string
  rating?: number
  reviews?: number
  verified?: boolean
  // ... outros campos
}
```

## Tratamento de Erros

- Em caso de erro na API, o hook propaga o erro para ser tratado pelo componente
- O componente pode usar `error.message` para exibir mensagens de erro
- A função `refetch` permite tentar novamente em caso de falha

## Estados de Loading e Error

A página implementa três estados principais:

1. **Loading**: Mostra spinner e mensagem "Carregando perfil do profissional..."
2. **Error**: Mostra mensagem de erro com botão "Tentar novamente"
3. **Not Found**: Mostra mensagem quando o provider não é encontrado

## Exemplo de Implementação na Página

```tsx
// Loading state
if (isLoading) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingSpinner className="mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando perfil do profissional...</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

// Error state
if (error) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Erro ao carregar perfil</h2>
            <Button onClick={() => refetch()} variant="outline">
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
```

## Benefícios

- **Performance**: Cache automático evita requisições desnecessárias
- **UX**: Estados de loading e erro bem definidos
- **Manutenibilidade**: Lógica de busca centralizada no hook
- **Reutilização**: Pode ser usado em outros componentes que precisem do mesmo provider
- **Sincronização**: Múltiplos componentes compartilham os mesmos dados
