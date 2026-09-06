import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { EquipmentDetailScreen } from '../screens/EquipmentDetailScreen';
import { DrawerNavigator } from './DrawerNavigator';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#173B63" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {userToken == null ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Iniciar sesión' }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Private"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="EquipmentDetail"
            component={EquipmentDetailScreen}
            options={{ title: 'Detalle del equipo' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});