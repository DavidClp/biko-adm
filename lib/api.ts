// api.ts
import axios, { AxiosError, AxiosInstance } from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined")
}

// Função global para limpar dados de autenticação
let clearAuthCallback: (() => void) | null = null

export const setClearAuthCallback = (callback: () => void) => {
  clearAuthCallback = callback
}

// Cria instância do axios
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interceptor para tratar erros da API
api.interceptors.response.use(
  (response) => response.data, // já retorna só `data`
  (error: AxiosError) => {
    console.error("API request failed:", error)
    
    // Se for erro 401 (não autorizado) ou 403 (proibido), limpar dados de autenticação e redirecionar
   /*  if (error.response?.status === 401 || error.response?.status === 403) {
      // Limpar dados de autenticação do localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("userData")
        localStorage.removeItem("routerBeforeLogin")
        
        // Chamar callback para atualizar estado do usuário no contexto
        if (clearAuthCallback) {
          clearAuthCallback()
        }
        
        // Só redirecionar se não estivermos na página de login/registro
        const currentPath = window.location.pathname
        if (currentPath !== "/login" && currentPath !== "/register-client" && currentPath !== "/register-provider") {
          // Mostrar notificação para o usuário
          console.warn("Sessão expirada. Redirecionando para login...")
          
          // Redirecionar para login em vez de home
          window.location.href = "/login"
        }
      }
    } */
    
    // Normaliza erro para React Query / seu app
    return Promise.reject({
      status: error.response?.status,
      message:
        (error.response?.data as any)?.message ||
        error.message ||
        "Erro desconhecido",
    })
  }
)

export { api }
