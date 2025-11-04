import { ContinueWatching } from '@/components/ContinueWatching';
import { GradientBlur } from '@/components/GradientBlur';
import Recommendations from '@/components/HomeRecommendations';
import List from '@/components/List';
import LatestUpdates from '@/components/List/LatestUpdates';
import { Page } from '@/components/Screens/Settings/Page';
import BackgroundBlur from '@/components/ui/BackgroundBlur';
import { Skeleton } from '@/components/ui/Skeleton';
import { useHomeScreenData } from '@/hooks/homeData/useHomeScreenData';
import { useTheme } from '@/hooks/ThemeContext';
import { useBottomHeight } from '@/hooks/useBottomHeight';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useCallback } from 'react';
import { Dimensions, Platform, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { easeGradient } from 'react-native-easing-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('screen');
const ITEM_WIDTH = width / 2.5;
const IMAGE_WIDTH = width / 2.5 - 10;
const IMAGE_HEIGHT = height / 4.05;

type ListDataT = {
    typeRequest: "anons" | "top_rated" | "on_screens" | "movie";
    headerText: string;
    data: any;
    render: boolean;
}

const isIOS_26 = Platform.Version >= '26.0';

export default function HomeScreen() {
    const isDarkMode = useTheme().theme === 'dark';
    const insets = useSafeAreaInsets();
    const bottomTabHeight = useBottomHeight();
    const headerHeight = useHeaderHeight();
    const { colors, locations } = easeGradient({
        colorStops: {
            0: { color: 'black' },
            0.5: { color: 'rgba(0,0,0,0.9)' },
            1: { color: 'transparent' }
        },
    });

    const GradientColorsDark = ['black', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0)'] as const;
    const GradientColorsLight = ['white', 'rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0)'] as const;

    const { animeList, loading, lastUpdates, refreshing, lastAnime, handleLastAnimeUpdate, homeRecs, setRefreshing } = useHomeScreenData();

    const ListData: ListDataT[] =
        [
            {
                typeRequest: "top_rated",
                headerText: "Топ рейтинга",
                data: animeList.topRated,
                render: true,
            },
            {
                typeRequest: "on_screens",
                headerText: "Сейчас на экранах",
                data: animeList.onScreen,
                render: true,
            },
            {
                typeRequest: "movie",
                headerText: "Фильмы",
                data: animeList.films,
                render: true,
            },
        ];

    const SkeletonR = useCallback(() => {
        const renderRow = (key: number) => (
            <View key={key} style={{ flexDirection: "row" }}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <View key={i} style={{ paddingRight: 10 }}>
                        <Skeleton width={ITEM_WIDTH} height={IMAGE_HEIGHT} radius={12} />
                    </View>
                ))}
            </View>
        );

        return (
            <View style={{ paddingTop: 120, paddingHorizontal: 10, gap: 10 }}>
                <Skeleton width={100} height={25} radius={8} />
                {renderRow(0)}
                <View style={{ paddingVertical: 10 }}>
                    <Skeleton width={'100%'} height={IMAGE_HEIGHT / 1.5} radius={12} shimmerWidth={130} />
                </View>
                <Skeleton width={100} height={25} radius={8} />
                {renderRow(1)}
            </View>
        );
    }, []);

    if (loading) {
        return (
            <>
                <BackgroundBlur />
                <SkeletonR />
            </>
        );
    };

    return (
        <Page>
            <BackgroundBlur />
            {isIOS_26 &&
                <GradientBlur
                    colors={colors}
                    locations={locations}
                    containerStyle={{
                        position: 'absolute',
                        top: 0,
                        zIndex: 1,
                        width,
                        height: insets.top
                    }}
                    tint="light"
                    blurIntensity={20}
                />
            }

            <ScrollView
                contentContainerStyle={{
                    paddingTop: !isIOS_26 ? 10 : 0,
                    paddingBottom: bottomTabHeight,
                    gap: 10,
                }}
                contentInsetAdjustmentBehavior='automatic'
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        size={32}
                        tintColor={'white'}
                        onRefresh={() => setRefreshing(true)}
                        style={{ zIndex: 10000 }}
                    />
                }
            >

                <Recommendations data={homeRecs} />

                <LatestUpdates
                    updates={lastUpdates}
                    headerTextStyle={styles.headerList}
                    containerStye={{
                        paddingTop: 10,
                        paddingHorizontal: 5,
                        marginBottom: 20,
                    }}
                    imageContainer={styles.imageContainer}
                    imageStyle={styles.imageStyle}
                    imageTextTitle={styles.imageTextTitle}
                    imageTextVoice={styles.imageTextVoice}
                    episodeTextStyle={styles.episodeTextStyle}
                />

                {lastAnime.length &&
                    <Animated.View entering={FadeIn.delay(300).duration(750)} style={{ marginBottom: 10 }}>
                        <ContinueWatching
                            title={lastAnime[0].title}
                            posterUrl={lastAnime[0].poster}
                            totalEpisodes={lastAnime[0].totalEpisodes}
                            watchedEpisodes={lastAnime[0].watchedEpisodes}
                            id={lastAnime[0].id}
                            onUpdate={handleLastAnimeUpdate}
                        />
                    </Animated.View>
                }

                <View style={{ paddingTop: 10 }}>
                    {ListData.map((props) => {
                        return (
                            <List
                                key={props.typeRequest}
                                textStyle={styles.headerList}
                                typeRequest={props.typeRequest}
                                headerText={props.headerText}
                                data={props.data}
                                imageContainer={styles.imageContainer}
                                imageStyle={styles.imageStyle}
                            />
                        )
                    })}
                </View>
            </ScrollView>
        </Page>
    );
};

const styles = StyleSheet.create({
    headerList: {
        fontSize: 18,
        fontWeight: '600'
    },
    imageContainer: {
        width: ITEM_WIDTH,
        alignItems: 'center'
    },
    imageStyle: {
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        borderRadius: 10,
        backgroundColor: "#1e1e1e",
    },
    imageTextTitle: {
        maxWidth: IMAGE_WIDTH,
        minWidth: IMAGE_WIDTH,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'left',
        paddingTop: 5,
        paddingLeft: 5
    },
    imageTextVoice: {
        color: 'gray',
        maxWidth: IMAGE_WIDTH,
        minWidth: IMAGE_WIDTH,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'left',
        paddingTop: 5,
        paddingLeft: 5
    },
    episodeTextStyle: {
        position: 'absolute',
        backgroundColor: '#1e1e1e',
        padding: 4,
        borderRadius: 6,
        top: 6,
        shadowColor: 'black',
        shadowOpacity: 0.85,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        fontWeight: '500'
    },
})

