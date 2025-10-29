import { Genre } from "@/API/Shikimori/Shikimori.types";
import { LiquidGlassView as GlassView } from '@callstack/liquid-glass';
import { router } from "expo-router";
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";

interface GenreItemProps {
    item: Genre;
    listStyle?: StyleProp<ViewStyle>;
    genreStyle?: StyleProp<ViewStyle>;
    genreTextStyle?: StyleProp<TextStyle>;
    disableNavigation?: boolean;
    tintColor?: string;
}
export const GenreItem = (props: GenreItemProps) => {
    return (
        <Pressable
            disabled={props.disableNavigation}
            onPress={() => router.push({
                pathname: '/(screens)/anime/animeByGenre',
                params: { genre_id: props.item.id, genre_name: props.item.russian }
            })}
        >
            <GlassView effect={'clear'} tintColor={props.tintColor} style={props.genreStyle}>
                <Text style={props.genreTextStyle}>{props.item.russian}</Text>
            </GlassView>
        </Pressable>
    )
}