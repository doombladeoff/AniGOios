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

export default function AnimeScreen() {
    const useTestHeader: boolean = storage.getUseTestHeader() ?? false;
    const showStatus = storage.getShowStatus() ?? true;
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

    const fallbackImage = animeData?.poster?.originalUrl;

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
        params: { id: animeData.malId }
    })), [animeData]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='small' color="white" />
                <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>Загрузка...</Text>
            </View>
            <ThemedView lightColor="white" darkColor="black" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    ...(useTestHeader && {
                        header: () => useTestHeader ? <CustomHeader
                            animeData={animeData}
                            fallbackImage={fallbackImage}
                        /> : undefined
                        img={{ crunch: backgroundImage || '', def: animeData?.poster?.originalUrl }}
                        customItems={headerRightItems}
                    />,
                }}
            />
                    tint="regular"
                    blurIntensity={20}
                <LinearGradient
                    colors={['black', 'transparent']}
                    style={[StyleSheet.absoluteFill, { width: '100%', height: headerHeight, zIndex: 200 }]}
                    pointerEvents='none'
                />
            </Animated.View>
                fallbackImage={fallbackImage}
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

                    <Screenshots
                        id={Number(id)}
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