import GenreFilter from "@/components/Screens/Search/Filters/GenreFilter";
import KindFilter from "@/components/Screens/Search/Filters/KindFilter";
import SortFilter from "@/components/Screens/Search/Filters/SortFilter";
import YearFilter from "@/components/Screens/Search/Filters/YearFilter";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/hooks/ThemeContext";
import { useSearchStore } from "@/store/filterStore";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useHeaderHeight } from "@react-navigation/elements";
import { BlurView } from "expo-blur";
import * as Haptics from 'expo-haptics';
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet } from "react-native";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShallow } from "zustand/shallow";

export default function ModalFilter() {
    const isDarkMode = useTheme().theme === 'dark';

    const insets = useSafeAreaInsets();
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const {
        fetchResults,
        apply,
        resetFilter
    } = useSearchStore(useShallow(s => ({
        fetchResults: s.fetchResults,
        apply: s.apply,
        resetFilter: s.resetFilter

    })));

    const handleApplyFilters = () => {
        apply();
        fetchResults(true);
        router.back();
    };

    return (
        <ThemedView darkColor="black" lightColor="white" style={{ flex: 1 }}>
            <Stack.Screen options={{
                headerTitle: 'Фильтр',
                headerTransparent: true,
                headerBlurEffect: isDarkMode ? 'dark' : 'systemChromeMaterialLight',
                headerTitleStyle: { color: isDarkMode ? 'white' : 'black' },
                headerLeft: () => (
                    <Pressable onPress={resetFilter} style={{ flexDirection: 'row', gap: 4 }}>
                        <ThemedText style={{ color: 'red', fontSize: 16 }}>Сбросить</ThemedText>
                    </Pressable>
                ),
                headerRight: () => {
                    if (Platform.Version >= '26.0') {
                        return (
                            <Pressable onPress={handleApplyFilters} style={{ width: 30, height: 30, marginTop: 5 }}>
                                <IconSymbol name='checkmark' size={24} color={'white'} style={{ marginLeft: 5 }} />
                            </Pressable>
                        );
                    }
                    return (
                        <Pressable hitSlop={20} onPress={handleApplyFilters}>
                            <ThemedText style={{ color: '#007AFF', fontSize: 16 }}>Применить</ThemedText>
                        </Pressable>
                    );
                }
            }} />

            <BlurView
                tint={isDarkMode ? 'dark' : 'systemChromeMaterialLight'}
                intensity={100}
                style={[StyleSheet.absoluteFillObject, { top: useHeaderHeight() }]} />

            <ScrollView contentContainerStyle={{ flex: 1, paddingTop: useHeaderHeight() + 20, paddingHorizontal: 15, gap: 20, paddingBottom: insets.bottom }}>
                <SegmentedControl
                    values={['Основные', 'Жанры']}
                    selectedIndex={selectedIndex}
                    onChange={(event) => {
                        setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                        Haptics.selectionAsync();
                    }}
                    tintColor="white"
                    activeFontStyle={{ color: isDarkMode ? 'black' : 'whit' }}
                    fontStyle={{ color: isDarkMode ? 'white' : 'black' }}
                    style={{ alignSelf: 'center', width: '95%' }}
                />
                {selectedIndex === 0 && (
                    <Animated.View entering={FadeInLeft} style={{ gap: 20 }}>
                        <SortFilter />
                        <KindFilter />
                        <ThemedText style={{ fontSize: 18, fontWeight: "600" }}>Год</ThemedText>
                        <YearFilter />
                    </Animated.View>
                )}
                {selectedIndex === 1 && (
                    <Animated.View entering={FadeInRight}>
                        <GenreFilter />
                    </Animated.View>
                )}
            </ScrollView>
        </ThemedView>
    )
}