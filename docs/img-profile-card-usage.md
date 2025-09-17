# Componente ImgProfileCard - Guia de Uso

## Visão Geral

O componente `ImgProfileCard` permite que usuários (providers) façam upload e atualizem suas fotos de perfil de forma fácil e intuitiva.

## Funcionalidades

- ✅ Upload de imagens com validação
- ✅ Preview da imagem selecionada
- ✅ Validação de tipo de arquivo (apenas imagens)
- ✅ Validação de tamanho (máximo 5MB)
- ✅ Estados de loading durante o upload
- ✅ Tratamento de erros com toast notifications
- ✅ Interface responsiva e moderna
- ✅ Integração completa com a API

## Como Usar

### Importação

```tsx
import { ImgProfileCard } from "@/app/dashboard/components/img-profile-card";
```

### Uso Básico

```tsx
function ProfilePage() {
  const providerId = "seu-provider-id";
  
  return (
    <div className="container mx-auto p-4">
      <ImgProfileCard providerId={providerId} />
    </div>
  );
}
```

### Uso com Outros Componentes

```tsx
function ProfileTab({ providerId }: { providerId: string }) {
  return (
    <div className="space-y-6">
      {/* Componente de foto de perfil */}
      <ImgProfileCard providerId={providerId} />
      
      {/* Outros componentes do perfil */}
      <ProfileForm providerId={providerId} />
    </div>
  );
}
```

## Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `providerId` | `string` | ✅ | ID do provider para identificar o usuário |

## Validações

### Tipos de Arquivo Aceitos
- JPG/JPEG
- PNG
- GIF
- WebP

### Limites
- Tamanho máximo: 5MB
- Formatos aceitos: Apenas imagens

## Estados do Componente

### Estados Visuais
1. **Estado Inicial**: Mostra foto atual ou avatar padrão
2. **Seleção de Arquivo**: Mostra preview da nova imagem
3. **Upload**: Exibe spinner de loading
4. **Sucesso**: Toast de confirmação e atualização da foto
5. **Erro**: Toast de erro com mensagem explicativa

### Estados de Loading
- `isPending`: Indica se o upload está em andamento
- Botões ficam desabilitados durante o upload
- Spinner animado durante o processo

## Integração com API

### Endpoint
```
POST /providers/update-profile-img
```

### Headers
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

### Payload
```
FormData com campo 'file' contendo a imagem
```

### Resposta de Sucesso
```json
{
  "success": true,
  "data": {
    "id": "provider-id",
    "photoUrl": "https://s3.amazonaws.com/bucket/profiles/image.jpg",
    // ... outros campos do provider
  },
  "url": "https://s3.amazonaws.com/bucket/profiles/image.jpg",
  "message": "Foto de perfil atualizada com sucesso"
}
```

### Resposta de Erro
```json
{
  "success": false,
  "error": {
    "title": "Erro ao fazer upload",
    "detail": "Arquivo muito grande",
    "statusCode": 400
  }
}
```

## Tratamento de Erros

O componente trata automaticamente os seguintes erros:

1. **Arquivo inválido**: Não é uma imagem
2. **Arquivo muito grande**: Excede 5MB
3. **Erro de rede**: Falha na comunicação com a API
4. **Erro de autenticação**: Token inválido ou expirado
5. **Erro do servidor**: Problemas internos da API

## Estilização

O componente usa as classes do Tailwind CSS e componentes do shadcn/ui:

- `Card`: Container principal
- `Avatar`: Exibição da foto de perfil
- `Button`: Botões de ação
- `Toast`: Notificações de feedback

## Exemplo Completo

```tsx
"use client";

import { ImgProfileCard } from "@/app/dashboard/components/img-profile-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfilePage() {
  const providerId = "123e4567-e89b-12d3-a456-426614174000";
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Componente de foto de perfil */}
              <ImgProfileCard providerId={providerId} />
              
              {/* Outros campos do perfil podem ser adicionados aqui */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

## Dependências

- React 18+
- @tanstack/react-query
- lucide-react (ícones)
- shadcn/ui components
- Tailwind CSS

## Notas Importantes

1. **Autenticação**: O componente requer que o usuário esteja autenticado
2. **Provider ID**: Deve ser um ID válido de um provider existente
3. **CORS**: Certifique-se de que a API está configurada para aceitar uploads
4. **Storage**: As imagens são armazenadas no AWS S3
5. **Cache**: O componente atualiza automaticamente o cache do React Query após o upload

## Troubleshooting

### Problema: Upload não funciona
**Solução**: Verifique se o token de autenticação está válido e se o endpoint está acessível.

### Problema: Imagem não aparece após upload
**Solução**: Verifique se a URL retornada pela API está correta e acessível.

### Problema: Erro de CORS
**Solução**: Configure o servidor para aceitar requisições multipart/form-data.

### Problema: Arquivo muito grande
**Solução**: Reduza o tamanho da imagem ou aumente o limite no servidor.
