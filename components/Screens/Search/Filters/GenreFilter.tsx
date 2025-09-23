import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { AnimeGenre, useSearchStore } from "@/store/filterStore";
import * as Haptics from 'expo-haptics';
import { AnimationSpec } from "expo-symbols";
import React, { useCallback } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

type GenreT = {
    key: AnimeGenre,
    label: string,
};

export const GenreOptions: GenreT[] = [
    { key: AnimeGenre.AvantGarde, label: "Авангард" },
    { key: AnimeGenre.Gourmet, label: "Гурман" },
    { key: AnimeGenre.Drama, label: "Драма" },
    { key: AnimeGenre.Comedy, label: "Комедия" },
    { key: AnimeGenre.SliceOfLife, label: "Повседневность" },
    { key: AnimeGenre.Adventure, label: "Приключения" },
    { key: AnimeGenre.Romance, label: "Романтика" },
    { key: AnimeGenre.Supernatural, label: "Сверхъестественное" },
    { key: AnimeGenre.Sports, label: "Спорт" },
    { key: AnimeGenre.Mystery, label: "Тайна" },
    { key: AnimeGenre.Suspense, label: "Триллер" },
    { key: AnimeGenre.Horror, label: "Ужасы" },
    { key: AnimeGenre.SciFi, label: "Фантастика" },
    { key: AnimeGenre.Fantasy, label: "Фэнтези" },
    { key: AnimeGenre.Action, label: "Экшен" },
    { key: AnimeGenre.Ecchi, label: "Этти" },
];
const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 40) / 2;

const checkAnimation: AnimationSpec = {
    effect: { type: "bounce", direction: "down" },
    speed: 10,
};

const GenreFilter = () => {
    console.log("Render GenreFilter");
    const genres = useSearchStore(state => state.genres);
    const toggleGenre = useSearchStore(state => state.toggleGenre);

    const handlePress = useCallback((key: AnimeGenre) => {
        toggleGenre(key);
        Haptics.selectionAsync();
    }, [toggleGenre]);

    const renderItem = ({ item }: { item: GenreT }) => {
        return (
            <Pressable
                onPress={() => handlePress(item.key)}
                style={styles.container}
            >
                <IconSymbol
                    name={genres.includes(item.key.toString()) ? "checkmark.square.fill" : "square"}
                    size={26}
                    color="white"
                    animationSpec={checkAnimation}
                />
                <Text style={styles.itemText}>{item.label}</Text>
            </Pressable>
        )
    };

    return (
        <View>
            <Text style={styles.headerText}>Жанр</Text>
            <FlatList
                scrollEnabled={false}
                data={GenreOptions}
                keyExtractor={(item) => `genre-${item.key}`}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 8 }}
                contentContainerStyle={{ gap: 5 }}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerText: {
        fontSize: 18,
        color: "white",
        fontWeight: "600",
        marginBottom: 8
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: itemWidth,
        paddingVertical: 8,
        borderRadius: 12,
    },
    itemText: {
        color: "white",
        marginLeft: 8,
        flexShrink: 1
    }
})

export default GenreFilter;
