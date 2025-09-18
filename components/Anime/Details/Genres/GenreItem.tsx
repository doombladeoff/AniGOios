import { Genre } from "@/API/Shikimori/Shikimori.types";
import { router } from "expo-router";
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";

interface GenreItemProps {
    item: Genre;
    listStyle?: StyleProp<ViewStyle>;
    genreStyle?: StyleProp<ViewStyle>;
    genreTextStyle?: StyleProp<TextStyle>;
    disableNavigation?: boolean;
}
export const GenreItem = (props: GenreItemProps) => {
    return (
        <Pressable
            style={props.genreStyle}
            disabled={props.disableNavigation}
            onPress={() => router.push({
                pathname: '/(screens)/(anime)/animeByGenre',
                params: { genre_id: props.item.id, genre_name: props.item.russian }
            })}
        >
            <Text style={props.genreTextStyle}>{props.item.russian}</Text>
        </Pressable>
    )
}