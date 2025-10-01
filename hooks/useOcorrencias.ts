import { createOcorrencia, deleteOcorrencia, getAllOcorrencias, getOcorrencia, getOcorrenciasByUser, getRespostasOcorrencia, salvarSatisfacaoOcorrencia, searchOcorrencias, updateOcorrencia } from '@/services/ocorrencias';
import { CreateOcorrenciaRequest, Ocorrencia, RespostaOcorrencia } from '@/types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCreateOcorrencia() {
  const queryClient = useQueryClient();

  return useMutation<Ocorrencia, Error, CreateOcorrenciaRequest>({
    mutationFn: createOcorrencia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ocorrencias'] });
    },
    onError: (error) => {
      console.error('Erro ao criar ocorrência:', error);
    },
  });
}

export function useOcorrenciasByUser(usuarioId: number, tipo?: string, enabled = true) {
  return useQuery<Ocorrencia[], Error>({
    queryKey: ['ocorrencias', 'user', usuarioId, tipo],
    queryFn: () => getOcorrenciasByUser(usuarioId, tipo),
    enabled: enabled && !!usuarioId,
  });
}

export function useOcorrencia(id: number, enabled = true) {
  return useQuery<Ocorrencia, Error>({
    queryKey: ['ocorrencias', id],
    queryFn: () => getOcorrencia(id),
    enabled: enabled && !!id,
  });
}

export function useUpdateOcorrencia() {
  const queryClient = useQueryClient();

  return useMutation<Ocorrencia, Error, { id: number; data: Partial<CreateOcorrenciaRequest> }>({
    mutationFn: ({ id, data }) => updateOcorrencia(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ocorrencias'] });
      queryClient.invalidateQueries({ queryKey: ['ocorrencias', variables.id] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar ocorrência:', error);
    },
  });
}

export function useDeleteOcorrencia() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteOcorrencia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ocorrencias'] });
    },
    onError: (error) => {
      console.error('Erro ao deletar ocorrência:', error);
    },
  });
}

export function useSearchOcorrencias(protocolo: string, enabled = true) {
  return useQuery<Ocorrencia[], Error>({
    queryKey: ['ocorrencias', 'search', protocolo],
    queryFn: () => searchOcorrencias(protocolo),
    enabled: enabled && !!protocolo,
  });
}

export function useAllOcorrencias(status?: string, tipo?: string, enabled = true) {
  return useQuery<Ocorrencia[], Error>({
    queryKey: ['ocorrencias', 'all', status, tipo],
    queryFn: () => getAllOcorrencias(status, tipo),
    enabled,
  });
}

export function useSalvarSatisfacaoOcorrencia() {
  const queryClient = useQueryClient();

  return useMutation<{ retorno: string }, Error, { ocorrenciaId: number; satisfacao: string }>({
    mutationFn: ({ ocorrenciaId, satisfacao }) => salvarSatisfacaoOcorrencia(ocorrenciaId, satisfacao),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ocorrencias'] });
    },
    onError: (error) => {
      console.error('Erro ao salvar satisfação da ocorrência:', error);
    },
  });
}

export function useRespostasOcorrencia(ocorrenciaId: number, enabled = true) {
  return useQuery<RespostaOcorrencia[], Error>({
    queryKey: ['ocorrencias', 'respostas', ocorrenciaId],
    queryFn: () => getRespostasOcorrencia(ocorrenciaId),
    enabled: enabled && !!ocorrenciaId,
  });
}
