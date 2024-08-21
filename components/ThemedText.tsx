import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'primaryButton' | 'secondaryButton' | 'tertiaryButton';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'primaryButton' ? styles.primaryButton : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  // Text
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'jreg'
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'jreg',
    fontWeight: '600',
  },
  title: {
    fontSize: 35,
    fontFamily: 'jbold',
    lineHeight: 32,
    color: Colors.primary
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'jreg'
  },

  // Buttons
  primaryButton: {
    color: Colors.dark.text,
    fontSize: 26,
    fontFamily: 'jbold',
  },
  tertiaryButton: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
