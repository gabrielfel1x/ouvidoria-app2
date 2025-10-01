import { api } from '@/api/config';
import { CreateReclamacaoRequest, Reclamacao } from '@/types/types';

/**
 * Cria uma nova reclamação
 * @param data - Dados da reclamação
 * @returns Reclamação criada com número de protocolo
 */
export async function createReclamacao(data: CreateReclamacaoRequest): Promise<Reclamacao> {
    console.log(data);
  const response = await api.post<Reclamacao>('/reclamacoes', data);
  return response.data;
}

/**
 * Lista as reclamações do usuário
 * @param usuarioId - ID do usuário
 * @returns Array de reclamações
 */
export async function getReclamacoesByUser(usuarioId: number): Promise<Reclamacao[]> {
  const response = await api.get<Reclamacao[]>(`/usuarios/${usuarioId}/reclamacoes`);
  return response.data;
}

/**
 * Obtém uma reclamação específica
 * @param id - ID da reclamação
 * @returns Reclamação
 */
export async function getReclamacao(id: number): Promise<Reclamacao> {
  const response = await api.get<Reclamacao>(`/reclamacoes/${id}`);
  return response.data;
}

/**
 * Atualiza uma reclamação
 * @param id - ID da reclamação
 * @param data - Dados para atualizar
 * @returns Reclamação atualizada
 */
export async function updateReclamacao(id: number, data: Partial<CreateReclamacaoRequest>): Promise<Reclamacao> {
  const response = await api.put<Reclamacao>(`/reclamacoes/${id}`, data);
  return response.data;
}

/**
 * Deleta uma reclamação
 * @param id - ID da reclamação
 */
export async function deleteReclamacao(id: number): Promise<void> {
  await api.delete(`/reclamacoes/${id}`);
}

