import React, { useCallback, useMemo, useRef, useState } from "react";

import { AnimeStatusEnum } from "@/API/Shikimori/Shikimori.types";
import Bookmark from "@/components/Anime/Bookmark";
import CustomHeader from "@/components/Anime/CustomHeader";
import {
    CharacterList,
    Details,
    GenresList,
    NextEpisodeInfo,
    RecommendationList,
    ScreenshotsList,
} from "@/components/Anime/Details";
import { HeaderRight } from "@/components/Anime/HeaderRight";
import Player from "@/components/Anime/Player";
import { CrunchyPoster, Poster3D } from "@/components/Anime/Posters";
import { ItemsT } from "@/components/ContextComponent/DropdownMenu";
import { GradientBlur } from "@/components/GradientBlur";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAnimeFetch } from "@/hooks/anime/useAnimeFetch";
import { useScrollOpacity } from '@/hooks/useScrollOpacity';
import { auth } from "@/lib/firebase";
import { storage } from "@/utils/storage";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import Animated, { Extrapolation, FadeIn, FadeInDown, interpolate, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

export default function AnimeScreen() {
    const useTestHeader: boolean = storage.getUseTestHeader() ?? false;
    const showStatus = storage.getShowStatus() ?? true;

    const headerHeight = useHeaderHeight();
    const { colors, locations } = easeGradient({
        colorStops: {
            0: { color: 'black' },
            0.5: { color: 'rgba(0,0,0,0.9)' },
            1: { color: 'transparent' }
        },
    });

    const { id } = useLocalSearchParams();
    const { animeData, isLoading, useCrunch, usePoster3D } = useAnimeFetch(id as string);
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

    const crunchyId = animeData?.crunchyroll?.crunchyrollId;

    const fallbackImage = animeData?.poster?.originalUrl;

    const { animatedStyle, scrollHandler } = useScrollOpacity(useCrunch ? 600 : 270);

    const backgroundImage = useMemo(() => {
        if (animeData?.crunchyroll.hasTallThumbnail) return animeData.crunchyroll.crunchyImages.tallThumbnail;
        if (animeData?.crunchyroll.hasWideThumbnail) return animeData.crunchyroll.crunchyImages.wideThumbnail;
    }, [crunchyId, animeData?.crunchyroll.hasTallThumbnail, animeData?.crunchyroll.hasWideThumbnail]);

    const top = useSharedValue(0);
    const combinedScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const y = event.contentOffset.y;
            top.value = interpolate(
                y,
                [0, 330],
                [0, -470],
                Extrapolation.CLAMP
            );
        },
    });

    const animatedStyle1 = useAnimatedStyle(() => ({
        top: top.value,
    }));

    const headerRightItems = useMemo(() => [{
        title: 'Больше информации',
        onSelect: () => setIsOpened(true),
        iconName: 'info.circle.fill'
    } as ItemsT], [setIsOpened]);

    const handleNavToComments = useCallback((() => router.push({
        pathname: '/(screens)/(anime)/(comments)/comments',
        params: { id: animeData?.malId }
    })), [])

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='small' color="white" />
                <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>Загрузка...</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    ...(useTestHeader && {
                        header: () => useTestHeader ? <CustomHeader
                            Right={<HeaderRight img={{ crunch: backgroundImage || '', def: animeData?.poster?.originalUrl }} customItems={headerRightItems} />}
                            animeData={animeData}
                            animatedStyle1={animatedStyle1}
                            showStatus={showStatus}
                            fallbackImage={fallbackImage}
                        /> : undefined
                    }),

                    headerRight: () => <HeaderRight img={{ crunch: backgroundImage || '', def: animeData?.poster?.originalUrl }}
                        customItems={headerRightItems}
                    />,
                }}
            />
            <Animated.View style={[StyleSheet.absoluteFill, { width: '100%', height: headerHeight, zIndex: 100 }, animatedStyle]}>
                <GradientBlur
                    containerStyle={{
                        position: 'absolute',
                        top: 0,
                        zIndex: 2, width: '100%', height: headerHeight
                    }}
                    locations={locations as [number, number, ...number[]]}
                    colors={colors as [string, string, ...string[]]}
                    tint="regular"
                    blurIntensity={20}
                />
                <LinearGradient
                    colors={['black', 'transparent']}
                    style={[StyleSheet.absoluteFill, { width: '100%', height: headerHeight, zIndex: 200 }]}
                    pointerEvents='none'
                />
            </Animated.View>
            <ParallaxScrollView
                ref={scrollRef}
                onScroll={useTestHeader ? combinedScrollHandler : scrollHandler}
                scrollEventThrottle={16}
                entering={FadeIn.duration(500)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 205 }}
                headerBackgroundColor={{ dark: 'black', light: 'white' }}
                HEADER_HEIGHT={!useTestHeader ? useCrunch ? 600 : 470 : 470}
                useScale={useCrunch ? true : false}
                headerImage={
                    <View>
                        {(useCrunch && !useTestHeader) && (
                            <CrunchyPoster
                                id={Number(id)}
                                showStatus={showStatus}
                            />
                        )}

                        {(usePoster3D && !useTestHeader) && (
                            <Poster3D
                                img={animeData?.poster.main2xUrl}
                                imgSmall={animeData?.poster.mainUrl}
                                showStatus={showStatus}
                                setPosterLoad={() => { }}
                                id={id as string}
                            />
                        )}
                    </View>

                }
            >
                <Animated.View entering={FadeInDown.duration(700).delay(usePoster3D ? 1000 : 500)} style={{ gap: 10, paddingBottom: 40 }}>
                    <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
                            {auth.currentUser &&
                                <View style={{ right: 20 }}>
                                    <Bookmark
                                        id={id as string}
                                        // setHeader={setStatus}
                                        isAnons={isAnons}
                                    />
                                </View>
                            }
                            <Pressable disabled={isAnons} onPress={handleScrollToContent}>
                                <View style={{ alignItems: 'center', backgroundColor: !isAnons ? 'white' : 'red', flexDirection: 'row', gap: 10, padding: 12, paddingHorizontal: 40, borderRadius: 12, right: 30, left: !auth.currentUser ? 0 : undefined }}>
                                    {!isAnons && <IconSymbol name="play.fill" color={"black"} size={18} />}
                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{!isAnons ? "Смотреть" : "Анонс"}</Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>

                    <GenresList
                        id={Number(id)}
                        listStyle={{ paddingHorizontal: 10, marginTop: 20 }}
                        genreStyle={{
                            backgroundColor: "rgba(219, 45, 105, 0.25)",
                            padding: 5,
                            borderRadius: 12,
                            marginRight: 10
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
                        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginHorizontal: 10, gap: 10, backgroundColor: 'rgba(68, 68, 68, 0.5)', padding: 10, borderRadius: 8, zIndex: 23 }}
                        textStyle={{ fontSize: 16, fontWeight: '500', color: 'white' }}
                        icon="clock"
                    />


                    <ScreenshotsList
                        id={Number(id)}
                        containerStyle={{ paddingHorizontal: 10 }}
                        imageStyle={{ width: 280, height: 150, borderRadius: 12, marginLeft: 0, margin: 10, backgroundColor: 'gray' }}
                        headerText="Скриншоты"
                        headerTextStyle={{ paddingHorizontal: 15, color: 'white', fontSize: 18, fontWeight: '600', zIndex: 22, marginTop: 10 }}
                    />


                    {(!isAnons) &&
                        <View onLayout={(e) => playerPosition.current = e.nativeEvent.layout.y * 1.75}>
                            <Player id={id as string} />
                        </View>
                    }

                    <CharacterList id={Number(id)} />

                    <RecommendationList
                        id={Number(id)}
                        showTitle
                        imageStyle={styles.recommendImg}
                        titleStyle={styles.recommendTitle}
                        containerStyle={styles.recommendContainer}
                        imageTextStyle={styles.recommendImgText}
                    />

                    <Pressable
                        onPress={handleNavToComments}
                        style={styles.commentsBtn}
                    >
                        <Text style={styles.commentsTextBtn}>
                            Отзывы
                        </Text>
                    </Pressable>
                </Animated.View>
            </ParallaxScrollView>

            <Details id={id as string} opened={isOpened} handleShow={() => setIsOpened(false)} />
        </View>
    )
};


const styles = StyleSheet.create({
    recommendContainer: {
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    recommendImg: {
        width: 160,
        height: 220,
        borderRadius: 12,
        marginBottom: 5
    },
    recommendImgText: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
        maxWidth: 120,
        paddingLeft: 5
    },
    recommendTitle: {
        paddingHorizontal: 15,
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        zIndex: 22,
        marginTop: 10
    },
    commentsBtn: {
        paddingVertical: 14,
        borderRadius: 12,
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
    }
})