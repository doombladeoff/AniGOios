import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { useUserStore } from "@/store/userStore";
import { LiquidGlassView as GlassView, isLiquidGlassSupported } from "@callstack/liquid-glass";
import React, { useEffect } from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import Animated, {
    Easing,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export const Level = () => {
    const isDarkMode = useTheme().theme === "dark";
    const userRang = useUserStore((s) => s.user)?.rang;
    const { width } = useWindowDimensions();

    if (!userRang) return null;

    const progress = useSharedValue(0);
    const target = userRang.exp / (userRang.level * 100);

    useEffect(() => {
        progress.value = withTiming(target, {
            duration: 1200,
            easing: Easing.out(Easing.cubic),
        });
    }, [target]);

    const barStyle = useAnimatedStyle(() => ({
        width: `${Math.min(progress.value * 100, 100)}%`,
        backgroundColor: interpolateColor(
            progress.value,
            [0, 0.5, 1],
            ["#f5a623", "#ffa500", "#ff8800"]
        ),
    }));

    return (
        <GlassView
            colorScheme={isDarkMode ? "dark" : "light"}
            effect="clear"
            interactive
            style={{
                borderRadius: 20,
                paddingVertical: 20,
                paddingHorizontal: 20,
                ...(!isLiquidGlassSupported && {
                    backgroundColor: isDarkMode ? "#1c1c1e" : "#f0f0f3",
                }),
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 6,
                shadowOpacity: 0.25,
            }}
        >
            <Pressable
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                onPress={null}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 18,
                            fontWeight: "600",
                            letterSpacing: 0.3,
                        }}
                    >
                        {userRang.level} уровень
                    </ThemedText>

                    <View
                        style={{
                            backgroundColor: "rgba(255,165,0,0.2)",
                            borderRadius: 16,
                            padding: 6,
                        }}
                    >
                        <IconSymbol name="trophy.fill" size={22} color={"orange"} />
                    </View>
                </View>

                <View
                    style={{
                        height: 20,
                        borderRadius: 12,
                        backgroundColor: isDarkMode
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                        marginVertical: 16,
                        width: width - 70,
                        alignSelf: "center",
                    }}
                >
                    <Animated.View
                        style={[
                            {
                                height: "100%",
                                borderRadius: 12,
                                shadowColor: "#ffa500",
                                shadowOpacity: 0.4,
                                shadowRadius: 6,
                                shadowOffset: { width: 0, height: 2 },
                            },
                            barStyle,
                        ]}
                    />
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 15,
                            color: isDarkMode ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
                        }}
                    >
                        {userRang.exp} XP
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: 15,
                            color: isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
                        }}
                    >
                        {userRang.level * 100} XP
                    </ThemedText>
                </View>
            </Pressable>
        </GlassView>
    );
};