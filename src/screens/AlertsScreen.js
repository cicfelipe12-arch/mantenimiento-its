import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { equipmentRepository } from '../database/equipmentRepository';
import { getColors } from '../theme/colors';

export const AlertsScreen = () => {
  const colors = getColors(useColorScheme());
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await equipmentRepository.getAll();
      setAlerts(
        rows.filter(
          (item) =>
            item.status.toLowerCase() === 'en falla' ||
            item.sync_status !== 'synced'
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAlerts();
    }, [loadAlerts])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Alertas</Text>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={alerts.length === 0 ? styles.empty : null}
          ListEmptyComponent={
            <Text style={[styles.text, { color: colors.muted }]}>
              No hay alertas activas.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text style={{ color: colors.text }}>
                {item.status.toLowerCase() === 'en falla'
                  ? 'Equipo en falla'
                  : 'Pendiente de sincronizar'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
  },
  cardTitle: {
    marginBottom: 6,
    fontSize: 18,
    fontWeight: '700',
  },
  empty: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#64748B',
    textAlign: 'center',
  },
});