import { AnimeKindEnum, VideoKindEnum } from "@/API/Shikimori/Shikimori.types";
import { Screenshots } from "@/components/Anime/Details";
import { Censored } from "@/components/Anime/Details/Censored";
import { Description } from "@/components/Anime/Details/Description";
import { DetailsGenre } from "@/components/Anime/Details/DetailGenres";
import { FandubberList } from "@/components/Anime/Details/FandubberList";
import { InfoItem } from "@/components/Anime/Details/InfoItem";
import { RatingStats } from "@/components/Anime/Details/RatingStats";
import { RelatedList } from "@/components/Anime/Details/RelatedList";
import { Season } from "@/components/Anime/Details/Season";
import { Section } from "@/components/Anime/Details/Section";
import { Title } from "@/components/Anime/Details/Title";
import { TrailerList } from "@/components/Anime/Details/TrailerList";
import { GradientBlur } from "@/components/GradientBlur";
import { ThemedView } from "@/components/ui/ThemedView";
import { TranslatedKind, TranslatedStatus } from "@/constants/TranslatedStatus";
import { useTheme } from "@/hooks/ThemeContext";
import { useAnimeStore } from "@/store/animeStore";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useRef } from "react";
import { Platform, useWindowDimensions, View } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_HEIGHT = 420;

function formatMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return `${hours} ч. ${minutes}  мин.`;
    } else {
        return `${minutes}  мин.`;
    }
}

