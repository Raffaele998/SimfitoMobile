import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { restoreToken, selectAuth } from '@/store/slices/authSlice';
import { restoreTheme, selectSettings } from '@/store/slices/settingsSlice';
import { store } from '@/store/store';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { token } = useAppSelector(selectAuth);
  const { theme } = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    Promise.all([
      dispatch(restoreToken()),
      dispatch(restoreTheme()),
    ]).then(() => {
      setIsReady(true);
    });
  }, [dispatch]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  // Usa il tema da Redux (se salvato), altrimenti usa il tema del sistema
  const effectiveTheme = theme || colorScheme || 'light';

  return (
    <ThemeProvider value={effectiveTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack 
        screenOptions={{
          initialRouteName: token ? '(tabs)' : 'login'
        }}
      >
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            animationEnabled: false 
          }} 
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="nuova-scheda" 
          options={{ 
            headerShown: false,
            animationEnabled: true 
          }} 
        />
        <Stack.Screen 
          name="schede/[id]" 
          options={{ 
            headerShown: false,
            animationEnabled: true 
          }} 
        />
        <Stack.Screen 
          name="siti/[id]" 
          options={{ 
            headerShown: false,
            animationEnabled: true 
          }} 
        />
        <Stack.Screen name="schede/osservazioni" options={{ presentation: 'modal', title: 'Osservazioni' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
