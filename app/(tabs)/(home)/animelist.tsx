import { getAnimeList } from "@/API/Shikimori/RequestAnime";
import { AnimeFields } from "@/API/Shikimori/RequestFields.type";
import { KindShiki, OrderEnum, RequestProps } from "@/API/Shikimori/RequestInterfaces.interfaces";
import { GradientBlur } from "@/components/GradientBlur";
import List from "@/components/List";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBottomHeight } from "@/hooks/useBottomHeight";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get('screen');
const ITEM_WIDTH = (width / 3) - 10;

const baseParams: RequestProps = {
    limit: 21,
    order: OrderEnum.ranked,
    duration: ["D", "F"],
    rating: ["pg_13", "r", "r_plus"],
};
const requestConfigs: Record<string, RequestProps> = {
    top_rated: { kind: [KindShiki.tv, KindShiki.ona], status: ["released"], ...baseParams },
    on_screens: { kind: [KindShiki.tv, KindShiki.ona], status: ["ongoing"], ...baseParams },
    movie: { kind: [KindShiki.movie], status: ["released", "ongoing", "latest"], ...baseParams },
    anons: { kind: [KindShiki.tv, KindShiki.movie], status: ["anons"], ...baseParams },
};

const requestFields: AnimeFields = {
    malId: true,
    poster: { main2xUrl: true, originalUrl: true, mainUrl: true },
    score: true,
    russian: true,
};

export default function AnimeListScreen() {
    const { typeRequest, headerText } = useLocalSearchParams<{ typeRequest: string; headerText: string }>();

    const bottomHeight = useBottomHeight();
    const insets = useSafeAreaInsets();

    const [animeList, setAnimeList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const page = useRef<number>(1);

    const { colors, locations } = easeGradient({
        colorStops: {
            0: { color: 'black' },
            0.5: { color: 'rgba(0,0,0,0.9)' },
            1: { color: 'transparent' }
        },
    });


    const fetchData = useCallback(async () => {
        if (!typeRequest || !hasMore || isLoading) return;

        setIsLoading(true);
        let active = true;

        try {
            const params = requestConfigs[typeRequest];
            if (!params) return [];

            const response = await getAnimeList({ ...params, page: page.current, }, requestFields);

            if (!active) return;

            if (response.length === 0) {
                setHasMore(false);
                return;
            }

            setAnimeList((prev) => [...prev, ...(response || [])]);

        } catch (error) {
            console.error(error)
        } finally {
            if (active) setTimeout(() => setIsLoading(false), 1000);
        }

        return () => {
            active = false;
        };
    }, [typeRequest, hasMore, isLoading]);

    useEffect(() => {
        fetchData();
    }, [typeRequest]);

    const handleEndReached = () => {
        if (!isLoading && hasMore) {
            page.current += 1;
            fetchData();
        }
    };


    const SkeletonR = () => {
        const fakeRows = new Array(5).fill(0);

        return (
            <View style={{ paddingTop: 100 }}>
                {fakeRows.map((_, idx) => (
                    <View key={idx} style={{ flexDirection: "row", }}>
                        {new Array(3).fill(0).map((__, i) => (
                            <View key={i} style={{ padding: 5 }}>
                                <Skeleton width={ITEM_WIDTH} height={200} radius={12} />
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{ headerTitle: headerText as string }} />
            <LinearGradient colors={['black', 'rgba(0,0,0,0.75)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']} style={[StyleSheet.absoluteFill, { width: '100%', height: insets.top * 2.35, zIndex: 200 }]} pointerEvents='none' />
            <GradientBlur
                containerStyle={{
                    position: 'absolute',
                    top: 0,
                    zIndex: 2, width, height: insets.top * 2.35,
                }}
                locations={locations as [number, number, ...number[]]}
                colors={colors as [string, string, ...string[]]}
                tint="regular"
                blurIntensity={20}
            />
            {(isLoading && page.current === 1) ?
                <SkeletonR /> :
                <List
                    showHeader={false}
                    horizontal={false}
                    numColumns={3}
                    headerText='Аниме'
                    typeRequest={typeRequest as "movie" | "anons" | "top_rated" | "on_screens"}
                    data={animeList}
                    contentInsetAdjustmentBehavior='automatic'
                    contentContainerStyle={{ paddingTop: 0, paddingBottom: bottomHeight }}
                    ListFooterComponent={() => (isLoading && <ActivityIndicator size={32} style={{ paddingVertical: 20 }} color={'white'} />)}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={1}
                    removeClippedSubviews
                />
            }
        </View>
    );
}
