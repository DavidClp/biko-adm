"use client";

import { useState, useRef } from "react";
import { useProvider } from "@/hooks/use-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Camera, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/lib/types";

interface ImgProfileCardProps {
    providerId: string;
}

export function ImgProfileCard({ providerId }: ImgProfileCardProps) {
    const { updateImgProfileMutation } = useProvider({ providerId });

    const { user, setUser } = useAuth();
    const provider = user?.provider;

    const { mutate: updateImgProfile, isPending } = updateImgProfileMutation;
    const { toast } = useToast();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "Arquivo inválido",
                    description: "Por favor, selecione apenas arquivos de imagem.",
                    variant: "destructive",
                });
                return;
            }

            // Validar tamanho (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Arquivo muito grande",
                    description: "A imagem deve ter no máximo 5MB.",
                    variant: "destructive",
                });
                return;
            }

            setSelectedFile(file);

            // Criar preview
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            updateImgProfile(formData as any, {
                onSuccess: (data) => {
                    setUser({
                        ...user,
                        provider: {
                            ...provider,
                            photoUrl: data?.photoUrl
                        }
                    } as User);

                    setSelectedFile(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }
            });

        } catch (error) {
            console.error('Erro no upload:', error);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileInputClick = () => {
        fileInputRef.current?.click();
    };

    console.log("provider", provider);
    console.log("previewUrl", previewUrl);
    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
                <CardDescription>
                    Atualize sua foto de perfil para melhorar sua presença
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Avatar atual */}
                <div className="flex justify-center">
                    <Avatar className="w-24 h-24">
                        <AvatarImage
                            src={previewUrl || provider?.photoUrl}
                            alt={provider?.name || "Foto de perfil"}
                        />
                        <AvatarFallback className="text-lg">
                            {provider?.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Botão de upload */}
                <div className="space-y-4 max-w-48 mx-auto">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <Button
                        onClick={handleFileInputClick}
                        variant="outline"
                        className="w-full"
                        disabled={isPending}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        {selectedFile ? "Trocar Imagem" : "Selecionar Imagem"}
                    </Button>

                    {/* Preview e ações */}
                    {selectedFile && (
                        <div className="space-y-3">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                    Nova imagem selecionada
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleUpload}
                                    disabled={isPending}
                                    className="flex-1"
                                >
                                    {isPending ? (
                                        <>
                                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Confirmar
                                        </>
                                    )}
                                </Button>

                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    disabled={isPending}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dicas */}
                <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Formatos aceitos: JPG, PNG, GIF</p>
                    <p>• Tamanho máximo: 5MB</p>
                    <p>• Recomendado: imagem quadrada para melhor resultado</p>
                </div>
            </CardContent>
        </Card>
    );
}
