# Hook useMessages

Este hook gerencia as mensagens de um request específico usando React Query para cache e sincronização.

## Funcionalidades

- **Buscar mensagens**: Busca todas as mensagens de um request específico
- **Enviar mensagem**: Envia uma nova mensagem para o request
- **Cache automático**: Usa React Query para cache e invalidação automática
- **Estados de loading**: Fornece estados de carregamento para UI
- **Tratamento de erros**: Gerencia erros com toast notifications

## Uso Básico

```tsx
import { useMessages } from '@/hooks/use-messages'

function MyComponent() {
  const { 
    getMessagesByRequest, 
    sendMessage, 
    isSending 
  } = useMessages({ requestId: 'request-123' })

  const { data: messages, isLoading } = getMessagesByRequest

  const handleSendMessage = () => {
    sendMessage({
      content: 'Olá!',
      sender_id: 'user-123',
      receiver_id: 'provider-456',
      request_id: 'request-123'
    })
  }

  return (
    <div>
      {isLoading ? (
        <p>Carregando mensagens...</p>
      ) : (
        messages?.map(message => (
          <div key={message.id}>
            <p>{message.content}</p>
            <small>{new Date(message.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
      
      <button 
        onClick={handleSendMessage}
        disabled={isSending}
      >
        {isSending ? 'Enviando...' : 'Enviar'}
      </button>
    </div>
  )
}
```

## API

### Parâmetros

- `requestId` (string, opcional): ID do request para buscar mensagens

### Retorno

#### Queries
- `getMessagesByRequest`: Query para buscar mensagens do request
  - `data`: Array de mensagens
  - `isLoading`: Estado de carregamento
  - `isError`: Estado de erro
  - `error`: Objeto de erro

- `getMessagesByUser`: Query para buscar todas as mensagens do usuário
  - `data`: Array de mensagens
  - `isLoading`: Estado de carregamento
  - `isError`: Estado de erro
  - `error`: Objeto de erro

#### Mutations
- `sendMessage`: Função para enviar mensagem
- `isSending`: Estado de carregamento do envio
- `isSuccess`: Estado de sucesso do envio
- `isError`: Estado de erro do envio
- `error`: Objeto de erro
- `reset`: Função para resetar o estado da mutation

## Endpoints da API

### GET /messages/request/:requestId
Busca todas as mensagens de um request específico.

### GET /messages/user
Busca todas as mensagens do usuário logado.

### POST /messages
Envia uma nova mensagem.

**Body:**
```json
{
  "content": "Conteúdo da mensagem",
  "sender_id": "ID do remetente",
  "receiver_id": "ID do destinatário",
  "request_id": "ID do request"
}
```

## Tipos

```tsx
interface Message {
  id: string
  content: string
  sender_id: string
  receiver_id: string
  request_id: string
  createdAt: string
  sender?: User
  receiver?: User
}
```

## Cache e Invalidação

O hook usa React Query para cache automático. Quando uma mensagem é enviada com sucesso, o cache das mensagens do request é automaticamente invalidado para refletir as mudanças.

## Tratamento de Erros

Erros são tratados automaticamente com toast notifications:
- **Sucesso**: "Mensagem enviada!"
- **Erro**: "Erro ao enviar mensagem" com detalhes específicos
