import { ContextMenu } from "@/components/ContextComponent";
import { GradientBlur } from "@/components/GradientBlur";
import AnimeItem from "@/components/Screens/Search/AnimeItem";
import { EmptyPlaceholder } from "@/components/Screens/Search/EmptyPlaceholder";
import { ModalFilter } from "@/components/Screens/Search/Filters";
import Input from "@/components/Screens/Search/Input";
import Toast from "@/components/ui/Toast";
import { auth } from "@/lib/firebase";
import { useSearchStore } from "@/store/filterStore";
import { addFavoriteAnime } from "@/utils/firebase/userFavorites";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Keyboard, StyleSheet, Text, View } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SFSymbols6_0 } from "sf-symbols-typescript";
import { useShallow } from "zustand/shallow";

const { width, height } = Dimensions.get("screen");

export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    // const bottomTabHeight = useBottomTabBarHeight();

    const [showFilters, setShowFilters] = useState(false);

    const ref = useRef<FlashListRef<any>>(null);

    const [showToast, setShowToast] = useState({
        show: false,
        text: '',
        color: 'white',
        iconName: '' as SFSymbols6_0,
    });

    const { colors, locations } = easeGradient({
        colorStops: {
            0: { color: 'black' },
            0.5: { color: 'rgba(0,0,0,0.9)' },
            1: { color: 'transparent' }
        },
    });

    const {
        query,
        results,
        isLoading,
        fetchResults,
        reset,
        apply,
    } = useSearchStore(useShallow(s => ({
        query: s.query,
        results: s.results,
        isLoading: s.isLoading,
        fetchResults: s.fetchResults,
        reset: s.reset,
        apply: s.apply,
    })))

    useEffect(() => {
        console.log(query)
        if (!query || query.length === 0) {
            return
        }
        // if (!query) {
        //     reset(); // очищаем результаты только при очистке query
        //     return;
        // }

        const handler = setTimeout(() => {
            reset();
            fetchResults(true); // true = старт с первой страницы
        }, 800);

        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => { fetchResults() }, [])

    const handleEndReached = () => {
        fetchResults(false);
    };

    const handleApplyFilters = () => {
        setShowFilters(false);
        apply();
        fetchResults(true);
        ref.current?.scrollToOffset({ offset: 0, animated: true });
    };

    const renderItem = ({ item, index }: any) => (
        <View style={{ paddingVertical: 5 }}>
            <ContextMenu
                triggerItem={<AnimeItem item={item} index={index} />}
                items={[{
                    title: "Добавить в избранное", iconColor: 'red', iconName: 'heart.fill', iconScale: 'medium',
                    onSelect: async () => {
                        auth.currentUser &&
                            await addFavoriteAnime(auth.currentUser?.uid, { id: item.malId, title: item.russian, poster: item.poster.main2xUrl, status: '', watched: false })
                                .then(() => setShowToast({ show: true, text: `Аниме добавлено в избранное`, iconName: 'checkmark', color: 'green' }))
                                .catch(() => setShowToast({ show: true, text: `Аниме уже в избранном`, iconName: 'xmark', color: 'red' }))
                    },
                }]}
            />
        </View>
    );

    return (
        <View style={{
            flex: 1,
            backgroundColor: "#1b1919"
        }}>
            <View style={{ top: insets.top }}>
                <Toast show={showToast.show}
                    text={showToast.text}
                    iconSize={18}
                    iconColor={showToast.color}
                    iconName={showToast.iconName}
                    setShow={() => setShowToast({ show: false, text: '', iconName: '' as SFSymbols6_0, color: '' })}
                />
            </View>

            <LinearGradient
                colors={["black", "rgba(0,0,0,0.5)", "rgba(0,0,0,0)"]}
                style={[StyleSheet.absoluteFill, { width: "100%", height: insets.top * 3, zIndex: 200 }]}
            />
            <GradientBlur
                containerStyle={{
                    position: 'absolute',
                    top: 0,
                    zIndex: 2, width, height: insets.top * 3.2,
                }}
                locations={locations as [number, number, ...number[]]}
                colors={colors as [string, string, ...string[]]}
                tint="regular"
                blurIntensity={50}
            />

            <Input onOpenFilter={setShowFilters} />

            {!isLoading && !results.length && (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        zIndex: 100,
                    }}
                >
                    <LinearGradient
                        colors={["#ff7e5f", "#feb47b", "#86a8e7", "#91eac9"]}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <ActivityIndicator size="large" color="#fff" />
                    </LinearGradient>
                    <Text style={{ color: "#fff", marginTop: 18, fontSize: 18, fontWeight: "600" }}>
                        Поиск аниме...
                    </Text>
                </View>
            )}

            <FlashList
                ref={ref}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 10, paddingTop: insets.top + 80, 
                    // paddingBottom: bottomTabHeight + 30 
                }}
                scrollIndicatorInsets={{ top: 65 }}
                data={results}
                keyExtractor={(item: any) => `anime-${item.id}`}
                renderItem={renderItem}
                onScroll={() => Keyboard.dismiss()}
                scrollEventThrottle={16}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.86}
                ListFooterComponent={
                    isLoading ?
                        <ActivityIndicator size="small" color="#fff" />
                        : null
                }
                ListEmptyComponent={!isLoading ? (<EmptyPlaceholder />) : null}
            />

            <ModalFilter
                setShowFilters={setShowFilters}
                showFilters={showFilters}
                handleApplyFilters={handleApplyFilters}
            />
        </View>
    );
}
