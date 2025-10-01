import { useAuth } from '@/context/auth-context';
import { useOcorrenciasByUser } from '@/hooks/useOcorrencias';
import { useReclamacoesByUser } from '@/hooks/useReclamacoes';
import { TipoOcorrencia } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TipoManifestacao {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  count: number;
}

export default function MinhasManifestacoes() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const { data: reclamacoes = [], isLoading: loadingReclamacoes } = useReclamacoesByUser(user?.id || 0);
  const { data: sugestoes = [], isLoading: loadingSugestoes } = useOcorrenciasByUser(user?.id || 0, TipoOcorrencia.SUGESTAO);
  const { data: elogios = [], isLoading: loadingElogios } = useOcorrenciasByUser(user?.id || 0, TipoOcorrencia.ELOGIO);
  const { data: denuncias = [], isLoading: loadingDenuncias } = useOcorrenciasByUser(user?.id || 0, TipoOcorrencia.DENUNCIA);

  const isLoading = loadingReclamacoes || loadingSugestoes || loadingElogios || loadingDenuncias;

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

  const tipos: TipoManifestacao[] = [
    {
      id: 'reclamacoes',
      title: 'Reclamações',
      icon: 'alert-circle',
      color: '#EF4444',
      description: 'Visualize suas reclamações registradas',
      count: reclamacoes.length
    },
    {
      id: 'sugestoes',
      title: 'Sugestões',
      icon: 'bulb',
      color: '#3B82F6',
      description: 'Acompanhe suas sugestões enviadas',
      count: sugestoes.length
    },
    {
      id: 'elogios',
      title: 'Elogios',
      icon: 'heart',
      color: '#10B981',
      description: 'Veja os elogios que você enviou',
      count: elogios.length
    },
    {
      id: 'denuncias',
      title: 'Denúncias',
      icon: 'shield-checkmark',
      color: '#F59E0B',
      description: 'Consulte suas denúncias realizadas',
      count: denuncias.length
    }
  ];

  const handleTipoPress = (tipo: TipoManifestacao) => {
    switch (tipo.id) {
      case 'reclamacoes':
        router.push('/lista-reclamacoes');
        break;
      case 'sugestoes':
        router.push('/lista-sugestoes');
        break;
      case 'elogios':
        router.push('/lista-elogios');
        break;
      case 'denuncias':
        router.push('/lista-denuncias');
        break;
      default:
        console.log('Tipo não implementado:', tipo.id);
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
            <Text style={styles.headerTitle}>Minhas Manifestações</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.headerIcon}>
          <Ionicons name="document-text" size={48} color="#111827" />
        </View>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>
            Acompanhe todas as suas manifestações em um só lugar
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Carregando manifestações...</Text>
          </View>
        ) : (
          <Animated.View 
            style={[
              styles.tiposContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {tipos.map((tipo) => (
            <TouchableOpacity
              key={tipo.id}
              style={[
                styles.tipoCard,
                // { backgroundColor: tipo.color + '10' }
              ]}
              onPress={() => handleTipoPress(tipo)}
              activeOpacity={0.7}
            >
              <View style={[styles.tipoIcon, { backgroundColor: tipo.color }]}>
                <Ionicons name={tipo.icon as any} size={28} color="#FFFFFF" />
              </View>
              <View style={styles.tipoInfo}>
                <View style={styles.tipoHeader}>
                  <Text style={[styles.tipoTitle, { color: tipo.color }]}>
                    {tipo.title}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: tipo.color }]}>
                    <Text style={styles.badgeText}>{tipo.count}</Text>
                  </View>
                </View>
                <Text style={styles.tipoDescription} numberOfLines={1}>
                  {tipo.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={tipo.color} />
            </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* Card de Ajuda */}
        {!isLoading && (
          <View style={styles.helpCard}>
            <Ionicons name="help-circle" size={20} color="#6366F1" />
            <Text style={styles.helpText}>
              <Text style={styles.helpBold}>Dica:</Text> Clique em qualquer tipo de manifestação para ver o histórico completo e acompanhar o status de cada uma.
            </Text>
          </View>
        )}
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
  summaryCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  tiposContainer: {
    gap: 12,
  },
  tipoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  tipoIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipoInfo: {
    flex: 1,
    gap: 4,
  },
  tipoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipoTitle: {
    fontSize: 17,
    fontFamily: 'Outfit_600SemiBold',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Outfit_700Bold',
    color: '#FFFFFF',
  },
  tipoDescription: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 12,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#4338CA',
    lineHeight: 20,
  },
  helpBold: {
    fontFamily: 'Outfit_700Bold',
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
});

