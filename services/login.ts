import { LOGIN_ROUTE, REGISTER_ROUTE } from "@/api/api-routes";
import { api } from "@/api/config";
import { LoginRequest, LoginResponse, RegisterRequest } from "@/types/types";

/**
 * Realiza login do usuário
 * @param data - Dados de login (cpf_ou_email e senha)
 * @returns Dados do usuário autenticado com token
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(LOGIN_ROUTE(), data);
  return response.data;
}

/**
 * Realiza cadastro de novo usuário
 * @param data - Dados do novo usuário
 * @returns Dados do usuário cadastrado
 */
export async function register(data: RegisterRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(REGISTER_ROUTE(), data);
  return response.data;
}