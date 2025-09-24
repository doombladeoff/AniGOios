import { getAnimeList } from "@/API/Shikimori/RequestAnime";
import { AnimeFields } from "@/API/Shikimori/RequestFields.type";
import { OrderEnum } from "@/API/Shikimori/RequestInterfaces.interfaces";
import { ShikimoriAnime } from "@/API/Shikimori/Shikimori.types";
import { GradientBlur } from "@/components/GradientBlur";
import AnimeItem from "@/components/Screens/Search/AnimeItem";
import { useHeaderHeight } from "@react-navigation/elements";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const fiedls: AnimeFields = {
    id: true,
    malId: true,
    poster: {
        main2xUrl: true,
        mainUrl: true,
        originalUrl: true
    },
    russian: true,
    score: true,
    description: true,
    genres: {
        russian: true,
        id: true
    }
}

export default function AnimeByGenreScreen() {
    const { genre_id, genre_name } = useLocalSearchParams<{ genre_id: string, genre_name: string }>();
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const { colors, locations } = easeGradient({
        colorStops: {
            0: { color: 'black' },
            0.5: { color: 'rgba(0,0,0,0.9)' },
            1: { color: 'transparent' }
        },
    });

    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<ShikimoriAnime[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await getAnimeList(
                {
                    page: page,
                    limit: 10,
                    genre: [genre_id],
                    order: OrderEnum.ranked,
                    status: ['released', 'ongoing', 'latest'],
                    duration: ['D', 'F']
                },
                fiedls
            );

            page > 1 ? setData(prev => [...prev, ...response]) : setData(response);

        } catch (error) {
            console.error('Ошибка в получении элементов жанра:', error);
            return [];
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        fetch();
    }, [genre_id]);

    useEffect(() => {
        if (page > 1)
            fetch();
    }, [page]);

    const renderItem = useCallback(({ item, index }: { item: ShikimoriAnime; index: number }) => {
        return (
            <View style={{ marginBottom: 10 }}>
                <AnimeItem item={item} index={index} />
            </View>
        )
    }, []);


    if (!data.length) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={'small'} />
        </View>
    )

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{ headerTitle: genre_name }} />
            <>
                <LinearGradient colors={['black', 'rgba(0,0,0,0.75)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0)']} style={[StyleSheet.absoluteFill, { width: '100%', height: headerHeight, zIndex: 200 }]} pointerEvents='none' />
                <GradientBlur
                    containerStyle={{
                        position: 'absolute',
                        top: 0,
                        zIndex: 2, width: '100%', height: insets.top * 2.5,
                    }}
                    locations={locations as [number, number, ...number[]]}
                    colors={colors as [string, string, ...string[]]}
                    tint="regular"
                    blurIntensity={50}
                />
            </>
            <FlashList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.malId)}
                contentContainerStyle={{
                    paddingTop: headerHeight + 20,
                    paddingBottom: insets.bottom,
                    paddingHorizontal: 10
                }}
                scrollIndicatorInsets={{ top: 20 }}
                onEndReached={() => {
                    if (!loading) setPage(prev => prev + 1);
                }}
                onEndReachedThreshold={0.85}
                ListFooterComponentStyle={{ justifyContent: 'center', alignItems: 'center' }}
                ListFooterComponent={loading ? <ActivityIndicator size={'small'} /> : null}
            />
        </View>
    )
}