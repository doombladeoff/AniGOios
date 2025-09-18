import { Card } from '@/components/HomeRecommendations/Card';
import { storage } from '@/utils/storage';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimationSpec } from 'expo-symbols';
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
    FadeIn,
    FadeOut,
    useAnimatedReaction,
    useSharedValue
} from "react-native-reanimated";
import { runOnJS } from 'react-native-worklets';
import { IconSymbol } from '../ui/IconSymbol.ios';
import { Pagination } from './Pagination';

const { width, height } = Dimensions.get('screen');
const anim = {
    effect: { type: 'bounce', direction: 'up' },
    repeating: true,
    speed: 10

} as AnimationSpec;

export default function Recommendations({ data }: { data: any[] }) {
    const show = storage.getShowHomeRecs() ?? true;
    const activeIndex = useSharedValue(0);
    const translateX = useSharedValue(0);

    const anime = data ?? [];
    const [currentIndex, setCurrentIndex] = useState(0);

    useAnimatedReaction(
        () => activeIndex.value,
        (val) => {
            runOnJS(setCurrentIndex)(val);
        },
        [anime.length]
    );

    const handleSwiped = (i?: number) => {
        if (i) {
            activeIndex.value = i % anime.length;
        } else
            activeIndex.value = (activeIndex.value + 1) % anime.length;
    };

    if (!anime || anime.length < 1) return null;
    if (!show) return null;
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 15 }}>
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 18, }}>Посмотри сегодня</Text>
                <IconSymbol name='flame.fill' size={28} color='orange' animationSpec={anim} />
            </View>
            <View style={{ alignItems: "center", marginTop: 25, minHeight: 340, zIndex: 4 }}>
                {anime.map((anim, i) => (
                    <Card
                        key={i}
                        index={i}
                        activeIndex={activeIndex}
                        translateX={translateX}
                        onSwiped={handleSwiped}
                        anim={anim}
                        N={anime.length}
                        useFlip={false}
                    />
                ))}
            </View>
            <Pagination activeIndex={activeIndex} length={anime.length} />
            <Animated.View entering={FadeIn} key={currentIndex} exiting={FadeOut} style={infoStyles.infoContainer}>
                <Text style={infoStyles.titleText}>{anime[currentIndex].title}</Text>
                <View style={infoStyles.metaContainer}>
                    <Text style={infoStyles.metaText}>{anime[currentIndex].year}</Text>

                    <Text style={infoStyles.separator}>•</Text>
                    <Text style={infoStyles.metaText}>{anime[currentIndex].type.name}</Text>
                </View>
            </Animated.View>
            <View style={{
                zIndex: -1,
                width: width, height: height / 2,
                position: 'absolute'
            }}>
                <BlurView style={[StyleSheet.absoluteFill, {
                    zIndex: 2,
                    width: width, height: height / 2
                }]}
                    tint='dark'
                    intensity={70}
                />
                <LinearGradient colors={['black', 'transparent', 'black']}
                    style={[{
                        zIndex: 3,
                        width: width, height: height / 2,
                    }, StyleSheet.absoluteFill]}
                />
                <Image source={{ uri: `https:${anime[currentIndex].poster.small}` }} style={{ width: width, height: height / 2, position: 'absolute' }}
                    transition={600}
                />
            </View>
        </View>
    );
}

// Добавляем новые стили для информационного блока
const infoStyles = StyleSheet.create({
    infoContainer: {
        width: '100%', // Занимает всю ширину
        paddingHorizontal: 20, // Горизонтальные отступы
        paddingVertical: 10, // Вертикальные отступы
        alignItems: 'flex-start', // Выравнивание по левому краю
    },
    titleText: {
        color: 'white',
        fontWeight: '700', // Делаем название более жирным
        fontSize: 18, // Увеличиваем размер для акцента
        lineHeight: 24, // Улучшаем читаемость
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4, // Небольшой отступ от названия
    },
    metaText: {
        color: 'rgba(255, 255, 255, 0.7)', // Мягкий белый/серый цвет
        fontWeight: '500', // Средняя жирность
        fontSize: 14,
    },
    separator: {
        color: 'rgba(255, 255, 255, 0.4)',
        marginHorizontal: 8, // Отступ для разделителя
        fontWeight: '600',
    },
});
