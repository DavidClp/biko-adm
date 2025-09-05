// api.ts
import axios, { AxiosError, AxiosInstance } from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined")
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
    
    // Se for erro 401 (não autorizado), limpar dados de autenticação e redirecionar
    if (error.response?.status === 401) {
      // Limpar dados de autenticação do localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("userData")
        localStorage.removeItem("routerBeforeLogin")
        
        // Redirecionar para a home
        window.location.href = "/"
      }
    }
    
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
