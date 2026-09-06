import { StyleSheet, Text, View, useColorScheme } from 'react-native';

import { getColors } from '../theme/colors';

export const SettingsScreen = () => {
  const colors = getColors(useColorScheme());

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Configuración</Text>

      <Text style={[styles.text, { color: colors.muted }]}>
        Configuración de la aplicación.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  text: {
    color: '#64748B',
  },
});