import { ContinueWatching } from '@/components/ContinueWatching';
import { GradientBlur } from '@/components/GradientBlur';
import Recommendations from '@/components/HomeRecommendations';
import List from '@/components/List';
import LatestUpdates from '@/components/List/LatestUpdates';
import { Page } from '@/components/Page';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useHomeScreenData } from '@/hooks/homeData/useHomeScreenData';
import { useBottomHeight } from '@/hooks/useBottomHeight';
import { useHeaderHeight } from '@react-navigation/elements';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { Fragment, useCallback } from 'react';
import { Dimensions, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { easeGradient } from 'react-native-easing-gradient';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
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

const Header = () => {
    if (Platform.Version >= '26.0')
        return (
            <View style={{ zIndex: 100, position: 'absolute', top: 60, width: '100%', paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Animated.View entering={FadeInUp.delay(1000)}>
                    <View>
                        <Text style={{ color: 'white', fontSize: 26, fontWeight: '800' }}>AniGO</Text>
                    </View>
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(1000)}>
                    <Button
                        width={35}
                        height={35}
                        onPressBtn={() => router.push({ pathname: '/favorite' })}
                        iconName='bookmark.fill'
                        iconSize={32}
                        iconColor='orange'
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                    />
                </Animated.View>
            </View>
        )
    return null;
}

export default function HomeScreen() {
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const bottomTabHeight = useBottomHeight();
    const { colors, locations } = easeGradient({
        colorStops: {
            0: { color: 'black' },
            0.5: { color: 'rgba(0,0,0,0.9)' },
            1: { color: 'transparent' }
        },
    });

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
            <View style={{ paddingTop: 100, paddingHorizontal: 10, gap: 10 }}>
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
        return <SkeletonR />
    }

    return (
        <Page>
            <Fragment>
                <GradientBlur
                    colors={colors}
                    locations={locations}
                    containerStyle={{
                        position: 'absolute',
                        top: 0,
                        zIndex: 1, width, height: insets.top * 2.5,
                    }}
                    tint="light"
                    blurIntensity={20}
                />
                <LinearGradient
                    colors={['black', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0)']}
                    style={[StyleSheet.absoluteFill, { width: '100%', height: insets.top * 2, zIndex: 2 }]}
                    pointerEvents='none'
                />

                <Header />
            </Fragment>

            <ScrollView
                contentContainerStyle={{
                    paddingTop: Platform.Version < '26.0' ? 10 : 0,
                    paddingBottom: bottomTabHeight,
                    gap: 15
                }}
                contentInsetAdjustmentBehavior='automatic'
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        progressViewOffset={headerHeight}
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
                    containerStye={{ paddingTop: 10, paddingHorizontal: 5, marginBottom: 20 }}
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

                <View style={{ gap: 30 }}>
                    {ListData.map((props, idx) => {
                        if (props.render)
                            return (
                                <List
                                    key={props.typeRequest}
                                    useContextMenu
                                    textStyle={styles.headerList}
                                    typeRequest={props.typeRequest}
                                    headerText={props.headerText}
                                    data={props.data}
                                    imageContainer={styles.imageContainer}
                                    imageStyle={styles.imageStyle}
                                />
                            )
                        return null
                    })}
                </View>
            </ScrollView>
        </Page>
    );
};

const styles = StyleSheet.create({
    headerList: {
        color: 'white',
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
        color: 'white',
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
        color: 'white',
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

