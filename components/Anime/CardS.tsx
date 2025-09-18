import { IconSymbol } from '@/components/ui/IconSymbol';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const CARD_HEIGHT = 80;
const VISIBLE_CARDS = 3;
const OFFSET = 10;

const AnimatedView = Animated.createAnimatedComponent(View);

export const CardSt = ({ items }) => {
    const uniqueItems = items.filter(
        (item, index, self) =>
            index === self.findIndex((i) => i.name.native === item.name.native)
    );
    const [expanded, setExpanded] = useState(false);
    const progress = useSharedValue(0); // от 0 до 1

    const toggle = () => {
        setExpanded((prev) => !prev);
        progress.value = withTiming(expanded ? 0 : 1, { duration: 300 });
    };

    const rotation = useAnimatedStyle(() => {
        const rotate = interpolate(
            progress.value,
            [0, 1],
            [0, 90] // из 0° в 180° при раскрытии
        );
        return {
            transform: [{ rotate: `${rotate}deg` }],
        };
    });

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                <Text
                    style={{
                        color: 'white',
                        fontSize: 16,
                        fontWeight: '500',
                    }}
                >
                    Стафф
                </Text>
                <Pressable
                    onPress={toggle}
                    style={{
                        backgroundColor: 'white',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 12,
                        minWidth: 100,
                        maxWidth: 140,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6, // расстояние между текстом и иконкой
                    }}
                >
                    <Text
                        style={{
                            color: 'black',
                            fontSize: 14,
                            fontWeight: '500',
                        }}
                    >
                        {!expanded ? 'Развернуть' : 'Свернуть'}
                    </Text>

                    <AnimatedView
                        style={[
                            rotation,
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                        ]}
                    >
                        <IconSymbol
                            name="chevron.right"
                            size={14}
                            color="black"
                            style={{ top: 1 }} // лёгкая вертикальная компенсация
                        />
                    </AnimatedView>
                </Pressable>

            </View>


            <View style={{ height: expanded ? CARD_HEIGHT * uniqueItems.length + 10 : CARD_HEIGHT + OFFSET * (VISIBLE_CARDS - 1), position: 'relative' }}>
                {uniqueItems.map((item, index) => {
                    const animatedStyle = useAnimatedStyle(() => {
                        const collapsedY =
                            index < 4
                                ? index * OFFSET
                                : (4 - 1) * OFFSET;

                        const translateY = withTiming(interpolate(
                            progress.value,
                            [0, 1],
                            [collapsedY, index * CARD_HEIGHT],
                            Extrapolation.CLAMP
                        ));

                        const scale = interpolate(
                            progress.value,
                            [0, 1],
                            [1 - index * 0.03, 1],
                            Extrapolation.CLAMP
                        );

                        return {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            transform: [{ translateY }, { scale }],
                            zIndex: items.length - index,
                        };
                    });

                    return (
                        <AnimatedView
                            key={index}
                            style={[
                                animatedStyle,
                                {
                                    // backgroundColor: 'red',
                                    borderRadius: 12,
                                    padding: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    overflow: 'hidden'
                                },
                            ]}
                        >
                            <BlurView intensity={100} tint="dark" style={{ ...StyleSheet.absoluteFillObject }} />
                            <Image
                                source={{ uri: item.image.medium }}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 10,
                                    marginRight: 10,
                                }}
                                contentFit='cover'
                            />
                            <View>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.name.full}</Text>
                                {/* <Text style={{ color: 'white' }}>{item.language}</Text> */}
                            </View>
                        </AnimatedView>
                    );
                })}
            </View>
        </View>
    );
};
