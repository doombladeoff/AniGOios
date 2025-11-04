import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { useAnimeStore } from "@/store/animeStore";
import { isLiquidGlassSupported, LiquidGlassView } from "@callstack/liquid-glass";
import { memo, useMemo } from "react";
import { View } from "react-native";
import { SFSymbols6_0 } from "sf-symbols-typescript";

interface NextEpisodeInfoProps {
    id: number;
    icon?: SFSymbols6_0;
    iconSize?: number;
}

const NextEpisodeInfo = ({ id, icon = "clock.fill", iconSize = 26 }: NextEpisodeInfoProps) => {
    const nextEpisodeAt = useAnimeStore(s => s.animeMap[id]?.nextEpisodeAt);
    const isDarkMode = useTheme().theme === 'dark';

    if (!nextEpisodeAt) return null;

    const dateLabel = useMemo(() => {
        const nextDate = new Date(nextEpisodeAt);
        const today = new Date();
        nextDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffDays = Math.round((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return `${nextDate.toLocaleDateString('ru-RU')} (сегодня)`;
        return `${nextDate.toLocaleDateString('ru-RU')} (через ${diffDays} д${diffDays === 1 ? 'ень' : diffDays < 5 ? 'ня' : 'ней'})`;
    }, [nextEpisodeAt]);

    return (
        <LiquidGlassView
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 18,
                borderWidth: 1,
                ...(!isLiquidGlassSupported && { backgroundColor: isDarkMode ? 'black' : 'white' }),
                borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                shadowColor: isDarkMode ? "#000" : "#000",
                shadowOpacity: 0.15,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },
                marginHorizontal: 10
            }}
            tintColor={isDarkMode ? "dark" : "light"}
            effect={'clear'}
        >
            <IconSymbol
                name={icon}
                size={iconSize}
                color={isDarkMode ? "#B5B5FF" : "#6C63FF"}
            />
            <View style={{ flex: 1 }}>
                <ThemedText
                    lightColor="#222"
                    darkColor="#EEE"
                    style={{
                        fontSize: 14,
                        fontWeight: "600",
                        marginBottom: 2,
                    }}
                >
                    Следующий эпизод выйдет:
                </ThemedText>
                <ThemedText
                    lightColor="#444"
                    darkColor="#CCC"
                    style={{
                        fontSize: 13,
                        fontWeight: "400",
                    }}
                >
                    {dateLabel}
                </ThemedText>
            </View>
        </LiquidGlassView>
    );
};

export default memo(NextEpisodeInfo);
