import FavoriteItem from "@/components/FavoriteItem";
import { GradientBlur } from "@/components/GradientBlur";
import Filters, { OrderT } from "@/components/Screens/Favorite/Filters";
import { HeaderFavorite } from "@/components/Screens/Favorite/HeaderFavorite";
import { useBottomHeight } from "@/hooks/useBottomHeight";
import { auth } from "@/lib/firebase";
import { getFavoriteAnime } from "@/utils/firebase/userFavorites";
import { Button, Host, Image as UIImage } from "@expo/ui/swift-ui";
import { useHeaderHeight } from "@react-navigation/elements";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Platform, RefreshControl, StyleSheet, View } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const filterMapping = {
    showPlanned: 'planned',
    showCompleted: 'completed',
    showWatching: 'watching',
} as const;

const { width } = Dimensions.get('screen');


export default function FavoriteScreen() {
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const { colors, locations } = easeGradient({
        colorStops: {
            0: { color: 'black' },
            0.5: { color: 'rgba(0,0,0,0.9)' },
            1: { color: 'transparent' }
        },
    });

    const [userFavorites, setFav] = useState<any[]>([]);
    const [orderType, setOrderType] = useState<OrderT>("desc");
    const [page, setPage] = useState(1);

    const [openFilters, setOpenFilters] = useState(false);
    const [filterShow, setFilterShow] = useState({
        showPlanned: false,
        showCompleted: false,
        showWatching: false,
    });

    const [refreshing, setRefreshing] = useState(false);
    const firstRender = useRef(true);
    const [loading, setIsLoading] = useState<boolean>(false);
    const hasMore = useRef(true);

    const list = useRef<FlashListRef<number | null>>(null);

    const fetchFavorites = useCallback(async () => {
        if (!hasMore.current || !auth.currentUser) return;
        if (loading) return;

        const activeKey = Object.keys(filterShow).find(key => filterShow[key as keyof typeof filterShow]);
        const activeFilter = activeKey ? filterMapping[activeKey as keyof typeof filterMapping] : undefined;

        const show: "planned" | "completed" | "watching" | undefined =
            filterShow.showPlanned ? "planned" : filterShow.showCompleted ? "completed" : filterShow.showWatching ? "watching" : undefined;
        try {
            setIsLoading(true);
            console.log('fetch', show, orderType, page)
            const response = await getFavoriteAnime(auth.currentUser.uid, page, 25, orderType, activeFilter);
            if (response.length < 1) {
                hasMore.current = false;
            }
            setFav(prev => (page === 1 ? response : [...prev, ...response]));
            setPage(prev => prev + 1);

        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        } finally {
            setRefreshing(false);
            setIsLoading(false);
        }
    }, [page, orderType, filterShow, refreshing, loading]);


    useEffect(() => {
        setPage(0)
        setFav([]);
        hasMore.current = true;
        list.current?.scrollToTop({ animated: true });
        // fetchFavorites();
    }, [orderType, filterShow]);

    useEffect(() => {
        if (firstRender.current) {
            fetchFavorites();
            firstRender.current = false;
        }
    }, []);


    const modalOpacity = useSharedValue(0);

    useEffect(() => {
        modalOpacity.value = withTiming(openFilters ? 0.6 : 0, { duration: 300 });
    }, [openFilters]);

    const modalOpacityStyle = useAnimatedStyle(() => ({ opacity: modalOpacity.value }));

    const onRefresh = useCallback(() => {
        setPage(0);
        hasMore.current = true;
        setRefreshing(true);
        fetchFavorites();
    }, []);

    const handleRemoveFavorite = useCallback((id: string | number) => {
        setFav(prev => prev.filter(item => item.id !== id));
    }, []);

    const handleChangeShowFilter = useCallback((key: keyof typeof filterShow) => {
        const newFilters = {
            showPlanned: false,
            showCompleted: false,
            showWatching: false,
        };
        newFilters[key] = !filterShow[key];
        setFilterShow(newFilters);
    }, [filterShow]);

    const renderItem = useCallback(
        ({ item, index }: { item: any, index: number }) => (
            <FavoriteItem item={item} index={index} onRemove={() => handleRemoveFavorite(item.id)} />
        ),
        [handleRemoveFavorite]
    );

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    ...(Platform.Version >= '26.0' && {
                        header: () => (
                            <HeaderFavorite
                                rightIcon="line.3.horizontal.decrease"
                                onPress={() => setOpenFilters(true)}
                            />
                        ),
                    }),
                    headerRight: () => {
                        if (Platform.Version < '26.0')
                            return (
                                <Host style={{ width: 35, height: 35 }}>
                                    <Button onPress={() => setOpenFilters(true)}>
                                        <UIImage systemName="line.3.horizontal.decrease" size={22} color="white" />
                                    </Button>
                                </Host>
                            )
                        return null;
                    },
                }}
            />

            <Fragment>
                <GradientBlur
                    colors={colors}
                    locations={locations}
                    containerStyle={{
                        position: 'absolute',
                        top: 0,
                        zIndex: -1, width, height: insets.top * 2.5,
                    }}
                    tint="light"
                    blurIntensity={20}
                />
                <LinearGradient
                    colors={['black', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0)']}
                    style={[StyleSheet.absoluteFill, { width: '100%', height: insets.top * 3, zIndex: 0 }]}
                    pointerEvents='none'
                />
            </Fragment>

            {(loading && userFavorites.length < 1) ?
                (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={'small'} color={'white'} />
                    </View>
                ) : (
                    <FlashList
                        scrollEnabled={true}
                        ref={list}
                        data={userFavorites}
                        numColumns={3}
                        scrollIndicatorInsets={{
                            top: Platform.Version >= '26.0' ? headerHeight / 2 : undefined
                        }}
                        contentContainerStyle={{
                            ...(Platform.Version < '26.0' ? { paddingTop: headerHeight + 10 } : { paddingTop: headerHeight }),
                            ...(Platform.Version <= '26.0' && {
                                paddingBottom: useBottomHeight() + 20,
                            })
                        }}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderItem}
                        refreshing={refreshing}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                progressViewOffset={headerHeight}
                                tintColor="white"
                            />
                        }
                        onEndReachedThreshold={0.9}
                        onEndReached={fetchFavorites}
                        ListFooterComponent={loading ? <ActivityIndicator size={"large"} /> : null}
                    />
                )}

            <Filters
                isOpened={openFilters}
                onOpen={setOpenFilters}
                switchArr={[
                    { value: filterShow.showPlanned, label: 'В планах', type: 'showPlanned' },
                    { value: filterShow.showCompleted, label: 'Просмотренные', type: 'showCompleted' },
                    { value: filterShow.showWatching, label: 'Смотрю', type: 'showWatching' },
                ]}
                orderType={orderType}
                setOrderType={setOrderType}
                onSwitchValueChange={handleChangeShowFilter}
            />
        </View>
    );
};