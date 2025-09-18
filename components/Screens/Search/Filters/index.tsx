import { useSearchStore } from "@/store/filterStore";
import { Host, Picker } from "@expo/ui/swift-ui";
import { padding } from "@expo/ui/swift-ui/modifiers";
import * as Haptics from 'expo-haptics';
import { useState } from "react";
import { Button, KeyboardAvoidingView, Modal, Text, View } from "react-native";
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
    const { resetFilter } = useSearchStore(useShallow(s => ({
        resetFilter: s.resetFilter
    })))

    const insets = useSafeAreaInsets();
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    return (
        <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowFilters(false)} backdropColor={"#1b1919"}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, paddingHorizontal: 15 }}>
                <Button title="Сбросить" color="red" onPress={resetFilter} />
                <Button title="Готово" onPress={handleApplyFilters} />
            </View>
            <Host matchContents>
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
            </Host>

            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={55}>
                <ScrollView contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 15, backgroundColor: "#1b1919", gap: 20, paddingBottom: insets.bottom }}>
                    {selectedIndex === 0 && (
                        <Animated.View entering={FadeInLeft} style={{ gap: 20 }}>
                            <SortFilter />
                            <KindFilter />
                            <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>Год</Text>
                            <YearFilter
                                inputStyle={{
                                    backgroundColor: "rgba(35, 35, 35, 0.4)",
                                    color: "#fff",
                                    padding: 12,
                                    width: 90,
                                    fontSize: 14,
                                    fontWeight: "500",
                                    borderRadius: 12,
                                }}
                                keyboardType="numeric"
                            />
                        </Animated.View>
                    )}
                    {selectedIndex === 1 && (
                        <Animated.View entering={FadeInRight}>
                            <GenreFilter />
                        </Animated.View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    )
}