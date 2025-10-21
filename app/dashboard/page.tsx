"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { useAuth } from "@/hooks/use-auth"
import { useRequireAuth } from "@/hooks/use-auth-redirect"
import { useProvider } from "@/hooks/use-provider"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Settings,
  MessageSquare,
  Wand2,
  ImageIcon,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Lock,
  UserRoundPen,
  Camera,
  BarChart3,
  Gift,
} from "lucide-react"
import { ProfileTab } from "./components/profile-tab"
import { RequestsTab } from "./components/requests-tab"
import { SubscriptionsTab } from "./components/subscriptions-tab"
import { LuMessageCircleMore } from "react-icons/lu";
import { SettingsTab } from "./components/settings-tab"
import { PhotoManagement } from "@/components/photo-management"
import { ProviderDashboard } from "@/components/provider-dashboard"
import { useSubscriptions } from "@/hooks/use-subscriptions"
import { ProviderRecommendationsTab } from "./components/provider-recommendations-tab"

export default function DashboardPage() {
  const { user } = useAuth();
  const { subscriptionPermissions, subscriptionPlanName } = useSubscriptions();

  const searchParams = useSearchParams()

  useRequireAuth("/login")

  // Estado para controlar qual aba está ativa
  const [activeTab, setActiveTab] = useState("requests")

  useEffect(() => {
    // Verifica se há parâmetro 'tab' na URL
    const tabParam = searchParams.get('tab')

    if (tabParam === 'subscriptions') {
      setActiveTab('subscriptions')
    } else if (tabParam === 'profile') {
      setActiveTab('profile')
    } else if (tabParam === 'photos') {
      setActiveTab('photos')
    } else if (tabParam === 'settings') {
      setActiveTab('settings')
    } else if (tabParam === 'metrics') {
      setActiveTab('metrics')
    } else if (tabParam === 'recommendations') {
      setActiveTab('recommendations')
    } else {
      setActiveTab('requests')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-4 md:mb-8">
          <h1 className="text-3xl font-bold">Painel do Prestador</h1>
          {/*  <p className="text-muted-foreground">Gerencie seu perfil, pedidos e assinatura</p> */}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <LuMessageCircleMore className="h-7 w-7" />
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserRoundPen className="h-7 w-7" />
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera className="h-7 w-7" />
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart3 className="h-7 w-7" />
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Gift className="h-7 w-7" />
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Star className="h-7 w-7" />
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            <RequestsTab />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <ProfileTab userId={user?.id!} providerId={user?.provider?.id!} />
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <PhotoManagement
              providerId={user?.provider?.id!}
              maxPhotos={subscriptionPermissions.includes('PORTFOLIO-PHOTOS-5') ? 5 : subscriptionPermissions.includes('PORTFOLIO-PHOTOS-10') ? 10 : 1}
              planName={subscriptionPlanName || 'GRATIS'}
            />
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <ProviderDashboard
              providerId={user?.provider?.id!}
              query={searchParams.get('q') || undefined}
              cityId={searchParams.get('cityId') || undefined}
            />
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <SubscriptionsTab />
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <ProviderRecommendationsTab />
          </TabsContent>

          {/* AI Tools Tab */}
{/*           <TabsContent value="ai-tools" className="space-y-6">
            <IATab />
          </TabsContent> */}

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}