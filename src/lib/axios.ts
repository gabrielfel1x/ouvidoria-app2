import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000 * 30,
});

/**
 * Adiciona o token JWT no header de todas as requisições
 * A API usa o header "token" (não "Authorization: Bearer")
 */
export function updateApiAuthorizationHeader(token: string): void {
  http.defaults.headers.common['token'] = token;
}

/**
 * Remove o token JWT dos headers
 */
export function removeApiAuthorizationHeader(): void {
  delete http.defaults.headers.common['token'];
}

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento de erro 401/403 - Token inválido ou expirado
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Aqui você pode adicionar lógica para fazer logout automático
      // ou redirecionar para a tela de login
    }
    return Promise.reject(error);
  }
);

