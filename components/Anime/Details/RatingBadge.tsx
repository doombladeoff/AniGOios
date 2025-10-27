import { AnimeRatingEnum } from "@/API/Shikimori/Shikimori.types";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { View } from "react-native";


export const RatingBadge = ({ rating }: { rating: AnimeRatingEnum }) => {
    const isDarkMode = useTheme().theme === 'dark';

    const map: Record<string, { label: string; color: string }> = {
        g: { label: "Все", color: "#4cd964" },
        pg: { label: "10+", color: "#34c759" },
        pg_13: { label: "13+", color: "#ffcc00" },
        r: { label: "16+", color: "#ff9500" },
        r_plus: { label: "17+", color: "#ff3b30" },
        rx: { label: "18+", color: "#d42f2f" },
    };

    const item = map[rating.toLowerCase()] || {
        label: "?",
        color: "#999",
    };

    return (
        <View
            style={{
                backgroundColor: item.color + (isDarkMode ? "30" : '20'),
                borderColor: item.color,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 3,
                minWidth: 45,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <ThemedText
                style={{
                    color: item.color,
                    fontWeight: "700",
                    fontSize: 14,
                }}
            >
                {item.label}
            </ThemedText>
        </View>
    );
};
