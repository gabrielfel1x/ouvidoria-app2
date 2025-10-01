import { createReclamacao, getReclamacao, getReclamacoesByUser } from '@/services/reclamacoes';
import { CreateReclamacaoRequest, Reclamacao } from '@/types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Hook para criar uma nova reclamação
 */
export function useCreateReclamacao() {
  const queryClient = useQueryClient();

  return useMutation<Reclamacao, Error, CreateReclamacaoRequest>({
    mutationFn: createReclamacao,
    onSuccess: () => {
      // Invalida a lista de reclamações para recarregar
      queryClient.invalidateQueries({ queryKey: ['reclamacoes'] });
    },
    onError: (error) => {
      console.error('Erro ao criar reclamação:', error);
    },
  });
}

/**
 * Hook para buscar reclamações do usuário
 */
export function useReclamacoesByUser(usuarioId: number, enabled = true) {
  return useQuery<Reclamacao[], Error>({
    queryKey: ['reclamacoes', 'user', usuarioId],
    queryFn: () => getReclamacoesByUser(usuarioId),
    enabled: enabled && !!usuarioId,
  });
}

/**
 * Hook para buscar uma reclamação específica
 */
export function useReclamacao(id: number, enabled = true) {
  return useQuery<Reclamacao, Error>({
    queryKey: ['reclamacoes', id],
    queryFn: () => getReclamacao(id),
    enabled: enabled && !!id,
  });
}

