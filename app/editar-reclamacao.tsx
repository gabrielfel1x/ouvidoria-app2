import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function EditarReclamacaoScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const primary = Colors.light.primary;
  
  // Estados
  const [photo, setPhoto] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const mapRef = useRef<MapView>(null);

  // Dados mockados - em produção viriam da API baseado no ID
  const reclamacaoOriginal = {
    id: 1,
    numero_protocolo: '2024092800123',
    descricao: 'Grande buraco na Rua das Flores, altura do número 123',
    endereco: 'Rua das Flores, 123',
    localizacao: '-23.5505,-46.6333',
    imagem: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800',
    categoria: {
      id: 1,
      nome: 'Vias Públicas'
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Carregar dados da reclamação
    loadReclamacaoData();
  }, []);

  const loadReclamacaoData = () => {
    // Preencher campos com dados existentes
    setDescription(reclamacaoOriginal.descricao);
    setAddress(reclamacaoOriginal.endereco);
    setPhoto(reclamacaoOriginal.imagem);
    
    // Parse da localização
    const [lat, lng] = reclamacaoOriginal.localizacao.split(',').map(coord => parseFloat(coord.trim()));
    if (!isNaN(lat) && !isNaN(lng)) {
      setLocation({
        latitude: lat,
        longitude: lng,
        accuracy: 10
      });
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      toast.error('Permissão necessária', {
        description: 'Precisamos de permissão para acessar a câmera.',
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      toast.error('Permissão necessária', {
        description: 'Precisamos de permissão para acessar a galeria.',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  const handleLoadCurrentLocation = async () => {
    setIsLoadingLocation(true);
    
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      
      if (!granted) {
        toast.error('Permissão necessária', {
          description: 'Precisamos de permissão para acessar sua localização.',
        });
        setIsLoadingLocation(false);
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      
      const { latitude, longitude, accuracy } = currentPosition.coords;
      
      setLocation({ latitude, longitude, accuracy: accuracy ?? undefined });
      
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        
        if (reverseGeocode && reverseGeocode[0]) {
          const place = reverseGeocode[0];
          const addressParts = [
            place.street,
            place.streetNumber,
            place.district,
            place.city,
            place.region,
            place.postalCode,
          ].filter(Boolean);
          
          const formattedAddress = addressParts.join(', ');
          setAddress(formattedAddress || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        } else {
          setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
      } catch (geocodeError) {
        setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      }
      
      toast.success(
        'Sucesso!', 
        {
          description: `Localização atualizada com precisão de ${accuracy ? Math.round(accuracy) : '?'}m`,
        }
      );
    } catch (error) {
      toast.error('Erro', {
        description: 'Não foi possível obter sua localização. Tente novamente.',
      });
      console.error(error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleAddressSearch = async (searchText: string) => {
    if (searchText.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

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
  };

  const handleSelectAddress = (suggestion: any) => {
    setAddress(suggestion.formattedAddress);
    setLocation({
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      accuracy: 10
    });
    setShowSuggestions(false);
    setAddressSuggestions([]);
    
    toast.success('Endereço selecionado!', {
      description: 'Localização atualizada com sucesso.',
    });
  };

  const handleAddressChange = (text: string) => {
    setAddress(text);
    if (text.length >= 3) {
      handleAddressSearch(text);
    } else {
      setShowSuggestions(false);
      setAddressSuggestions([]);
    }
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Campo obrigatório', {
        description: 'Por favor, descreva o problema.',
      });
      return;
    }

    if (!address.trim()) {
      toast.error('Campo obrigatório', {
        description: 'Por favor, informe o endereço.',
      });
      return;
    }

    setIsSubmitting(true);
    
    // TODO: Implementar atualização na API
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Reclamação atualizada!');
      router.back();
    }, 2000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Editar Reclamação</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.problemInfo}>
          <View style={styles.problemBadge}>
            <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
            <Text style={styles.problemText}>{reclamacaoOriginal.categoria.nome} - Protocolo: {reclamacaoOriginal.numero_protocolo}</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View 
            style={[
              styles.form,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Seção de Foto */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Foto do Problema</Text>
              <Text style={styles.sectionSubtitle}>
                Tire uma nova foto ou selecione uma imagem da galeria
              </Text>
              
              {photo ? (
                <View style={styles.photoPreview}>
                  <Image source={{ uri: photo }} style={styles.previewImage} />
                  <View style={styles.photoActions}>
                    <TouchableOpacity 
                      style={styles.changePhotoButton}
                      onPress={handleTakePhoto}
                    >
                      <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
                      <Text style={styles.changePhotoText}>Tirar nova</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.changePhotoButton}
                      onPress={handlePickImage}
                    >
                      <Ionicons name="images-outline" size={20} color="#FFFFFF" />
                      <Text style={styles.changePhotoText}>Escolher da galeria</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity 
                      style={styles.removePhotoButton}
                      onPress={handleRemovePhoto}
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      <Text style={styles.removePhotoText}>Remover</Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
              ) : (
                <View style={styles.photoButtons}>
                  <TouchableOpacity 
                    style={[styles.photoButton, styles.cameraButton]}
                    onPress={handleTakePhoto}
                  >
                    <Ionicons name="camera-outline" size={32} color="#FFFFFF" />
                    <Text style={styles.photoButtonText}>Tirar Foto</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.photoButton, styles.galleryButton]}
                    onPress={handlePickImage}
                  >
                    <Ionicons name="images-outline" size={32} color="#FFFFFF" />
                    <Text style={styles.photoButtonText}>Galeria</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Campo de Endereço */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Localização do Problema</Text>
              <Text style={styles.sectionSubtitle}>
                Atualize o endereço ou carregue sua localização atual
              </Text>
              
              <TouchableOpacity 
                style={[styles.locationButton, isLoadingLocation && styles.locationButtonDisabled]}
                onPress={handleLoadCurrentLocation}
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
                    <Text style={styles.locationButtonText}>Atualizar Localização</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <View style={styles.addressInputContainer}>
                <TextInput
                  style={styles.addressInput}
                  placeholder="Digite o endereço completo..."
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
              
              {/* Sugestões de Endereços */}
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
              
              {location && (
                <View style={styles.mapPreviewWrapper}>
                  <View style={styles.mapPreviewHeader}>
                    <View style={styles.mapPreviewBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={styles.mapPreviewBadgeText}>Localização Confirmada</Text>
                    </View>
                    {location.accuracy && (
                      <View style={[
                        styles.accuracyBadge,
                        location.accuracy <= 10 ? styles.accuracyGood : styles.accuracyWarning
                      ]}>
                        <Text style={styles.accuracyText}>
                          ±{Math.round(location.accuracy)}m
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.mapContainer}>
                    <MapView
                      ref={mapRef}
                      style={styles.map}
                      initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: location.latitude,
                          longitude: location.longitude,
                        }}
                        title="Localização do Problema"
                        description={address}
                      />
                    </MapView>
                  </View>
                  
                  <View style={styles.mapPreviewFooter}>
                    <Ionicons name="navigate" size={16} color="#6B7280" />
                    <Text style={styles.mapCoordinatesText}>
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição do Problema</Text>
              <Text style={styles.sectionSubtitle}>
                Atualize a descrição se necessário
              </Text>
              
              <TextInput
                style={styles.descriptionInput}
                placeholder="Descreva o problema..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>

            {/* Botão de Salvar */}
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: primary }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Ionicons 
                name={isSubmitting ? "hourglass-outline" : "checkmark-outline"} 
                size={24} 
                color="#FFFFFF" 
              />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerSpacer: {
    width: 40,
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#111827',
  },
  problemInfo: {
    alignItems: 'center',
  },
  problemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  problemText: {
    fontSize: 13,
    fontFamily: 'Outfit_500Medium',
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  form: {
    gap: 32,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  photoButton: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cameraButton: {
    backgroundColor: '#EF4444',
  },
  galleryButton: {
    backgroundColor: '#3B82F6',
  },
  photoButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFFFFF',
  },
  photoPreview: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  photoActions: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  changePhotoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: '#C7D2FE',
  },
  changePhotoText: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFFFFF',
  },
  removePhotoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  removePhotoText: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: '#EF4444',
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
    marginTop: 8,
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
    marginTop: 12,
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
    height: 250,
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
    justifyContent: 'center',
    gap: 6,
  },
  mapCoordinatesText: {
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
    color: '#6B7280',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#111827',
    backgroundColor: '#FFFFFF',
    height: 160,
    textAlignVertical: 'top',
  },
  submitButton: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFFFFF',
  },
});

