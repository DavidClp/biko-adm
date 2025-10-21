import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface GenerateRecommendationCodeData {
  cpf: string;
  pixKey: string;
}

interface CreateRecommendationData {
  recommendationCode: string;
}

interface Recommendation {
  id: string;
  giverId: string;
  receiverId: string;
  createdAt: string;
  giver: {
    id: string;
    email: string;
    role: string;
    recommendation_code: string | null;
  };
  receiver: {
    id: string;
    email: string;
    role: string;
    recommendation_code: string | null;
  };
}

interface UserRecommendationCode {
  id: string;
  email: string;
  recommendation_code: string | null;
  cpf: string | null;
  pix_key: string | null;
  role: string;
}

export function useRecommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRecommendationCode = async (data: GenerateRecommendationCodeData) => {
    setIsLoading(true);
    try {
      const result = await api.post('/recommendations/generate-code', data);

      toast({
        title: 'Sucesso!',
        description: 'Código de recomendação gerado com sucesso',
      });

      return result.data;
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.error?.detail || 'Erro ao gerar código',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createRecommendation = async (data: CreateRecommendationData) => {
    setIsLoading(true);
    try {
      const result = await api.post('/recommendations/create', data);

      toast({
        title: 'Sucesso!',
        description: 'Recomendação criada com sucesso',
      });

      return result.data;
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.error?.detail || 'Erro ao criar recomendação',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRecommendations = async (): Promise<Recommendation[]> => {
    setIsLoading(true);
    try {
      const result = await api.get('/recommendations/my-recommendations');
      return result.data;
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.error?.detail || 'Erro ao buscar recomendações',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getUserByRecommendationCode = async (code: string): Promise<UserRecommendationCode | null> => {
    setIsLoading(true);
    try {
      const result = await api.get(`/recommendations/user/${code}`);
      return result.data;
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.error?.detail || 'Código de recomendação não encontrado',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateRecommendationCode,
    createRecommendation,
    getUserRecommendations,
    getUserByRecommendationCode,
  };
}
