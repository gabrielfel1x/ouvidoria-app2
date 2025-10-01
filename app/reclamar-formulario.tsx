import { LocationSelector } from '@/components/LocationSelector';
import SuccessAlert from '@/components/SuccessAlert';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/auth-context';
import { useCreateReclamacao } from '@/hooks/useReclamacoes';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function ReclamarFormularioScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const primary = Colors.light.primary;
  const { user } = useAuth();
  const createReclamacaoMutation = useCreateReclamacao();
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy?: number; address?: string } | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
  }, []);

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

  const handleLocationSelect = useCallback((locationData: { latitude: number; longitude: number; accuracy?: number; address?: string }) => {
    setLocation(locationData);
  }, []);

  /**
   * Converte imagem URI para base64 usando fetch
   * Retorna a imagem no formato completo: data:image/[tipo];base64,[dados]
   */
  const convertImageToBase64 = async (uri: string): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Mantém o formato completo com prefixo data:image/...;base64,
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erro ao converter imagem:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    // Validações
    if (!description.trim()) {
      toast.error('Campo obrigatório', {
        description: 'Por favor, descreva o problema.',
      });
      return;
    }

    if (!location?.address?.trim()) {
      toast.error('Campo obrigatório', {
        description: 'Por favor, selecione uma localização.',
      });
      return;
    }

    if (!user?.id) {
      toast.error('Erro', {
        description: 'Usuário não autenticado.',
      });
      return;
    }

    const categoryId = params.categoryId ? Number(params.categoryId) : null;
    if (!categoryId || isNaN(categoryId)) {
      toast.error('Erro', {
        description: 'Categoria não identificada.',
      });
      return;
    }

    try {
      let imageBase64: string | undefined;
      if (photo) {
        const base64 = await convertImageToBase64(photo);
        if (base64) {
          imageBase64 = base64;
        }
      }

      const localizacao = location 
        ? `${location.latitude},${location.longitude}` 
        : undefined;

      const dataAtual = new Date().toISOString().split('T')[0];

      // Monta o objeto conforme a documentação da API
      const reclamacaoData: any = {
        usuario_id: user.id,
        categoria_id: categoryId,
        descricao: description.trim(),
        data: dataAtual,
        endereco: location.address?.trim() || '',
      };

      // Adiciona campos opcionais apenas se tiverem valor
      if (localizacao) {
        reclamacaoData.localizacao = localizacao;
      }

      if (imageBase64) {
        reclamacaoData.imagem = imageBase64;
      }

      console.log(reclamacaoData);
      
      await createReclamacaoMutation.mutateAsync(reclamacaoData);

      // Mostra o alerta de sucesso personalizado
      setShowSuccessAlert(true);

    } catch (error: any) {
      console.error('Erro ao enviar reclamação:', error);
      
      // Tratamento de erros
      if (error?.response?.status === 422) {
        const validationErrors = error.response.data;
        const firstError = Object.values(validationErrors)[0];
        toast.error('Erro de validação', {
          description: Array.isArray(firstError) ? firstError[0] : 'Verifique os campos preenchidos.',
        });
      } else {
        toast.error('Erro ao enviar', {
          description: error?.response?.data?.erro || error?.message || 'Não foi possível enviar a reclamação. Tente novamente.',
        });
      }
    }
  };

  const categoryTitle = params.categoryTitle as string || 'Reclamação';
  const complaintTitle = params.complaintTitle as string || 'Problema';

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
            <Text style={styles.headerTitle}>Registrar Reclamação</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.problemInfo}>
          <View style={styles.problemBadge}>
            <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
            <Text style={styles.problemText}>{categoryTitle} - {complaintTitle}</Text>
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
                Tire uma foto ou selecione uma imagem da galeria para documentar o problema
              </Text>
              
              {!photo ? (
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
              ) : (
                <View style={styles.photoPreview}>
                  <Image source={{ uri: photo }} style={styles.previewImage} />
                </View>
              )}
            </View>

            {/* Campo de Localização */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Localização do Problema</Text>
              <Text style={styles.sectionSubtitle}>
                Informe o endereço ou carregue sua localização atual
              </Text>
              
              <LocationSelector
                onLocationSelect={handleLocationSelect}
                initialLocation={location}
                showMap={true}
                mapHeight={250}
                placeholder="Digite o endereço completo ou use a localização atual..."
                required={true}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição do Problema</Text>
              <Text style={styles.sectionSubtitle}>
                Descreva detalhadamente o que está acontecendo
              </Text>
              
              <TextInput
                style={styles.descriptionInput}
                placeholder="Descreva o problema, quando aconteceu, como te afetou e qualquer informação relevante..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>

            {/* Botão de Enviar */}
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: primary }]}
              onPress={handleSubmit}
              disabled={createReclamacaoMutation.isPending}
            >
              <Ionicons 
                name={createReclamacaoMutation.isPending ? "hourglass-outline" : "send-outline"} 
                size={24} 
                color="#FFFFFF" 
              />
              <Text style={styles.submitButtonText}>
                {createReclamacaoMutation.isPending ? 'Enviando...' : 'Enviar Reclamação'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Alerta de Sucesso Personalizado */}
      <SuccessAlert
        visible={showSuccessAlert}
        onClose={() => {
          setShowSuccessAlert(false);
          router.back();
        }}
        title="Reclamação Enviada!"
        message="Sua reclamação foi registrada com sucesso. Você receberá atualizações sobre o andamento."
        icon="checkmark-circle"
        iconColor="#10B981"
        backgroundColor="#10B981"
        duration={3000}
      />
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
    fontSize: 14,
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