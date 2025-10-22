import { GradientBlur } from "@/components/GradientBlur";
import FavoriteItem from "@/components/Screens/Favorite/FavoriteItem";
import Filters, { OrderT } from "@/components/Screens/Favorite/Filters";
import SearchFavorite, { SearchFavoriteHandle } from "@/components/Screens/Favorite/SeacrchFavorite";
import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/hooks/ThemeContext";
import { useBottomHeight } from "@/hooks/useBottomHeight";
import { auth } from "@/lib/firebase";
import { getFavoriteAnime } from "@/lib/firebase/userFavorites";
import { Button, Host, HStack, Image as UIImage } from "@expo/ui/swift-ui";
import { useHeaderHeight } from "@react-navigation/elements";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    RefreshControl,
    StyleSheet,
    View
} from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("screen");

const GRADIENT_DARK_COLOR = [
    "black",
    "rgba(0,0,0,0.5)",
    "rgba(0,0,0,0)"
] as const;

const GRADIENT_LIGHT_COLOR = [
    "white",
    "rgba(255, 255, 255, 0.5)",
    "rgba(255, 255, 255, 0)",
] as const;

const PAGE_SIZE = 25;

const filterMapping = {
    showPlanned: "planned",
    showCompleted: "completed",
    showWatching: "watching",
} as const;

export default function FavoriteScreen() {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const bottomHeight = useBottomHeight();

    const { colors, locations } = easeGradient({
        colorStops: {
            0: { color: "black" },
            0.5: { color: "rgba(0,0,0,0.9)" },
            1: { color: "transparent" },
        },
    });

    const [userFavorites, setFavorites] = useState<any[]>([]);
    const [orderType, setOrderType] = useState<OrderT>("desc");
    const [activeFilter, setActiveFilter] = useState<
        "planned" | "completed" | "watching" | undefined
    >(undefined);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openFilters, setOpenFilters] = useState(false);
    const [searchMode, setSearchMode] = useState(false);
    const inputRef = useRef<SearchFavoriteHandle>(null);
    const page = useRef(1);
    const hasMore = useRef(true);
    const firstRender = useRef(true);
    const listRef = useRef<FlashListRef<number | null>>(null);

    const fetchFavorites = useCallback(
        async (reset = false) => {
            if (loading || !auth.currentUser || (!hasMore.current && !reset)) return;

            try {
                setLoading(true);
                if (reset) {
                    page.current = 1;
                    hasMore.current = true;
                }

                const response = await getFavoriteAnime(
                    auth.currentUser.uid,
                    page.current,
                    PAGE_SIZE,
                    orderType,
                    activeFilter
                );

                if (response.length < PAGE_SIZE) {
                    hasMore.current = false;
                }

                setFavorites((prev) =>
                    reset ? response : [...prev, ...response.filter((i) => !!i)]
                );
                page.current += 1;
            } catch (error) {
                console.error("Failed to fetch favorites:", error);
            } finally {
                setRefreshing(false);
                setLoading(false);
            }
        },
        [orderType, activeFilter, loading]
    );

    useEffect(() => {
        if (firstRender.current) {
            fetchFavorites(true);
            firstRender.current = false;
        }
    }, [fetchFavorites]);

    useEffect(() => {
        if (!firstRender.current) {
            console.log('scrol')
            listRef.current?.scrollToOffset({ offset: 0, animated: false });
            fetchFavorites(true);
        }
    }, [orderType, activeFilter]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchFavorites(true);
    }, [fetchFavorites]);

    const handleRemoveFavorite = useCallback((id: string | number) => {
        setFavorites((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const handleChangeShowFilter = (key: keyof typeof filterMapping) => {
        setActiveFilter((prev) =>
            prev === filterMapping[key] ? undefined : filterMapping[key]
        );
    };

    const renderItem = useCallback(
        ({ item, index }: { item: any; index: number }) => {
            const handleNavigate = async () => {
                if (searchMode) {
                    inputRef.current?.blur();
                    setSearchMode(false);
                }

                router.push({
                    pathname: "/(screens)/(anime)/[id]",
                    params: { id: item.id, status: item.status }
                })
            }
            return (
                <FavoriteItem
                    item={item}
                    index={index}
                    handleNavigate={handleNavigate}
                    onRemove={() => handleRemoveFavorite(item.id)}
                    inSearch={searchMode}
                />
            )
        },
        [handleRemoveFavorite, searchMode]
    );

    if (loading && userFavorites.length === 0) {
        return (
            <ThemedView
                darkColor="black"
                lightColor="white"
                style={styles.centeredView}
            >
                <ActivityIndicator size="small" color="white" />
            </ThemedView>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <Host style={styles.headerButtons}>
                            <HStack spacing={15}>
                                <Button onPress={() => setOpenFilters(true)}>
                                    <UIImage
                                        systemName="line.3.horizontal.decrease"
                                        size={22}
                                        color={isDarkMode ? "white" : "black"}
                                    />
                                </Button>
                                <Button onPress={() => setSearchMode(!searchMode)}>
                                    <UIImage
                                        systemName={!searchMode ? 'magnifyingglass' : 'xmark'}
                                        size={22}
                                        color={isDarkMode ? "white" : "black"}
                                    />
                                </Button>
                            </HStack>
                        </Host>
                    ),
                }}
            />

            <GradientBlur
                colors={colors}
                locations={locations}
                containerStyle={{
                    position: "absolute",
                    top: 0,
                    zIndex: 1,
                    width,
                    height: insets.top * 2.5,
                }}
                tint="light"
                blurIntensity={20}
            />

            <LinearGradient
                colors={isDarkMode ? GRADIENT_DARK_COLOR : GRADIENT_LIGHT_COLOR}
                style={[StyleSheet.absoluteFill, { height: insets.top * 3, zIndex: 2 }]}
                pointerEvents="none"
            />

            <FlashList
                ref={listRef}
                data={userFavorites}
                numColumns={3}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{
                    paddingTop: 10,
                    paddingBottom: bottomHeight,
                }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                refreshControl={
                    <>
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="white"
                            colors={['white']}
                            progressViewOffset={Platform.Version < '26.0' ? headerHeight : headerHeight / 4}
                        />
                    </>
                }
                onEndReachedThreshold={0.8}
                onEndReached={() => fetchFavorites(false)}
                ListFooterComponent={
                    loading ? (
                        <ActivityIndicator size="small" style={{ marginVertical: 10 }} />
                    ) : null
                }
            />

            <Filters
                isOpened={openFilters}
                onOpen={setOpenFilters}
                switchArr={[
                    { value: activeFilter === "planned", label: "В планах", type: "showPlanned" },
                    { value: activeFilter === "completed", label: "Просмотренные", type: "showCompleted" },
                    { value: activeFilter === "watching", label: "Смотрю", type: "showWatching" },
                ]}
                orderType={orderType}
                setOrderType={setOrderType}
                onSwitchValueChange={handleChangeShowFilter}
            />
            <SearchFavorite ref={inputRef} closeSearch={setSearchMode} searchMode={searchMode} renderItem={renderItem} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerButtons: {
        width: 85,
        height: 35
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
});
