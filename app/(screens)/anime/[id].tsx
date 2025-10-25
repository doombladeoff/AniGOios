import React, { useCallback, useMemo, useRef, useState } from "react";

import { AnimeStatusEnum } from "@/API/Shikimori/Shikimori.types";
import Bookmark from "@/components/Anime/Bookmark";
import {
    CharacterList,
    Details,
    GenresList,
    NextEpisodeInfo,
    RecommendationList,
    Screenshots
} from "@/components/Anime/Details";
import CustomHeader from "@/components/Anime/Header/CustomHeader";
import { HeaderRight } from "@/components/Anime/Header/HeaderRight";
import Player from "@/components/Anime/Player";
import { CrunchyPoster, Poster3D } from "@/components/Anime/Posters";
import { ItemsT } from "@/components/ContextComponent/DropdownMenu";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useAnimeFetch } from "@/hooks/anime/useAnimeFetch";
import { useTheme } from "@/hooks/ThemeContext";
import { auth } from "@/lib/firebase";
import { storage } from "@/utils/storage";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, useAnimatedRef, useScrollOffset } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const isLiquidGlassAv = isLiquidGlassAvailable();

export default function AnimeScreen() {
    const showStatus = storage.getShowStatus() ?? true;
    const isDarkMode = useTheme().theme === 'dark';
    const insets = useSafeAreaInsets();

    const { id } = useLocalSearchParams();
    const { animeData, isLoading, useCrunch, usePoster3D, backgroundImage } = useAnimeFetch(id as string);
    const [isOpened, setIsOpened] = useState(false);

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

    const headerRightItems = useMemo(() => [{
        title: 'Больше информации',
        onSelect: () => setIsOpened(true),
        iconName: 'info.circle.fill'
    } as ItemsT], [setIsOpened]);

    const handleNavToComments = useCallback((() => router.push({
        pathname: '/(screens)/comments',
        params: { id: animeData.malId }
    })), [animeData]);

    const scrollOffset = useScrollOffset(scrollRef);

    if (isLoading) {
        return (
            <ThemedView lightColor="white" darkColor="black" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='small' color={isDarkMode ? 'white' : 'black'} />
                <ThemedText lightColor="black" darkColor="white" style={{ textAlign: 'center', marginTop: 20 }}>Загрузка...</ThemedText>
            </ThemedView>
        )
    };

    return (
        <ThemedView lightColor="white" darkColor="black" style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    headerRight: () => <HeaderRight
                        img={{ crunch: backgroundImage || '', def: animeData?.poster?.originalUrl }}
                        customItems={headerRightItems}
                    />
                }}
            />

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
                style={{ backgroundColor: isDarkMode ? 'black' : 'white' }}
                headerBackgroundColor={{ dark: 'black', light: 'white' }}
                HEADER_HEIGHT={
                    useCrunch ? 600 :
                        usePoster3D ? 470 : 0}
                useScale={useCrunch ? true : false}
                headerImage={
                    <View>
                        {useCrunch && (
                            <CrunchyPoster
                                id={Number(id)}
                                showStatus={showStatus}
                            />
                        )}

                        {usePoster3D && (
                            <Poster3D
                                img={animeData?.poster.main2xUrl}
                                imgSmall={animeData?.poster.mainUrl}
                                showStatus={showStatus}
                                id={id as string}
                            />
                        )}
                    </View>
                }
            >
                <Animated.View entering={FadeIn.duration(700).delay(usePoster3D ? 700 : 500)} style={{ gap: 10, paddingBottom: insets.bottom }}>
                    <View style={{ paddingHorizontal: 10, marginTop: usePoster3D ? 20 : 40 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 30, height: 50 }}>
                            {auth.currentUser &&
                                <GlassView style={{
                                    position: 'absolute',
                                    left: 20,
                                    width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 100,
                                    shadowColor: 'black',
                                    shadowOpacity: 0.2,
                                    shadowRadius: 6,
                                    shadowOffset: { width: 0, height: 0 },
                                    ...(!isLiquidGlassAv && { backgroundColor: 'white' })
                                }}>
                                    <Bookmark
                                        id={id as string}
                                        isAnons={isAnons}
                                    />
                                </GlassView>
                            }
                            <Pressable disabled={isAnons} onPress={handleScrollToContent} style={{ height: 40, alignSelf: 'center', position: 'absolute' }}>
                                <ThemedView
                                    lightColor="black"
                                    darkColor="white"
                                    style={{
                                        alignItems: 'center',
                                        ...(isAnons && { backgroundColor: 'red' }),
                                        flexDirection: 'row',
                                        gap: 10,
                                        padding: 12,
                                        paddingHorizontal: 40, borderRadius: 12,
                                        shadowColor: 'black',
                                        shadowOpacity: 0.6,
                                        shadowRadius: 6,
                                        shadowOffset: { width: 0, height: 0 },
                                    }}
                                >
                                    {!isAnons && <IconSymbol name="play.fill" color={isDarkMode ? 'black' : 'white'} size={18} />}
                                    <ThemedText
                                        lightColor="white"
                                        darkColor="black"
                                        style={{ fontSize: 16, fontWeight: '500' }}>{!isAnons ? "Смотреть" : "Анонс"}</ThemedText>
                                </ThemedView>
                            </Pressable>

                            <GlassView isInteractive style={{
                                position: 'absolute',
                                right: 20,
                                borderRadius: 100, justifyContent: 'center', alignItems: 'center', width: 50, height: 50,
                                shadowColor: 'black',
                                shadowOpacity: 0.2,
                                shadowRadius: 6,
                                shadowOffset: { width: 0, height: 0 },
                                ...(!isLiquidGlassAv && { backgroundColor: 'white' })
                            }}>
                                <Pressable
                                    onPress={handleNavToComments} style={{ padding: 8 }}>
                                    <IconSymbol name="bubble.left.and.text.bubble.right.fill" size={28} color={isLiquidGlassAv ? isDarkMode ? 'white' : 'black' : 'black'} />
                                </Pressable>
                            </GlassView>
                        </View>
                    </View>

                    <GenresList
                        id={Number(id)}
                        listStyle={{ paddingHorizontal: 10, marginVertical: isLiquidGlassAv ? 10 : 20 }}
                        genreStyle={{
                            backgroundColor: "rgba(219, 45, 105, 0.25)",
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

                    <NextEpisodeInfo
                        id={Number(id)}
                        style={styles.nextExpisode}
                        textStyle={{ fontSize: 15, fontWeight: '500' }}
                        icon="clock"
                    />

                    <Screenshots
                        id={Number(id)}
                        containerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
                        imageStyle={{ width: 280, height: 160, borderRadius: 12, marginLeft: 0, margin: 10, backgroundColor: 'gray' }}
                        headerText="Скриншоты"
                        headerTextStyle={{ paddingHorizontal: 15, fontSize: 18, fontWeight: '600', zIndex: 22, marginTop: 10 }}
                    />

                    {(!isAnons) &&
                        <View onLayout={(e) => playerPosition.current = e.nativeEvent.layout.y * 1.75}>
                            <Player id={id as string} />
                        </View>
                    }

                    <CharacterList id={Number(id)} />

                    <RecommendationList id={Number(id)} showTitle />

                </Animated.View>
            </ParallaxScrollView>

            <Details id={id as string} opened={isOpened} handleShow={() => setIsOpened(false)} />
        </ThemedView>
    )
};

const styles = StyleSheet.create({
    commentsBtn: {
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: "#0A84FF",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
        marginHorizontal: 10,
    },
    commentsTextBtn: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    nextExpisode: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 10,
        gap: 10,
        backgroundColor: 'rgba(68, 68, 68, 0.5)',
        padding: 10,
        borderRadius: 12,
        zIndex: 23
    }
})