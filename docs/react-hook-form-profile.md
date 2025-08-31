# React Hook Form no ProfileTab

Este documento explica como o React Hook Form foi implementado para gerenciar o formulário de edição de perfil do provider.

## Funcionalidades Implementadas

- **Validação com Zod**: Schema de validação robusto para todos os campos
- **Integração com API**: Hook personalizado `useProfile` para operações CRUD
- **Estados de loading**: Indicadores visuais durante operações
- **Tratamento de erros**: Mensagens de erro contextuais e toast notifications
- **Cache automático**: React Query para gerenciamento de estado e cache

## Estrutura dos Arquivos

### 1. ProfileTab Component (`app/dashboard/components/profile-tab.tsx`)
- Componente principal com formulário
- Integração com React Hook Form
- Estados de loading e erro
- Validação em tempo real

### 2. useProfile Hook (`hooks/use-profile.ts`)
- Gerenciamento de estado do perfil
- Operações de busca e atualização
- Integração com React Query
- Toast notifications

### 3. Schema de Validação
```typescript
const profileFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  service: z.string().min(2, "Serviço deve ter pelo menos 2 caracteres").max(100, "Serviço muito longo"),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres").max(100, "Cidade muito longa"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos").max(15, "Telefone muito longo"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres").max(500, "Descrição muito longa"),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
});
```

## Como Funciona

### 1. Inicialização do Formulário
```typescript
const form = useForm<ProfileFormData>({
  resolver: zodResolver(profileFormSchema),
  defaultValues: {
    name: "",
    service: "",
    city: "",
    phone: "",
    description: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  },
});
```

### 2. Carregamento de Dados
```typescript
useEffect(() => {
  if (profile) {
    form.reset({
      name: profile.name || "",
      service: profile.services?.join(", ") || "",
      city: profile.location || "",
      phone: profile.phone || "",
      description: profile.description || "",
      instagram: profile.instagram || "",
      facebook: profile.facebook || "",
      linkedin: profile.website || "",
    });
  }
}, [profile, form]);
```

### 3. Submissão do Formulário
```typescript
const onSubmit = useCallback(async (data: ProfileFormData) => {
  const updateData = {
    ...data,
    services: data.service.split(",").map(s => s.trim()),
    location: data.city,
  };
  
  updateProfile(updateData);
}, [updateProfile]);
```

## Campos do Formulário

### Informações Básicas
- **Nome completo**: Obrigatório, 2-100 caracteres
- **Serviços**: Obrigatório, 2-100 caracteres (separados por vírgula)
- **Cidade**: Obrigatório, 2-100 caracteres
- **WhatsApp**: Obrigatório, 10-15 dígitos

### Descrição
- **Descrição dos serviços**: Obrigatório, 10-500 caracteres

### Redes Sociais (Opcionais)
- **Instagram**: Formato @usuario
- **Facebook**: Formato facebook.com/usuario
- **LinkedIn**: Formato linkedin.com/in/usuario

## Estados do Formulário

### 1. Loading
- Mostra spinner durante carregamento inicial
- Desabilita campos durante atualização
- Botão com texto "Salvando..." e spinner

### 2. Error
- Mensagens de erro contextuais abaixo de cada campo
- Alert de erro geral quando falha ao carregar
- Botão "Tentar novamente" para recarregar

### 3. Success
- Toast notification de sucesso
- Cache atualizado automaticamente
- Formulário permanece preenchido

## Validação

### Validação em Tempo Real
- Campos são validados conforme o usuário digita
- Mensagens de erro aparecem abaixo dos campos
- Formulário só é submetido se todos os campos obrigatórios estiverem válidos

### Regras de Validação
- **Nome**: Mínimo 2, máximo 100 caracteres
- **Serviço**: Mínimo 2, máximo 100 caracteres
- **Cidade**: Mínimo 2, máximo 100 caracteres
- **Telefone**: Mínimo 10, máximo 15 dígitos
- **Descrição**: Mínimo 10, máximo 500 caracteres
- **Redes sociais**: Opcionais, sem validação específica

## Integração com API

### Endpoints Utilizados
- **GET** `/providers/{id}` - Buscar perfil
- **PUT** `/providers/{id}` - Atualizar perfil

### Estrutura de Dados
```typescript
interface UpdateProfileData {
  name: string
  service: string
  city: string
  phone: string
  description: string
  instagram?: string
  facebook?: string
  linkedin?: string
}
```

### Transformação de Dados
- `service` (string) → `services` (array)
- `city` → `location`
- Campos opcionais são incluídos apenas se preenchidos

## Benefícios da Implementação

### 1. Performance
- Re-renderizações otimizadas
- Validação eficiente
- Cache automático com React Query

### 2. UX
- Feedback visual imediato
- Estados de loading claros
- Mensagens de erro contextuais

### 3. Manutenibilidade
- Código organizado e reutilizável
- Validação centralizada
- Separação de responsabilidades

### 4. Acessibilidade
- Labels associados aos campos
- Mensagens de erro claras
- Estados de loading anunciados

## Próximos Passos

1. **Integrar com autenticação**: Obter ID real do provider logado
2. **Adicionar upload de foto**: Campo para foto de perfil
3. **Validação de telefone**: Formato específico para WhatsApp
4. **Autocomplete de cidades**: Integrar com hook `useShared`
5. **Histórico de alterações**: Log de modificações no perfil
