import { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

export const useScrollOpacity = (scrollHeight: number) => {
    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollY.value,
                [0, scrollHeight],
                [0, 1],
                Extrapolation.CLAMP
            ),
        };
    });

    return {
        animatedStyle,
        scrollHandler
    }
}