import { getAnime } from '@/API/Yummy/getAnimeYummy';
import { getYummySchedule, ScheduleAnime, ScheduleSectionType } from '@/API/Yummy/getSchedule';
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
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('screen');
const ITEM_MARGIN = 5;
const NUM_COLUMNS = 3;
const ITEM_WIDTH = (width - ITEM_MARGIN * 2 * NUM_COLUMNS) / NUM_COLUMNS;

export default function CalendarScreen() {
    const isDarkMode = useTheme().theme === 'dark';
    const headerHeight = useHeaderHeight();
    const bottomHeight = useBottomHeight();
    const [sections, setSections] = useState<ScheduleSectionType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getYummySchedule()
            .then((r) => setSections(r))
            .finally(() => setLoading(false))
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

    const renderRow = (rowData: ScheduleAnime[]) => (
        <Animated.View entering={FadeIn} style={styles.row}>
            {rowData.map(anime => (
                <Pressable
                    key={anime.title}
                    onPress={() => handleNavigate(anime.anime_id)}
                    style={({ pressed }) => ([styles.item, { opacity: pressed ? 0.9 : 1 }])}
                >
                    <View style={styles.shadow}>
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
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    }
});
