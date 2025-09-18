import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HEIGHT = 256;
const WIDTH = SCREEN_WIDTH * 0.9;

const CARD_HEIGHT = HEIGHT - 5;
const CARD_WIDTH = WIDTH - 5;

export const Card = ({ children }: { children: React.ReactNode }) => {
    const rotateX = useSharedValue(0);
    const rotateY = useSharedValue(0);

    const shineTranslateX = useSharedValue(0);
    const shineTranslateY = useSharedValue(0);
    const shineOpacity = useSharedValue(0);

    const gesture = Gesture.Pan()
        .onBegin((event) => {
            rotateX.value = withTiming(
                interpolate(event.y, [0, CARD_HEIGHT], [5, -5], Extrapolation.CLAMP)
            );
            rotateY.value = withTiming(
                interpolate(event.x, [0, CARD_WIDTH], [-5, 5], Extrapolation.CLAMP)
            );
            shineOpacity.value = withTiming(0.35, { duration: 150 });
        })
        .onUpdate((event) => {
            rotateX.value = interpolate(
                event.y,
                [0, CARD_HEIGHT],
                [5, -5],
                Extrapolation.CLAMP
            );
            rotateY.value = interpolate(
                event.x,
                [0, CARD_WIDTH],
                [-5, 5],
                Extrapolation.CLAMP
            );

            shineTranslateX.value = interpolate(
                event.x,
                [0, CARD_WIDTH],
                [5, -5],
                Extrapolation.CLAMP
            );

            shineTranslateY.value = interpolate(
                event.y,
                [0, CARD_HEIGHT],
                [-5, 5],
                Extrapolation.CLAMP
            );
        })
        .onFinalize(() => {
            rotateX.value = withSpring(0);
            rotateY.value = withSpring(0);
            shineOpacity.value = withTiming(0, { duration: 200 });
        });

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { perspective: 400 },
                { rotateX: `${rotateX.value}deg` },
                { rotateY: `${rotateY.value}deg` },
            ],
        };
    });

    const shineStyle = useAnimatedStyle(() => {
        return {
            opacity: shineOpacity.value,
            transform: [
                { translateX: shineTranslateX.value },
                { translateY: shineTranslateY.value },
            ],
        };
    });

    return (
        <View style={styles.container}>
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[
                        {
                            // height: CARD_HEIGHT,
                            // width: CARD_WIDTH,
                            position: "absolute",
                            borderRadius: 20,
                            zIndex: 300,
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden", // важно для блика
                            // backgroundColor: "#222", // фон по умолчанию
                        },
                        rStyle,
                    ]}
                >
                    {/* Shine / Glare effect */}
                    <Animated.View
                        style={[
                            {
                                position: "absolute",
                                width: 260,
                                height: 360,
                                borderRadius: 20,
                                zIndex: 400,
                            },
                            shineStyle,
                        ]}
                        pointerEvents="none"
                    >
                        <LinearGradient
                            colors={["rgba(255,255,255,0.75)", "transparent"]} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ flex: 1, borderRadius: 20 }}
                        />
                    </Animated.View>

                    {/* Content inside the card */}
                    {children}
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
});
