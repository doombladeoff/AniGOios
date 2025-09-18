import { BlurTint, BlurView } from 'expo-blur';
import { Stack } from 'expo-router';
import { ReactElement, useState } from 'react';
import { SharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

interface HeaderBlurProps {
    blurValue: SharedValue<number>;
    isDark?: boolean;
    iconColor: string;
    title: string;
    malId?: string | number;
    headerLeft?: ReactElement;
    headerRight?: ReactElement;
    showTitle?: boolean;
    tint?: BlurTint;
    shown?: boolean;
}
export const HeaderBlur = ({ blurValue, title, headerLeft, headerRight, showTitle = true, tint = 'systemChromeMaterial', shown = true }: HeaderBlurProps) => {
    const [intensity, setIntensity] = useState(0);

    useAnimatedReaction(
        () => blurValue.value,
        (newVal) => {
            runOnJS(setIntensity)(newVal);
        }, []
    );

    return (
        <Stack.Screen
            options={{
                headerShown: shown,
                headerBlurEffect: 'none',
                headerBackground: () => (
                    <BlurView style={{ flex: 1 }} intensity={intensity} tint={tint} />
                ),
                ...(title && { headerTitle: showTitle ? title : '' }),
                ...(headerLeft && { headerLeft: () => headerLeft }),
                ...(headerRight && { headerRight: () => headerRight }
                )
            }}
        />
    );
};
