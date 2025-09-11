# Sistema de Autenticação - Tratamento de Token Expirado

## Visão Geral

Este documento descreve como o sistema de autenticação trata a expiração de tokens JWT no frontend, garantindo que o usuário seja redirecionado automaticamente para a tela de login quando sua sessão expira.

## Como Funciona

### 1. Interceptador de Resposta da API

O arquivo `lib/api.ts` contém um interceptador do Axios que monitora todas as respostas da API:

```typescript
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    // Trata erros 401 (não autorizado) e 403 (proibido)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Limpa dados de autenticação
      // Atualiza estado do usuário
      // Redireciona para login
    }
  }
)
```

### 2. Limpeza de Dados

Quando um token expira, o sistema:

1. **Remove dados do localStorage:**
   - `token`
   - `userData`
   - `routerBeforeLogin`

2. **Atualiza estado do usuário:**
   - Chama callback registrado no contexto de autenticação
   - Define `user` como `null`
   - Define `loading` como `false`

3. **Redireciona para login:**
   - Verifica se não está em páginas de login/registro
   - Redireciona para `/login`

### 3. Integração com Contexto de Autenticação

O hook `use-auth.tsx` registra um callback que é executado quando o token expira:

```typescript
setClearAuthCallback(() => {
  setUser(null)
  setLoading(false)
})
```

## Fluxo Completo

1. **Usuário faz uma requisição** para a API
2. **API retorna erro 401/403** (token expirado)
3. **Interceptador captura o erro**
4. **Sistema limpa dados locais**
5. **Estado do usuário é atualizado**
6. **Usuário é redirecionado para login**

## Benefícios

- ✅ **Experiência do usuário melhorada**: Redirecionamento automático
- ✅ **Segurança**: Limpeza completa de dados sensíveis
- ✅ **Consistência**: Estado sincronizado entre localStorage e contexto
- ✅ **Prevenção de loops**: Não redireciona se já estiver na tela de login

## Testando

Para testar o fluxo de expiração de token:

1. Faça login na aplicação
2. Aguarde o token expirar (ou modifique manualmente no localStorage)
3. Faça qualquer requisição para a API
4. Verifique se o usuário é redirecionado para `/login`

## Arquivos Modificados

- `lib/api.ts`: Interceptador de resposta e callback global
- `hooks/use-auth.tsx`: Registro do callback de limpeza
