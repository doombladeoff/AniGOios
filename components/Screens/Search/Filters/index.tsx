import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { useSearchStore } from "@/store/filterStore";
import { Host, HStack, Picker, Spacer, Button as UIButton, VStack } from "@expo/ui/swift-ui";
import { background, padding } from "@expo/ui/swift-ui/modifiers";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from 'expo-haptics';
import { useState } from "react";
import { Modal, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShallow } from "zustand/shallow";
import GenreFilter from "./GenreFilter";
import KindFilter from "./KindFilter";
import SortFilter from "./SortFilter";
import YearFilter from "./YearFilter";

interface ModalFilterProps {
    showFilters: boolean;
    setShowFilters: (value: boolean) => void;
    handleApplyFilters: () => void;
}
export const ModalFilter = ({ showFilters, setShowFilters, handleApplyFilters }: ModalFilterProps) => {
    const isDarkMode = useTheme().theme === 'dark';
    const { resetFilter } = useSearchStore(useShallow(s => ({
        resetFilter: s.resetFilter
    })))

    const insets = useSafeAreaInsets();
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    return (
        <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowFilters(false)}
            backdropColor={isDarkMode ? "#1b1919" : 'white'}
        >
            <Host style={{ width: useWindowDimensions().width, height: 120, zIndex: 2 }}>
                <VStack alignment='leading' modifiers={[padding({ horizontal: 20, top: 10 }), background("transparent")]}>
                    <HStack>
                        <UIButton color="red" onPress={resetFilter}>
                            Сбросить
                        </UIButton>
                        <Spacer />
                        <UIButton variant={isLiquidGlassAvailable() ? 'glassProminent' : 'default'} onPress={handleApplyFilters}>
                            Готово
                        </UIButton>
                    </HStack>
                    <Picker
                        options={['Основные', 'Жанры']}
                        selectedIndex={selectedIndex}
                        onOptionSelected={({ nativeEvent: { index } }) => {
                            setSelectedIndex(index);
                            Haptics.selectionAsync();
                        }}
                        variant="segmented"
                        modifiers={[padding({ horizontal: 40, vertical: 15 })]}
                    />
                </VStack>
            </Host>
            <ScrollView contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 15, gap: 20, paddingBottom: insets.bottom }}>
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
        </Modal>
    )
}