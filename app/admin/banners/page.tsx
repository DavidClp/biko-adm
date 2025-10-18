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
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, TrendingUp, MousePointer, ArrowLeft } from "lucide-react";
import { useAllBanners } from "@/hooks/use-banners";
import { useUpdateBanner, useDeleteBanner } from "@/hooks/use-banner-mutations";
import { ImageUploadBanner } from "@/components/image-upload-banner";
import { useRouter } from "next/navigation";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner>>({});
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [editImageUrl, setEditImageUrl] = useState<string>('');
  
  const updateBannerMutation = useUpdateBanner();
  const deleteBannerMutation = useDeleteBanner();

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={goToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Banners</h1>
            <p className="text-muted-foreground">Gerencie todos os banners de publicidade</p>
          </div>
        </div>
      </div>

     {/*  {error && (
        <Alert className="mb-6">
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      )} */}

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <Label htmlFor="filter-position">Filtrar por posição:</Label>
          <select
            id="filter-position"
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">Todas as posições</option>
            {POSITIONS.map((position) => (
              <option key={position.value} value={position.value}>
                {position.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              
              <div className="flex gap-2 mt-4">
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
               {/*  {banner.imageUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(banner.imageUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Link
                  </Button>
                )} */}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Banner</DialogTitle>
            <DialogDescription>
              Atualize os dados do banner
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título *</Label>
              <Input
                id="edit-title"
                value={editingBanner.title || ''}
                onChange={(e) => setEditingBanner({...editingBanner, title: e.target.value})}
                placeholder="Título do banner"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={editingBanner.description || ''}
                onChange={(e) => setEditingBanner({...editingBanner, description: e.target.value})}
                placeholder="Descrição do banner"
                rows={2}
              />
            </div>
            <div>
              <Label>Imagem do Banner *</Label>
              <ImageUploadBanner
                onImageUploaded={setEditImageUrl}
                currentImageUrl={editImageUrl}
                inputId="edit-banner-image-upload"
              />
            </div>
            <div>
              <Label htmlFor="edit-position">Posição *</Label>
              <select
                id="edit-position"
                value={editingBanner.position || ''}
                onChange={(e) => setEditingBanner({...editingBanner, position: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione uma posição</option>
                {POSITIONS.map((position) => (
                  <option key={position.value} value={position.value}>
                    {position.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="edit-size">Tamanho *</Label>
              <select
                id="edit-size"
                value={editingBanner.size || ''}
                onChange={(e) => setEditingBanner({...editingBanner, size: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione um tamanho</option>
                {SIZES.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="edit-visibility">Visibilidade Pública *</Label>
              <select
                id="edit-visibility"
                value={editingBanner.publicVisibility || 'ALL'}
                onChange={(e) => setEditingBanner({...editingBanner, publicVisibility: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="ALL">Todos os usuários</option>
                <option value="CLIENT">Apenas Clientes</option>
                <option value="PROVIDER">Apenas Prestadores</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active"
                checked={editingBanner.isActive || false}
                onCheckedChange={(checked) => setEditingBanner({...editingBanner, isActive: checked})}
              />
              <Label htmlFor="edit-active">Banner ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateBanner}>
              Atualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
