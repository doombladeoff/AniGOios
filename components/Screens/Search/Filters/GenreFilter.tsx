import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { AnimeGenre, useSearchStore } from "@/store/filterStore";
import * as Haptics from 'expo-haptics';
import { AnimationSpec } from "expo-symbols";
import React from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

type ItemProps = {
    item: { key: AnimeGenre; label: string };
};

export const GenreOptions = [
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
const itemWidth = (screenWidth - 40) / 2; // 40px — примерный padding

const animationButtons = {
    'check': {
        effect: {
            type: 'bounce',
            direction: 'down',
        },
        speed: 10,
    } as AnimationSpec,
}

const GenreFilter = () => {
    console.log("Render GenreFilter");
    const genres = useSearchStore(state => state.genres);
    const toggleGenre = useSearchStore(state => state.toggleGenre);

    return (
        <View>
            <Text style={{ fontSize: 18, color: "white", fontWeight: "600", marginBottom: 8 }}>Жанр</Text>
            <FlatList
                scrollEnabled={false}
                data={GenreOptions}
                keyExtractor={(item) => `genre-${item.key}`}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 8 }}
                contentContainerStyle={{ gap: 5 }}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => { toggleGenre(item.key); Haptics.selectionAsync(); }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: itemWidth,
                            paddingVertical: 8,
                            borderRadius: 12,
                            // backgroundColor: genres.includes(item.key.toString()) ? "rgba(255,255,255,0.08)" : "transparent",
                        }}
                    >
                        <IconSymbol
                            name={genres.includes(item.key.toString()) ? "checkmark.square.fill" : "square"}
                            size={26}
                            color="white"
                            animationSpec={animationButtons['check']}
                        />
                        <Text style={{ color: "white", marginLeft: 8, flexShrink: 1 }}>{item.label}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
};

export default GenreFilter;
