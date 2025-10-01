import Colors from '@/constants/Colors';
import { useAuth } from '@/context/auth-context';
import { useCreateOcorrencia } from '@/hooks/useOcorrencias';
import { TipoOcorrencia } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
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

export default function SugerirFormularioScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const primary = Colors.light.primary;
  const { user } = useAuth();
  const createOcorrenciaMutation = useCreateOcorrencia();
  
  const [assunto, setAssunto] = useState('');
  const [detalhes, setDetalhes] = useState('');
  
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

  const setorTitle = params.setorTitle as string || 'Setor';
  const setorIcon = params.setorIcon as string || 'help-circle-outline';
  const setorColor = params.setorColor as string || '#6B7280';
  const setorDescription = params.setorDescription as string || '';

  const handleSubmit = async () => {
    if (!assunto.trim()) {
      toast.error('Campo obrigatório', {
        description: 'Por favor, informe o assunto da sugestão.',
      });
      return;
    }

    if (!detalhes.trim()) {
      toast.error('Campo obrigatório', {
        description: 'Por favor, descreva sua sugestão em detalhes.',
      });
      return;
    }

    if (!user?.id) {
      toast.error('Erro', {
        description: 'Usuário não autenticado.',
      });
      return;
    }

    try {
      const dataAtual = new Date().toISOString().split('T')[0];

      const ocorrenciaData = {
        usuario_id: user.id,
        tipo: TipoOcorrencia.SUGESTAO,
        setor: setorTitle,
        data: dataAtual,
        assunto: assunto.trim(),
        detalhes: detalhes.trim(),
      };

      await createOcorrenciaMutation.mutateAsync(ocorrenciaData);

      toast.success('Sugestão enviada!', {
        description: 'Obrigado por contribuir para melhorar nossos serviços.',
      });
      
      setTimeout(() => {
        router.back();
        router.back();
      }, 1500);

    } catch (error: any) {
      console.error('Erro ao enviar sugestão:', error);
      toast.error('Erro ao enviar sugestão', {
        description: error?.response?.data?.erro || 'Tente novamente mais tarde.',
      });
    }
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
            <Text style={styles.headerTitle}>Enviar Sugestão</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.setorSelectedCard}>
          <View style={styles.setorBadge}>
            <View style={[styles.setorBadgeIcon, { backgroundColor: setorColor }]}>
              <Ionicons name={setorIcon as any} size={20} color="#FFFFFF" />
            </View>
            <View style={styles.setorBadgeInfo}>
              <Text style={styles.setorBadgeLabel}>Setor selecionado</Text>
              <Text style={[styles.setorBadgeTitle, { color: setorColor }]}>
                {setorTitle}
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
            {/* Campo de Assunto */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Assunto da Sugestão</Text>
              <Text style={styles.sectionSubtitle}>
                Resuma sua ideia em poucas palavras
              </Text>
              
              <TextInput
                style={styles.assuntoInput}
                placeholder="Ex: Instalação de ciclovias, Wi-Fi público, novos horários..."
                placeholderTextColor="#9CA3AF"
                value={assunto}
                onChangeText={setAssunto}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            {/* Campo de Detalhes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição Detalhada</Text>
              <Text style={styles.sectionSubtitle}>
                Explique sua sugestão: o que é, como pode ser implementada e quais benefícios traria
              </Text>
              
              <TextInput
                style={styles.detalhesInput}
                placeholder="Descreva sua sugestão de forma detalhada. Quanto mais informações, melhor poderemos avaliar sua ideia..."
                placeholderTextColor="#9CA3AF"
                value={detalhes}
                onChangeText={setDetalhes}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />
            </View>

            {/* Informações Adicionais */}
            <View style={styles.infoBox}>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <Text style={styles.infoTitle}>Dica</Text>
              </View>
              <Text style={styles.infoText}>
                Sugestões bem detalhadas e fundamentadas têm mais chances de serem implementadas. 
                Pense nos benefícios para a comunidade e na viabilidade da proposta.
              </Text>
            </View>

            {/* Botão de Enviar */}
            <TouchableOpacity 
              style={[
                styles.submitButton, 
                { backgroundColor: primary },
                createOcorrenciaMutation.isPending && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={createOcorrenciaMutation.isPending}
            >
              {createOcorrenciaMutation.isPending ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Enviando...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="send-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Enviar Sugestão</Text>
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
  setorSelectedCard: {
    marginTop: 8,
  },
  setorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  setorBadgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  setorBadgeInfo: {
    flex: 1,
    gap: 2,
  },
  setorBadgeLabel: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
  },
  setorBadgeTitle: {
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
  detalhesInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#111827',
    backgroundColor: '#FFFFFF',
    height: 180,
    textAlignVertical: 'top',
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    // borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
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
    color: '#3B82F6',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#1E40AF',
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

