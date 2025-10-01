import Colors from '@/constants/Colors';
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

// Configuração de tipos
const tipoConfig: Record<string, { color: string; icon: string; titulo: string; placeholderAssunto: string; placeholderDetalhes: string }> = {
  'Elogio': {
    color: '#10B981',
    icon: 'heart',
    titulo: 'Editar Elogio',
    placeholderAssunto: 'Ex: Excelente atendimento, profissionalismo, agilidade...',
    placeholderDetalhes: 'Descreva em detalhes o que você gostou e quer elogiar...'
  },
  'Sugestão': {
    color: '#3B82F6',
    icon: 'bulb',
    titulo: 'Editar Sugestão',
    placeholderAssunto: 'Ex: Melhorias no transporte, nova praça, horário estendido...',
    placeholderDetalhes: 'Descreva sua sugestão em detalhes e como ela pode melhorar o serviço...'
  },
  'Denúncia': {
    color: '#F59E0B',
    icon: 'shield-checkmark',
    titulo: 'Editar Denúncia',
    placeholderAssunto: 'Ex: Irregularidade observada, conduta inadequada...',
    placeholderDetalhes: 'Descreva os detalhes da irregularidade ou conduta denunciada...'
  },
};

export default function EditarOcorrenciaScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const primary = Colors.light.primary;
  
  const [assunto, setAssunto] = useState('');
  const [detalhes, setDetalhes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const tipo = params.tipo as string || 'Elogio';
  const tipoInfo = tipoConfig[tipo] || tipoConfig['Elogio'];

  // Dados mockados - em produção viriam da API baseado no ID
  const dadosMockados: Record<string, any> = {
    'Elogio': {
      id: 1,
      numero_protocolo: '2024092800456',
      tipo: 'Elogio',
      setor: 'Saúde',
      assunto: 'Excelente atendimento na UBS',
      detalhes: 'Fui muito bem atendido pela equipe de enfermagem da UBS Central, especialmente pela Enfermeira Maria e Dr. João. Os profissionais foram atenciosos, competentes e demonstraram grande empatia durante todo o atendimento.'
    },
    'Sugestão': {
      id: 1,
      numero_protocolo: '2024092800567',
      tipo: 'Sugestão',
      setor: 'Infraestrutura',
      assunto: 'Instalação de faixa de pedestres',
      detalhes: 'Sugiro a instalação de uma faixa de pedestres na Rua das Acácias, próximo à Escola Municipal João Silva. O local tem grande movimentação de crianças durante os horários de entrada e saída das aulas, tornando a travessia perigosa.'
    },
    'Denúncia': {
      id: 1,
      numero_protocolo: '2024092800678',
      tipo: 'Denúncia',
      setor: 'Corrupção',
      assunto: 'Irregularidade em licitação',
      detalhes: 'Denuncio possível irregularidade no processo licitatório para reforma da Praça Municipal ocorrida em 15/09/2024 na Secretaria de Obras. Observei que o edital favorece uma empresa específica (XYZ Construções) com requisitos muito particulares. O prazo para apresentação de propostas foi extremamente curto, dificultando a participação de outros interessados.'
    }
  };

  const ocorrenciaOriginal = dadosMockados[tipo] || dadosMockados['Elogio'];

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

    // Carregar dados da ocorrência
    loadOcorrenciaData();
  }, []);

  const loadOcorrenciaData = () => {
    setAssunto(ocorrenciaOriginal.assunto);
    setDetalhes(ocorrenciaOriginal.detalhes);
  };

  const handleSubmit = async () => {
    if (!assunto.trim()) {
      toast.error('Campo obrigatório', {
        description: `Por favor, informe o assunto ${tipo === 'Elogio' ? 'do elogio' : tipo === 'Sugestão' ? 'da sugestão' : 'da denúncia'}.`,
      });
      return;
    }

    if (!detalhes.trim()) {
      toast.error('Campo obrigatório', {
        description: `Por favor, descreva ${tipo === 'Elogio' ? 'seu elogio' : tipo === 'Sugestão' ? 'sua sugestão' : 'sua denúncia'} em detalhes.`,
      });
      return;
    }

    setIsSubmitting(true);
    
    // TODO: Implementar atualização na API
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`${tipo} atualizado!`);
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
            <Text style={styles.headerTitle}>{tipoInfo.titulo}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.ocorrenciaSelectedCard}>
          <View style={styles.ocorrenciaBadge}>
            <View style={[styles.ocorrenciaBadgeIcon, { backgroundColor: tipoInfo.color }]}>
              <Ionicons name={tipoInfo.icon as any} size={20} color="#FFFFFF" />
            </View>
            <View style={styles.ocorrenciaBadgeInfo}>
              <Text style={styles.ocorrenciaBadgeLabel}>Protocolo</Text>
              <Text style={[styles.ocorrenciaBadgeTitle, { color: tipoInfo.color }]}>
                {ocorrenciaOriginal.numero_protocolo}
              </Text>
            </View>
          </View>
          <View style={styles.setorInfo}>
            <Text style={styles.setorLabel}>Setor</Text>
            <Text style={styles.setorValue}>{ocorrenciaOriginal.setor}</Text>
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
              <Text style={styles.sectionTitle}>Assunto {tipo === 'Elogio' ? 'do Elogio' : tipo === 'Sugestão' ? 'da Sugestão' : 'da Denúncia'}</Text>
              <Text style={styles.sectionSubtitle}>
                Atualize o assunto se necessário
              </Text>
              
              <TextInput
                style={styles.assuntoInput}
                placeholder={tipoInfo.placeholderAssunto}
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
              <Text style={styles.sectionTitle}>
                {tipo === 'Elogio' ? 'Descrição Detalhada' : tipo === 'Sugestão' ? 'Descrição da Sugestão' : 'Descrição Detalhada dos Fatos'}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {tipo === 'Elogio' 
                  ? 'Conte-nos sobre sua experiência positiva: o que aconteceu, quando, onde, quem te atendeu e por que você está elogiando.'
                  : tipo === 'Sugestão'
                  ? 'Descreva sua sugestão em detalhes: o que você propõe, como pode melhorar o serviço e quais benefícios trará.'
                  : 'Descreva em detalhes: o que aconteceu, quando, onde, quem está envolvido, valores (se houver), documentos relacionados, etc.'
                }
              </Text>
              
              <TextInput
                style={styles.detalhesInput}
                placeholder={tipoInfo.placeholderDetalhes}
                placeholderTextColor="#9CA3AF"
                value={detalhes}
                onChangeText={setDetalhes}
                multiline
                numberOfLines={12}
                textAlignVertical="top"
              />
            </View>

            {/* Aviso de Sigilo (apenas para Denúncias) */}
            {tipo === 'Denúncia' && (
              <View style={styles.warningCard}>
                <Ionicons name="lock-closed" size={20} color="#92400E" />
                <Text style={styles.warningText}>
                  Sua denúncia é tratada com <Text style={styles.warningBold}>total sigilo</Text>. 
                  Sua identidade será preservada.
                </Text>
              </View>
            )}

            {/* Botão de Salvar */}
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: tipoInfo.color }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Salvando...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Salvar Alterações</Text>
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
  ocorrenciaSelectedCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ocorrenciaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ocorrenciaBadgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ocorrenciaBadgeInfo: {
    flex: 1,
  },
  ocorrenciaBadgeLabel: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  ocorrenciaBadgeTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
  setorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
  },
  setorLabel: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
  },
  setorValue: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
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
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#92400E',
    lineHeight: 20,
  },
  warningBold: {
    fontFamily: 'Outfit_700Bold',
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

