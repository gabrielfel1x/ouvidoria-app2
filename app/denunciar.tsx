import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

interface TipoDenuncia {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
}

export default function DenunciarScreen() {
  const insets = useSafeAreaInsets();
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

  const tiposDenuncia: TipoDenuncia[] = [
    {
      id: 'corrupcao',
      title: 'Corrupção',
      icon: 'cash-outline',
      color: '#DC2626',
      description: 'Desvio de recursos, propina, fraudes fiscais'
    },
    {
      id: 'ma-conduta',
      title: 'Má Conduta de Servidor',
      icon: 'person-remove-outline',
      color: '#EA580C',
      description: 'Abuso de poder, desrespeito, negligência'
    },
    {
      id: 'irregularidade-licitacao',
      title: 'Irregularidade em Licitação',
      icon: 'document-text-outline',
      color: '#D97706',
      description: 'Fraudes em processos licitatórios e contratos'
    },
    {
      id: 'nepotismo',
      title: 'Nepotismo',
      icon: 'people-outline',
      color: '#F59E0B',
      description: 'Favorecimento de familiares em contratações'
    },
    {
      id: 'assedio',
      title: 'Assédio',
      icon: 'alert-circle-outline',
      color: '#EF4444',
      description: 'Assédio moral, sexual ou discriminação'
    },
    {
      id: 'violacao-direitos',
      title: 'Violação de Direitos',
      icon: 'shield-outline',
      color: '#991B1B',
      description: 'Violação de direitos humanos ou constitucionais'
    },
    {
      id: 'patrimonio-publico',
      title: 'Dano ao Patrimônio Público',
      icon: 'business-outline',
      color: '#B91C1C',
      description: 'Destruição ou uso indevido de bens públicos'
    },
    {
      id: 'servico-irregular',
      title: 'Serviço Irregular',
      icon: 'close-circle-outline',
      color: '#C2410C',
      description: 'Falhas graves na prestação de serviços públicos'
    },
    {
      id: 'outros',
      title: 'Outras Irregularidades',
      icon: 'warning-outline',
      color: '#9A3412',
      description: 'Outras denúncias não categorizadas'
    }
  ];

  const handleTipoDenunciaPress = (tipo: TipoDenuncia) => {
    router.push({
      pathname: '/denunciar-formulario',
      params: {
        tipoId: tipo.id,
        tipoTitle: tipo.title,
        tipoIcon: tipo.icon,
        tipoColor: tipo.color,
        tipoDescription: tipo.description
      }
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
            <Text style={styles.headerTitle}>Fazer Denúncia</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.headerIcon}>
          <Ionicons name="shield-checkmark-outline" size={48} color="#111827" />
        </View>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>
            Selecione o tipo de denúncia para continuar
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Aviso de Sigilo */}
        <View style={styles.warningCard}>
          <Ionicons name="lock-closed" size={20} color="#92400E" />
          <Text style={styles.warningText}>
            Todas as denúncias são tratadas com <Text style={styles.warningBold}>total sigilo</Text>. 
            Sua identidade será preservada.
          </Text>
        </View>

        <Animated.View 
          style={[
            styles.tiposContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {tiposDenuncia.map((tipo) => (
            <TouchableOpacity
              key={tipo.id}
              style={[
                styles.tipoCard,
                { backgroundColor: tipo.color + '10' }
              ]}
              onPress={() => handleTipoDenunciaPress(tipo)}
              activeOpacity={0.7}
            >
              <View style={[styles.tipoIcon, { backgroundColor: tipo.color }]}>
                <Ionicons name={tipo.icon as any} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.tipoInfo}>
                <Text style={[styles.tipoTitle, { color: tipo.color }]}>
                  {tipo.title}
                </Text>
                <Text style={styles.tipoDescription} numberOfLines={2}>
                  {tipo.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={tipo.color} />
            </TouchableOpacity>
          ))}
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
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
    // borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
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
  tiposContainer: {
    gap: 12,
  },
  tipoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  tipoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipoInfo: {
    flex: 1,
    gap: 4,
  },
  tipoTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
  },
  tipoDescription: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
});
