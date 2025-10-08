import Colors from '@/constants/Colors';
import { useAuth } from '@/context/auth-context';
import { useUsuario } from '@/hooks/useUsuarios';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

const { width, height } = Dimensions.get('window');
const H_PADDING = width > 768 ? 40 : 20;

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const primary = Colors.light.primary;
  const { user, signOut, isLoading } = useAuth();
  const { data: userData, refetch: refetchUser, isRefetching } = useUsuario(user?.id || 0, !!user?.id);
  const bottomPadding = insets.bottom + 100;

  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        refetchUser();
      }
    }, [user?.id, refetchUser])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id) {
        refetchUser();
      }
    }, 30000); // Refresh a cada 30 segundos

    return () => clearInterval(interval);
  }, [user?.id, refetchUser]);

  const handleLogout = async () => {
      await signOut();
      toast.success('Logout realizado com sucesso!');
  };
  const formatCPF = (cpf: string) => {
    if (!cpf) return '-';
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return cpf;
    return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9,11)}`;
  };

  const formatTelefone = (telefone: string) => {
    if (!telefone) return '-';
    const digits = telefone.replace(/\D/g, '');
    if (digits.length === 11) {
      return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
    }
    if (digits.length === 10) {
      return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6,10)}`;
    }
    return telefone;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={[styles.avatarContainer, { backgroundColor: primary }]}>
            <Text style={styles.avatarText}>
              {userData?.nome?.charAt(0).toUpperCase() || user?.nome?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{userData?.nome || user?.nome || 'Usuário'}</Text>
            {isRefetching && (
              <ActivityIndicator size="small" color={primary} style={styles.refreshIndicator} />
            )}
          </View>
          <Text style={styles.headerSubtitle}>
            {userData?.email || user?.email}
          </Text>
        </View>
      </View>

      <ScrollView style={[styles.content, { paddingBottom: bottomPadding }]} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="call-outline" size={20} color={primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Telefone</Text>
              <Text style={styles.infoValue}>{formatTelefone(userData?.telefone || user?.telefone || '')}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="card-outline" size={20} color={primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>CPF</Text>
              <Text style={styles.infoValue}>{formatCPF(userData?.cpf || user?.cpf || '')}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="location-outline" size={20} color={primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Endereço</Text>
              <Text style={styles.infoValue}>{userData?.endereco || user?.endereco || '-'}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, styles.lastInfoRow]}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="home-outline" size={20} color={primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Bairro</Text>
              <Text style={styles.infoValue}>{userData?.bairro || user?.bairro || '-'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/minhas-manifestacoes')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#3B82F6' }]}>
              <Ionicons name="document-text" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={[styles.menuText, { color: '#3B82F6' }]}>Minhas Manifestações</Text>
              <Text style={styles.menuDescription}>Acompanhe suas manifestações</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/configuracoes')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#8B5CF6' }]}>
              <Ionicons name="settings" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={[styles.menuText, { color: '#8B5CF6' }]}>Configurações</Text>
              <Text style={styles.menuDescription}>Gerencie suas preferências</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8B5CF6" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/sobre-app')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#F59E0B' }]}>
              <Ionicons name="information-circle" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={[styles.menuText, { color: '#F59E0B' }]}>Sobre o App</Text>
              <Text style={styles.menuDescription}>Informações do aplicativo</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#F59E0B" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.logoutButton, { borderColor: '#EF4444' }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <>
                <View style={[styles.menuIcon, { backgroundColor: '#EF4444' }]}>
                  <Ionicons name="log-out" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.menuInfo}>
                  <Text style={[styles.logoutText, { color: '#EF4444' }]}>Sair</Text>
                  <Text style={styles.menuDescription}>Fazer logout da conta</Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontFamily: 'Outfit_700Bold',
    color: '#FFFFFF',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    color: '#111827',
    textAlign: 'center',
  },
  refreshIndicator: {
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#111827',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastInfoRow: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: 'Outfit_500Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
  },
  menuSection: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
    gap: 2,
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
  },
  menuDescription: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
  },
});
