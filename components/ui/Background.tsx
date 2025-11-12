import { useTheme } from "@/hooks/ThemeContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { Platform, StyleSheet, View } from "react-native";

interface BackgroundProps {
    top?: number
}

const Background = ({ top }: BackgroundProps) => {
    const isDarkMode = useTheme().theme === 'dark';
    const headerHeight = useHeaderHeight();

    if (Platform.Version < '26.0') {
        return (
            <View
                style={[StyleSheet.absoluteFillObject, {
                    backgroundColor: isDarkMode ? "rgb(20,20,20)" : 'rgb(247,248,247)',
                    flex: 1,
                    zIndex: 0,
                    top: top ? top : headerHeight,
                }]}
            />
        );
    }

    return null
};

export default Background;