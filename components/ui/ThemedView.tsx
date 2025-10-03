import { useTheme } from "@/hooks/ThemeContext";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedView({
    style,
    lightColor,
    darkColor,
    ...otherProps
}: ThemedViewProps) {
    const { theme } = useTheme();

    const backgroundColor =
        theme === "light"
            ? lightColor ?? undefined
            : theme === "dark"
                ? darkColor ?? undefined
                : undefined;

    return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
