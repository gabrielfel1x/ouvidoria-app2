import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const primary = Colors.light.primary;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={[styles.avatarContainer, { backgroundColor: primary }]}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <Text style={styles.headerSubtitle}>
            Gerencie suas informações e manifestações
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={24} color={primary} />
            <Text style={styles.menuText}>Minhas Manifestações</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color={primary} />
            <Text style={styles.menuText}>Configurações</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color={primary} />
            <Text style={styles.menuText}>Ajuda e Suporte</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle-outline" size={24} color={primary} />
            <Text style={styles.menuText}>Sobre o App</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.logoutButton, { borderColor: '#EF4444' }]}>
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text style={[styles.logoutText, { color: '#EF4444' }]}>Sair</Text>
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
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
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
    paddingHorizontal: 20,
  },
  menuSection: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#111827',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 20,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
  },
});
