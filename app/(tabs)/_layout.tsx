import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/auth-context';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  // Proteção de rota: redireciona para login se não estiver autenticado (apenas uma vez)
  useEffect(() => {
    if (isLoading) return;
    
    if (!isLoggedIn && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace('/');
    } else if (isLoggedIn) {
      // Reseta a flag quando o usuário estiver logado
      hasRedirected.current = false;
    }
  }, [isLoggedIn, isLoading]);

  // Bloqueia o botão voltar do Android quando estiver nas tabs
  useEffect(() => {
    if (!isLoggedIn || isLoading) return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Retorna true para bloquear a ação padrão (voltar)
      return true;
    });

    return () => backHandler.remove();
  }, [isLoggedIn, isLoading]);

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      </View>
    );
  }

  // Se não está logado, não renderiza as tabs (vai redirecionar)
  if (!isLoggedIn) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        // headerShown: useClientOnlyValue(false, true),
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
