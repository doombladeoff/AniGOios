import { ShikimoriAnime } from "@/API/Shikimori/Shikimori.types";
import { ContextMenu } from "@/components/ContextComponent";
import { GradientBlur } from "@/components/GradientBlur";
import AnimeItem from "@/components/Screens/Search/AnimeItem";
import { EmptyPlaceholder } from "@/components/Screens/Search/EmptyPlaceholder";
import Input from "@/components/Screens/Search/Input";
import { ThemedView } from "@/components/ui/ThemedView";
import Toast from "@/components/ui/Toast";
import { useTheme } from "@/hooks/ThemeContext";
import { useBottomHeight } from "@/hooks/useBottomHeight";
import { auth } from "@/lib/firebase";
import { addFavoriteAnime } from "@/lib/firebase/userFavorites";
import { useSearchStore } from "@/store/filterStore";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Keyboard, Platform, StyleSheet, View } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SFSymbols6_0 } from "sf-symbols-typescript";
import { useShallow } from "zustand/shallow";

const { width, height } = Dimensions.get("screen");

export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    const bottomTabHeight = useBottomHeight();
    const isDarkMode = useTheme().theme === 'dark';

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
        if (!query || query.length === 0) {
            reset()
            fetchResults(true);
            return;
        }

        const handler = setTimeout(() => {
            reset();
            fetchResults(true); // true = старт с первой страницы
        }, 800);

        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => { fetchResults() }, [])

    const handleEndReached = () => fetchResults(false);

    const renderItem = useCallback(({ item, index }: { item: ShikimoriAnime; index: number }) => (
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
    ), []);

    return (
        <ThemedView darkColor="black" lightColor="white" style={{ flex: 1 }}>
            {Platform.Version < '26.0' && <BlurView
                tint={isDarkMode ? 'dark' : 'systemChromeMaterialLight'}
                intensity={100}
                style={StyleSheet.absoluteFillObject} />
            }
            <View style={{ top: insets.top }}>
                <Toast
                    show={showToast.show}
                    text={showToast.text}
                    iconSize={18}
                    iconColor={showToast.color}
                    iconName={showToast.iconName}
                    setShow={() => setShowToast({ show: false, text: '', iconName: '' as SFSymbols6_0, color: '' })}
                />
            </View>

            <>
                <LinearGradient
                    colors={isDarkMode ? ["black", "rgba(0,0,0,0.5)", "rgba(0,0,0,0)"] : ["white", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0)"]}
                    style={[StyleSheet.absoluteFill, { width: "100%", height: insets.top * 2.65, zIndex: 200 }]}
                />
                <GradientBlur
                    containerStyle={{
                        position: 'absolute',
                        top: 0,
                        zIndex: 2, width, height: insets.top * 2.65,
                    }}
                    locations={locations as [number, number, ...number[]]}
                    colors={colors as [string, string, ...string[]]}
                    tint="regular"
                    blurIntensity={50}
                />
            </>

            <Input />

            {!isLoading && !results.length && (
                <ThemedView darkColor="black" lightColor="white" style={{ position: 'absolute', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Animated.View entering={FadeIn}>
                        <EmptyPlaceholder />
                    </Animated.View>
                </ThemedView>
            )}

            <FlashList
                ref={ref}
                data={results}
                keyExtractor={(item: ShikimoriAnime) => `anime-${item.malId}`}
                renderItem={renderItem}
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 10,
                    paddingTop: insets.top + 20,
                    paddingBottom: bottomTabHeight,
                }}
                scrollIndicatorInsets={{ top: 65, bottom: bottomTabHeight }}
                onScroll={() => Keyboard.dismiss()}
                scrollEventThrottle={16}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.86}
                contentInsetAdjustmentBehavior='automatic'
                ListFooterComponent={
                    isLoading ?
                        <ActivityIndicator size="small" color="#fff" style={{ height: results.length < 1 ? height : undefined, justifyContent: 'center', alignItems: 'center', top: results.length < 1 ? -150 : undefined }} />
                        : null
                }
            />
        </ThemedView>
    );
}
