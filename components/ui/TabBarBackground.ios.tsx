import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurTint, BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function BlurTabBarBackground({ tint }: { tint: BlurTint }) {
  return (
    <BlurView
      tint={tint || 'systemChromeMaterial'}
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
