import { useRespostasOcorrencia } from '@/hooks/useOcorrencias';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RespostasOcorrenciaScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const { data: respostas = [], isLoading, error, refetch } = useRespostasOcorrencia(Number(id));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }] }>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Respostas da Ocorrência</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Carregando respostas...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text style={styles.errorTitle}>Erro ao carregar</Text>
            <Text style={styles.errorSubtitle}>{error?.message || 'Não foi possível carregar as respostas'}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View style={[styles.listContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {respostas.map((resp) => (
              <View key={resp.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color="#6366F1" />
                  <Text style={styles.cardDate}>{new Date(resp.created_at || resp.data).toLocaleString('pt-BR')}</Text>
                </View>
                <Text style={styles.cardText}>{resp.descricao}</Text>
              </View>
            ))}

            {respostas.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubble-outline" size={64} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>Nenhuma resposta ainda</Text>
                <Text style={styles.emptySubtitle}>As respostas da administração aparecerão aqui</Text>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { padding: 8 },
  headerSpacer: { width: 40 },
  titleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 20, fontFamily: 'Outfit_700Bold', color: '#111827' },
  content: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  listContainer: { gap: 12 },
  card: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  cardDate: { fontSize: 12, fontFamily: 'Outfit_500Medium', color: '#6B7280' },
  cardText: { fontSize: 15, fontFamily: 'Outfit_400Regular', color: '#111827', lineHeight: 22 },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  loadingText: { fontSize: 16, fontFamily: 'Outfit_500Medium', color: '#6B7280', marginTop: 16 },
  errorContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  errorTitle: { fontSize: 18, fontFamily: 'Outfit_600SemiBold', color: '#111827', marginTop: 16, marginBottom: 8 },
  errorSubtitle: { fontSize: 14, fontFamily: 'Outfit_400Regular', color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  retryButton: { backgroundColor: '#6366F1', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  retryButtonText: { fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: '#FFFFFF' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontFamily: 'Outfit_600SemiBold', color: '#111827', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, fontFamily: 'Outfit_400Regular', color: '#6B7280', textAlign: 'center', lineHeight: 20 },
});


