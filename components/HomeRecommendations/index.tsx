import { Card } from '@/components/HomeRecommendations/Card';
import { useTheme } from '@/hooks/ThemeContext';
import { storage } from '@/utils/storage';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import Animated, {
    FadeIn,
    FadeOut,
    useAnimatedReaction,
    useSharedValue
} from "react-native-reanimated";
import { runOnJS } from 'react-native-worklets';
import { IconSymbol } from '../ui/IconSymbol.ios';
import { ThemedText } from '../ui/ThemedText';
import { Pagination } from './Pagination';

const { width, height } = Dimensions.get('screen');

const darkColor = Platform.Version < '26.0' ? '#141414' : 'black'
const GradientColorsDark = [darkColor, 'transparent', darkColor] as const;
const GradientColorsLight = ['#f7f8f7', 'transparent', '#f7f8f7'] as const;

export default function Recommendations({ data }: { data: any[] }) {
    const isDarkMode = useTheme().theme === 'dark';
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
                <ThemedText style={{ fontWeight: '600', fontSize: 18, }}>Посмотри сегодня</ThemedText>
                <IconSymbol name='flame.fill' size={28} color='orange' />
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
                <ThemedText style={infoStyles.titleText}>{anime[currentIndex].title}</ThemedText>
                <View style={infoStyles.metaContainer}>
                    <ThemedText style={infoStyles.metaText}>{anime[currentIndex].year}</ThemedText>

                    <ThemedText style={infoStyles.separator}>•</ThemedText>
                    <ThemedText style={infoStyles.metaText}>{anime[currentIndex].type.name}</ThemedText>
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
                    tint={isDarkMode ? 'dark' : 'systemChromeMaterialLight'}
                    intensity={40}
                />
                <LinearGradient colors={isDarkMode ? GradientColorsDark : GradientColorsLight}
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

const infoStyles = StyleSheet.create({
    infoContainer: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'flex-start',
    },
    titleText: {
        fontWeight: '700',
        fontSize: 18,
        lineHeight: 24,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    metaText: {
        fontWeight: '500',
        fontSize: 14,
    },
    separator: {
        marginHorizontal: 8,
        fontWeight: '600',
    },
});
