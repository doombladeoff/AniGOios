import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { DimensionValue, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    radius?: number;
    style?: StyleProp<ViewStyle>;
    baseColor?: string;
    highlightColor?: string;
    shimmerWidth?: number;
    duration?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = 100,
    height = 20,
    radius = 8,
    style,
    baseColor = "#2a2a2a",
    highlightColor = "rgba(255,255,255,0.25)",
    shimmerWidth = 100,
    duration = 1200,
}) => {
    const translateX = useSharedValue(-shimmerWidth);

    useEffect(() => {
        translateX.value = withRepeat(
            withTiming(shimmerWidth * 3, { duration }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View
            style={[
                {
                    width,
                    height,
                    borderRadius: radius,
                    backgroundColor: baseColor,
                    overflow: "hidden",
                },
                style,
            ]}
        >
            <Animated.View
                style={[
                    StyleSheet.absoluteFillObject,
                    { width: shimmerWidth, height: "100%" },
                    animatedStyle,
                ]}
            >
                <LinearGradient
                    colors={["transparent", highlightColor, "transparent"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1 }}
                />
            </Animated.View>
        </View>
    );
};
