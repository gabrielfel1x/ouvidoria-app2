import { register } from '@/services/login';
import { LoginResponse, RegisterRequest } from '@/types/types';
import { useMutation } from '@tanstack/react-query';

/**
 * Hook para registro de novo usuário usando TanStack Query
 * Retorna mutation com estados de loading, error e success
 */
export function useRegister() {
  return useMutation<LoginResponse, Error, RegisterRequest>({
    mutationFn: register,
    onError: (error) => {
      console.error('Erro ao registrar usuário:', error);
    },
  });
}

