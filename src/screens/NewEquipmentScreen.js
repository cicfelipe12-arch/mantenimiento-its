import { useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import { equipmentRepository } from '../database/equipmentRepository';
import { equipmentService } from '../services/equipmentService';
import { getColors } from '../theme/colors';

export const NewEquipmentScreen = ({ navigation }) => {
  const scheme = useColorScheme();
  const { width } = useWindowDimensions();
  const colors = getColors(scheme);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Operativo');

  const saveEquipment = async () => {
    if (!name.trim() || !category.trim() || !location.trim()) {
      Alert.alert('Atencion', 'Complete nombre, categoria y ubicacion.');
      return;
    }

    try {
      const newEquipment = {
        name: name.trim(),
        category: category.trim(),
        location: location.trim(),
        status: status.trim() || 'Operativo',
      };

      const connection = await NetInfo.fetch();
      const savedEquipment = await equipmentRepository.create({
        ...newEquipment,
        syncStatus: connection.isConnected ? 'syncing' : 'pending',
      });

      let message =
        'Equipo guardado localmente. Sus datos ya están disponibles en el dispositivo.';

      try {
        if (!connection.isConnected) {
          throw new Error('OFFLINE');
        }

        const remoteEquipment = await equipmentService.create(newEquipment);
        await equipmentRepository.markSynced(
          savedEquipment.id,
          remoteEquipment.id
        );
        message += ` API REST respondio correctamente con el ID ${remoteEquipment.id}.`;
      } catch (apiError) {
        await equipmentRepository.updateSyncStatus(savedEquipment.id, 'pending');
        message +=
          ' La API no estuvo disponible; se reintentara automaticamente al recuperar internet.';
        console.warn('No se pudo enviar el equipo a la API:', apiError);
      }

      setName('');
      setCategory('');
      setLocation('');
      setStatus('Operativo');
      Alert.alert(
        'Equipo guardado',
        message,
        [
        { text: 'Aceptar', onPress: () => navigation.navigate('Equipos') },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error de API',
        'No se pudo crear el equipo en el servidor. Verifique su conexión e inténtelo nuevamente.'
      );
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Nuevo equipo</Text>

      <TextInput
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
        placeholder="Nombre del equipo"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
        placeholder="Categoria"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
        placeholder="Ubicacion"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
        placeholder="Estado"
        value={status}
        onChangeText={setStatus}
      />
      <View style={{ width: width < 360 ? '100%' : '80%', alignSelf: 'center' }}>
        <Button title="Guardar equipo" onPress={saveEquipment} color={colors.primary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F1F5F9',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#173B63',
  },
  input: {
    height: 48,
    marginBottom: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
});