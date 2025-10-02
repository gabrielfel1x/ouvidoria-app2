import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SobreAppScreen() {
  const insets = useSafeAreaInsets();
  const primary = Colors.light.primary;

  const handleOpenEmail = () => {
    Linking.openURL('mailto:contatoouvidoriamovel@gmail.com');
  };

  const handleOpenWebsite = () => {
    Linking.openURL('https://ouvidoriamovel.com.br');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sobre o App</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={[styles.appIconContainer]}>
            <Image 
              source={require('@/assets/images/megafone.png')} 
              style={styles.appIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>Ouvidoria Móvel</Text>
          <Text style={styles.appVersion}>Versão 1.0.0</Text>
          <Text style={styles.appDescription}>
            Aplicativo oficial para manifestações e reclamações. 
            Facilite o acesso aos serviços públicos da sua cidade.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Funcionalidades</Text>
          
          <View style={styles.card}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="megaphone" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Reclamações</Text>
                <Text style={styles.featureDescription}>
                  Registre problemas e reclamações sobre serviços públicos
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#10B981' }]}>
                <Ionicons name="thumbs-up" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Elogios</Text>
                <Text style={styles.featureDescription}>
                  Reconheça e elogie serviços bem prestados
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="bulb" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Sugestões</Text>
                <Text style={styles.featureDescription}>
                  Contribua com ideias para melhorar a cidade
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#8B5CF6' }]}>
                <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Denúncias</Text>
                <Text style={styles.featureDescription}>
                  Reporte incidentes e situações urgentes
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefícios</Text>
          
          <View style={styles.card}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.benefitText}>Acesso rápido e fácil aos serviços</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.benefitText}>Acompanhamento em tempo real</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.benefitText}>Notificações sobre o status</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.benefitText}>Interface intuitiva e moderna</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.benefitText}>Dados protegidos e seguros</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato e Suporte</Text>
          
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={handleOpenEmail}
              activeOpacity={0.7}
            >
              <View style={[styles.contactIcon, { backgroundColor: '#EF4444' }]}>
                <Ionicons name="mail" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>Email de Suporte</Text>
                <Text style={styles.contactValue}>contatoouvidoriamovel@gmail.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {/* <TouchableOpacity 
              style={styles.contactItem}
              onPress={handleOpenWebsite}
              activeOpacity={0.7}
            >
              <View style={[styles.contactIcon, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="globe" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>Website Oficial</Text>
                <Text style={styles.contactValue}>ouvidoriamovel.com.br</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Technical Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Técnicas</Text>
          
          <View style={styles.card}>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Desenvolvido com</Text>
              <Text style={styles.techValue}>React Native + Expo</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Backend</Text>
              <Text style={styles.techValue}>Ruby on Rails</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Banco de Dados</Text>
              <Text style={styles.techValue}>PostgreSQL</Text>
            </View>
            {/* <View style={styles.techItem}>
              <Text style={styles.techLabel}>Autenticação</Text>
              <Text style={styles.techValue}>JWT (JSON Web Token)</Text>
            </View> */}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Ouvidoria Móvel. Todos os direitos reservados.
          </Text>
          <Text style={styles.footerSubtext}>
            Desenvolvido para facilitar a comunicação entre cidadãos e administração pública.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    color: '#000',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  appIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  appIcon: {
    width: 160,
    height: 160,
  },
  appName: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  appVersion: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#6B7280',
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    // borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
  },
  techItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  techLabel: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: '#6B7280',
  },
  techValue: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});
