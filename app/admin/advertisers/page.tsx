"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff, Building2, Mail, Phone, ArrowLeft, Image } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ImageUploadBanner } from "@/components/image-upload-banner";
import { BannerPreview } from "@/components/banner-preview";
import { BANNER_POSITIONS, BANNER_SIZES } from "@/lib/banner-specs";
import { useCreateBanner } from "@/hooks/use-banner-mutations";
import { useAdvertisers, useCreateAdvertiser, useUpdateAdvertiser, useDeleteAdvertiser, Advertiser as AdvertiserType, Banner as BannerType } from "@/hooks/use-advertisers";
import { useRouter } from "next/navigation";
import { Header } from '@/components/navigation/header';

type Advertiser = AdvertiserType;
type Banner = BannerType;


export default function AdvertisersPage() {
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<Advertiser | null>(null);
  const [editingAdvertiser, setEditingAdvertiser] = useState<Partial<Advertiser>>({});
  const [newBanner, setNewBanner] = useState<Partial<Banner>>({});
  const [bannerImageUrl, setBannerImageUrl] = useState<string>('');

  const { user } = useAuth();
  const router = useRouter();
  const createBannerMutation = useCreateBanner();

  const { data: advertisers = [], isLoading: loading, error: fetchError, refetch } = useAdvertisers();
  const createAdvertiserMutation = useCreateAdvertiser();
  const updateAdvertiserMutation = useUpdateAdvertiser();
  const deleteAdvertiserMutation = useDeleteAdvertiser();

  // Os dados já vêm do React Query, não precisamos de estado local

  useEffect(() => {
    if (fetchError) {
      setError(fetchError.message || 'Erro ao carregar anunciantes');
    }
  }, [fetchError]);

  const handleCreateAdvertiser = async () => {
    createAdvertiserMutation.mutate(editingAdvertiser, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setEditingAdvertiser({});
      },
      onError: (error) => {
        setError(error.message || 'Erro ao criar anunciante');
      },
    });
  };

  const handleUpdateAdvertiser = async () => {
    if (!selectedAdvertiser) return;

    updateAdvertiserMutation.mutate(
      { id: selectedAdvertiser.id, data: editingAdvertiser },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedAdvertiser(null);
          setEditingAdvertiser({});
        },
        onError: (error) => {
          setError(error.message || 'Erro ao atualizar anunciante');
        },
      }
    );
  };

  const handleDeleteAdvertiser = async (advertiserId: string) => {
    if (!confirm('Tem certeza que deseja excluir este anunciante?')) return;

    deleteAdvertiserMutation.mutate(advertiserId, {
      onError: (error) => {
        setError(error.message || 'Erro ao excluir anunciante');
      },
    });
  };

  const handleCreateBanner = async () => {
    if (!selectedAdvertiser) return;

    // Verificar se há arquivo de imagem para enviar
    const imageInput = document.getElementById('banner-image-upload') as HTMLInputElement;
    const imageFile = imageInput?.files?.[0];

    const bannerData = {
      advertiserId: selectedAdvertiser.id,
      title: newBanner.title || '',
      description: newBanner.description,
      position: newBanner.position || 'PROVIDERS_LIST_TOP',
      size: newBanner.size || 'MOBILE_FULL_WIDTH',
      isActive: newBanner.isActive ?? true,
      publicVisibility: newBanner.publicVisibility || 'ALL',
      imageFile: imageFile,
      imageUrl: (!imageFile && bannerImageUrl && !bannerImageUrl.startsWith('blob:'))
        ? bannerImageUrl
        : undefined,
    };

    createBannerMutation.mutate(bannerData, {
      onSuccess: () => {
        refetch();
        setIsBannerDialogOpen(false);
        setNewBanner({});
        setBannerImageUrl('');
      },
      onError: (error) => {
        setError(error.message || 'Erro ao criar banner');
      },
    });
  };

  const openEditDialog = (advertiser: Advertiser) => {
    setSelectedAdvertiser(advertiser);
    setEditingAdvertiser(advertiser);
    setIsEditDialogOpen(true);
  };

  const openBannerDialog = (advertiser: Advertiser) => {
    setSelectedAdvertiser(advertiser);
    setIsBannerDialogOpen(true);
  };

  const goToDashboard = () => {
    router.push('/admin');
  };

  const goToBanners = () => {
    router.push('/admin/banners');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Anunciantes</h1>
              <p className="text-muted-foreground">Gerencie anunciantes e seus banners</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Voltar
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Button variant="outline" onClick={goToBanners}>
            <Image className="h-4 w-4 mr-2" />
            Ver Banners
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Anunciante
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Anunciante</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo anunciante
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={editingAdvertiser.name || ''}
                  onChange={(e) => setEditingAdvertiser({ ...editingAdvertiser, name: e.target.value })}
                  placeholder="Nome do anunciante"
                />
              </div>
              <div>
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  value={editingAdvertiser.company || ''}
                  onChange={(e) => setEditingAdvertiser({ ...editingAdvertiser, company: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingAdvertiser.email || ''}
                  onChange={(e) => setEditingAdvertiser({ ...editingAdvertiser, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={editingAdvertiser.phone || ''}
                  onChange={(e) => setEditingAdvertiser({ ...editingAdvertiser, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={editingAdvertiser.description || ''}
                  onChange={(e) => setEditingAdvertiser({ ...editingAdvertiser, description: e.target.value })}
                  placeholder="Descrição do anunciante"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateAdvertiser}>
                Criar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {error && (
          <Alert className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertisers.map((advertiser) => (
            <Card key={advertiser.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {advertiser.name}
                    </CardTitle>
                    {advertiser.company && (
                      <CardDescription className="mt-1">
                        {advertiser.company}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {advertiser.banners.length} banner(s)
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {advertiser.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {advertiser.email}
                    </div>
                  )}
                  {advertiser.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {advertiser.phone}
                    </div>
                  )}
                  {advertiser.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {advertiser.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(advertiser)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openBannerDialog(advertiser)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Novo Banner
                  </Button>
                  {advertiser.banners.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToBanners}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Banners
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAdvertiser(advertiser.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {advertisers.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum anunciante encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando seu primeiro anunciante
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Anunciante
            </Button>
          </div>
        )}

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Anunciante</DialogTitle>
              <DialogDescription>
                Atualize os dados do anunciante
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nome *</Label>
                <Input
                  id="edit-name"
                  value={editingAdvertiser.name || ''}
                  onChange={(e) => setEditingAdvertiser({ ...editingAdvertiser, name: e.target.value })}
                  placeholder="Nome do anunciante"
                />
              </div>
              <div>
                <Label htmlFor="edit-company">Empresa</Label>
                <Input
                  id="edit-company"
                  value={editingAdvertiser.company || ''}
                  onChange={(e) => setEditingAdvertiser({ ...editingAdvertiser, company: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingAdvertiser.email || ''}
                  onChange={(e) => setEditingAdvertiser({ ...editingAdvertiser, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input
                  id="edit-phone"
                  value={editingAdvertiser.phone || ''}
                  onChange={(e) => setEditingAdvertiser({ ...editingAdvertiser, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={editingAdvertiser.description || ''}
                  onChange={(e) => setEditingAdvertiser({ ...editingAdvertiser, description: e.target.value })}
                  placeholder="Descrição do anunciante"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateAdvertiser}>
                Atualizar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Criação de Banner */}
        <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Banner</DialogTitle>
              <DialogDescription>
                Crie um novo banner para {selectedAdvertiser?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulário */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="banner-title">Título *</Label>
                  <Input
                    id="banner-title"
                    value={newBanner.title || ''}
                    onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                    placeholder="Título do banner"
                  />
                </div>

                <div>
                  <Label htmlFor="banner-description">Descrição</Label>
                  <Textarea
                    id="banner-description"
                    value={newBanner.description || ''}
                    onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                    placeholder="Descrição do banner"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="banner-position">Posição *</Label>
                  <select
                    id="banner-position"
                    value={newBanner.position || ''}
                    onChange={(e) => setNewBanner({ ...newBanner, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecione uma posição</option>
                    {BANNER_POSITIONS.map((position) => (
                      <option key={position.value} value={position.value}>
                        {position.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="banner-size">Tamanho *</Label>
                  <select
                    id="banner-size"
                    value={newBanner.size || ''}
                    onChange={(e) => setNewBanner({ ...newBanner, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecione um tamanho</option>
                    {BANNER_SIZES.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="banner-visibility">Visibilidade Pública *</Label>
                  <select
                    id="banner-visibility"
                    value={newBanner.publicVisibility || 'ALL'}
                    onChange={(e) => setNewBanner({ ...newBanner, publicVisibility: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="ALL">Todos os usuários</option>
                    <option value="CLIENT">Apenas Clientes</option>
                    <option value="PROVIDER">Apenas Prestadores</option>
                  </select>
                </div>

                {/* Upload de Imagem */}
                <div>
                  <Label>Imagem do Banner *</Label>
                  <ImageUploadBanner
                    onImageUploaded={setBannerImageUrl}
                    currentImageUrl={bannerImageUrl}
                  />
                </div>
              </div>

              {/* Preview */}
              <div>
                {(newBanner.position && newBanner.size) && (
                  <BannerPreview
                    position={newBanner.position as any}
                    size={newBanner.size as any}
                    imageUrl={bannerImageUrl}
                    title={newBanner.title}
                    description={newBanner.description}
                  />
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsBannerDialogOpen(false);
                setNewBanner({});
                setBannerImageUrl('');
              }}>
                Cancelar
              </Button>
              <Button onClick={handleCreateBanner}>
                Criar Banner
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
