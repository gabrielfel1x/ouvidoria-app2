import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_STORAGE_KEY } from './storage-config';

export interface AuthStorageData {
  token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
    endereco?: string;
    bairro?: string;
    ativo: boolean;
  };
}

/**
 * Salva os dados de autenticação no AsyncStorage
 */
export async function storageAuthTokenSave(data: AuthStorageData): Promise<void> {
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Recupera os dados de autenticação do AsyncStorage
 */
export async function storageAuthTokenGet(): Promise<AuthStorageData | null> {
  try {
    const response = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    
    if (response) {
      return JSON.parse(response) as AuthStorageData;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Remove os dados de autenticação do AsyncStorage
 */
export async function storageAuthTokenRemove(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}

