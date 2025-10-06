import { storageAuthTokenGet } from '@/storage/storage-auth-token';
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://ouvidoria-api-74b0526ccdf6.herokuapp.com/',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': true,
  },
});

/**
 * Adiciona o token JWT no header de todas as requisições
 * A API usa o header "token" (não "Authorization: Bearer")
 */
export function updateApiAuthorizationHeader(token: string): void {
  api.defaults.headers.common['token'] = token;
}

/**
 * Remove o token JWT dos headers
 */
export function removeApiAuthorizationHeader(): void {
  delete api.defaults.headers.common['token'];
}

/**
 * Interceptor de requisição que adiciona o token automaticamente
 * Apenas se o token não estiver já presente nos headers
 */
api.interceptors.request.use(
  async (config) => {
    // Se o token já estiver presente nos headers, não fazer nada
    if (config.headers['token']) {
      return config;
    }
    
    const authData = await storageAuthTokenGet();
    
    if (authData?.token) {
      config.headers['token'] = authData.token;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento de erro 401/403 - Token inválido ou expirado
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Aqui você pode adicionar lógica para fazer logout automático
    }
    return Promise.reject(error);
  }
);

export default api;