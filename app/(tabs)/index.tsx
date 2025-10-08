import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const H_PADDING = width > 768 ? 40 : 20;
const GRID_GAP = width > 768 ? 16 : 10;
const CARD_WIDTH = (width - (H_PADDING * 2) - GRID_GAP) / 2;
const isWeb = Platform.OS === 'web';
const isTablet = width > 768;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = insets.top + (isWeb ? 10 : 20);
  const bottomPadding = insets.bottom + (isWeb ? 40 : 100);
  const fadeAnim = useRef(new Animated.Value(0));
  const slideAnim = useRef(new Animated.Value(50));
  const primary = Colors.light.primary;

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

  const menuItems = [
    {
      id: 'reclamar',
      title: 'Reclamar',
      icon: 'alert-circle-outline',
      color: '#EF4444',
      route: '/reclamar'
    },
    {
      id: 'sugerir',
      title: 'Sugerir',
      icon: 'bulb-outline',
      color: '#3B82F6',
      route: '/sugerir'
    },
    {
      id: 'elogiar',
      title: 'Elogiar',
      icon: 'heart-outline',
      color: '#10B981',
      route: '/elogiar'
    },
    {
      id: 'denunciar',
      title: 'Denunciar',
      icon: 'shield-outline',
      color: '#F59E0B',
      route: '/denunciar'
    }
  ];

  const handleMenuPress = (item: any) => {
    router.push(item.route as any);
  };

  const getCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    if (hour > 18 && hour < 24 || hour >= 0 && hour < 5) return 'Boa noite';
    return 'Olá';
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar style="light" />

      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Ionicons name="megaphone" size={isTablet ? 28 : 24} color={primary} style={styles.headerIcon} />
          <View>
            <Text style={styles.headerTitle}>Ouvidoria Móvel</Text>
            <Text style={styles.headerSubtitle}>Sua voz é importante</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Text style={styles.heroTitle}>
          {getCurrentTime()},{"\n"}
          Como podemos te ajudar?
        </Text>

        <Animated.View 
          style={[
            styles.menuSection,
            { 
              opacity: fadeAnim.current,
              transform: [{ translateY: slideAnim.current }]
            }
          ]}
        >
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuCard, { backgroundColor: item.color }]}
                onPress={() => handleMenuPress(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer]}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={isTablet ? 36 : 32} 
                    color={item.color} 
                  />
                </View>
                <Text style={[styles.cardTitle, { color: '#1F2937' }]} numberOfLines={1}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.manifestationsSection,
            { 
              opacity: fadeAnim.current,
              transform: [{ translateY: slideAnim.current }]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.manifestationsCard}
            onPress={() => router.push('/minhas-manifestacoes')}
            activeOpacity={0.8}
          >
            <View style={styles.manifestationsContent}>
              <View style={styles.manifestationsIcon}>
                <Ionicons name="list-outline" size={isTablet ? 32 : 28} color="#FFFFFF" />
              </View>
              <View style={styles.manifestationsText}>
                <Text style={styles.manifestationsTitle}>Minhas Manifestações</Text>
                <Text style={styles.manifestationsSubtitle}>
                  Acompanhe suas reclamações, sugestões, elogios e denúncias
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#6B7280" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          style={[
            styles.infoSection,
            { 
              opacity: fadeAnim.current,
              transform: [{ translateY: slideAnim.current }]
            }
          ]}
        >
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="information-circle-outline" size={isTablet ? 28 : 24} color={primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Como funciona?</Text>
              <Text style={styles.infoSubtitle}>
                Selecione uma das opções acima para registrar sua manifestação. 
                Você receberá um protocolo para acompanhar o andamento.
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="time-outline" size={isTablet ? 28 : 24} color={primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Prazo de resposta</Text>
              <Text style={styles.infoSubtitle}>
                Todas as manifestações são respondidas em até 30 dias úteis, 
                conforme previsto na Lei de Acesso à Informação.
              </Text>
            </View>
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PADDING,
    paddingVertical: isTablet ? 18 : 14,
    borderRadius: 16,
    marginHorizontal: H_PADDING,
    marginBottom: isTablet ? 20 : 14
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  headerRight: {
    padding: 6,
    marginLeft: 12,
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Outfit_700Bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: isTablet ? 15 : 13,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: H_PADDING,
  },
  heroTitle: {
    fontSize: isTablet ? 40 : 32,
    lineHeight: isTablet ? 48 : 38,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
    paddingVertical: isTablet ? 28 : 20,
    textAlign: 'left',
    paddingHorizontal: 8,
  },
  menuSection: {
    marginBottom: isTablet ? 32 : 24,
  },
  manifestationsSection: {
    marginBottom: isTablet ? 40 : 32,
  },
  manifestationsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: isTablet ? 24 : 20,
    padding: isTablet ? 28 : 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  manifestationsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manifestationsIcon: {
    width: isTablet ? 64 : 56,
    height: isTablet ? 64 : 56,
    borderRadius: isTablet ? 32 : 28,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isTablet ? 20 : 16,
  },
  manifestationsText: {
    flex: 1,
  },
  manifestationsTitle: {
    fontSize: isTablet ? 20 : 18,
    fontFamily: 'Outfit_600SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  manifestationsSubtitle: {
    fontSize: isTablet ? 15 : 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    lineHeight: isTablet ? 22 : 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: GRID_GAP,
  },
  menuCard: {
    width: CARD_WIDTH,
    height: isTablet ? 180 : 160,
    borderRadius: isTablet ? 28 : 24,
    padding: isTablet ? 28 : 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    marginBottom: isTablet ? 16 : 14,
    width: isTablet ? 68 : 60,
    height: isTablet ? 68 : 60,
    borderRadius: 99,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: isTablet ? 16 : 15,
    fontFamily: 'Outfit_700Bold',
    textAlign: 'center',
  },
  infoSection: {
    gap: isTablet ? 20 : 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: isTablet ? 24 : 20,
    borderRadius: isTablet ? 20 : 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  infoIcon: {
    marginRight: isTablet ? 20 : 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: isTablet ? 15 : 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    lineHeight: isTablet ? 22 : 20,
  },
});