import { useState } from 'react';
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { getColors } from '../theme/colors';

export const LoginScreen = () => {
  const colors = getColors(useColorScheme());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Atención', 'Ingrese usuario y contraseña.');
      return;
    }

    setLoading(true);

    try {
      await login(username.trim(), password);
    } catch (error) {
      Alert.alert('Error de autenticación', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../../its.jpg')}
          style={styles.logoImage}
          resizeMode="cover"
          accessibilityLabel="Imagen de Sistemas ITS"
        />
        <Text style={[styles.title, { color: colors.text }]}>Mantenimiento ITS</Text>

        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Inicio de sesión
        </Text>

        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          returnKeyType="next"
          accessibilityLabel="Usuario"
        />

        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          accessibilityLabel="Contraseña"
        />

        <Button
          title={loading ? 'Ingresando...' : 'Ingresar'}
          onPress={handleLogin}
          disabled={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F1F5F9',
    minHeight: 420,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#173B63',
    textAlign: 'center',
  },
  logoImage: {
    width: '100%',
    height: 150,
    marginBottom: 18,
    borderRadius: 14,
  },
  subtitle: {
    marginBottom: 24,
    color: '#64748B',
    textAlign: 'center',
  },
  input: {
    height: 48,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
});