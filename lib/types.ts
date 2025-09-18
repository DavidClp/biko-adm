import { subscriptionsAttributes } from "@/app/dashboard/components/interfaces"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  statusCode?: number
}

export interface City {
  id: string
  name: string
  state: {
    id: string
    initials: string
    name: string
  }
  country?: string
  createdAt?: string
  updatedAt?: string
}

// Tipos para autenticação
export interface LoginResponse {
  token: string
  user: User
  refreshToken?: string
}

export interface RegisterResponse {
  token: string
  user: User
  message?: string
}

export enum UserRole {
  CLIENT = 'CLIENT',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN'
}


export interface User {
  id: string
  name: string
  email: string
  role: UserRole;
  createdAt?: string
  updatedAt?: string;
  client?: Client | null;
  provider?: Provider | null;
  subscription?: subscriptionsAttributes | null;
  subscription_id?: string | null;
}



export interface Client extends User {
  phone: string
  userId: string
  createdAt?: string
}

export interface Provider extends User {
  phone: string
  services: string[]
  servicesNames: string[]
  cityId: string;
  cityName: string;
  description: string
  photoUrl?: string
  createdAt: string
  socialMedia?: {
    instagram?: string
    facebook?: string
  }
  userId: string
  experience: string
  portfolio?: string
  website?: string
  instagram?: string
  facebook?: string
  rating?: number
  reviews?: number
  verified?: boolean
  is_listed?: boolean
}


export type requestStatus =  "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "ON_BUDGET"

export type requestBudgetStatus =  "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED"

export interface IRequestService {
  id: string;
  clientId: string;
  providerId: string;
  service_type: string;
  description: string;
  address: string;
  urgency: "urgent" | "normal" | "low"; // se houver categorias
  value: string; // poderia ser number se o backend tratar como número
  status:requestStatus,
  createdAt: string;
  client: Client;
  provider: Provider;
  unreadMessages?: number;
}


export interface Service {
  id: string
  name: string
  description: string
  category: string
  price?: number
  priceType?: "hourly" | "fixed" | "negotiable"
}

// Tipos para avaliações
export interface Review {
  id: string
  rating: number
  comment: string
  clientId: string
  providerId: string
  serviceId?: string
  createdAt: string
  client?: User
}

// Tipos para agendamentos
export interface Appointment {
  id: string
  clientId: string
  providerId: string
  serviceId?: string
  date: string
  time: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes?: string
  price?: number
  client?: User
  provider?: User
  service?: Service
}

type MessageType = "TEXT" | "PROPOSAL" | "IMAGE" | "VIDEO" | "PROPOSAL_REJECTED" | "PROPOSAL_ACCEPTED" | "PROPOSAL_CANCELLED"

export interface Message {
  id: string
  content: string
  sender_id: string
  receiver_id: string
  request_id: string
  viewed: boolean
  createdAt: string
  sender?: User
  receiver?: User
  type: MessageType
}

// Tipos para notificações
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  actionUrl?: string
}

// Tipos para paginação
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Tipos para filtros
export interface SearchFilters {
  query?: string
  category?: string
  location?: string
  priceMin?: number
  priceMax?: number
  rating?: number
  verified?: boolean
  availability?: string[]
}

// Tipos para uploads
export interface FileUpload {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedAt: string
}

// Tipos para configurações
export interface AppConfig {
  maintenance: boolean
  version: string
  features: {
    chat: boolean
    payments: boolean
    reviews: boolean
    notifications: boolean
  }
}

// Tipos para erros
export interface ApiError {
  code: string
  message: string
  details?: any
  statusCode: number
}

// Tipos para sucesso
export interface ApiSuccess<T = any> {
  success: true
  count: number
  data: T | T[]
  message?: string
}

// Tipos para validação
export interface ValidationError {
  field: string
  message: string
  value?: any
}

export interface ValidationResponse {
  valid: boolean
  errors: ValidationError[]
}