export default function AnimeDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const animeData = useAnimeStore((s) => s.animeMap[Number(id)]);
    const isDarkMode = useTheme().theme === "dark";
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();

    if (!animeData) return null;

    const scrollY = useSharedValue(0);
    const scrollRef = useRef<Animated.ScrollView>(null);
    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(scrollY.value, [0, HEADER_HEIGHT], [1, 1.3], Extrapolation.CLAMP);
        const translateY = interpolate(scrollY.value, [-120, HEADER_HEIGHT], [0, -HEADER_HEIGHT / 2], Extrapolation.CLAMP);
        return {
            transform: [{ scale }, { translateY }],
        };
    });

    const headerBlurStyle = useAnimatedStyle(() => {
        if (Platform.Version >= '26.0') return {};

        return {
            opacity: interpolate(scrollY.value, [0, 1], [0, 1], Extrapolation.CLAMP)
        };
    });

    const gradientColors = useMemo(
        () => easeGradient({
            colorStops: {
                0: { color: "black" },
                0.5: {
                    color: isDarkMode ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.9)",
                },
                1: { color: "transparent" },
            },
        }), [isDarkMode]);

    return (
        <>
            {Platform.Version >= '26.0' && isDarkMode &&
                <LinearGradient
                    colors={['black', 'transparent']}
                    style={{
                        position: 'absolute',
                        width,
                        height: insets.top * 1.5,
                        top: -10,
                        zIndex: 100
                    }}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            }
            {Platform.Version < '26.0' &&
                <>
                    <GradientBlur
                        colors={gradientColors.colors}
                        locations={gradientColors.locations}
                        containerStyle={{
                            position: 'absolute',
                            zIndex: 2,
                            width,
                            height: insets.top
                        }}
                        tint="light"
                        blurIntensity={20}
                    />
                    <Animated.View style={[{
                        position: 'absolute',
                        height: 100,
                        width,
                        zIndex: 100
                    }, headerBlurStyle]}>
                        <BlurView style={{ height: 100, width }} intensity={100} tint={isDarkMode ? 'dark' : 'systemChromeMaterial'} />
                    </Animated.View>
                </>
            }
            <Animated.ScrollView
                ref={scrollRef}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                style={{ backgroundColor: isDarkMode ? "#000" : "#fff" }}
                contentInsetAdjustmentBehavior='automatic'
                contentContainerStyle={{ paddingBottom: insets.bottom }}
            >
                {/* --- Постер --- */}
                <Animated.View style={[{
                    position: 'absolute',
                    zIndex: 100,
                    width: '100%',
                    top: -350,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                }, headerAnimatedStyle]}>
                    <Image
                        source={{ uri: animeData?.poster?.originalUrl }}
                        style={{
                            width: '100%',
                            height: 750,
                            resizeMode: 'cover',
                            borderBottomLeftRadius: 30,
                            borderBottomRightRadius: 30,
                        }}
                        cachePolicy={'memory-disk'}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.springify()} style={{ paddingTop: 400 }}>
                    <Animated.View entering={FadeInDown.springify().delay(150)} style={{ paddingHorizontal: 16 }}>
                        <Title ru={animeData?.russian} eng={animeData?.english} jap={animeData?.japanese} />
                    </Animated.View>


                    <Animated.View entering={FadeInDown.springify().delay(250)} style={{ paddingHorizontal: 16 }}>
                        <Censored isCensored={animeData.isCensored} rating={animeData.rating} />
                    </Animated.View>

                    <View
                        style={{
                            height: 1,
                            backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                            marginTop: 15,
                        }}
                    />

                    <Animated.View entering={FadeInDown.springify().delay(350)}>
                        <View style={{ marginTop: 15, paddingHorizontal: 5 }}>
                            <Screenshots
                                id={animeData.malId.toString()}
                                imageStyle={{
                                    width: useWindowDimensions().width * 0.6,
                                    height: useWindowDimensions().width * 0.35,
                                    borderRadius: 20, marginVertical: 20, marginHorizontal: 10,
                                }}
                            />
                        </View>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.springify().delay(250)} style={{ paddingHorizontal: 16 }}>
                        <Section icon="book" title="Описание">
                            <Description text={animeData?.description} />
                        </Section>
                    </Animated.View>

                    <View style={{ paddingHorizontal: 16 }}>
                        <Season season={animeData?.season} />
                    </View>

                    <Animated.View entering={FadeInDown.springify().delay(350)} style={{ paddingHorizontal: 16 }}>
                        <Section icon="timer" title="Экранное время" color="#ff6961">
                            <InfoItem
                                icon="film.fill"
                                label="Тип"
                                value={TranslatedKind[animeData?.kind]}
                            />
                            <InfoItem
                                icon="hourglass"
                                label="Длительность"
                                value={animeData.duration ? `${formatMinutes(animeData?.duration)}` : "-"}
                            />
                            <InfoItem
                                icon="rectangle.stack.fill"
                                label="Эпизодов"
                                value={String(animeData?.episodes || "—")}
                            />
                            <InfoItem
                                icon="play.rectangle.fill"
                                label="Доступно"
                                value={String(animeData?.episodesAired || animeData.kind === AnimeKindEnum.movie && animeData.episodes || "—")}
                            />
                            {animeData?.releasedOn && (
                                <InfoItem
                                    icon="calendar"
                                    label="Дата выхода"
                                    value={animeData.releasedOn.date || animeData.airedOn.date || "-"}
                                />
                            )}
                        </Section>
                    </Animated.View>

                    <View style={{ paddingHorizontal: 16 }}>
                        {animeData?.score && (
                            <Section icon="star.fill" title="Рейтинг" color="#FFD700">
                                <RatingStats score={animeData.score} scoresStats={animeData.scoresStats} isDark={isDarkMode} />
                            </Section>
                        )}
                    </View>

                    {(animeData.status || animeData.studios?.length) && (
                        <Animated.View style={{ paddingHorizontal: 16 }}>
                            <Section icon="sparkles" title="Производство" color="#FF8C00">
                                {animeData.status && (
                                    <InfoItem
                                        icon="tv.and.mediabox.fill"
                                        label="Статус"
                                        value={TranslatedStatus[animeData.status]}
                                    />
                                )}
                                {animeData.studios?.length > 0 && (
                                    <InfoItem
                                        icon="building.2"
                                        label="Студия"
                                        value={animeData.studios.map((s) => s.name).join(", ")}
                                    />
                                )}
                            </Section>
                        </Animated.View>
                    )}

                    {animeData.genres?.length > 0 && (
                        <Animated.View style={{ paddingHorizontal: 16 }}>
                            <Section icon="books.vertical.fill" title="Жанры" color="#4cd964">
                                <DetailsGenre genres={animeData.genres} />
                            </Section>
                        </Animated.View>
                    )}

                    {animeData?.related?.length > 0 && (
                        <View style={{ paddingHorizontal: 16 }}>
                            <Section icon="link" title=" Связанные тайтлы" color="#4cd964">
                                <RelatedList related={animeData.related} />
                            </Section>
                        </View>
                    )}

                    {animeData?.fandubbers?.length > 0 && (
                        <ThemedView style={{ marginTop: 0, gap: 10, paddingHorizontal: 16 }}>
                            <Section icon="mic.fill" title="Озвучка" color="#ff9f43">
                                <FandubberList fandubbers={animeData.fandubbers} />
                            </Section>
                        </ThemedView>
                    )}

                    {animeData?.videos?.some(v => v.kind === VideoKindEnum.pv) && (
                        <View style={{ paddingHorizontal: 16 }}>
                            <Section icon="play.circle.fill" title="Трейлеры" color="#ff453a">
                                <TrailerList videos={animeData.videos.filter(v => v.kind === VideoKindEnum.pv)} />
                            </Section>
                        </View>
                    )}
                </Animated.View>
            </Animated.ScrollView>
        </>
    );
};