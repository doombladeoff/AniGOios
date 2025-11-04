import { CardPoster } from "@/components/List/Item/CardPoster";
import { Skeleton } from "@/components/ui/Skeleton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { fetchLastUpdates } from "@/hooks/homeData/fetchLastUpdates";
import { useTheme } from "@/hooks/ThemeContext";
import { ContentUnavailableView, Host } from "@expo/ui/swift-ui";
import { background, foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { useHeaderHeight } from "@react-navigation/elements";
import { FlashList } from "@shopify/flash-list";
import { router, useNavigation } from "expo-router";
import { MaterialObject } from "kodikwrapper";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const { width, height } = Dimensions.get("screen");
const ITEM_WIDTH = width / 3 - 10;
const HEADER_HEIGHT = 100;
const TITLE_HEIGHT = 50;
const VISIBLE_ROWS = 4;
const availableHeight = height - (HEADER_HEIGHT + TITLE_HEIGHT);
const ITEM_HEIGHT = availableHeight / VISIBLE_ROWS;

const chunk = <T,>(arr: T[], size: number): T[][] => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );
};

const normalize = (text?: string) =>
    text
        ?.toLocaleLowerCase("ru-RU")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim() ?? "";

const groupRows = (animes: MaterialObject[]): MaterialObject[][] => {
    return chunk(animes, 3);
};

export default function AnimeLastUpdatesScreen() {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";
    const navigation = useNavigation();
    const headerHeight = useHeaderHeight();

    const [data, setData] = useState<any[]>([]);
    const [queryText, setQueryText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const isFetched = useRef(false);

    useEffect(() => {
        if (isFetched.current) return;
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetchLastUpdates({ type: "full", limit: 40 });
                if ("result1" in res) {
                    const formatted = [
                        "Сегодня",
                        ...groupRows(res.result1),
                        "Вчера",
                        ...groupRows(res.result2),
                    ];
                    setData(formatted);
                }
                isFetched.current = true;
            } catch (e) {
                console.log(e);
            } finally {
                setTimeout(() => setIsLoading(false), 700);
            }
        })();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerSearchBarOptions: {
                placeholder: "Поиск",
                hideWhenScrolling: false,
                cancelButtonText: 'Отмена',
                clearText: 'Очистить',
                tintColor: isDarkMode ? 'white' : 'black',
                ...(Platform.Version < '26.0' && { barTintColor: isDarkMode ? 'rgba(90,90,90,0.5)' : 'white' }),
                textColor: isDarkMode ? 'white' : 'black',
                obscureBackground: true,
                onChangeText: (e: any) => setQueryText(e.nativeEvent.text),
            },
        });
    }, [navigation, isDarkMode]);

    const filtered = useMemo(() => {
        if (!queryText.trim()) return data;
        const q = normalize(queryText);

        const result: any[] = [];
        let currentTitle: string | null = null;
        let buffer: MaterialObject[] = [];

        for (const item of data) {
            if (typeof item === "string") {
                if (currentTitle && buffer.length > 0) {
                    const chunks = chunk(buffer, 3);
                    result.push(currentTitle, ...chunks);
                    buffer = [];
                }
                currentTitle = item;
            } else if (Array.isArray(item)) {
                const matched = item.filter(
                    (a) =>
                        normalize(a?.title).includes(q) ||
                        normalize(a?.title_orig).includes(q)
                );
                if (matched.length > 0) buffer.push(...matched);
            }
        }

        if (currentTitle && buffer.length > 0) {
            const chunks = chunk(buffer, 3);
            result.push(currentTitle, ...chunks);
        }

        return result;
    }, [queryText, data]);


    const handleNavigate = useCallback((id?: number) => {
        if (id) router.push({ pathname: "/(screens)/anime/[id]", params: { id } });
    }, []);

    const SkeletonR = () => (
        <ThemedView darkColor="black" lightColor="white" style={{ flex: 1, paddingTop: Platform.Version >= '26.0' ? headerHeight : 0 }}>
            <Skeleton
                width={ITEM_WIDTH}
                height={20}
                radius={6}
                style={{ marginVertical: 8, marginHorizontal: 5 }}
            />
            {Array.from({ length: 3 }).map((_, row) => (
                <View key={row} style={{ flexDirection: "row", marginBottom: 10 }}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <View key={i} style={{ margin: 5 }}>
                            <Skeleton width={ITEM_WIDTH} height={200} radius={12} />
                            <Skeleton
                                width={ITEM_WIDTH}
                                height={20}
                                radius={6}
                                style={{ marginTop: 8 }}
                            />
                        </View>
                    ))}
                </View>
            ))}
        </ThemedView>
    );

    const renderRow = ({ item }: { item: MaterialObject[] }) => (
        <Animated.View entering={FadeInDown} style={styles.row}>
            {item.map((anime, i) =>
                anime ? (
                    <CardPoster
                        key={`${anime.shikimori_id}-${anime.last_episode}-${anime.translation?.id}-${i}`}
                        img={anime.material_data?.poster_url || ''}
                        imgStyle={styles.img}
                        transition={700}
                        imgFit="cover"
                        imgCachePolicy="disk"
                        imgPriority="high"
                        container={{ marginHorizontal: 5 }}
                        onPress={() => handleNavigate(anime.shikimori_id)}
                    >
                        <Text style={styles.episode}>Серия {anime.last_episode}</Text>
                        <ThemedText style={styles.title} numberOfLines={2}>
                            {anime.title}
                        </ThemedText>
                        <Text style={styles.translationTitle} numberOfLines={1}>
                            {anime.translation?.title}
                        </Text>
                    </CardPoster>
                ) : (
                    <View key={i} style={[styles.img, { marginHorizontal: 5 }]} />
                )
            )}
        </Animated.View>
    );

    const source = queryText ? filtered : data;
    const totalAnimes = source.reduce(
        (acc, item) => (Array.isArray(item) ? acc + item.length : acc),
        0
    );

    if (queryText && !isLoading && totalAnimes === 0) {
        return (
            <Host matchContents style={{ flex: 1 }}>
                <ContentUnavailableView
                    title="Ничего не найдено"
                    systemImage="magnifyingglass"
                    modifiers={[foregroundStyle(isDarkMode ? "white" : "black"), background(isDarkMode ? 'black' : 'white')]}
                />
            </Host>
        );
    };

    if (isLoading) return <SkeletonR />;

    return (
        <FlashList
            data={source}
            style={{ flex: 1, backgroundColor: isDarkMode ? "black" : "white" }}
            contentInsetAdjustmentBehavior="automatic"
            renderItem={({ item }) =>
                typeof item === "string" ? (
                    <ThemedText style={styles.sectionTitle}>{item}</ThemedText>
                ) : (
                    renderRow({ item })
                )
            }
            getItemType={(item) =>
                typeof item === "string" ? "sectionHeader" : "row"
            }
        />
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        padding: 15,
    },
    row: {
        flexDirection: "row",
        marginBottom: 10,
    },
    img: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        borderRadius: 16,
        backgroundColor: "#1e1e1e",
    },
    episode: {
        position: "absolute",
        color: "white",
        backgroundColor: "#1e1e1e",
        padding: 4,
        borderRadius: 6,
        top: 6,
        alignSelf: "center",
        fontWeight: "500",
        zIndex: 2,
    },
    title: {
        width: ITEM_WIDTH,
        fontSize: 14,
        paddingLeft: 5,
    },
    translationTitle: {
        color: "gray",
        width: ITEM_WIDTH,
        fontSize: 12,
        paddingLeft: 5,
    },
});