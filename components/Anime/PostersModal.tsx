import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text
} from 'react-native';
import { Gesture, GestureDetector, Pressable } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import Poster from '../PosterCard';
import { IconSymbol } from '../ui/IconSymbol';

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');
const ITEM_WIDTH = ScreenWidth - 60;
const GAP = 20;

export function PostersModal({ visible, onClose, popstersArr, }) {
    const [curIndex, setCurIndex] = useState(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(1.2);

    // const translateX = useSharedValue(0);
    // const translateY2 = useSharedValue(0);

    // const measureAndAnimate = () => {
    //     posRef.current.measure((x, y, width, height, pageX, pageY) => {
    //         // Запоминаем начальную позицию
    //         translateX.value = pageX;
    //         translateY2.value = pageY;

    //         // Делаем анимацию в центр экрана
    //         translateX.value = withTiming(100, { duration: 500 });
    //         translateY2.value = withTiming(200, { duration: 500 });

    //     });
    // };

    useEffect(() => {
        if (visible) {
            translateY.value = 0; // при повторном открытии — сброс вниз
            scale.value = 1.2
            // opacity.value = 0
        }
        // measureAndAnimate();
    }, [visible]);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
        scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) });
    }, [visible]);


    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            if (e.translationY > 0) {
                translateY.value = e.translationY;
            }
        })
        .onEnd(() => {
            if (translateY.value > 220) {
                translateY.value = withTiming(ScreenHeight, {}, () => {
                    runOnJS(onClose)();
                });
            } else {
                translateY.value = withSpring(0, { damping: 50 });
            }
        });



    // const animatedStyle1 = useAnimatedStyle(() => ({
    //     transform: [
    //         { translateX: translateX.value },
    //         { translateY: translateY.value },
    //     ],
    // }));
    const animatedImageStye = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    const handleMomentumScrollEnd = (e) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / (ITEM_WIDTH + GAP));
        setCurIndex(index);
    };

    const scrollX = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    if (!visible) return null;

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[StyleSheet.absoluteFillObject, animatedStyle, {
                borderTopLeftRadius: 15, borderTopRightRadius: 15,
                zIndex: 100, height: Dimensions.get('screen').height * 1.15,
                overflow: 'hidden',
            }]}>
                <BlurView
                    intensity={30}
                    tint="systemChromeMaterialDark"
                    style={[
                        StyleSheet.absoluteFillObject,
                        {
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    ]}
                >
                    <Pressable onPress={() => { onClose(false) }} style={{ position: 'absolute', zIndex: 99999, top: 95, right: 35, alignSelf: 'flex-end' }}>
                        <IconSymbol name='xmark' size={24} color={'white'} />
                    </Pressable>
                    <Animated.FlatList
                        horizontal
                        data={popstersArr}
                        pagingEnabled
                        decelerationRate="fast"
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => index.toString()}
                        snapToAlignment="start"
                        snapToInterval={ITEM_WIDTH}
                        onMomentumScrollEnd={handleMomentumScrollEnd}
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                            gap: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            bottom: 30
                        }}
                        renderItem={({ item, index }) => {
                            return (<Animated.View style={[animatedImageStye]}>
                                <Poster index={index} item={item} scrollX={scrollX} />
                            </Animated.View>)
                        }}
                    />
                    <Text
                        style={{
                            bottom: 160,
                            color: 'white',
                            fontSize: 16,
                            fontWeight: '600',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            padding: 10,
                            borderRadius: 8,
                            paddingHorizontal: 15,
                        }}
                    >
                        {curIndex + 1} / {popstersArr.length}
                    </Text>
                </BlurView>
            </Animated.View>
        </GestureDetector>
    );
}
