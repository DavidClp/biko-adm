# Segurança no Frontend

Este documento explica como implementar e usar o sistema de segurança no frontend da aplicação.

## Visão Geral

O sistema de segurança implementa:
- **Interceptação automática de erros 401** - Redireciona automaticamente para home quando token expira
- **Hooks de proteção de rotas** - Facilita a proteção de páginas baseadas em autenticação e roles
- **Gerenciamento de estado de autenticação** - Centraliza o estado do usuário e funções de logout

## Componentes do Sistema

### 1. Interceptor do Axios (`lib/api.ts`)

O interceptor intercepta automaticamente erros 401 e:
- Limpa dados de autenticação do localStorage
- Redireciona para a home (`/`)

```typescript
// Interceptor para tratar erros da API
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    // Se for erro 401 (não autorizado), limpar dados e redirecionar
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("userData")
        localStorage.removeItem("routerBeforeLogin")
        window.location.href = "/"
      }
    }
    
    return Promise.reject({
      status: error.response?.status,
      message: error.response?.data?.message || error.message || "Erro desconhecido",
    })
  }
)
```

### 2. Hook useAuth (`hooks/use-auth.tsx`)

Hook principal para gerenciamento de autenticação:

```typescript
const { 
  user, 
  loading, 
  login, 
  logout, 
  logoutAndRedirect, // Nova função para logout com redirecionamento
  registerClient,
  registerProvider 
} = useAuth()
```

**Novas funcionalidades:**
- `logoutAndRedirect()` - Faz logout e redireciona para home
- Melhor limpeza do localStorage (inclui `routerBeforeLogin`)

### 3. Hooks de Proteção de Rotas (`hooks/use-auth-redirect.ts`)

#### `useRequireAuth(redirectTo?)`
Protege rotas que requerem autenticação:

```typescript
export default function DashboardPage() {
  // Redireciona para /login se não autenticado
  useRequireAuth("/login")
  
  // ... resto do componente
}
```

#### `useRequireRole(role, redirectTo?)`
Protege rotas que requerem role específica:

```typescript
export default function AdminPage() {
  // Redireciona para / se não for admin
  useRequireRole("admin", "/")
  
  // ... resto do componente
}
```

#### `useRedirectIfAuthenticated(redirectTo?)`
Redireciona usuários autenticados (útil para páginas de login):

```typescript
export default function LoginPage() {
  // Redireciona para /dashboard se já autenticado
  useRedirectIfAuthenticated("/dashboard")
  
  // ... resto do componente
}
```

#### `useAuthRedirect(redirectTo, requireAuth, requireRole)`
Hook genérico para casos mais complexos:

```typescript
export default function CustomPage() {
  const { user, loading, isAuthenticated, hasRequiredRole } = useAuthRedirect(
    "/login",    // redirectTo
    true,        // requireAuth
    "provider"   // requireRole (opcional)
  )
  
  // ... resto do componente
}
```

## Como Usar

### 1. Proteger Páginas que Requerem Autenticação

```typescript
import { useRequireAuth } from "@/hooks/use-auth-redirect"

export default function ProtectedPage() {
  useRequireAuth("/login") // Redireciona para login se não autenticado
  
  return <div>Conteúdo protegido</div>
}
```

### 2. Proteger Páginas por Role

```typescript
import { useRequireRole } from "@/hooks/use-auth-redirect"

export default function AdminPage() {
  useRequireRole("admin", "/") // Redireciona para home se não for admin
  
  return <div>Página de admin</div>
}
```

### 3. Redirecionar Usuários Autenticados

```typescript
import { useRedirectIfAuthenticated } from "@/hooks/use-auth-redirect"

export default function LoginPage() {
  useRedirectIfAuthenticated("/dashboard") // Redireciona se já logado
  
  return <div>Formulário de login</div>
}
```

### 4. Logout Manual com Redirecionamento

```typescript
import { useAuth } from "@/hooks/use-auth"

export default function SomeComponent() {
  const { logoutAndRedirect } = useAuth()
  
  const handleLogout = () => {
    logoutAndRedirect() // Faz logout e redireciona para home
  }
  
  return <button onClick={handleLogout}>Sair</button>
}
```

## Fluxo de Segurança

1. **Requisição com token expirado** → Interceptor detecta erro 401
2. **Limpeza automática** → Remove dados do localStorage
3. **Redirecionamento automático** → Vai para home (`/`)
4. **Proteção de rotas** → Hooks verificam autenticação antes de renderizar

## Benefícios

- ✅ **Automático** - Não precisa tratar 401 manualmente em cada requisição
- ✅ **Consistente** - Comportamento uniforme em toda aplicação
- ✅ **Flexível** - Hooks para diferentes cenários de proteção
- ✅ **Simples** - Fácil de usar e implementar
- ✅ **Seguro** - Limpa dados sensíveis automaticamente

## Exemplos Práticos

### Dashboard do Prestador
```typescript
export default function DashboardPage() {
  useRequireAuth("/login") // Só prestadores autenticados
  // ... componente
}
```

### Página de Admin
```typescript
export default function AdminPage() {
  useRequireRole("admin", "/") // Só admins
  // ... componente
}
```

### Página de Login
```typescript
export default function LoginPage() {
  useRedirectIfAuthenticated("/dashboard") // Não mostra login se já logado
  // ... componente
}
```

### Página de Chat (requer autenticação)
```typescript
export default function ChatPage() {
  useRequireAuth("/login") // Protege chat
  // ... componente
}
```
