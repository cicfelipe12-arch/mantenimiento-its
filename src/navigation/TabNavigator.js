import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { NewEquipmentScreen } from '../screens/NewEquipmentScreen';
import { AlertsScreen } from '../screens/AlertsScreen';
import { getColors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const colors = getColors(useColorScheme());

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface },

        tabBarIcon: ({ color, size }) => {
          let iconName = 'help-outline';

          if (route.name === 'Equipos') {
            iconName = 'construct-outline';
          }

          if (route.name === 'Nuevo') {
            iconName = 'add-circle-outline';
          }

          if (route.name === 'Alertas') {
            iconName = 'warning-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Equipos"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Nuevo"
        component={NewEquipmentScreen}
      />

      <Tab.Screen
        name="Alertas"
        component={AlertsScreen}
      />
    </Tab.Navigator>
  );
};