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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, TrendingUp, MousePointer, ArrowLeft, Upload, Image as ImageIcon, Settings, Users, Monitor, Smartphone } from "lucide-react";
import { useAllBanners } from "@/hooks/use-banners";
import { useUpdateBanner, useDeleteBanner, useCreateBanner } from "@/hooks/use-banner-mutations";
import { useAdvertisers } from "@/hooks/use-advertisers";
import { ImageUploadBanner } from "@/components/image-upload-banner";
import { useRouter } from "next/navigation";
import { getBannerImageSpecs } from "@/lib/banner-specs";
import { Header } from '@/components/navigation/header';

interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  position: string;
  size: string;
  isActive: boolean;
  clickCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publicVisibility: string;
  advertiserId?: string;
  advertiser: {
    id: string;
    name: string;
    company?: string;
  };
}

const POSITIONS = [
  { value: 'PROVIDERS_LIST_TOP', label: 'Lista de Providers - Topo' },
  { value: 'PROVIDERS_LIST_MIDDLE', label: 'Lista de Providers - Meio' },
  { value: 'PROVIDERS_LIST_BOTTOM', label: 'Lista de Providers - Final' },
  { value: 'PROVIDER_DETAIL_TOP', label: 'Detalhes do Provider - Topo' },
  { value: 'PROVIDER_DETAIL_SIDEBAR', label: 'Detalhes do Provider - Sidebar' },
  /*   { value: 'DASHBOARD_TOP', label: 'Dashboard - Topo' },
    { value: 'DASHBOARD_SIDEBAR', label: 'Dashboard - Sidebar' }, */
];

const SIZES = [
  { value: 'MOBILE_FULL_WIDTH', label: 'Mobile - Largura Completa' },
  { value: 'MOBILE_HALF_WIDTH', label: 'Mobile - Meia Largura' },
  { value: 'MOBILE_SQUARE', label: 'Mobile - Quadrado' },
  { value: 'MOBILE_RECTANGLE', label: 'Mobile - Retângulo' },
];

