import { getAnimeList } from "@/API/Shikimori/RequestAnime";
import { OrderEnum } from "@/API/Shikimori/RequestInterfaces.interfaces";
import { ShikimoriAnime } from "@/API/Shikimori/Shikimori.types";
import { GradientBlur } from "@/components/GradientBlur";
import AnimeItem from "@/components/Screens/Search/AnimeItem";
import { useHeaderHeight } from "@react-navigation/elements";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AnimeByGenreScreen() {
    const { genre_id, genre_name } = useLocalSearchParams();
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
        setLoading(true)
        const response = await getAnimeList(
            { page: page, limit: 10, genre: [genre_id as string], order: OrderEnum.ranked, status: ['released', 'ongoing', 'latest'], duration: ['D', 'F'] },
            {
                id: true,
                malId: true,
                poster: { main2xUrl: true, mainUrl: true, originalUrl: true },
                russian: true,
                score: true,
                description: true,
                genres: { russian: true, id: true }
            }
        );
        console.log(response);
        if (page > 1) {
            setData(prev => [...prev, ...response])
        } else {
            setData(response)
        }
        setLoading(false)
    }

    useEffect(() => { console.log(genre_id, genre_name); if (true) fetch(); }, [genre_id]);
    useEffect(() => { if (page === 1) return; console.log(page); fetch() }, [page])

    if (!data.length) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={'small'} />
        </View>
    )

    return (
        <>
            <Stack.Screen options={{ headerTitle: genre_name as string }} />
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
            <FlashList
                data={data}
                renderItem={({ item, index }) => <View style={{ marginBottom: 10 }}><AnimeItem item={item} index={index} /></View>}
                contentContainerStyle={{ paddingTop: headerHeight + 20, paddingBottom: 30, paddingHorizontal: 10, gap: 0 }}
                onEndReached={() => {
                    setPage(prev => prev + 1);
                }}
                onEndReachedThreshold={1}
                ListFooterComponentStyle={{ justifyContent: 'center', alignItems: 'center' }}
                ListFooterComponent={loading ? <ActivityIndicator size={'small'} /> : null}
            />
        </>

    )
}