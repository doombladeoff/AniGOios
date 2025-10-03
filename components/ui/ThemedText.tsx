import { useTheme } from "@/hooks/ThemeContext";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
    style,
    lightColor,
    darkColor,
    type = "default",
    ...rest
}: ThemedTextProps) {
    const { theme } = useTheme();

    const color =
        theme === "light"
            ? lightColor ?? "#000"
            : theme === "dark"
                ? darkColor ?? "#fff"
                : undefined;

    return (
        <Text
            style={[
                { color },
                // type === "default" && styles.default,
                type === "title" && styles.title,
                type === "defaultSemiBold" && styles.defaultSemiBold,
                type === "subtitle" && styles.subtitle,
                type === "link" && styles.link,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "600",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: "#0a7ea4",
    },
});