export default function BannersPage() {
  const router = useRouter();
  const { data: banners = [], isLoading: loading, error, refetch } = useAllBanners();
  const { data: advertisers = [] } = useAdvertisers();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner>>({});
  const [creatingBanner, setCreatingBanner] = useState<Partial<Banner>>({
    title: '',
    description: '',
    position: '',
    size: '',
    publicVisibility: 'ALL',
    isActive: true,
    advertiserId: ''
  });
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [editImageUrl, setEditImageUrl] = useState<string>('');
  const [createImageUrl, setCreateImageUrl] = useState<string>('');

  const updateBannerMutation = useUpdateBanner();
  const deleteBannerMutation = useDeleteBanner();
  const createBannerMutation = useCreateBanner();

  const handleCreateBanner = async () => {
    if (!creatingBanner.title || !creatingBanner.position || !creatingBanner.size || !creatingBanner.advertiserId) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Verificar se há arquivo de imagem para enviar
    const imageInput = document.getElementById('create-banner-image-upload') as HTMLInputElement;
    const imageFile = imageInput?.files?.[0];

    if (!imageFile && !createImageUrl) {
      alert('Por favor, selecione uma imagem para o banner');
      return;
    }

    const createData = {
      advertiserId: creatingBanner.advertiserId!,
      title: creatingBanner.title,
      description: creatingBanner.description,
      position: creatingBanner.position,
      size: creatingBanner.size,
      publicVisibility: creatingBanner.publicVisibility || 'ALL',
      isActive: creatingBanner.isActive ?? true,
      imageFile: imageFile,
      imageUrl: (!imageFile && createImageUrl && !createImageUrl.startsWith('blob:'))
        ? createImageUrl
        : undefined,
    };

    createBannerMutation.mutate(createData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setCreatingBanner({
          title: '',
          description: '',
          position: '',
          size: '',
          publicVisibility: 'ALL',
          isActive: true,
          advertiserId: ''
        });
        setCreateImageUrl('');
        alert('Banner criado com sucesso!');
      },
      onError: (error) => {
        alert(error.message || 'Erro ao criar banner');
      },
    });
  };

  const handleUpdateBanner = async () => {
    if (!selectedBanner) return;

    // Verificar se há arquivo de imagem para enviar
    const imageInput = document.getElementById('edit-banner-image-upload') as HTMLInputElement;
    const imageFile = imageInput?.files?.[0];

    const updateData = {
      ...editingBanner,
      imageFile: imageFile,
      imageUrl: (!imageFile && editImageUrl && !editImageUrl.startsWith('blob:'))
        ? editImageUrl
        : undefined,
    };

    updateBannerMutation.mutate(
      { id: selectedBanner.id, data: updateData },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedBanner(null);
          setEditingBanner({});
          setEditImageUrl('');
        },
        onError: (error) => {
          alert(error.message || 'Erro ao atualizar banner');
        },
      }
    );
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return;

    deleteBannerMutation.mutate(bannerId, {
      onError: (error) => {
        alert(error.message || 'Erro ao excluir banner');
      },
    });
  };

  const toggleBannerStatus = async (banner: Banner) => {
    updateBannerMutation.mutate(
      { id: banner.id, data: { isActive: !banner.isActive } },
      {
        onError: (error) => {
          alert(error.message || 'Erro ao alterar status do banner');
        },
      }
    );
  };

  const openEditDialog = (banner: Banner) => {
    setSelectedBanner(banner);
    setEditingBanner(banner);
    setEditImageUrl(banner.imageUrl);
    setIsEditDialogOpen(true);
  };

  const getPositionLabel = (position: string) => {
    return POSITIONS.find(p => p.value === position)?.label || position;
  };

  const getSizeLabel = (size: string) => {
    return SIZES.find(s => s.value === size)?.label || size;
  };

  const getImageSpecs = (position: string, size: string) => {
    if (!position || !size) return null;
    return getBannerImageSpecs(position as any, size as any);
  };

  const goToDashboard = () => {
    router.push('/admin');
  };

  const filteredBanners = filterPosition === 'all'
    ? banners
    : banners.filter(banner => banner.position === filterPosition);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={goToDashboard} className="shrink-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Banners</h1>
              <p className="text-muted-foreground">Gerencie todos os banners de publicidade</p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Banner
          </Button>
        </div>

        {/*  {error && (
        <Alert className="mb-6">
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      )} */}

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Label htmlFor="filter-position" className="text-sm font-medium">Filtrar por posição:</Label>
            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Selecione uma posição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as posições</SelectItem>
                {POSITIONS.map((position) => (
                  <SelectItem key={position.value} value={position.value}>
                    {position.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredBanners.map((banner) => (
            <Card key={banner.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{banner.title}</CardTitle>
                    <CardDescription>
                      {banner.advertiser.name}
                      {banner.advertiser.company && ` • ${banner.advertiser.company}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={banner.isActive ? "default" : "secondary"}>
                      {banner.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Preview da imagem */}
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Informações do banner */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Posição:</span>
                      <span className="font-medium">{getPositionLabel(banner.position)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tamanho:</span>
                      <span className="font-medium">{getSizeLabel(banner.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Visibilidade:</span>
                      <span className="font-medium">
                        {banner.publicVisibility === 'ALL' && 'Todos'}
                        {banner.publicVisibility === 'CLIENT' && 'Clientes'}
                        {banner.publicVisibility === 'PROVIDER' && 'Prestadores'}
                      </span>
                    </div>
                    {banner.description && (
                      <div>
                        <span className="text-muted-foreground">Descrição:</span>
                        <p className="text-sm mt-1 line-clamp-2">{banner.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Estatísticas */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span className="text-xs">Visualizações</span>
                      </div>
                      <div className="text-lg font-bold">{banner.viewCount}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <MousePointer className="h-4 w-4" />
                        <span className="text-xs">Cliques</span>
                      </div>
                      <div className="text-lg font-bold">{banner.clickCount}</div>
                    </div>
                  </div>

                  {/* Taxa de conversão */}
                  {/*   {banner.viewCount > 0 && (
                  <div className="text-center pt-2 border-t">
                    <div className="text-xs text-muted-foreground">Taxa de Clique</div>
                    <div className="text-sm font-medium">
                      {((banner.clickCount / banner.viewCount) * 100).toFixed(2)}%
                    </div>
                  </div>
                )} */}
                </div>

                <div className="flex flex-col gap-2 mt-4 ">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(banner)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleBannerStatus(banner)}
                  >
                    {banner.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        Ativar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteBanner(banner.id)}
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

        {filteredBanners.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {filterPosition === 'all' ? 'Nenhum banner encontrado' : 'Nenhum banner nesta posição'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {filterPosition === 'all'
                ? 'Crie banners através da página de anunciantes'
                : 'Nenhum banner ativo foi encontrado nesta posição'
              }
            </p>
            {filterPosition !== 'all' && (
              <Button variant="outline" onClick={() => setFilterPosition('all')}>
                Ver todos os banners
              </Button>
            )}
          </div>
        )}

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Edit className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Editar Banner</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Atualize as informações e configurações do banner
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Settings className="h-4 w-4" />
                  Informações Básicas
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title" className="text-sm font-medium">
                      Título do Banner *
                    </Label>
                    <Input
                      id="edit-title"
                      value={editingBanner.title || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                      placeholder="Digite o título do banner"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description" className="text-sm font-medium">
                      Descrição
                    </Label>
                    <Textarea
                      id="edit-description"
                      value={editingBanner.description || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                      placeholder="Descrição opcional do banner"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Imagem */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ImageIcon className="h-4 w-4" />
                Imagem do Banner
              </div>
              <Separator />

              <div className="space-y-4">
                {(() => {
                  const specs = getImageSpecs(editingBanner.position || '', editingBanner.size || '');
                  const canUpload = editingBanner.position && editingBanner.size;

                  return (
                    <>
                      {!canUpload && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-center gap-2 text-amber-800">
                            <Smartphone className="h-4 w-4" />
                            <span className="text-sm font-medium">Selecione posição e tamanho primeiro</span>
                          </div>
                          <p className="text-xs text-amber-700 mt-1">
                            Escolha a posição e tamanho do banner para ver as especificações da imagem necessária.
                          </p>
                        </div>
                      )}

                      {canUpload && specs && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-800 mb-2">
                            <Smartphone className="h-4 w-4" />
                            <span className="text-sm font-medium">Especificações da Imagem</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-blue-700 font-medium">Dimensões:</span>
                              <p className="text-blue-600">{specs.width} × {specs.height}px</p>
                            </div>
                            <div>
                              <span className="text-blue-700 font-medium">Proporção:</span>
                              <p className="text-blue-600">{specs.aspectRatio}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-blue-700 font-medium">Formato recomendado:</span>
                              <p className="text-blue-600">{specs.recommendedFormat}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-blue-700 font-medium">Descrição:</span>
                              <p className="text-blue-600 text-xs">{specs.description}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Imagem *</Label>
                        <ImageUploadBanner
                          onImageUploaded={setEditImageUrl}
                          currentImageUrl={editImageUrl}
                          inputId="edit-banner-image-upload"
                          disabled={!canUpload}
                        />
                        {!canUpload && (
                          <p className="text-xs text-muted-foreground">
                            Selecione a posição e tamanho para habilitar o upload
                          </p>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Configurações de Exibição */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Monitor className="h-4 w-4" />
                Configurações de Exibição
              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Posição *</Label>
                  <Select
                    value={editingBanner.position || ''}
                    onValueChange={(value) => setEditingBanner({ ...editingBanner, position: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecione a posição" />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map((position) => (
                        <SelectItem key={position.value} value={position.value}>
                          {position.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tamanho *</Label>
                  <Select
                    value={editingBanner.size || ''}
                    onValueChange={(value) => setEditingBanner({ ...editingBanner, size: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecione o tamanho" />
                    </SelectTrigger>
                    <SelectContent>
                      {SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Configurações de Visibilidade */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Users className="h-4 w-4" />
                Visibilidade
              </div>
              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Visibilidade Pública *</Label>
                  <Select
                    value={editingBanner.publicVisibility || 'ALL'}
                    onValueChange={(value) => setEditingBanner({ ...editingBanner, publicVisibility: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecione a visibilidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Todos os usuários</SelectItem>
                      <SelectItem value="CLIENT">Apenas Clientes</SelectItem>
                      <SelectItem value="PROVIDER">Apenas Prestadores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="edit-active" className="text-sm font-medium">
                      Status do Banner
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {editingBanner.isActive ? 'Banner está ativo e visível' : 'Banner está inativo e oculto'}
                    </p>
                  </div>
                  <Switch
                    id="edit-active"
                    checked={editingBanner.isActive || false}
                    onCheckedChange={(checked) => setEditingBanner({ ...editingBanner, isActive: checked })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpdateBanner}
                className="w-full sm:w-auto"
                disabled={updateBannerMutation.isPending}
              >
                {updateBannerMutation.isPending ? 'Atualizando...' : 'Atualizar Banner'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Criação */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Plus className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Criar Novo Banner</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Configure um novo banner de publicidade para exibir na plataforma
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Settings className="h-4 w-4" />
                  Informações Básicas
                </div>
                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Anunciante *</Label>
                    <Select
                      value={creatingBanner.advertiserId || ''}
                      onValueChange={(value) => setCreatingBanner({ ...creatingBanner, advertiserId: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione o anunciante" />
                      </SelectTrigger>
                      <SelectContent>
                        {advertisers.map((advertiser) => (
                          <SelectItem key={advertiser.id} value={advertiser.id}>
                            {advertiser.name} {advertiser.company && `• ${advertiser.company}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="create-title" className="text-sm font-medium">
                        Título do Banner *
                      </Label>
                      <Input
                        id="create-title"
                        value={creatingBanner.title || ''}
                        onChange={(e) => setCreatingBanner({ ...creatingBanner, title: e.target.value })}
                        placeholder="Digite o título do banner"
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-description" className="text-sm font-medium">
                        Descrição
                      </Label>
                      <Textarea
                        id="create-description"
                        value={creatingBanner.description || ''}
                        onChange={(e) => setCreatingBanner({ ...creatingBanner, description: e.target.value })}
                        placeholder="Descrição opcional do banner"
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Imagem */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <ImageIcon className="h-4 w-4" />
                  Imagem do Banner
                </div>
                <Separator />

                <div className="space-y-4">
                  {(() => {
                    const specs = getImageSpecs(creatingBanner.position || '', creatingBanner.size || '');
                    const canUpload = creatingBanner.position && creatingBanner.size;

                    return (
                      <>
                        {!canUpload && (
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-center gap-2 text-amber-800">
                              <Smartphone className="h-4 w-4" />
                              <span className="text-sm font-medium">Selecione posição e tamanho primeiro</span>
                            </div>
                            <p className="text-xs text-amber-700 mt-1">
                              Escolha a posição e tamanho do banner para ver as especificações da imagem necessária.
                            </p>
                          </div>
                        )}

                        {canUpload && specs && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-800 mb-2">
                              <Smartphone className="h-4 w-4" />
                              <span className="text-sm font-medium">Especificações da Imagem</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-blue-700 font-medium">Dimensões:</span>
                                <p className="text-blue-600">{specs.width} × {specs.height}px</p>
                              </div>
                              <div>
                                <span className="text-blue-700 font-medium">Proporção:</span>
                                <p className="text-blue-600">{specs.aspectRatio}</p>
                              </div>
                              <div className="col-span-2">
                                <span className="text-blue-700 font-medium">Formato recomendado:</span>
                                <p className="text-blue-600">{specs.recommendedFormat}</p>
                              </div>
                              <div className="col-span-2">
                                <span className="text-blue-700 font-medium">Descrição:</span>
                                <p className="text-blue-600 text-xs">{specs.description}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Imagem *</Label>
                          <ImageUploadBanner
                            onImageUploaded={setCreateImageUrl}
                            currentImageUrl={createImageUrl}
                            inputId="create-banner-image-upload"
                            disabled={!canUpload}
                          />
                          {!canUpload && (
                            <p className="text-xs text-muted-foreground">
                              Selecione a posição e tamanho para habilitar o upload
                            </p>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Configurações de Exibição */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Monitor className="h-4 w-4" />
                  Configurações de Exibição
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Posição *</Label>
                    <Select
                      value={creatingBanner.position || ''}
                      onValueChange={(value) => setCreatingBanner({ ...creatingBanner, position: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione a posição" />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITIONS.map((position) => (
                          <SelectItem key={position.value} value={position.value}>
                            {position.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tamanho *</Label>
                    <Select
                      value={creatingBanner.size || ''}
                      onValueChange={(value) => setCreatingBanner({ ...creatingBanner, size: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        {SIZES.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Configurações de Visibilidade */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Users className="h-4 w-4" />
                  Visibilidade
                </div>
                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Visibilidade Pública *</Label>
                    <Select
                      value={creatingBanner.publicVisibility || 'ALL'}
                      onValueChange={(value) => setCreatingBanner({ ...creatingBanner, publicVisibility: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione a visibilidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Todos os usuários</SelectItem>
                        <SelectItem value="CLIENT">Apenas Clientes</SelectItem>
                        <SelectItem value="PROVIDER">Apenas Prestadores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="create-active" className="text-sm font-medium">
                        Status do Banner
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {creatingBanner.isActive ? 'Banner será criado ativo' : 'Banner será criado inativo'}
                      </p>
                    </div>
                    <Switch
                      id="create-active"
                      checked={creatingBanner.isActive || false}
                      onCheckedChange={(checked) => setCreatingBanner({ ...creatingBanner, isActive: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateBanner}
                className="w-full sm:w-auto"
                disabled={createBannerMutation.isPending}
              >
                {createBannerMutation.isPending ? 'Criando...' : 'Criar Banner'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
