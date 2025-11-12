import { AnimeStatusEnum } from "@/API/Shikimori/Shikimori.types";
import { Controls } from "@/components/Anime/Controls";
import {
    CharacterList,
    GenresList,
    NextEpisodeInfo,
    RecommendationList,
    Screenshots
} from "@/components/Anime/Details";
import CustomHeader from "@/components/Anime/Header/CustomHeader";
import { default as HeaderRightMenu } from "@/components/Anime/Header/HeaderRightMenu";
import Player from "@/components/Anime/Player";
import { CrunchyPoster, Poster3D } from "@/components/Anime/Posters";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Background from "@/components/ui/Background";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useAnimeFetch } from "@/hooks/anime/useAnimeFetch";
import { useTheme } from "@/hooks/ThemeContext";
import { cleanDescription } from "@/utils/cleanDescription";
import {
    isLiquidGlassSupported
} from '@callstack/liquid-glass';
import { Host } from "@expo/ui/swift-ui";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, useAnimatedRef, useScrollOffset } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AnimeScreen() {
    const isDarkMode = useTheme().theme === 'dark';
    const insets = useSafeAreaInsets();

    const { id } = useLocalSearchParams<{ id: string }>();
    const { animeData, isLoading, useCrunch, usePoster3D } = useAnimeFetch(id as string);
    const isAnons = animeData?.status === AnimeStatusEnum.anons;

    //Player
    const playerPosition = useRef<number>(0);
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const handleScrollToContent = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ y: playerPosition.current, animated: true });
        }
    }, []);

    const fallbackImage = animeData?.poster?.originalUrl;
    const scrollOffset = useScrollOffset(scrollRef);

    const handleNavigateToDetails = useCallback(() => {
        router.push({
            pathname: '/anime/details',
            params: { id }
        });
    }, [id]);

    const headerRight = useMemo(() => (
        <>
            {Platform.Version < '26.0' ? (
                <Host style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <ThemedView
                        darkColor='rgba(0,0,0,0.5)'
                        lightColor='rgba(255,255,255,0.4)'
                        style={{ width: 40, height: 40, padding: 0, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <HeaderRightMenu id={id as string} />
                    </ThemedView>
                </Host>
            ) : (
                <Host style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
                        <HeaderRightMenu id={id as string} />
                    </View>
                </Host>
            )}
        </>
    ), [id]);

    if (isLoading) {
        return (
            <ThemedView lightColor="white" darkColor="black" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Background style={[StyleSheet.absoluteFillObject]} />
                <ActivityIndicator size='small' color={isDarkMode ? 'white' : 'black'} />
                <ThemedText lightColor="black" darkColor="white" style={{ textAlign: 'center', marginTop: 20 }}>Загрузка...</ThemedText>
            </ThemedView>
        )
    };

    return (
        <>
            <Stack.Screen options={{ headerRight: () => headerRight }} />

            <ThemedView lightColor="white" darkColor="black" style={{ flex: 1 }}>
                <CustomHeader
                    animeData={animeData}
                    fallbackImage={fallbackImage}
                    scrollY={scrollOffset}
                />

                <ParallaxScrollView
                    ref={scrollRef}
                    scrollEventThrottle={16}
                    entering={FadeIn.duration(500)}
                    showsVerticalScrollIndicator={false}
                    headerBackgroundColor={{ dark: 'black', light: 'white' }}
                    overScrollMode='never'
                    removeClippedSubviews
                    HEADER_HEIGHT={
                        useCrunch ? 600 :
                            usePoster3D ? 470 : 0}
                    useScale={useCrunch}
                    headerImage={
                        <View>
                            {useCrunch && (
                                <CrunchyPoster id={Number(id)} />
                            )}

                            {usePoster3D && (
                                <Poster3D id={id as string} />
                            )}
                        </View>
                    }
                >
                    <Animated.View entering={FadeIn.duration(700).delay(usePoster3D ? 700 : 500)} style={{ gap: 16, paddingBottom: insets.bottom }}>
                        <Controls watchPress={handleScrollToContent} id={id} />

                        <GenresList
                            id={Number(id)}
                            listStyle={{ paddingHorizontal: 10, marginTop: 10, paddingBottom: 0 }}
                            tintColor={"rgba(219, 45, 105, 0.25)"}
                            genreStyle={{
                                ...(!isLiquidGlassSupported ? { backgroundColor: "rgba(219, 45, 105, 0.25)" } : undefined),
                                padding: 5,
                                borderRadius: 12,
                                marginRight: 10,
                            }}
                            genreTextStyle={{
                                padding: 5,
                                color: "#DB2D69",
                                fontSize: 14,
                                fontWeight: "500",
                            }}
                        />

                        {animeData?.description && (
                            <View style={{ paddingHorizontal: 15 }}>
                                <ThemedText numberOfLines={4}>{cleanDescription(animeData?.description)}</ThemedText>
                                <Pressable
                                    onPress={handleNavigateToDetails}
                                    style={{ marginTop: 20 }}
                                >
                                    <Text style={{ color: 'orange', fontSize: 14 }}>Подробнее</Text>
                                </Pressable>
                            </View>
                        )}

                        <NextEpisodeInfo id={Number(id)} icon="clock" />

                        <Screenshots
                            id={Number(id)}
                            containerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
                            imageStyle={{ width: 280, height: 160, borderRadius: 26, marginLeft: 0, margin: 10, backgroundColor: 'gray' }}
                            headerText="Скриншоты"
                            headerTextStyle={{ paddingHorizontal: 15, fontSize: 18, fontWeight: '600', zIndex: 22, marginTop: 10 }}
                        />

                        {(!isAnons) &&
                            <View onLayout={(e) => {
                                playerPosition.current = e.nativeEvent.layout.y + insets.top;
                            }}>
                                <Player id={id as string} />
                            </View>
                        }

                        <CharacterList id={Number(id)} />

                        <RecommendationList id={Number(id)} showTitle />

                    </Animated.View>
                </ParallaxScrollView>
            </ThemedView>
        </>
    );
};