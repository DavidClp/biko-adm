# Etapa 1: Dependências
FROM node:20-alpine AS deps
WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apk add --no-cache libc6-compat

# Copiar apenas package files para cache de dependências
COPY package*.json ./

# Instalar TODAS as dependências (incluindo devDependencies para build)
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Etapa 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar node_modules da etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build da aplicação
RUN npm run build

# Etapa 3: Runtime (Produção)
FROM node:20-alpine AS runner
WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Instalar apenas dependências de runtime
RUN apk add --no-cache dumb-init

# Copiar package.json para instalar apenas production deps no runtime
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Copiar arquivos necessários
COPY --from=builder /app/public ./public

# Copiar build output com permissões corretas
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Usar dumb-init para gerenciamento de processos
CMD ["dumb-init", "node", "server.js"]