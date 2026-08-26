import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { MangaThemeProvider, useMangaTheme } from '@/theme/ThemeProvider';
import { useMangaFonts } from '@/theme/useMangaFonts';
import { AuthProvider } from '@/auth/AuthProvider';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
  const { theme } = useMangaTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="series/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="reader/[chapterId]" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        <Stack.Screen name="downloads" options={{ presentation: 'card' }} />
        <Stack.Screen name="premium" options={{ presentation: 'modal' }} />
        <Stack.Screen name="auth/sign-in" options={{ presentation: 'modal' }} />
        <Stack.Screen name="auth/sign-up" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const fontsReady = useMangaFonts();

  const onLayout = useCallback(async () => {
    if (fontsReady) await SplashScreen.hideAsync();
  }, [fontsReady]);

  useEffect(() => {
    onLayout();
  }, [onLayout]);

  if (!fontsReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <MangaThemeProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </MangaThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
