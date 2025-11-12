import { useTheme } from "@/hooks/ThemeContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface BackgroundProps {
    style?: StyleProp<ViewStyle>;
}

const Background = ({ style }: BackgroundProps) => {
    const isDarkMode = useTheme().theme === 'dark';
    const headerHeight = useHeaderHeight();

    if (Platform.Version < '26.0') {
        return (
            <View
                style={style ? style :
                    [StyleSheet.absoluteFillObject, {
                        backgroundColor: isDarkMode ? "rgb(20,20,20)" : 'rgb(247,248,247)',
                        flex: 1,
                        zIndex: 0,
                        top: headerHeight,
                    }]}
            />
        );
    }

    return null
};

export default Background;