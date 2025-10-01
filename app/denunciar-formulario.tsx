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

export default function DenunciarFormularioScreen() {
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

  const tipoTitle = params.tipoTitle as string || 'Denúncia';
  const tipoIcon = params.tipoIcon as string || 'warning-outline';
  const tipoColor = params.tipoColor as string || '#DC2626';

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
        tipo: TipoOcorrencia.DENUNCIA,
        setor: tipoTitle,
        data: dataAtual,
        assunto: assunto.trim(),
        detalhes: detalhes.trim(),
      };

      await createOcorrenciaMutation.mutateAsync(ocorrenciaData);

      toast.success('Denúncia registrada!', {
        description: 'Sua denúncia foi recebida e será analisada com sigilo.',
      });
      
      setTimeout(() => {
        router.back();
        router.back();
      }, 1500);

    } catch (error: any) {
      console.error('Erro ao enviar denúncia:', error);
      toast.error('Erro ao enviar denúncia', {
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

            {/* Campo de Detalhes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição Detalhada dos Fatos</Text>
              <Text style={styles.sectionSubtitle}>
                Descreva em detalhes: o que aconteceu, quando, onde, quem está envolvido, valores (se houver), documentos relacionados, etc.
              </Text>
              
              <TextInput
                style={styles.detalhesInput}
                placeholder="Relate os fatos com o máximo de detalhes possível: o que aconteceu, quando ocorreu, local, pessoas/entidades envolvidas, valores, documentos, testemunhas..."
                placeholderTextColor="#9CA3AF"
                value={detalhes}
                onChangeText={setDetalhes}
                multiline
                numberOfLines={12}
                textAlignVertical="top"
              />
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
    minHeight: 70,
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
    height: 220,
    textAlignVertical: 'top',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
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
    color: '#92400E',
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#92400E',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
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
