import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

import { useMangaTheme } from '@/theme/ThemeProvider';
import { Icon } from '@/components/ui/Icon';

// Ported from account-frames.jsx `Field` — the prototype rendered a static
// div; this is a real controlled input with a password reveal toggle.
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  type = 'text',
  hint,
  forgot,
  onForgot,
  autoFocus,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  hint?: string | null;
  forgot?: boolean;
  onForgot?: () => void;
  autoFocus?: boolean;
  editable?: boolean;
}) {
  const { theme } = useMangaTheme();
  const [reveal, setReveal] = useState(false);
  const isPassword = type === 'password';

  return (
    <View style={{ marginBottom: 14 }}>
      <View style={styles.labelRow}>
        <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 12, letterSpacing: 0.4, color: theme.colors.text2 }}>
          {label}
        </Text>
        {forgot && (
          <Pressable onPress={onForgot}>
            <Text style={{ fontFamily: theme.bodyFont, fontSize: 11.5, fontWeight: '500', color: theme.accent }}>Forgot password?</Text>
          </Pressable>
        )}
      </View>
      <View style={[styles.inputWrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text4}
          autoFocus={autoFocus}
          editable={editable}
          secureTextEntry={isPassword && !reveal}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={type === 'email' ? 'email-address' : 'default'}
          textContentType={type === 'email' ? 'emailAddress' : isPassword ? 'password' : 'none'}
          style={[styles.input, { fontFamily: theme.bodyFont, color: theme.colors.text }]}
        />
        {isPassword && value.length > 0 && (
          <Pressable onPress={() => setReveal((r) => !r)} hitSlop={10}>
            <Icon name="eye" size={14} color={reveal ? theme.accent : theme.colors.text3} />
          </Pressable>
        )}
      </View>
      {hint ? (
        <Text style={{ fontFamily: theme.bodyFont, fontSize: 11.5, color: theme.colors.text3, marginTop: 6 }}>{hint}</Text>
      ) : null}
    </View>
  );
}

// Ported from account-frames.jsx `SSOBtn`. Providers must be enabled in the
// Supabase dashboard before these do anything, so they surface a clear
// message rather than failing silently.
export function SSOBtn({
  label,
  glyph,
  onPress,
  disabled,
}: {
  label: string;
  glyph: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const { theme } = useMangaTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.sso, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, opacity: disabled ? 0.6 : 1 }]}
    >
      <Text style={{ fontFamily: theme.displayFont, fontWeight: '700', fontSize: 15, color: theme.colors.text, width: 18, textAlign: 'center' }}>
        {glyph}
      </Text>
      <Text style={{ fontFamily: theme.displayFont, fontWeight: '500', fontSize: 13, color: theme.colors.text }}>{label}</Text>
    </Pressable>
  );
}

export function Checkbox({ checked, onToggle, children }: { checked: boolean; onToggle: () => void; children: React.ReactNode }) {
  const { theme } = useMangaTheme();
  return (
    <Pressable onPress={onToggle} style={styles.checkRow}>
      <View
        style={[
          styles.checkBox,
          { borderColor: checked ? theme.accent : theme.colors.borderStrong, backgroundColor: checked ? theme.accent : 'transparent' },
        ]}
      >
        {checked && <Icon name="check" size={11} strokeWidth={2.4} color="#fff" />}
      </View>
      <Text style={{ flex: 1, fontFamily: theme.bodyFont, fontSize: 12.5, lineHeight: 18, fontWeight: '500', color: theme.colors.text2 }}>
        {children}
      </Text>
    </Pressable>
  );
}

export function Divider({ label }: { label: string }) {
  const { theme } = useMangaTheme();
  return (
    <View style={styles.divider}>
      <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
      <Text style={{ fontFamily: theme.bodyFont, fontSize: 11, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase', color: theme.colors.text4 }}>
        {label}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
    </View>
  );
}

export function Banner({ kind, children }: { kind: 'error' | 'info'; children: React.ReactNode }) {
  const { theme } = useMangaTheme();
  const isError = kind === 'error';
  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: isError ? 'rgba(255,46,77,0.10)' : theme.accentSoft,
          borderColor: isError ? '#ff2e4d' : theme.accent,
        },
      ]}
    >
      <Icon name={isError ? 'info' : 'check'} size={14} color={isError ? '#ff6b81' : theme.accent} />
      <Text style={{ flex: 1, fontFamily: theme.bodyFont, fontSize: 12.5, lineHeight: 18, color: theme.colors.text2 }}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  inputWrap: { height: 44, paddingHorizontal: 14, borderRadius: 9, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, fontSize: 14, height: '100%' },
  sso: { flex: 1, height: 42, borderRadius: 9, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginTop: 6 },
  checkBox: { width: 16, height: 16, marginTop: 1, borderRadius: 4, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8, marginBottom: 22 },
  banner: { flexDirection: 'row', gap: 9, padding: 12, borderRadius: 9, borderWidth: 1, marginBottom: 16 },
});
