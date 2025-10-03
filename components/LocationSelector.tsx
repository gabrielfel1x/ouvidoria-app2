import { useLocation } from '@/hooks/useLocation';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { toast } from 'sonner-native';

// Importação condicional do MapView apenas para plataformas nativas
let MapView: any = null;
let Marker: any = null;
let Region: any = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    Region = Maps.Region;
  } catch (error) {
    console.warn('react-native-maps não disponível:', error);
  }
}

const { width, height } = Dimensions.get('window');

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

interface LocationSelectorProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData | null;
  showMap?: boolean;
  mapHeight?: number;
  placeholder?: string;
  required?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationSelect,
  initialLocation = null,
  showMap = true,
  mapHeight = 250,
  placeholder = 'Digite o endereço ou use a localização atual...',
  required = false,
}) => {
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(initialLocation);
  const [mapRegion, setMapRegion] = useState<any>(null);
  
  const mapRef = useRef<any>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    location: currentLocation,
    isLoading: isLoadingLocation,
    accuracy,
    getCurrentLocation,
    clearError,
  } = useLocation({ autoRequest: false });

  // Atualizar região do mapa quando localização atual mudar
  useEffect(() => {
    if (currentLocation) {
      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy || undefined,
      };
      
      setSelectedLocation(newLocation);
      onLocationSelect(newLocation);
      
      setMapRegion({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [currentLocation]); // Removido onLocationSelect das dependências

  // Função para obter localização atual
  const handleGetCurrentLocation = useCallback(async () => {
    clearError();
    const location = await getCurrentLocation();
    
    if (location) {
      // Tentar obter endereço legível
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        if (reverseGeocode && reverseGeocode[0]) {
          const place = reverseGeocode[0];
          const addressParts = [
            place.street,
            place.streetNumber,
            place.district,
            place.city,
            place.region,
          ].filter(Boolean);
          
          const formattedAddress = addressParts.join(', ');
          setAddress(formattedAddress || `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`);
        } else {
          setAddress(`${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`);
        }
      } catch (error) {
        setAddress(`${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`);
      }
    }
  }, [getCurrentLocation, clearError]);

  // Função para pesquisar endereços com debounce
  const handleAddressSearch = useCallback(async (searchText: string) => {
    if (searchText.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Limpar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce de 500ms
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingAddress(true);
      
      try {
        const geocodeResults = await Location.geocodeAsync(searchText);
        
        if (geocodeResults && geocodeResults.length > 0) {
          const suggestions = await Promise.all(
            geocodeResults.slice(0, 5).map(async (result, index) => {
              try {
                const reverseGeocode = await Location.reverseGeocodeAsync({
                  latitude: result.latitude,
                  longitude: result.longitude,
                });
                
                let formattedAddress = searchText;
                
                if (reverseGeocode && reverseGeocode[0]) {
                  const place = reverseGeocode[0];
                  const addressParts = [
                    place.street,
                    place.streetNumber,
                    place.district,
                    place.city,
                    place.region,
                  ].filter(Boolean);
                  
                  if (addressParts.length > 0) {
                    formattedAddress = addressParts.join(', ');
                  }
                }
                
                return {
                  id: index,
                  latitude: result.latitude,
                  longitude: result.longitude,
                  formattedAddress,
                  coordinates: `${result.latitude.toFixed(6)}, ${result.longitude.toFixed(6)}`
                };
              } catch (reverseError) {
                return {
                  id: index,
                  latitude: result.latitude,
                  longitude: result.longitude,
                  formattedAddress: searchText,
                  coordinates: `${result.latitude.toFixed(6)}, ${result.longitude.toFixed(6)}`
                };
              }
            })
          );
          
          setAddressSuggestions(suggestions);
          setShowSuggestions(true);
        } else {
          setAddressSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Erro na pesquisa de endereço:', error);
        setAddressSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 500);
  }, []);

  // Função para selecionar endereço das sugestões
  const handleSelectAddress = useCallback((suggestion: any) => {
    const newLocation = {
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      accuracy: 10, // Assumimos precisão de 10m para endereços pesquisados
      address: suggestion.formattedAddress,
    };
    
    setAddress(suggestion.formattedAddress);
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation);
    setShowSuggestions(false);
    setAddressSuggestions([]);
    
    // Atualizar região do mapa
    setMapRegion({
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
    
    toast.success('Endereço selecionado!', {
      description: 'Localização atualizada com sucesso.',
    });
  }, [onLocationSelect]);

  // Função para mudança no input de endereço
  const handleAddressChange = useCallback((text: string) => {
    setAddress(text);
    if (text.length >= 3) {
      handleAddressSearch(text);
    } else {
      setShowSuggestions(false);
      setAddressSuggestions([]);
    }
  }, [handleAddressSearch]);

  // Função para fechar sugestões
  const handleCloseSuggestions = useCallback(() => {
    setShowSuggestions(false);
    setAddressSuggestions([]);
  }, []);

  // Função para quando o usuário toca no mapa
  const handleMapPress = useCallback((event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    const newLocation = {
      latitude,
      longitude,
      accuracy: 5, // Precisão assumida para seleção manual
    };
    
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation);
    
    // Tentar obter endereço para a coordenada selecionada
    Location.reverseGeocodeAsync({ latitude, longitude })
      .then((reverseGeocode) => {
        if (reverseGeocode && reverseGeocode[0]) {
          const place = reverseGeocode[0];
          const addressParts = [
            place.street,
            place.streetNumber,
            place.district,
            place.city,
            place.region,
          ].filter(Boolean);
          
          const formattedAddress = addressParts.join(', ');
          setAddress(formattedAddress || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        } else {
          setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
      })
      .catch(() => {
        setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      });
  }, [onLocationSelect]);

  // Cleanup do timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Botão para obter localização atual */}
      <TouchableOpacity 
        style={[styles.locationButton, isLoadingLocation && styles.locationButtonDisabled]}
        onPress={handleGetCurrentLocation}
        disabled={isLoadingLocation}
      >
        {isLoadingLocation ? (
          <>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.locationButtonText}>Carregando...</Text>
          </>
        ) : (
          <>
            <Ionicons name="location-outline" size={24} color="#FFFFFF" />
            <Text style={styles.locationButtonText}>Usar Localização Atual</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Input de endereço */}
      <View style={styles.addressInputContainer}>
        <TextInput
          style={styles.addressInput}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={address}
          onChangeText={handleAddressChange}
          multiline
        />
        {isSearchingAddress && (
          <View style={styles.searchingIndicator}>
            <ActivityIndicator size="small" color="#6B7280" />
          </View>
        )}
      </View>

      {/* Sugestões de endereços */}
      {showSuggestions && addressSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <View style={styles.suggestionsHeader}>
            <Ionicons name="search-outline" size={16} color="#6B7280" />
            <Text style={styles.suggestionsTitle}>Sugestões de endereços</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleCloseSuggestions}
            >
              <Ionicons name="close" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          {addressSuggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.suggestionItem}
              onPress={() => handleSelectAddress(suggestion)}
            >
              <View style={styles.suggestionIcon}>
                <Ionicons name="location-outline" size={20} color="#6B7280" />
              </View>
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionAddress}>{suggestion.formattedAddress}</Text>
                <Text style={styles.suggestionCoordinates}>{suggestion.coordinates}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Mapa interativo - apenas para plataformas nativas */}
      {showMap && selectedLocation && Platform.OS !== 'web' && MapView && (
        <View style={styles.mapPreviewWrapper}>
          <View style={styles.mapPreviewHeader}>
            <View style={styles.mapPreviewBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.mapPreviewBadgeText}>Localização Confirmada</Text>
            </View>
            {selectedLocation.accuracy && (
              <View style={[
                styles.accuracyBadge,
                selectedLocation.accuracy <= 10 ? styles.accuracyGood : styles.accuracyWarning
              ]}>
                <Text style={styles.accuracyText}>
                  ±{Math.round(selectedLocation.accuracy)}m
                </Text>
              </View>
            )}
          </View>
          
          <View style={[styles.mapContainer, { height: mapHeight }]}>
            <MapView
              ref={mapRef}
              style={styles.map}
              region={mapRegion || {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              onPress={handleMapPress}
              showsUserLocation={false}
              showsMyLocationButton={false}
            >
              {Marker && (
                <Marker
                  coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  }}
                  title="Localização Selecionada"
                  description={address}
                />
              )}
            </MapView>
          </View>
          
          <View style={styles.mapPreviewFooter}>
            <Ionicons name="navigate" size={16} color="#6B7280" />
            <Text style={styles.mapCoordinatesText}>
              {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
            </Text>
            <Text style={styles.mapHintText}>Toque no mapa para ajustar</Text>
          </View>
        </View>
      )}

      {/* Fallback para web - apenas mostrar coordenadas */}
      {showMap && selectedLocation && Platform.OS === 'web' && (
        <View style={styles.mapPreviewWrapper}>
          <View style={styles.mapPreviewHeader}>
            <View style={styles.mapPreviewBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.mapPreviewBadgeText}>Localização Confirmada</Text>
            </View>
            {selectedLocation.accuracy && (
              <View style={[
                styles.accuracyBadge,
                selectedLocation.accuracy <= 10 ? styles.accuracyGood : styles.accuracyWarning
              ]}>
                <Text style={styles.accuracyText}>
                  ±{Math.round(selectedLocation.accuracy)}m
                </Text>
              </View>
            )}
          </View>
          
          <View style={[styles.mapContainer, { height: 100, justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="location" size={48} color="#10B981" />
            <Text style={styles.mapCoordinatesText}>
              {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
            </Text>
          </View>
          
          <View style={styles.mapPreviewFooter}>
            <Ionicons name="information-circle" size={16} color="#6B7280" />
            <Text style={styles.mapHintText}>Mapa não disponível na versão web</Text>
          </View>
        </View>
      )}

      {/* Indicador de campo obrigatório */}
      {required && !selectedLocation && (
        <Text style={styles.requiredText}>* Campo obrigatório</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
  },
  locationButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  locationButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFFFFF',
  },
  addressInputContainer: {
    position: 'relative',
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#111827',
    backgroundColor: '#FFFFFF',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  searchingIndicator: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 200,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 4,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#6B7280',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
    gap: 4,
  },
  suggestionAddress: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#111827',
  },
  suggestionCoordinates: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
  },
  mapPreviewWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
  },
  mapPreviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapPreviewBadgeText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#10B981',
  },
  accuracyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accuracyGood: {
    backgroundColor: '#10B981',
  },
  accuracyWarning: {
    backgroundColor: '#F59E0B',
  },
  accuracyText: {
    fontSize: 11,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFFFFF',
  },
  mapContainer: {
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPreviewFooter: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  mapCoordinatesText: {
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
    color: '#6B7280',
  },
  mapHintText: {
    fontSize: 11,
    fontFamily: 'Outfit_400Regular',
    color: '#9CA3AF',
  },
  requiredText: {
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
    color: '#EF4444',
    marginTop: 4,
  },
});
