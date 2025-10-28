import { getAnimeList } from "@/API/Shikimori/RequestAnime";
import { AnimeFields } from "@/API/Shikimori/RequestFields.type";
import { KindShiki } from "@/API/Shikimori/RequestInterfaces.interfaces";
import { ShikimoriAnime } from "@/API/Shikimori/Shikimori.types";
import AnimeItem from "@/components/Screens/Search/AnimeItem";
import BackgroundBlur from "@/components/ui/BackgroundBlur";
import { ThemedView } from "@/components/ui/ThemedView";
import { FlashList } from "@shopify/flash-list";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const fetchFields: AnimeFields = {
    id: true,
    malId: true,
    russian: true,
    english: true,
    description: true,
    kind: true,
    score: true,
    poster: { mainUrl: true },
    genres: { id: true, name: true, russian: true, kind: true },
};

export default function AnimeStudiosScreen() {
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

    const [anime, setAnime] = useState<ShikimoriAnime[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const pageRef = useRef(1);

    const fetchStudioAnime = useCallback(
        async (pageNum: number, replace = false) => {
            try {
                if (pageNum === 1) setLoading(true);
                else setLoadingMore(true);

                const result = await getAnimeList(
                    {
                        studio: id,
                        limit: 15,
                        page: pageNum,
                        kind: [
                            KindShiki.tv,
                            KindShiki.ona,
                            KindShiki.ova,
                            KindShiki.movie,
                        ],
                    },
                    fetchFields
                );

                if (!result?.length) {
                    setHasMore(false);
                    return;
                }

                setAnime(prev => (replace ? result : [...prev, ...result]));
            } catch (error) {
                console.error("Ошибка загрузки аниме:", error);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [id]
    );

    useEffect(() => {
        pageRef.current = 1;
        setHasMore(true);
        setAnime([]);
        fetchStudioAnime(1, true);
    }, [id]);

    const handleLoadMore = useCallback(() => {
        if (!loadingMore && hasMore) {
            const nextPage = pageRef.current + 1;
            pageRef.current = nextPage;
            fetchStudioAnime(nextPage);
        }
    }, [loadingMore, hasMore, fetchStudioAnime]);

    const renderItem = ({ item, index }: { item: ShikimoriAnime; index: number }) => (
        <View style={{ marginBottom: 10 }}>
            <AnimeItem item={item} index={index} />
        </View>
    );

    const ListFooter = () => loadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} size="small" /> : null;

    if (loading && anime.length === 0) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </ThemedView>
        );
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: name || "Студия",
                }}
            />
            <BackgroundBlur />
            <FlashList
                data={anime}
                renderItem={renderItem}
                keyExtractor={(item: ShikimoriAnime) => item.malId.toString()}
                contentContainerStyle={{ padding: 10 }}
                contentInsetAdjustmentBehavior="automatic"
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.8}
                ListFooterComponent={ListFooter}
                scrollEventThrottle={16}
            />
        </>
    );
};