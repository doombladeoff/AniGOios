import CharacterCard from "@/components/Anime/Details/Characters/CharacterCard";
import Background from "@/components/ui/Background";
import { useTheme } from "@/hooks/ThemeContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function CharactersScreen() {
    const isDarkMode = useTheme().theme === 'dark';
    const headerHeight = useHeaderHeight();
    const { charactersShiki } = useLocalSearchParams<{ charactersShiki: string }>();
    const data = JSON.parse(charactersShiki || "[]");

    const renderItem = ({ item }: { item: any }) => (
        <CharacterCard item={item} />
    );

    return (
        <>
            <Background />
            <Animated.FlatList
                entering={FadeIn}
                exiting={FadeOut}
                data={data}
                numColumns={3}
                renderItem={renderItem}
                keyExtractor={(item) => item.character.id.toString()}
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior={'automatic'}
                contentContainerStyle={{ paddingTop: 15 }}
            />
        </>
    );
};