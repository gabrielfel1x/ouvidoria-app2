import {
    atualizarToken,
    AtualizarTokenRequest,
    ChangePasswordRequest,
    desativarConta,
    DesativarContaRequest,
    esqueciSenha,
    EsqueciSenhaRequest,
    getUsuario,
    updateUsuario,
    UpdateUsuarioRequest
} from '@/services/usuarios';
import { User } from '@/types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useUsuario(id: number, enabled = true) {
  return useQuery<User, Error>({
    queryKey: ['usuario', id],
    queryFn: () => getUsuario(id),
    enabled,
  });
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateUsuarioRequest>({
    mutationFn: updateUsuario,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['usuario', variables.id], data);
      queryClient.invalidateQueries({ queryKey: ['usuario'] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar usuário:', error);
    },
  });
}

export function useDesativarConta() {
  return useMutation<any, Error, DesativarContaRequest>({
    mutationFn: desativarConta,
    onError: (error) => {
      console.error('Erro ao desativar conta:', error);
    },
  });
}

export function useAtualizarToken() {
  return useMutation<any, Error, AtualizarTokenRequest>({
    mutationFn: atualizarToken,
    onError: (error) => {
      console.error('Erro ao atualizar token:', error);
    },
  });
}

export function useEsqueciSenha() {
  return useMutation<any, Error, EsqueciSenhaRequest>({
    mutationFn: esqueciSenha,
    onError: (error) => {
      console.error('Erro ao enviar email de recuperação:', error);
    },
  });
}

export function useChangePassword() {
  return useMutation<any, Error, ChangePasswordRequest>({
    mutationFn: async (data) => {
      throw new Error('Funcionalidade de alteração de senha não está disponível na API. Use "Esqueci minha senha" para redefinir.');
    },
    onError: (error) => {
      console.error('Erro ao alterar senha:', error);
    },
  });
}
