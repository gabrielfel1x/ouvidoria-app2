import CustomAlert from '@/components/CustomAlert';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/auth-context';
import { useChangePassword, useDesativarConta, useEsqueciSenha, useUpdateUsuario, useUsuario } from '@/hooks/useUsuarios';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function ConfiguracoesScreen() {
  const insets = useSafeAreaInsets();
  const primary = Colors.light.primary;
  const { user, signOut, isLoading } = useAuth();
  
  const updateUsuarioMutation = useUpdateUsuario();
  const changePasswordMutation = useChangePassword();
  const desativarContaMutation = useDesativarConta();
  const esqueciSenhaMutation = useEsqueciSenha();
  const { data: userData, refetch: refetchUser, isRefetching } = useUsuario(user?.id || 0, !!user?.id);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    nome: user?.nome || '',
    telefone: user?.telefone || '',
    endereco: user?.endereco || '',
    bairro: user?.bairro || '',
  });

  // Estados para alertas customizados
  const [logoutAlert, setLogoutAlert] = useState(false);
  const [desativarAlert, setDesativarAlert] = useState(false);
  const [esqueciSenhaAlert, setEsqueciSenhaAlert] = useState(false);
  const [sobreAppAlert, setSobreAppAlert] = useState(false);
  const [privacidadeAlert, setPrivacidadeAlert] = useState(false);
  const [termosAlert, setTermosAlert] = useState(false);

  useEffect(() => {
    if (userData) {
      setProfileData({
        nome: userData.nome || '',
        telefone: userData.telefone || '',
        endereco: userData.endereco || '',
        bairro: userData.bairro || '',
      });
    }
  }, [userData]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchUser();
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        refetchUser();
      }
    }, [user?.id, refetchUser])
  );

  const handleLogout = () => {
    setLogoutAlert(true);
  };

  const confirmLogout = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso!');
  };

  const handleDesativarConta = () => {
    setDesativarAlert(true);
  };

  const confirmDesativarConta = async () => {
    if (user?.id) {
      try {
        await desativarContaMutation.mutateAsync({ usuario_id: user.id });
        toast.success('Conta desativada com sucesso!');
        await signOut();
      } catch (error) {
        toast.error('Erro ao desativar conta. Tente novamente.');
      }
    }
  };

  const handleSalvarPerfil = async () => {
    if (!profileData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    
    if (!user?.id) {
      toast.error('Usuário não encontrado');
      return;
    }

    try {
      await updateUsuarioMutation.mutateAsync({
        id: user.id,
        data: {
          nome: profileData.nome.trim(),
          telefone: profileData.telefone.trim() || undefined,
          endereco: profileData.endereco.trim() || undefined,
          bairro: profileData.bairro.trim() || undefined,
        }
      });
      
      setIsEditingProfile(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  const handleEsqueciSenha = () => {
    if (!userData?.email) {
      toast.error('Email não encontrado');
      return;
    }
    setEsqueciSenhaAlert(true);
  };

  const confirmEsqueciSenha = async () => {
    try {
      await esqueciSenhaMutation.mutateAsync({ email: userData?.email || '' });
      toast.success('Email de recuperação enviado!');
    } catch (error) {
      toast.error('Erro ao enviar email. Tente novamente.');
    }
  };

  const handleSobreApp = () => {
    setSobreAppAlert(true);
  };

  const handlePrivacidade = () => {
    setPrivacidadeAlert(true);
  };

  const handleTermosUso = () => {
    setTermosAlert(true);
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return '-';
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return cpf;
    return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9,11)}`;
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
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isRefetching}
            onRefresh={onRefresh}
            colors={[primary]}
            tintColor={primary}
          />
        }
      >
        {/* Seção de Perfil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil</Text>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
               <View style={styles.avatarContainer}>
                 <Text style={styles.avatarText}>
                   {userData?.nome?.charAt(0).toUpperCase() || user?.nome?.charAt(0).toUpperCase() || 'U'}
                 </Text>
               </View>
               <View style={styles.profileInfo}>
                 <Text style={styles.profileName}>{userData?.nome || user?.nome || 'Usuário'}</Text>
                 <Text style={styles.profileEmail}>{userData?.email || user?.email}</Text>
               </View>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsEditingProfile(!isEditingProfile)}
              >
                <Ionicons 
                  name={isEditingProfile ? "close" : "create-outline"} 
                  size={20} 
                  color={primary} 
                />
              </TouchableOpacity>
            </View>

            {isEditingProfile && (
              <View style={styles.editForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nome</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.nome}
                    onChangeText={(text) => setProfileData({...profileData, nome: text})}
                    placeholder="Digite seu nome"
                  />
                </View>
                
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Telefone</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.telefone}
                    onChangeText={(text) => setProfileData({...profileData, telefone: text})}
                    placeholder="Digite seu telefone"
                    keyboardType="phone-pad"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Endereço</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.endereco}
                    onChangeText={(text) => setProfileData({...profileData, endereco: text})}
                    placeholder="Digite seu endereço"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Bairro</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.bairro}
                    onChangeText={(text) => setProfileData({...profileData, bairro: text})}
                    placeholder="Digite seu bairro"
                  />
                </View>
                
                 <TouchableOpacity 
                   style={[styles.saveButton, { backgroundColor: primary }]}
                   onPress={handleSalvarPerfil}
                   disabled={updateUsuarioMutation.isPending}
                 >
                   {updateUsuarioMutation.isPending ? (
                     <ActivityIndicator size="small" color="#FFFFFF" />
                   ) : (
                     <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                   )}
                 </TouchableOpacity>
              </View>
            )}

             <View style={styles.infoRow}>
               <Ionicons name="card-outline" size={20} color="#6B7280" />
               <Text style={styles.infoText}>CPF: {formatCPF(userData?.cpf || user?.cpf || '')}</Text>
             </View>

             <View style={styles.infoRow}>
               <Ionicons name="mail-outline" size={20} color="#6B7280" />
               <Text style={styles.infoText}>Email: {userData?.email || user?.email || '-'}</Text>
             </View>
          </View>
        </View>

        {/* Seção de Segurança */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança</Text>
          
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleEsqueciSenha}
              disabled={esqueciSenhaMutation.isPending}
            >
              <Ionicons name="mail-outline" size={24} color={primary} />
              <Text style={styles.menuText}>Esqueci minha senha</Text>
              {esqueciSenhaMutation.isPending ? (
                <ActivityIndicator size="small" color={primary} />
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
             <TouchableOpacity 
               style={[styles.dangerButton, { borderColor: '#F59E0B' }]}
               onPress={handleDesativarConta}
               disabled={desativarContaMutation.isPending}
             >
               {desativarContaMutation.isPending ? (
                 <ActivityIndicator size="small" color="#F59E0B" />
               ) : (
                 <Ionicons name="pause-circle-outline" size={24} color="#F59E0B" />
               )}
               <Text style={[styles.dangerText, { color: '#F59E0B' }]}>Desativar Conta</Text>
             </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.dangerButton, { borderColor: '#EF4444' }]}
              onPress={handleLogout}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              )}
              <Text style={[styles.dangerText, { color: '#EF4444' }]}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Alertas Customizados */}
      <CustomAlert
        visible={logoutAlert}
        onClose={() => setLogoutAlert(false)}
        title="Sair da Conta"
        message="Tem certeza que deseja sair da sua conta?"
        type="warning"
        showCancel={true}
        confirmText="Sair"
        cancelText="Cancelar"
        onConfirm={confirmLogout}
        icon="log-out-outline"
      />

      <CustomAlert
        visible={desativarAlert}
        onClose={() => setDesativarAlert(false)}
        title="Desativar Conta"
        message="Tem certeza que deseja desativar sua conta? Esta ação pode ser revertida entrando em contato com o suporte."
        type="warning"
        showCancel={true}
        confirmText="Desativar"
        cancelText="Cancelar"
        onConfirm={confirmDesativarConta}
        icon="pause-circle-outline"
      />

      <CustomAlert
        visible={esqueciSenhaAlert}
        onClose={() => setEsqueciSenhaAlert(false)}
        title="Esqueci minha senha"
        message={`Deseja enviar um email de recuperação para ${userData?.email}?`}
        type="info"
        showCancel={true}
        confirmText="Enviar"
        cancelText="Cancelar"
        onConfirm={confirmEsqueciSenha}
        icon="mail-outline"
      />

      <CustomAlert
        visible={sobreAppAlert}
        onClose={() => setSobreAppAlert(false)}
        title="Sobre o App"
        message="Ouvidoria Móvel v1.0\n\nAplicativo oficial para manifestações e reclamações.\n\nDesenvolvido para facilitar o acesso aos serviços públicos."
        type="info"
        confirmText="OK"
        icon="information-circle-outline"
      />

      <CustomAlert
        visible={privacidadeAlert}
        onClose={() => setPrivacidadeAlert(false)}
        title="Privacidade"
        message="Seus dados são protegidos e utilizados apenas para processar suas manifestações. Não compartilhamos informações pessoais com terceiros."
        type="info"
        confirmText="OK"
        icon="shield-checkmark-outline"
      />

      <CustomAlert
        visible={termosAlert}
        onClose={() => setTermosAlert(false)}
        title="Termos de Uso"
        message="Ao usar este aplicativo, você concorda em:\n\n• Fornecer informações verdadeiras\n• Respeitar os demais usuários\n• Usar o app apenas para fins legítimos"
        type="info"
        confirmText="OK"
        icon="document-text-outline"
      />
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editForm: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    // borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#111827',
    marginLeft: 16,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchText: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#111827',
    marginLeft: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  dangerText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
  },
});
