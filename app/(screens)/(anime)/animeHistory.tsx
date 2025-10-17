import { ContinueWatching } from "@/components/ContinueWatching";
import { Skeleton } from "@/components/ui/Skeleton";
import { ThemedView } from "@/components/ui/ThemedView";
import { getLastAnime, updateAnimeHistory } from "@/lib/firebase/update/userLastAnime";
import { LastAnime, useUserStore } from "@/store/userStore";
import { useHeaderHeight } from "@react-navigation/elements";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "expo-router";
import { QueryDocumentSnapshot } from "firebase/firestore";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, Keyboard, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AnimeHistoryScreen() {
    const navigation = useNavigation();
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();

    const user = useUserStore(s => s.user);

    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [animeList, setAnimeList] = useState<LastAnime[]>([]);
    const [filtered, setFiltered] = useState<LastAnime[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchInitial = async () => {
            try {
                const res = await getLastAnime(user.uid, 10);

                setAnimeList(res.data);
                setLastDoc(res.lastDoc);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitial();
    }, [user]);

    const fetchNextPage = useCallback(async () => {
        if (!user || loadingMore || !lastDoc) return;
        setLoadingMore(true);
        try {
            const res = await getLastAnime(user.uid, 10, lastDoc);
            setAnimeList(prev => [...prev, ...res.data]);
            setLastDoc(res.lastDoc);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMore(false);
        }
    }, [user, lastDoc, loadingMore]);

    useEffect(() => {
        if (!searchText.trim()) {
            setFiltered([]);
            return;
        }

        const q = searchText.toLowerCase();
        const handler = setTimeout(() => {
            setFiltered(animeList.filter(a => a.title.toLowerCase().includes(q)));
        }, 200);

        return () => clearTimeout(handler);
    }, [searchText, animeList]);

    const handleUpdate = useCallback((id: number, watchedEpisodes: number) => {
        setAnimeList(prev => {
            const anime = prev.find(a => a.id === id);
            const next = prev.map(a => (a.id === id ? { ...a, watchedEpisodes } : a));
            if (anime && user) {
                updateAnimeHistory(user.uid, { ...anime, watchedEpisodes }, true).catch(console.error);
            }
            return next;
        });
    }, [user]);

    const renderItem = useCallback(({ item }: { item: LastAnime }) => (
        <Animated.View entering={FadeInDown} style={{ marginVertical: 5 }}>
            <ContinueWatching
                id={item.id}
                posterUrl={item.poster}
                title={item.title}
                totalEpisodes={item.totalEpisodes}
                watchedEpisodes={item.watchedEpisodes}
                onUpdate={handleUpdate}
                showHeader={false}
            />
        </Animated.View>
    ), [handleUpdate]);

    const SkeletonR = useMemo(() => {
        const fakeRows = new Array(5).fill(0);
        return (
            <View style={{ paddingHorizontal: 10, paddingBottom: insets.bottom }}>
                {fakeRows.map((_, idx) => (
                    <View key={idx} style={{ flexDirection: "row", marginBottom: 0 }}>
                        <View style={{ marginBottom: 10 }}>
                            <Skeleton width={Dimensions.get('screen').width - 20} height={130} radius={12} />
                        </View>
                    </View>
                ))}
            </View>
        );
    }, [headerHeight, insets.bottom]);

    useEffect(() => {
        navigation.setOptions({
            headerSearchBarOptions: {
                placeholder: "Поиск",
                hideWhenScrolling: false,
                cancelButtonText: 'Отмена',
                obscureBackground: true,
                onChangeText: (e: any) => {
                    const text = e?.nativeEvent?.text ?? e ?? '';
                    setSearchText(String(text));
                },
            }
        });
    }, [navigation, headerHeight]);

    const dataToRender = filtered.length > 0 ? filtered : animeList;

    return (
        <ThemedView style={{ flex: 1 }} darkColor="black" lightColor="white">
            {loading ? (
                SkeletonR
            ) : (
                <>
                    {dataToRender.length === 0 ? (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: insets.bottom }}>
                            <Text>История просмотра пустая</Text>
                        </View>
                    ) : (
                        <FlashList
                            data={dataToRender}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: insets.bottom }}
                            keyExtractor={(item) => `${item.id}`}
                            removeClippedSubviews
                            onEndReached={fetchNextPage}
                            onEndReachedThreshold={1}
                            onScroll={Keyboard.dismiss}
                            scrollEventThrottle={16}
                            scrollIndicatorInsets={{ top: 75 }}
                            contentInsetAdjustmentBehavior="automatic"
                        />
                    )}
                </>
            )}
        </ThemedView>
    );
};