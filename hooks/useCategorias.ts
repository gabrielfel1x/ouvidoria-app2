import { getCategoria, getCategorias } from '@/services/categorias';
import { Categoria } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook para buscar todas as categorias
 */
export function useCategorias(enabled = true) {
  return useQuery<Categoria[], Error>({
    queryKey: ['categorias'],
    queryFn: getCategorias,
    enabled,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos já que categorias não mudam com frequência
  });
}

/**
 * Hook para buscar uma categoria específica
 */
export function useCategoria(id: number, enabled = true) {
  return useQuery<Categoria, Error>({
    queryKey: ['categorias', id],
    queryFn: () => getCategoria(id),
    enabled: enabled && !!id,
  });
}

