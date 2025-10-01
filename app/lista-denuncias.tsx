import { useAuth } from '@/context/auth-context';
import { useDeleteOcorrencia, useOcorrenciasByUser } from '@/hooks/useOcorrencias';
import { Ocorrencia, TipoOcorrencia } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';


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

export default function ListaDenunciasScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ocorrenciaToDelete, setOcorrenciaToDelete] = useState<Ocorrencia | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { data: denuncias = [], isLoading, error, refetch } = useOcorrenciasByUser(user?.id || 0, TipoOcorrencia.DENUNCIA);
  const deleteOcorrenciaMutation = useDeleteOcorrencia();

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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDenunciaPress = (denuncia: Ocorrencia) => {
    router.push({
      pathname: '/detalhes-ocorrencia',
      params: {
        id: denuncia.id,
        tipo: 'Denúncia',
      }
    });
  };

  const handleDeletePress = (denuncia: Ocorrencia) => {
    setOcorrenciaToDelete(denuncia);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!ocorrenciaToDelete) return;
    
    try {
      await deleteOcorrenciaMutation.mutateAsync(ocorrenciaToDelete.id);
      toast.success('Denúncia excluída com sucesso!');
      setShowDeleteModal(false);
      setOcorrenciaToDelete(null);
    } catch (error: any) {
      console.error('Erro ao excluir denúncia:', error);
      toast.error('Erro ao excluir denúncia', {
        description: error?.response?.data?.erro || 'Tente novamente mais tarde.',
      });
    }
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
            <Ionicons name="shield-checkmark" size={28} color="#F59E0B" />
            <Text style={styles.headerTitle}>Minhas Denúncias</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {denuncias.length} {denuncias.length === 1 ? 'denúncia registrada' : 'denúncias registradas'}
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#F59E0B']}
            tintColor="#F59E0B"
          />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.loadingText}>Carregando denúncias...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text style={styles.errorTitle}>Erro ao carregar</Text>
            <Text style={styles.errorSubtitle}>
              {error?.message || 'Não foi possível carregar suas denúncias'}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Aviso de Sigilo */}
            <View style={styles.warningCard}>
              <Ionicons name="lock-closed" size={20} color="#92400E" />
              <Text style={styles.warningText}>
                Suas denúncias são tratadas com <Text style={styles.warningBold}>total sigilo</Text> e confidencialidade.
              </Text>
            </View>

            <Animated.View 
              style={[
                styles.listContainer,
                { 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              {denuncias.map((denuncia) => {
            const statusInfo = statusConfig[denuncia.status] || statusConfig['Em Aberto'];
            
            return (
              <TouchableOpacity
                key={denuncia.id}
                style={styles.denunciaCard}
                onPress={() => handleDenunciaPress(denuncia)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconCircle]}>
                    <Ionicons name="shield-checkmark" size={28} color="#F59E0B" />
                  </View>
                  
                  <View style={styles.cardHeaderInfo}>
                    <View style={styles.headerTags}>
                      <View style={styles.setorTag}>
                        <Ionicons name="alert-circle" size={12} color="#6B7280" />
                        <Text style={styles.setorText}>{denuncia.setor}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                        <Ionicons name={statusInfo.icon as any} size={12} color={statusInfo.color} />
                        <Text style={[styles.statusText, { color: statusInfo.color }]}>
                          {statusInfo.label}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.assuntoText} numberOfLines={2}>
                      {denuncia.assunto}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.detalhesText} numberOfLines={3}>
                    {denuncia.detalhes}
                  </Text>
                  
                  <View style={styles.cardFooter}>
                    <View style={styles.infoRow}>
                      <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                      <Text style={styles.dataText}>{formatarData(denuncia.data)}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <Ionicons name="key-outline" size={14} color="#6B7280" />
                      <Text style={styles.protocoloText}>{denuncia.numero_protocolo}</Text>
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
                            id: denuncia.id,
                            tipo: 'Denúncia'
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
                        handleDeletePress(denuncia);
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
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && denuncias.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="shield-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Nenhuma denúncia ainda</Text>
            <Text style={styles.emptySubtitle}>
              Suas denúncias registradas aparecerão aqui
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
              <Text style={styles.modalTitle}>Excluir Denúncia?</Text>
              <Text style={styles.modalSubtitle}>
                Esta ação não pode ser desfeita. A denúncia será permanentemente removida.
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
              {deleteOcorrenciaMutation.isPending ? (
                <ActivityIndicator style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 0 }} size="large" color="#F59E0B" />
              ) : (
                <>
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
                </>
              )}
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
    color: '#F59E0B',
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
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
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
  listContainer: {
    gap: 16,
  },
  denunciaCard: {
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#6B7280',
    marginTop: 16,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 14,
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
    alignItems: 'center',
    justifyContent: 'center',
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

