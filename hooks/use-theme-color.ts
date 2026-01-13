/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppSelector } from '@/store/hooks';
import { selectSettings } from '@/store/slices/settingsSlice';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const deviceTheme = useColorScheme() ?? 'light';
  const { theme: reduxTheme } = useAppSelector(selectSettings);
  
  // Usa Redux theme se disponibile, altrimenti usa device theme
  const theme = (reduxTheme || deviceTheme) as 'light' | 'dark';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
