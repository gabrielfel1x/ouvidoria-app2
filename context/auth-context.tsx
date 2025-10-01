import { api } from '@/api/config';
import { updateApiAuthorizationHeader } from '@/src/lib/axios';
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from '@/storage/storage-auth-token';
import { LoginRequest, LoginResponse, User } from '@/types/types';
import { router } from 'expo-router';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface AuthContextDataProps {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signIn: (data: LoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = useCallback(async (data: LoginRequest): Promise<void> => {
    try {
      const response = await api.post<LoginResponse>('/login', data);
      
      if ('erro' in response.data) {
        throw new Error(response.data.erro as unknown as string);
      }

      const { token, ...userData } = response.data;

      if (!token) {
        throw new Error('Token não retornado pela API');
      }

      await storageAuthTokenSave({
        token,
        user: userData,
      });

      updateApiAuthorizationHeader(token);

      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      setIsLoggedIn(false);
      setUser(null);
      
      await storageAuthTokenRemove();
      
      delete api.defaults.headers.common['token'];

      router.replace('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, []);

  const loadAuthToken = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const authData = await storageAuthTokenGet();
      
      if (authData?.token) {
        updateApiAuthorizationHeader(authData.token);
        
        setUser(authData.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Erro ao carregar token:', error);
      await signOut();
    } finally {
      setIsLoading(false);
    }
  }, [signOut]);

  useEffect(() => {
    loadAuthToken();
  }, [loadAuthToken]);

  const contextValue = useMemo(() => ({
    user,
    isLoggedIn,
    isLoading,
    signIn,
    signOut
  }), [user, isLoggedIn, isLoading, signIn, signOut]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personalizado para acessar o contexto de autenticação
 */
export function useAuth(): AuthContextDataProps {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

