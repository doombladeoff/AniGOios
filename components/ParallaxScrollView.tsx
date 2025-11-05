import { forwardRef, type PropsWithChildren, type ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    AnimatedScrollViewProps,
    Extrapolation,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollOffset
} from 'react-native-reanimated';

type Props = PropsWithChildren<{
    HEADER_HEIGHT?: number,
    headerImage: ReactElement;
    headerBackgroundColor: { dark: string; light: string };
    useScale?: boolean,
    tabBottomHeight?: number,
} & AnimatedScrollViewProps>;


const ParallaxScrollView = forwardRef<Animated.ScrollView, Props>(
    (
        {
            children,
            headerImage,
            headerBackgroundColor,
            tabBottomHeight,
            useScale = true,
            HEADER_HEIGHT = 500,
            ...restProps
        },
        ref
    ) => {
        const innerRef = useAnimatedRef<Animated.ScrollView>();
        const scrollRef = (ref as React.RefObject<Animated.ScrollView>) || innerRef;

        const scale = useScale ? [2, 1, 1] : [1, 1, 1];
        const scrollOffset = useScrollOffset(scrollRef);
        const headerAnimatedStyle = useAnimatedStyle(() => {
            // console.log(scrollOffset.value)
            return {
                transform: [
                    {
                        translateY: interpolate(
                            scrollOffset.value,
                            [-HEADER_HEIGHT, 0, 0],
                            [-HEADER_HEIGHT, 0, HEADER_HEIGHT * 0.35],
                            Extrapolation.CLAMP
                        ),
                    },
                    {
                        scale: interpolate(scrollOffset.value,
                            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                            scale),
                    },
                ],
            };
        });

        return (
            <View style={styles.container}>
                <Animated.ScrollView
                    {...restProps}
                    ref={scrollRef}
                    scrollEventThrottle={16}
                    scrollIndicatorInsets={{ bottom: tabBottomHeight }}
                    contentContainerStyle={{ paddingBottom: tabBottomHeight ? tabBottomHeight : 20 }}>
                    <Animated.View
                        style={[
                            styles.header,
                            { height: HEADER_HEIGHT },
                            headerAnimatedStyle,
                        ]}>
                        {headerImage}
                    </Animated.View>
                    <View style={styles.content}>{children}</View>
                </Animated.ScrollView>
            </View>
        );
    })

export default ParallaxScrollView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        overflow: 'hidden',
        zIndex: 0,
    },
    content: {
        flex: 1,
        gap: 16,
        overflow: 'hidden',
        zIndex: 3,
    },
});
