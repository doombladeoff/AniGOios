import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedView } from "@/components/ui/ThemedView";
import { useUserStore } from "@/store/userStore";
import React, { useEffect } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { AnimatedMeshGradient } from "expo-ios-mesh-gradient";

const { width, height } = Dimensions.get("window");

export const NoLogIn = () => {
    const setSkipAuth = useUserStore(s => s.setSkipAuth);

    const ballsData = Array.from({ length: 6 }).map((_, i) => ({
        x: useSharedValue(Math.random() * width),
        y: useSharedValue(Math.random() * height),
        size: Math.random() * 80 + 40,
        index: i,
    }));

    useEffect(() => {
        ballsData.forEach(ball => {
            ball.x.value = withRepeat(withTiming(Math.random() * width, { duration: 8000 + ball.index * 700 }), -1, true);
            ball.y.value = withRepeat(withTiming(Math.random() * height, { duration: 9000 + ball.index * 500 }), -1, true);
        });
    }, []);

    const balls = ballsData.map((ball, i) => {
        const style = useAnimatedStyle(() => ({
            position: "absolute",
            left: ball.x.value,
            top: ball.y.value,
            width: ball.size,
            height: ball.size,
            borderRadius: ball.size / 2,
            backgroundColor: "rgba(255, 185, 128, 0.15)",
            transform: [{ translateX: -ball.size / 2 }, { translateY: -ball.size / 2 }],
        }));

        return <Animated.View key={i} style={style} />;
    });

    return (

        <ThemedView
            darkColor="black"
            lightColor="white"
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >        <AuraBackground />
            {balls}

            <View style={{
                alignItems: "center",
                gap: 10,
                paddingVertical: 60,
                paddingHorizontal: 20,
            }}>
                <ThemedText lightColor="#2C2C2C" darkColor="white"
                    style={{
                        fontSize: 24,
                        fontWeight: "700",
                        textAlign: "center",
                    }}
                >
                    Добро пожаловать в профиль!
                </ThemedText>
                <Text
                    style={{
                        fontSize: 16,
                        color: "#555",
                        textAlign: "center",
                        opacity: 0.8,
                    }}
                >
                    Войдите в аккаунт, чтобы видеть избранное, друзей и многое другое 💫
                </Text>
            </View>

            <Pressable
                onPress={() => setSkipAuth(false)}
                style={({ pressed }) => [
                    {
                        marginTop: 40,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#FFB980",
                        borderRadius: 24,
                        paddingVertical: 14,
                        paddingHorizontal: 32,
                        shadowColor: "#FFB980",
                        shadowOpacity: 0.35,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: 2 },
                    },
                ]}
            >
                <IconSymbol name="person.fill" size={22} color="white" />
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "white",
                        marginLeft: 8,
                    }}
                >
                    Войти
                </Text>
            </Pressable>
        </ThemedView>

    );
};

function AuraBackground() {
    const isDarkMode = useTheme().theme === 'dark';
    const lightColors = [
        "#FFE8D6",
        "#FFD0B0",
        "#FFB295",
        "#1B1A1F",
    ];
    const darkColors = [
        "#1E1B18",
        "#2A1F1B",
        "#FF9557",
        "#3B2A25",
    ];

    const color = isDarkMode ? darkColors : lightColors;
    return (
        <AnimatedMeshGradient
            columns={3}
            rows={3}
            colors={color}
            smoothsColors
            animated
            animationSpeed={0.005}
            style={{ position: 'absolute', zIndex: 0, width: '100%', height: '100%' }}
            ignoresSafeArea
            noiseAmplitude={0.3}
            frequencyModulation={0.6}
            points={[
                [0.0, 0.0],
                [0.5, 0.0],
                [1.0, 0.0],
                [0.0, 0.5],
                [0.5, 0.5],
                [1.0, 0.5],
                [0.0, 1.0],
                [0.5, 1.0],
                [1.0, 1.0],
            ]}
        />
    );
};