import { AnimeRatingEnum } from "@/API/Shikimori/Shikimori.types"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { View } from "react-native"
import { RatingBadge } from "./RatingBadge"

export const Censored = ({ isCensored, rating }: { isCensored: boolean; rating: AnimeRatingEnum }) => {
    return (
        <ThemedView
            darkColor="rgba(20, 20, 20, 1)"
            lightColor="rgba(228, 228, 228, 1)"
            style={{
                marginTop: 25,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 16,
                padding: 14,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <IconSymbol
                    name={isCensored ? "eye.slash.fill" : "eye.fill"}
                    size={22}
                    color={isCensored ? "#ff4d4d" : "#4cd964"}
                />
                <ThemedText style={{ fontSize: 17, fontWeight: "600" }}>
                    {isCensored ? "Цензурировано" : "Без цензуры"}
                </ThemedText>
            </View>

            {rating && <RatingBadge rating={rating} />}
        </ThemedView>
    )
}