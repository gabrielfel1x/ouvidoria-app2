import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Reclamacao {
  id: number;
  numero_protocolo: string;
  descricao: string;
  data: string;
  endereco: string;
  localizacao: string;
  imagem: string;
  status: string;
  categoria_id: number;
  usuario_id: number;
  created_at: string;
  updated_at: string;
  categoria: {
    id: number;
    nome: string;
  };
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

export default function ListaReclamacoesScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reclamacaoToDelete, setReclamacaoToDelete] = useState<Reclamacao | null>(null);

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
  const reclamacoes: Reclamacao[] = [
    {
      id: 1,
      numero_protocolo: '2024092800123',
      descricao: 'Grande buraco na Rua das Flores, altura do número 123',
      data: '2024-09-28',
      endereco: 'Rua das Flores, 123',
      localizacao: '-23.5505,-46.6333',
      imagem: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
      status: 'Em Andamento',
      categoria_id: 1,
      usuario_id: 1,
      created_at: '2024-09-28T10:30:00Z',
      updated_at: '2024-09-28T14:20:00Z',
      categoria: {
        id: 1,
        nome: 'Vias Públicas'
      },
      satisfacao_do_usuario: null
    },
    {
      id: 2,
      numero_protocolo: '2024092500087',
      descricao: 'Poste de luz queimado na Avenida Central, próximo ao mercado',
      data: '2024-09-25',
      endereco: 'Avenida Central, 456',
      localizacao: '-23.5489,-46.6388',
      imagem: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400',
      status: 'Resolvido',
      categoria_id: 2,
      usuario_id: 1,
      created_at: '2024-09-25T08:15:00Z',
      updated_at: '2024-09-26T16:45:00Z',
      categoria: {
        id: 2,
        nome: 'Iluminação Pública'
      },
      satisfacao_do_usuario: 'Satisfeito'
    },
    {
      id: 3,
      numero_protocolo: '2024092700201',
      descricao: 'Lixo acumulado na praça principal há mais de uma semana',
      data: '2024-09-27',
      endereco: 'Praça da República',
      localizacao: '-23.5431,-46.6422',
      imagem: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400',
      status: 'Em Aberto',
      categoria_id: 3,
      usuario_id: 1,
      created_at: '2024-09-27T14:22:00Z',
      updated_at: '2024-09-27T14:22:00Z',
      categoria: {
        id: 3,
        nome: 'Limpeza Urbana'
      },
      satisfacao_do_usuario: null
    },
    {
      id: 4,
      numero_protocolo: '2024092000045',
      descricao: 'Vazamento de água na Rua dos Palmares, esquina com a Rua São José',
      data: '2024-09-20',
      endereco: 'Rua dos Palmares, esquina com Rua São José',
      localizacao: '-23.5521,-46.6311',
      imagem: '',
      status: 'Resolvido',
      categoria_id: 4,
      usuario_id: 1,
      created_at: '2024-09-20T07:30:00Z',
      updated_at: '2024-09-22T18:00:00Z',
      categoria: {
        id: 4,
        nome: 'Abastecimento de Água'
      },
      satisfacao_do_usuario: 'Muito satisfeito'
    },
    {
      id: 5,
      numero_protocolo: '2024091500312',
      descricao: 'Veículos estacionados em fila dupla bloqueando a via durante horário de pico',
      data: '2024-09-15',
      endereco: 'Rua do Comércio, 789',
      localizacao: '-23.5558,-46.6396',
      imagem: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400',
      status: 'Cancelado',
      categoria_id: 5,
      usuario_id: 1,
      created_at: '2024-09-15T11:45:00Z',
      updated_at: '2024-09-16T09:30:00Z',
      categoria: {
        id: 5,
        nome: 'Trânsito'
      },
      satisfacao_do_usuario: null
    }
  ];

  const handleReclamacaoPress = (reclamacao: Reclamacao) => {
    router.push({
      pathname: '/detalhes-reclamacao',
      params: {
        id: reclamacao.id,
        // Em produção, apenas passaríamos o ID e buscaríamos os dados na API
        // Por enquanto, passamos os dados mockados
      }
    });
  };

  const handleDeletePress = (reclamacao: Reclamacao) => {
    setReclamacaoToDelete(reclamacao);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implementar exclusão na API
    console.log('Excluir reclamação:', reclamacaoToDelete?.id);
    setShowDeleteModal(false);
    setReclamacaoToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setReclamacaoToDelete(null);
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
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Minhas Reclamações</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.headerIcon}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
        </View>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>
            {reclamacoes.length} {reclamacoes.length === 1 ? 'reclamação registrada' : 'reclamações registradas'}
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
          {reclamacoes.map((reclamacao, index) => {
            const statusInfo = statusConfig[reclamacao.status] || statusConfig['Em Aberto'];
            
            return (
              <TouchableOpacity
                key={reclamacao.id}
                style={styles.reclamacaoCard}
                onPress={() => handleReclamacaoPress(reclamacao)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  {reclamacao.imagem ? (
                    <Image 
                      source={{ uri: reclamacao.imagem }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.cardImagePlaceholder, { backgroundColor: '#EF444410' }]}>
                      <Ionicons name="image-outline" size={32} color="#EF4444" />
                    </View>
                  )}
                  
                  <View style={styles.cardHeaderInfo}>
                    <View style={styles.headerTags}>
                      <View style={styles.categoriaTag}>
                        <Ionicons name="pricetag" size={12} color="#6B7280" />
                        <Text style={styles.categoriaText}>{reclamacao.categoria.nome}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                        <Ionicons name={statusInfo.icon as any} size={12} color={statusInfo.color} />
                        <Text style={[styles.statusText, { color: statusInfo.color }]}>
                          {statusInfo.label}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.tipoText} numberOfLines={2}>
                      {reclamacao.endereco}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.descricaoText} numberOfLines={2}>
                    {reclamacao.descricao}
                  </Text>
                  
                  <View style={styles.cardFooter}>
                    <View style={styles.infoRow}>
                      <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                      <Text style={styles.dataText}>{formatarData(reclamacao.data)}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <Ionicons name="key-outline" size={14} color="#6B7280" />
                      <Text style={styles.protocoloText}>{reclamacao.numero_protocolo}</Text>
                    </View>
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        // TODO: Implementar edição
                        console.log('Editar reclamação:', reclamacao.id);
                      }}
                    >
                      <Ionicons name="create-outline" size={18} color="#3B82F6" />
                      <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeletePress(reclamacao);
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

        {/* Empty State (caso não tenha reclamações) */}
        {reclamacoes.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Nenhuma reclamação ainda</Text>
            <Text style={styles.emptySubtitle}>
              Suas reclamações registradas aparecerão aqui
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
              <Text style={styles.modalTitle}>Excluir Reclamação?</Text>
              <Text style={styles.modalSubtitle}>
                Esta ação não pode ser desfeita. A reclamação será permanentemente removida.
              </Text>
            </View>

            {reclamacaoToDelete && (
              <View style={styles.modalReclamacaoInfo}>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="key-outline" size={16} color="#6B7280" />
                  <Text style={styles.modalInfoText}>
                    Protocolo: {reclamacaoToDelete.numero_protocolo}
                  </Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text style={styles.modalInfoText} numberOfLines={1}>
                    {reclamacaoToDelete.endereco}
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
    marginVertical: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    textAlign: 'center',
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
  reclamacaoCard: {
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
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  cardImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
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
  categoriaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoriaText: {
    fontSize: 11,
    fontFamily: 'Outfit_500Medium',
    color: '#6B7280',
  },
  tipoText: {
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
  descricaoText: {
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
  modalReclamacaoInfo: {
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

