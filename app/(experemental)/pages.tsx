import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { FlatList, Pressable, ScrollView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function ExperementalPages() {
    const PosterRef = useRef<any>(null);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const s = useSharedValue(1);
    const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
    const [isOpen, setIsOpen] = useState(false);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: s.value }
        ],
    }));
    useEffect(() => {
        if (PosterRef.current) {
            PosterRef.current.measure((x, y, width, height, pageX, pageY) => {
                setInitialPos({ x: 0, y: y });
                // Запоминаем начальную позицию
                translateX.value = 0;
                translateY.value = y;
            })
        }
    }, [PosterRef]);

    const measureAndAnimate = () => {
        if (!isOpen) {
            // Делаем анимацию в центр экрана
            translateY.value = withTiming(200, { duration: 500 });
            // s.value = withTiming(1.4, { duration: 500 });
        } else {
            // Закрытие (возврат в изначальную позицию)
            translateY.value = withTiming(initialPos.y, { duration: 500 });
            // s.value = withTiming(1, { duration: 500 });
        }
        setIsOpen(!isOpen)
    }

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <FlatList
                style={{ flex: 1, backgroundColor: 'green', height: '100%' }}
                horizontal
                contentContainerStyle={{
                    flex: 1,
                    paddingHorizontal: 20,
                    gap: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: 30,
                    height: '100%'
                }}
                data={[
                    `https://static.wikia.nocookie.net/kaoruhana/images/3/39/Site-community-image/revision/latest?cb=20250323060417`,
                    `https://static.wikia.nocookie.net/kaoruhana/images/3/39/Site-community-image/revision/latest?cb=20250323060417`,
                    `https://static.wikia.nocookie.net/kaoruhana/images/3/39/Site-community-image/revision/latest?cb=20250323060417`,
                ]}
                renderItem={({ item, index }) =>
                    <Pressable
                        onPress={() => { measureAndAnimate() }}
                        style={{
                         height: 340, alignItems: 'center', justifyContent: 'center', zIndex: 100,
                            backgroundColor: 'red'
                        }}
                    >
                        <Animated.View style={animatedStyle} >
                            <View ref={PosterRef}>
                                <Image source={{ uri: item }} style={{ width: 180, height: 240 }} />
                            </View>
                        </Animated.View>
                    </Pressable>

                }

            />
            {/* <Image priority={'high'} transition={500} source={{ uri:  }} style={{ width: 240, height: 340, borderRadius: 12 }} contentFit="cover" /> */}
        </ScrollView>
    );
}