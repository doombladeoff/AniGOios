import CharacterCard from "@/components/Anime/Details/Characters/CharacterCard";
import { useTheme } from "@/hooks/ThemeContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { BlurView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function CharactersScreen() {
    const isDarkMode = useTheme().theme === 'dark';
    const headerHeight = useHeaderHeight();
    const { charactersShiki } = useLocalSearchParams<{ charactersShiki: string }>();
    const data = JSON.parse(charactersShiki || "[]");

    const renderItem = ({ item }: { item: any }) => (
        <CharacterCard item={item} />
    );

    const BackgroundBlur = () => {
        if (Platform.Version < '26.0') {
            return (
                <BlurView
                    tint={isDarkMode ? 'dark' : 'systemChromeMaterialLight'}
                    intensity={100}
                    style={[StyleSheet.absoluteFillObject, {
                        flex: 1,
                        zIndex: 0,
                        top: headerHeight,
                    }]}
                    pointerEvents='none'
                />
            );
        }
        return null
    };

    return (
        <>
            <BackgroundBlur />
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