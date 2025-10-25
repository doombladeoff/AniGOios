import { Image } from "expo-image";
import { Link } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Easing, SharedValue, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

const smoothConfig = {
    duration: 800,
    easing: Easing.inOut(Easing.ease),
};

interface CardProps {
    index: number;
    activeIndex: SharedValue<number>;
    translateX: SharedValue<number>;
    onSwiped: () => void;
    anim: any;
    N: number;
    useFlip?: boolean;
};

export const Card = ({
    index,
    activeIndex,
    translateX,
    onSwiped,
    anim,
    N,
    useFlip
}: CardProps) => {
    const backGradient = easeGradient({
        colorStops: {
            0: { color: 'rgba(0,0,0,1)' },
            0.5: { color: 'rgba(0,0,0,1)' },
            1: { color: 'rgba(0,0,0,1)' }
        }
    });

    const isSwiping = useSharedValue(false);

    const gesture = Gesture.Pan()
        .onStart((e) => {
            isSwiping.value = true;
        })
        .onUpdate((e) => {
            if (activeIndex.value % N === index) {
                translateX.value = e.translationX;
            }
        })
        .onEnd(() => {
            if (activeIndex.value % N === index && translateX.value < -SWIPE_THRESHOLD) {
                translateX.value = withTiming(-width, { duration: 250 }, () => {
                    scheduleOnRN(onSwiped);
                    translateX.value = 0;
                    isSwiping.value = false;
                });
            } else {
                translateX.value = withSpring(0, {}, () => {
                    isSwiping.value = false;
                });
            }
        });


    const wiggleX = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        const pos = (index - activeIndex.value + N) % N;

        let shiftX = 0;
        let shiftY = 0;
        let rotate = "0deg";
        let scale = 1;
        let opacity = 1;

        switch (pos) {
            case 0:
                shiftX = withSpring(translateX.value + wiggleX.value, { stiffness: 1750 });
                rotate = withTiming("0deg", smoothConfig);
                scale = withTiming(1.2, smoothConfig);
                shiftY = withTiming(20, smoothConfig);
                break;
            case 1:
                shiftX = withTiming(-60, smoothConfig);
                rotate = withTiming("-10deg", smoothConfig);
                scale = withTiming(0.95, smoothConfig);
                shiftY = withTiming(20, smoothConfig);
                break;
            case 2:
                shiftX = withTiming(60, smoothConfig);
                rotate = withTiming("10deg", smoothConfig);
                scale = withTiming(0.9, smoothConfig);
                shiftY = withTiming(40, smoothConfig);
                break;
            case 3:
                shiftX = withTiming(60, smoothConfig);
                rotate = withTiming("10deg", smoothConfig);
                scale = withTiming(0.85, smoothConfig);
                shiftY = withTiming(40, smoothConfig);
                opacity = 0.7;
                break;
        }
        return {
            transform: [
                { translateX: shiftX },
                { translateY: shiftY },
                { rotateZ: rotate },
                { scale },
            ],
            opacity,
            zIndex: pos === 0 ? 4 : pos === 1 ? 3 : pos === 2 ? 2 : 1,
        };
    });


    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[animatedStyle, styles.box]}>
                <Link href={{ pathname: '/(screens)/anime/[id]', params: { id: anim.remote_ids.shikimori_id } }}>
                    <View style={styles.fullSize}>
                        <Animated.View style={[styles.fullSize, styles.card]}>
                            <Image
                                source={{ uri: `https:${anim.poster.huge}` }}
                                style={styles.img}
                                transition={600}
                            />
                        </Animated.View>
                    </View>
                </Link>
            </Animated.View>
        </GestureDetector>
    );
};


const styles = StyleSheet.create({
    box: {
        height: 280,
        width: 190,
        borderRadius: 20,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    fullSize: {
        width: '100%',
        height: '100%',
    },
    card: {
        position: 'absolute',
        backfaceVisibility: 'hidden',
        borderRadius: 20,
        overflow: 'hidden'
    },
    back: {
        backgroundColor: '#1a1a1a',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
    },
    contentContainer: {
        width: '100%',
        alignItems: 'center',
        top: 30,
        zIndex: 3,
    },
    titleText: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        paddingHorizontal: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 10,
    },
    ratingText: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
    watchButton: {
        backgroundColor: '#4a90e2',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 'auto',
        marginBottom: 20,
        zIndex: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    img: {
        height: 280,
        width: 190,
        borderRadius: 20,
        position: 'absolute',
        backgroundColor: 'gray',
        overflow: 'hidden'
    },
});