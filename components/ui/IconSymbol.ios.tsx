import { useTheme } from '@/hooks/ThemeContext';
import { AnimationSpec, SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export function IconSymbol({
    name,
    size = 24,
    color,
    style,
    weight = 'regular',
    animationSpec
}: {
    name: SymbolViewProps['name'];
    size?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
    weight?: SymbolWeight;
    animationSpec?: AnimationSpec
}) {
    const [animationSpecs, setAnimationSpec] = useState<AnimationSpec | undefined>();
    const isDarkMode = useTheme().theme === 'dark';

    return (
        <Pressable
            onPressIn={() => setAnimationSpec(animationSpec)}
            onPressOut={() => setAnimationSpec(undefined)}
        >
            <SymbolView
                animationSpec={animationSpecs}
                weight={weight}
                tintColor={color ? color : isDarkMode ? 'white' : 'black'}
                resizeMode="scaleAspectFit"
                name={name}
                style={[
                    {
                        width: size,
                        height: size,
                    },
                    style,
                ]}
            />
        </Pressable>
    );
}
