import { useReclamacao } from '@/hooks/useReclamacoes';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Importação condicional do MapView apenas para plataformas nativas
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch (error) {
    console.warn('react-native-maps não disponível:', error);
  }
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

export default function DetalhesReclamacaoScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { id } = params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const mapRef = useRef<any>(null);

  const { data: reclamacao, isLoading, error } = useReclamacao(Number(id));

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

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#EF4444" />
        <Text style={styles.loadingText}>Carregando reclamação...</Text>
      </View>
    );
  }

  if (error || !reclamacao) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20, justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorTitle}>Erro ao carregar</Text>
        <Text style={styles.errorSubtitle}>
          {error?.message || 'Não foi possível carregar os detalhes da reclamação'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusInfo = statusConfig[reclamacao.status] || statusConfig['Em Aberto'];
  
  const urlImagem = typeof reclamacao.imagem === 'string' ? reclamacao.imagem : (reclamacao.imagem as any)?.url;
  
  const [latitude, longitude] = reclamacao.localizacao ? reclamacao.localizacao.split(',').map(coord => parseFloat(coord.trim())) : [0, 0];
  const hasValidLocation = !isNaN(latitude) && !isNaN(longitude) && latitude !== 0 && longitude !== 0;

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
            <Text style={styles.headerTitle}>Detalhes da Reclamação</Text>
          </View>
          <View style={styles.headerSpacer} />
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
                <Text style={styles.protocoloNumber}>{reclamacao.numero_protocolo}</Text>
              </View>
            </View>
          </View>

            {reclamacao.imagem && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Foto do Problema</Text>
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: urlImagem }}
                    style={styles.reclamacaoImage}
                    resizeMode="cover"
                  />
                </View>
              </View>
            )}

          {/* Categoria */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoria</Text>
            <View style={styles.infoCard}>
              <Ionicons name="pricetag" size={20} color="#EF4444" />
              <Text style={styles.infoText}>{reclamacao.categoria?.nome || 'Não informado'}</Text>
            </View>
          </View>

          {/* Endereço */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Localização</Text>
            <View style={styles.infoCard}>
              <Ionicons name="location" size={20} color="#EF4444" />
              <Text style={styles.infoText}>{reclamacao.endereco || 'Não informado'}</Text>
            </View>
            
            {/* Preview do Mapa */}
            {hasValidLocation && (
              <View style={styles.mapPreviewWrapper}>
                <View style={styles.mapPreviewHeader}>
                  <View style={styles.mapPreviewBadge}>
                    <Ionicons name="map" size={16} color="#EF4444" />
                    <Text style={styles.mapPreviewBadgeText}>Localização Registrada</Text>
                  </View>
                </View>
                
                <View style={styles.mapContainer}>
                  {Platform.OS !== 'web' && MapView ? (
                    <MapView
                      ref={mapRef}
                      style={styles.map}
                      initialRegion={{
                        latitude,
                        longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      }}
                      scrollEnabled={true}
                      zoomEnabled={true}
                    >
                      {Marker && (
                        <Marker
                          coordinate={{
                            latitude,
                            longitude,
                          }}
                          title="Local do Problema"
                          description={reclamacao.endereco || 'Local não informado'}
                        >
                          <View style={styles.customMarker}>
                            <Ionicons name="alert-circle" size={32} color="#EF4444" />
                          </View>
                        </Marker>
                      )}
                    </MapView>
                  ) : (
                    <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' }]}>
                      <Ionicons name="location" size={48} color="#EF4444" />
                      <Text style={styles.mapCoordinatesText}>
                        {latitude.toFixed(6)}, {longitude.toFixed(6)}
                      </Text>
                      <Text style={styles.mapHintText}>Mapa não disponível na versão web</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.mapPreviewFooter}>
                  <Ionicons name="navigate" size={16} color="#6B7280" />
                  <Text style={styles.mapCoordinatesText}>
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Descrição */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição do Problema</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{reclamacao.descricao || 'Descrição não informada'}</Text>
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
                  <Text style={styles.dateValue}>{formatarData(reclamacao.data)}</Text>
                </View>
              </View>
              
              <View style={styles.dateDivider} />
              
              <View style={styles.dateRow}>
                <Ionicons name="time-outline" size={20} color="#6B7280" />
                <View style={styles.dateInfo}>
                  <Text style={styles.dateLabel}>Data de Registro</Text>
                  <Text style={styles.dateValue}>{formatarDataHora(reclamacao.created_at)}</Text>
                </View>
              </View>
              
              {reclamacao.updated_at !== reclamacao.created_at && (
                <>
                  <View style={styles.dateDivider} />
                  <View style={styles.dateRow}>
                    <Ionicons name="refresh-outline" size={20} color="#6B7280" />
                    <View style={styles.dateInfo}>
                      <Text style={styles.dateLabel}>Última Atualização</Text>
                      <Text style={styles.dateValue}>{formatarDataHora(reclamacao.updated_at)}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Satisfação do Usuário */}
          {reclamacao.satisfacao_do_usuario && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Avaliação</Text>
              <View style={styles.satisfacaoCard}>
                <Ionicons name="star" size={20} color="#F59E0B" />
                <Text style={styles.satisfacaoText}>{reclamacao.satisfacao_do_usuario}</Text>
              </View>
            </View>
          )}

          {/* Card de Ajuda */}
          <View style={styles.helpCard}>
            <Ionicons name="information-circle" size={20} color="#6366F1" />
            <Text style={styles.helpText}>
              Acompanhe o andamento da sua reclamação através do protocolo. 
              Você será notificado sobre atualizações.
            </Text>
          </View>

          {/* Botões de Ação */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonFull]} onPress={() => router.push({ pathname: '/respostas-reclamacao', params: { id } })}>
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
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reclamacaoImage: {
    width: '100%',
    height: 300,
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: '#9CA3AF',
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
  mapPreviewWrapper: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mapPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
  },
  mapPreviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapPreviewBadgeText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#EF4444',
  },
  mapContainer: {
    height: 300,
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  customMarker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
  mapHintText: {
    fontSize: 11,
    fontFamily: 'Outfit_400Regular',
    color: '#9CA3AF',
  },
  descriptionCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  descriptionText: {
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
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#4338CA',
    lineHeight: 20,
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
  actionButtonFull: {
    flex: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#6366F1',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#6B7280',
    marginTop: 16,
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
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFFFFF',
  },
});

