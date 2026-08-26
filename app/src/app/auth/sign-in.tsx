import { Stack } from 'expo-router';

import { AuthScreen } from '@/components/auth/AuthScreen';

export default function SignInScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AuthScreen mode="signin" />
    </>
  );
}
