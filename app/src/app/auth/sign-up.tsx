import { Stack } from 'expo-router';

import { AuthScreen } from '@/components/auth/AuthScreen';

export default function SignUpScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AuthScreen mode="signup" />
    </>
  );
}
