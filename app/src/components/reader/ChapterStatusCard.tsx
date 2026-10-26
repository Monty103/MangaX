import React from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useMangaTheme } from '@/theme/ThemeProvider';
import type { ChapterPagesState } from '@/hooks/useChapterPages';

// Stands in for a chapter's pages while they can't be shown: loading, being
// prepared by the content service, unavailable, or failed. Sized to the
// viewport so the chapter seam stays below the fold, as it would after pages.
export function ChapterStatusCard({
  state,
  chapter,
  height,
  onRetry,
}: {
  state: Exclude<ChapterPagesState, { status: 'available' } | { status: 'placeholder' }>;
  chapter: number;
  height: number;
  onRetry: () => void;
}) {
  const { theme } = useMangaTheme();
  const router = useRouter();

  const title =
    state.status === 'loading'
      ? `Loading chapter ${chapter}…`
      : state.status === 'ingesting'
        ? `Preparing chapter ${chapter}…`
        : state.status === 'error'
          ? 'Couldn’t load this chapter'
          : `Chapter ${chapter} isn’t readable yet`;

  const body =
    state.status === 'ingesting'
      ? 'This chapter is being fetched for the first time. It usually takes under a minute; it will appear here on its own.'
      : state.status === 'unavailable'
        ? state.reason
        : state.status === 'error'
          ? 'Check your connection and try again.'
          : null;

  return (
    <View style={[styles.wrap, { height, backgroundColor: theme.colors.bg }]}>
      {(state.status === 'loading' || state.status === 'ingesting') && <ActivityIndicator color={theme.accent} size="large" />}
      <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 18, color: theme.colors.text, marginTop: 16, textAlign: 'center' }}>
        {title}
      </Text>
      {body && (
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 13, lineHeight: 19, color: theme.colors.text3, marginTop: 8, textAlign: 'center', maxWidth: 320 }}>
          {body}
        </Text>
      )}
      {state.status === 'unavailable' && state.requiresSignIn && (
        <Pressable onPress={() => router.push('/auth/sign-in')} style={[styles.button, { backgroundColor: theme.accent }]}>
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: '#fff' }}>Sign in</Text>
        </Pressable>
      )}
      {state.status === 'error' && (
        <Pressable onPress={onRetry} style={[styles.button, { backgroundColor: theme.colors.surface2, borderColor: theme.colors.border, borderWidth: 1 }]}>
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: theme.colors.text }}>Try again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  button: { marginTop: 18, paddingHorizontal: 18, paddingVertical: 11, borderRadius: 10 },
});
