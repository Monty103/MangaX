import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useMangaTheme } from '@/theme/ThemeProvider';

// Ported from project/shared.jsx `Stars`.
export function Stars({
  value = 4.6,
  size = 12,
  showValue = true,
  count,
}: {
  value?: number;
  size?: number;
  showValue?: boolean;
  count?: number;
}) {
  const { theme } = useMangaTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <Svg width={size + 2} height={size + 2} viewBox="0 0 14 14">
        <Path d="M7 1.2l1.7 3.7 4 .5-3 2.8.8 4L7 10.3 3.5 12.2l.8-4L1.3 5.4l4-.5z" fill={theme.accent} />
      </Svg>
      {showValue && (
        <Text style={{ fontFamily: theme.displayFont, fontSize: size, fontWeight: '600', color: theme.colors.text }}>
          {value.toFixed(1)}
        </Text>
      )}
      {count != null && (
        <Text style={{ fontFamily: theme.displayFont, fontSize: size, color: theme.colors.text3 }}>({count})</Text>
      )}
    </View>
  );
}
