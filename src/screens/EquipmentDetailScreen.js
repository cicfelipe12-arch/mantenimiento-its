import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { equipmentRepository } from '../database/equipmentRepository';
import { getColors } from '../theme/colors';
import NetInfo from '@react-native-community/netinfo';
import { equipmentService } from '../services/equipmentService';
import { EditEquipmentModal } from '../components/EditEquipmentModal';

export const EquipmentDetailScreen = ({ navigation, route }) => {
  const colors = getColors(useColorScheme());
  const equipmentId = route.params?.equipmentId;
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadEquipment = useCallback(async () => {
    try {
      setLoading(true);
      const item = await equipmentRepository.getById(equipmentId);
      setEquipment(item);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el equipo.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [equipmentId]);

  useFocusEffect(
    useCallback(() => {
      loadEquipment();
    }, [loadEquipment])
  );

  const removeEquipment = async () => {
    Alert.alert('Eliminar equipo', '¿Desea eliminar este equipo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            if (equipment.remote_id) {
              await equipmentService.remove(equipment.remote_id);
            }
            await equipmentRepository.remove(equipmentId);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el equipo del servidor.');
            console.error(error);
          }
        },
      },
    ]);
  };

  const saveChanges = async (changes) => {
    if (!changes.name.trim() || !changes.category.trim() || !changes.location.trim()) {
      Alert.alert('Atención', 'Complete nombre, categoría y ubicación.');
      return;
    }

    try {
      setSaving(true);
      const updated = {
        name: changes.name.trim(),
        category: changes.category.trim(),
        location: changes.location.trim(),
        status: changes.status.trim() || 'Operativo',
      };

      await equipmentRepository.update(equipmentId, updated);
      const connection = await NetInfo.fetch();

      if (connection.isConnected && equipment.remote_id) {
        try {
          const remote = await equipmentService.update(equipment.remote_id, updated);
          await equipmentRepository.markSynced(equipmentId, remote.id);
        } catch (apiError) {
          if (apiError.message === 'API_404') {
            await equipmentRepository.markSynced(
              equipmentId,
              equipment.remote_id
            );
          } else {
            await equipmentRepository.updateSyncStatus(equipmentId, 'pending');
          }
          if (apiError.message !== 'API_404') {
            console.warn('No se pudo actualizar el equipo en la API:', apiError);
          }
        }
      } else {
        await equipmentRepository.updateSyncStatus(equipmentId, 'pending');
      }

      setModalVisible(false);
      await loadEquipment();
    } catch (error) {
      Alert.alert('Error local', 'No se pudieron guardar los cambios en el dispositivo.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loading} size="large" />;
  }

  if (!equipment) {
    return <Text style={[styles.message, { color: colors.text }]}>Equipo no encontrado.</Text>;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{equipment.name}</Text>
      <Text style={{ color: colors.text }}>Categoria: {equipment.category}</Text>
      <Text style={{ color: colors.text }}>Ubicacion: {equipment.location}</Text>
      <Text style={{ color: colors.text }}>Estado: {equipment.status}</Text>
      <Text style={[styles.date, { color: colors.muted }]}>Creado: {equipment.created_at}</Text>
      <Button title="Editar equipo" onPress={() => setModalVisible(true)} />
      <Button title="Eliminar equipo" color={colors.danger} onPress={removeEquipment} />
      <EditEquipmentModal
        visible={modalVisible}
        equipment={equipment}
        saving={saving}
        onClose={() => setModalVisible(false)}
        onSave={saveChanges}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 24,
    backgroundColor: '#F1F5F9',
  },
  title: {
    marginBottom: 8,
    fontSize: 24,
    fontWeight: '700',
    color: '#173B63',
  },
  date: {
    marginBottom: 16,
    color: '#64748B',
  },
  loading: {
    flex: 1,
  },
  message: {
    padding: 24,
  },
});