import MaskedView from "@react-native-masked-view/masked-view";
import { BlurTint, BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ColorValue, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface GradientBlurProps {
    containerStyle: StyleProp<ViewStyle>;
    colors: string[];
    locations: number[];
    tint?: BlurTint;
    blurIntensity?: number;
}

export const GradientBlur = ({ containerStyle,
    colors, locations,
    tint, blurIntensity }: GradientBlurProps) => {
    // const { colors, locations } = easeGradient({
    //     colorStops: {
    //         0: { color: 'black' },
    //         0.5: { color: 'rgba(0,0,0,0.9)' },
    //         1: { color: 'transparent' }
    //     },
    // });
    return (
        <View style={containerStyle} pointerEvents="none">
            <MaskedView
                maskElement={
                    <LinearGradient
                        locations={locations as [number, number, ...number[]]}
                        colors={colors as [ColorValue, ColorValue, ...ColorValue[]]}
                        style={StyleSheet.absoluteFill}
                    />
                }
                style={[StyleSheet.absoluteFill]}>
                <BlurView intensity={blurIntensity || 100}
                    tint={tint || 'dark'}
                    style={[StyleSheet.absoluteFill]} />
            </MaskedView>
        </View>
    )
}