import { Image } from "expo-image";
import { memo } from "react";
import { Dimensions } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');
const ITEM_WIDTH = ScreenWidth - 60;
const ITEM_HEIGHT = ScreenHeight / 1.8;
const GAP = 20;
const Poster = memo(({ index, item, scrollX }) => {
    console.log(item)
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (ITEM_WIDTH + GAP) * (index - 1),
            (ITEM_WIDTH + GAP) * index,
            (ITEM_WIDTH + GAP) * (index + 1),
        ];

        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.92, 1, 0.92],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ scale }],
        };
    }, [scrollX]);

    return (
        <Animated.View style={[animatedStyle]}>
            <Image
                source={{ uri: item }}
                style={{
                    width: ITEM_WIDTH,
                    height: ITEM_HEIGHT,
                    borderRadius: 14,
                    backgroundColor: 'gray'
                }}
                priority={index === 0 ? 'high' : 'normal'}
                transition={400}
            />
        </Animated.View>
    );
})

export default Poster;
