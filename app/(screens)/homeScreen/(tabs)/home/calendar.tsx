import { getAnime } from '@/API/Yummy/getAnimeYummy';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useTheme } from '@/hooks/ThemeContext';
import { useBottomHeight } from '@/hooks/useBottomHeight';
import { useHeaderHeight } from '@react-navigation/elements';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    Pressable,
    SectionList,
    StyleSheet,
    View
} from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('screen');
const ITEM_MARGIN = 5;
const NUM_COLUMNS = 3;
const ITEM_WIDTH = (width - ITEM_MARGIN * 2 * NUM_COLUMNS) / NUM_COLUMNS;

const WEEK_DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

type Anime = {
    anime_id: number;
    title: string;
    episodes: {
        next_date: number;
    };
    poster: {
        fullsize: string;
        big: string;
        small: string;
        medium: string;
        huge: string;
        mega: string;
    },
};

type SectionType = {
    title: string;
    data: Anime[][];
};

export default function CalendarScreen() {
    const isDarkMode = useTheme().theme === 'dark';
    const headerHeight = useHeaderHeight();
    const bottomHeight = useBottomHeight();
    const [sections, setSections] = useState<SectionType[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSchedule = async () => {
        try {
            const res = await fetch('https://api.yani.tv/anime/schedule');
            const json = await res.json();
            const data: Anime[] = Array.isArray(json) ? json : json.response || [];
            const now = Math.floor(Date.now() / 1000);

            const scheduleByDay: Record<string, Anime[]> = {
                Понедельник: [],
                Вторник: [],
                Среда: [],
                Четверг: [],
                Пятница: [],
                Суббота: [],
                Воскресенье: [],
            };

            data.forEach(anime => {
                if (anime.episodes?.next_date && anime.episodes.next_date > now) {
                    const date = new Date(anime.episodes.next_date * 1000);
                    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
                    const dayName = WEEK_DAYS[dayIndex];
                    scheduleByDay[dayName].push(anime);
                }
            });

            const sectionsData: SectionType[] = WEEK_DAYS.map(day => {
                const items = scheduleByDay[day];
                const chunked: Anime[][] = [];
                for (let i = 0; i < items.length; i += NUM_COLUMNS) {
                    chunked.push(items.slice(i, i + NUM_COLUMNS));
                }
                return { title: day, data: chunked };
            }).filter(s => s.data.length > 0);

            setSections(sectionsData);
        } catch (e) {
            console.error(e);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading)
            fetchSchedule();
    }, []);

    const handleNavigate = async (id: number | string) => {
        const data = await getAnime(id);
        if (!data) return;

        const shikimoriId = data.response?.remote_ids?.shikimori_id;
        if (shikimoriId) {
            router.push({
                pathname: "/anime/[id]",
                params: { id: shikimoriId },
            });
        } else {
            console.warn("[YummyAPI] Нет Shikimori ID");
        }
    };

    const renderRow = (rowData: Anime[]) => (
        <Animated.View entering={FadeIn} style={styles.row}>
            {rowData.map(anime => (
                <Pressable
                    key={anime.title}
                    onPress={() => handleNavigate(anime.anime_id)}
                    style={styles.item}
                >
                    <View style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 5,
                    }}>
                        <Image
                            source={{ uri: `https:${anime.poster.big}` }}
                            style={styles.image}
                        />
                    </View>
                    <ThemedText darkColor='white' lightColor='black' numberOfLines={2} style={styles.title}>{anime.title}</ThemedText>
                </Pressable>
            ))}
        </Animated.View>
    );

    const BackgroundBlur = () => {
        if (Platform.Version < '26.0') {
            return (
                <BlurView
                    tint={isDarkMode ? 'dark' : 'systemChromeMaterialLight'}
                    intensity={100}
                    style={[StyleSheet.absoluteFillObject, {
                        flex: 1,
                        zIndex: 0,
                        top: headerHeight,
                    }]} />
            );
        }
        return null
    }

    if (loading) {
        return (
            <ThemedView darkColor='black' style={styles.center}>
                <BackgroundBlur />
                <ActivityIndicator size="large" />
            </ThemedView>
        );
    }

    return (
        <ThemedView darkColor='black' style={{ flex: 1 }}>
            <BackgroundBlur />
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.map(a => a.anime_id).toString()}
                renderItem={({ item }) => renderRow(item)}
                renderSectionHeader={({ section: { title } }) => (
                    <ThemedText lightColor='black' darkColor='white' style={styles.header}>{title}</ThemedText>
                )}
                stickySectionHeadersEnabled={false}
                contentInsetAdjustmentBehavior='automatic'
                contentContainerStyle={{ paddingBottom: bottomHeight }}
                scrollIndicatorInsets={{ bottom: bottomHeight }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => { setRefreshing(true); fetchSchedule() }}
                    />
                }
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 10,
        paddingHorizontal: 10
    },
    row: {
        flexDirection: 'row',
        marginBottom: 15
    },
    item: {
        width: ITEM_WIDTH,
        marginHorizontal: ITEM_MARGIN,
        alignItems: 'center',
    },
    image: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH * 1.5,
        borderRadius: 12,
        backgroundColor: '#eee',
    },
    title: {
        textAlign: 'left',
        marginTop: 5,
    }
});
