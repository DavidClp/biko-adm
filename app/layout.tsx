import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { QueryProvider } from "@/components/query-provider"
import { Toaster } from "@/components/ui/toaster"
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";

export const metadata: Metadata = {
  title: "Biko - Plataforma de Serviços",
  description: "Conecte-se com os melhores prestadores de serviços da sua região",
  generator: "v0.app",
  openGraph: {
    type: "website",
    url: "https://bikoservicos.com.br",
    title: "Biko - Plataforma de Serviços",
    description: "Conecte-se com os melhores prestadores de serviços da sua região",
    siteName: "Biko",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
