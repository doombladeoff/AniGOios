import { ThemedText } from "@/components/ui/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { ColorValue, StyleSheet, View } from "react-native";
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";

interface BarItemProps {
    label: string;
    count: number;
    color: [ColorValue, ColorValue, ...ColorValue[]];
    progress: number;
    delay: number;
    expanded: boolean;
    isDark: boolean;
}

export const BarItem = ({ label, count, color, progress, delay, expanded, isDark }: BarItemProps) => {
    const width = useSharedValue(0);
    const shine = useSharedValue(0);

    useEffect(() => {
        if (expanded) {
            width.value = withDelay(delay, withTiming(progress, { duration: 800, easing: Easing.out(Easing.exp) }));
            shine.value = withDelay(
                delay + 400,
                withRepeat(withTiming(1, { duration: 1200, easing: Easing.ease }), 1, true)
            );
        } else {
            width.value = withTiming(0, { duration: 300 });
            shine.value = 0;
        }
    }, [expanded]);

    const barStyle = useAnimatedStyle(() => ({
        width: `${width.value * 100}%`,
    }));

    const shineStyle = useAnimatedStyle(() => ({
        opacity: interpolate(shine.value, [0, 0.5, 1], [0, 0.6, 0]),
    }));

    return (
        <View style={styles.row}>
            <ThemedText darkColor="#fff" lightColor="#000" style={styles.label}>{label}</ThemedText>
            <View style={[styles.barContainer, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", }]}>
                <Animated.View style={[barStyle, { flex: 1 }]}>
                    <LinearGradient colors={color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.bar} />
                    <Animated.View style={[styles.shineOverlay, shineStyle]} />
                </Animated.View>
            </View>

            <ThemedText style={[styles.count, { color: isDark ? "#fff" : "#000" }]}>{count ?? 0}</ThemedText>
        </View>
    );
};


const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 10,
    },
    label: {
        width: 115,
        fontSize: 15,
    },
    barContainer: {
        flex: 1,
        height: 14,
        borderRadius: 10,
        overflow: "hidden",
    },
    bar: {
        height: "100%",
        borderRadius: 10,
    },
    count: {
        width: 35,
        textAlign: "right",
        fontWeight: "600",
    },
    shineOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#ffffffaa",
        borderRadius: 10,
    },
});
