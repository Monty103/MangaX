import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useDownloads } from '@/downloads/useDownloads';
import { formatBytes, DownloadEntry } from '@/downloads/types';
import { CoverImage } from '@/components/ui/CoverImage';
import { Icon } from '@/components/ui/Icon';
import { SwitchRow } from '@/components/reader/SettingsControls';

// Ported from reader-frames.jsx `DownloadsMobile` — storage meter, rules,
// the active queue, and the saved-offline list. State is real: it comes
// from the on-device index (SQLite + files), not a mock array.
export default function DownloadsScreen() {
  const { theme } = useMangaTheme();
  const { isDesktop } = useBreakpoint();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { active, saved, usage, rules, ready, isSupported, remove, updateRules } = useDownloads();

  const pct = Math.min(100, (usage / rules.budgetBytes) * 100);

  const Row = ({ entry, showProgress }: { entry: DownloadEntry; showProgress: boolean }) => (
    <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
      <CoverImage title={entry.seriesTitle} label="" style={{ width: 42, height: 60 }} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: theme.colors.text }}>
          {entry.seriesTitle}
        </Text>
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, color: theme.colors.text3, marginTop: 5 }}>
          Ch. {entry.chapterNumber} · {formatBytes(entry.bytes)}
        </Text>
        {showProgress ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 9 }}>
            <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: theme.colors.surface3, overflow: 'hidden' }}>
              <View
                style={{
                  height: '100%',
                  width: `${Math.round(entry.progress * 100)}%`,
                  backgroundColor: entry.state === 'downloading' ? theme.accent : theme.colors.text4,
                }}
              />
            </View>
            <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, color: entry.state === 'error' ? '#ff6b81' : entry.state === 'downloading' ? theme.accent : theme.colors.text4 }}>
              {entry.state === 'downloading' ? `${Math.round(entry.progress * 100)}%` : entry.state.toUpperCase()}
            </Text>
          </View>
        ) : (
          <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, color: theme.colors.text4, marginTop: 6, letterSpacing: 0.4 }}>
            {entry.pageCount} PAGES · KEPT
          </Text>
        )}
        {entry.error ? (
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 10.5, color: '#ff6b81', marginTop: 5 }}>{entry.error}</Text>
        ) : null}
      </View>
      <Pressable onPress={() => remove(entry.id)} hitSlop={8} style={[styles.rowBtn, { backgroundColor: theme.colors.surface2 }]}>
        <Icon name="x" size={13} color={theme.colors.text3} />
      </Pressable>
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ paddingBottom: 40, maxWidth: isDesktop ? 720 : undefined, width: '100%', alignSelf: 'center' }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.topBar, { paddingTop: insets.top + 12, borderBottomColor: theme.colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Icon name="chevronL" size={22} color={theme.colors.text} />
        </Pressable>
        <Text style={{ flex: 1, fontFamily: theme.displayFont, fontWeight: '700', fontSize: 18, color: theme.colors.text }}>Downloads</Text>
      </View>

      {!isSupported && (
        <View style={[styles.notice, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Icon name="info" size={15} color={theme.colors.text3} />
          <Text style={{ flex: 1, fontFamily: theme.bodyFont, fontSize: 12.5, lineHeight: 18, color: theme.colors.text2 }}>
            Offline downloads need a device filesystem, so they run in the iOS and Android apps. On the web your reading
            position and library still sync — only saved chapters are unavailable.
          </Text>
        </View>
      )}

      {/* Storage meter */}
      <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <Text style={{ fontFamily: theme.displayFont, fontWeight: '600', fontSize: 13, color: theme.colors.text }}>
            {formatBytes(usage)} of {formatBytes(rules.budgetBytes)}
          </Text>
          <Text style={{ fontFamily: theme.bodyFont, fontSize: 11.5, fontWeight: '600', color: theme.accent }}>
            {saved.length} saved
          </Text>
        </View>
        <View style={{ height: 7, borderRadius: 4, backgroundColor: theme.colors.surface3, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${pct}%`, backgroundColor: theme.accent }} />
        </View>
      </View>

      {/* Rules */}
      <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
        <SwitchRow
          label="Download on Wi-Fi only"
          sub="Pauses the queue on cellular"
          on={rules.wifiOnly}
          onToggle={(wifiOnly) => updateRules({ wifiOnly })}
          disabled={!isSupported}
        />
        <SwitchRow
          label="Auto-download new chapters"
          sub="For series in your Reading shelf"
          on={rules.autoDownload}
          onToggle={(autoDownload) => updateRules({ autoDownload })}
          disabled={!isSupported}
        />
      </View>

      {/* Active queue */}
      <View style={styles.headingRow}>
        <Text style={[styles.heading, { color: theme.colors.text3, fontFamily: theme.displayFont }]}>IN PROGRESS</Text>
      </View>
      {active.length === 0 ? (
        <Text style={[styles.empty, { color: theme.colors.text4, fontFamily: theme.bodyFont }]}>
          {ready ? 'Nothing downloading right now.' : 'Loading…'}
        </Text>
      ) : (
        active.map((e) => <Row key={e.id} entry={e} showProgress />)
      )}

      {/* Saved offline */}
      <View style={styles.headingRow}>
        <Text style={[styles.heading, { color: theme.colors.text3, fontFamily: theme.displayFont }]}>SAVED OFFLINE</Text>
      </View>
      {saved.length === 0 ? (
        <Text style={[styles.empty, { color: theme.colors.text4, fontFamily: theme.bodyFont }]}>
          No chapters saved yet. Tap the download icon on any chapter to keep it offline.
        </Text>
      ) : (
        saved.map((e) => <Row key={e.id} entry={e} showProgress={false} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  notice: { flexDirection: 'row', gap: 10, margin: 16, padding: 14, borderRadius: 10, borderWidth: 1 },
  section: { paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1 },
  headingRow: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 6 },
  heading: { fontSize: 11, fontWeight: '600', letterSpacing: 1.1 },
  empty: { paddingHorizontal: 16, paddingVertical: 10, fontSize: 12.5, lineHeight: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  rowBtn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
