// Exemplos de uso das tipagens globais
import { 
  ApiResponse, 
  User, 
  Provider, 
  Client, 
  Service, 
  PaginatedResponse,
  SearchFilters,
  ApiError 
} from './types'

// Exemplo de função que retorna uma resposta tipada
export async function getUserProfile(userId: string): Promise<ApiResponse<User>> {
  try {
    // Simulação de chamada da API
    const user: User = {
      id: userId,
      name: "João Silva",
      email: "joao@email.com",
      type: "client",
      phone: "+55 11 99999-9999"
    }
    
    return {
      success: true,
      data: user,
      message: "Usuário encontrado com sucesso"
    }
  } catch (error) {
    return {
      success: false,
      error: "Erro ao buscar usuário",
      statusCode: 500
    }
  }
}

// Exemplo de função com paginação
export async function getProviders(filters: SearchFilters): Promise<PaginatedResponse<Provider>> {
  // Simulação de dados
  const providers: Provider[] = [
    {
      id: "1",
      name: "Maria Santos",
      email: "maria@email.com",
      type: "provider",
      phone: "+55 11 88888-8888",
      services: ["Limpeza", "Organização"],
      location: "São Paulo, SP",
      description: "Profissional de limpeza e organização",
      experience: "5 anos",
      rating: 4.8,
      reviews: 25,
      verified: true
    }
  ]
  
  return {
    data: providers,
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  }
}

// Exemplo de função que lida com erros tipados
export function handleApiError(error: unknown): ApiError {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return error as ApiError
  }
  
  return {
    code: "UNKNOWN_ERROR",
    message: "Erro desconhecido ocorreu",
    statusCode: 500
  }
}

// Exemplo de validação de dados
export function validateUserData(data: Partial<User>): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push("Nome deve ter pelo menos 2 caracteres")
  }
  
  if (!data.email || !data.email.includes('@')) {
    errors.push("Email inválido")
  }
  
  if (!data.type || !['client', 'provider', 'admin'].includes(data.type)) {
    errors.push("Tipo de usuário inválido")
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Exemplo de função genérica para buscar dados
export async function fetchData<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, options)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    return {
      success: true,
      data,
      statusCode: response.status
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      statusCode: 500
    }
  }
}
