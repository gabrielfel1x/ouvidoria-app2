import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function DenunciarFormularioScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const primary = Colors.light.primary;
  
  const [assunto, setAssunto] = useState('');
  const [local, setLocal] = useState('');
  const [dataOcorrido, setDataOcorrido] = useState('');
  const [pessoasEnvolvidas, setPessoasEnvolvidas] = useState('');
  const [detalhes, setDetalhes] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const tipoTitle = params.tipoTitle as string || 'Denúncia';
  const tipoIcon = params.tipoIcon as string || 'warning-outline';
  const tipoColor = params.tipoColor as string || '#DC2626';

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

  const handleSubmit = async () => {
    if (!assunto.trim()) {
      toast.error('Campo obrigatório', {
        description: 'Por favor, informe o assunto da denúncia.',
      });
      return;
    }

    if (!detalhes.trim()) {
      toast.error('Campo obrigatório', {
        description: 'Por favor, descreva a denúncia em detalhes.',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulação de envio - depois conectar com a API
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Denúncia registrada!', {
        description: 'Sua denúncia foi recebida e será analisada com sigilo.',
      });
      
      // Volta para a tela inicial
      router.back();
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
            <Text style={styles.headerTitle}>Fazer Denúncia</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.tipoSelectedCard}>
          <View style={styles.tipoBadge}>
            <View style={[styles.tipoBadgeIcon, { backgroundColor: tipoColor }]}>
              <Ionicons name={tipoIcon as any} size={20} color="#FFFFFF" />
            </View>
            <View style={styles.tipoBadgeInfo}>
              <Text style={styles.tipoBadgeLabel}>Tipo de denúncia</Text>
              <Text style={[styles.tipoBadgeTitle, { color: tipoColor }]}>
                {tipoTitle}
              </Text>
            </View>
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
            {/* Aviso de Sigilo */}
            <View style={styles.warningBox}>
              <View style={styles.warningHeader}>
                <Ionicons name="lock-closed" size={20} color="#DC2626" />
                <Text style={styles.warningTitle}>Sigilo garantido</Text>
              </View>
              <Text style={styles.warningText}>
                Sua identidade será mantida em sigilo. Forneça o máximo de informações 
                possível para facilitar a investigação.
              </Text>
            </View>

            {/* Campo de Assunto */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Assunto da Denúncia</Text>
              <Text style={styles.sectionSubtitle}>
                Resuma o fato denunciado em poucas palavras
              </Text>
              
              <TextInput
                style={styles.assuntoInput}
                placeholder="Ex: Desvio de verba, servidor pedindo propina, nepotismo..."
                placeholderTextColor="#9CA3AF"
                value={assunto}
                onChangeText={setAssunto}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            {/* Campo de Local */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.sectionTitle}>Local do Ocorrido</Text>
                <View style={styles.optionalBadge}>
                  <Text style={styles.optionalText}>Opcional</Text>
                </View>
              </View>
              <Text style={styles.sectionSubtitle}>
                Informe onde o fato aconteceu (rua, bairro, órgão público, etc)
              </Text>
              
              <TextInput
                style={styles.localInput}
                placeholder="Ex: Secretaria Municipal, Avenida Principal, 123..."
                placeholderTextColor="#9CA3AF"
                value={local}
                onChangeText={setLocal}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            {/* Campo de Data */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.sectionTitle}>Data/Período do Ocorrido</Text>
                <View style={styles.optionalBadge}>
                  <Text style={styles.optionalText}>Opcional</Text>
                </View>
              </View>
              <Text style={styles.sectionSubtitle}>
                Quando aconteceu ou período aproximado
              </Text>
              
              <TextInput
                style={styles.dataInput}
                placeholder="Ex: 15/01/2025, Janeiro de 2025, Últimos 3 meses..."
                placeholderTextColor="#9CA3AF"
                value={dataOcorrido}
                onChangeText={setDataOcorrido}
              />
            </View>

            {/* Campo de Pessoas Envolvidas */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.sectionTitle}>Pessoas/Entidades Envolvidas</Text>
                <View style={styles.optionalBadge}>
                  <Text style={styles.optionalText}>Opcional</Text>
                </View>
              </View>
              <Text style={styles.sectionSubtitle}>
                Nomes, cargos ou funções das pessoas envolvidas
              </Text>
              
              <TextInput
                style={styles.pessoasInput}
                placeholder="Ex: Nome do servidor, cargo, setor, departamento..."
                placeholderTextColor="#9CA3AF"
                value={pessoasEnvolvidas}
                onChangeText={setPessoasEnvolvidas}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Campo de Detalhes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição Detalhada dos Fatos</Text>
              <Text style={styles.sectionSubtitle}>
                Descreva em detalhes o que aconteceu. Quanto mais informações, melhor
              </Text>
              
              <TextInput
                style={styles.detalhesInput}
                placeholder="Relate os fatos com o máximo de detalhes possível: o que aconteceu, como aconteceu, quem presenciou, valores envolvidos, documentos relacionados, etc..."
                placeholderTextColor="#9CA3AF"
                value={detalhes}
                onChangeText={setDetalhes}
                multiline
                numberOfLines={12}
                textAlignVertical="top"
              />
            </View>

            {/* Seção de Evidências (Fotos) */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.sectionTitle}>Evidências (Fotos/Documentos)</Text>
                <View style={styles.optionalBadge}>
                  <Text style={styles.optionalText}>Opcional</Text>
                </View>
              </View>
              <Text style={styles.sectionSubtitle}>
                Se possível, anexe fotos ou prints de documentos como prova
              </Text>
              
              {!photo ? (
                <View style={styles.photoButtons}>
                  <TouchableOpacity 
                    style={[styles.photoButton, styles.cameraButton]}
                    onPress={handleTakePhoto}
                  >
                    <Ionicons name="camera-outline" size={28} color="#FFFFFF" />
                    <Text style={styles.photoButtonText}>Tirar Foto</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.photoButton, styles.galleryButton]}
                    onPress={handlePickImage}
                  >
                    <Ionicons name="images-outline" size={28} color="#FFFFFF" />
                    <Text style={styles.photoButtonText}>Galeria</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.photoPreview}>
                  <Image source={{ uri: photo }} style={styles.previewImage} />
                  <TouchableOpacity 
                    style={styles.removePhotoButton}
                    onPress={() => setPhoto(null)}
                  >
                    <Ionicons name="close-circle" size={32} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Informações de Proteção */}
            <View style={styles.infoBox}>
              <View style={styles.infoHeader}>
                <Ionicons name="shield-checkmark" size={20} color="#DC2626" />
                <Text style={styles.infoTitle}>Lei de Proteção ao Denunciante</Text>
              </View>
              <Text style={styles.infoText}>
                Você está protegido pela Lei nº 13.608/2018 que garante proteção e anonimato 
                aos denunciantes de boa-fé. Suas informações serão tratadas com total sigilo.
              </Text>
            </View>

            {/* Botão de Enviar */}
            <TouchableOpacity 
              style={[
                styles.submitButton, 
                { backgroundColor: primary },
                isSubmitting && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Enviando...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Enviar Denúncia</Text>
                </>
              )}
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
  tipoSelectedCard: {
    marginTop: 8,
  },
  tipoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  tipoBadgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipoBadgeInfo: {
    flex: 1,
    gap: 2,
  },
  tipoBadgeLabel: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
  },
  tipoBadgeTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  form: {
    gap: 28,
  },
  section: {
    gap: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
  },
  optionalBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  optionalText: {
    fontSize: 11,
    fontFamily: 'Outfit_500Medium',
    color: '#6B7280',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    // borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    gap: 8,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#DC2626',
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#991B1B',
    lineHeight: 20,
  },
  assuntoInput: {
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
  localInput: {
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
  dataInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#111827',
    backgroundColor: '#FFFFFF',
    minHeight: 56,
  },
  pessoasInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#111827',
    backgroundColor: '#FFFFFF',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  detalhesInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#111827',
    backgroundColor: '#FFFFFF',
    height: 200,
    textAlignVertical: 'top',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    height: 100,
    borderRadius: 12,
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
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFFFFF',
  },
  photoPreview: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  infoBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    // borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    gap: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#DC2626',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#991B1B',
    lineHeight: 20,
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
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFFFFF',
  },
});

