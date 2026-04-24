import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="add" 
          options={{ 
            title: 'Novo Quadrinho',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="edit/[id]" 
          options={{ 
            title: 'Editar Quadrinho',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="detail/[id]" 
          options={{ 
            title: 'Detalhes',
            headerShown: true,
          }} 
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
