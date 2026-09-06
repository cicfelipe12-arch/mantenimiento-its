import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';

import { getColors } from '../theme/colors';

export const EditEquipmentModal = ({ visible, equipment, saving, onClose, onSave }) => {
  const colors = getColors(useColorScheme());
  const [form, setForm] = useState({
    name: '',
    category: '',
    location: '',
    status: '',
  });

  useEffect(() => {
    if (equipment) {
      setForm({
        name: equipment.name,
        category: equipment.category,
        location: equipment.location,
        status: equipment.status,
      });
    }
  }, [equipment]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Editar equipo
          </Text>

          {['name', 'category', 'location', 'status'].map((field) => (
            <TextInput
              key={field}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder={
                field === 'name'
                  ? 'Nombre del equipo'
                  : field === 'category'
                    ? 'Categoría'
                    : field === 'location'
                      ? 'Ubicación'
                      : 'Estado'
              }
              placeholderTextColor={colors.muted}
              value={form[field]}
              onChangeText={(value) => updateField(field, value)}
              accessibilityLabel={`Editar ${field}`}
            />
          ))}

          {saving ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <View style={styles.actions}>
              <Button title="Cancelar" onPress={onClose} />
              <Button
                title="Guardar cambios"
                onPress={() => onSave(form)}
                color={colors.primary}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    padding: 24,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  title: {
    marginBottom: 16,
    fontSize: 22,
    fontWeight: '700',
  },
  input: {
    height: 48,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
