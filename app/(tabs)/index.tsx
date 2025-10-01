import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
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
const H_PADDING = 20;
const GRID_GAP = 10;
const CARD_WIDTH = (width - (H_PADDING * 2) - GRID_GAP) / 2;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = insets.top + 20;
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
          <Ionicons name="megaphone" size={24} color={primary} style={styles.headerIcon} />
          <View>
            <Text style={styles.headerTitle}>Ouvidoria Móvel</Text>
            <Text style={styles.headerSubtitle}>Sua voz é importante</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
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
                style={[styles.menuCard, { backgroundColor: item.color + '15' }]}
                onPress={() => handleMenuPress(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={32} 
                    color="#FFFFFF" 
                  />
                </View>
                <Text style={[styles.cardTitle, { color: '#1F2937' }]} numberOfLines={1}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
              <Ionicons name="information-circle-outline" size={24} color={primary} />
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
              <Ionicons name="time-outline" size={24} color={primary} />
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 14
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
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: H_PADDING,
    paddingBottom: 160,
  },
  heroTitle: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
    paddingVertical: 20,
    textAlign: 'left',
    paddingHorizontal: 8,
  },
  menuSection: {
    marginBottom: 32,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: GRID_GAP,
  },
  menuCard: {
    width: CARD_WIDTH,
    height: 160,
    borderRadius: 24,
    padding: 24,
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
    marginBottom: 14,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Outfit_700Bold',
    textAlign: 'center',
  },
  infoSection: {
    gap: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
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
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});