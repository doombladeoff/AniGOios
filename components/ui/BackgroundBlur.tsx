import { useTheme } from "@/hooks/ThemeContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { BlurTint, BlurView } from "expo-blur";
import { Platform, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface BackgroundBlurProps {
    tint?: BlurTint;
    intensity?: number;
    style?: StyleProp<ViewStyle>;
}

const BackgroundBlur = ({ tint, intensity, style }: BackgroundBlurProps) => {
    const isDarkMode = useTheme().theme === 'dark';
    const headerHeight = useHeaderHeight();

    if (Platform.Version < '26.0') {
        return (
            <BlurView
                tint={tint ? tint : isDarkMode ? 'dark' : 'systemChromeMaterialLight'}
                intensity={intensity ? intensity : 100}
                style={style ? style :
                    [StyleSheet.absoluteFillObject, {
                        flex: 1,
                        zIndex: 0,
                        top: headerHeight,
                    }]}
            />
        );
    }

    return null
};

export default BackgroundBlur;