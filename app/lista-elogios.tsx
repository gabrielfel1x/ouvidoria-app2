import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Ocorrencia {
  id: number;
  numero_protocolo: string;
  tipo: string;
  setor: string;
  data: string;
  assunto: string;
  detalhes: string;
  status: string;
  usuario_id: number;
  created_at: string;
  updated_at: string;
  satisfacao_do_usuario?: string | null;
}

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

export default function ListaElogiosScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ocorrenciaToDelete, setOcorrenciaToDelete] = useState<Ocorrencia | null>(null);

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

  // Dados mockados
  const elogios: Ocorrencia[] = [
    {
      id: 1,
      numero_protocolo: '2024092800456',
      tipo: 'Elogio',
      setor: 'Saúde',
      data: '2024-09-28',
      assunto: 'Excelente atendimento na UBS',
      detalhes: 'Fui muito bem atendido pela equipe de enfermagem da UBS Central. Profissionais atenciosos e competentes.',
      status: 'Em Aberto',
      usuario_id: 1,
      created_at: '2024-09-28T11:30:00Z',
      updated_at: '2024-09-28T11:30:00Z',
      satisfacao_do_usuario: null
    },
    {
      id: 2,
      numero_protocolo: '2024092600234',
      tipo: 'Elogio',
      setor: 'Educação',
      data: '2024-09-26',
      assunto: 'Professora exemplar',
      detalhes: 'Gostaria de elogiar a professora Maria da Escola Municipal João Silva pelo excelente trabalho com as crianças.',
      status: 'Resolvido',
      usuario_id: 1,
      created_at: '2024-09-26T14:20:00Z',
      updated_at: '2024-09-27T10:15:00Z',
      satisfacao_do_usuario: 'Satisfeito'
    },
    {
      id: 3,
      numero_protocolo: '2024092400189',
      tipo: 'Elogio',
      setor: 'Atendimento',
      data: '2024-09-24',
      assunto: 'Atendimento rápido e eficiente',
      detalhes: 'Fui atendido rapidamente na Secretaria de Obras para resolver minha documentação. Parabéns pela eficiência!',
      status: 'Resolvido',
      usuario_id: 1,
      created_at: '2024-09-24T09:45:00Z',
      updated_at: '2024-09-24T16:30:00Z',
      satisfacao_do_usuario: 'Muito satisfeito'
    }
  ];

  const handleElogioPress = (elogio: Ocorrencia) => {
    router.push({
      pathname: '/detalhes-ocorrencia',
      params: {
        id: elogio.id,
        tipo: 'Elogio',
      }
    });
  };

  const handleDeletePress = (elogio: Ocorrencia) => {
    setOcorrenciaToDelete(elogio);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implementar exclusão na API
    console.log('Excluir elogio:', ocorrenciaToDelete?.id);
    setShowDeleteModal(false);
    setOcorrenciaToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setOcorrenciaToDelete(null);
  };

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
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
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Ionicons name="heart" size={28} color="#10B981" />
            <Text style={styles.headerTitle}>Meus Elogios</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {elogios.length} {elogios.length === 1 ? 'elogio enviado' : 'elogios enviados'}
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={[
            styles.listContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {elogios.map((elogio) => {
            const statusInfo = statusConfig[elogio.status] || statusConfig['Em Aberto'];
            
            return (
              <TouchableOpacity
                key={elogio.id}
                style={styles.elogioCard}
                onPress={() => handleElogioPress(elogio)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: '#10B98115' }]}>
                    <Ionicons name="heart" size={28} color="#10B981" />
                  </View>
                  
                  <View style={styles.cardHeaderInfo}>
                    <View style={styles.headerTags}>
                      <View style={styles.setorTag}>
                        <Ionicons name="business" size={12} color="#6B7280" />
                        <Text style={styles.setorText}>{elogio.setor}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                        <Ionicons name={statusInfo.icon as any} size={12} color={statusInfo.color} />
                        <Text style={[styles.statusText, { color: statusInfo.color }]}>
                          {statusInfo.label}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.assuntoText} numberOfLines={2}>
                      {elogio.assunto}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.detalhesText} numberOfLines={3}>
                    {elogio.detalhes}
                  </Text>
                  
                  <View style={styles.cardFooter}>
                    <View style={styles.infoRow}>
                      <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                      <Text style={styles.dataText}>{formatarData(elogio.data)}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <Ionicons name="key-outline" size={14} color="#6B7280" />
                      <Text style={styles.protocoloText}>{elogio.numero_protocolo}</Text>
                    </View>
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push({
                          pathname: '/editar-ocorrencia',
                          params: {
                            id: elogio.id,
                            tipo: 'Elogio'
                          }
                        });
                      }}
                    >
                      <Ionicons name="create-outline" size={18} color="#3B82F6" />
                      <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeletePress(elogio);
                      }}
                    >
                      <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                      <Text style={styles.deleteButtonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Empty State */}
        {elogios.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Nenhum elogio ainda</Text>
            <Text style={styles.emptySubtitle}>
              Seus elogios enviados aparecerão aqui
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="alert-circle" size={48} color="#EF4444" />
              </View>
              <Text style={styles.modalTitle}>Excluir Elogio?</Text>
              <Text style={styles.modalSubtitle}>
                Esta ação não pode ser desfeita. O elogio será permanentemente removido.
              </Text>
            </View>

            {ocorrenciaToDelete && (
              <View style={styles.modalOcorrenciaInfo}>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="key-outline" size={16} color="#6B7280" />
                  <Text style={styles.modalInfoText}>
                    Protocolo: {ocorrenciaToDelete.numero_protocolo}
                  </Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="text-outline" size={16} color="#6B7280" />
                  <Text style={styles.modalInfoText} numberOfLines={1}>
                    {ocorrenciaToDelete.assunto}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={handleCancelDelete}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={handleConfirmDelete}
              >
                <Ionicons name="trash" size={20} color="#FFFFFF" />
                <Text style={styles.modalConfirmText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#111827',
  },
  headerContent: {
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    color: '#10B981',
  },
  headerSubtitle: {
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  listContainer: {
    gap: 16,
  },
  elogioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  headerTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  setorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  setorText: {
    fontSize: 11,
    fontFamily: 'Outfit_500Medium',
    color: '#6B7280',
  },
  assuntoText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
    lineHeight: 20,
  },
  cardBody: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  detalhesText: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dataText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
  },
  protocoloText: {
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
    color: '#6B7280',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Outfit_600SemiBold',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  editButtonText: {
    fontSize: 13,
    fontFamily: 'Outfit_600SemiBold',
    color: '#3B82F6',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  deleteButtonText: {
    fontSize: 13,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Outfit_700Bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOcorrenciaInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalInfoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Outfit_500Medium',
    color: '#6B7280',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontFamily: 'Outfit_600SemiBold',
    color: '#6B7280',
  },
  modalConfirmButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalConfirmText: {
    fontSize: 15,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFFFFF',
  },
});

