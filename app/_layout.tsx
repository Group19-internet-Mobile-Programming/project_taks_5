import React from 'react';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NotificationsProvider from '@/context/NotificationsContext';
import DiagnosticsProvider from '@/context/DiagnosticsContext';

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <DiagnosticsProvider>
      <NotificationsProvider>
        <SafeAreaProvider>
          <ThemeProvider>
            <AuthProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(mechanic)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
              </Stack>
              <StatusBar style="light" />
            </AuthProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </NotificationsProvider>
    </DiagnosticsProvider>
  );
}