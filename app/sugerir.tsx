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

export default function SugerirScreen() {
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
      id: 'infraestrutura',
      title: 'Infraestrutura',
      icon: 'construct-outline',
      color: '#8B5CF6',
      description: 'Melhorias em ruas, calçadas e estruturas urbanas'
    },
    {
      id: 'transporte',
      title: 'Transporte Público',
      icon: 'bus-outline',
      color: '#F59E0B',
      description: 'Sugestões para melhorar o transporte e mobilidade'
    },
    {
      id: 'saude',
      title: 'Saúde',
      icon: 'medical-outline',
      color: '#EF4444',
      description: 'Ideias para os serviços de saúde pública'
    },
    {
      id: 'educacao',
      title: 'Educação',
      icon: 'school-outline',
      color: '#3B82F6',
      description: 'Sugestões para melhorar a educação'
    },
    {
      id: 'meio-ambiente',
      title: 'Meio Ambiente',
      icon: 'leaf-outline',
      color: '#10B981',
      description: 'Ideias para sustentabilidade e preservação'
    },
    {
      id: 'servicos',
      title: 'Serviços Públicos',
      icon: 'people-outline',
      color: '#6366F1',
      description: 'Melhorias nos atendimentos e serviços'
    },
    {
      id: 'lazer',
      title: 'Lazer e Cultura',
      icon: 'musical-notes-outline',
      color: '#EC4899',
      description: 'Sugestões para eventos e espaços culturais'
    },
    {
      id: 'tecnologia',
      title: 'Tecnologia',
      icon: 'phone-portrait-outline',
      color: '#14B8A6',
      description: 'Inovações e melhorias digitais'
    },
    {
      id: 'outros',
      title: 'Outros',
      icon: 'ellipsis-horizontal-outline',
      color: '#6B7280',
      description: 'Outras sugestões não categorizadas'
    }
  ];

  const handleSetorPress = (setor: Setor) => {
    router.push({
      pathname: '/sugerir-formulario',
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
            <Text style={styles.headerTitle}>Enviar Sugestão</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.headerIcon}>
          <Ionicons name="bulb-outline" size={48} color="#111827" />
        </View>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>
            Selecione o setor da sua sugestão para continuar
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
