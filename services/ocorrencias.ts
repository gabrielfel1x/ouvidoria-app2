import { api } from '@/api/config';
import { CreateOcorrenciaRequest, Ocorrencia, RespostaOcorrencia } from '@/types/types';

export async function createOcorrencia(data: CreateOcorrenciaRequest): Promise<Ocorrencia> {
  const response = await api.post<Ocorrencia>('/ocorrencias', data);
  return response.data;
}

export async function getOcorrenciasByUser(usuarioId: number, tipo?: string): Promise<Ocorrencia[]> {
  const params = tipo ? { tipo } : {};
  const response = await api.get<Ocorrencia[]>(`/usuarios/${usuarioId}/ocorrencias`, { params });
  return response.data;
}

export async function getOcorrencia(id: number): Promise<Ocorrencia> {
  const response = await api.get<Ocorrencia>(`/ocorrencias/${id}`);
  return response.data;
}

export async function updateOcorrencia(id: number, data: Partial<CreateOcorrenciaRequest>): Promise<Ocorrencia> {
  const response = await api.put<Ocorrencia>(`/ocorrencias/${id}`, data);
  return response.data;
}

export async function deleteOcorrencia(id: number): Promise<void> {
  await api.delete(`/ocorrencias/${id}`);
}

export async function searchOcorrencias(protocolo: string): Promise<Ocorrencia[]> {
  const response = await api.get<Ocorrencia[]>(`/ocorrencias/search?protocolo=${protocolo}`);
  return response.data;
}

export async function getAllOcorrencias(status?: string, tipo?: string): Promise<Ocorrencia[]> {
  const params: any = {};
  if (status) params.status = status;
  if (tipo) params.tipo = tipo;
  
  const response = await api.get<Ocorrencia[]>('/ocorrencias/all', { params });
  return response.data;
}

export async function salvarSatisfacaoOcorrencia(ocorrenciaId: number, satisfacao: string): Promise<{ retorno: string }> {
  const response = await api.post<{ retorno: string }>('/ocorrencias/salvar_satisfacao_do_usuario', {
    ocorrencia_id: ocorrenciaId,
    satisfacao_do_usuario: satisfacao
  });
  return response.data;
}

export async function getRespostasOcorrencia(ocorrenciaId: number): Promise<RespostaOcorrencia[]> {
  const response = await api.get<RespostaOcorrencia[]>(`/ocorrencias/${ocorrenciaId}/respostas_ocorrencia`);
  return response.data;
}
