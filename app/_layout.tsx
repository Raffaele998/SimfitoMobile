import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { tokenService } from '@/services/tokenService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAuth } from '@/store/slices/authSlice';
import { restoreTheme, selectSettings } from '@/store/slices/settingsSlice';
import { store } from '@/store/store';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { token } = useAppSelector(selectAuth);
  const { theme } = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Ripristina solo il tema, il token non viene più persistito
    dispatch(restoreTheme()).then(() => {
      setIsReady(true);
    });
  }, [dispatch]);

  // Sincronizza il token da Redux a tokenService
  useEffect(() => {
    if (token) {
      // Se Redux ha il token, assicurati che sia anche nel tokenService
      const currentToken = tokenService.getToken();
      if (currentToken !== token) {
        console.log('[_layout] Sincronizzazione token da Redux a tokenService');
        tokenService.setToken(token);
      }
    } else {
      // Se Redux non ha il token, pulisci anche tokenService
      tokenService.clearToken();
    }
  }, [token]);

  // Gestisce il redirect al login quando non c'è token
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === 'login';

    if (!token && !inAuthGroup) {
      // Redirect al login se non c'è token e non si è già nella pagina di login
      router.replace('/login');
    } else if (token && inAuthGroup) {
      // Redirect alle tabs se c'è il token e si è nella pagina di login
      router.replace('/(tabs)');
    }
  }, [token, segments, isReady, router]);

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
          name="nuova-azienda" 
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
        <Stack.Screen 
          name="user-profile" 
          options={{ 
            headerShown: false,
            animationEnabled: true 
          }} 
        />
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
