import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { auth, db } from "@/lib/firebase";
import { LiquidGlassView as GlassView, isLiquidGlassSupported } from "@callstack/liquid-glass";
import { router } from "expo-router";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SFSymbols6_0 } from "sf-symbols-typescript";

const { width } = Dimensions.get("screen");
const ITEM_WIDTH = width / 3 - 14;

async function getCount(uid: string, status?: string) {
    const collRef = collection(db, `user-favorites/${uid}/favorites`);
    const q = status ? query(collRef, where("status", "==", status)) : collRef;
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
}

export const Stats = ({ userID, friends = 0 }: { userID: string; friends?: number }) => {
    const isDark = useTheme().theme === 'dark';
    const [animeCount, setAnimeCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);

    useEffect(() => {
        if (!userID) return;
        (async () => {
            const [animCount, complCount] = await Promise.all([
                getCount(userID),
                getCount(userID, "completed"),
            ]);
            setAnimeCount(animCount);
            setCompletedCount(complCount);
        })();
    }, [userID]);

    if (!userID) return null;

    return (
        <View style={styles.container}>
            <AnimatedCard
                index={0}
                isDark={isDark}
                value={animeCount}
                label="В избранном"
                symbol="play.circle.fill"
                tint={isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.65)"}
            />

            <AnimatedCard
                index={1}
                isDark={isDark}
                value={completedCount}
                label="Завершено"
                symbol="checkmark.circle.fill"
                tint={isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.65)"}
            />

            <Pressable disabled={userID != auth.currentUser?.uid} onPress={() => router.push({ pathname: "/(screens)/user/friends" })}>
                <AnimatedCard
                    index={2}
                    isDark={isDark}
                    value={friends}
                    label="Друзей"
                    symbol="person.2.fill"
                    tint={isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.65)"}
                />
            </Pressable>
        </View>
    );
};

const AnimatedNumber = ({ value }: { value: number }) => {
    const animated = useSharedValue(0);

    useEffect(() => {
        animated.value = withTiming(value, { duration: 800 });
    }, [value]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: withTiming(1),
        transform: [{ scale: withTiming(1) }],
    }));


    return (
        <Animated.View style={animatedStyle}>
            <ThemedText style={{ fontSize: 14, fontWeight: '600' }}>
                {value}
            </ThemedText>
        </Animated.View>

    );
};

const AnimatedCard = ({
    index,
    value,
    label,
    symbol,
    tint,
    isDark,
}: {
    index: number;
    value: number;
    label: string;
    symbol: SFSymbols6_0;
    tint: string;
    isDark: boolean;
}) => {
    return (
        <Animated.View
            entering={FadeInUp.delay(index * 100).springify()}
        >
            <GlassView
                effect="clear"
                colorScheme={isDark ? "dark" : "light"}
                // tintColor={tint}
                style={[
                    styles.item,
                    !isLiquidGlassSupported && { backgroundColor: isDark ? "#1c1c1e" : "#f0f0f3" },
                ]}
            >
                <IconSymbol
                    name={symbol}
                    size={22}
                    color={isDark ? "#fff" : "#111"}
                />
                <AnimatedNumber value={value} />
                <ThemedText
                    style={{
                        fontSize: 14,
                        fontWeight: "500",
                        opacity: 0.75,
                        color: isDark ? "#ddd" : "#333",
                    }}
                >
                    {label}
                </ThemedText>
            </GlassView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    item: {
        width: ITEM_WIDTH,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        shadowOpacity: 0.25,
        gap: 4
    },
});
