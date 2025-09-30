import { Text } from '@/components/Themed';
import Waves from '@/components/Waves';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [emailOrCpf, setEmailOrCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const isDisabled = useMemo(() => !emailOrCpf.trim() || !password.trim() || isLoading, [emailOrCpf, password, isLoading]);

  const handleLogin = async () => {
    if (isDisabled) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  const primary = Colors.light.primary;
  const gray = Colors.light.gray;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 28 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Ouvidoria<Text style={{ color: primary, fontFamily: 'Outfit_700Bold' }}>Móvel</Text></Text>
          <Text style={styles.subtitle}>Entre para registrar relatos e acompanhar respostas da sua instituição</Text>

          <View style={styles.imageWrap}>
            {Platform.OS !== 'web' ? (
              <Image source={require('../assets/images/megafone.png')} style={styles.illustration} resizeMode="contain" />
            ) : (
              <Image source={require('../assets/images/splash-icon.png')} style={styles.illustration} resizeMode="contain" />
            )}
          </View>

          <View style={styles.form}>
            <View style={[styles.inputWrapper, { borderColor: '#E5E7EB' }]}> 
              <Ionicons name="mail-outline" size={20} color={gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={emailOrCpf}
                onChangeText={setEmailOrCpf}
                placeholder="Email ou CPF"
                placeholderTextColor={gray}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={[styles.inputWrapper, { borderColor: '#E5E7EB' }]}> 
              <Ionicons name="lock-closed-outline" size={20} color={gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Senha"
                placeholderTextColor={gray}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={gray} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity disabled={isDisabled} onPress={handleLogin} style={[styles.loginButton, isDisabled && styles.loginButtonDisabled]}> 
              {isLoading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.loginButtonText}>Entrando...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Não tem conta?</Text>
              <Link href="/cadastro" asChild>
                <TouchableOpacity>
                  <Text style={[styles.footerText, { color: primary, fontFamily: 'Outfit_600SemiBold' }]}> Cadastre-se</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.wavesWrap} pointerEvents="none">
        <Waves height={220} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    gap: 12,
  },
  title: {
    fontSize: 36,
    color: '#1F2937',
    textAlign: 'center',
    fontFamily: 'Outfit_700Bold',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Outfit_400Regular',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  illustration: {
    width: 340,
    height: 220,
    opacity: 0.95,
  },
  form: {
    marginTop: 8,
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
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
  loginButton: {
    height: 56,
    backgroundColor: '#f0574f',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6
  },
  loginButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#ffffff',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 15,
    color: '#6B7280',
    fontFamily: 'Outfit_400Regular',
  },
  wavesWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});


