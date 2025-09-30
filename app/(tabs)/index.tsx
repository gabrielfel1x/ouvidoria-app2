import { Text } from '@/components/Themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomePlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text>Conteúdo das tabs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
  },
});
