import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ElogiarScreen() {
  const insets = useSafeAreaInsets();
  const primary = Colors.light.primary;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.iconContainer, { backgroundColor: '#10B981' }]}>
            <Ionicons name="heart" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>Enviar Elogio</Text>
          <Text style={styles.headerSubtitle}>
            Reconheça o bom trabalho de nossos colaboradores e serviços
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Assunto do elogio</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Atendimento excelente, serviço rápido..."
              placeholderTextColor="#9CA3AF"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição detalhada</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Conte-nos sobre sua experiência positiva, quem te atendeu e o que mais te impressionou..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
            />
          </View>

          <TouchableOpacity style={[styles.submitButton, { backgroundColor: primary }]}>
            <Text style={styles.submitButtonText}>Enviar Elogio</Text>
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
  },
  backButton: {
    padding: 8,
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFFFFF',
  },
});
