import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Image, Text, View, useColorScheme } from 'react-native';

import { TabNavigator } from './TabNavigator';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { useAuth } from '../context/AuthContext';
import { getColors } from '../theme/colors';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { logout } = useAuth();
  const colors = getColors(useColorScheme());

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={{ backgroundColor: colors.surface, flexGrow: 1 }}
    >
      <View style={{ padding: 24, backgroundColor: colors.primary }}>
        <Image
          source={require('../../its.jpg')}
          style={{ width: '100%', height: 100, marginBottom: 14, borderRadius: 10 }}
          resizeMode="cover"
          accessibilityLabel="Imagen de Sistemas ITS"
        />
        <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700' }}>
          Mantenimiento ITS
        </Text>

        <Text style={{ color: '#FFFFFF', marginTop: 6 }}>
          Equipos electromecánicos
        </Text>
      </View>

      <DrawerItemList
        {...props}
        state={props.state}
      />

      <DrawerItem
        label="Cerrar sesión"
        onPress={handleLogout}
        labelStyle={{ color: colors.text }}
        inactiveTintColor={colors.text}
      />
    </DrawerContentScrollView>
  );
};

export const DrawerNavigator = () => {
  const colors = getColors(useColorScheme());

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: colors.surface },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        sceneStyle: { backgroundColor: colors.background },
      }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ title: 'Panel principal' }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Configuración' }}
      />

      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'Acerca de' }}
      />
    </Drawer.Navigator>
  );
};