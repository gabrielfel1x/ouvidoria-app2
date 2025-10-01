import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface ComplaintType {
  id: string;
  title: string;
  icon: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  complaints: ComplaintType[];
}

export default function ReclamarScreen() {
  const insets = useSafeAreaInsets();
  const primary = Colors.light.primary;
  const fadeAnim = useRef(new Animated.Value(0));
  const slideAnim = useRef(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim.current, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim.current, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const categories: Category[] = [
    {
      id: 'infraestrutura',
      title: 'Infraestrutura',
      description: 'Problemas com ruas, calçadas e estruturas urbanas',
      icon: 'construct-outline',
      color: '#8B5CF6',
      complaints: [
        { id: 'buraco', title: 'Buraco na rua', icon: 'radio-button-off-outline' },
        { id: 'queda-arvore', title: 'Queda de árvore', icon: 'leaf-outline' },
        { id: 'iluminacao', title: 'Iluminação pública', icon: 'bulb-outline' },
        { id: 'entulho', title: 'Entulho', icon: 'cube-outline' },
        { id: 'limpeza-publica', title: 'Limpeza pública', icon: 'brush-outline' }
      ]
    },
    {
      id: 'transito',
      title: 'Trânsito',
      description: 'Problemas relacionados ao tráfego e mobilidade',
      icon: 'car-outline',
      color: '#F59E0B',
      complaints: [
        { id: 'acidente', title: 'Acidente', icon: 'warning-outline' },
        { id: 'estacionamento-irregular', title: 'Estacionamento irregular', icon: 'car-sport-outline' },
        { id: 'sinais-transito', title: 'Sinais de trânsito', icon: 'trail-sign-outline' },
        { id: 'poluicao-sonora', title: 'Poluição sonora', icon: 'volume-high-outline' }
      ]
    },
    {
      id: 'agua',
      title: 'Serviço de Água',
      description: 'Problemas com fornecimento e qualidade da água',
      icon: 'water-outline',
      color: '#3B82F6',
      complaints: [
        { id: 'falta-agua', title: 'Falta de água', icon: 'remove-circle-outline' },
        { id: 'vazamento', title: 'Vazamento', icon: 'water-outline' },
        { id: 'qualidade-agua', title: 'Qualidade da água', icon: 'flask-outline' }
      ]
    },
    {
      id: 'saude',
      title: 'Saúde Pública',
      description: 'Problemas relacionados à saúde e bem-estar',
      icon: 'medical-outline',
      color: '#EF4444',
      complaints: [
        { id: 'dengue', title: 'Dengue', icon: 'bug-outline' },
        { id: 'ueiro', title: 'Ueiro', icon: 'medical-outline' },
        { id: 'lixo', title: 'Acúmulo de lixo', icon: 'trash-outline' }
      ]
    },
    {
      id: 'outros',
      title: 'Outros',
      description: 'Outras reclamações não categorizadas',
      icon: 'ellipsis-horizontal-outline',
      color: '#6B7280',
      complaints: [
        { id: 'outro', title: 'Outro', icon: 'help-circle-outline' }
      ]
    }
  ];

  const handleComplaintPress = (category: Category, complaint: ComplaintType) => {
    router.push({
      pathname: '/reclamar-formulario',
      params: { 
        category: category.id, 
        categoryTitle: category.title,
        complaintType: complaint.id,
        complaintTitle: complaint.title
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
            <Text style={styles.headerTitle}>Registrar Reclamação</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="warning-outline" size={48} color="#111827" />
        </View>
        <View style={styles.headerContent}>
           <Text style={styles.headerSubtitle}>
             Clique no tipo específico do problema para continuar
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
            styles.categoriesContainer,
            { 
              opacity: fadeAnim.current,
              transform: [{ translateY: slideAnim.current }]
            }
          ]}
        >
          {categories.map((category) => (
             <View key={category.id} style={styles.categorySection}>
               <View style={[styles.categoryCard, { borderLeftColor: category.color }]}>
                 <View style={styles.categoryHeader}>
                   <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                     <Ionicons name={category.icon as any} size={24} color="#FFFFFF" />
                   </View>
                   <View style={styles.categoryInfo}>
                     <Text style={styles.categoryTitle}>{category.title}</Text>
                     <Text style={styles.categoryDescription}>{category.description}</Text>
                   </View>
                 </View>
               </View>

              <View style={styles.complaintsGrid}>
                {category.complaints.map((complaint) => (
                  <TouchableOpacity
                    key={complaint.id}
                    style={[styles.complaintCard, { backgroundColor: category.color + '10' }]}
                    onPress={() => handleComplaintPress(category, complaint)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.complaintIcon, { backgroundColor: category.color }]}>
                      <Ionicons name={complaint.icon as any} size={16} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.complaintTitle, { color: category.color }]}>
                      {complaint.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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
    width: 40, // Mesmo tamanho do botão para centralizar o título
  },
  headerContent: {
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerIcon: {
    alignItems: 'center',
    marginVertical: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
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
    paddingTop: 8,
  },
  categoriesContainer: {
    gap: 36,
  },
  categorySection: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    // borderLeftWidth: 4,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  complaintsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  complaintCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    width: '48%', // 48% para 2 colunas com espaço entre elas
    flexGrow: 1,
    flexShrink: 1,
  },
  complaintIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  complaintTitle: {
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
    flex: 1,
  },
});
