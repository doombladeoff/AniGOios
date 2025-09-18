
import { Genre } from "@/API/Shikimori/Shikimori.types";
import { useAnimeStore } from "@/store/animeStore";
import { FlashList } from "@shopify/flash-list";
import { memo } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { GenreItem } from "./GenreItem";

interface GenresListProps {
    id: number;
    genres?: Genre[];
    listStyle?: StyleProp<ViewStyle>;
    genreStyle?: StyleProp<ViewStyle>;
    genreTextStyle?: StyleProp<TextStyle>;
    disableNavigation?: boolean;
}

const GenresList = (props: GenresListProps) => {
    const genres = useAnimeStore(s => s.animeMap[props.id].genres);
    return (
        <FlashList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={props.genres ?? genres}
            contentContainerStyle={props.listStyle}
            renderItem={({ item }) => <GenreItem
                item={item}
                genreStyle={props.genreStyle}
                genreTextStyle={props.genreTextStyle}
                disableNavigation={props.disableNavigation}
            />
            }
        />
    )
};

export default memo(GenresList)