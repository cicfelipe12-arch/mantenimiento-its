import 'react-native-gesture-handler';

import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar
          style={isDark ? 'light' : 'dark'}
          backgroundColor={isDark ? '#0F172A' : '#F8FAFC'}
          translucent={false}
        />
      </NavigationContainer>
    </AuthProvider>
  );
}