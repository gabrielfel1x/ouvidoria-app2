import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Status config
const statusConfig: Record<string, { label: string; color: string; icon: string; bg: string }> = {
  'Em Aberto': {
    label: 'Em Aberto',
    color: '#F59E0B',
    icon: 'time-outline',
    bg: '#FEF3C7'
  },
  'Em Andamento': {
    label: 'Em Andamento',
    color: '#3B82F6',
    icon: 'sync-outline',
    bg: '#DBEAFE'
  },
  'Resolvido': {
    label: 'Resolvido',
    color: '#10B981',
    icon: 'checkmark-circle-outline',
    bg: '#D1FAE5'
  },
  'Cancelado': {
    label: 'Cancelado',
    color: '#EF4444',
    icon: 'close-circle-outline',
    bg: '#FEE2E2'
  }
};

// Configuração de tipos
const tipoConfig: Record<string, { color: string; icon: string; bg: string; titulo: string }> = {
  'Elogio': {
    color: '#10B981',
    icon: 'heart',
    bg: '#10B98115',
    titulo: 'Detalhes do Elogio'
  },
  'Sugestão': {
    color: '#3B82F6',
    icon: 'bulb',
    bg: '#3B82F615',
    titulo: 'Detalhes da Sugestão'
  },
  'Denúncia': {
    color: '#F59E0B',
    icon: 'shield-checkmark',
    bg: '#F59E0B15',
    titulo: 'Detalhes da Denúncia'
  },
};

export default function DetalhesOcorrenciaScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
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

  // Dados mockados - em produção viriam da API baseado no ID
  const tipo = params.tipo as string || 'Elogio';
  
  // Mapeamento de dados mockados por tipo
  const dadosMockados: Record<string, any> = {
    'Elogio': {
      id: 1,
      numero_protocolo: '2024092800456',
      tipo: 'Elogio',
      setor: 'Saúde',
      data: '2024-09-28',
      assunto: 'Excelente atendimento na UBS',
      detalhes: 'Fui muito bem atendido pela equipe de enfermagem da UBS Central. Os profissionais foram atenciosos, competentes e demonstraram grande empatia durante todo o atendimento. Gostaria de parabenizar especialmente a enfermeira Maria e o Dr. João pelo excelente trabalho.',
      status: 'Em Aberto',
      usuario_id: 1,
      created_at: '2024-09-28T11:30:00Z',
      updated_at: '2024-09-28T11:30:00Z',
      satisfacao_do_usuario: null
    },
    'Sugestão': {
      id: 1,
      numero_protocolo: '2024092800567',
      tipo: 'Sugestão',
      setor: 'Infraestrutura',
      data: '2024-09-28',
      assunto: 'Instalação de faixa de pedestres',
      detalhes: 'Sugiro a instalação de uma faixa de pedestres na Rua das Acácias, próximo à escola. O local tem grande movimentação de crianças e a travessia é perigosa, principalmente nos horários de entrada e saída das aulas. A faixa elevada seria ainda mais eficaz para garantir a segurança.',
      status: 'Em Andamento',
      usuario_id: 1,
      created_at: '2024-09-28T10:15:00Z',
      updated_at: '2024-09-29T08:30:00Z',
      satisfacao_do_usuario: null
    },
    'Denúncia': {
      id: 1,
      numero_protocolo: '2024092800678',
      tipo: 'Denúncia',
      setor: 'Corrupção',
      data: '2024-09-28',
      assunto: 'Irregularidade em licitação',
      detalhes: 'Denuncio possível irregularidade no processo licitatório para reforma da praça municipal. Observei que o edital favorece uma empresa específica com requisitos muito particulares. Além disso, o prazo para apresentação de propostas foi extremamente curto, dificultando a participação de outros interessados.',
      status: 'Em Andamento',
      usuario_id: 1,
      created_at: '2024-09-28T13:45:00Z',
      updated_at: '2024-09-29T10:20:00Z',
      satisfacao_do_usuario: null
    }
  };
  
  const ocorrencia = dadosMockados[tipo] || dadosMockados['Elogio'];

  const statusInfo = statusConfig[ocorrencia.status] || statusConfig['Em Aberto'];
  const tipoInfo = tipoConfig[ocorrencia.tipo] || tipoConfig['Elogio'];

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatarDataHora = (dataISO: string) => {
    const date = new Date(dataISO);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        
        <View style={styles.headerIcon}>
          <View style={[styles.iconCircle, { backgroundColor: tipoInfo.bg }]}>
            <Ionicons name={tipoInfo.icon as any} size={40} color={tipoInfo.color} />
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={[
            styles.detailsContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Card de Status e Protocolo */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                <Ionicons name={statusInfo.icon as any} size={20} color={statusInfo.color} />
                <Text style={[styles.statusText, { color: statusInfo.color }]}>
                  {statusInfo.label}
                </Text>
              </View>
            </View>
            
            <View style={styles.protocoloContainer}>
              <Ionicons name="key" size={20} color="#6B7280" />
              <View style={styles.protocoloInfo}>
                <Text style={styles.protocoloLabel}>Protocolo</Text>
                <Text style={styles.protocoloNumber}>{ocorrencia.numero_protocolo}</Text>
              </View>
            </View>
          </View>

          {/* Setor */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Setor</Text>
            <View style={[styles.infoCard]}>
              <Ionicons name="business" size={20} color={tipoInfo.color} />
              <Text style={styles.infoText}>{ocorrencia.setor}</Text>
            </View>
          </View>

          {/* Assunto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assunto</Text>
            <View style={styles.assuntoCard}>
              <Text style={styles.assuntoText}>{ocorrencia.assunto}</Text>
            </View>
          </View>

          {/* Detalhes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalhes Completos</Text>
            <View style={styles.detalhesCard}>
              <Text style={styles.detalhesText}>{ocorrencia.detalhes}</Text>
            </View>
          </View>

          {/* Datas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações de Data</Text>
            
            <View style={styles.dateCard}>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                <View style={styles.dateInfo}>
                  <Text style={styles.dateLabel}>Data do Ocorrido</Text>
                  <Text style={styles.dateValue}>{formatarData(ocorrencia.data)}</Text>
                </View>
              </View>
              
              <View style={styles.dateDivider} />
              
              <View style={styles.dateRow}>
                <Ionicons name="time-outline" size={20} color="#6B7280" />
                <View style={styles.dateInfo}>
                  <Text style={styles.dateLabel}>Data de Registro</Text>
                  <Text style={styles.dateValue}>{formatarDataHora(ocorrencia.created_at)}</Text>
                </View>
              </View>
              
              {ocorrencia.updated_at !== ocorrencia.created_at && (
                <>
                  <View style={styles.dateDivider} />
                  <View style={styles.dateRow}>
                    <Ionicons name="refresh-outline" size={20} color="#6B7280" />
                    <View style={styles.dateInfo}>
                      <Text style={styles.dateLabel}>Última Atualização</Text>
                      <Text style={styles.dateValue}>{formatarDataHora(ocorrencia.updated_at)}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Satisfação do Usuário */}
          {ocorrencia.satisfacao_do_usuario && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Avaliação</Text>
              <View style={styles.satisfacaoCard}>
                <Ionicons name="star" size={20} color="#F59E0B" />
                <Text style={styles.satisfacaoText}>{ocorrencia.satisfacao_do_usuario}</Text>
              </View>
            </View>
          )}

          {/* Card de Ajuda */}
          {ocorrencia.tipo === 'Denúncia' && (
            <View style={styles.helpCard}>
              <Ionicons name="shield-checkmark" size={20} color="#92400E" />
              <Text style={styles.helpText}>
                Sua denúncia está sendo tratada com <Text style={styles.helpBold}>total sigilo</Text>. 
                Você será notificado sobre o andamento.
              </Text>
            </View>
          )}

          {ocorrencia.tipo !== 'Denúncia' && (
            <View style={styles.helpCard}>
              <Ionicons name="information-circle" size={20} color="#6366F1" />
              <Text style={styles.helpText}>
                Agradecemos seu {ocorrencia.tipo.toLowerCase()}! 
                Acompanhe o andamento através do protocolo.
              </Text>
            </View>
          )}

          {/* Botões de Ação */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={20} color="#6366F1" />
              <Text style={styles.actionButtonText}>Compartilhar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
              <Ionicons name="chatbubble-outline" size={20} color="#6366F1" />
              <Text style={styles.actionButtonText}>Ver Respostas</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
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
  headerIcon: {
    alignItems: 'center',
    marginTop: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  detailsContainer: {
    gap: 24,
  },
  statusCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusHeader: {
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
  protocoloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  protocoloInfo: {
    flex: 1,
  },
  protocoloLabel: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  protocoloNumber: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#111827',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#111827',
  },
  assuntoCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  assuntoText: {
    fontSize: 17,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
    lineHeight: 24,
  },
  detalhesCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detalhesText: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#111827',
    lineHeight: 24,
  },
  dateCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 15,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
  },
  dateDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  satisfacaoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  satisfacaoText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#92400E',
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#92400E',
    lineHeight: 20,
  },
  helpBold: {
    fontFamily: 'Outfit_700Bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  actionButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#6366F1',
  },
});

