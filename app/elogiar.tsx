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

interface Setor {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
}

export default function ElogiarScreen() {
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

  const setores: Setor[] = [
    {
      id: 'atendimento',
      title: 'Atendimento',
      icon: 'people-outline',
      color: '#10B981',
      description: 'Elogie o atendimento recebido em qualquer serviço'
    },
    {
      id: 'saude',
      title: 'Saúde',
      icon: 'medical-outline',
      color: '#EF4444',
      description: 'Reconheça profissionais e serviços de saúde'
    },
    {
      id: 'educacao',
      title: 'Educação',
      icon: 'school-outline',
      color: '#3B82F6',
      description: 'Elogie professores, escolas e projetos educacionais'
    },
    {
      id: 'infraestrutura',
      title: 'Infraestrutura',
      icon: 'construct-outline',
      color: '#8B5CF6',
      description: 'Reconheça melhorias em ruas, praças e obras'
    },
    {
      id: 'limpeza',
      title: 'Limpeza Pública',
      icon: 'trash-outline',
      color: '#F59E0B',
      description: 'Elogie o trabalho de limpeza e coleta'
    },
    {
      id: 'seguranca',
      title: 'Segurança',
      icon: 'shield-checkmark-outline',
      color: '#6366F1',
      description: 'Reconheça ações de segurança pública'
    },
    {
      id: 'transporte',
      title: 'Transporte',
      icon: 'bus-outline',
      color: '#F59E0B',
      description: 'Elogie o transporte público e mobilidade'
    },
    {
      id: 'cultura',
      title: 'Cultura e Lazer',
      icon: 'musical-notes-outline',
      color: '#EC4899',
      description: 'Reconheça eventos culturais e espaços de lazer'
    },
    {
      id: 'assistencia-social',
      title: 'Assistência Social',
      icon: 'heart-outline',
      color: '#14B8A6',
      description: 'Elogie programas e atendimentos sociais'
    },
    {
      id: 'outros',
      title: 'Outros Serviços',
      icon: 'star-outline',
      color: '#6B7280',
      description: 'Elogie outros serviços públicos'
    }
  ];

  const handleSetorPress = (setor: Setor) => {
    router.push({
      pathname: '/elogiar-formulario',
      params: {
        setorId: setor.id,
        setorTitle: setor.title,
        setorIcon: setor.icon,
        setorColor: setor.color,
        setorDescription: setor.description
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
            <Text style={styles.headerTitle}>Enviar Elogio</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.headerIcon}>
          <Ionicons name="heart-outline" size={48} color="#111827" />
        </View>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>
            Selecione o setor do seu elogio para continuar
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
            styles.setoresContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {setores.map((setor) => (
            <TouchableOpacity
              key={setor.id}
              style={[
                styles.setorCard,
                { backgroundColor: setor.color + '10' }
              ]}
              onPress={() => handleSetorPress(setor)}
              activeOpacity={0.7}
            >
              <View style={[styles.setorIcon, { backgroundColor: setor.color }]}>
                <Ionicons name={setor.icon as any} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.setorInfo}>
                <Text style={[styles.setorTitle, { color: setor.color }]}>
                  {setor.title}
                </Text>
                <Text style={styles.setorDescription} numberOfLines={2}>
                  {setor.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={setor.color} />
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
  setoresContainer: {
    gap: 12,
  },
  setorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  setorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  setorInfo: {
    flex: 1,
    gap: 4,
  },
  setorTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
  },
  setorDescription: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
});
