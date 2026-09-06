import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import { useFocusEffect } from '@react-navigation/native';
import { equipmentRepository } from '../database/equipmentRepository';
import { equipmentService } from '../services/equipmentService';
import { getColors } from '../theme/colors';

export const HomeScreen = ({ navigation }) => {
  const scheme = useColorScheme();
  const { width } = useWindowDimensions();
  const colors = getColors(scheme);
  const compact = width < 360;
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEquipment = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await equipmentRepository.getAll();
      setEquipment(rows);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los equipos locales.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const syncPending = useCallback(async () => {
    const connection = await NetInfo.fetch();

    if (!connection.isConnected) {
      return;
    }

    const pending = await equipmentRepository.getPending();

    for (const item of pending) {
      try {
        await equipmentRepository.updateSyncStatus(item.id, 'syncing');
        const remoteEquipment =
          item.sync_operation === 'update' && item.remote_id
            ? await equipmentService.update(item.remote_id, item)
            : await equipmentService.create(item);
        await equipmentRepository.markSynced(item.id, remoteEquipment.id);
      } catch (error) {
        if (error.message === 'API_404') {
          await equipmentRepository.markSynced(item.id, item.remote_id || item.id);
        } else {
          await equipmentRepository.updateSyncStatus(item.id, 'pending');
          console.warn(`No se pudo sincronizar el equipo ${item.id}:`, error);
        }
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const refresh = async () => {
        await syncPending();
        if (isActive) {
          await loadEquipment();
        }
      };

      refresh();
      const unsubscribe = NetInfo.addEventListener((state) => {
        if (state.isConnected) {
          refresh();
        }
      });

      return () => {
        isActive = false;
        unsubscribe();
      };
    }, [loadEquipment, syncPending])
  );

  const confirmRemove = (item) => {
    Alert.alert(
      'Eliminar equipo',
      `¿Desea eliminar "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await equipmentRepository.remove(item.id);
              await loadEquipment();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el equipo.');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() =>
        navigation.navigate('EquipmentDetail', { equipmentId: item.id })
      }
      onLongPress={() => confirmRemove(item)}
      accessibilityRole="button"
      accessibilityLabel={`Abrir ${item.name}`}
    >
      <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
      <Text style={{ color: colors.text }}>Categoria: {item.category}</Text>
      <Text style={{ color: colors.text }}>Ubicacion: {item.location}</Text>
      <Text style={[styles.status, { color: colors.text }]}>{item.status}</Text>
      <Text style={[styles.syncStatus, { color: colors.muted }]}>
        {item.sync_status === 'synced' ? 'Sincronizado' : 'Pendiente de sincronizar'}
      </Text>
      <Text style={[styles.help, { color: colors.muted }]}>Toque para ver detalle. Mantenga pulsado para eliminar.</Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: compact ? 20 : 22 }]}>Equipos registrados</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#173B63" />
      ) : (
        <FlatList
          data={equipment}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={loadEquipment}
          ListEmptyComponent={
            <Text style={[styles.text, { color: colors.muted }]}>Todavia no hay equipos registrados.</Text>
          }
          contentContainerStyle={equipment.length === 0 ? styles.empty : null}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1F5F9',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#173B63',
  },
  text: {
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
  },
  empty: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  cardTitle: {
    marginBottom: 6,
    fontSize: 18,
    fontWeight: '700',
    color: '#173B63',
  },
  status: {
    marginTop: 6,
    fontWeight: '700',
  },
  help: {
    marginTop: 8,
    fontSize: 12,
    color: '#64748B',
  },
  syncStatus: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 12,
  },
});