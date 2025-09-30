import { Text } from '@/components/Themed';
import Waves from '@/components/Waves';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Etapa = {
  id: number;
  titulo: string;
  subtitulo: string;
  campos: string[];
};

const ETAPAS: Etapa[] = [
  { id: 1, titulo: 'Dados Pessoais', subtitulo: 'Conte um pouco sobre você', campos: ['nome', 'cpf'] },
  { id: 2, titulo: 'Contato', subtitulo: 'Como falamos com você?', campos: ['email', 'telefone'] },
  { id: 3, titulo: 'Endereço', subtitulo: 'Onde você mora?', campos: ['endereco', 'bairro'] },
  { id: 4, titulo: 'Segurança', subtitulo: 'Crie sua senha', campos: ['senha', 'confirmarSenha'] },
];

export default function CadastroScreen() {
  const insets = useSafeAreaInsets();
  const primary = Colors.light.primary;
  const gray = Colors.light.gray;

  const [etapaAtual, setEtapaAtual] = useState<number>(1);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    bairro: '',
    senha: '',
    confirmarSenha: '',
    cpf: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const etapa = useMemo(() => ETAPAS.find(e => e.id === etapaAtual)!, [etapaAtual]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const apenasDigitos = (v: string) => v.replace(/\D/g, '');
  const handleCpfChange = (value: string) => {
    const digits = apenasDigitos(value).slice(0, 11);
    let out = digits;
    if (digits.length > 3 && digits.length <= 6) out = `${digits.slice(0,3)}.${digits.slice(3)}`;
    else if (digits.length > 6 && digits.length <= 9) out = `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6)}`;
    else if (digits.length > 9) out = `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9,11)}`;
    handleChange('cpf', out);
  };
  const handlePhoneChange = (value: string) => {
    const digits = apenasDigitos(value).slice(0, 11);
    if (!digits) return handleChange('telefone', '');
    if (digits.length <= 2) return handleChange('telefone', `(${digits}`);
    if (digits.length <= 6) return handleChange('telefone', `(${digits.slice(0,2)}) ${digits.slice(2)}`);
    if (digits.length <= 10) return handleChange('telefone', `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`);
    return handleChange('telefone', `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`);
  };

  const validarEtapa = (): boolean => {
    for (const campo of etapa.campos) {
      if (campo === 'nome' && !form.nome.trim()) return false;
      if (campo === 'cpf') {
        const num = apenasDigitos(form.cpf);
        if (num.length !== 11) return false;
      }
      if (campo === 'email' && !form.email.trim()) return false;
      if (campo === 'telefone') {
        const d = apenasDigitos(form.telefone);
        if (!(d.length === 10 || d.length === 11)) return false;
      }
      if (campo === 'endereco' && !form.endereco.trim()) return false;
      if (campo === 'bairro' && !form.bairro.trim()) return false;
      if (campo === 'senha' && form.senha.trim().length < 6) return false;
      if (campo === 'confirmarSenha' && form.senha !== form.confirmarSenha) return false;
    }
    return true;
  };

  const onContinuar = () => {
    if (!validarEtapa()) return;
    if (etapaAtual < ETAPAS.length) setEtapaAtual(e => e + 1);
    else onSubmit();
  };

  const onVoltar = () => {
    if (etapaAtual > 1) setEtapaAtual(e => e - 1);
  };

  const onSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1200);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.wavesTop} pointerEvents="none">
        <View style={styles.wavesFlipped}>
          <Waves height={220} />
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 140 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Etapa {etapaAtual} de {ETAPAS.length}</Text>

          <View style={styles.progressBar}>
            {ETAPAS.map(e => (
              <View key={e.id} style={[styles.progressStep, etapaAtual >= e.id && styles.progressStepActive]} />
            ))}
          </View>

          <Text style={styles.sectionTitle}>{etapa.titulo}</Text>
          <Text style={styles.sectionSubtitle}>{etapa.subtitulo}</Text>

          <View style={styles.form}>
            {etapa.campos.includes('nome') && (
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.nome}
                  onChangeText={v => handleChange('nome', v)}
                  placeholder="Nome completo"
                  placeholderTextColor={gray}
                  autoCapitalize="words"
                />
              </View>
            )}

            {etapa.campos.includes('cpf') && (
              <View style={styles.inputWrapper}>
                <Ionicons name="card-outline" size={20} color={gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.cpf}
                  onChangeText={handleCpfChange}
                  placeholder="000.000.000-00"
                  placeholderTextColor={gray}
                  keyboardType="numeric"
                  maxLength={14}
                />
              </View>
            )}

            {etapa.campos.includes('email') && (
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.email}
                  onChangeText={v => handleChange('email', v)}
                  placeholder="Seu email"
                  placeholderTextColor={gray}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            )}

            {etapa.campos.includes('telefone') && (
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color={gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.telefone}
                  onChangeText={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor={gray}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>
            )}

            {etapa.campos.includes('endereco') && (
              <View style={styles.inputWrapper}>
                <Ionicons name="location-outline" size={20} color={gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.endereco}
                  onChangeText={v => handleChange('endereco', v)}
                  placeholder="Rua, número"
                  placeholderTextColor={gray}
                  autoCapitalize="words"
                />
              </View>
            )}

            {etapa.campos.includes('bairro') && (
              <View style={styles.inputWrapper}>
                <Ionicons name="home-outline" size={20} color={gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.bairro}
                  onChangeText={v => handleChange('bairro', v)}
                  placeholder="Bairro"
                  placeholderTextColor={gray}
                  autoCapitalize="words"
                />
              </View>
            )}

            {etapa.campos.includes('senha') && (
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.senha}
                  onChangeText={v => handleChange('senha', v)}
                  placeholder="Senha"
                  placeholderTextColor={gray}
                  autoCapitalize="none"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(s => !s)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={gray} />
                </TouchableOpacity>
              </View>
            )}

            {etapa.campos.includes('confirmarSenha') && (
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.confirmarSenha}
                  onChangeText={v => handleChange('confirmarSenha', v)}
                  placeholder="Confirmar senha"
                  placeholderTextColor={gray}
                  autoCapitalize="none"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(s => !s)} style={styles.eyeIcon}>
                  <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={gray} />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.buttonsRow}>
              {etapaAtual > 1 && (
                <TouchableOpacity style={styles.backBtn} onPress={onVoltar}>
                  <Ionicons name="arrow-back" size={18} color={primary} />
                  <Text style={styles.backBtnText}>Voltar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.nextBtn, isSubmitting && styles.nextBtnDisabled]} onPress={onContinuar} disabled={isSubmitting}>
                {isSubmitting ? (
                  <View style={styles.nextBtnContent}>
                    <ActivityIndicator size="small" color="#FFF" />
                    <Text style={styles.nextBtnText}>{etapaAtual === ETAPAS.length ? 'Criando...' : 'Continuar'}</Text>
                  </View>
                ) : (
                  <View style={styles.nextBtnContent}>
                    <Text style={styles.nextBtnText}>{etapaAtual === ETAPAS.length ? 'Criar conta' : 'Continuar'}</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomImageWrap} pointerEvents="none">
        {Platform.OS !== 'web' ? (
          <Image source={require('../assets/images/megafone.png')} style={styles.bottomIllustration} resizeMode="contain" />
        ) : (
          <Image source={require('../assets/images/splash-icon.png')} style={styles.bottomIllustration} resizeMode="contain" />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  wavesTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  wavesFlipped: {
    transform: [{ rotate: '180deg' }],
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  content: {
    gap: 12,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Outfit_700Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'center',
    marginTop: 4,
  },
  progressStep: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },
  progressStepActive: {
    backgroundColor: Colors.light.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  form: {
    marginTop: 8,
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginRight: 10,
    color: '#9CA3AF',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#111827',
  },
  eyeIcon: {
    padding: 6,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  backBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  backBtnText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.light.primary,
  },
  nextBtn: {
    flex: 2,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnDisabled: {
    backgroundColor: '#e5e7eb',
  },
  nextBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextBtnText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#ffffff',
  },
  bottomImageWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  bottomIllustration: {
    width: 360,
    height: 230,
    opacity: 0.95,
  },
});


