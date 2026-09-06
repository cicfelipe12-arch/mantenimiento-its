import { StyleSheet, Text, View, useColorScheme } from 'react-native';

import { getColors } from '../theme/colors';

export const AboutScreen = () => {
  const colors = getColors(useColorScheme());

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Acerca de</Text>

      <Text style={[styles.text, { color: colors.muted }]}>
        Aplicación educativa para el mantenimiento de equipos ITS.
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
    textAlign: 'center',
  },
});