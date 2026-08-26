import {
  useFonts as useSpaceGrotesk,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import {
  useFonts as useInter,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  useFonts as useFraunces,
  Fraunces_400Regular,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Fraunces_800ExtraBold,
} from '@expo-google-fonts/fraunces';
import {
  useFonts as useJetBrainsMono,
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
} from '@expo-google-fonts/jetbrains-mono';

// Mirrors the Google Fonts <link> in MangaX.html (Space Grotesk, Inter,
// Fraunces, JetBrains Mono) so all three font-pairing tweaks are available
// without a network fetch on native.
export function useMangaFonts() {
  const [a] = useSpaceGrotesk({ SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold });
  const [b] = useInter({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  const [c] = useFraunces({ Fraunces_400Regular, Fraunces_600SemiBold, Fraunces_700Bold, Fraunces_800ExtraBold });
  const [d] = useJetBrainsMono({ JetBrainsMono_400Regular, JetBrainsMono_500Medium, JetBrainsMono_600SemiBold });
  return a && b && c && d;
}
