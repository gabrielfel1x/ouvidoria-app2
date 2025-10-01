import { createReclamacao, deleteReclamacao, getReclamacao, getReclamacoesByUser, updateReclamacao } from '@/services/reclamacoes';
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

export function useUpdateReclamacao() {
  const queryClient = useQueryClient();

  return useMutation<Reclamacao, Error, { id: number; data: Partial<CreateReclamacaoRequest> }>({
    mutationFn: ({ id, data }) => updateReclamacao(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reclamacoes'] });
      queryClient.invalidateQueries({ queryKey: ['reclamacoes', variables.id] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar reclamação:', error);
    },
  });
}

export function useDeleteReclamacao() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteReclamacao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reclamacoes'] });
    },
    onError: (error) => {
      console.error('Erro ao deletar reclamação:', error);
    },
  });
}

