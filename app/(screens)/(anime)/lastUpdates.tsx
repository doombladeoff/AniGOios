import { GradientBlur } from "@/components/GradientBlur";
import { CardPoster } from "@/components/List/Item/CardPoster";
import { Skeleton } from "@/components/ui/Skeleton";
import { fetchLastUpdates } from "@/hooks/homeData/fetchLastUpdates";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MaterialObject } from "kodikwrapper";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('screen');
const ITEM_WIDTH = (width / 3) - 10;

const TITLE_HEIGHT = 50
const HEADER_HEIGHT = 100;
const VISIBLE_ROWS = 4;

const availableHeight = height - (HEADER_HEIGHT + TITLE_HEIGHT);
const ITEM_HEIGHT = availableHeight / VISIBLE_ROWS;

const chunk = (arr: MaterialObject[], size: number) => {
    const result: MaterialObject[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
};

const formatData = (title: string, arr: MaterialObject[]) => {
    const rows = chunk(arr, 3);
    return [title, ...rows];
};

type Anime = MaterialObject & {
    poster: {
        originalUrl: string;
    }
}

export default function AnimeLastUpdatesScreen() {
    const insets = useSafeAreaInsets();
    const { colors, locations } = easeGradient({
        colorStops: {
            0: { color: 'black' },
            0.5: { color: 'rgba(0,0,0,0.9)' },
            1: { color: 'transparent' }
        },
    });

    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const isFetched = useRef(false);

    const fetch = async () => {
        setIsLoading(true);
        try {
            const r = await fetchLastUpdates({ type: 'full', limit: 40 });
            if ('result1' in r) {
                setData([
                    ...formatData("Сегодня", r.result1),
                    ...formatData("Вчера", r.result2),
                ]);
            }

            isFetched.current = true;
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => setIsLoading(false), 700)
        }
    }

    useEffect(() => { if (isFetched.current) return; fetch() }, []);

    const handleNavigate = useCallback((id: number) => {
        router.push({ pathname: '/(screens)/(anime)/[id]', params: { id } });
    }, []);

    const renderRow = ({ item, index }: { item: Anime[]; index: number }) => (
        <Animated.View entering={FadeInDown} style={{ flexDirection: "row", marginBottom: 10 }} key={`row-${index}`}>
            {item.map((anime) => (
                <CardPoster
                    key={`${anime.shikimori_id}-${anime.last_episode}-${anime.translation.id}`}
                    img={anime?.poster?.originalUrl}
                    imgStyle={styles.img}
                    transition={700}
                    imgFit='cover'
                    imgCachePolicy={'disk'}
                    imgPriority={'high'}
                    container={{ marginHorizontal: 5 }}
                    onPress={() => handleNavigate(anime.shikimori_id)}
                >
                    <Text style={styles.episode} numberOfLines={2}>
                        Серия {anime.last_episode}
                    </Text>

                    <Text style={styles.title} numberOfLines={2}>
                        {anime.title}
                    </Text>
                    <Text style={styles.translationTitle} numberOfLines={1}>
                        {anime.translation.title}
                    </Text>
                </CardPoster>
            ))}
        </Animated.View >
    );

    const SkeletonR = () => {
        const fakeRows = new Array(3).fill(0);

        return (
            <View style={{ paddingTop: 100, paddingHorizontal: 5 }}>
                <Skeleton width={ITEM_WIDTH} height={20} radius={6} style={{ marginVertical: 8, marginHorizontal: 5 }} />
                {fakeRows.map((_, idx) => (
                    <View key={idx} style={{ flexDirection: "row", marginBottom: 10 }}>
                        {new Array(3).fill(0).map((__, i) => (
                            <View key={i} style={{ margin: 5 }}>
                                <Skeleton width={ITEM_WIDTH} height={200} radius={12} />
                                <Skeleton width={ITEM_WIDTH} height={20} radius={6} style={{ marginTop: 8 }} />
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={['black', 'transparent']} style={[StyleSheet.absoluteFill, { height: insets.top * 2.5, zIndex: 3 }]} />
            <GradientBlur
                containerStyle={{
                    position: 'absolute',
                    top: 0,
                    zIndex: 2, width, height: insets.top * 2.5,
                }}
                locations={locations as [number, number, ...number[]]}
                colors={colors as [string, string, ...string[]]}
                tint="regular"
                blurIntensity={50}
            />

            {isLoading ? (
                <SkeletonR />
            ) : (
                <FlashList
                    data={data}
                    contentContainerStyle={{
                        paddingTop: 100,
                        paddingBottom: insets.bottom,
                    }}
                    renderItem={({ item, index }) => {
                        if (typeof item === "string") {
                            return (
                                <Text style={styles.sectionTitle}>
                                    {item}
                                </Text>
                            )
                        } else {
                            return renderRow({ item, index });
                        }
                    }}
                    getItemType={(item) => {
                        return typeof item === "string" ? "sectionHeader" : "row";
                    }}
                />
            )}
        </View>
    )
};


const styles = StyleSheet.create({
    sectionTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        padding: 15,
        backgroundColor: "black",
    },
    img: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        borderRadius: 12,
        backgroundColor: "#1e1e1e",
    },
    episode: {
        position: "absolute",
        color: "white",
        backgroundColor: "#1e1e1e",
        padding: 4,
        borderRadius: 6,
        top: 6,
        alignSelf: "center",
        shadowColor: "black",
        shadowOpacity: 0.85,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        fontWeight: "500",
        zIndex: 2,
    },
    title: {
        color: "white",
        width: ITEM_WIDTH,
        fontSize: 14,
        paddingLeft: 5,
    },
    translationTitle: {
        color: "gray",
        width: ITEM_WIDTH,
        fontSize: 12,
        paddingLeft: 5,
    },
})