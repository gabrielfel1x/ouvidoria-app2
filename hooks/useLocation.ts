import {
    getCurrentPositionAsync,
    LocationAccuracy,
    type LocationObject,
    requestForegroundPermissionsAsync,
    stopLocationUpdatesAsync,
    watchPositionAsync,
} from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner-native';

interface LocationState {
  location: LocationObject | null;
  isLoading: boolean;
  error: string | null;
  accuracy: number | null;
  isWatching: boolean;
}

interface UseLocationOptions {
  enableWatching?: boolean;
  watchInterval?: number;
  watchDistance?: number;
  accuracy?: LocationAccuracy;
  autoRequest?: boolean;
}

export const useLocation = (options: UseLocationOptions = {}) => {
  const {
    enableWatching = false,
    watchInterval = 1000,
    watchDistance = 1,
    accuracy = LocationAccuracy.Highest,
    autoRequest = true,
  } = options;

  const [state, setState] = useState<LocationState>({
    location: null,
    isLoading: false,
    error: null,
    accuracy: null,
    isWatching: false,
  });

  const watchSubscriptionRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  // Função para solicitar permissões
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const { granted } = await requestForegroundPermissionsAsync();
      if (!granted) {
        setState(prev => ({
          ...prev,
          error: 'Permissão de localização negada',
          isLoading: false,
        }));
        toast.error('Permissão necessária', {
          description: 'Precisamos de permissão para acessar sua localização.',
        });
        return false;
      }
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao solicitar permissões',
        isLoading: false,
      }));
      return false;
    }
  }, []);

  // Função para obter localização atual
  const getCurrentLocation = useCallback(async (): Promise<LocationObject | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return null;

      const currentPosition = await getCurrentPositionAsync({
        accuracy,
      });

      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          location: currentPosition,
          accuracy: currentPosition.coords.accuracy,
          isLoading: false,
          error: null,
        }));

        toast.success('Localização obtida!', {
          description: `Precisão: ${Math.round(currentPosition.coords.accuracy || 0)}m`,
        });
      }

      return currentPosition;
    } catch (error: any) {
      if (isMountedRef.current) {
        const errorMessage = error?.message || 'Erro ao obter localização';
        setState(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));

        toast.error('Erro na localização', {
          description: 'Não foi possível obter sua localização. Tente novamente.',
        });
      }
      return null;
    }
  }, [requestPermissions, accuracy]);

  // Função para iniciar monitoramento contínuo
  const startWatching = useCallback(async (): Promise<boolean> => {
    if (state.isWatching) return true;

    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return false;

      const subscription = await watchPositionAsync(
        {
          accuracy,
          timeInterval: watchInterval,
          distanceInterval: watchDistance,
        },
        (location) => {
          if (isMountedRef.current) {
            setState(prev => ({
              ...prev,
              location,
              accuracy: location.coords.accuracy,
              error: null,
            }));
          }
        }
      );

      watchSubscriptionRef.current = subscription;
      
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, isWatching: true }));
      }

      return true;
    } catch (error: any) {
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          error: error?.message || 'Erro ao iniciar monitoramento',
        }));
      }
      return false;
    }
  }, [state.isWatching, requestPermissions, accuracy, watchInterval, watchDistance]);

  // Função para parar monitoramento
  const stopWatching = useCallback(async () => {
    if (watchSubscriptionRef.current) {
      await stopLocationUpdatesAsync(watchSubscriptionRef.current);
      watchSubscriptionRef.current = null;
    }
    
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, isWatching: false }));
    }
  }, []);

  // Função para limpar estado
  const clearLocation = useCallback(() => {
    setState(prev => ({
      ...prev,
      location: null,
      error: null,
      accuracy: null,
    }));
  }, []);

  // Função para resetar erros
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-request location se habilitado
  useEffect(() => {
    if (autoRequest) {
      getCurrentLocation();
    }
  }, [autoRequest, getCurrentLocation]);

  // Iniciar/parar monitoramento baseado na opção
  useEffect(() => {
    if (enableWatching) {
      startWatching();
    } else {
      stopWatching();
    }

    return () => {
      stopWatching();
    };
  }, [enableWatching, startWatching, stopWatching]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stopWatching();
    };
  }, [stopWatching]);

  return {
    ...state,
    getCurrentLocation,
    startWatching,
    stopWatching,
    clearLocation,
    clearError,
    requestPermissions,
  };
};
