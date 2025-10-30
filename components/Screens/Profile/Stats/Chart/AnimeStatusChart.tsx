import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { db } from "@/lib/firebase";
import { LiquidGlassView as GlassView, isLiquidGlassSupported } from "@callstack/liquid-glass";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ColorValue, Pressable, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { BarItem } from "./BarItem";

const statuses = [
    { key: "completed", color: ["#43e97b", "#38f9d7"] as [ColorValue, ColorValue, ...ColorValue[]], label: "Завершено" },
    { key: "watching", color: ["#36d1dc", "#5b86e5"] as [ColorValue, ColorValue, ...ColorValue[]], label: "Смотрю" },
    { key: "planned", color: ["#f7971e", "#ffd200"] as [ColorValue, ColorValue, ...ColorValue[]], label: "Запланировано" },
    { key: "dropped", color: ["#ff5858", "#f09819"] as [ColorValue, ColorValue, ...ColorValue[]], label: "Брошено" },
    { key: "on_hold", color: ["#a770ef", "#cf8bf3"] as [ColorValue, ColorValue, ...ColorValue[]], label: "Отложено" },
];

export const AnimeStatusChart = ({ userID }: { userID: string }) => {
    const isDark = useTheme().theme === "dark";
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [total, setTotal] = useState(0);
    const [expanded, setExpanded] = useState(false);

    const appear = useSharedValue(0);

    const fetchCounts = async () => {
        const collRef = collection(db, `user-favorites/${userID}/favorites`);
        const results = await Promise.all(
            statuses.map(async (s) => {
                const q = query(collRef, where("status", "==", s.key));
                const snap = await getCountFromServer(q);
                return { key: s.key, count: snap.data().count };
            })
        );

        const countsMap = results.reduce((acc, r) => {
            acc[r.key] = r.count;
            return acc;
        }, {} as Record<string, number>);

        const totalCount = Object.values(countsMap).reduce((a, b) => a + b, 0);
        setCounts(countsMap);
        setTotal(totalCount);

        appear.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.exp) });
    };

    useEffect(() => {
        if (userID) fetchCounts();
    }, [userID]);

    const containerStyle = useAnimatedStyle(() => ({
        opacity: appear.value,
        transform: [{ translateY: interpolate(appear.value, [0, 1], [20, 0]) }],
    }));

    const expandedStyle = useAnimatedStyle(() => ({
        opacity: withTiming(expanded ? 1 : 0, { duration: 400 }),
        height: withTiming(expanded ? 230 : 0, { duration: 400 }),
    }));

    const totalProgress = total ? statuses.map((s) => (counts[s.key] ?? 0) / total) : [];

    return (
        <Animated.View style={[containerStyle]}>
            <GlassView
                interactive
                colorScheme={isDark ? "dark" : "light"}
                effect="clear"
                style={[
                    styles.container,
                    !isLiquidGlassSupported && {
                        backgroundColor: isDark ? "#1c1c1e" : "#f0f0f3",
                    },
                ]}
            >
                <Pressable onPress={() => setExpanded(!expanded)} style={styles.header}>
                    <ThemedText style={styles.title}>Статистика аниме</ThemedText>
                    <Animated.View
                        style={{
                            transform: [{ rotate: expanded ? "180deg" : "0deg" }],
                        }}
                    >
                        <IconSymbol name="chevron.down" size={22} color={isDark ? "#fff" : "#000"} />
                    </Animated.View>
                </Pressable>

                <Animated.View style={[expandedStyle, { overflow: "hidden" }]}>
                    <View style={{ marginTop: 10 }}>
                        <ThemedText
                            style={{
                                fontSize: 28,
                                fontWeight: "700",
                                color: isDark ? "#fff" : "#000",
                            }}
                        >
                            {total}
                        </ThemedText>
                        <ThemedText
                            style={{
                                color: isDark ? "#aaa" : "#555",
                                fontSize: 14,
                                marginBottom: 20,
                            }}
                        >
                            Всего тайтлов
                        </ThemedText>

                        {statuses.map((s, i) => (
                            <BarItem
                                key={s.key}
                                label={s.label}
                                count={counts[s.key] ?? 0}
                                color={s.color}
                                progress={totalProgress[i] ?? 0}
                                delay={i * 250}
                                expanded={expanded}
                                isDark={isDark}
                            />
                        ))}
                    </View>
                </Animated.View>
            </GlassView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        shadowOpacity: 0.3,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
    },
});
