import { api } from '@/api/config';
import { Categoria } from '@/types/types';

/**
 * Lista todas as categorias disponíveis
 * @returns Array de categorias
 */
export async function getCategorias(): Promise<Categoria[]> {
  const response = await api.get<Categoria[]>('/categorias');
  return response.data;
}

/**
 * Obtém uma categoria específica
 * @param id - ID da categoria
 * @returns Categoria
 */
export async function getCategoria(id: number): Promise<Categoria> {
  const response = await api.get<Categoria>(`/categorias/${id}`);
  return response.data;
}

/**
 * Cria uma nova categoria
 * @param data - Dados da categoria
 * @returns Categoria criada
 */
export async function createCategoria(data: { nome: string; setor: string }): Promise<Categoria> {
  const response = await api.post<Categoria>('/categorias', { categoria: data });
  return response.data;
}

/**
 * Atualiza uma categoria
 * @param id - ID da categoria
 * @param data - Dados para atualizar
 * @returns Categoria atualizada
 */
export async function updateCategoria(id: number, data: { nome?: string; setor?: string }): Promise<Categoria> {
  const response = await api.put<Categoria>(`/categorias/${id}`, { categoria: data });
  return response.data;
}

/**
 * Deleta uma categoria
 * @param id - ID da categoria
 */
export async function deleteCategoria(id: number): Promise<void> {
  await api.delete(`/categorias/${id}`);
}

