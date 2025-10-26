import { getAnimeList } from '@/API/Shikimori/RequestAnime';
import { AnimeFields } from '@/API/Shikimori/RequestFields.type';
import {
    KindShiki,
    OrderEnum,
    RequestProps,
} from '@/API/Shikimori/RequestInterfaces.interfaces';
import { GradientBlur } from '@/components/GradientBlur';
import List from '@/components/List';
import { Skeleton } from '@/components/ui/Skeleton';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useTheme } from '@/hooks/ThemeContext';
import { useBottomHeight } from '@/hooks/useBottomHeight';
import { GlassView } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    View,
} from 'react-native';
import { easeGradient } from 'react-native-easing-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('screen');
const ITEM_WIDTH = width / 3 - 10;

const baseParams: RequestProps = {
    limit: 24,
    order: OrderEnum.ranked,
    duration: ['D', 'F'],
    rating: ['pg_13', 'r', 'r_plus'],
    score: 5
} as const;

const requestConfigs: Record<string, RequestProps> = {
    top_rated: {
        kind: [KindShiki.tv, KindShiki.ona],
        status: ['released'],
        ...baseParams,
    },
    on_screens: {
        kind: [KindShiki.tv, KindShiki.ona],
        status: ['ongoing'],
        ...baseParams,
    },
    movie: {
        kind: [KindShiki.movie],
        status: ['released', 'ongoing', 'latest'],
        ...baseParams,
    },
    anons: {
        kind: [KindShiki.tv, KindShiki.movie],
        status: ['anons'],
        ...baseParams,
    },
};

const requestFields: AnimeFields = {
    malId: true,
    poster: { main2xUrl: true, originalUrl: true, mainUrl: true },
    score: true,
    russian: true,
};

const GRADINET_DARK = [
    'black',
    'rgba(0,0,0,0.75)',
    'rgba(0,0,0,0.6)',
    'rgba(0,0,0,0.3)',
    'rgba(0,0,0,0)',
] as const;
const GRADINET_WHITE = [
    'white',
    'rgba(255,255,255,0.75)',
    'rgba(255,255,255,0.6)',
    'rgba(255,255,255,0.4)',
    'rgba(255,255,255,0)',
] as const;

export default function AnimeListScreen() {
    const { typeRequest, headerText } = useLocalSearchParams<{
        typeRequest: string;
        headerText: string;
    }>();
    const isDarkMode = useTheme().theme === 'dark';

    const bottomHeight = useBottomHeight();
    const insets = useSafeAreaInsets();
    const { colors, locations } = easeGradient({
        colorStops: {
            0: { color: 'black' },
            0.5: { color: 'rgba(0,0,0,0.9)' },
            1: { color: 'transparent' },
        },
    });

    const [animeList, setAnimeList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentPage = useRef(1);

    const params = useMemo(
        () => requestConfigs[typeRequest ?? ''] ?? null,
        [typeRequest]
    );

    const fetchAnime = useCallback(
        async (page = 1, append = false) => {
            if (!params) return;

            try {
                if (!append) {
                    setLoading(true);
                    setError(null);
                    setHasMore(true);
                    currentPage.current = 1;
                } else {
                    setFetchingMore(true);
                }

                const res = await getAnimeList(
                    { ...params, page },
                    requestFields,
                );

                if (!Array.isArray(res) || res.length === 0) {
                    if (page === 1) setAnimeList([]);
                    setHasMore(false);
                    return;
                }

                setAnimeList((prev) => (append ? [...prev, ...res] : res));
            } catch (err: any) {
                console.error('fetchAnime error:', err);
                setError('Ошибка загрузки данных');
            } finally {
                setLoading(false);
                setFetchingMore(false);
            }
        },
        [params]
    );

    useEffect(() => {
        fetchAnime(1, false);
    }, [fetchAnime]);

    const handleEndReached = useCallback(() => {
        if (fetchingMore || !hasMore) return;
        currentPage.current += 1;
        fetchAnime(currentPage.current, true);
    }, [fetchAnime, fetchingMore, hasMore]);

    const SkeletonGrid = () => (
        <View style={{ paddingTop: 100 }}>
            {Array.from({ length: 5 }).map((_, rowIdx) => (
                <View key={rowIdx} style={{ flexDirection: 'row' }}>
                    {Array.from({ length: 3 }).map((__, colIdx) => (
                        <View key={colIdx} style={{ padding: 5 }}>
                            <Skeleton width={ITEM_WIDTH} height={200} radius={12} />
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );

    if (loading && currentPage.current === 1) {
        return (
            <ThemedView darkColor='black' lightColor='white' style={{ flex: 1 }}>
                <SkeletonGrid />
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView
                darkColor='black'
                lightColor='white'
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ThemedText>{error}</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView darkColor='black' lightColor='white' style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <GlassView glassEffectStyle='regular' style={{ borderRadius: 12 }}>
                            <ThemedText
                                style={{ padding: 8, fontSize: 18, fontWeight: '600' }}
                            >
                                {headerText}
                            </ThemedText>
                        </GlassView>
                    ),
                }}
            />

            <LinearGradient
                colors={isDarkMode ? GRADINET_DARK : GRADINET_WHITE}
                style={[
                    StyleSheet.absoluteFill,
                    { width: '100%', height: insets.top * 2.35, zIndex: 200 },
                ]}
                pointerEvents='none'
            />
            <GradientBlur
                containerStyle={{
                    position: 'absolute',
                    top: 0,
                    zIndex: 2,
                    width,
                    height: insets.top * 2.35,
                }}
                locations={locations as [number, number, ...number[]]}
                colors={colors as [string, string, ...string[]]}
                tint='regular'
                blurIntensity={20}
            />

            <List
                showHeader={false}
                horizontal={false}
                numColumns={3}
                headerText='Аниме'
                typeRequest={typeRequest as
                    | 'movie'
                    | 'anons'
                    | 'top_rated'
                    | 'on_screens'}
                data={animeList}
                contentInsetAdjustmentBehavior='automatic'
                contentContainerStyle={{
                    paddingTop: 0,
                    paddingBottom: bottomHeight,
                }}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.7}
                removeClippedSubviews
                ListFooterComponent={
                    fetchingMore ? (
                        <ActivityIndicator
                            size={28}
                            style={{ paddingVertical: 24 }}
                            color='white'
                        />
                    ) : null
                }
            />
        </ThemedView>
    );
}
