import {
    ATUALIZAR_TOKEN_ROUTE,
    DESATIVAR_CONTA_ROUTE,
    ESQUECI_SENHA_ROUTE,
    USUARIO_ROUTE
} from '@/api/api-routes';
import { api } from '@/api/config';
import { User } from '@/types/types';

export interface UpdateUsuarioRequest {
  id: number;
  data: {
    nome?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    bairro?: string;
  };
}

export interface ChangePasswordRequest {
  senhaAtual: string;
  novaSenha: string;
}

export interface DesativarContaRequest {
  usuario_id: number;
}

export interface AtualizarTokenRequest {
  usuario_id: number;
  token_cel: string;
}

export interface EsqueciSenhaRequest {
  email: string;
}

export interface ApiResponse {
  retorno: string;
}

export async function getUsuario(id: number): Promise<User> {
  const response = await api.get<User>(USUARIO_ROUTE(id));
  return response.data;
}

export async function updateUsuario({ id, data }: UpdateUsuarioRequest): Promise<User> {
  const response = await api.put<User>(USUARIO_ROUTE(id), data);
  return response.data;
}

export async function deleteUsuario(id: number): Promise<void> {
  await api.delete(USUARIO_ROUTE(id));
}

export async function desativarConta(data: DesativarContaRequest): Promise<ApiResponse> {
  const response = await api.post<ApiResponse>(DESATIVAR_CONTA_ROUTE(), data);
  return response.data;
}

export async function atualizarToken(data: AtualizarTokenRequest): Promise<ApiResponse> {
  const response = await api.post<ApiResponse>(ATUALIZAR_TOKEN_ROUTE(), data);
  return response.data;
}

export async function esqueciSenha(data: EsqueciSenhaRequest): Promise<ApiResponse> {
  const response = await api.post<ApiResponse>(ESQUECI_SENHA_ROUTE(), data, {
    headers: {
      'token': 'esqueci_a_senha'
    }
  });
  return response.data;
}
