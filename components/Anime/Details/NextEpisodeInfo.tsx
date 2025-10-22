import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { ThemedText } from "@/components/ui/ThemedText";
import { useAnimeStore } from "@/store/animeStore";
import { GlassView } from "expo-glass-effect";
import { memo } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { SFSymbols6_0 } from "sf-symbols-typescript";

interface NextEpisodeInfoProps {
    id: number;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: SFSymbols6_0;
    iconSize?: number
}

const NextEpisodeInfo = (props: NextEpisodeInfoProps) => {
    const nextEpisodeAt = useAnimeStore(s => s.animeMap[props.id].nextEpisodeAt)
    if (!nextEpisodeAt) return null;

    const getDate = () => {
        const nextDate = new Date(nextEpisodeAt);
        const today = new Date();
        nextDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffTime = nextDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
            return `${nextDate.toLocaleDateString('ru-RU')} (сегодня)`;
        }
        return `${nextDate.toLocaleDateString('ru-RU')} (через ${diffDays} д${diffDays === 1 ? 'ень' : diffDays < 5 ? 'ня' : 'ней'})`;
    }


    return (
        <GlassView style={props.style}>
            {props.icon && <IconSymbol name={props.icon} size={props.iconSize || 28} />}
            <View>
                <ThemedText lightColor="black" darkColor="white" style={props.textStyle}>Следующий эпизод выйдет:</ThemedText>
                <ThemedText lightColor="black" darkColor="white" style={props.textStyle}>
                    {nextEpisodeAt ? getDate() : 'Неизвестно'}</ThemedText>
            </View>
        </GlassView>
    )
}

export default memo(NextEpisodeInfo)