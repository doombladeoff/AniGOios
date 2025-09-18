import { ContinueWatching } from "@/components/ContinueWatching";
import { GradientBlur } from "@/components/GradientBlur";
import Input from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { LastAnime, useUserStore } from "@/store/userStore";
import { getLastAnime, updateAnimeHistory } from "@/utils/firebase/update/userLastAnime";
import { useHeaderHeight } from "@react-navigation/elements";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Keyboard, StyleSheet, View } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AnimeHistoryScreen() {
    const headeHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const { colors, locations } = easeGradient({
        colorStops: {
            0: { color: 'black' },
            0.5: { color: 'rgba(0,0,0,0.9)' },
            1: { color: 'transparent' }
        },
    });

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
                setTimeout(() => setLoading(false), 700);
            }
        };

        fetchInitial();
    }, [user]);

    const fetchNextPage = async () => {
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
    };

    useEffect(() => {
        if (!searchText || searchText.length === 0) {
            return setFiltered([]);
        }

        const handler = setTimeout(() => {
            console.log(searchText)
            const res = animeList.filter(anime =>
                anime.title.toLowerCase().includes(searchText.toLowerCase())
            );
            setFiltered(res);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchText]);

    const handleUpdate = (id: number, watchedEpisodes: number) => {
        setAnimeList(prev =>
            prev.map(anime =>
                anime.id === id ? { ...anime, watchedEpisodes } : anime
            )
        );

        const anime = animeList.find(a => a.id === id);
        if (anime && user) {
            updateAnimeHistory(user.uid, { ...anime, watchedEpisodes }, true)
                .catch(console.error);
        }
    };


    const renderItem = ({ item }: { item: LastAnime }) => (
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
    );

    const SkeletonR = () => {
        const fakeRows = new Array(5).fill(0);

        return (
            <View style={{ paddingTop: headeHeight * 1.75, paddingHorizontal: 10 }}>
                {fakeRows.map((_, idx) => (
                    <View key={idx} style={{ flexDirection: "row", marginBottom: 0 }}>
                        {new Array(1).fill(0).map((__, i) => (
                            <View key={i} style={{ marginBottom: 10 }}>
                                <Skeleton width={Dimensions.get('screen').width - 20} height={130} radius={12} />
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    const handleChangeText = useCallback((text: string) => {
        setSearchText(text);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <GradientBlur
                containerStyle={{
                    position: 'absolute',
                    top: 0,
                    zIndex: 2, width: '100%', height: insets.top * 2.5,
                }}
                locations={locations as [number, number, ...number[]]}
                colors={colors as [string, string, ...string[]]}
                tint="regular"
                blurIntensity={20}
            />
            <LinearGradient
                colors={['black', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0)']}
                style={[StyleSheet.absoluteFill, { width: '100%', height: insets.top * 2, zIndex: 200 }]}
                pointerEvents='none'
            />

            <Input
                initialValue=''
                onSearch={(text) => { handleChangeText(text) }}
                containerStyle={{
                    position: "absolute",
                    top: headeHeight + 10,
                    left: 10,
                    right: 10,
                    zIndex: 9999,
                    shadowColor: "#000",
                    shadowOpacity: 0.75,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 8 },
                }}
            />

            {loading ? (
                <SkeletonR />
            ) : (
                <FlashList
                    data={filtered.length > 0 ? filtered : animeList}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingTop: headeHeight * 1.75, paddingHorizontal: 10, paddingBottom: headeHeight / 2 }}
                    keyExtractor={(item) => `${item.id}`}
                    removeClippedSubviews
                    onEndReached={fetchNextPage}
                    onEndReachedThreshold={1}
                    onScroll={Keyboard.dismiss}
                    scrollEventThrottle={16}
                    scrollIndicatorInsets={{top: 75}}
                />
            )}
        </View>
    )
}